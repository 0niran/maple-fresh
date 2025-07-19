import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/email';
import { z } from 'zod';

const notificationSchema = z.object({
  type: z.enum(['booking_confirmation', 'quote_notification', 'status_update', 'admin_alert']),
  bookingId: z.string().optional(),
  quoteId: z.string().optional(),
  customerEmail: z.string().email().optional(),
  oldStatus: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, bookingId, quoteId, customerEmail, oldStatus } = notificationSchema.parse(body);

    let result;

    switch (type) {
      case 'booking_confirmation':
        if (!bookingId) {
          return NextResponse.json(
            { success: false, error: 'Booking ID required for booking confirmation' },
            { status: 400 }
          );
        }
        
        // Fetch booking details from database
        const { prisma } = await import('@/lib/prisma');
        const booking = await prisma.bookingRequest.findUnique({
          where: { id: bookingId },
          include: { customer: true },
        });

        if (!booking) {
          return NextResponse.json(
            { success: false, error: 'Booking not found' },
            { status: 404 }
          );
        }

        // Transform booking data to match expected types
        const transformedBooking = {
          ...booking,
          services: JSON.parse(booking.services),
          status: booking.status as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled',
          priority: booking.priority as 'low' | 'normal' | 'high' | 'urgent',
          preferredDate: booking.preferredDate.toISOString(),
          createdAt: booking.createdAt.toISOString(),
          updatedAt: booking.updatedAt.toISOString(),
          scheduledAt: booking.scheduledAt?.toISOString() || null,
          completedAt: booking.completedAt?.toISOString() || null,
          quoteId: booking.quoteId || undefined,
          specialRequests: booking.specialRequests || undefined,
          assignedTo: booking.assignedTo || undefined,
          estimatedDuration: booking.estimatedDuration || undefined,
          customer: {
            ...booking.customer,
            createdAt: booking.customer.createdAt.toISOString(),
            updatedAt: booking.customer.updatedAt.toISOString(),
          },
        };

        // Send customer confirmation and admin notification
        const [customerResult, adminResult] = await Promise.all([
          emailService.sendBookingConfirmation(transformedBooking),
          emailService.sendAdminBookingNotification(transformedBooking),
        ]);

        result = { customer: customerResult, admin: adminResult };
        break;

      case 'quote_notification':
        if (!quoteId || !customerEmail) {
          return NextResponse.json(
            { success: false, error: 'Quote ID and customer email required' },
            { status: 400 }
          );
        }

        const { prisma: prismaQuote } = await import('@/lib/prisma');
        const quote = await prismaQuote.quote.findUnique({
          where: { id: quoteId },
        });

        if (!quote) {
          return NextResponse.json(
            { success: false, error: 'Quote not found' },
            { status: 404 }
          );
        }

        // Transform quote data to match expected types
        const transformedQuote = {
          ...quote,
          services: JSON.parse(quote.services),
          status: quote.status as 'draft' | 'sent' | 'accepted' | 'expired',
          createdAt: quote.createdAt.toISOString(),
          updatedAt: quote.updatedAt.toISOString(),
          expiresAt: quote.expiresAt?.toISOString() || undefined,
          customerId: quote.customerId || undefined,
        };

        result = await emailService.sendQuoteNotification(
          transformedQuote,
          customerEmail
        );
        break;

      case 'status_update':
        if (!bookingId || !oldStatus) {
          return NextResponse.json(
            { success: false, error: 'Booking ID and old status required' },
            { status: 400 }
          );
        }

        const { prisma: prismaStatus } = await import('@/lib/prisma');
        const statusBooking = await prismaStatus.bookingRequest.findUnique({
          where: { id: bookingId },
          include: { customer: true },
        });

        if (!statusBooking) {
          return NextResponse.json(
            { success: false, error: 'Booking not found' },
            { status: 404 }
          );
        }

        // Transform status booking data to match expected types
        const transformedStatusBooking = {
          ...statusBooking,
          services: JSON.parse(statusBooking.services),
          status: statusBooking.status as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled',
          priority: statusBooking.priority as 'low' | 'normal' | 'high' | 'urgent',
          preferredDate: statusBooking.preferredDate.toISOString(),
          createdAt: statusBooking.createdAt.toISOString(),
          updatedAt: statusBooking.updatedAt.toISOString(),
          scheduledAt: statusBooking.scheduledAt?.toISOString() || null,
          completedAt: statusBooking.completedAt?.toISOString() || null,
          quoteId: statusBooking.quoteId || undefined,
          specialRequests: statusBooking.specialRequests || undefined,
          assignedTo: statusBooking.assignedTo || undefined,
          estimatedDuration: statusBooking.estimatedDuration || undefined,
          customer: {
            ...statusBooking.customer,
            createdAt: statusBooking.customer.createdAt.toISOString(),
            updatedAt: statusBooking.customer.updatedAt.toISOString(),
          },
        };

        result = await emailService.sendBookingStatusUpdate(
          transformedStatusBooking,
          oldStatus
        );
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid notification type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Notification sent successfully',
    });

  } catch (error) {
    console.error('Notification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Get notification settings/history
export async function GET() {
  try {
    // In a real app, you might store notification history
    return NextResponse.json({
      success: true,
      data: {
        emailEnabled: true,
        smsEnabled: false,
        adminEmail: process.env.ADMIN_EMAIL || 'admin@maplefresh.ca',
        supportedTypes: [
          'booking_confirmation',
          'quote_notification', 
          'status_update',
          'admin_alert'
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notification settings' },
      { status: 500 }
    );
  }
}