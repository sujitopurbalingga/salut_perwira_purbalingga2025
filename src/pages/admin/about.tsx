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
import { getLucideIcon } from '@/lib/utils'; // Import getLucideIcon

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
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mission: '',
    vision: '',
    history: ''
  });

  const [features, setFeatures] = useState<Feature[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [newFeature, setNewFeature] = useState({ title: '', description: '', icon: 'GraduationCap' });
  const [newStat, setNewStat] = useState({ number: '', label: '' });

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

  // Update or Insert about content
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const contentToSave = {
        ...data,
        features: features, // Save features
        stats: stats, // Save stats
        updated_at: new Date().toISOString()
      };

      if (aboutContent?.id) {
        const { error } = await supabase
          .from('about')
          .update(contentToSave)
          .eq('id', aboutContent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about')
          .insert(contentToSave);
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

  React.useEffect(() => {
    if (aboutContent) {
      setFormData({
        title: aboutContent.title || '',
        description: aboutContent.description || '',
        mission: aboutContent.mission || '',
        vision: aboutContent.vision || '',
        history: aboutContent.history || ''
      });
      // Load features and stats from database
      setFeatures((aboutContent.features as Feature[] | undefined) || []);
      setStats((aboutContent.stats as Stat[] | undefined) || []);
    } else {
      // Set default hardcoded values if no content exists yet (for initial setup)
      setFeatures([
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
      ]);
      setStats([
        { id: '1', number: '5000+', label: 'Mahasiswa Aktif' },
        { id: '2', number: '50+', label: 'Program Studi' },
        { id: '3', number: '200+', label: 'Dosen Profesional' },
        { id: '4', number: '95%', label: 'Tingkat Kelulusan' }
      ]);
    }
  }, [aboutContent]);

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Feature mutations
  const addFeatureMutation = useMutation({
    mutationFn: async (feature: Omit<Feature, 'id'>) => {
      const newFeature = {
        ...feature,
        id: Date.now().toString()
      };
      setFeatures(prev => [...prev, newFeature]);
    },
    onSuccess: () => {
      setMessage('Fitur berhasil ditambahkan! Jangan lupa klik Simpan.');
      setNewFeature({ title: '', description: '', icon: 'GraduationCap' });
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const updateFeatureMutation = useMutation({
    mutationFn: async (feature: Feature) => {
      setFeatures(prev => prev.map(f => f.id === feature.id ? feature : f));
    },
    onSuccess: () => {
      setMessage('Fitur berhasil diperbarui! Jangan lupa klik Simpan.');
      setEditingFeature(null);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const deleteFeatureMutation = useMutation({
    mutationFn: async (id: string) => {
      setFeatures(prev => prev.filter(f => f.id !== id));
    },
    onSuccess: () => {
      setMessage('Fitur berhasil dihapus! Jangan lupa klik Simpan.');
      setEditingFeature(null);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  // Stat mutations
  const addStatMutation = useMutation({
    mutationFn: async (stat: Omit<Stat, 'id'>) => {
      const newStat = {
        ...stat,
        id: Date.now().toString()
      };
      setStats(prev => [...prev, newStat]);
    },
    onSuccess: () => {
      setMessage('Statistik berhasil ditambahkan! Jangan lupa klik Simpan.');
      setNewStat({ number: '', label: '' });
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const updateStatMutation = useMutation({
    mutationFn: async (stat: Stat) => {
      setStats(prev => prev.map(s => s.id === stat.id ? stat : s));
    },
    onSuccess: () => {
      setMessage('Statistik berhasil diperbarui! Jangan lupa klik Simpan.');
      setEditingStat(null);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const deleteStatMutation = useMutation({
    mutationFn: async (id: string) => {
      setStats(prev => prev.filter(s => s.id !== id));
    },
    onSuccess: () => {
      setMessage('Statistik berhasil dihapus! Jangan lupa klik Simpan.');
      setEditingStat(null);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const handleAddFeature = () => {
    if (!newFeature.title || !newFeature.description) {
      setMessage('Judul dan deskripsi fitur wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    addFeatureMutation.mutate(newFeature);
  };

  const handleUpdateFeature = () => {
    if (!editingFeature?.title || !editingFeature?.description) {
      setMessage('Judul dan deskripsi fitur wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    updateFeatureMutation.mutate(editingFeature);
  };

  const handleDeleteFeature = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus fitur ini?')) {
      deleteFeatureMutation.mutate(id);
    }
  };

  const handleAddStat = () => {
    if (!newStat.number || !newStat.label) {
      setMessage('Angka dan label statistik wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    addStatMutation.mutate(newStat);
  };

  const handleUpdateStat = () => {
    if (!editingStat?.number || !editingStat?.label) {
      setMessage('Angka dan label statistik wajib diisi');
      setTimeout(() => setMessage(''), 3003);
      return;
    }
    updateStatMutation.mutate(editingStat);
  };

  const handleDeleteStat = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus statistik ini?')) {
      deleteStatMutation.mutate(id);
    }
  };

  const iconOptions = [
    { value: 'GraduationCap', label: 'Graduation Cap' },
    { value: 'Users', label: 'Users' },
    { value: 'Award', label: 'Award' },
    { value: 'BookOpen', label: 'Book Open' },
    { value: 'Target', label: 'Target' },
    { value: 'Globe', label: 'Globe' },
    { value: 'Briefcase', label: 'Briefcase' },
    { value: 'MessageSquare', label: 'Message Square' },
  ];

  const getIconComponent = (iconName: string) => {
    const IconComponent = getLucideIcon(iconName);
    return IconComponent || GraduationCap;
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
                
                <h3 className="text-xl font-bold pt-4">Fitur Unggulan</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const colors = getColorClasses(index);
                    const IconComponent = getIconComponent(feature.icon);
                    return (
                      <div key={feature.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <IconComponent className={`w-6 h-6 ${colors.text} flex-shrink-0`} />
                        <div>
                          <h4 className="font-semibold">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h3 className="text-xl font-bold pt-4">Statistik</h3>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.id} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
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
              <span>Fitur Unggulan ({features.length})</span>
            </span>
            {isEditing && (
              <Dialog open={!!newFeature.title} onOpenChange={(open) => !open && setNewFeature({ title: '', description: '', icon: 'GraduationCap' })}>
                <DialogTrigger asChild>
                  <Button onClick={() => setNewFeature({ title: '', description: '', icon: 'GraduationCap' })} disabled={addFeatureMutation.isPending} size="sm">
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
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setNewFeature({ title: '', description: '', icon: 'GraduationCap' })}>
                        Batal
                      </Button>
                      <Button onClick={handleAddFeature} disabled={addFeatureMutation.isPending}>
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
            {features.map((feature, index) => {
              const colors = getColorClasses(index);
              const IconComponent = getIconComponent(feature.icon);
              
              return (
                <Card key={feature.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{feature.description}</p>
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
                                  {iconOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setEditingFeature(null)}>
                                  Batal
                                </Button>
                                <Button onClick={handleUpdateFeature} disabled={updateFeatureMutation.isPending}>
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
                          disabled={deleteFeatureMutation.isPending}
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
              <span>Statistik & Pencapaian ({stats.length})</span>
            </span>
            {isEditing && (
              <Dialog open={!!newStat.number} onOpenChange={(open) => !open && setNewStat({ number: '', label: '' })}>
                <DialogTrigger asChild>
                  <Button onClick={() => setNewStat({ number: '', label: '' })} disabled={addStatMutation.isPending} size="sm">
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
                      <Button onClick={handleAddStat} disabled={addStatMutation.isPending}>
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
            {stats.map((stat) => (
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
                              <Button onClick={handleUpdateStat} disabled={updateStatMutation.isPending}>
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
                        disabled={deleteStatMutation.isPending}
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