import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Enhanced logging for debugging
console.log('=== SUPABASE CONFIG DEBUG ===')
console.log('VITE_SUPABASE_URL (raw):', supabaseUrl)
console.log('VITE_SUPABASE_URL (type):', typeof supabaseUrl)
console.log('VITE_SUPABASE_URL (length):', supabaseUrl?.length)
console.log('VITE_SUPABASE_URL (starts with https://):', supabaseUrl?.startsWith('https://'))
console.log('VITE_SUPABASE_URL (trimmed):', supabaseUrl?.trim())
console.log('VITE_SUPABASE_ANON_KEY (first 10 chars):', supabaseAnonKey?.substring(0, 10) + '...')
console.log('=============================')

// Validate URL format
const validateUrl = (url: string | undefined): string => {
  if (!url) {
    throw new Error('Supabase URL is not defined in environment variables')
  }

  const trimmedUrl = url.trim()
  
  if (!trimmedUrl) {
    throw new Error('Supabase URL is empty after trimming')
  }

  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    throw new Error(`Supabase URL must start with http:// or https://. Received: "${trimmedUrl}"`)
  }

  try {
    // Try to create a URL object to validate it
    new URL(trimmedUrl)
  } catch (error) {
    throw new Error(`Supabase URL is malformed: "${trimmedUrl}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return trimmedUrl
}

try {
  const validatedUrl = validateUrl(supabaseUrl)
  console.log('✅ Supabase URL is valid:', validatedUrl)
  
  export const supabase = createClient(validatedUrl, supabaseAnonKey)
  console.log('✅ Supabase client created successfully')
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error)
  // Re-throw the error so the app will still fail, but with a clearer message
  throw error
}

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

// New/Updated types for content management
export interface AboutContent {
  id: string;
  title: string;
  description: string; // Renamed from content
  mission?: string; // New field
  vision?: string; // New field
  history?: string; // New field
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Faculty {
  id: string;
  name: string;
  description?: string;
  dean_name?: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
  programs?: string[]; // New field
  students_count?: number; // New field
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  author_id: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  selected_faculty?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  faculties?: {
    name: string;
  };
}

export interface Brochure {
  id: string;
  title: string;
  file_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}