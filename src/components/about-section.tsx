"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Target, Lightbulb } from 'lucide-react';

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Fokus pada Misi",
      description: "Berdedikasi untuk mencapai tujuan pembangunan masyarakat yang berkelanjutan"
    },
    {
      icon: Users,
      title: "Kolaborasi",
      description: "Bekerja sama dengan berbagai pihak untuk menciptakan dampak yang lebih besar"
    },
    {
      icon: Lightbulb,
      title: "Inovasi",
      description: "Terus mengembangkan program-program kreatif dan solutif"
    }
  ];

  const achievements = [
    { metric: "500+", description: "Program berhasil" },
    { metric: "10K+", description: "Masyarakat terbantu" },
    { metric: "50+", description: "Mitra aktif" },
    { metric: "5+", description: "Tahun pengalaman" }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 border-green-200 text-green-700 bg-green-50">
            Tentang Kami
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mitra Setia Pembangunan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
              Masyarakat Wonomulyo
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lembaga yang berdedikasi untuk mendorong pembangunan dan kemajuan masyarakat 
            melalui pendekatan holistik dan berbasis komunitas
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Salut Wonomulyo adalah lembaga yang berdedikasi untuk mendorong pembangunan 
              dan kemajuan masyarakat di wilayah Wonomulyo. Dengan pendekatan yang holistik 
              dan berbasis komunitas, kami berkomitmen untuk menciptakan dampak positif 
              yang berkelanjutan.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Melalui berbagai program inovatif, kami terus berupaya meningkatkan kualitas 
              hidup, memperkuat ekonomi lokal, dan melestarikan nilai-nilai budaya yang 
              menjadi jati diri masyarakat Wonomulyo.
            </p>

            <div className="space-y-4">
              {[
                "Program pemberdayaan UMKM lokal",
                "Pendampingan pendidikan untuk anak-anak",
                "Pelatihan keterampilan untuk pemuda",
                "Pengembangan infrastruktur desa"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg">
              Pelajari Lebih Lanjut
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl rounded-2xl">
              <CardContent className="p-0">
                <img
                  src="https://salutwonomulyo.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-28-at-14.31.18-2.jpeg"
                  alt="About Salut Wonomulyo"
                  className="w-full h-96 object-cover"
                />
              </CardContent>
            </Card>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Masyarakat Terbantu</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => (
            <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pencapaian Kami</h3>
            <p className="text-gray-600">Angka yang berbicara tentang dedikasi kami</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{achievement.metric}</div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;