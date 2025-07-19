// Core business types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProvider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  services: string[];
  rating: number;
  totalJobs: number;
  isActive: boolean;
  isVerified: boolean;
  backgroundCheck: boolean;
  insurance: boolean;
  serviceAreas: string[];
  workingHours?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  customerId?: string | null;
  services: string[];
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  subtotal: number;
  bundleDiscount: number;
  taxes: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'expired';
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}

export interface BookingRequest {
  id: string;
  customerId: string;
  quoteId?: string | null;
  services: string[];
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  address: string;
  city: string;
  postalCode: string;
  preferredDate: string;
  preferredTime: string;
  specialRequests?: string | null;
  subtotal: number;
  bundleDiscount: number;
  taxes: number;
  total: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string | null;
  estimatedDuration?: number | null;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string | null;
  completedAt?: string | null;
  customer: Customer;
  quote?: Quote;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Quote calculation types
export interface ServiceBreakdown {
  service: string;
  basePrice: number;
  additionalCharges: Array<{
    item: string;
    amount: number;
  }>;
  subtotal: number;
}

export interface QuoteBreakdown {
  serviceBreakdown: ServiceBreakdown[];
  subtotal: number;
  bundleDiscount: number;
  taxes: number;
  total: number;
}

// Form types
export type ServiceType = 'moving' | 'cleaning' | 'handyman';
export type PropertyType = 'apartment' | 'house' | 'condo' | 'office';
export type PreferredTime = 'morning' | 'afternoon' | 'evening' | 'flexible';

// Component prop types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total?: number;
}