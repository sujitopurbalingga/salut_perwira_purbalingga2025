"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase, Service } from '@/lib/supabase';
import { getLucideIcon } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      return data as Service[];
    }
  });

  const getColorClasses = (index: number) => {
    const colors = [
      {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        badge: "bg-blue-600"
      },
      {
        bg: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200",
        badge: "bg-green-600"
      },
      {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
        badge: "bg-purple-600"
      },
      {
        bg: "bg-orange-100",
        text: "text-orange-600",
        border: "border-orange-200",
        badge: "bg-orange-600"
      },
      {
        bg: "bg-red-100",
        text: "text-red-600",
        border: "border-red-200",
        badge: "bg-red-600"
      },
      {
        bg: "bg-yellow-100",
        text: "text-yellow-600",
        border: "border-yellow-200",
        badge: "bg-yellow-600"
      }
    ];
    return colors[index % colors.length];
  };

  const handleViewDetail = (service: Service) => {
    setSelectedService(service);
    setIsDetailDialogOpen(true);
  };

  if (isLoading) {
    return (
      <section id="services" className="py-16 md:py-24 bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </section>
    );
  }

  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Layanan Kami
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Program Pendidikan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              Terlengkap
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Berbagai program pendidikan yang disesuaikan dengan kebutuhan dan minat Anda
          </p>
        </div>

        {/* Services Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {services?.map((service, index) => {
            const colors = getColorClasses(index);
            const IconComponent = getLucideIcon(service.icon_name || '') || LucideIcons.Briefcase;

            return (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg flex flex-col overflow-hidden">
                <CardHeader className="pb-2 pt-3 md:pb-4 md:pt-6 flex-grow">
                  <div className={`w-8 h-8 md:w-12 md:w-16 md:h-16 ${colors.bg} rounded-lg flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {service.image_url ? (
                      <img src={service.image_url} alt={service.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <IconComponent className={`w-4 h-4 md:w-6 md:h-6 md:w-8 md:h-8 ${colors.text}`} />
                    )}
                  </div>
                  <CardTitle className="text-sm md:text-base lg:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-center">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 mt-auto px-3 pb-3 md:px-6 md:pb-6">
                  <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-2 md:mb-4 text-center">
                    {service.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className={`w-full ${colors.border} ${colors.text} hover:${colors.bg} transition-colors text-xs md:text-sm lg:text-base`}
                    onClick={() => handleViewDetail(service)}
                  >
                    Pelajari
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Service Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">{selectedService?.title}</DialogTitle>
            {selectedService?.image_url && (
              <img src={selectedService.image_url} alt={selectedService.title} className="w-full h-48 object-cover rounded-lg mt-4" />
            )}
          </DialogHeader>
          <DialogDescription className="text-gray-700 whitespace-pre-wrap text-base">
            {selectedService?.description}
          </DialogDescription>
          {selectedService?.icon_name && (
            <div className="flex items-center text-sm text-gray-500 mt-4">
              <LucideIcons.Info className="w-4 h-4 mr-2" />
              <span>Icon: {selectedService.icon_name}</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ServicesSection;