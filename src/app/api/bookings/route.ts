import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bookingRequestSchema = z.object({
  quoteId: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  services: z.array(z.string()).min(1, 'At least one service is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  bedrooms: z.number().min(1, 'Number of bedrooms is required'),
  bathrooms: z.number().min(1, 'Number of bathrooms is required'),
  squareFootage: z.number().min(100, 'Square footage is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  specialRequests: z.string().optional(),
  subtotal: z.number().min(0),
  bundleDiscount: z.number().min(0),
  taxes: z.number().min(0),
  total: z.number().min(0),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validatedData = bookingRequestSchema.parse(body);
    
    // Create or find customer
    let customer = await prisma.customer.findUnique({
      where: { email: validatedData.email },
    });
    
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
        },
      });
    }
    
    // Create booking request
    const booking = await prisma.bookingRequest.create({
      data: {
        customerId: customer.id,
        quoteId: validatedData.quoteId || null,
        services: JSON.stringify(validatedData.services),
        propertyType: validatedData.propertyType,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        squareFootage: validatedData.squareFootage,
        address: validatedData.address,
        city: validatedData.city,
        postalCode: validatedData.postalCode,
        preferredDate: new Date(validatedData.preferredDate),
        preferredTime: validatedData.preferredTime,
        specialRequests: validatedData.specialRequests,
        subtotal: validatedData.subtotal,
        bundleDiscount: validatedData.bundleDiscount,
        taxes: validatedData.taxes,
        total: validatedData.total,
        status: 'pending',
        priority: 'normal',
      },
    });

    // Send confirmation notifications (don't wait for completion)
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'booking_confirmation',
        bookingId: booking.id,
      }),
    }).catch(error => {
      console.error('Failed to send booking notification:', error);
    });
    
    return NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error('Booking submission error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await prisma.bookingRequest.findMany({
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    
    return NextResponse.json({
      success: true,
      bookings: bookings.map(booking => ({
        ...booking,
        services: JSON.parse(booking.services),
      })),
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}