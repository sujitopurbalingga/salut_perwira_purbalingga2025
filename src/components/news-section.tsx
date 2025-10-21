"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowRight, Loader2, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase, News } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const NewsSection = () => {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

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

  const handleReadMore = (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsDetailDialogOpen(true);
  };

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
              <div className="relative h-64 lg:h-auto">
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
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {featuredNews.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredNews.excerpt || featuredNews.content.substring(0, 150) + '...'}
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={() => handleReadMore(featuredNews)}
                >
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
                  src={item.image_url || "https://via.placeholder.com/400"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="mr-3">{new Date(item.published_at || item.created_at).toLocaleDateString('id-ID')}</span>
                    <User className="w-3 h-3 mr-1" />
                    <span>Admin</span> {/* Placeholder for author */}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.excerpt || item.content.substring(0, 150) + '...'}
                </p>
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 font-medium"
                  onClick={() => handleReadMore(item)}
                >
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

      {/* News Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between w-full pr-6">
              <DialogTitle className="text-2xl font-bold text-gray-900 pr-4">
                {selectedNews?.title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDetailDialogOpen(false)}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {selectedNews && new Date(selectedNews.published_at || selectedNews.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                Admin
              </div>
            </div>
          </DialogHeader>
          
          {selectedNews?.image_url && (
            <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-6">
              <img
                src={selectedNews.image_url}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            {selectedNews?.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 italic">
                <p className="text-gray-700">{selectedNews.excerpt}</p>
              </div>
            )}
            
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedNews?.content}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Dipublikasi pada {selectedNews && new Date(selectedNews.published_at || selectedNews.created_at).toLocaleString('id-ID')}
              </p>
              <Button
                onClick={() => setIsDetailDialogOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Tutup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NewsSection;