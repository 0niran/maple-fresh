import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createIntentSchema = z.object({
  bookingId: z.string().optional(),
  quoteId: z.string().optional(),
  customerEmail: z.string().email().optional(),
}).refine(
  (data) => data.bookingId || (data.quoteId && data.customerEmail),
  {
    message: "Either bookingId or (quoteId and customerEmail) must be provided",
    path: ["bookingId"],
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, quoteId, customerEmail } = createIntentSchema.parse(body);

    let result;

    if (bookingId) {
      // Create payment intent for existing booking
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

      result = await PaymentService.createPaymentIntent({
        ...booking,
        services: JSON.parse(booking.services),
      });

      // Update booking with payment intent ID
      if (result.success && result.paymentIntentId) {
        await prisma.bookingRequest.update({
          where: { id: bookingId },
          data: {
            // You might want to add a paymentIntentId field to your schema
            updatedAt: new Date(),
          },
        });
      }
    } else if (quoteId && customerEmail) {
      // Create payment intent for quote
      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
      });

      if (!quote) {
        return NextResponse.json(
          { success: false, error: 'Quote not found' },
          { status: 404 }
        );
      }

      result = await PaymentService.createQuotePaymentIntent(
        {
          ...quote,
          services: JSON.parse(quote.services),
        },
        customerEmail
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create payment intent' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
      },
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}