"use client";

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/sidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed di kiri */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar - Overlay untuk mobile */}
      <div className="lg:hidden fixed inset-0 z-50">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Top Padding untuk memberikan jarak dari header */}
        <div className="pt-16 lg:pt-0">
          {/* Content Container dengan padding yang ideal */}
          <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">
            {/* Max Width Container untuk konten yang tidak terlalu lebar */}
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;