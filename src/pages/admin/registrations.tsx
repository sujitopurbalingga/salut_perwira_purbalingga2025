"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Users, Check, X, Mail, Phone, GraduationCap, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  selected_faculty?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  faculties?: {
    name: string;
  };
}

const AdminRegistrations = () => {
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const queryClient = useQueryClient();

  // Fetch registrations
  const { data: registrations, isLoading } = useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      const { data } = await supabase
        .from('registrations')
        .select(`
          *,
          faculties (name)
        `)
        .order('created_at', { ascending: false });
      return data as Registration[];
    }
  });

  // Update registration status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('registrations')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      setMessage('Status berhasil diperbarui');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal memperbarui status: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  // Delete registration
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      setMessage('Pendaftaran berhasil dihapus');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal menghapus: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected') => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pendaftaran ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewDetail = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsDetailOpen(true);
  };

  const filteredRegistrations = registrations?.filter(reg => {
    if (filter === 'all') return true;
    return reg.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    const labels = {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      approved: 'text-green-600 bg-green-100',
      rejected: 'text-red-600 bg-red-100'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Pendaftaran</h1>
        <p className="text-gray-600">Kelola pendaftaran calon mahasiswa</p>
      </div>

      {message && (
        <Alert className="mb-6">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 flex space-x-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
          >
            {status === 'all' && 'Semua'}
            {status === 'pending' && 'Menunggu'}
            {status === 'approved' && 'Disetujui'}
            {status === 'rejected' && 'Ditolak'}
            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
              {status === 'all' 
                ? registrations?.length || 0
                : registrations?.filter(r => r.status === status).length || 0}
            </span>
          </Button>
        ))}
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {filteredRegistrations?.map((registration) => (
          <Card key={registration.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold">{registration.full_name}</h3>
                    {getStatusBadge(registration.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{registration.email}</span>
                    </div>
                    {registration.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{registration.phone}</span>
                      </div>
                    )}
                    {registration.faculties?.name && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span>{registration.faculties.name}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(registration.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {registration.message && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{registration.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetail(registration)}
                  >
                    Detail
                  </Button>
                  {registration.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(registration.id, 'approved')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Setujui
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(registration.id, 'rejected')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Tolak
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(registration.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!filteredRegistrations || filteredRegistrations.length === 0) && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter === 'all' ? 'Belum ada pendaftaran' : `Tidak ada pendaftaran dengan status ${filter}`}
          </p>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pendaftaran</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nama Lengkap</Label>
                  <p className="mt-1">{selectedRegistration.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="mt-1">{selectedRegistration.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Telepon</Label>
                  <p className="mt-1">{selectedRegistration.phone || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Fakultas</Label>
                  <p className="mt-1">{selectedRegistration.faculties?.name || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRegistration.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tanggal Daftar</Label>
                  <p className="mt-1">
                    {new Date(selectedRegistration.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {selectedRegistration.message && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Pesan</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p>{selectedRegistration.message}</p>
                  </div>
                </div>
              )}

              {selectedRegistration.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleUpdateStatus(selectedRegistration.id, 'rejected');
                      setIsDetailOpen(false);
                    }}
                  >
                    Tolak
                  </Button>
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedRegistration.id, 'approved');
                      setIsDetailOpen(false);
                    }}
                  >
                    Setujui
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRegistrations;