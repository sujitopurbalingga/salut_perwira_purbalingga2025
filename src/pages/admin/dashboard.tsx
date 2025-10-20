"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Newspaper, 
  Briefcase, 
  GraduationCap,
  TrendingUp,
  Eye
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: registrationsCount },
        { count: newsCount },
        { count: servicesCount },
        { count: facultiesCount },
        { count: pendingRegistrations }
      ] = await Promise.all([
        supabase.from('registrations').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('faculties').select('*', { count: 'exact', head: true }),
        supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      return {
        registrations: registrationsCount || 0,
        news: newsCount || 0,
        services: servicesCount || 0,
        faculties: facultiesCount || 0,
        pendingRegistrations: pendingRegistrations || 0
      };
    }
  });

  // Fetch recent registrations
  const { data: recentRegistrations } = useQuery({
    queryKey: ['recent-registrations'],
    queryFn: async () => {
      const { data } = await supabase
        .from('registrations')
        .select(`
          *,
          faculties (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    }
  });

  // Fetch recent news
  const { data: recentNews } = useQuery({
    queryKey: ['recent-news'],
    queryFn: async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    }
  });

  const statCards = [
    {
      title: 'Total Pendaftaran',
      value: stats?.registrations || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pendaftaran Menunggu',
      value: stats?.pendingRegistrations || 0,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Total Berita',
      value: stats?.news || 0,
      icon: Newspaper,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Layanan & Fakultas',
      value: (stats?.services || 0) + (stats?.faculties || 0),
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di panel administrasi</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Pendaftaran Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRegistrations && recentRegistrations.length > 0 ? (
              <div className="space-y-4">
                {recentRegistrations.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{reg.full_name}</p>
                      <p className="text-sm text-gray-600">{reg.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(reg.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${reg.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${reg.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {reg.status === 'pending' ? 'Menunggu' : 
                       reg.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada pendaftaran</p>
            )}
          </CardContent>
        </Card>

        {/* Recent News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Berita Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentNews && recentNews.length > 0 ? (
              <div className="space-y-4">
                {recentNews.map((news) => (
                  <div key={news.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{news.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{news.excerpt || news.content.substring(0, 100)}...</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(news.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada berita</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;