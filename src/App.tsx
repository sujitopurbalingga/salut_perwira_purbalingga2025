import React, { useState, useEffect } from 'react';
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
import AdminContact from './pages/admin/contact';
import AdminFooter from './pages/admin/footer';
import AdminSettings from './pages/admin/settings';

// Protected Route Component
import ProtectedRoute from './components/admin/protected-route';

// Create a client with better configuration for debugging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false, // Nonaktifkan refetch otomatis untuk mencegah loop
      refetchOnMount: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize app with protection against infinite loops
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Give a small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memulai aplikasi...</p>
        </div>
      </div>
    );
  }

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
                  <Route path="contact" element={<AdminContact />} />
                  <Route path="footer" element={<AdminFooter />} />
                  <Route path="settings" element={<AdminSettings />} />
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