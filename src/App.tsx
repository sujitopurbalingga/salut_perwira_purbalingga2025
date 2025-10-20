import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Layout
import AdminLayout from './layouts/admin-layout';

// Public Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/login';
import AdminDashboard from './pages/admin/dashboard';
import AdminAbout from './pages/admin/about';
import AdminServices from './pages/admin/services';
import AdminFaculties from './pages/admin/faculties';
import AdminNews from './pages/admin/news';
import AdminRegistrations from './pages/admin/registrations';
import AdminBrochure from './pages/admin/brochure';

// Protected Route Component
import ProtectedRoute from './components/admin/protected-route';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
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

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="faculties" element={<AdminFaculties />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="brochure" element={<AdminBrochure />} />
            <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;