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

        // Send customer confirmation and admin notification
        const [customerResult, adminResult] = await Promise.all([
          emailService.sendBookingConfirmation({
            ...booking,
            services: JSON.parse(booking.services),
          }),
          emailService.sendAdminBookingNotification({
            ...booking,
            services: JSON.parse(booking.services),
          }),
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

        result = await emailService.sendQuoteNotification(
          {
            ...quote,
            services: JSON.parse(quote.services),
          },
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

        result = await emailService.sendBookingStatusUpdate(
          {
            ...statusBooking,
            services: JSON.parse(statusBooking.services),
          },
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
        { success: false, error: 'Invalid request data', details: error.errors },
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