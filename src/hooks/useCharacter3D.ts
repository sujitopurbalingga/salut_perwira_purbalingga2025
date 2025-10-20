import { useQuery } from '@tanstack/react-query';
import { supabase, Character3D } from '@/lib/supabase';

export const useCharacter3D = () => {
  return useQuery({
    queryKey: ['active-character-3d'],
    queryFn: async () => {
      console.log('=== FETCHING ACTIVE CHARACTER 3D ===');
      
      try {
        // First try to get from landing settings
        const { data: settings, error: settingsError } = await supabase
          .from('landing_settings')
          .select('*')
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          console.error('Settings error:', settingsError);
        }

        if (settings?.selected_character_id) {
          console.log('Found selected character ID:', settings.selected_character_id);
          
          const { data: character, error: characterError } = await supabase
            .from('characters_3d')
            .select('*')
            .eq('id', settings.selected_character_id)
            .single();

          if (!characterError && character) {
            console.log('Found character from settings:', character);
            return character;
          }
        }

        // Fallback: Get any active character
        console.log('Fallback: getting any active character...');
        const { data: activeCharacter, error: activeError } = await supabase
          .from('characters_3d')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!activeError && activeCharacter) {
          console.log('Found active character:', activeCharacter);
          // Update landing settings with this character
          if (activeCharacter.id !== settings?.selected_character_id) {
            await supabase
              .from('landing_settings')
              .upsert({
                id: 1,
                selected_character_id: activeCharacter.id,
                updated_at: new Date().toISOString()
              });
          }
          return activeCharacter;
        }

        // Last fallback: Get most recent character
        console.log('Last fallback: getting most recent character...');
        const { data: recentCharacter, error: recentError } = await supabase
          .from('characters_3d')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!recentError && recentCharacter) {
          console.log('Found recent character:', recentCharacter);
          return recentCharacter;
        }

        console.log('No character found');
        return null;
      } catch (error) {
        console.error('Error fetching character:', error);
        return null;
      }
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};