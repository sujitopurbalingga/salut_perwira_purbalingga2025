"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase, News } from '@/lib/supabase';

const NewsSection = () => {
  const { data: newsItems, isLoading } = useQuery({
    queryKey: ['news-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      return data as News[];
    }
  });

  const featuredNews = newsItems?.find(item => item.is_published); // Assuming the first published item is featured
  const regularNews = newsItems?.filter(item => item.id !== featuredNews?.id) || [];

  if (isLoading) {
    return (
      <section id="news" className="py-24 bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </section>
    );
  }

  return (
    <section id="news" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Berita Terbaru
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Informasi dan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              Kegiatan Kampus
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan informasi terkini tentang kegiatan akademik, prestasi mahasiswa, dan program kampus
          </p>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <Card className="mb-12 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-video"> {/* Changed h-64 lg:h-auto to aspect-video */}
                <img
                  src={featuredNews.image_url || "https://via.placeholder.com/768x1024"}
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
                    {new Date(featuredNews.published_at || featuredNews.created_at).toLocaleDateString('id-ID')}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {/* Author name is not directly available, using a placeholder */}
                    Admin
                  </div>
                  {/* Read time is not in DB, omitting */}
                  {/* <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {featuredNews.readTime}
                  </div> */}
                </div>
                {/* Category is not in DB, omitting */}
                {/* <Badge variant="secondary" className="mb-4">{featuredNews.category}</Badge> */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {featuredNews.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredNews.excerpt || featuredNews.content.substring(0, 150) + '...'}
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
              <div className="relative aspect-video overflow-hidden"> {/* Changed h-48 to aspect-video */}
                <img
                  src={item.image_url || "https://via.placeholder.com/400"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  {/* Category is not in DB, omitting */}
                  {/* <Badge variant="secondary" className="text-xs">{item.category}</Badge> */}
                  <div className="flex items-center text-xs text-gray-500">
                    {/* Read time is not in DB, omitting */}
                    {/* <Clock className="w-3 h-3 mr-1" />
                    {item.readTime} */}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-3">{new Date(item.published_at || item.created_at).toLocaleDateString('id-ID')}</span>
                  <User className="w-4 h-4 mr-1" />
                  <span>Admin</span> {/* Placeholder for author */}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.excerpt || item.content.substring(0, 150) + '...'}
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