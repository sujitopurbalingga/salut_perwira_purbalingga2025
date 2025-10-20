import { useQuery } from '@tanstack/react-query';
import { supabase, Character3D } from '@/lib/supabase';

export const useCharacter3D = () => {
  return useQuery({
    queryKey: ['active-character-3d'],
    queryFn: async () => {
      console.log('Fetching active character 3D...');
      
      // Get landing settings to find active character
      const { data: settings, error: settingsError } = await supabase
        .from('landing_settings')
        .select('selected_character_id')
        .single();

      if (settingsError) {
        console.error('Error fetching landing settings:', settingsError);
        // If no settings found, return null
        if (settingsError.code === 'PGRST116') {
          console.log('No landing settings found');
          return null;
        }
        throw settingsError;
      }

      if (!settings?.selected_character_id) {
        console.log('No active character selected');
        return null;
      }

      console.log('Selected character ID:', settings.selected_character_id);

      // Get the active character
      const { data: character, error: characterError } = await supabase
        .from('characters_3d')
        .select('*')
        .eq('id', settings.selected_character_id)
        .eq('is_active', true) // Double check that it's actually active
        .single();

      if (characterError) {
        console.error('Error fetching character:', characterError);
        // If character not found, return null
        if (characterError.code === 'PGRST116') {
          console.log('Character not found with ID:', settings.selected_character_id);
          return null;
        }
        throw characterError;
      }

      console.log('Fetched character:', character);
      return character as Character3D;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};