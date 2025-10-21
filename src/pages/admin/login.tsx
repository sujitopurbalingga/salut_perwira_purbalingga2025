"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/admin/auth-provider';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AdminLogin = () => {
  const [email, setEmail] = useState('sujitopurbalinga@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Check if user is already authenticated with protection against infinite loops
  useEffect(() => {
    const MAX_CHECKS = 3;
    
    const checkExistingSession = async () => {
      if (checkCount >= MAX_CHECKS) {
        console.log('Max auth checks reached, stopping');
        setIsCheckingAuth(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setIsCheckingAuth(false);
          return;
        }

        if (session?.user) {
          console.log('User already authenticated:', session.user.email);
          
          // Check if user has admin role with timeout
          const profileTimeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Profile check timeout')), 3000);
          });

          const profilePromise = supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          const { data: profile, error: profileError } = await Promise.race([profilePromise, profileTimeout]);

          if (profileError) {
            console.error('Error checking admin role:', profileError);
            setIsCheckingAuth(false);
            return;
          }

          if (profile?.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            // User is not admin, sign them out
            await supabase.auth.signOut();
            setIsCheckingAuth(false);
          }
        } else {
          setIsCheckingAuth(false);
        }
      } catch (err) {
        console.error('Error in checkExistingSession:', err);
        setIsCheckingAuth(false);
      }
    };

    // Add delay between checks to prevent rapid polling
    const timer = setTimeout(() => {
      checkExistingSession();
    }, 1000);

    return () => clearTimeout(timer);
  }, [checkCount, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        setError('Gagal mengirim reset password');
      } else {
        setError('Link reset password telah dikirim ke email Anda');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim reset password');
    }
  };

  // Force refresh if stuck
  const handleForceRefresh = () => {
    setCheckCount(0);
    setIsCheckingAuth(true);
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Memeriksa autentikasi...</h3>
          <p className="text-white/80 mb-4">
            Mohon tunggu sebentar sedang memverifikasi sesi Anda
          </p>
          <button
            onClick={handleForceRefresh}
            className="text-white/80 hover:text-white underline text-sm"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  // If user is already authenticated and is admin, redirect to dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/80">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Login Admin
            </CardTitle>
            <p className="text-gray-600">
              Masuk ke dashboard administrasi
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-900 hover:bg-blue-800"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Login'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
              <p>
                Lupa password?{' '}
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Reset di sini
                </button>
              </p>
              <p className="text-xs">
                Email: sujitopurbalinga@gmail.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;