"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, FileText, Download, Upload, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Brochure {
  id: string;
  title: string;
  file_url: string;
  thumbnail_url?: string; // Added thumbnail_url
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
    thumbnail_url: '', // Initialize thumbnail_url
    is_active: true
  });
  const [message, setMessage] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

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
      queryClient.invalidateQueries({ queryKey: ['brochures'] }); // Invalidate for admin view
      queryClient.invalidateQueries({ queryKey: ['brochures-public'] }); // Invalidate for public view
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
      // First get the brochure to get the file URL and thumbnail URL
      const { data: brochure } = await supabase
        .from('brochure')
        .select('file_url, thumbnail_url')
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
      // Delete thumbnail from storage if it exists
      if (brochure?.thumbnail_url) {
        const thumbnailPath = brochure.thumbnail_url.split('/').pop();
        if (thumbnailPath) {
          await supabase.storage
            .from('brochures') // Assuming thumbnails are in the same bucket
            .remove([`brochures/${thumbnailPath}`]);
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
      queryClient.invalidateQueries({ queryKey: ['brochures'] }); // Invalidate for admin view
      queryClient.invalidateQueries({ queryKey: ['brochures-public'] }); // Invalidate for public view
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
      queryClient.invalidateQueries({ queryKey: ['brochures'] }); // Invalidate for admin view
      queryClient.invalidateQueries({ queryKey: ['brochures-public'] }); // Invalidate for public view
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
      thumbnail_url: '',
      is_active: true
    });
  };

  const handleEdit = (brochure: Brochure) => {
    setEditingBrochure(brochure);
    setFormData({
      title: brochure.title,
      file_url: brochure.file_url,
      thumbnail_url: brochure.thumbnail_url || '',
      is_active: brochure.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // Clear previous messages
    setMessage('');
    
    // Enhanced validation
    if (!formData.title || formData.title.trim() === '') {
      setMessage('Judul brosur wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    if (!formData.file_url || formData.file_url.trim() === '') {
      setMessage('File brosur wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    console.log('Form validation passed:', {
      title: formData.title,
      file_url: formData.file_url,
      thumbnail_url: formData.thumbnail_url,
      is_active: formData.is_active
    });

    saveMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus brosur ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // Check file type (PDF, DOC, DOCX, JPG, PNG, JPEG)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    console.log('File type validation:', {
      fileType: file.type,
      allowedTypes,
      isAllowed: allowedTypes.includes(file.type)
    });

    if (!allowedTypes.includes(file.type)) {
      const errorMessage = `File type tidak didukung: ${file.type}. Harap upload file PDF, DOC, DOCX, JPG, PNG, atau JPEG`;
      console.error('File type validation failed:', errorMessage);
      setMessage(errorMessage);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    console.log('File size validation:', {
      fileSize: file.size,
      maxSize,
      isValid: file.size <= maxSize
    });

    if (file.size > maxSize) {
      const errorMessage = `Ukuran file terlalu besar: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maksimal 10MB`;
      console.error('File size validation failed:', errorMessage);
      setMessage(errorMessage);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploadingFile(true);
    setMessage('Mengupload file...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `brochure-${Date.now()}.${fileExt}`;
      const filePath = `brochures/${fileName}`;

      console.log('Starting upload:', {
        fileName,
        filePath,
        fileExt
      });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('brochures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      console.log('Upload result:', {
        uploadData,
        uploadError
      });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      if (!uploadData) {
        throw new Error('Upload returned no data');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('brochures')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);

      if (!publicUrl) {
        throw new Error('Failed to generate public URL');
      }

      // Update form data with the uploaded file URL
      setFormData(prev => ({ ...prev, file_url: publicUrl }));
      setMessage('File berhasil diunggah');
      setTimeout(() => setMessage(''), 3000);

      console.log('Upload successful:', {
        fileName,
        publicUrl
      });

    } catch (error) {
      console.error('Complete upload error:', error);
      let errorMessage = 'Gagal mengunggah file';
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      } else {
        errorMessage += ': Terjadi kesalahan tidak diketahui';
      }
      
      setMessage(errorMessage);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (only images)
    if (!file.type.startsWith('image/')) {
      setMessage('Thumbnail harus berupa file gambar (JPG, PNG, GIF)');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setMessage(`Ukuran thumbnail terlalu besar: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maksimal 5MB`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploadingThumbnail(true);
    setMessage('Mengupload thumbnail...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `brochure-thumbnail-${Date.now()}.${fileExt}`;
      const filePath = `brochures/${fileName}`; // Store thumbnails in the same 'brochures' bucket

      const { error: uploadError } = await supabase.storage
        .from('brochures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('brochures')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));
      setMessage('Thumbnail berhasil diunggah');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Gagal mengunggah thumbnail: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUploadingThumbnail(false);
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
                <Label htmlFor="title">Judul Brosur *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul brosur"
                  required
                />
              </div>

              <div>
                <Label>File Brosur *</Label>
                <div className="space-y-3">
                  {formData.file_url && (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-2">File saat ini:</p>
                      <div className="flex items-center justify-between">
                        <a 
                          href={formData.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center truncate max-w-xs"
                        >
                          <FileText className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{formData.file_url.split('/').pop()}</span>
                        </a>
                        <span className="text-xs text-green-600">✓ Terupload</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('brochure-file-upload')?.click()}
                      disabled={uploadingFile}
                    >
                      {uploadingFile ? (
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

              <div>
                <Label>Thumbnail Brosur (Opsional)</Label>
                <div className="space-y-3">
                  {formData.thumbnail_url && (
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={formData.thumbnail_url} 
                        alt="Brochure Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('brochure-thumbnail-upload')?.click()}
                      disabled={uploadingThumbnail}
                    >
                      {uploadingThumbnail ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ImageIcon className="w-4 h-4 mr-2" />
                      )}
                      {formData.thumbnail_url ? 'Ganti Thumbnail' : 'Upload Thumbnail'}
                    </Button>
                    <input
                      id="brochure-thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Format: JPG, PNG, GIF (Maks: 5MB)
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
                  disabled={saveMutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending || uploadingFile || uploadingThumbnail}
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
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {brochure.thumbnail_url ? (
                      <img src={brochure.thumbnail_url} alt={brochure.title} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-6 h-6 text-blue-600" />
                    )}
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