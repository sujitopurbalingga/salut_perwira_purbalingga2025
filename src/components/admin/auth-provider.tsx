"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

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
  const [authCheckCount, setAuthCheckCount] = useState(0);
  const queryClient = useQueryClient();

  const MAX_AUTH_CHECKS = 3; // Maksimal 3 kali cek untuk mencegah loop

  const checkSessionAndProfile = async (sessionUser: any) => {
    if (authCheckCount >= MAX_AUTH_CHECKS) {
      console.log('Max auth checks reached, stopping');
      setLoading(false);
      return;
    }

    setAuthCheckCount(prev => prev + 1);

    try {
      if (sessionUser) {
        console.log('User found in session:', sessionUser.email);
        
        // Check profile with timeout
        const profileTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Profile check timeout')), 5000);
        });

        const profilePromise = supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUser.id)
          .single();

        const { data: profile, error: profileError } = await Promise.race([profilePromise, profileTimeout]);

        if (profileError) {
          console.error('Error getting profile:', profileError);
          // Continue with default role if profile not found
        }

        setUser({
          id: sessionUser.id,
          email: sessionUser.email!,
          role: profile?.role || 'user'
        });
      } else {
        console.log('No user in session');
        setUser(null);
      }
    } catch (error) {
      console.error('Error in checkSessionAndProfile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      if (!isMounted) return;

      try {
        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Set timeout to prevent hanging
        timeoutId = setTimeout(() => {
          if (loading) {
            console.log('Auth check timeout, setting loading to false');
            setLoading(false);
          }
        }, 10000); // 10 seconds timeout

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setLoading(false);
          return;
        }

        await checkSessionAndProfile(session?.user);
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes with cleanup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (isMounted) {
          setLoading(true);
          await checkSessionAndProfile(session?.user);
        }
      }
    );

    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [authCheckCount]);

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
        
        // Reset auth check count on successful login
        setAuthCheckCount(0);
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
      setAuthCheckCount(0);
      queryClient.invalidateQueries();
      queryClient.removeQueries();
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