import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Layout
import AdminLayout from './layouts/admin-layout';

// Auth Provider
import { AuthProvider } from './components/admin/auth-provider';

// Public Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/login';
import AdminDashboard from './pages/admin/dashboard';
import AdminCharacter3D from './pages/admin/character-3d';
import AdminAbout from './pages/admin/about';
import AdminServices from './pages/admin/services';
import AdminFaculties from './pages/admin/faculties';
import AdminNews from './pages/admin/news';
import AdminRegistrations from './pages/admin/registrations';
import AdminBrochure from './pages/admin/brochure';

// Protected Route Component
import ProtectedRoute from './components/admin/protected-route';

// Create a client with better configuration for debugging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: true,
      staleTime: 0, // Force refetch for debugging
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />

          {/* Admin Routes - All wrapped with AuthProvider */}
          <Route path="/admin/*" element={
            <AuthProvider>
              <Routes>
                <Route path="login" element={<AdminLogin />} />
                <Route 
                  path="/*" 
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="character-3d" element={<AdminCharacter3D />} />
                  <Route path="about" element={<AdminAbout />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="faculties" element={<AdminFaculties />} />
                  <Route path="news" element={<AdminNews />} />
                  <Route path="registrations" element={<AdminRegistrations />} />
                  <Route path="brochure" element={<AdminBrochure />} />
                  <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>
              </Routes>
            </AuthProvider>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;