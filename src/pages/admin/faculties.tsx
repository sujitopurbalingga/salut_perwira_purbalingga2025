"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon, GraduationCap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Faculty {
  id: string;
  name: string;
  description?: string;
  dean_name?: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
}

const AdminFaculties = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dean_name: '',
    image_url: '',
    order_index: 0,
    is_active: true
  });
  const [message, setMessage] = useState('');

  const queryClient = useQueryClient();

  // Fetch faculties
  const { data: faculties, isLoading } = useQuery({
    queryKey: ['faculties'],
    queryFn: async () => {
      const { data } = await supabase
        .from('faculties')
        .select('*')
        .order('order_index', { ascending: true });
      return data as Faculty[];
    }
  });

  // Create/update faculty
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Faculty>) => {
      if (editingFaculty) {
        const { error } = await supabase
          .from('faculties')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', editingFaculty.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('faculties')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      setIsDialogOpen(false);
      setEditingFaculty(null);
      resetForm();
      setMessage('Fakultas berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal menyimpan: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  // Delete faculty
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faculties')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      setMessage('Fakultas berhasil dihapus');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal menghapus: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      dean_name: '',
      image_url: '',
      order_index: 0,
      is_active: true
    });
  };

  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      description: faculty.description || '',
      dean_name: faculty.dean_name || '',
      image_url: faculty.image_url || '',
      order_index: faculty.order_index,
      is_active: faculty.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      setMessage('Nama fakultas wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    saveMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus fakultas ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `faculty-${Date.now()}.${fileExt}`;
    const filePath = `faculties/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      setMessage('Gambar berhasil diunggah');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Gagal mengunggah gambar');
      setTimeout(() => setMessage(''), 3000);
    }
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Fakultas</h1>
          <p className="text-gray-600">Kelola informasi fakultas yang ditampilkan di landing page</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Fakultas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFaculty ? 'Edit Fakultas' : 'Tambah Fakultas Baru'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="name">Nama Fakultas</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama fakultas"
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Masukkan deskripsi fakultas"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="dean">Nama Dekan</Label>
                <Input
                  id="dean"
                  value={formData.dean_name}
                  onChange={(e) => setFormData({ ...formData, dean_name: e.target.value })}
                  placeholder="Masukkan nama dekan"
                />
              </div>

              <div>
                <Label htmlFor="order">Urutan</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <Label>Gambar</Label>
                <div className="space-y-3">
                  {formData.image_url && (
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={formData.image_url} 
                        alt="Faculty" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('faculty-image-upload')?.click()}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload Gambar
                    </Button>
                    <input
                      id="faculty-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <Label htmlFor="active">Aktif</Label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <Alert className="mb-6">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculties?.map((faculty) => (
          <Card key={faculty.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {faculty.image_url ? (
                    <img 
                      src={faculty.image_url} 
                      alt={faculty.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{faculty.name}</CardTitle>
                    {faculty.dean_name && (
                      <p className="text-sm text-gray-600">Dekan: {faculty.dean_name}</p>
                    )}
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${faculty.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {faculty.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {faculty.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {faculty.description}
                </p>
              )}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(faculty)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(faculty.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!faculties || faculties.length === 0) && (
        <div className="text-center py-12">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada fakultas</p>
          <p className="text-sm text-gray-400">Klik "Tambah Fakultas" untuk membuat fakultas pertama</p>
        </div>
      )}
    </div>
  );
};

export default AdminFaculties;