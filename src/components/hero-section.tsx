"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase, LandingSettings, Character3D } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const HeroSection = () => {
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['landingSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('landing_settings')
        .select('*')
        .single();
      return data as LandingSettings;
    }
  });

  const { data: character, isLoading: isLoadingCharacter } = useQuery({
    queryKey: ['character3D', settings?.selected_character_id],
    queryFn: async () => {
      if (!settings?.selected_character_id) return null;
      const { data } = await supabase
        .from('3d_characters')
        .select('*')
        .eq('id', settings.selected_character_id)
        .single();
      return data as Character3D;
    },
    enabled: !!settings?.selected_character_id,
  });

  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroTitle = settings?.hero_title || "Selamat Datang di SALUT PERWIRA PURBALINGGA";
  const heroSubtitle = settings?.hero_subtitle || "Pendidikan Berkualitas untuk Masa Depan Gemilang";

  if (isLoadingSettings || isLoadingCharacter) {
    return (
      <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <Loader2 className="h-10 w-10 animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between relative z-10">
        {/* Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-lg mx-auto lg:mx-0 opacity-90">
            {heroSubtitle}
          </p>
          <div className="flex justify-center lg:justify-start space-x-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={handleScrollToContact} // Added onClick handler
            >
              Daftar Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>

        {/* 3D Character */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          {character?.model_url ? (
            <model-viewer
              src={character.model_url}
              alt={character.name}
              ar
              ar-modes="webxr scene-viewer quick-look"
              shadow-intensity="1"
              camera-controls
              auto-rotate
              rotation-per-second="30deg"
              interaction-prompt="none"
              className="w-full max-w-md h-96 lg:h-[500px] xl:h-[600px]"
            ></model-viewer>
          ) : (
            <div className="w-full max-w-md h-96 lg:h-[500px] xl:h-[600px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No 3D character selected or available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;