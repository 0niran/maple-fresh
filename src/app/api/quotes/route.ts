import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { QuoteCalculator } from '@/services/quote-calculator';
import { quoteFormSchema } from '@/types/forms';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validatedData = quoteFormSchema.parse(body);
    
    // Calculate quote
    const quote = QuoteCalculator.calculate(validatedData);
    
    // Store quote in database
    const savedQuote = await prisma.quote.create({
      data: {
        services: JSON.stringify(validatedData.services),
        propertyType: validatedData.propertyType,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        squareFootage: validatedData.squareFootage,
        subtotal: quote.subtotal,
        bundleDiscount: quote.bundleDiscount,
        taxes: quote.taxes,
        total: quote.total,
        status: 'draft',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });
    
    return NextResponse.json({
      success: true,
      data: {
        id: savedQuote.id,
        ...quote,
        expiresAt: savedQuote.expiresAt,
      },
    });
  } catch (error) {
    console.error('Quote creation error:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    
    return NextResponse.json({
      success: true,
      data: quotes.map(quote => ({
        ...quote,
        services: JSON.parse(quote.services),
      })),
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}