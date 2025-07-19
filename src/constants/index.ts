import { ServiceType, PropertyType, PreferredTime } from '@/types';

// Service options
export const SERVICES: Array<{ value: ServiceType; label: string; description?: string; icon?: string }> = [
  { 
    value: 'moving', 
    label: 'Moving Services',
    description: 'Professional residential and commercial moving with care and efficiency'
  },
  { 
    value: 'cleaning', 
    label: 'Cleaning Services',
    description: 'Deep cleaning, maintenance, and move-in/out services that sparkle'
  },
  { 
    value: 'handyman', 
    label: 'Handyman Services',
    description: 'Home repairs, installations, and maintenance work done right'
  },
];

// Property types (aligned with PRD cleaning pricing structure)
export const PROPERTY_TYPES: Array<{ value: PropertyType; label: string; description?: string }> = [
  { value: 'condo', label: 'Condo/Apartment', description: 'Condominiums and apartment units' },
  { value: 'house', label: 'House', description: 'Single-family homes and townhouses' },
  { value: 'office', label: 'Commercial Office', description: 'Business and office spaces' },
  { value: 'apartment', label: 'Studio/Small Apartment', description: 'Studios and small apartment units' },
];

// Time preferences
export const TIME_PREFERENCES: Array<{ value: PreferredTime; label: string }> = [
  { value: 'morning', label: 'Morning (8 AM - 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM - 8 PM)' },
  { value: 'flexible', label: 'Flexible' },
];

// Booking statuses
export const BOOKING_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

// Quote statuses
export const QUOTE_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-800' },
  { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-800' },
  { value: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800' },
];

// Priority levels
export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
];

// Pricing constants based on PRD Section 4.1
export const PRICING = {
  // Base rates per service type
  BASE_RATES: {
    moving: 120, // $120/hour per mover (2-3 movers typical)
    cleaning: 150, // Base rate for 1-2 bed cleaning
    handyman: 75, // $75/hour with 1-hour minimum
  },
  
  // Cleaning rates by property size (from PRD Table)
  CLEANING_RATES: {
    // Condos
    '1bed_1bath_condo': { min: 150, max: 180 },
    '2bed_2bath_condo': { min: 170, max: 210 },
    '3bed_3bath_condo': { min: 190, max: 240 },
    // Houses
    '1500sqft_home': { min: 250, max: 350 },
    '2000_2500sqft_home': { min: 350, max: 450 },
    '2500_3000sqft_home': { min: 400, max: 550 },
    // Deep cleaning
    'deep_small_apt': { min: 180, max: 250 },
    'deep_medium_home': { min: 300, max: 450 },
    'deep_large_home': { min: 450, max: 700 },
    // Move-in/out cleaning
    'moveout_small_apt': { min: 250, max: 350 },
    'moveout_medium_home': { min: 350, max: 500 },
    'moveout_large_home': { min: 500, max: 800 },
  },
  
  // Moving rates
  MOVING_RATES: {
    hourly_per_mover: { min: 100, max: 150 }, // Per mover per hour
    typical_crew_size: 3,
  },
  
  // Handyman rates
  HANDYMAN_RATES: {
    general_hourly: { min: 70, max: 95 },
    minimum_hours: 1,
    specialized_flat_rates: {
      tv_mounting: { min: 150, max: 250 },
      furniture_assembly: { min: 100, max: 200 },
      smart_home_install: { min: 200, max: 500 },
    },
  },
  
  // Bundle pricing (10-20% discount)
  BUNDLE_DISCOUNT_RATE: 0.15, // 15% average discount
  BUNDLE_DISCOUNTS: {
    'move_clean': 0.1, // 10% for Move & Clean
    'move_clean_handyman': 0.2, // 20% for full service
    'clean_handyman': 0.15, // 15% for maintenance package
  },
  
  // Add-on services pricing
  ADDONS: {
    windows_interior: { per_room: { min: 15, max: 25 } },
    inside_appliances: { per_appliance: { min: 35, max: 50 } },
    pet_cleaning: { additional: { min: 25, max: 40 } },
    eco_friendly_products: { additional: { min: 20, max: 30 } },
  },
  
  // System constants
  TAX_RATE: 0.13, // HST in Ontario
  TRUCK_FEE: 75, // Updated truck fee
  
  // Property size multipliers
  ROOM_RATES: {
    bedroom: 25, // Additional per bedroom over base
    bathroom: 30, // Additional per bathroom over base
  },
};

// API endpoints
export const API_ENDPOINTS = {
  QUOTES: '/api/quotes',
  BOOKINGS: '/api/bookings',
  PROVIDERS: '/api/providers',
} as const;

// Navigation items
export const NAV_ITEMS = [
  { name: 'Home', href: '/', icon: 'Home' },
  { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { name: 'Bookings', href: '/book', icon: 'Calendar' },
  { name: 'Providers', href: '/providers', icon: 'Users' },
];

// Company information
export const COMPANY_INFO = {
  name: 'MapleFresh',
  tagline: 'Home & Business Services',
  description: 'Your trusted partner for moving, cleaning, and handyman services in Brantford, Ontario.',
  location: 'Brantford, Ontario',
  email: 'info@maplefresh.ca',
  phone: '(519) 123-4567', // Updated to match Navigation component
  address: '123 Main Street, Brantford, ON N3T 2H4',
  
  // Service areas and capabilities
  service_area: 'Brantford and surrounding areas',
  established: '2024',
  license_info: 'Licensed and insured in Ontario',
};