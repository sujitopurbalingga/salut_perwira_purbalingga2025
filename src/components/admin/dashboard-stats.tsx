"use client";

import React from 'react';
import { Users, Calendar, Image, FileText, TrendingUp, TrendingDown, MessageSquare, Church } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon, description }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <div className="flex items-center mt-2 space-x-1">
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-sm text-slate-500">{description}</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Jemaat Aktif',
      value: '500+',
      change: '+15%',
      trend: 'up' as const,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      description: 'dari bulan lalu'
    },
    {
      title: 'Ibadah Minggu',
      value: '3',
      change: 'Stabil',
      trend: 'up' as const,
      icon: <Church className="h-6 w-6 text-blue-600" />,
      description: 'sesi per minggu'
    },
    {
      title: 'Kegiatan Bulan Ini',
      value: '12',
      change: '+4',
      trend: 'up' as const,
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      description: 'kegiatan aktif'
    },
    {
      title: 'Pesan Doa',
      value: '28',
      change: '+8',
      trend: 'up' as const,
      icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
      description: 'permohonan baru'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};