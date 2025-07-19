'use client';

import { CheckCircle, Award, Users, Clock, Shield, Star } from 'lucide-react';

export default function About() {
  const stats = [
    { number: '500+', label: 'Happy Customers', icon: Users },
    { number: '4.9', label: 'Average Rating', icon: Star },
    { number: '24/7', label: 'Availability', icon: Clock },
    { number: '100%', label: 'Insured & Bonded', icon: Shield },
  ];

  const values = [
    {
      title: 'Professional Excellence',
      description: 'Our team consists of trained, experienced professionals who take pride in delivering exceptional service quality.',
      icon: Award
    },
    {
      title: 'Reliable Service',
      description: 'We show up on time, every time. Our commitment to reliability has earned us the trust of hundreds of customers.',
      icon: CheckCircle
    },
    {
      title: 'Comprehensive Solutions',
      description: 'From moving to cleaning to handyman services, we provide integrated solutions for all your home and business needs.',
      icon: Shield
    }
  ];

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-green-100/40 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <div className="inline-flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-full mb-8">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            <span className="font-semibold">About MapleFresh</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Your trusted
            <br />
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              service partner
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Serving Brantford and surrounding areas with professional home and business services. 
            We combine expertise, reliability, and exceptional customer service.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div 
                key={index} 
                className={`text-center group animate-fadeInUp ${
                  index === 0 ? 'animate-delay-100' : 
                  index === 1 ? 'animate-delay-200' : 
                  index === 2 ? 'animate-delay-300' : 'animate-delay-400'
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <StatIcon className="h-8 w-8" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const ValueIcon = value.icon;
            return (
              <div 
                key={index} 
                className={`group animate-fadeInUp ${
                  index === 0 ? 'animate-delay-100' : 
                  index === 1 ? 'animate-delay-200' : 'animate-delay-300'
                }`}
              >
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 hover-lift shadow-elegant h-full border border-gray-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ValueIcon className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}