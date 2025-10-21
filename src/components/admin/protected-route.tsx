"use client";

import React from 'react';
import { useAuth } from './auth-provider';
import { Navigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading state with timeout protection
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Memeriksa autentikasi...</h3>
          <p className="text-gray-600 text-sm">
            Mohon tunggu sebentar sedang memverifikasi sesi Anda
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Jika ini terlalu lama, coba refresh halaman
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;