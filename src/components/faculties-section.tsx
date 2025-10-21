"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase, Faculty } from '@/lib/supabase';
import { getLucideIcon } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const FacultiesSection = () => {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: faculties, isLoading } = useQuery({
    queryKey: ['faculties-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('faculties')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      return data as Faculty[];
    }
  });

  const getColorClasses = (index: number) => {
    const colors = [
      {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        gradient: "from-blue-600 to-blue-500"
      },
      {
        bg: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200",
        gradient: "from-green-600 to-green-500"
      },
      {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
        gradient: "from-purple-600 to-purple-500"
      },
      {
        bg: "bg-red-100",
        text: "text-red-600",
        border: "border-red-200",
        gradient: "from-red-600 to-red-500"
      }
    ];
    return colors[index % colors.length];
  };

  const handleViewDetail = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsDetailDialogOpen(true);
  };

  if (isLoading) {
    return (
      <section id="faculties" className="py-16 md:py-24 bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </section>
    );
  }

  return (
    <section id="faculties" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Fakultas Kami
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Fakultas Unggulan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              dengan Program Terbaik
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Empat fakultas dengan berbagai program studi yang relevan dan berkualitas
          </p>
        </div>

        {/* Faculties Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
          {faculties?.map((faculty, index) => {
            const colors = getColorClasses(index);
            const IconComponent = getLucideIcon(faculty.name || '') || LucideIcons.GraduationCap;

            return (
              <Card key={faculty.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg group flex flex-col">
                <div className={`h-1 bg-gradient-to-r ${colors.gradient}`}></div>
                <CardContent className="p-3 md:p-4 lg:p-8 flex-grow">
                  <div className="flex items-start space-x-2 md:space-x-4 mb-2 md:mb-6">
                    <div className={`w-8 h-8 md:w-10 md:w-12 md:h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      {faculty.image_url ? (
                        <img src={faculty.image_url} alt={faculty.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <IconComponent className={`w-4 h-4 md:w-5 md:w-6 md:h-6 ${colors.text}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-lg lg:text-2xl font-bold text-gray-900 mb-1 truncate">{faculty.name}</h3>
                      {faculty.dean_name && <p className="text-xs md:text-sm text-gray-600 hidden lg:block">{faculty.dean_name}</p>}
                    </div>
                  </div>

                  {faculty.description && (
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-2 md:mb-4">{faculty.description}</p>
                  )}

                  {faculty.programs && faculty.programs.length > 0 && (
                    <div className="mb-2 md:mb-4">
                      <h4 className="font-semibold text-gray-900 text-xs md:text-sm mb-1 md:mb-2">Program:</h4>
                      <div className="space-y-1">
                        {faculty.programs.slice(0, 2).map((program, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className={`w-1 h-1 md:w-1.5 md:h-1.5 ${colors.text} rounded-full mr-1 md:mr-2 flex-shrink-0`}></div>
                            <span className="text-gray-700 text-xs md:text-sm truncate">{program}</span>
                          </div>
                        ))}
                        {faculty.programs.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{faculty.programs.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    {faculty.students_count !== undefined && (
                      <div className="flex items-center space-x-1 hidden sm:flex">
                        <LucideIcons.Users className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{faculty.students_count}</span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${colors.border} ${colors.text} hover:${colors.bg} transition-colors text-xs`}
                      onClick={() => handleViewDetail(faculty)}
                    >
                      Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 md:p-8 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4">Tertarik dengan Program Kami?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Dapatkan informasi lengkap tentang program studi, biaya kuliah, dan proses pendaftaran
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 md:px-8 py-3 rounded-full text-sm md:text-base">
                Download Brosur
              </Button>
              <Button 
                size="lg" 
                className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-6 md:px-8 py-3 rounded-full text-sm md:text-base"
              >
                Konsultasi Gratis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">{selectedFaculty?.name}</DialogTitle>
            {selectedFaculty?.image_url && (
              <img src={selectedFaculty.image_url} alt={selectedFaculty.name} className="w-full h-48 object-cover rounded-lg mt-4" />
            )}
          </DialogHeader>
          <div className="space-y-4 text-gray-700">
            {selectedFaculty?.dean_name && (
              <p><strong>Dekan:</strong> {selectedFaculty.dean_name}</p>
            )}
            {selectedFaculty?.description && (
              <DialogDescription className="whitespace-pre-wrap text-base">
                {selectedFaculty.description}
              </DialogDescription>
            )}
            {selectedFaculty?.programs && selectedFaculty.programs.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Program Studi:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedFaculty.programs.map((program, idx) => (
                    <li key={idx}>{program}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedFaculty?.students_count !== undefined && (
              <p><strong>Jumlah Mahasiswa:</strong> {selectedFaculty.students_count}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FacultiesSection;