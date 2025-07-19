'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ArrowLeft, Check, Home, Sparkles, Wrench, Calculator, MapPin, Users, Bath, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuoteFormData, quoteFormSchema } from '@/types/forms';
import { useQuote } from '@/hooks/useQuote';
import { useAsyncOperation } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import { SERVICES, PROPERTY_TYPES } from '@/constants';

interface QuoteFormProps {
  onSuccess?: (quoteId: string) => void;
  className?: string;
}

const steps = [
  { id: 1, title: 'Services', icon: Calculator, description: 'What do you need?' },
  { id: 2, title: 'Property', icon: Home, description: 'Tell us about your space' },
  { id: 3, title: 'Quote', icon: Check, description: 'Get your instant quote' }
];

const serviceIcons = {
  moving: Home,
  cleaning: Sparkles,
  handyman: Wrench
};

export default function QuoteForm({ onSuccess, className = '' }: QuoteFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    mode: 'onChange',
    defaultValues: {
      services: [],
      propertyType: 'house',
      bedrooms: 2,
      bathrooms: 1,
      squareFootage: 1000,
    },
  });

  const watchedFormData = watch();
  const selectedServices = watch('services') || [];
  const { quote, isValidForQuote } = useQuote(watchedFormData);
  const { isLoading, error, execute } = useAsyncOperation();

  const nextStep = async () => {
    let fieldsToValidate: (keyof QuoteFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['services'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['propertyType', 'bedrooms', 'bathrooms', 'squareFootage'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < 3) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const onSubmit = async (data: QuoteFormData) => {
    const result = await execute(() => apiService.createQuote(data));
    
    if (result && result.id) {
      onSuccess?.(result.id);
    }
  };

  const toggleService = (serviceValue: string) => {
    const currentServices = selectedServices || [];
    const newServices = currentServices.includes(serviceValue)
      ? currentServices.filter(s => s !== serviceValue)
      : [...currentServices, serviceValue];
    setValue('services', newServices);
    trigger('services');
  };

  return (
    <div className={`relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 hover:shadow-3xl transition-all duration-500 ${className}`}>
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="text-2xl font-bold text-center">
            <span className="text-gradient">Get Instant Quote</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg scale-110' 
                    : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  <StepIcon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-25"></div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-1 mx-4 transition-all duration-300 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Step Description */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {steps[currentStep - 1]?.title}
          </h3>
          <p className="text-sm text-gray-600">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step Content */}
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          
          {/* Step 1: Services */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="grid grid-cols-1 gap-4">
                {SERVICES.map((service) => {
                  const ServiceIcon = serviceIcons[service.value as keyof typeof serviceIcons];
                  const isSelected = selectedServices.includes(service.value);
                  
                  return (
                    <div
                      key={service.value}
                      onClick={() => toggleService(service.value)}
                      className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover-lift group ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                        }`}>
                          <ServiceIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{service.label}</h4>
                          <p className="text-sm text-gray-600">{service.description || `Professional ${service.label.toLowerCase()} services`}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-600' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.services && (
                <p className="text-red-600 text-sm text-center animate-shake">{errors.services.message}</p>
              )}
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeInUp">
              {/* Property Type */}
              <div>
                <Label className="text-sm font-semibold mb-3 block text-gray-900 flex items-center">
                  <Home className="w-4 h-4 mr-2 text-blue-600" />
                  Property Type *
                </Label>
                <select
                  {...register('propertyType')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-all duration-200"
                >
                  <option value="">Select property type</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.propertyType && (
                  <p className="text-red-600 text-sm mt-2">{errors.propertyType.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Required for accurate pricing calculation</p>
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-3 block text-gray-900 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-green-600" />
                    Bedrooms *
                  </Label>
                  <Input
                    type="number"
                    {...register('bedrooms', { valueAsNumber: true })}
                    min="1"
                    max="10"
                    placeholder="2"
                    className="text-center text-lg h-14 border-2 rounded-xl"
                  />
                  {errors.bedrooms && (
                    <p className="text-red-600 text-xs mt-1">{errors.bedrooms.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-3 block text-gray-900 flex items-center">
                    <Bath className="w-4 h-4 mr-2 text-purple-600" />
                    Bathrooms *
                  </Label>
                  <Input
                    type="number"
                    {...register('bathrooms', { valueAsNumber: true })}
                    min="1"
                    max="10"
                    placeholder="1"
                    className="text-center text-lg h-14 border-2 rounded-xl"
                  />
                  {errors.bathrooms && (
                    <p className="text-red-600 text-xs mt-1">{errors.bathrooms.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-3 block text-gray-900 flex items-center">
                    <Square className="w-4 h-4 mr-2 text-orange-600" />
                    Square Feet *
                  </Label>
                  <Input
                    type="number"
                    {...register('squareFootage', { valueAsNumber: true })}
                    min="100"
                    max="10000"
                    step="50"
                    placeholder="1000"
                    className="text-center text-lg h-14 border-2 rounded-xl"
                  />
                  {errors.squareFootage && (
                    <p className="text-red-600 text-xs mt-1">{errors.squareFootage.message}</p>
                  )}
                </div>
              </div>
              
              {/* Additional Information Box */}
              {selectedServices.includes('moving') && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Moving Details
                  </h5>
                  <p className="text-sm text-blue-700 mb-3">
                    For accurate moving quotes, we&apos;ll contact you to discuss origin/destination, inventory details, and any special items.
                  </p>
                  <div className="text-xs text-blue-600">
                    • Local moves: Hourly rate based on crew size
                    • Property size automatically factored into estimate
                    • Special items (pianos, antiques) priced separately
                  </div>
                </div>
              )}
              
              {selectedServices.includes('handyman') && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h5 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <Wrench className="w-4 h-4 mr-2" />
                    Handyman Services
                  </h5>
                  <p className="text-sm text-purple-700 mb-2">
                    This estimate covers general handyman tasks. Specialized work may require additional assessment.
                  </p>
                  <div className="text-xs text-purple-600">
                    • Minimum 1-hour service fee applies
                    • Common tasks: TV mounting, furniture assembly, minor repairs
                    • Specialized trades (electrical, plumbing) quoted separately
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Quote Display */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeInUp">
              {quote ? (
                <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Your Instant Quote</h4>
                    <p className="text-gray-600">Professional services tailored to your needs</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {quote.serviceBreakdown.map((service, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                        <span className="text-gray-700 font-medium flex items-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          {service.service}
                        </span>
                        <span className="font-bold text-gray-900 text-lg">${service.subtotal.toFixed(0)}</span>
                      </div>
                    ))}
                    
                    {quote.bundleDiscount > 0 && (
                      <div className="flex justify-between items-center p-4 bg-green-100 rounded-xl border border-green-200">
                        <span className="text-green-700 font-semibold flex items-center">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                          Bundle Savings
                        </span>
                        <span className="font-bold text-green-700 text-lg">-${quote.bundleDiscount.toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-blue-300 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-gray-900">Total Estimate</span>
                      <span className="text-3xl font-bold text-blue-600">${quote.total.toFixed(0)}</span>
                    </div>
                    
                    {/* Transparent Pricing Information */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                      <h6 className="font-semibold text-yellow-800 mb-2">💡 Pricing Transparency</h6>
                      <div className="text-xs text-yellow-700 space-y-1">
                        <p>• All estimates include HST (13%)</p>
                        <p>• Additional charges may apply for: excessive dirt/clutter, complex access, premium materials</p>
                        {selectedServices.includes('moving') && (
                          <p>• Moving: Final rate depends on actual time, distance, and inventory complexity</p>
                        )}
                        {selectedServices.includes('cleaning') && (
                          <p>• Cleaning: Deep cleaning or heavily soiled areas may incur additional charges</p>
                        )}
                        {selectedServices.includes('handyman') && (
                          <p>• Handyman: Specialized tools or materials charged separately</p>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 text-center font-medium">
                      📞 Final quote confirmed after on-site assessment • All pricing transparent and itemized
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 text-center">
                  <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Configure your services to see the quote</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 transition-all duration-200 ${
              currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={currentStep === 1 && selectedServices.length === 0}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading || !isValidForQuote}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? 'Saving...' : 'Save Quote'}
              <Check className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}