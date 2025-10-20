"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  ChevronRight,
  Church,
  Image,
  Bell,
  BarChart3
} from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Pengguna', icon: Users },
  { href: '/admin/activities', label: 'Kegiatan', icon: Calendar },
  { href: '/admin/announcements', label: 'Pengumuman', icon: Bell },
  { href: '/admin/gallery', label: 'Galeri', icon: Image },
  { href: '/admin/pages', label: 'Halaman', icon: FileText },
  { href: '/admin/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="p-4 space-y-1">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`
              flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </div>
            {isActive && <ChevronRight className="h-4 w-4" />}
          </Link>
        );
      })}
    </nav>
  );
};