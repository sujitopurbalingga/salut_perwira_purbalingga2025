"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Award, BookOpen, Target, Globe, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase, AboutContent } from '@/lib/supabase';

const AboutSection = () => {
  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ['about-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about')
        .select('*')
        .single();
      return data as AboutContent;
    }
  });

  // Hardcoded features and stats (as per initial plan, can be made dynamic later if requested)
  const features = [
    {
      icon: GraduationCap,
      title: "Pendidikan Berkualitas",
      description: "Program studi terakreditasi dengan kurikulum modern dan relevan"
    },
    {
      icon: Users,
      title: "Dosen Profesional",
      description: "Tenaga pengajar berpengalaman dan ahli di bidangnya masing-masing"
    },
    {
      icon: Award,
      title: "Prestasi Membanggakan",
      description: "Berbagai prestasi akademik dan non-akademik tingkat nasional"
    },
    {
      icon: BookOpen,
      title: "Fasilitas Lengkap",
      description: "Laboratorium, perpustakaan, dan fasilitas pendukung pembelajaran modern"
    }
  ];

  const stats = [
    { number: "5000+", label: "Mahasiswa Aktif" },
    { number: "50+", label: "Program Studi" },
    { number: "200+", label: "Dosen Profesional" },
    { number: "95%", label: "Tingkat Kelulusan" }
  ];

  if (isLoading) {
    return (
      <section id="about" className="py-24 bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </section>
    );
  }

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Tentang Universitas
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mengapa Memilih
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              {aboutContent?.title || "SALUT PERWIRA PURBALINGGA"}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {aboutContent?.description || "Universitas terkemuka yang berkomitmen untuk memberikan pendidikan berkualitas dan mencetak lulusan yang siap bersaing di era global"}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dynamic About Content (Visi, Misi, Sejarah) */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {aboutContent?.vision && (
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Visi</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{aboutContent.vision}</p>
            </Card>
          )}
          {aboutContent?.mission && (
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Misi</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{aboutContent.mission}</p>
            </Card>
          )}
          {aboutContent?.history && (
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sejarah</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{aboutContent.history}</p>
            </Card>
          )}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Pencapaian Kami</h3>
            <p className="text-blue-100">Angka yang berbicara tentang kualitas kami</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;