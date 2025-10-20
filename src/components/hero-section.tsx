"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400"></div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      </div>

      {/* Corner Text Content */}
      <div className="absolute top-16 left-8 md:top-24 md:left-16 z-20 text-white space-y-2 animate-fade-in">
        <p className="text-lg md:text-xl font-medium text-white/90">
          Mau Kuliah di
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
          Universitas <br />
          Terbuka ?
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">
          Daftarnya di SALUT <br />
          PERWIRA PURBALINGGA !
        </h2>
        
        {/* Corner Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            size="lg" 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-full text-sm md:text-base transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            Daftar Sekarang
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white hover:bg-gray-50 text-blue-600 border-white font-bold px-6 py-3 rounded-full text-sm md:text-base transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            <Download className="mr-2 h-4 w-4" />
            Lihat Brosur Dulu
          </Button>
        </div>
      </div>

      {/* Right Content - 3D Character */}
      <div className="relative flex justify-center lg:justify-end items-center w-full">
        <div className="relative animate-float">
          {/* 3D Character Placeholder */}
          <div className="relative">
            <img
              src="https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-1-768x1024.jpeg"
              alt="3D Character"
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain filter drop-shadow-2xl"
            />
            
            {/* Character Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent rounded-full blur-2xl"></div>
          </div>
          
          {/* Cloud Base */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-48 h-16 bg-white rounded-full opacity-90 blur-sm"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-12 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2">Scroll untuk melanjutkan</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;