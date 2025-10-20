"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { School, Briefcase, Globe, Users, BookOpen, Award } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: School,
      title: "Program Sarjana (S1)",
      description: "Berbagai program studi sarjana dengan kurikulum terkini",
      features: ["Teknik Informatika", "Manajemen", "Akuntansi", "Ilmu Komunikasi"],
      color: "blue"
    },
    {
      icon: Briefcase,
      title: "Program Pascasarjana (S2)",
      description: "Program magister untuk pengembangan karir profesional",
      features: ["Magister Manajemen", "Magister Teknik", "Magister Hukum"],
      color: "green"
    },
    {
      icon: Globe,
      title: "Program Internasional",
      description: "Kerja sama dengan universitas luar negeri",
      features: ["Student Exchange", "Double Degree", "International Class"],
      color: "purple"
    },
    {
      icon: Users,
      title: "Program Ekstensi",
      description: "Program pendidikan lanjutan untuk profesional",
      features: ["Ekstensi Manajemen", "Ekstensi Akuntansi"],
      color: "orange"
    },
    {
      icon: BookOpen,
      title: "Program Vokasi",
      description: "Pendidikan vokasi untuk kesiapan kerja",
      features: ["D3 Teknik", "D3 Bisnis", "D3 Kesehatan"],
      color: "red"
    },
    {
      icon: Award,
      title: "Program Beasiswa",
      description: "Berbagai beasiswa untuk mahasiswa berprestasi",
      features: ["Beasiswa Prestasi", "Beasiswa Ekonomi", "Beasiswa Atlet"],
      color: "yellow"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        badge: "bg-blue-600"
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200",
        badge: "bg-green-600"
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
        badge: "bg-purple-600"
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-600",
        border: "border-orange-200",
        badge: "bg-orange-600"
      },
      red: {
        bg: "bg-red-100",
        text: "text-red-600",
        border: "border-red-200",
        badge: "bg-red-600"
      },
      yellow: {
        bg: "bg-yellow-100",
        text: "text-yellow-600",
        border: "border-yellow-200",
        badge: "bg-yellow-600"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Layanan Kami
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Program Pendidikan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              Terlengkap
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Berbagai program pendidikan yang disesuaikan dengan kebutuhan dan minat Anda
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const colors = getColorClasses(service.color);
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600">{service.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 ${colors.badge} rounded-full mr-2`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className={`w-full ${colors.border} ${colors.text} hover:${colors.bg} transition-colors`}>
                    Pelajari Lebih Lanjut
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;