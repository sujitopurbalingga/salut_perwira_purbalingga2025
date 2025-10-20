"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, LandingSettings, Character3D } from '@/lib/supabase';

const HeroSection = () => {
  // Fetch current active character
  const { data: landingSettings } = useQuery({
    queryKey: ['landing-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('landing_settings')
        .select('*')
        .single();
      return data as LandingSettings;
    }
  });

  // Fetch active character details
  const { data: activeCharacter } = useQuery({
    queryKey: ['active-character', landingSettings?.selected_character_id],
    queryFn: async () => {
      if (!landingSettings?.selected_character_id) return null;
      const { data } = await supabase
        .from('characters_3d')
        .select('*')
        .eq('id', landingSettings.selected_character_id)
        .single();
      return data as Character3D;
    },
    enabled: !!landingSettings?.selected_character_id
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Selamat Datang di
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Desa Wonomulyo
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Temukan keindahan dan kearifan lokal di desa kami. Mari bersama membangun desa yang lebih baik.
          </p>
          
          {/* 3D Character Display */}
          <div className="flex justify-center mb-8">
            {activeCharacter?.thumbnail_url ? (
              <img 
                src={activeCharacter.thumbnail_url} 
                alt={activeCharacter.name || "3D Character"}
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain filter drop-shadow-2xl"
              />
            ) : (
              <img 
                src="https://salutwonomulyo.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-15-at-10.30.45-1-768x1024.jpeg" 
                alt="3D Character"
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain filter drop-shadow-2xl"
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Jelajahi Desa
            </button>
            <button className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg border border-gray-200">
              Tentang Kami
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `
      }} />
    </section>
  );
};

export default HeroSection;