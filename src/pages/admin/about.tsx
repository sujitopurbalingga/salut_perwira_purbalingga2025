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
  FileText, 
  Info,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, AboutContent } from '@/lib/supabase';

const AdminAbout = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mission: '',
    vision: '',
    history: ''
  });

  const queryClient = useQueryClient();

  // Fetch about content
  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about')
        .select('*')
        .single();
      return data as AboutContent;
    }
  });

  // Update about content
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('about')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', aboutContent?.id || 1); // Assuming a single 'about' entry with ID 1
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      setMessage('Konten berhasil diperbarui');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal memperbarui: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  React.useEffect(() => {
    if (aboutContent) {
      setFormData({
        title: aboutContent.title || '',
        description: aboutContent.description || '',
        mission: aboutContent.mission || '',
        vision: aboutContent.vision || '',
        history: aboutContent.history || ''
      });
    }
  }, [aboutContent]);

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Tentang Kami</h1>
          <p className="text-gray-500 mt-1">Edit konten halaman Tentang Kami</p>
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
                <DialogTitle>Preview Halaman Tentang</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{formData.title}</h2>
                  <p className="text-gray-600 mt-2 whitespace-pre-wrap">{formData.description}</p>
                </div>
                {formData.vision && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Visi</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{formData.vision}</p>
                  </div>
                )}
                {formData.mission && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Misi</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{formData.mission}</p>
                  </div>
                )}
                {formData.history && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sejarah</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{formData.history}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="space-x-2">
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={updateMutation.isPending} className="space-x-2">
              {updateMutation.isPending ? (
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

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-indigo-600" />
              <span>Informasi Utama</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={!isEditing}
                placeholder="Tentang Kami"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!isEditing}
                placeholder="Deskripsi tentang institusi..."
                rows={6}
                className="mt-1 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span>Konten Tambahan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vision">Visi</Label>
              <Textarea
                id="vision"
                value={formData.vision}
                onChange={(e) => handleInputChange('vision', e.target.value)}
                disabled={!isEditing}
                placeholder="Visi institusi..."
                rows={3}
                className="mt-1 resize-none"
              />
            </div>
            <div>
              <Label htmlFor="mission">Misi</Label>
              <Textarea
                id="mission"
                value={formData.mission}
                onChange={(e) => handleInputChange('mission', e.target.value)}
                disabled={!isEditing}
                placeholder="Misi institusi..."
                rows={3}
                className="mt-1 resize-none"
              />
            </div>
            <div>
              <Label htmlFor="history">Sejarah</Label>
              <Textarea
                id="history"
                value={formData.history}
                onChange={(e) => handleInputChange('history', e.target.value)}
                disabled={!isEditing}
                placeholder="Sejarah institusi..."
                rows={3}
                className="mt-1 resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      {aboutContent?.updated_at && (
        <div className="text-center text-sm text-gray-500">
          Terakhir diperbarui: {new Date(aboutContent.updated_at).toLocaleString('id-ID')}
        </div>
      )}
    </div>
  );
};

export default AdminAbout;