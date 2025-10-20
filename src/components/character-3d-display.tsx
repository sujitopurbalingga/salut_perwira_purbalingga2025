"use client";

import React from 'react';
import { useCharacter3D } from '@/hooks/useCharacter3D';
import { Loader2, ImageIcon } from 'lucide-react';

interface Character3DDisplayProps {
  className?: string;
}

const Character3DDisplay: React.FC<Character3DDisplayProps> = ({ className = "" }) => {
  const { data: character, isLoading, error } = useCharacter3D();

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Karakter tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {character.thumbnail_url ? (
        <img 
          src={character.thumbnail_url} 
          alt={character.name}
          className="w-full h-full object-contain"
        />
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