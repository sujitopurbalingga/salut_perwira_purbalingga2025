"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Loader2, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Brochure {
  id: string;
  title: string;
  file_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const BrochureSection = () => {
  // Fetch brochures from database
  const { data: brochures, isLoading } = useQuery({
    queryKey: ['brochures-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('brochure')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      return data as Brochure[];
    }
  });

  const handleDownload = (fileUrl: string, title: string) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title || 'brosur.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (fileUrl: string) => {
    // Open file in new tab for preview
    window.open(fileUrl, '_blank');
  };

  if (isLoading) {
    return (
      <section data-brosur-section className="py-24 bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </section>
    );
  }

  // If no brochures, don't show the section
  if (!brochures || brochures.length === 0) {
    return null;
  }

  return (
    <section data-brosur-section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Brosur
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Download Brosur
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              Informasi Lengkap
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan informasi lengkap tentang program studi, biaya kuliah, dan proses pendaftaran
          </p>
        </div>

        {/* Brochures Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brochures.map((brochure) => (
            <Card key={brochure.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Tersedia
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 mt-4">
                  {brochure.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-16 h-16 text-blue-300" />
                </div>
                <p className="text-sm text-gray-600">
                  Dokumen informasi lengkap tentang pendaftaran dan program studi
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handlePreview(brochure.file_url)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={() => handleDownload(brochure.file_url, brochure.title)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Butuh Informasi Lebih Lanjut?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Hubungi kami langsung atau isi formulir pendaftaran untuk mendapatkan bantuan dari tim kami
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full"
              >
                Daftar Sekarang
              </Button>
              <Button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                variant="outline"
                className="border-white text-blue-600 hover:bg-white hover:text-blue-700 font-bold px-8 py-3 rounded-full"
              >
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrochureSection;