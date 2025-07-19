import { Phone, Mail, MapPin, Star, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white py-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-48 h-48 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border border-white/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fadeInUp">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="text-3xl font-bold text-gradient mb-2">MapleFresh</div>
              <div className="text-blue-400 font-semibold text-sm tracking-wide">Home & Business Services</div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Your trusted partner for moving, cleaning, and handyman services in Brantford. 
              Professional, reliable, and committed to excellence.
            </p>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-3">
                <Shield className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-sm text-gray-300">Licensed & Insured</span>
              </div>
              <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-3">
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-sm text-gray-300">4.9★ Rating</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                  <Phone className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <a 
                    href="tel:+1-519-123-4567"
                    className="text-gray-300 hover:text-white transition-colors font-medium"
                  >
                    (519) 123-4567
                  </a>
                </div>
              </div>
              
              <div className="flex items-center group">
                <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-lg mr-3 group-hover:bg-green-500/30 transition-colors">
                  <Mail className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <a 
                    href="mailto:hello@maplefresh.ca"
                    className="text-gray-300 hover:text-white transition-colors font-medium"
                  >
                    hello@maplefresh.ca
                  </a>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-colors">
                  <MapPin className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <span className="text-gray-300 font-medium">Brantford, Ontario</span>
                </div>
              </div>

            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Our Services</h4>
            <div className="space-y-3">
              <div className="flex items-center group cursor-pointer">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                <span className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Moving Services</span>
              </div>
              <div className="flex items-center group cursor-pointer">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                <span className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Cleaning Services</span>
              </div>
              <div className="flex items-center group cursor-pointer">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                <span className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Handyman Services</span>
              </div>
              <div className="flex items-center group cursor-pointer">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                <span className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Service Bundles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 MapleFresh. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 text-sm text-gray-400">
              <span>Professional home and business services in Brantford, Ontario</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}