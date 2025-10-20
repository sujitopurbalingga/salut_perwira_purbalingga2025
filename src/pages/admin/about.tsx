"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const AdminAbout = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const queryClient = useQueryClient();

  // Fetch about data
  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about')
        .select('*')
        .single();
      return data;
    }
  });

  // Update about data when loaded
  React.useEffect(() => {
    if (aboutData) {
      setTitle(aboutData.title);
      setContent(aboutData.content);
      setImageUrl(aboutData.image_url || '');
      setIsEditing(true);
    }
  }, [aboutData]);

  // Save/update about
  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; image_url: string }) => {
      if (aboutData?.id) {
        // Update existing
        const { error } = await supabase
          .from('about')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', aboutData.id);
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('about')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      setMessage('Tentang berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal menyimpan: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const handleSave = () => {
    if (!title || !content) {
      setMessage('Judul dan konten wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    saveMutation.mutate({
      title,
      content,
      image_url: imageUrl
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `about-${Date.now()}.${fileExt}`;
    const filePath = `about/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Tentang</h1>
        <p className="text-gray-600">Kelola informasi halaman Tentang kami</p>
      </div>

      {message && (
        <Alert className="mb-6">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informasi Tentang</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul halaman tentang"
            />
          </div>

          <div>
            <Label htmlFor="image">Gambar</Label>
            <div className="space-y-3">
              {imageUrl && (
                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="About" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {imageUrl ? 'Ganti Gambar' : 'Upload Gambar'}
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {imageUrl && (
                <div>
                  <Label htmlFor="image-url">URL Gambar</Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL gambar"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="content">Konten</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Masukkan konten halaman tentang"
              rows={10}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAbout;