"use client";

import React from 'react';
import { Bell, Calendar, User } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export const DashboardAnnouncements: React.FC = () => {
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Ibadah Natal 2024',
      content: 'Persiapan ibadah Natal akan dimulai tanggal 20 Desember 2024',
      author: 'Pastor Joko',
      date: '2024-01-05',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Persekutuan Remaja',
      content: 'Persekutuan remaja setiap hari Sabtu pukul 16:00',
      author: 'Admin',
      date: '2024-01-04',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Jadwal Pelayanan',
      content: 'Update jadwal pelayanan minggu ini',
      author: 'Admin',
      date: '2024-01-03',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityText = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return 'Penting';
      case 'medium':
        return 'Sedang';
      case 'low':
        return 'Biasa';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Pengumuman Terbaru</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Kelola →
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-slate-900">
                  {announcement.title}
                </h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                {getPriorityText(announcement.priority)}
              </span>
            </div>
            
            <p className="text-sm text-slate-600 mb-3">
              {announcement.content}
            </p>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3" />
                <span>{announcement.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3" />
                <span>{announcement.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};