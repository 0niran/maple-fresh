'use client';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Check, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const bookingFormSchema = z.object({
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

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      services: ['moving'],
      propertyType: 'house',
      bedrooms: 2,
      bathrooms: 1,
      squareFootage: 1000,
      preferredTime: 'flexible',
      city: 'Brantford',
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      // Calculate pricing based on form data
      const subtotal = data.services.length * 200;
      const bundleDiscount = data.services.length > 1 ? subtotal * 0.1 : 0;
      const taxes = (subtotal - bundleDiscount) * 0.13;
      const total = subtotal - bundleDiscount + taxes;

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          subtotal,
          bundleDiscount,
          taxes,
          total,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBookingId(result.booking.id);
        setIsSubmitted(true);
      } else {
        throw new Error(result.error || 'Failed to submit booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error submitting booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your booking request has been submitted successfully. We&apos;ll contact you within 24 hours to confirm details.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Booking ID</p>
            <p className="font-mono text-lg font-semibold text-gray-900">{bookingId.slice(-8).toUpperCase()}</p>
          </div>
          
          <div className="space-y-3">
            <Link href="/" passHref>
              <Button className="w-full">Return to Home</Button>
            </Link>
            <Link href="/admin" passHref>
              <Button variant="outline" className="w-full">View in Admin Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Fill out the form below to request your services</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    className="w-full"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    className="w-full"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="w-full"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Service Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    {...register('address')}
                    className="w-full"
                  />
                  {errors.address && (
                    <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2 block">
                    City *
                  </Label>
                  <Input
                    id="city"
                    {...register('city')}
                    className="w-full"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700 mb-2 block">
                    Postal Code *
                  </Label>
                  <Input
                    id="postalCode"
                    {...register('postalCode')}
                    className="w-full"
                  />
                  {errors.postalCode && (
                    <p className="text-red-600 text-xs mt-1">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Services Needed</h2>
              <div className="space-y-3">
                {['moving', 'cleaning', 'handyman'].map((service) => (
                  <label
                    key={service}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
                  >
                    <input
                      type="checkbox"
                      value={service}
                      {...register('services')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 font-medium capitalize text-gray-900">{service} Services</span>
                  </label>
                ))}
              </div>
              {errors.services && (
                <p className="text-red-600 text-xs mt-1">{errors.services.message}</p>
              )}
            </div>

            {/* Scheduling */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Scheduling
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="preferredDate" className="text-sm font-medium text-gray-700 mb-2 block">
                    Preferred Date *
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    {...register('preferredDate')}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                  {errors.preferredDate && (
                    <p className="text-red-600 text-xs mt-1">{errors.preferredDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="preferredTime" className="text-sm font-medium text-gray-700 mb-2 block">
                    Preferred Time *
                  </Label>
                  <select
                    id="preferredTime"
                    {...register('preferredTime')}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="morning">Morning (8 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-700 mb-2 block">
                Special Requests or Notes
              </Label>
              <textarea
                id="specialRequests"
                {...register('specialRequests')}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                placeholder="Any special instructions or requirements..."
              />
            </div>

            {/* Submit */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-lg font-semibold"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}