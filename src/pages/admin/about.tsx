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
import { supabase, AboutContent, Feature, Stat } from '@/lib/supabase'; // Import Feature and Stat

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
    features: [], // Initialize with empty array
    stats: []     // Initialize with empty array
  });

  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [newFeature, setNewFeature] = useState<Omit<Feature, 'id'>>({ title: '', description: '', icon: 'GraduationCap' });
  const [newStat, setNewStat] = useState<Omit<Stat, 'id'>>({ number: '', label: '' });

  const queryClient = useQueryClient();

  // Default hardcoded values for features and stats if not present in DB
  const defaultFeatures: Feature[] = [
    {
      id: '1',
      title: 'Pendidikan Berkualitas',
      description: 'Program studi terakreditasi dengan kurikulum modern dan relevan',
      icon: 'GraduationCap'
    },
    {
      id: '2',
      title: 'Dosen Profesional',
      description: 'Tenaga pengajar berpengalaman dan ahli di bidangnya masing-masing',
      icon: 'Users'
    },
    {
      id: '3',
      title: 'Prestasi Membanggakan',
      description: 'Berbagai prestasi akademik dan non-akademik tingkat nasional',
      icon: 'Award'
    },
    {
      id: '4',
      title: 'Fasilitas Lengkap',
      description: 'Laboratorium, perpustakaan, dan fasilitas pendukung pembelajaran modern',
      icon: 'BookOpen'
    }
  ];

  const defaultStats: Stat[] = [
    { id: '1', number: '5000+', label: 'Mahasiswa Aktif' },
    { id: '2', number: '50+', label: 'Program Studi' },
    { id: '3', number: '200+', label: 'Dosen Profesional' },
    { id: '4', number: '95%', label: 'Tingkat Kelulusan' }
  ];

  // Fetch about content
  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about')
        .select('*')
        .maybeSingle();
      return data as AboutContent;
    },
    onSuccess: (data) => {
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          mission: data.mission || '',
          vision: data.vision || '',
          history: data.history || '',
          features: data.features || defaultFeatures, // Use DB data or default
          stats: data.stats || defaultStats         // Use DB data or default
        });
      } else {
        // If no data in DB, initialize with defaults
        setFormData({
          title: '',
          description: '',
          mission: '',
          vision: '',
          history: '',
          features: defaultFeatures,
          stats: defaultStats
        });
      }
    }
  });

  // Update or Insert about content
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<AboutContent>) => {
      const payload = {
        ...data,
        updated_at: new Date().toISOString()
      };

      if (aboutContent?.id) {
        const { error } = await supabase
          .from('about')
          .update(payload)
          .eq('id', aboutContent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      queryClient.invalidateQueries({ queryKey: ['about-public'] }); // Invalidate public cache
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

  // Feature handlers
  const handleAddFeature = () => {
    if (!newFeature.title || !newFeature.description) {
      setMessage('Judul dan deskripsi fitur wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const featureWithId = { ...newFeature, id: Date.now().toString() };
    setFormData(prev => ({ ...prev, features: [...(prev.features || []), featureWithId] }));
    setNewFeature({ title: '', description: '', icon: 'GraduationCap' });
    setMessage('Fitur berhasil ditambahkan ke daftar. Klik Simpan untuk menyimpan ke database.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateFeature = () => {
    if (!editingFeature?.title || !editingFeature?.description) {
      setMessage('Judul dan deskripsi fitur wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).map(f => f.id === editingFeature.id ? editingFeature : f)
    }));
    setEditingFeature(null);
    setMessage('Fitur berhasil diperbarui di daftar. Klik Simpan untuk menyimpan ke database.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteFeature = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus fitur ini?')) {
      setFormData(prev => ({
        ...prev,
        features: (prev.features || []).filter(f => f.id !== id)
      }));
      setMessage('Fitur berhasil dihapus dari daftar. Klik Simpan untuk menyimpan ke database.');
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
    const statWithId = { ...newStat, id: Date.now().toString() };
    setFormData(prev => ({ ...prev, stats: [...(prev.stats || []), statWithId] }));
    setNewStat({ number: '', label: '' });
    setMessage('Statistik berhasil ditambahkan ke daftar. Klik Simpan untuk menyimpan ke database.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateStat = () => {
    if (!editingStat?.number || !editingStat?.label) {
      setMessage('Angka dan label statistik wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setFormData(prev => ({
      ...prev,
      stats: (prev.stats || []).map(s => s.id === editingStat.id ? editingStat : s)
    }));
    setEditingStat(null);
    setMessage('Statistik berhasil diperbarui di daftar. Klik Simpan untuk menyimpan ke database.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteStat = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus statistik ini?')) {
      setFormData(prev => ({
        ...prev,
        stats: (prev.stats || []).filter(s => s.id !== id)
      }));
      setMessage('Statistik berhasil dihapus dari daftar. Klik Simpan untuk menyimpan ke database.');
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
              <Dialog open={!!newFeature.title} onOpenChange={(open) => !open && setNewFeature({ title: '', description: '', icon: 'GraduationCap' })}>
                <DialogTrigger asChild>
                  <Button size="sm">
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
                      <Button variant="outline" onClick={() => setNewFeature({ title: '', description: '', icon: 'GraduationCap' })}>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingFeature(feature)}
                        >
                          Edit
                        </Button>
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
              <Dialog open={!!newStat.number} onOpenChange={(open) => !open && setNewStat({ number: '', label: '' })}>
                <DialogTrigger asChild>
                  <Button size="sm">
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
                      <Button variant="outline" onClick={() => setNewStat({ number: '', label: '' })}>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingStat(stat)}
                      >
                        Edit
                      </Button>
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

      {/* Edit Feature Dialog */}
      <Dialog open={!!editingFeature} onOpenChange={() => setEditingFeature(null)}>
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

      {/* Edit Stat Dialog */}
      <Dialog open={!!editingStat} onOpenChange={() => setEditingStat(null)}>
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
    </div>
  );
};

export default AdminAbout;