// Booking types and enums
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ServiceType {
  MOVING = 'moving',
  CLEANING = 'cleaning',
  HANDYMAN = 'handyman'
}

export enum PropertyType {
  HOUSE = 'house',
  CONDO = 'condo',
  APARTMENT = 'apartment',
  OFFICE = 'office'
}

export interface ServiceOption {
  id: string;
  name: string;
  type: ServiceType;
  description: string;
  basePrice: number;
  unit: string;
}

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'moving-basic',
    name: 'Basic Moving',
    type: ServiceType.MOVING,
    description: 'Local moving services',
    basePrice: 100,
    unit: 'hour'
  },
  {
    id: 'cleaning-deep',
    name: 'Deep Cleaning',
    type: ServiceType.CLEANING,
    description: 'Comprehensive deep cleaning',
    basePrice: 150,
    unit: 'service'
  },
  {
    id: 'handyman-basic',
    name: 'Basic Handyman',
    type: ServiceType.HANDYMAN,
    description: 'General handyman services',
    basePrice: 75,
    unit: 'hour'
  }
];