"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Edit3, 
  Save, 
  Eye, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Send
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface ContactContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  form_title: string;
  form_description: string;
  submit_button: string;
  address: string;
  address_description: string;
  phone: string;
  phone_description: string;
  email: string;
  email_description: string;
  map_title: string;
  map_description: string;
  created_at: string;
  updated_at: string;
}

interface OfficeHour {
  id: string;
  day: string;
  hours: string;
}

const AdminContact = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    hero_title: 'Mari Berkolaborasi',
    hero_subtitle: 'untuk Masyarakat',
    form_title: 'Kirim Pesan',
    form_description: 'Isi formulir di bawah ini dan kami akan segera merespons',
    submit_button: 'Kirim Pesan',
    address: 'Jl. Merdeka No. 123, Wonomulyo, Sulawesi Barat',
    address_description: 'Kunjungi kantor kami',
    phone: '+62 812-3456-7890',
    phone_description: 'Hubungi kami langsung',
    email: 'info@salutwonomulyo.com',
    email_description: 'Kirim email kapan saja',
    map_title: 'Map Location',
    map_description: 'Lokasi Kami\nJl. Merdeka No. 123, Wonomulyo'
  });

  const [officeHours, setOfficeHours] = useState<OfficeHour[]>([
    { id: '1', day: 'Senin - Jumat', hours: '08:00 - 17:00' },
    { id: '2', day: 'Sabtu', hours: '09:00 - 15:00' },
    { id: '3', day: 'Minggu', hours: 'Tutup' }
  ]);

  const [editingHour, setEditingHour] = useState<OfficeHour | null>(null);
  const [newHour, setNewHour] = useState({ day: '', hours: '' });

  const queryClient = useQueryClient();

  // Fetch contact content
  const { data: contactContent, isLoading, refetch } = useQuery({
    queryKey: ['contact'],
    queryFn: async () => {
      const { data } = await supabase
        .from('contact_settings')
        .select('*')
        .maybeSingle();
      return data as ContactContent;
    },
    staleTime: 0,
    refetchOnMount: true
  });

  // Update form data when contact content changes
  React.useEffect(() => {
    if (contactContent) {
      setFormData({
        hero_title: contactContent.hero_title || 'Mari Berkolaborasi',
        hero_subtitle: contactContent.hero_subtitle || 'untuk Masyarakat',
        form_title: contactContent.form_title || 'Kirim Pesan',
        form_description: contactContent.form_description || 'Isi formulir di bawah ini dan kami akan segera merespons',
        submit_button: contactContent.submit_button || 'Kirim Pesan',
        address: contactContent.address || 'Jl. Merdeka No. 123, Wonomulyo, Sulawesi Barat',
        address_description: contactContent.address_description || 'Kunjungi kantor kami',
        phone: contactContent.phone || '+62 812-3456-7890',
        phone_description: contactContent.phone_description || 'Hubungi kami langsung',
        email: contactContent.email || 'info@salutwonomulyo.com',
        email_description: contactContent.email_description || 'Kirim email kapan saja',
        map_title: contactContent.map_title || 'Map Location',
        map_description: contactContent.map_description || 'Lokasi Kami\nJl. Merdeka No. 123, Wonomulyo'
      });
    }
  }, [contactContent]);

  // Update or Insert contact content
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (contactContent?.id) {
        const { error } = await supabase
          .from('contact_settings')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', contactContent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contact_settings')
          .insert({
            ...data,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
      refetch(); // Refetch data to get updated content
      setMessage('Konten berhasil disimpan!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal memperbarui: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Office hours mutations
  const addHourMutation = useMutation({
    mutationFn: async (hour: { day: string; hours: string }) => {
      const newHour = {
        ...hour,
        id: Date.now().toString()
      };
      setOfficeHours(prev => [...prev, newHour]);
    },
    onSuccess: () => {
      setMessage('Jam operasional berhasil ditambahkan!');
      setNewHour({ day: '', hours: '' });
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const updateHourMutation = useMutation({
    mutationFn: async (hour: OfficeHour) => {
      setOfficeHours(prev => prev.map(h => h.id === hour.id ? hour : h));
    },
    onSuccess: () => {
      setMessage('Jam operasional berhasil diperbarui!');
      setEditingHour(null);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const deleteHourMutation = useMutation({
    mutationFn: async (id: string) => {
      setOfficeHours(prev => prev.filter(h => h.id !== id));
    },
    onSuccess: () => {
      setMessage('Jam operasional berhasil dihapus!');
      setEditingHour(null);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const handleAddHour = () => {
    if (!newHour.day || !newHour.hours) {
      setMessage('Hari dan jam wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    addHourMutation.mutate(newHour);
  };

  const handleUpdateHour = () => {
    if (!editingHour?.day || !editingHour?.hours) {
      setMessage('Hari dan jam wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    updateHourMutation.mutate(editingHour);
  };

  const handleDeleteHour = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jam operasional ini?')) {
      deleteHourMutation.mutate(id);
    }
  };

  // Use current form data for preview (not the database data)
  const previewData = isEditing ? formData : (contactContent || formData);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Hubungi Kami</h1>
          <p className="text-gray-500 mt-1">Edit konten halaman Hubungi Kami</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="space-x-2">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Preview Halaman Hubungi</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Hero Section */}
                <div className="text-center py-12 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg">
                  <h2 className="text-3xl font-bold mb-2">{previewData.hero_title}</h2>
                  <p className="text-xl">{previewData.hero_subtitle}</p>
                </div>

                {/* Form Section */}
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">{previewData.form_title}</h3>
                  <p className="text-gray-600 mb-6">{previewData.form_description}</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Masukkan nama Anda" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon (Opsional)</label>
                      <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Contoh: +6281234567890" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                      <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={4} placeholder="Tulis pesan Anda di sini..." />
                    </div>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                      {previewData.submit_button}
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center mb-4">
                      <MapPin className="w-6 h-6 text-green-600 mr-3" />
                      <h4 className="font-semibold">Alamat</h4>
                    </div>
                    <p className="text-gray-900 font-medium mb-2">{previewData.address}</p>
                    <p className="text-gray-600 text-sm">{previewData.address_description}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center mb-4">
                      <Phone className="w-6 h-6 text-green-600 mr-3" />
                      <h4 className="font-semibold">Telepon</h4>
                    </div>
                    <p className="text-gray-900 font-medium mb-2">{previewData.phone}</p>
                    <p className="text-gray-600 text-sm">{previewData.phone_description}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center mb-4">
                      <Mail className="w-6 h-6 text-green-600 mr-3" />
                      <h4 className="font-semibold">Email</h4>
                    </div>
                    <p className="text-gray-900 font-medium mb-2">{previewData.email}</p>
                    <p className="text-gray-600 text-sm">{previewData.email_description}</p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Jam Operasional
                  </h4>
                  <div className="space-y-2">
                    {officeHours.map((hour) => (
                      <div key={hour.id} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium">{hour.day}</span>
                        <span className="text-gray-600">{hour.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">{previewData.map_title}</p>
                    <p className="text-sm text-gray-500 whitespace-pre-line">{previewData.map_description}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="space-x-2">
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={saveMutation.isPending} className="space-x-2">
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan</span>
            </Button>
          )}
        </div>
      </div>

      {message && (
        <Alert className={message.includes('berhasil') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Hero Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span>Hero Section</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero_title">Judul Hero</Label>
            <Input
              id="hero_title"
              value={formData.hero_title}
              onChange={(e) => handleInputChange('hero_title', e.target.value)}
              disabled={!isEditing}
              placeholder="Mari Berkolaborasi"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hero_subtitle">Subjudul Hero</Label>
            <Input
              id="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
              disabled={!isEditing}
              placeholder="untuk Masyarakat"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-blue-600" />
            <span>Form Kontak</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="form_title">Judul Form</Label>
            <Input
              id="form_title"
              value={formData.form_title}
              onChange={(e) => handleInputChange('form_title', e.target.value)}
              disabled={!isEditing}
              placeholder="Kirim Pesan"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="form_description">Deskripsi Form</Label>
            <Textarea
              id="form_description"
              value={formData.form_description}
              onChange={(e) => handleInputChange('form_description', e.target.value)}
              disabled={!isEditing}
              placeholder="Isi formulir di bawah ini dan kami akan segera merespons"
              rows={3}
              className="mt-1 resize-none"
            />
          </div>
          <div>
            <Label htmlFor="submit_button">Tombol Submit</Label>
            <Input
              id="submit_button"
              value={formData.submit_button}
              onChange={(e) => handleInputChange('submit_button', e.target.value)}
              disabled={!isEditing}
              placeholder="Kirim Pesan"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <span>Informasi Kontak</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                placeholder="Jl. Merdeka No. 123, Wonomulyo, Sulawesi Barat"
                rows={2}
                className="mt-1 resize-none"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="+62 812-3456-7890"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                placeholder="info@salutwonomulyo.com"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="address_description">Deskripsi Alamat</Label>
              <Input
                id="address_description"
                value={formData.address_description}
                onChange={(e) => handleInputChange('address_description', e.target.value)}
                disabled={!isEditing}
                placeholder="Kunjungi kantor kami"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone_description">Deskripsi Telepon</Label>
              <Input
                id="phone_description"
                value={formData.phone_description}
                onChange={(e) => handleInputChange('phone_description', e.target.value)}
                disabled={!isEditing}
                placeholder="Hubungi kami langsung"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email_description">Deskripsi Email</Label>
              <Input
                id="email_description"
                value={formData.email_description}
                onChange={(e) => handleInputChange('email_description', e.target.value)}
                disabled={!isEditing}
                placeholder="Kirim email kapan saja"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Hours */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Jam Operasional</span>
            </span>
            {isEditing && (
              <Button onClick={handleAddHour} disabled={addHourMutation.isPending} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Tambah Jam
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {officeHours.map((hour) => (
              <div key={hour.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Hari</Label>
                      <p className="text-gray-900">{hour.day}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Jam</Label>
                      <p className="text-gray-900">{hour.hours}</p>
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingHour(hour)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteHour(hour.id)}
                      disabled={deleteHourMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <span>Informasi Peta</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="map_title">Judul Peta</Label>
            <Input
              id="map_title"
              value={formData.map_title}
              onChange={(e) => handleInputChange('map_title', e.target.value)}
              disabled={!isEditing}
              placeholder="Map Location"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="map_description">Deskripsi Peta</Label>
            <Textarea
              id="map_description"
              value={formData.map_description}
              onChange={(e) => handleInputChange('map_description', e.target.value)}
              disabled={!isEditing}
              placeholder="Lokasi Kami\nJl. Merdeka No. 123, Wonomulyo"
              rows={3}
              className="mt-1 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Office Hour Dialog */}
      <Dialog open={!!editingHour} onOpenChange={() => setEditingHour(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Jam Operasional</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-day">Hari</Label>
              <Input
                id="edit-day"
                value={editingHour?.day || ''}
                onChange={(e) => setEditingHour(prev => prev ? { ...prev, day: e.target.value } : null)}
                placeholder="Masukkan hari"
              />
            </div>
            <div>
              <Label htmlFor="edit-hours">Jam</Label>
              <Input
                id="edit-hours"
                value={editingHour?.hours || ''}
                onChange={(e) => setEditingHour(prev => prev ? { ...prev, hours: e.target.value } : null)}
                placeholder="Contoh: 08:00 - 17:00"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingHour(null)}>
                Batal
              </Button>
              <Button onClick={handleUpdateHour} disabled={updateHourMutation.isPending}>
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Office Hour Dialog */}
      <Dialog open={!!newHour.day} onOpenChange={(open) => !open && setNewHour({ day: '', hours: '' })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Jam Operasional</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-day">Hari</Label>
              <Input
                id="new-day"
                value={newHour.day}
                onChange={(e) => setNewHour(prev => ({ ...prev, day: e.target.value }))}
                placeholder="Masukkan hari"
              />
            </div>
            <div>
              <Label htmlFor="new-hours">Jam</Label>
              <Input
                id="new-hours"
                value={newHour.hours}
                onChange={(e) => setNewHour(prev => ({ ...prev, hours: e.target.value }))}
                placeholder="Contoh: 08:00 - 17:00"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNewHour({ day: '', hours: '' })}>
                Batal
              </Button>
              <Button onClick={handleAddHour} disabled={addHourMutation.isPending}>
                Tambah
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContact;