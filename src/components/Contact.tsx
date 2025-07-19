import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO } from '@/constants';

export default function Contact() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our team directly',
      value: '(519) 123-4567',
      href: 'tel:+1-519-123-4567',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us your requirements',
      value: 'hello@maplefresh.ca',
      href: 'mailto:hello@maplefresh.ca',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with us online',
      value: 'Start Chat',
      href: '#chat',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 8:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Emergency Services', hours: '24/7 Available' }
  ];

  return (
    <section id="contact" className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/10 rounded-full mix-blend-screen filter blur-3xl animate-float animate-delay-200"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm text-blue-100 px-6 py-3 rounded-full mb-8 border border-blue-400/30">
            <Phone className="h-5 w-5 mr-2 text-blue-400" />
            <span className="font-semibold">Get In Touch</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Ready to get
            <br />
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              started?
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Contact us today for a free quote. Our team is ready to help with all your 
            home and business service needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Methods */}
          <div className="space-y-8 animate-fadeInLeft">
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">How to reach us</h3>
              <div className="space-y-6">
                {contactMethods.map((method, index) => {
                  const MethodIcon = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.href}
                      className="group block"
                    >
                      <div className="flex items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover-lift">
                        <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <MethodIcon className="h-7 w-7 text-white" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {method.title}
                          </h4>
                          <p className="text-blue-200 text-sm mb-1">{method.description}</p>
                          <p className="text-white font-medium">{method.value}</p>
                        </div>
                        <Send className="ml-auto h-5 w-5 text-blue-300 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-blue-400" />
                Business Hours
              </h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="space-y-4">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <span className="text-blue-200 font-medium">{schedule.day}</span>
                      <span className="text-white font-semibold">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="animate-fadeInRight">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 lg:p-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Need immediate assistance?
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Our team is standing by to help with your service needs. 
                  Get a free quote in minutes.
                </p>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm font-semibold">Available Now</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="tel:+1-519-123-4567"
                    className="flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg group"
                  >
                    <Phone className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Call Now
                  </a>
                  <a
                    href="#quote"
                    className="flex items-center justify-center px-6 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 group"
                  >
                    <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Get Quote
                  </a>
                </div>

                <div className="text-center pt-6 border-t border-white/20">
                  <div className="flex items-center justify-center text-blue-200 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="font-medium">Serving {COMPANY_INFO.location}</span>
                  </div>
                  <p className="text-sm text-blue-300">
                    Licensed • Insured • Locally Owned
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}