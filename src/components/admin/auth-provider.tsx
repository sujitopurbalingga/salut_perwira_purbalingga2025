"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('Checking existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Session found:', session?.user?.email);
        
        if (session?.user) {
          // Get user role from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error getting profile:', profileError);
            // Continue with default role if profile not found
          }

          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile?.role || 'user'
          });
        }
      } catch (error) {
        console.error('Error in checkSession:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error getting profile on auth change:', profileError);
          }

          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile?.role || 'user'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Login response data:', data);
      console.log('Login response error:', error);

      if (error) {
        console.error('Login error:', error);
        
        // Handle specific error messages
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Email atau password salah. Pastikan user sudah terdaftar di Supabase Auth.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Email belum dikonfirmasi. Silakan cek inbox Anda.' };
        }
        if (error.message.includes('Too many requests')) {
          return { success: false, error: 'Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.' };
        }
        
        return { success: false, error: error.message };
      }

      console.log('Login successful:', data.user?.email);

      // Check if user is admin
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error checking admin role:', profileError);
          // Create profile if it doesn't exist
          if (profileError.code === 'PGRST116') {
            console.log('Profile not found, creating new one...');
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: data.user.email,
                role: 'admin' // Make first user admin
              });
            
            if (insertError) {
              console.error('Error creating profile:', insertError);
              await supabase.auth.signOut();
              return { success: false, error: 'Gagal membuat profile user' };
            }
          } else {
            await supabase.auth.signOut();
            return { success: false, error: 'Gagal memverifikasi role user' };
          }
        } else if (profile?.role !== 'admin') {
          console.log('User is not admin, role:', profile?.role);
          await supabase.auth.signOut();
          return { success: false, error: 'Anda tidak memiliki akses admin' };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { success: false, error: 'Terjadi kesalahan saat login' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};