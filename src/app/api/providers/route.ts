import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const providerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  services: z.array(z.string()).min(1, 'At least one service is required'),
  serviceAreas: z.array(z.string()).min(1, 'At least one service area is required'),
  workingHours: z.string().optional(),
  isVerified: z.boolean().default(false),
  backgroundCheck: z.boolean().default(false),
  insurance: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validatedData = providerSchema.parse(body);
    
    // Create service provider
    const provider = await prisma.serviceProvider.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        services: JSON.stringify(validatedData.services),
        serviceAreas: JSON.stringify(validatedData.serviceAreas),
        workingHours: validatedData.workingHours,
        isVerified: validatedData.isVerified,
        backgroundCheck: validatedData.backgroundCheck,
        insurance: validatedData.insurance,
        isActive: true,
        rating: 0,
        totalJobs: 0,
      },
    });
    
    return NextResponse.json({
      success: true,
      provider: {
        ...provider,
        services: JSON.parse(provider.services),
        serviceAreas: JSON.parse(provider.serviceAreas),
      },
    });
  } catch (error) {
    console.error('Provider creation error:', error);
    
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
    const providers = await prisma.serviceProvider.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({
      success: true,
      providers: providers.map(provider => ({
        ...provider,
        services: JSON.parse(provider.services),
        serviceAreas: JSON.parse(provider.serviceAreas),
      })),
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}