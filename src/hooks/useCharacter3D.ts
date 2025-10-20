import { useQuery } from '@tanstack/react-query';
import { supabase, Character3D } from '@/lib/supabase';

export const useCharacter3D = () => {
  return useQuery({
    queryKey: ['active-character-3d'],
    queryFn: async () => {
      // Get landing settings to find active character
      const { data: settings } = await supabase
        .from('landing_settings')
        .select('selected_character_id')
        .single();

      if (!settings?.selected_character_id) {
        return null;
      }

      // Get the active character
      const { data: character } = await supabase
        .from('characters_3d')
        .select('*')
        .eq('id', settings.selected_character_id)
        .single();

      return character as Character3D;
    }
  });
};