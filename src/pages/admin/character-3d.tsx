"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Save, 
  Eye, 
  Trash2, 
  Plus, 
  Image as ImageIcon,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Character3D, LandingSettings } from '@/lib/supabase';

const AdminCharacter3D = () => {
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [previewCharacter, setPreviewCharacter] = useState<Character3D | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    model_url: '',
    thumbnail_url: '',
    animation_type: 'idle'
  });

  const queryClient = useQueryClient();

  // Fetch all characters
  const { data: characters, isLoading } = useQuery({
    queryKey: ['characters-3d'],
    queryFn: async () => {
      const { data } = await supabase
        .from('characters_3d')
        .select('*')
        .order('created_at', { ascending: false });
      return data as Character3D[];
    }
  });

  // Fetch current active character
  const { data: landingSettings } = useQuery({
    queryKey: ['landing-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('landing_settings')
        .select('*')
        .single();
      return data as LandingSettings;
    }
  });

  // Upload thumbnail to Supabase Storage
  const uploadThumbnail = async (file: File) => {
    setUploadingThumbnail(true);
    setUploadProgress(0);
    setErrorMessage('');
    
    try {
      console.log('Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        const errorMsg = 'Harap upload file gambar (JPG, PNG, GIF)';
        setErrorMessage(errorMsg);
        setMessage(errorMsg);
        setTimeout(() => {
          setErrorMessage('');
          setMessage('');
        }, 3000);
        setUploadingThumbnail(false);
        return null;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        const errorMsg = 'Ukuran file maksimal 5MB';
        setErrorMessage(errorMsg);
        setMessage(errorMsg);
        setTimeout(() => {
          setErrorMessage('');
          setMessage('');
        }, 3000);
        setUploadingThumbnail(false);
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `character-${Date.now()}.${fileExt}`;
      const filePath = `characters/${fileName}`;

      console.log('Uploading to path:', filePath);

      // Upload to Supabase Storage with progress tracking
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      console.log('Upload response:', { data, error: uploadError });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      setUploadProgress(100);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));
      setMessage('Thumbnail berhasil diupload');
      setTimeout(() => setMessage(''), 3000);
      
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = `Gagal mengupload thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setErrorMessage(errorMsg);
      setMessage(errorMsg);
      setTimeout(() => {
        setErrorMessage('');
        setMessage('');
      }, 5000);
      return null;
    } finally {
      setUploadingThumbnail(false);
      setUploadProgress(0);
    }
  };

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadThumbnail(file);
  };

  // Handle drag and drop
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    
    if (!file) return;

    console.log('File dropped:', file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadThumbnail(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Add new character
  const addCharacterMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Adding character:', data);
      const { error } = await supabase
        .from('characters_3d')
        .insert({
          ...data,
          is_active: false
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters-3d'] });
      setMessage('Karakter 3D berhasil ditambahkan');
      setIsAddDialogOpen(false);
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      const errorMsg = `Gagal menambah: ${error.message}`;
      setErrorMessage(errorMsg);
      setMessage(errorMsg);
      setTimeout(() => {
        setErrorMessage('');
        setMessage('');
      }, 3000);
    }
  });

  // Update active character
  const updateActiveMutation = useMutation({
    mutationFn: async (characterId: string) => {
      // First, deactivate all characters
      await supabase
        .from('characters_3d')
        .update({ is_active: false })
        .neq('id', characterId);

      // Then activate the selected character
      await supabase
        .from('characters_3d')
        .update({ is_active: true })
        .eq('id', characterId);

      // Update landing settings
      await supabase
        .from('landing_settings')
        .upsert({
          id: 1,
          selected_character_id: characterId,
          updated_at: new Date().toISOString()
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters-3d'] });
      queryClient.invalidateQueries({ queryKey: ['landing-settings'] });
      setMessage('Karakter 3D berhasil diaktifkan');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      const errorMsg = `Gagal mengaktifkan: ${error.message}`;
      setErrorMessage(errorMsg);
      setMessage(errorMsg);
      setTimeout(() => {
        setErrorMessage('');
        setMessage('');
      }, 3000);
    }
  });

  // Delete character
  const deleteCharacterMutation = useMutation({
    mutationFn: async (characterId: string) => {
      const { error } = await supabase
        .from('characters_3d')
        .delete()
        .eq('id', characterId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters-3d'] });
      setMessage('Karakter 3D berhasil dihapus');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      const errorMsg = `Gagal menghapus: ${error.message}`;
      setErrorMessage(errorMsg);
      setMessage(errorMsg);
      setTimeout(() => {
        setErrorMessage('');
        setMessage('');
      }, 3000);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      model_url: '',
      thumbnail_url: '',
      animation_type: 'idle'
    });
    setThumbnailPreview(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddCharacter = () => {
    if (!formData.name || !formData.model_url) {
      const errorMsg = 'Nama dan URL model wajib diisi';
      setErrorMessage(errorMsg);
      setMessage(errorMsg);
      setTimeout(() => {
        setErrorMessage('');
        setMessage('');
      }, 3000);
      return;
    }
    addCharacterMutation.mutate(formData);
  };

  const handleActivateCharacter = (characterId: string) => {
    updateActiveMutation.mutate(characterId);
  };

  const handleDeleteCharacter = (characterId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus karakter 3D ini?')) {
      deleteCharacterMutation.mutate(characterId);
    }
  };

  const animationTypes = [
    { value: 'idle', label: 'Diam' },
    { value: 'walking', label: 'Berjalan' },
    { value: 'waving', label: 'Melambai' },
    { value: 'dancing', label: 'Menari' },
    { value: 'jumping', label: 'Melompat' }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Karakter 3D</h1>
          <p className="text-gray-500 mt-1">Atur karakter 3D untuk halaman utama</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="space-x-2">
              <Plus className="w-4 h-4" />
              <span>Tambah Karakter</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Karakter 3D Baru</DialogTitle>
              <DialogDescription>
                Isi form di bawah untuk menambahkan karakter 3D baru. Upload thumbnail dari komputer Anda.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {(message || errorMessage) && (
                <Alert className={message?.includes('berhasil') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  {message?.includes('berhasil') ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{message || errorMessage}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="name">Nama Karakter</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Masukkan nama karakter"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="model_url">URL Model 3D</Label>
                <Input
                  id="model_url"
                  value={formData.model_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, model_url: e.target.value }))}
                  placeholder="https://example.com/model.glb"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Thumbnail Karakter</Label>
                <div className="mt-2">
                  {/* Upload Area */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                      uploadingThumbnail 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => !uploadingThumbnail && fileInputRef.current?.click()}
                  >
                    {thumbnailPreview ? (
                      <div className="relative">
                        <img 
                          src={thumbnailPreview} 
                          alt="Thumbnail preview" 
                          className="mx-auto max-h-48 rounded-lg"
                        />
                        {!uploadingThumbnail && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setThumbnailPreview(null);
                              setFormData(prev => ({ ...prev, thumbnail_url: '' }));
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {uploadingThumbnail && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
                              <p className="text-white text-sm">Mengupload... {uploadProgress}%</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {uploadingThumbnail ? (
                          <div className="space-y-2">
                            <Loader2 className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
                            <p className="text-blue-600">Mengupload... {uploadProgress}%</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            <div>
                              <p className="text-gray-600">Drag & drop gambar di sini atau klik untuk browse</p>
                              <p className="text-sm text-gray-500">PNG, JPG, GIF (Maks. 5MB)</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploadingThumbnail}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="animation_type">Tipe Animasi</Label>
                <select
                  id="animation_type"
                  value={formData.animation_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, animation_type: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={uploadingThumbnail}
                >
                  {animationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button 
                onClick={handleAddCharacter} 
                disabled={addCharacterMutation.isPending || uploadingThumbnail}
                className="w-full"
              >
                {addCharacterMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {uploadingThumbnail ? 'Tunggu Upload Selesai...' : 'Tambah Karakter'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {message && !isAddDialogOpen && (
        <Alert className={message.includes('berhasil') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.includes('berhasil') ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Current Active Character */}
      {landingSettings && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Karakter Aktif Saat Ini</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {characters?.find(c => c.id === landingSettings.selected_character_id) ? (
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center overflow-hidden">
                  {characters.find(c => c.id === landingSettings.selected_character_id)?.thumbnail_url ? (
                    <img 
                      src={characters.find(c => c.id === landingSettings.selected_character_id)?.thumbnail_url} 
                      alt={characters.find(c => c.id === landingSettings.selected_character_id)?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {characters.find(c => c.id === landingSettings.selected_character_id)?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Animasi: {characters.find(c => c.id === landingSettings.selected_character_id)?.animation_type}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Sedang Aktif
                </Badge>
              </div>
            ) : (
              <p className="text-gray-500">Belum ada karakter yang aktif</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters?.map((character) => (
          <Card key={character.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Thumbnail */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {character.thumbnail_url ? (
                    <img 
                      src={character.thumbnail_url} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{character.name}</h3>
                  <p className="text-sm text-gray-600">Animasi: {character.animation_type}</p>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={character.is_active ? "default" : "secondary"}
                    className={character.is_active ? "bg-green-100 text-green-800" : ""}
                  >
                    {character.is_active ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewCharacter(character)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  {!character.is_active && (
                    <Button
                      size="sm"
                      onClick={() => handleActivateCharacter(character.id)}
                      disabled={updateActiveMutation.isPending}
                      className="flex-1"
                    >
                      {updateActiveMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      Aktifkan
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCharacter(character.id)}
                    disabled={deleteCharacterMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      {previewCharacter && (
        <Dialog open={!!previewCharacter} onOpenChange={() => setPreviewCharacter(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Preview: {previewCharacter.name}</DialogTitle>
              <DialogDescription>
                Preview karakter 3D yang akan ditampilkan di halaman utama
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                {previewCharacter.thumbnail_url ? (
                  <img 
                    src={previewCharacter.thumbnail_url} 
                    alt={previewCharacter.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Preview tidak tersedia</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Model URL:</span>
                  <p className="text-gray-600 break-all">{previewCharacter.model_url}</p>
                </div>
                <div>
                  <span className="font-semibold">Animasi:</span>
                  <p className="text-gray-600">{previewCharacter.animation_type}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminCharacter3D;