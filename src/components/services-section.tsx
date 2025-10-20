"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react'; // Keep Loader2 as it's used directly
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons for fallback
import { useQuery } from '@tanstack/react-query';
import { supabase, Service } from '@/lib/supabase';
import { getLucideIcon } from '@/lib/utils'; // Import the new utility function

const ServicesSection = () => {
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

  if (isLoading) {
    return (
      <section id="services" className="py-24 bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </section>
    );
  }

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Layanan Kami
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Program Pendidikan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              Terlengkap
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Berbagai program pendidikan yang disesuaikan dengan kebutuhan dan minat Anda
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service, index) => {
            const colors = getColorClasses(index);
            // Use the utility function to get the icon component
            const IconComponent = getLucideIcon(service.icon_name || '') || LucideIcons.Briefcase; // Fallback to Briefcase

            return (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {service.image_url ? (
                      <img src={service.image_url} alt={service.title} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <IconComponent className={`w-8 h-8 ${colors.text}`} />
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600">{service.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" className={`w-full ${colors.border} ${colors.text} hover:${colors.bg} transition-colors`}>
                    Pelajari Lebih Lanjut
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;