"use client";

import React, { useEffect } from 'react';
import { useCharacter3D } from '@/hooks/useCharacter3D';
import { Loader2, ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';

interface Character3DDisplayProps {
  className?: string;
}

const Character3DDisplay: React.FC<Character3DDisplayProps> = ({ className = "" }) => {
  const { data: character, isLoading, error, refetch } = useCharacter3D();

  console.log('=== Character3DDisplay Render ===');
  console.log('Data:', character);
  console.log('Is Loading:', isLoading);
  console.log('Error:', error);

  // Force refresh if no character after loading
  useEffect(() => {
    if (!isLoading && !character && !error) {
      console.log('No character data, attempting to refetch...');
      // Try to fetch the most recent character
      const fetchMostRecent = async () => {
        try {
          const { data: recentCharacter } = await supabase
            .from('characters_3d')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (recentCharacter) {
            console.log('Found recent character:', recentCharacter);
            refetch();
          }
        } catch (err) {
          console.log('No active character found');
        }
      };
      
      setTimeout(fetchMostRecent, 1000);
    }
  }, [isLoading, character, error, refetch]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white/80 mx-auto mb-3" />
          <p className="text-white/70 text-sm">Memuat karakter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Character3DDisplay error:', error);
    return (
      <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <p className="text-yellow-400 text-sm mb-3">Error memuat karakter</p>
          <button 
            onClick={() => refetch()} 
            className="text-yellow-300 hover:text-yellow-200 text-xs underline flex items-center mx-auto"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (!character) {
    console.log('No character data - showing placeholder');
    return (
      <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
        <div className="text-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
            <ImageIcon className="w-12 h-12 text-white/50" />
          </div>
          <p className="text-white/50 text-sm">Karakter siap ditampilkan</p>
          <button 
            onClick={() => refetch()} 
            className="mt-2 text-white/30 hover:text-white/50 text-xs underline flex items-center mx-auto"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering character:', character.name);
  console.log('Thumbnail URL:', character.thumbnail_url);

  return (
    <div className={`${className} relative w-full h-full min-h-[200px]`}>
      {character.thumbnail_url ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={character.thumbnail_url} 
            alt={character.name}
            className="w-full h-full object-contain animate-float max-w-[280px] max-h-[280px] md:max-w-[350px] md:max-h-[350px] lg:max-w-[400px] lg:max-h-[400px]"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))',
            }}
            onError={(e) => {
              console.error('Image load error:', e);
              console.error('Failed URL:', character.thumbnail_url);
              // Try to refresh if image fails to load
              setTimeout(() => refetch(), 2000);
            }}
            onLoad={() => {
              console.log('Image loaded successfully');
            }}
          />
          
          {/* Character glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <p className="text-xs text-white/40">
                {character.name} ({character.animation_type})
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-white/60 mx-auto mb-2" />
              <p className="text-white/80 font-medium text-sm">{character.name}</p>
              <p className="text-white/60 text-xs">{character.animation_type}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Character3DDisplay;