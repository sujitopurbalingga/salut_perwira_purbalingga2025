"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.green.200),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,theme(colors.blue.200),transparent_50%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Badge */}
        <Badge variant="secondary" className="mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm border-gray-200">
          <Star className="w-4 h-4 mr-2 text-yellow-500" />
          Lembaga Terpercaya Sejak 2019
        </Badge>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Mengabdi untuk
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
            Kemajuan Masyarakat
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Salut Wonomulyo adalah lembaga yang berdedikasi untuk mendorong pembangunan 
          dan kemajuan masyarakat di wilayah Wonomulyo melalui program-program inovatif.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            Jelajahi Program
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-4 rounded-xl">
            <Play className="mr-2 h-5 w-5" />
            Tonton Video
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { number: "500+", label: "Program Terlaksana" },
            { number: "10K+", label: "Masyarakat Terbantu" },
            { number: "50+", label: "Mitra Kerja Sama" },
            { number: "5+", label: "Tahun Pengalaman" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center text-gray-400">
          <span className="text-sm mb-2">Scroll untuk melanjutkan</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;