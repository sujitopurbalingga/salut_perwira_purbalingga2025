"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ZoomIn } from 'lucide-react';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      id: 1,
      src: "https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-1-768x1024.jpeg",
      alt: "Kegiatan Pelatihan"
    },
    {
      id: 2,
      src: "https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-2-768x1024.jpeg",
      alt: "Rapat Koordinasi"
    },
    {
      id: 3,
      src: "https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-3-768x1024.jpeg",
      alt: "Bakti Sosial"
    },
    {
      id: 4,
      src: "https://salutwonomulyo.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-28-at-14.31.18-1.jpeg",
      alt: "Seminar Nasional"
    },
    {
      id: 5,
      src: "https://salutwonomulyo.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-28-at-14.31.18-2.jpeg",
      alt: "Workshop Digital"
    },
    {
      id: 6,
      src: "https://salutwonomulyo.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-28-at-14.31.18-3.jpeg",
      alt: "Kunjungan Kerja"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Galeri Foto
          </h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Dokumentasi kegiatan dan momen berharga bersama masyarakat
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image) => (
            <Card key={image.id} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-green-600">
              <CardContent className="p-0 relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(image.src)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3">
            Lihat Semua Foto
          </Button>
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Gallery Image"
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;