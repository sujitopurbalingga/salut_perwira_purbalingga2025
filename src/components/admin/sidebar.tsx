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
  BarChart3,
  BookOpen,
  MessageSquare,
  Heart,
  Megaphone,
  Music,
  UserCheck
} from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/jemaat', label: 'Data Jemaat', icon: Users },
  { href: '/admin/ibadah', label: 'Jadwal Ibadah', icon: Church },
  { href: '/admin/kegiatan', label: 'Kegiatan', icon: Calendar },
  { href: '/admin/pengumuman', label: 'Pengumuman', icon: Bell },
  { href: '/admin/khotbah', label: 'Khotbah & Renungan', icon: BookOpen },
  { href: '/admin/doa', label: 'Permohonan Doa', icon: MessageSquare },
  { href: '/admin/gallery', label: 'Galeri Foto', icon: Image },
  { href: '/admin/pelayanan', label: 'Tim Pelayanan', icon: UserCheck },
  { href: '/admin/donasi', label: 'Donasi', icon: Heart },
  { href: '/admin/laporan', label: 'Laporan', icon: BarChart3 },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
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