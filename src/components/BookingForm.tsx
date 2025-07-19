'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookingFormData, bookingSchema } from '@/lib/booking-types';
import { calculateQuote, QuoteBreakdown } from '@/lib/quote-calculator';

export default function BookingForm() {
  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange',
  });

  const watchedServices = watch('services') || [];
  const watchedFormData = watch();

  // Calculate quote when form data changes
  useEffect(() => {
    if (Array.isArray(watchedServices) && watchedServices.length > 0) {
      const newQuote = calculateQuote(watchedFormData);
      setQuote(newQuote);
    }
  }, [watchedFormData, watchedServices]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Booking submitted:', data);
      alert('Booking request submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get your instant quote
          </h2>
          <p className="text-xl text-gray-600">
            Tell us what you need, get an instant price.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Services */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">What services do you need?</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['moving', 'cleaning', 'handyman'].map((service) => (
                    <label
                      key={service}
                      className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-200 transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={service}
                        {...register('services')}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 rounded-full mr-3 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                      </div>
                      <span className="font-medium capitalize">{service}</span>
                    </label>
                  ))}
                </div>
                {errors.services && (
                  <p className="text-red-600 text-sm mt-2">{errors.services.message}</p>
                )}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Property Type</Label>
                  <select
                    {...register('propertyType')}
                    className="w-full p-3 border rounded-xl mt-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="office">Office</option>
                  </select>
                  {errors.propertyType && (
                    <p className="text-red-600 text-sm mt-1">{errors.propertyType.message}</p>
                  )}
                </div>

                <div>
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    {...register('bedrooms', { valueAsNumber: true })}
                    min="1"
                    max="10"
                    className="mt-2"
                  />
                  {errors.bedrooms && (
                    <p className="text-red-600 text-sm mt-1">{errors.bedrooms.message}</p>
                  )}
                </div>

                <div>
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    {...register('bathrooms', { valueAsNumber: true })}
                    min="1"
                    max="10"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Square Feet</Label>
                  <Input
                    type="number"
                    {...register('squareFootage', { valueAsNumber: true })}
                    min="100"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Your Name</Label>
                  <Input
                    {...register('firstName')}
                    placeholder="First name"
                    className="mt-2"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <Label>&nbsp;</Label>
                  <Input
                    {...register('lastName')}
                    placeholder="Last name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    {...register('email')}
                    className="mt-2"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    {...register('phone')}
                    placeholder="(519) 123-4567"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full text-lg py-4 group"
              >
                {isSubmitting ? 'Submitting...' : 'Get my quote'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>

          {/* Quote Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Quote</h3>
              
              {quote ? (
                <div className="space-y-4">
                  {quote.serviceBreakdown.map((service, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{service.service}</span>
                      <span className="font-medium">${service.subtotal.toFixed(0)}</span>
                    </div>
                  ))}
                  
                  {quote.bundleDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bundle Savings</span>
                      <span>-${quote.bundleDiscount.toFixed(0)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${quote.total.toFixed(0)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Includes HST</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select services to see pricing</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}