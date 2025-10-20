"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';

const NewsSection = () => {
  const newsItems = [
    {
      id: 1,
      title: "Peluncuran Program Pemberdayaan UMKM Digital",
      date: "15 November 2024",
      author: "Admin Salut",
      summary: "Salut Wonomulyo meluncurkan program baru untuk membantu UMKM lokal go digital dengan pelatihan dan pendampingan intensif.",
      image: "https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-1-768x1024.jpeg"
    },
    {
      id: 2,
      title: "Workshop Kewirausahaan untuk Pemuda",
      date: "10 November 2024",
      author: "Tim Pengembangan",
      summary: "Ratusan pemuda Wonomulyo mengikuti workshop kewirausahaan untuk meningkatkan skill dan membuka peluang usaha baru.",
      image: "https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-3-768x1024.jpeg"
    },
    {
      id: 3,
      title: "Kolaborasi dengan Pemerintah Daerah",
      date: "5 November 2024",
      author: "Humas Salut",
      summary: "Penandatanganan MoU dengan Pemerintah Daerah untuk percepatan pembangunan infrastruktur desa di Wonomulyo.",
      image: "https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-2-768x1024.jpeg"
    }
  ];

  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Berita Terbaru
          </h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Dapatkan informasi terkini tentang kegiatan dan program-program kami
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group border-2 border-gray-200 hover:border-green-600">
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-3">{item.date}</span>
                  <User className="w-4 h-4 mr-1" />
                  <span>{item.author}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {item.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3 text-justify">
                  {item.summary}
                </p>
                <Button variant="outline" size="sm" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold">
                  Baca Selengkapnya
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3">
            Lihat Semua Berita
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;