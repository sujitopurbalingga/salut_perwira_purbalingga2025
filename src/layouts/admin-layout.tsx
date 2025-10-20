"use client";

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/sidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;