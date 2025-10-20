"use client";

import React from 'react';
import { User, Clock, FileText, Image, Bell } from 'lucide-react';

interface RecentItem {
  id: string;
  type: 'user' | 'activity' | 'announcement' | 'gallery';
  title: string;
  description: string;
  time: string;
  user: string;
}

export const DashboardRecent: React.FC = () => {
  const recentItems: RecentItem[] = [
    {
      id: '1',
      type: 'user',
      title: 'User Baru Terdaftar',
      description: 'John Doe bergabung sebagai anggota',
      time: '5 menit yang lalu',
      user: 'System'
    },
    {
      id: '2',
      type: 'activity',
      title: 'Kegiatan Ditambahkan',
      description: 'Ibadah Natal 2024 telah dijadwalkan',
      time: '1 jam yang lalu',
      user: 'Admin'
    },
    {
      id: '3',
      type: 'announcement',
      title: 'Pengumuman Baru',
      description: 'Jadwal ibadah minggu depan',
      time: '2 jam yang lalu',
      user: 'Pastor'
    },
    {
      id: '4',
      type: 'gallery',
      title: 'Foto Ditambahkan',
      description: '12 foto dari ibadah minggu lalu',
      time: '3 jam yang lalu',
      user: 'Admin'
    }
  ];

  const getIcon = (type: RecentItem['type']) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'activity':
        return <Clock className="h-4 w-4 text-green-600" />;
      case 'announcement':
        return <Bell className="h-4 w-4 text-yellow-600" />;
      case 'gallery':
        return <Image className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Aktivitas Terbaru</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Lihat Semua →
        </button>
      </div>

      <div className="space-y-4">
        {recentItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              {getIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-slate-900 mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 mb-1">
                {item.description}
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>{item.time}</span>
                <span>•</span>
                <span>{item.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};