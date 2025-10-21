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
      <section id="faculties" className="py-24 bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </section>
    );
  }

  return (
    <section id="faculties" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Fakultas Kami
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fakultas Unggulan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              dengan Program Terbaik
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empat fakultas dengan berbagai program studi yang relevan dan berkualitas
          </p>
        </div>

        {/* Faculties Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {faculties?.map((faculty, index) => {
            const colors = getColorClasses(index);
            const IconComponent = getLucideIcon(faculty.name || '') || LucideIcons.GraduationCap;

            return (
              <Card key={faculty.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group flex flex-col">
                <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
                <CardContent className="p-8 flex-grow">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      {faculty.image_url ? (
                        <img src={faculty.image_url} alt={faculty.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <IconComponent className={`w-6 h-6 ${colors.text}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{faculty.name}</h3>
                      {faculty.dean_name && <p className="text-gray-600 text-sm">{faculty.dean_name}</p>}
                    </div>
                  </div>

                  {faculty.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{faculty.description}</p> // Keep line-clamp for card preview
                  )}

                  {faculty.programs && faculty.programs.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Program Studi:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {faculty.programs.map((program, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className={`w-2 h-2 ${colors.text} rounded-full mr-2`}></div>
                            <span className="text-gray-700">{program}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    {faculty.students_count !== undefined && (
                      <div className="flex items-center space-x-2">
                        <LucideIcons.Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{faculty.students_count} Mahasiswa</span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className={`${colors.border} ${colors.text} hover:${colors.bg} transition-colors`}
                      onClick={() => handleViewDetail(faculty)}
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Tertarik dengan Program Kami?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Dapatkan informasi lengkap tentang program studi, biaya kuliah, dan proses pendaftaran
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full">
                Download Brosur
              </Button>
              <Button 
                size="lg" 
                className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-8 py-3 rounded-full"
              >
                Konsultasi Gratis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedFaculty?.name}</DialogTitle>
            {selectedFaculty?.image_url && (
              <img src={selectedFaculty.image_url} alt={selectedFaculty.name} className="w-full h-48 object-cover rounded-lg mt-4" />
            )}
          </DialogHeader>
          <div className="space-y-4 text-gray-700">
            {selectedFaculty?.dean_name && (
              <p><strong>Dekan:</strong> {selectedFaculty.dean_name}</p>
            )}
            {selectedFaculty?.description && (
              <DialogDescription className="whitespace-pre-wrap">
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