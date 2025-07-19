// Simple quote calculator
import { ServiceType, PropertyType, SERVICE_OPTIONS } from './booking-types';

export interface QuoteInput {
  services: ServiceType[];
  propertyType: PropertyType;
  squareFootage: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface QuoteResult {
  subtotal: number;
  taxes: number;
  total: number;
  breakdown: Array<{
    service: string;
    price: number;
  }>;
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  let subtotal = 0;
  const breakdown: Array<{ service: string; price: number }> = [];

  // Calculate base price for each service
  input.services.forEach(serviceType => {
    const serviceOption = SERVICE_OPTIONS.find(s => s.type === serviceType);
    if (serviceOption) {
      let price = serviceOption.basePrice;
      
      // Apply property type multiplier
      switch (input.propertyType) {
        case PropertyType.HOUSE:
          price *= 1.2;
          break;
        case PropertyType.CONDO:
          price *= 1.0;
          break;
        case PropertyType.APARTMENT:
          price *= 0.9;
          break;
        case PropertyType.OFFICE:
          price *= 1.5;
          break;
      }

      // Apply square footage multiplier
      if (input.squareFootage > 2000) {
        price *= 1.3;
      } else if (input.squareFootage > 1000) {
        price *= 1.1;
      }

      subtotal += price;
      breakdown.push({
        service: serviceOption.name,
        price: Math.round(price)
      });
    }
  });

  const taxes = Math.round(subtotal * 0.13); // 13% HST
  const total = subtotal + taxes;

  return {
    subtotal: Math.round(subtotal),
    taxes,
    total: Math.round(total),
    breakdown
  };
}