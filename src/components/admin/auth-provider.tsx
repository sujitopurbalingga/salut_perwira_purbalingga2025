"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient

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
  const queryClient = useQueryClient(); // Initialize queryClient

  useEffect(() => {
    const checkSessionAndProfile = async (sessionUser: any) => {
      if (sessionUser) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUser.id)
          .single();

        if (profileError) {
          console.error('Error getting profile:', profileError);
          // Continue with default role if profile not found
        }

        setUser({
          id: sessionUser.id,
          email: sessionUser.email!,
          role: profile?.role || 'user'
        });
        queryClient.invalidateQueries(); // Invalidate queries to refetch data for the new user
      } else {
        setUser(null);
        queryClient.invalidateQueries(); // Invalidate queries on logout/no session
      }
      setLoading(false);
    };

    // Check for existing session on initial load
    const initialSessionCheck = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
          setLoading(false);
          return;
        }
        await checkSessionAndProfile(session?.user);
      } catch (error) {
        console.error('Error in initialSessionCheck:', error);
        setLoading(false);
      }
    };

    initialSessionCheck();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setLoading(true); // Set loading true while processing auth change
        await checkSessionAndProfile(session?.user);
      }
    );

    return () => subscription.unsubscribe();
  }, [queryClient]); // Add queryClient to dependency array

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Email atau password salah' };
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

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error checking admin role:', profileError);
          await supabase.auth.signOut();
          return { success: false, error: 'Gagal memverifikasi role user' };
        }

        if (profile?.role !== 'admin') {
          console.log('User is not admin, role:', profile?.role);
          await supabase.auth.signOut();
          return { success: false, error: 'Anda tidak memiliki akses admin' };
        }
        
        // Invalidate queries after successful admin login
        queryClient.invalidateQueries();
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
      queryClient.invalidateQueries(); // Invalidate queries after logout
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