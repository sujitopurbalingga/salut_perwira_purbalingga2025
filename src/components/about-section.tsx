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
          <div className="w-20 h-1 bg-blue-900 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Salut Wonomulyo: Mitra Setia Pembangunan Masyarakat
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Salut Wonomulyo adalah lembaga yang berdedikasi untuk mendorong pembangunan 
              dan kemajuan masyarakat di wilayah Wonomulyo. Dengan pendekatan yang holistik 
              dan berbasis komunitas, kami berkomitmen untuk menciptakan dampak positif 
              yang berkelanjutan bagi seluruh lapisan masyarakat.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Melalui berbagai program inovatif, kami terus berupaya meningkatkan kualitas 
              hidup, memperkuat ekonomi lokal, dan melestarikan nilai-nilai budaya yang 
              menjadi jati diri masyarakat Wonomulyo.
            </p>
            <Button className="bg-blue-900 hover:bg-blue-800">
              Selengkapnya
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 md:order-2">
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
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
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-blue-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;