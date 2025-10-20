"use client";

import React from 'react';
import { useCharacter3D } from '@/hooks/useCharacter3D';
import { Loader2, ImageIcon, AlertCircle } from 'lucide-react';

interface Character3DDisplayProps {
  className?: string;
}

const Character3DDisplay: React.FC<Character3DDisplayProps> = ({ className = "" }) => {
  const { data: character, isLoading, error } = useCharacter3D();

  console.log('Character3DDisplay - data:', character);
  console.log('Character3DDisplay - isLoading:', isLoading);
  console.log('Character3DDisplay - error:', error);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Memuat karakter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Character3DDisplay error:', error);
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
          <p className="text-red-500 text-sm">Error memuat karakter</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Karakter Tidak Tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {character.thumbnail_url ? (
        <div className="relative w-full h-full">
          <img 
            src={character.thumbnail_url} 
            alt={character.name}
            className="w-full h-full object-contain animate-float"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
            }}
          />
          {/* Debug info */}
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <p className="text-xs text-gray-400">
              {character.name} ({character.animation_type})
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-indigo-400 mx-auto mb-2" />
            <p className="text-indigo-600 font-medium">{character.name}</p>
            <p className="text-indigo-500 text-sm">{character.animation_type}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Character3DDisplay;