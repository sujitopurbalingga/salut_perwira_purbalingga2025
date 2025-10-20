import { useQuery } from '@tanstack/react-query';
import { supabase, Character3D } from '@/lib/supabase';

export const useCharacter3D = () => {
  return useQuery({
    queryKey: ['active-character-3d'],
    queryFn: async () => {
      console.log('=== FETCHING ACTIVE CHARACTER 3D ===');
      
      try {
        // Step 1: Get landing settings
        console.log('Step 1: Fetching landing settings...');
        const { data: settings, error: settingsError } = await supabase
          .from('landing_settings')
          .select('*')
          .single();

        if (settingsError) {
          console.error('Settings error:', settingsError);
          if (settingsError.code === 'PGRST116') {
            console.log('No landing settings found, returning null');
            return null;
          }
          throw settingsError;
        }

        console.log('Landing settings:', settings);

        if (!settings?.selected_character_id) {
          console.log('No selected_character_id in settings');
          return null;
        }

        console.log('Selected character ID:', settings.selected_character_id);

        // Step 2: Get the character
        console.log('Step 2: Fetching character...');
        const { data: character, error: characterError } = await supabase
          .from('characters_3d')
          .select('*')
          .eq('id', settings.selected_character_id)
          .maybeSingle(); // Use maybeSingle to avoid errors if not found

        if (characterError) {
          console.error('Character error:', characterError);
          throw characterError;
        }

        console.log('Character data:', character);

        if (!character) {
          console.log('Character not found with ID:', settings.selected_character_id);
          return null;
        }

        console.log('=== ACTIVE CHARACTER FOUND ===');
        console.log('Name:', character.name);
        console.log('Thumbnail URL:', character.thumbnail_url);
        console.log('Animation Type:', character.animation_type);
        console.log('Is Active:', character.is_active);

        return character as Character3D;
      } catch (error) {
        console.error('=== ERROR IN FETCHING CHARACTER ===');
        console.error(error);
        throw error;
      }
    },
    retry: 1, // Reduce retry to avoid too many requests
    staleTime: 1000, // Reduce stale time to 1 second for debugging
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Always refetch on mount
  });
};