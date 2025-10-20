"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Briefcase, 
  Building2,
  TrendingUp,
  Calendar,
  Activity,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  // Fetch statistics
  const { data: stats, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [
        { count: totalRegistrations },
        { count: pendingRegistrations },
        { count: totalNews },
        { count: totalServices },
        { count: totalFaculties },
        { data: recentRegistrations }
      ] = await Promise.all([
        supabase.from('registrations').select('*', { count: 'exact', head: true }),
        supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('faculties').select('*', { count: 'exact', head: true }),
        supabase
          .from('registrations')
          .select('full_name, email, created_at, status')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      return {
        totalRegistrations: totalRegistrations || 0,
        pendingRegistrations: pendingRegistrations || 0,
        totalNews: totalNews || 0,
        totalServices: totalServices || 0,
        totalFaculties: totalFaculties || 0,
        recentRegistrations: recentRegistrations || []
      };
    }
  });

  const statsCards = [
    {
      title: 'Total Pendaftaran',
      value: stats?.totalRegistrations || 0,
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Menunggu Konfirmasi',
      value: stats?.pendingRegistrations || 0,
      icon: <UserCheck className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Total Berita',
      value: stats?.totalNews || 0,
      icon: <FileText className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Layanan & Fakultas',
      value: (stats?.totalServices || 0) + (stats?.totalFaculties || 0),
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  // If there's an error, show an error message
  if (statsError) {
    return (
      <div className="p-8">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Error Loading Dashboard</h2>
        </div>
        <p className="mt-4 text-gray-600">
          Failed to load dashboard data. Please try again later.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Error: {statsError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Dashboard Admin
        </h1>
        <p className="text-gray-500 text-lg">Selamat datang di panel administrasi</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={stat.title}
            className="hover:scale-105 transition-transform duration-200"
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                    <div className={stat.iconColor}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
            </Card>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <span className="text-xl font-semibold">Pendaftaran Terbaru</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentRegistrations.map((registration: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{registration.full_name}</p>
                        <p className="text-sm text-gray-500">{registration.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={registration.status === 'pending' ? 'secondary' : 
                                  registration.status === 'approved' ? 'default' : 'destructive'}
                        >
                          {registration.status === 'pending' ? 'Menunggu' :
                           registration.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(registration.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada pendaftaran</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-xl font-semibold">Aktivitas Hari Ini</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Total Kunjungan</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">247</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Pendaftaran Baru</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats?.pendingRegistrations || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Update Konten</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;