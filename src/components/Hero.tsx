'use client';

import { CheckCircle, Home, Building2, Wrench, Phone } from 'lucide-react';
import QuoteForm from '@/components/forms/QuoteForm';
import { COMPANY_INFO } from '@/constants';

export default function Hero() {

  const services = [
    { icon: <Home className="h-5 w-5" />, name: 'Moving Services' },
    { icon: <Building2 className="h-5 w-5" />, name: 'Cleaning Services' },
    { icon: <Wrench className="h-5 w-5" />, name: 'Handyman Services' },
  ];

  const features = [
    'Trusted local professionals',
    'Transparent pricing',
    'Bundled service packages',
    'Same-day availability'
  ];

  const handleQuoteSuccess = (quoteId: string) => {
    alert(`Quote saved! Your quote ID is: ${quoteId}`);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-green-600/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-green-500/10 rounded-full mix-blend-screen filter blur-3xl animate-float animate-delay-200"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl animate-float animate-delay-400"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-12">        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Content - Asymmetrical Layout */}
          <div className="lg:col-span-7 space-y-8 animate-fadeInLeft">
            {/* Badge */}
            <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm text-blue-100 px-4 py-2 rounded-full border border-blue-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-semibold">Serving {COMPANY_INFO.location} • Available 24/7</span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Your Trusted
                <br />
                <span className="text-gradient bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  Home & Business
                </span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl">Service Partner</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                Professional moving, cleaning, and handyman services that exceed expectations. 
                <span className="text-white font-semibold">Same-day availability</span> with trusted local experts.
              </p>
            </div>
            
            {/* Primary CTA */}
            <div className="pt-4">
              <a 
                href="#quote"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Get Free Quote
                <CheckCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
            
            {/* Secondary CTAs - Subtle */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 text-sm">
              <a 
                href="#bundles"
                className="text-blue-200 hover:text-white underline underline-offset-4 transition-colors duration-200"
              >
                View service packages
              </a>
              <span className="hidden sm:inline text-blue-300">•</span>
              <a 
                href="tel:+1-519-123-4567"
                className="inline-flex items-center text-blue-200 hover:text-white transition-colors duration-200"
              >
                <Phone className="mr-1 h-4 w-4" />
                Call (519) 123-4567
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-blue-100">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            {/* Services Preview */}
            <div className="flex flex-wrap gap-3">
              {services.map((service, index) => (
                <div key={index} className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 text-white">
                  <div className="text-blue-400 mr-2">{service.icon}</div>
                  <span className="font-medium text-sm">{service.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quote Calculator - Asymmetrical Positioning */}
          <div className="lg:col-span-5 lg:justify-self-end w-full animate-fadeInRight">
            <div id="quote" className="relative">
              {/* Background accent */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-3xl blur-2xl"></div>
              <QuoteForm onSuccess={handleQuoteSuccess} className="relative" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}