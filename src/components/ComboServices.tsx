'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SimpleCustomQuoteForm from '@/components/forms/SimpleCustomQuoteForm';

export default function ComboServices() {
  const [isCustomQuoteOpen, setIsCustomQuoteOpen] = useState(false);
  const combos = [
    {
      title: 'First Day Perfect',
      subtitle: 'Starter Package',
      description: 'Make your new house feel like home from day one. Perfect for condos and smaller homes up to 1,500 sq ft.',
      services: ['Deep Cleaning', '2 Handyman Hours', 'Basic Moving Help'],
      originalPrice: 725,
      comboPrice: 599,
      savings: 126,
      popular: true,
      features: [
        'Every room thoroughly cleaned and sanitized',
        'Fix little issues discovered during walk-through',
        'Up to 2 hours of furniture placement help',
        'Professional inspection of common problem areas'
      ],
      badge: 'Most Popular',
      size: 'Up to 1,500 sq ft'
    },
    {
      title: 'Complete Move-In Solution',
      subtitle: 'Premium Package',
      description: 'The stress-free way to settle into your new home. Ideal for houses 1,500-3,000 sq ft.',
      services: ['Whole-Home Deep Clean', '4 Handyman Hours', 'Full Moving Service'],
      originalPrice: 1250,
      comboPrice: 999,
      savings: 251,
      popular: false,
      features: [
        'Including inside appliances, windows, and baseboards',
        'Handle multiple repairs and installations',
        'Up to 4 hours with 2 professional movers',
        'Help setting up one room of your choice',
        'Same-week service guaranteed'
      ],
      badge: 'Best Value',
      size: '1,500-3,000 sq ft'
    },
    {
      title: 'Luxury Relocation',
      subtitle: 'Executive Package',
      description: 'White-glove service for discriminating homeowners. Perfect for executive homes over 3,000 sq ft.',
      services: ['Premium Deep Clean', '6 Handyman Hours', 'Full-Day Moving'],
      originalPrice: 2025,
      comboPrice: 1599,
      savings: 426,
      popular: false,
      features: [
        'Includes garage, deck/patio, and window exteriors',
        'Comprehensive repairs and customization',
        'Up to 8 hours with professional crew',
        'Complete kitchen & bath setup with unpacking',
        '30-day follow-up with additional 2 hours'
      ],
      badge: 'Premium',
      size: 'Over 3,000 sq ft'
    },
    {
      title: 'Premium Care Membership',
      subtitle: 'Monthly Service',
      description: 'Comprehensive home care for busy professionals with ongoing maintenance.',
      services: ['Bi-Weekly Cleaning', '2 Handyman Hours', 'Emergency Priority'],
      originalPrice: 279,
      comboPrice: 199,
      savings: 80,
      popular: false,
      features: [
        '3 hours bi-weekly professional cleaning',
        '2 handyman hours monthly for maintenance',
        'Same-day response for urgent issues',
        'Annual deep clean ($400 value) included',
        'Member rate $55/hr for additional services'
      ],
      badge: 'Best for Busy Families',
      isSubscription: true,
      size: 'All home sizes'
    }
  ];

  return (
    <section id="bundles" className="py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-32 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-br from-green-200/30 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20 animate-fadeInUp">
          <div className="inline-block bg-gradient-to-r from-green-100 to-blue-100 px-6 py-2 rounded-full mb-6">
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">🎯 Best Value Offers</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-gradient bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Value packages
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Complete home service solutions designed to save you time and money. 
            Choose from move-in packages, ongoing maintenance plans, or custom combinations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>All packages include materials</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Licensed & insured professionals</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>100% satisfaction guarantee</span>
            </div>
          </div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {combos.map((combo, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-3xl p-6 lg:p-8 border transition-all duration-500 hover-lift animate-fadeInUp ${
                combo.popular
                  ? 'border-blue-500 shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-white transform scale-105 lg:scale-110'
                  : 'border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl'
              } ${index === 0 ? 'animate-delay-100' : index === 1 ? 'animate-delay-200' : index === 2 ? 'animate-delay-300' : 'animate-delay-400'}`}
            >
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className={`inline-block px-6 py-2 rounded-full text-sm font-bold shadow-lg ${
                  combo.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                    : combo.badge === 'Best Value'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                      : combo.badge === 'Premium'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                        : 'bg-gradient-to-r from-orange-600 to-orange-700 text-white'
                }`}>
                  {combo.badge}
                </span>
              </div>

              <div className="pt-6">
                {/* Package Type */}
                <div className="text-center mb-6">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 opacity-80">
                    {combo.subtitle}
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {combo.title}
                  </h3>
                  
                  {/* Size indicator */}
                  <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    {combo.size}
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {combo.description}
                  </p>
                </div>

                {/* Services Included */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-800 mb-3 text-center">What&apos;s Included</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {combo.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Key Features */}
                <div className="mb-6">
                  <div className="text-left space-y-2">
                    {combo.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                    {combo.features.length > 4 && (
                      <div className="text-center pt-2">
                        <span className="text-blue-600 font-semibold text-xs bg-blue-50 px-3 py-1 rounded-full">
                          +{combo.features.length - 4} more benefits
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 line-through mb-2">
                      Regular: ${combo.originalPrice}{combo.isSubscription ? '/month' : ''}
                    </div>
                    <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                      ${combo.comboPrice}
                      <span className="text-lg font-medium text-gray-600">
                        {combo.isSubscription ? '/month' : ''}
                      </span>
                    </div>
                    <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
                      Save ${combo.savings}{combo.isSubscription ? '/month' : ''}
                    </div>
                    {combo.isSubscription && (
                      <div className="text-xs text-gray-500 mt-3 leading-relaxed">
                        6-month commitment<br/>Cancel anytime after
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/#quote" className="block">
                    <Button
                      size="lg"
                      className={`w-full group font-bold py-4 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                        combo.popular
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                          : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white'
                      }`}
                    >
                      Get This Package
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-sm font-semibold border-2 hover:bg-gray-50 transition-colors duration-200"
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 lg:mt-20">
          <div className="bg-gradient-to-r from-blue-50 via-white to-green-50 rounded-3xl p-8 lg:p-12 border border-gray-200">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Need something custom?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Can&apos;t find the perfect package? We create personalized combinations 
              tailored to your specific needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsCustomQuoteOpen(true)}
                className="px-8 py-4 font-bold border-2 hover:bg-gray-50 transition-all duration-200"
              >
                Request Custom Quote
              </Button>
              <div className="flex items-center text-gray-500 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Free consultation included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Quote Form Modal */}
      <SimpleCustomQuoteForm 
        isOpen={isCustomQuoteOpen}
        onClose={() => setIsCustomQuoteOpen(false)}
      />
    </section>
  );
}