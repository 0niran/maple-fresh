import { ArrowRight, Home, Sparkles, Wrench, Clock, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Services() {
  const services = [
    {
      title: 'Moving',
      description: 'Professional residential and commercial moving services with care and efficiency.',
      price: 'From $120/hr',
      icon: <Home className="h-8 w-8" />,
      features: ['Professional team', 'Insured & bonded', 'Same-day service'],
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Cleaning',
      description: 'Deep cleaning, maintenance, and move-in/out services that sparkle.',
      price: 'From $150',
      icon: <Sparkles className="h-8 w-8" />,
      features: ['Eco-friendly products', 'Detail-oriented', 'Flexible scheduling'],
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Handyman',
      description: 'Home repairs, installations, and maintenance work done right.',
      price: 'From $75/hr',
      icon: <Wrench className="h-8 w-8" />,
      features: ['Licensed professionals', 'Quality guarantee', 'Emergency repairs'],
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section id="services" className="py-32 bg-white relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-green-100/50 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Three services,
            <br />
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              one platform
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional services that work together seamlessly. Book multiple services and 
            <span className="font-semibold text-gray-900"> save up to 20%</span> with our integrated packages.
          </p>
        </div>

        {/* Broken Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Moving Service - Large Card */}
          <div className="lg:col-span-7 group">
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 lg:p-12 hover-lift shadow-elegant animate-fadeInUp h-full">
              <div className="absolute top-8 right-8 w-24 h-24 bg-blue-200/50 rounded-full blur-xl"></div>
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Home className="h-10 w-10" />
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors">
                  Moving Services
                </h3>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Professional residential and commercial moving services with care and efficiency. 
                  Our experienced team handles everything from packing to setup.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {services[0].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-blue-200">
                  <span className="text-2xl font-bold text-gray-900">{services[0].price}</span>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105 transition-all duration-300">
                    Get Quote
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Cleaning & Handyman - Stacked Cards */}
          <div className="lg:col-span-5 space-y-8">
            {/* Cleaning Service */}
            <div className="group">
              <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 hover-lift shadow-elegant animate-fadeInUp animate-delay-200">
                <div className="absolute top-6 right-6 w-16 h-16 bg-green-200/50 rounded-full blur-lg"></div>
                
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                    Cleaning Services
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Deep cleaning and maintenance services that make your space sparkle.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{services[1].price}</span>
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 group-hover:translate-x-1 transition-transform">
                      Learn more →
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Handyman Service */}
            <div className="group">
              <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 hover-lift shadow-elegant animate-fadeInUp animate-delay-300">
                <div className="absolute top-6 right-6 w-16 h-16 bg-purple-200/50 rounded-full blur-lg"></div>
                
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Wrench className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                    Handyman Services
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Professional repairs, installations, and maintenance work done right.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{services[2].price}</span>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 group-hover:translate-x-1 transition-transform">
                      Learn more →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle CTA */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden animate-fadeInUp animate-delay-400">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 border border-white/20 rounded-full"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-4 left-1/2 w-24 h-24 border border-white/20 rounded-full"></div>
          </div>
          
          <div className="relative">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm font-semibold">Limited Time Offer</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Save more with service bundles
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Combine moving + cleaning + handyman services and save up to 20%. 
              Perfect for complete home transitions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="secondary" size="lg" className="group bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8">
                Get bundle quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="text-blue-200 text-sm">
                <span className="font-semibold">🎯 Most Popular:</span> Move + Clean combo
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}