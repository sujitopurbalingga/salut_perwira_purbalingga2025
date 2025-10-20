"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const NewsSection = () => {
  const newsItems = [
    {
      id: 1,
      title: "Peluncuran Program Pemberdayaan UMKM Digital",
      date: "15 November 2024",
      author: "Admin Salut",
      readTime: "5 menit",
      category: "Program",
      summary: "Salut Wonomulyo meluncurkan program baru untuk membantu UMKM lokal go digital dengan pelatihan dan pendampingan intensif.",
      image: "https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-1-768x1024.jpeg",
      featured: true
    },
    {
      id: 2,
      title: "Workshop Kewirausahaan untuk Pemuda",
      date: "10 November 2024",
      author: "Tim Pengembangan",
      readTime: "3 menit",
      category: "Pelatihan",
      summary: "Ratusan pemuda Wonomulyo mengikuti workshop kewirausahaan untuk meningkatkan skill dan membuka peluang usaha baru.",
      image: "https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-3-768x1024.jpeg",
      featured: false
    },
    {
      id: 3,
      title: "Kolaborasi dengan Pemerintah Daerah",
      date: "5 November 2024",
      author: "Humas Salut",
      readTime: "4 menit",
      category: "Kerja Sama",
      summary: "Penandatanganan MoU dengan Pemerintah Daerah untuk percepatan pembangunan infrastruktur desa di Wonomulyo.",
      image: "https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-2-768x1024.jpeg",
      featured: false
    }
  ];

  const featuredNews = newsItems.find(item => item.featured);
  const regularNews = newsItems.filter(item => !item.featured);

  return (
    <section id="news" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 border-blue-200 text-blue-700 bg-blue-50">
            Berita Terbaru
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Informasi dan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              Kegiatan Terkini
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan informasi terkini tentang kegiatan dan program-program kami 
            serta dampak positif yang kami ciptakan untuk masyarakat
          </p>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <Card className="mb-12 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white">Featured</Badge>
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {featuredNews.date}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {featuredNews.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {featuredNews.readTime}
                  </div>
                </div>
                <Badge variant="secondary" className="mb-4">{featuredNews.category}</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {featuredNews.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredNews.summary}
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  Baca Selengkapnya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Regular News Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {regularNews.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.readTime}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-3">{item.date}</span>
                  <User className="w-4 h-4 mr-1" />
                  <span>{item.author}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.summary}
                </p>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 font-medium">
                  Baca Selengkapnya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-xl">
            Lihat Semua Berita
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;