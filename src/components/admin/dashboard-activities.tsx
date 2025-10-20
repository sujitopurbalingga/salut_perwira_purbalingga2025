"use client";

import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const DashboardActivities: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      title: 'Ibadah Minggu Pagi',
      date: '2024-01-07',
      time: '08:00',
      location: 'Gereja Utama',
      participants: 150,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Sekolah Minggu',
      date: '2024-01-07',
      time: '09:30',
      location: 'Ruang Kelas',
      participants: 45,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Persekutuan Doa',
      date: '2024-01-05',
      time: '19:00',
      location: 'Ruang Doa',
      participants: 30,
      status: 'completed'
    }
  ];

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'ongoing':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: Activity['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Akan Datang';
      case 'ongoing':
        return 'Sedang Berlangsung';
      case 'completed':
        return 'Selesai';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Kegiatan Terkini</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Lihat Semua →
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-slate-900">{activity.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                {getStatusText(activity.status)}
              </span>
            </div>
            
            <div className="space-y-1 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{activity.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{activity.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{activity.participants} peserta</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};