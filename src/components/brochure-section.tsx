"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Loader2, Eye, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Brochure {
  id: string;
  title: string;
  file_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ContactContent {
  id: string;
  phone: string;
}

const BrochureSection = () => {
  // Fetch brochures from database
  const { data: brochures, isLoading: isLoadingBrochures } = useQuery({
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

  // Fetch contact settings for phone number
  const { data: contactSettings, isLoading: isLoadingContact } = useQuery({
    queryKey: ['contact-settings-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('contact_settings')
        .select('phone')
        .maybeSingle();
      return data as ContactContent;
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

  const handleContactViaWhatsApp = () => {
    const phoneNumber = contactSettings?.phone?.replace(/\D/g, ''); // Remove non-digits
    const message = encodeURIComponent("Halo, saya tertarik dengan informasi lebih lanjut mengenai SALUT PERWIRA PURBALINGGA.");
    if (phoneNumber) {
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    } else {
      alert("Nomor WhatsApp tidak tersedia.");
    }
  };

  if (isLoadingBrochures || isLoadingContact) {
    return (
      <section data-brosur-section className="py-16 md:py-24 bg-gray-50 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </section>
    );
  }

  // If no brochures, don't show the section
  if (!brochures || brochures.length === 0) {
    return null;
  }

  return (
    <section data-brosur-section className="py-16 md:py-24 bg-gray-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Brosur
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Download Brosur
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              Informasi Lengkap
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan informasi lengkap tentang program studi, biaya kuliah, dan proses pendaftaran
          </p>
        </div>

        {/* Brochures Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {brochures.map((brochure) => (
            <Card key={brochure.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3 p-3 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 md:w-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 md:w-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Tersedia
                  </Badge>
                </div>
                <CardTitle className="text-sm md:text-lg font-semibold text-gray-900 mt-2 md:mt-4 line-clamp-2">
                  {brochure.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3 pt-0 md:p-6 md:pt-0 md:space-y-4">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {brochure.thumbnail_url ? (
                    <img 
                      src={brochure.thumbnail_url} 
                      alt={brochure.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <FileText className="w-8 h-8 md:w-12 md:w-16 text-blue-300" />
                  )}
                </div>
                <p className="text-xs text-gray-600 hidden md:block">
                  Dokumen informasi lengkap tentang pendaftaran dan program studi
                </p>
                <div className="flex flex-col gap-2 md:flex-row md:gap-3">
                  <Button
                    onClick={() => handlePreview(brochure.file_url)}
                    variant="outline"
                    className="flex-1 text-xs"
                  >
                    <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    onClick={() => handleDownload(brochure.file_url, brochure.title)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                  >
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8 md:mt-12">
          <div className="bg-blue-600 rounded-2xl p-6 md:p-8 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4">Butuh Informasi Lebih Lanjut?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-sm md:text-base">
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
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 md:px-8 py-3 rounded-full text-sm md:text-base"
              >
                Daftar Sekarang
              </Button>
              <Button
                onClick={handleContactViaWhatsApp}
                variant="outline"
                className="border-white text-blue-600 hover:bg-white hover:text-blue-700 font-bold px-6 md:px-8 py-3 rounded-full text-sm md:text-base"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
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