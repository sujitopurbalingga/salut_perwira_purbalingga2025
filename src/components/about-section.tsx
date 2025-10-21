"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Award, BookOpen, Target, Globe, Loader2, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase, AboutContent } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Stat {
  id: string;
  number: string;
  label: string;
}

interface DetailContent {
  title: string;
  content: string;
  icon: React.ComponentType<any>;
}

const AboutSection = () => {
  const [selectedDetail, setSelectedDetail] = useState<DetailContent | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ['about-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about')
        .select('*')
        .single();
      return data as AboutContent;
    }
  });

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      GraduationCap,
      Users,
      Award,
      BookOpen,
      Target,
      Globe
    };
    return iconMap[iconName] || GraduationCap;
  };

  const getColorClasses = (index: number) => {
    const colors = [
      { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200", badge: "bg-blue-600" },
      { bg: "bg-green-100", text: "text-green-600", border: "border-green-200", badge: "bg-green-600" },
      { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200", badge: "bg-purple-600" },
      { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200", badge: "bg-orange-600" },
      { bg: "bg-red-100", text: "text-red-600", border: "border-red-200", badge: "bg-red-600" },
      { bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-200", badge: "bg-yellow-600" }
    ];
    return colors[index % colors.length];
  };

  const handleViewDetail = (title: string, content: string, icon: React.ComponentType<any>) => {
    setSelectedDetail({ title, content, icon });
    setIsDetailDialogOpen(true);
  };

  if (isLoading) {
    return (
      <section id="about" className="py-16 md:py-24 bg-white flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </section>
    );
  }

  // Use fetched features and stats, or fallback to empty arrays if not available
  const featuresToDisplay = aboutContent?.features || [];
  const statsToDisplay = aboutContent?.stats || [];

  return (
    <section id="about" className="py-16 md:py-24 bg-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Tentang Universitas
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Mengapa Memilih
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              {aboutContent?.title || "SALUT PERWIRA PURBALINGGA"}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {aboutContent?.description || "Universitas terkemuka yang berkomitmen untuk memberikan pendidikan berkualitas dan mencetak lulusan yang siap bersaing di era global"}
          </p>
        </div>

        {/* Features Grid - 2 columns on mobile */}
        {featuresToDisplay.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
            {featuresToDisplay.map((feature, index) => {
              const colors = getColorClasses(index);
              const IconComponent = getIconComponent(feature.icon);
              
              return (
                <Card key={feature.id} className="p-3 md:p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                  <CardContent className="p-0 text-center flex flex-col h-full">
                    <div className={`w-10 h-10 md:w-12 md:w-16 md:h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4`}>
                      <IconComponent className={`w-5 h-5 md:w-6 md:w-8 md:h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-sm md:text-lg lg:text-xl font-bold text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2 flex-grow">
                      {feature.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-auto w-full text-xs md:text-sm"
                      onClick={() => handleViewDetail(feature.title, feature.description, IconComponent)}
                    >
                      Detail
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Dynamic About Content (Visi, Misi, Sejarah) - 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {aboutContent?.vision && (
            <Card className="p-4 md:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              <div className="flex-grow">
                <div className="w-10 h-10 md:w-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 md:mb-6">
                  <Target className="w-5 h-5 md:w-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <h3 className="text-sm md:text-lg lg:text-xl font-semibold mb-2 md:mb-4">Visi</h3>
                <p className="text-gray-600 whitespace-pre-wrap line-clamp-3 mb-2 md:mb-4 text-xs md:text-sm">
                  {aboutContent.vision}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-auto w-full text-xs md:text-sm"
                onClick={() => handleViewDetail("Visi", aboutContent.vision || '', Target)}
              >
                Detail
              </Button>
            </Card>
          )}
          {aboutContent?.mission && (
            <Card className="p-4 md:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              <div className="flex-grow">
                <div className="w-10 h-10 md:w-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3 md:mb-6">
                  <Award className="w-5 h-5 md:w-6 md:w-8 md:h-8 text-purple-600" />
                </div>
                <h3 className="text-sm md:text-lg lg:text-xl font-semibold mb-2 md:mb-4">Misi</h3>
                <p className="text-gray-600 whitespace-pre-wrap line-clamp-3 mb-2 md:mb-4 text-xs md:text-sm">
                  {aboutContent.mission}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-auto w-full text-xs md:text-sm"
                onClick={() => handleViewDetail("Misi", aboutContent.mission || '', Award)}
              >
                Detail
              </Button>
            </Card>
          )}
          {aboutContent?.history && (
            <Card className="p-4 md:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between col-span-2 lg:col-span-1">
              <div className="flex-grow">
                <div className="w-10 h-10 md:w-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 md:mb-6">
                  <Globe className="w-5 h-5 md:w-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <h3 className="text-sm md:text-lg lg:text-xl font-semibold mb-2 md:mb-4">Sejarah</h3>
                <p className="text-gray-600 whitespace-pre-wrap line-clamp-3 mb-2 md:mb-4 text-xs md:text-sm">
                  {aboutContent.history}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-auto w-full text-xs md:text-sm"
                onClick={() => handleViewDetail("Sejarah", aboutContent.history || '', Globe)}
              >
                Detail
              </Button>
            </Card>
          )}
        </div>

        {/* Stats Section */}
        {statsToDisplay.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-4 md:p-8 text-white">
            <div className="text-center mb-4 md:mb-8">
              <h3 className="text-lg md:text-2xl font-bold mb-2">Pencapaian Kami</h3>
              <p className="text-blue-100 text-xs md:text-sm">Angka yang berbicara tentang kualitas kami</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {statsToDisplay.map((stat, index) => (
                <div key={stat.id} className="text-center">
                  <div className="text-xl md:text-2xl lg:text-4xl font-bold mb-1">{stat.number}</div>
                  <div className="text-blue-100 text-xs md:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* General Detail Dialog for Features, Visi, Misi, Sejarah */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              {selectedDetail && React.createElement(selectedDetail.icon, { className: "w-5 h-5 md:w-6 md:h-6 text-blue-600" })}
              <span className="text-lg md:text-xl">{selectedDetail?.title}</span>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-700 whitespace-pre-wrap text-sm md:text-base">
            {selectedDetail?.content}
          </DialogDescription>
          <div className="flex items-center text-sm text-gray-500 mt-4">
            <Info className="w-4 h-4 mr-2" />
            <span>Informasi Lengkap</span>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AboutSection;