import { z } from 'zod';
import { ServiceType, PropertyType, PreferredTime } from './index';

// Quote form schema and types
export const quoteFormSchema = z.object({
  services: z.array(z.enum(['moving', 'cleaning', 'handyman'])).min(1, 'At least one service is required'),
  propertyType: z.enum(['apartment', 'house', 'condo', 'office'], {
    required_error: 'Property type is required',
  }),
  bedrooms: z.number().min(1, 'Number of bedrooms is required'),
  bathrooms: z.number().min(1, 'Number of bathrooms is required'),
  squareFootage: z.number().min(100, 'Square footage is required'),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;

// Booking form schema and types
export const bookingFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(6, 'Valid postal code is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.enum(['morning', 'afternoon', 'evening', 'flexible']),
  specialRequests: z.string().optional(),
  services: z.array(z.string()).min(1, 'Select at least one service'),
  propertyType: z.string().min(1, 'Property type is required'),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  squareFootage: z.number().min(100),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

// Provider form schema and types
export const providerFormSchema = z.object({
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

export type ProviderFormData = z.infer<typeof providerFormSchema>;