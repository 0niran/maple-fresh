import { QuoteBreakdown, ServiceBreakdown } from '@/types';
import { QuoteFormData } from '@/types/forms';
import { PRICING } from '@/constants';

export class QuoteCalculator {
  static calculate(data: QuoteFormData): QuoteBreakdown {
    const serviceBreakdown: ServiceBreakdown[] = [];
    let subtotal = 0;

    // Calculate each service
    data.services.forEach(serviceType => {
      const breakdown = this.calculateService(serviceType, data);
      serviceBreakdown.push(breakdown);
      subtotal += breakdown.subtotal;
    });

    // Calculate bundle discount
    const bundleDiscount = data.services.length > 1 
      ? subtotal * PRICING.BUNDLE_DISCOUNT_RATE 
      : 0;

    // Calculate taxes
    const taxableAmount = subtotal - bundleDiscount;
    const taxes = taxableAmount * PRICING.TAX_RATE;

    // Calculate total
    const total = taxableAmount + taxes;

    return {
      serviceBreakdown,
      subtotal,
      bundleDiscount,
      taxes,
      total,
    };
  }

  private static calculateService(
    serviceType: string,
    data: QuoteFormData
  ): ServiceBreakdown {
    let basePrice = 0;
    const additionalCharges: Array<{ item: string; amount: number }> = [];

    switch (serviceType) {
      case 'moving':
        // Calculate moving based on estimated hours and crew size
        const crewSize = PRICING.MOVING_RATES.typical_crew_size;
        const estimatedHours = this.estimateMovingHours(data);
        const hourlyRate = (PRICING.MOVING_RATES.hourly_per_mover.min + PRICING.MOVING_RATES.hourly_per_mover.max) / 2;
        
        basePrice = hourlyRate * crewSize * estimatedHours;
        
        additionalCharges.push({
          item: `${crewSize} movers × ${estimatedHours}h`,
          amount: 0, // Already included in base
        });
        
        additionalCharges.push({
          item: 'Truck & Equipment',
          amount: PRICING.TRUCK_FEE,
        });
        break;

      case 'cleaning':
        // Calculate cleaning based on property specifications
        basePrice = this.calculateCleaningPrice(data);
        
        // Add room-based charges
        if (data.bedrooms > 2) {
          const bedroomCharge = (data.bedrooms - 2) * PRICING.ROOM_RATES.bedroom;
          additionalCharges.push({
            item: `+${data.bedrooms - 2} extra bedrooms`,
            amount: bedroomCharge,
          });
        }

        if (data.bathrooms > 2) {
          const bathroomCharge = (data.bathrooms - 2) * PRICING.ROOM_RATES.bathroom;
          additionalCharges.push({
            item: `+${data.bathrooms - 2} extra bathrooms`,
            amount: bathroomCharge,
          });
        }
        
        // Square footage adjustment
        if (data.squareFootage > 2000) {
          const sqftCharge = (data.squareFootage - 2000) * 0.05;
          additionalCharges.push({
            item: 'Large property (>2000 sqft)',
            amount: sqftCharge,
          });
        }
        break;

      case 'handyman':
        // Base hourly rate with minimum
        const handymanHourlyRate = (PRICING.HANDYMAN_RATES.general_hourly.min + PRICING.HANDYMAN_RATES.general_hourly.max) / 2;
        const minimumHours = PRICING.HANDYMAN_RATES.minimum_hours;
        
        basePrice = handymanHourlyRate * minimumHours;
        
        additionalCharges.push({
          item: `${minimumHours}h minimum`,
          amount: 0, // Already included in base
        });
        
        // Commercial property modifier
        if (data.propertyType === 'office') {
          const commercialFee = basePrice * 0.2;
          additionalCharges.push({
            item: 'Commercial property fee',
            amount: commercialFee,
          });
        }
        break;
    }

    const totalAdditional = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const subtotal = basePrice + totalAdditional;

    return {
      service: this.getServiceDisplayName(serviceType),
      basePrice,
      additionalCharges,
      subtotal,
    };
  }
  
  private static estimateMovingHours(data: QuoteFormData): number {
    // Estimate moving hours based on property size
    const baseHours = data.propertyType === 'apartment' ? 3 : 
                     data.squareFootage < 1500 ? 4 :
                     data.squareFootage < 2500 ? 6 : 8;
    
    // Adjust for number of rooms
    const roomAdjustment = (data.bedrooms - 1) * 0.5;
    
    return Math.max(2, baseHours + roomAdjustment); // Minimum 2 hours
  }
  
  private static calculateCleaningPrice(data: QuoteFormData): number {
    // Calculate based on property type and size
    if (data.propertyType === 'condo' || data.propertyType === 'apartment') {
      if (data.bedrooms === 1) {
        return (PRICING.CLEANING_RATES['1bed_1bath_condo'].min + PRICING.CLEANING_RATES['1bed_1bath_condo'].max) / 2;
      } else if (data.bedrooms === 2) {
        return (PRICING.CLEANING_RATES['2bed_2bath_condo'].min + PRICING.CLEANING_RATES['2bed_2bath_condo'].max) / 2;
      } else {
        return (PRICING.CLEANING_RATES['3bed_3bath_condo'].min + PRICING.CLEANING_RATES['3bed_3bath_condo'].max) / 2;
      }
    } else {
      // House pricing based on square footage
      if (data.squareFootage < 1500) {
        return (PRICING.CLEANING_RATES['1500sqft_home'].min + PRICING.CLEANING_RATES['1500sqft_home'].max) / 2;
      } else if (data.squareFootage < 2500) {
        return (PRICING.CLEANING_RATES['2000_2500sqft_home'].min + PRICING.CLEANING_RATES['2000_2500sqft_home'].max) / 2;
      } else {
        return (PRICING.CLEANING_RATES['2500_3000sqft_home'].min + PRICING.CLEANING_RATES['2500_3000sqft_home'].max) / 2;
      }
    }
  }

  private static getServiceDisplayName(serviceType: string): string {
    const names: Record<string, string> = {
      moving: 'Moving Service',
      cleaning: 'Cleaning Service',
      handyman: 'Handyman Service',
    };
    return names[serviceType] || serviceType;
  }
}

// Legacy export for backward compatibility
export const calculateQuote = (data: QuoteFormData): QuoteBreakdown => {
  return QuoteCalculator.calculate(data);
};