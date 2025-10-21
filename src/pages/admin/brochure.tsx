"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, FileText, Download, Upload, Eye, EyeOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Brochure {
  id: string;
  title: string;
  file_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminBrochure = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrochure, setEditingBrochure] = useState<Brochure | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    file_url: '',
    is_active: true
  });
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  // Fetch brochures
  const { data: brochures, isLoading } = useQuery({
    queryKey: ['brochures'],
    queryFn: async () => {
      const { data } = await supabase
        .from('brochure')
        .select('*')
        .order('created_at', { ascending: false });
      return data as Brochure[];
    }
  });

  // Create/update brochure
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Brochure>) => {
      if (editingBrochure) {
        const { error } = await supabase
          .from('brochure')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', editingBrochure.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('brochure')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brochures'] });
      setIsDialogOpen(false);
      setEditingBrochure(null);
      resetForm();
      setMessage('Brosur berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal menyimpan: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  // Delete brochure
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // First get the brochure to get the file URL
      const { data: brochure } = await supabase
        .from('brochure')
        .select('file_url')
        .eq('id', id)
        .single();

      // Delete from storage if file exists
      if (brochure?.file_url) {
        const filePath = brochure.file_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('brochures')
            .remove([`brochures/${filePath}`]);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('brochure')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brochures'] });
      setMessage('Brosur berhasil dihapus');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal menghapus: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('brochure')
        .update({ 
          is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brochures'] });
      setMessage('Status berhasil diperbarui');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal memperbarui status: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      file_url: '',
      is_active: true
    });
  };

  const handleEdit = (brochure: Brochure) => {
    setEditingBrochure(brochure);
    setFormData({
      title: brochure.title,
      file_url: brochure.file_url,
      is_active: brochure.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.file_url) {
      setMessage('Judul dan file brosur wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    saveMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus brosur ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type (PDF, DOC, DOCX, JPG, PNG, JPEG)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage('Harap upload file PDF, DOC, DOCX, JPG, PNG, atau JPEG');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage('Ukuran file maksimal 10MB');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `brochure-${Date.now()}.${fileExt}`;
    const filePath = `brochures/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('brochures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('brochures')
        .getPublicUrl(filePath);

      setFormData({ ...formData, file_url: publicUrl });
      setMessage('File berhasil diunggah');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Gagal mengunggah file');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = (brochure: Brochure) => {
    toggleActiveMutation.mutate({
      id: brochure.id,
      is_active: !brochure.is_active
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Brosur</h1>
          <p className="text-gray-600">Kelola brosur yang dapat diunduh oleh pengunjung</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Brosur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingBrochure ? 'Edit Brosur' : 'Tambah Brosur Baru'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="title">Judul Brosur</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul brosur"
                />
              </div>

              <div>
                <Label>File Brosur</Label>
                <div className="space-y-3">
                  {formData.file_url && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">File saat ini:</p>
                      <a 
                        href={formData.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Lihat File
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('brochure-file-upload')?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {formData.file_url ? 'Ganti File' : 'Upload File'}
                    </Button>
                    <input
                      id="brochure-file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/jpeg,image/jpg,image/png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Format: PDF, DOC, DOCX, JPG, PNG, JPEG (Maks: 10MB)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <Label htmlFor="active">Tampilkan di website</Label>
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
                  disabled={saveMutation.isPending || uploading}
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

      <div className="space-y-4">
        {brochures?.map((brochure) => (
          <Card key={brochure.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{brochure.title}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${brochure.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        {brochure.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Diunggah: {new Date(brochure.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={brochure.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Unduh
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(brochure)}
                    disabled={toggleActiveMutation.isPending}
                  >
                    {brochure.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(brochure)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(brochure.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!brochures || brochures.length === 0) && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada brosur</p>
          <p className="text-sm text-gray-400">Klik "Tambah Brosur" untuk mengupload brosur pertama</p>
        </div>
      )}
    </div>
  );
};

export default AdminBrochure;