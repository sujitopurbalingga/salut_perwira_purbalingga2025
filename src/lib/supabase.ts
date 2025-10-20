import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for 3D Character
export interface Character3D {
  id: string;
  name: string;
  model_url: string;
  thumbnail_url: string;
  animation_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Types for Landing Page Settings
export interface LandingSettings {
  id: string;
  selected_character_id: string;
  hero_title: string;
  hero_subtitle: string;
  updated_at: string;
}