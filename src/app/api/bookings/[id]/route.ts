import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  assignedTo: z.string().optional(),
  estimatedDuration: z.number().optional(),
  scheduledAt: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { status, assignedTo, estimatedDuration, scheduledAt } = updateBookingSchema.parse(body);
    
    // Get current booking to check old status
    const currentBooking = await prisma.bookingRequest.findUnique({
      where: { id: resolvedParams.id },
      include: { customer: true },
    });

    if (!currentBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    const oldStatus = currentBooking.status;

    // Update booking
    const updatedBooking = await prisma.bookingRequest.update({
      where: { id: resolvedParams.id },
      data: {
        status,
        assignedTo,
        estimatedDuration,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        updatedAt: new Date(),
        ...(status === 'completed' && { completedAt: new Date() }),
      },
      include: { customer: true },
    });

    // Send status update notification if status changed
    if (oldStatus !== status) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'status_update',
          bookingId: resolvedParams.id,
          oldStatus,
        }),
      }).catch(error => {
        console.error('Failed to send status update notification:', error);
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedBooking,
        services: JSON.parse(updatedBooking.services),
      },
    });

  } catch (error) {
    console.error('Booking update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const booking = await prisma.bookingRequest.findUnique({
      where: { id: resolvedParams.id },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        quote: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...booking,
        services: JSON.parse(booking.services),
      },
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const booking = await prisma.bookingRequest.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    await prisma.bookingRequest.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}