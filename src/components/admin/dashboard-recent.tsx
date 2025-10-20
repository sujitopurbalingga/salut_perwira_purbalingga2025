"use client";

import React from 'react';
import { User, Clock, FileText, Image, Bell, Church, BookOpen, MessageSquare } from 'lucide-react';

interface RecentItem {
  id: string;
  type: 'user' | 'activity' | 'announcement' | 'gallery' | 'prayer' | 'sermon';
  title: string;
  description: string;
  time: string;
  user: string;
}

export const DashboardRecent: React.FC = () => {
  const recentItems: RecentItem[] = [
    {
      id: '1',
      type: 'prayer',
      title: 'Permohonan Doa Baru',
      description: 'Budi Santoso meminta doa untuk kesembuhan',
      time: '5 menit yang lalu',
      user: 'Website'
    },
    {
      id: '2',
      type: 'activity',
      title: 'Jadwal Ibadah Ditambahkan',
      description: 'Ibadah Natal 2024 telah dijadwalkan',
      time: '1 jam yang lalu',
      user: 'Admin'
    },
    {
      id: '3',
      type: 'announcement',
      title: 'Pengumuman Baru',
      description: 'Perubahan jadwal ibadah minggu depan',
      time: '2 jam yang lalu',
      user: 'Pastor'
    },
    {
      id: '4',
      type: 'gallery',
      title: 'Foto Kegiatan Ditambahkan',
      description: '15 foto dari perayaan Paskah',
      time: '3 jam yang lalu',
      user: 'Admin'
    },
    {
      id: '5',
      type: 'sermon',
      title: 'Khotbah Minggu Lalu',
      description: 'Renungan tentang "Kasih dan Pengampunan"',
      time: '1 hari yang lalu',
      user: 'Pastor'
    },
    {
      id: '6',
      type: 'user',
      title: 'Jemaat Baru',
      description: 'Sarah Anderson bergabung dengan gereja',
      time: '2 hari yang lalu',
      user: 'System'
    }
  ];

  const getIcon = (type: RecentItem['type']) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'activity':
        return <Church className="h-4 w-4 text-green-600" />;
      case 'announcement':
        return <Bell className="h-4 w-4 text-yellow-600" />;
      case 'gallery':
        return <Image className="h-4 w-4 text-purple-600" />;
      case 'prayer':
        return <MessageSquare className="h-4 w-4 text-pink-600" />;
      case 'sermon':
        return <BookOpen className="h-4 w-4 text-indigo-600" />;
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