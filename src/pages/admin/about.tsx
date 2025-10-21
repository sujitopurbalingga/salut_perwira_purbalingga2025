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
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  GraduationCap,
  Users,
  Award,
  BookOpen
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, AboutContent } from '@/lib/supabase';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Stat {
  id: string;
  number: string;
  label: string;
}

const AdminAbout = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<AboutContent>>({
    title: '',
    description: '',
    mission: '',
    vision: '',
    history: '',
    features: [],
    stats: []
  });

  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [newFeature, setNewFeature] = useState({ title: '', description: '', icon: 'GraduationCap' });
  const [newStat, setNewStat] = useState({ number: '', label: '' });

  // New state for controlling new feature/stat dialogs
  const [isNewFeatureDialogOpen, setIsNewFeatureDialogOpen] = useState(false);
  const [isNewStatDialogOpen, setIsNewStatDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch about content
  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about')
        .select('*')
        .maybeSingle();
      return data as AboutContent;
    }
  });

  // Update form data when about content changes
  React.useEffect(() => {
    if (aboutContent) {
      setFormData({
        title: aboutContent.title || '',
        description: aboutContent.description || '',
        mission: aboutContent.mission || '',
        vision: aboutContent.vision || '',
        history: aboutContent.history || '',
        features: aboutContent.features || [],
        stats: aboutContent.stats || []
      });
    } else {
      // Initialize with default empty arrays if no content exists
      setFormData(prev => ({
        ...prev,
        features: [],
        stats: []
      }));
    }
  }, [aboutContent]);

  // Update or Insert about content
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<AboutContent>) => {
      if (aboutContent?.id) {
        const { error } = await supabase
          .from('about')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', aboutContent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about')
          .insert({
            ...data,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
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

  const handleInputChange = (field: keyof typeof formData, value: string | Array<any>) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Feature handlers
  const handleAddFeature = () => {
    if (!newFeature.title || !newFeature.description) {
      setMessage('Judul dan deskripsi fitur wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const newId = Date.now().toString();
    const updatedFeatures = [...(formData.features || []), { ...newFeature, id: newId }];
    handleInputChange('features', updatedFeatures);
    setNewFeature({ title: '', description: '', icon: 'GraduationCap' });
    setIsNewFeatureDialogOpen(false); // Close dialog on add
    setMessage('Fitur berhasil ditambahkan! Jangan lupa Simpan.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateFeature = () => {
    if (!editingFeature?.title || !editingFeature?.description) {
      setMessage('Judul dan deskripsi fitur wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const updatedFeatures = (formData.features || []).map(f => 
      f.id === editingFeature.id ? editingFeature : f
    );
    handleInputChange('features', updatedFeatures);
    setEditingFeature(null);
    setMessage('Fitur berhasil diperbarui! Jangan lupa Simpan.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteFeature = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus fitur ini?')) {
      const updatedFeatures = (formData.features || []).filter(f => f.id !== id);
      handleInputChange('features', updatedFeatures);
      setMessage('Fitur berhasil dihapus! Jangan lupa Simpan.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Stat handlers
  const handleAddStat = () => {
    if (!newStat.number || !newStat.label) {
      setMessage('Angka dan label statistik wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const newId = Date.now().toString();
    const updatedStats = [...(formData.stats || []), { ...newStat, id: newId }];
    handleInputChange('stats', updatedStats);
    setNewStat({ number: '', label: '' });
    setIsNewStatDialogOpen(false); // Close dialog on add
    setMessage('Statistik berhasil ditambahkan! Jangan lupa Simpan.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateStat = () => {
    if (!editingStat?.number || !editingStat?.label) {
      setMessage('Angka dan label statistik wajib diisi');
      setTimeout(() => setMessage(''), 3003);
      return;
    }
    const updatedStats = (formData.stats || []).map(s => 
      s.id === editingStat.id ? editingStat : s
    );
    handleInputChange('stats', updatedStats);
    setEditingStat(null);
    setMessage('Statistik berhasil diperbarui! Jangan lupa Simpan.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteStat = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus statistik ini?')) {
      const updatedStats = (formData.stats || []).filter(s => s.id !== id);
      handleInputChange('stats', updatedStats);
      setMessage('Statistik berhasil dihapus! Jangan lupa Simpan.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      GraduationCap,
      Users,
      Award,
      BookOpen
    };
    return iconMap[iconName] || GraduationCap;
  };

  const getColorClasses = (index: number) => {
    const colors = [
      { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200", badge: "bg-blue-600" },
      { bg: "bg-green-100", text: "text-green-600", border: "border-green-200", badge: "bg-green-600" },
      { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200", badge: "bg-purple-600" },
      { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200", badge: "bg-orange-600" },
      { bg: "bg-red-100", text: "text-red-600", border: "border-red-200", badge: "bg-red-600" },
      { bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-200", badge: "bg-yellow-600" }
    ];
    return colors[index % colors.length];
  };

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
                {/* Preview Features */}
                {formData.features && formData.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Fitur Unggulan</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {formData.features.map((feature) => (
                        <div key={feature.id} className="p-4 border rounded-lg">
                          <p className="font-medium">{feature.title}</p>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Preview Stats */}
                {formData.stats && formData.stats.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Statistik</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {formData.stats.map((stat) => (
                        <div key={stat.id} className="p-4 border rounded-lg text-center">
                          <p className="text-xl font-bold">{stat.number}</p>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                      ))}
                    </div>
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

      {/* Features Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Fitur Unggulan</span>
            </span>
            {isEditing && (
              <Dialog open={isNewFeatureDialogOpen} onOpenChange={setIsNewFeatureDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setNewFeature({ title: '', description: '', icon: 'GraduationCap' });
                      setIsNewFeatureDialogOpen(true);
                    }} 
                    disabled={!isEditing} 
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Fitur
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Tambah Fitur Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-feature-title">Judul</Label>
                      <Input
                        id="new-feature-title"
                        value={newFeature.title}
                        onChange={(e) => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Masukkan judul fitur"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-feature-description">Deskripsi</Label>
                      <Textarea
                        id="new-feature-description"
                        value={newFeature.description}
                        onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Masukkan deskripsi fitur"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-feature-icon">Icon</Label>
                      <select
                        id="new-feature-icon"
                        value={newFeature.icon}
                        onChange={(e) => setNewFeature(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="GraduationCap">GraduationCap</option>
                        <option value="Users">Users</option>
                        <option value="Award">Award</option>
                        <option value="BookOpen">BookOpen</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsNewFeatureDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleAddFeature}>
                        Tambah
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(formData.features || []).map((feature, index) => {
              const colors = getColorClasses(index);
              const IconComponent = getIconComponent(feature.icon);
              
              return (
                <Card key={feature.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                    {isEditing && (
                      <div className="flex justify-center space-x-2">
                        <Dialog open={editingFeature?.id === feature.id} onOpenChange={(open) => !open && setEditingFeature(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingFeature(feature)}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Fitur</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="feature-title">Judul</Label>
                                <Input
                                  id="feature-title"
                                  value={editingFeature?.title || ''}
                                  onChange={(e) => setEditingFeature(prev => prev ? { ...prev, title: e.target.value } : null)}
                                  placeholder="Masukkan judul fitur"
                                />
                              </div>
                              <div>
                                <Label htmlFor="feature-description">Deskripsi</Label>
                                <Textarea
                                  id="feature-description"
                                  value={editingFeature?.description || ''}
                                  onChange={(e) => setEditingFeature(prev => prev ? { ...prev, description: e.target.value } : null)}
                                  placeholder="Masukkan deskripsi fitur"
                                  rows={3}
                                />
                              </div>
                              <div>
                                <Label htmlFor="feature-icon">Icon</Label>
                                <select
                                  id="feature-icon"
                                  value={editingFeature?.icon || 'GraduationCap'}
                                  onChange={(e) => setEditingFeature(prev => prev ? { ...prev, icon: e.target.value } : null)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                  <option value="GraduationCap">GraduationCap</option>
                                  <option value="Users">Users</option>
                                  <option value="Award">Award</option>
                                  <option value="BookOpen">BookOpen</option>
                                </select>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setEditingFeature(null)}>
                                  Batal
                                </Button>
                                <Button onClick={handleUpdateFeature}>
                                  Simpan
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteFeature(feature.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span>Statistik & Pencapaian</span>
            </span>
            {isEditing && (
              <Dialog open={isNewStatDialogOpen} onOpenChange={setIsNewStatDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setNewStat({ number: '', label: '' });
                      setIsNewStatDialogOpen(true);
                    }} 
                    disabled={!isEditing} 
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Statistik
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Tambah Statistik Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-stat-number">Angka</Label>
                      <Input
                        id="new-stat-number"
                        value={newStat.number}
                        onChange={(e) => setNewStat(prev => ({ ...prev, number: e.target.value }))}
                        placeholder="Contoh: 5000+"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-stat-label">Label</Label>
                      <Input
                        id="new-stat-label"
                        value={newStat.label}
                        onChange={(e) => setNewStat(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Contoh: Mahasiswa Aktif"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsNewStatDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleAddStat}>
                        Tambah
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(formData.stats || []).map((stat, index) => (
              <Card key={stat.id} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                  {isEditing && (
                    <div className="flex justify-center space-x-2 mt-4">
                      <Dialog open={editingStat?.id === stat.id} onOpenChange={(open) => !open && setEditingStat(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingStat(stat)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Statistik</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="stat-number">Angka</Label>
                              <Input
                                id="stat-number"
                                value={editingStat?.number || ''}
                                onChange={(e) => setEditingStat(prev => prev ? { ...prev, number: e.target.value } : null)}
                                placeholder="Contoh: 5000+"
                              />
                            </div>
                            <div>
                              <Label htmlFor="stat-label">Label</Label>
                              <Input
                                id="stat-label"
                                value={editingStat?.label || ''}
                                onChange={(e) => setEditingStat(prev => prev ? { ...prev, label: e.target.value } : null)}
                                placeholder="Contoh: Mahasiswa Aktif"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setEditingStat(null)}>
                                Batal
                              </Button>
                              <Button onClick={handleUpdateStat}>
                                Simpan
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteStat(stat.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

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