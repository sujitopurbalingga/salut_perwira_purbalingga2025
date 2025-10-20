"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tentang Kami
          </h2>
          <div className="w-20 h-1 bg-green-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Salut Wonomulyo: Mitra Setia Pembangunan Masyarakat
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-justify">
              Salut Wonomulyo adalah lembaga yang berdedikasi untuk mendorong pembangunan 
              dan kemajuan masyarakat di wilayah Wonomulyo. Dengan pendekatan yang holistik 
              dan berbasis komunitas, kami berkomitmen untuk menciptakan dampak positif 
              yang berkelanjutan bagi seluruh lapisan masyarakat.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed text-justify">
              Melalui berbagai program inovatif, kami terus berupaya meningkatkan kualitas 
              hidup, memperkuat ekonomi lokal, dan melestarikan nilai-nilai budaya yang 
              menjadi jati diri masyarakat Wonomulyo.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3">
              Selengkapnya
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 md:order-2">
            <Card className="overflow-hidden shadow-xl rounded-lg">
              <CardContent className="p-0">
                <img
                  src="https://salutwonomulyo.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-28-at-14.31.18-2.jpeg"
                  alt="About Us"
                  className="w-full h-96 object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { number: "500+", label: "Program Terlaksana" },
            { number: "10K+", label: "Masyarakat Terbantu" },
            { number: "50+", label: "Mitra Kerja Sama" },
            { number: "5+", label: "Tahun Pengalaman" }
          ].map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow border-2 border-green-600">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;