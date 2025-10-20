"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, Newspaper } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/admin/auth-provider';

interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  author_id: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const AdminNews = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    is_published: false
  });
  const [message, setMessage] = useState('');

  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch news
  const { data: news, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      return data as News[];
    }
  });

  // Create/update news
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<News>) => {
      const newsData = {
        ...data,
        author_id: user?.id,
        published_at: data.is_published ? new Date().toISOString() : null
      };

      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update({ ...newsData, updated_at: new Date().toISOString() })
          .eq('id', editingNews.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('news')
          .insert(newsData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setIsDialogOpen(false);
      setEditingNews(null);
      resetForm();
      setMessage('Berita berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal menyimpan: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  // Delete news
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setMessage('Berita berhasil dihapus');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal menghapus: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  // Toggle publish status
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('news')
        .update({ 
          is_published,
          published_at: is_published ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setMessage('Status publikasi berhasil diubah');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal mengubah status: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      is_published: false
    });
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt || '',
      image_url: newsItem.image_url || '',
      is_published: newsItem.is_published
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      setMessage('Judul dan konten wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    saveMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleTogglePublish = (newsItem: News) => {
    togglePublishMutation.mutate({
      id: newsItem.id,
      is_published: !newsItem.is_published
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `news-${Date.now()}.${fileExt}`;
    const filePath = `news/${fileName}`;

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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Berita</h1>
          <p className="text-gray-600">Kelola berita yang ditampilkan di website</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Berita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? 'Edit Berita' : 'Tambah Berita Baru'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="title">Judul Berita</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul berita"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Ringkasan (Opsional)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Masukkan ringkasan berita"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Konten Berita</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Masukkan konten berita lengkap"
                  rows={10}
                />
              </div>

              <div>
                <Label>Gambar</Label>
                <div className="space-y-3">
                  {formData.image_url && (
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={formData.image_url} 
                        alt="News" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('news-image-upload')?.click()}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload Gambar
                    </Button>
                    <input
                      id="news-image-upload"
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
                  id="published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
                <Label htmlFor="published">Publikasikan sekarang</Label>
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

      <div className="space-y-4">
        {news?.map((newsItem) => (
          <Card key={newsItem.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CardTitle className="text-xl">{newsItem.title}</CardTitle>
                    <Badge variant={newsItem.is_published ? 'default' : 'secondary'}>
                      {newsItem.is_published ? 'Dipublikasi' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(newsItem.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {newsItem.published_at && (
                      <span className="ml-3">
                        Dipublikasi: {new Date(newsItem.published_at).toLocaleDateString('id-ID')}
                      </span>
                    )}
                  </p>
                </div>
                {newsItem.image_url && (
                  <img 
                    src={newsItem.image_url} 
                    alt={newsItem.title}
                    className="w-24 h-24 rounded-lg object-cover ml-4"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {newsItem.excerpt && (
                <p className="text-gray-600 mb-4">{newsItem.excerpt}</p>
              )}
              <p className="text-gray-700 mb-4 line-clamp-3">
                {newsItem.content}
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTogglePublish(newsItem)}
                  disabled={togglePublishMutation.isPending}
                >
                  {newsItem.is_published ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(newsItem)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(newsItem.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!news || news.length === 0) && (
        <div className="text-center py-12">
          <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada berita</p>
          <p className="text-sm text-gray-400">Klik "Tambah Berita" untuk membuat berita pertama</p>
        </div>
      )}
    </div>
  );
};

export default AdminNews;