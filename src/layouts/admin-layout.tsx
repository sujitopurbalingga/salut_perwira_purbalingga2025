"use client";

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/sidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed position */}
      <div className="fixed left-0 top-0 h-screen z-50 w-72 bg-white shadow-xl border-r border-gray-200">
        <AdminSidebar />
      </div>

      {/* Main Content - Full width with margin for sidebar */}
      <main className="flex-1 ml-72">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;