"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Users, BookOpen, Award } from 'lucide-react';

const FacultiesSection = () => {
  const faculties = [
    {
      name: "Fakultas Teknik",
      dean: "Prof. Dr. Ir. Budi Santoso, M.T.",
      programs: ["Teknik Informatika", "Teknik Sipil", "Teknik Elektro", "Teknik Mesin"],
      students: "1200+",
      icon: Building,
      color: "blue"
    },
    {
      name: "Fakultas Ekonomi dan Bisnis",
      dean: "Dr. Siti Nurjanah, S.E., M.M.",
      programs: ["Manajemen", "Akuntansi", "Ekonomi Pembangunan"],
      students: "1500+",
      icon: Users,
      color: "green"
    },
    {
      name: "Fakultas Ilmu Sosial dan Politik",
      dean: "Prof. Dr. Ahmad Fauzi, S.Sos., M.Si.",
      programs: ["Ilmu Komunikasi", "Administrasi Publik", "Hubungan Internasional"],
      students: "800+",
      icon: BookOpen,
      color: "purple"
    },
    {
      name: "Fakultas Hukum",
      dean: "Dr. H. Muhammad Rizqi, S.H., M.H.",
      programs: ["Ilmu Hukum"],
      students: "600+",
      icon: Award,
      color: "red"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        gradient: "from-blue-600 to-blue-500"
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200",
        gradient: "from-green-600 to-green-500"
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
        gradient: "from-purple-600 to-purple-500"
      },
      red: {
        bg: "bg-red-100",
        text: "text-red-600",
        border: "border-red-200",
        gradient: "from-red-600 to-red-500"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="faculties" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Fakultas Kami
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fakultas Unggulan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              dengan Program Terbaik
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empat fakultas dengan berbagai program studi yang relevan dan berkualitas
          </p>
        </div>

        {/* Faculties Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {faculties.map((faculty, index) => {
            const colors = getColorClasses(faculty.color);
            return (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group">
                <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <faculty.icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{faculty.name}</h3>
                      <p className="text-gray-600 text-sm">{faculty.dean}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Program Studi:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {faculty.programs.map((program, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className={`w-2 h-2 ${colors.text} rounded-full mr-2`}></div>
                          <span className="text-gray-700">{program}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{faculty.students} Mahasiswa</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className={`${colors.border} ${colors.text} hover:${colors.bg} transition-colors`}
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Tertarik dengan Program Kami?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Dapatkan informasi lengkap tentang program studi, biaya kuliah, dan proses pendaftaran
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full">
                Download Brosur
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 py-3 rounded-full">
                Konsultasi Gratis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacultiesSection;