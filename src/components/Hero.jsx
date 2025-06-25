import React from 'react';
import { Heart, Shield, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
          Your Medical Notes,
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> Simplified</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
          Transform complex medical consultations into clear, easy-to-understand summaries. 
          Perfect for patients and healthcare providers alike.
        </p>

        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-12 animate-fade-in">
          <div className="flex items-center space-x-2 text-gray-600">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">HIPAA Compliant</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">Patient First</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Trusted by 10,000+ Users</span>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
