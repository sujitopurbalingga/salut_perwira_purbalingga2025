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
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface FooterContent {
  id: string;
  brand_name: string;
  brand_description: string;
  address: string;
  phone: string;
  email: string;
  quick_links: Array<{
    id: string;
    name: string;
    href: string;
  }>;
  social_links: Array<{
    id: string;
    platform: string;
    href: string;
  }>;
  newsletter_title: string;
  newsletter_description: string;
  copyright_text: string;
  created_at: string;
  updated_at: string;
}

interface QuickLink {
  id: string;
  name: string;
  href: string;
}

interface SocialLink {
  id: string;
  platform: string;
  href: string;
}

const AdminFooter = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    brand_name: 'SALUT PERWIRA PURBALINGGA',
    brand_description: 'Universitas terkemuka yang berkomitmen untuk mencetak lulusan berkualitas dan siap bersaing di era global.',
    address: 'Jl. Pendidikan No. 123, Wonomulyo, Sulawesi Barat',
    phone: '(0281) 123456',
    email: 'info@salutperwira.ac.id',
    newsletter_title: 'Newsletter',
    newsletter_description: 'Dapatkan informasi terbaru tentang pendaftaran dan program kami',
    copyright_text: '© 2024 SALUT PERWIRA PURBALINGGA. Semua Hak Dilindungi.'
  });

  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([
    { id: '1', name: 'Tentang Kami', href: '#about' },
    { id: '2', name: 'Layanan', href: '#services' },
    { id: '3', name: 'Fakultas', href: '#faculties' },
    { id: '4', name: 'Berita', href: '#news' }
  ]);

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: '1', platform: 'Facebook', href: '#' },
    { id: '2', platform: 'Twitter', href: '#' },
    { id: '3', platform: 'Instagram', href: '#' },
    { id: '4', platform: 'Youtube', href: '#' }
  ]);

  const [editingQuickLink, setEditingQuickLink] = useState<QuickLink | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [newQuickLink, setNewQuickLink] = useState({ name: '', href: '' });
  const [newSocialLink, setNewSocialLink] = useState({ platform: 'Facebook', href: '' });

  const queryClient = useQueryClient();

  // Fetch footer content
  const { data: footerContent, isLoading } = useQuery({
    queryKey: ['footer'],
    queryFn: async () => {
      const { data } = await supabase
        .from('footer_settings')
        .select('*')
        .maybeSingle();
      return data as FooterContent;
    }
  });

  // Update or Insert footer content
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const footerData = {
        ...data,
        quick_links: quickLinks,
        social_links: socialLinks
      };

      if (footerContent?.id) {
        const { error } = await supabase
          .from('footer_settings')
          .update({
            ...footerData,
            updated_at: new Date().toISOString()
          })
          .eq('id', footerContent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('footer_settings')
          .insert(footerData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer'] });
      setMessage('Konten footer berhasil disimpan!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal memperbarui: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  React.useEffect(() => {
    if (footerContent) {
      setFormData({
        brand_name: footerContent.brand_name || 'SALUT PERWIRA PURBALINGGA',
        brand_description: footerContent.brand_description || 'Universitas terkemuka yang berkomitmen untuk mencetak lulusan berkualitas dan siap bersaing di era global.',
        address: footerContent.address || 'Jl. Pendidikan No. 123, Wonomulyo, Sulawesi Barat',
        phone: footerContent.phone || '(0281) 123456',
        email: footerContent.email || 'info@salutperwira.ac.id',
        newsletter_title: footerContent.newsletter_title || 'Newsletter',
        newsletter_description: footerContent.newsletter_description || 'Dapatkan informasi terbaru tentang pendaftaran dan program kami',
        copyright_text: footerContent.copyright_text || '© 2024 SALUT PERWIRA PURBALINGGA. Semua Hak Dilindungi.'
      });
      
      if (footerContent.quick_links) {
        setQuickLinks(footerContent.quick_links);
      }
      
      if (footerContent.social_links) {
        setSocialLinks(footerContent.social_links);
      }
    }
  }, [footerContent]);

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Quick links mutations
  const addQuickLinkMutation = useMutation({
    mutationFn: async (link: Omit<QuickLink, 'id'>) => {
      const newLink = {
        ...link,
        id: Date.now().toString()
      };
      setQuickLinks(prev => [...prev, newLink]);
    },
    onSuccess: () => {
      setMessage('Quick link berhasil ditambahkan!');
      setNewQuickLink({ name: '', href: '' });
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const updateQuickLinkMutation = useMutation({
    mutationFn: async (link: QuickLink) => {
      setQuickLinks(prev => prev.map(l => l.id === link.id ? link : l));
    },
    onSuccess: () => {
      setMessage('Quick link berhasil diperbarui!');
      setEditingQuickLink(null);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const deleteQuickLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      setQuickLinks(prev => prev.filter(l => l.id !== id));
    },
    onSuccess: () => {
      setMessage('Quick link berhasil dihapus!');
      setEditingQuickLink(null);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  // Social links mutations
  const addSocialLinkMutation = useMutation({
    mutationFn: async (link: Omit<SocialLink, 'id'>) => {
      const newLink = {
        ...link,
        id: Date.now().toString()
      };
      setSocialLinks(prev => [...prev, newLink]);
    },
    onSuccess: () => {
      setMessage('Social link berhasil ditambahkan!');
      setNewSocialLink({ platform: 'Facebook', href: '' });
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const updateSocialLinkMutation = useMutation({
    mutationFn: async (link: SocialLink) => {
      setSocialLinks(prev => prev.map(l => l.id === link.id ? link : l));
    },
    onSuccess: () => {
      setMessage('Social link berhasil diperbarui!');
      setEditingSocialLink(null);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const deleteSocialLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      setSocialLinks(prev => prev.filter(l => l.id !== id));
    },
    onSuccess: () => {
      setMessage('Social link berhasil dihapus!');
      setEditingSocialLink(null);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const handleAddQuickLink = () => {
    if (!newQuickLink.name || !newQuickLink.href) {
      setMessage('Nama dan link wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    addQuickLinkMutation.mutate(newQuickLink);
  };

  const handleUpdateQuickLink = () => {
    if (!editingQuickLink?.name || !editingQuickLink?.href) {
      setMessage('Nama dan link wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    updateQuickLinkMutation.mutate(editingQuickLink);
  };

  const handleDeleteQuickLink = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus quick link ini?')) {
      deleteQuickLinkMutation.mutate(id);
    }
  };

  const handleAddSocialLink = () => {
    if (!newSocialLink.platform || !newSocialLink.href) {
      setMessage('Platform dan link wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    addSocialLinkMutation.mutate(newSocialLink);
  };

  const handleUpdateSocialLink = () => {
    if (!editingSocialLink?.platform || !editingSocialLink?.href) {
      setMessage('Platform dan link wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    updateSocialLinkMutation.mutate(editingSocialLink);
  };

  const handleDeleteSocialLink = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus social link ini?')) {
      deleteSocialLinkMutation.mutate(id);
    }
  };

  const getSocialIcon = (platform: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      Facebook,
      Twitter,
      Instagram,
      Youtube
    };
    return iconMap[platform] || Globe;
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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Footer</h1>
          <p className="text-gray-500 mt-1">Edit konten footer website</p>
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
                <DialogTitle>Preview Footer</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="bg-blue-900 text-white p-8">
                  <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                      {/* Brand Section */}
                      <div className="md:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                            <span className="text-blue-900 font-bold text-lg">SP</span>
                          </div>
                          <span className="text-xl font-bold">{formData.brand_name}</span>
                        </div>
                        <p className="text-blue-200 mb-6 leading-relaxed">
                          {formData.brand_description}
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex space-x-3">
                          {socialLinks.map((social) => {
                            const IconComponent = getSocialIcon(social.platform);
                            return (
                              <a
                                key={social.id}
                                href={social.href}
                                className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition-colors"
                              >
                                <IconComponent className="w-5 h-5" />
                              </a>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div>
                        <h3 className="text-lg font-bold mb-6">Link Cepat</h3>
                        <ul className="space-y-3">
                          {quickLinks.map((link) => (
                            <li key={link.id}>
                              <a
                                href={link.href}
                                className="text-blue-200 hover:text-yellow-400 transition-colors"
                              >
                                {link.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <h3 className="text-lg font-bold mb-6">Kontak</h3>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <MapPin className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-200">{formData.address}</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Phone className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-200">{formData.phone}</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Mail className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-200">{formData.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Newsletter */}
                      <div>
                        <h3 className="text-lg font-bold mb-6">{formData.newsletter_title}</h3>
                        <p className="text-blue-200 mb-4">
                          {formData.newsletter_description}
                        </p>
                        <div className="flex">
                          <input
                            type="email"
                            placeholder="Email Anda"
                            className="flex-1 px-4 py-2 bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:border-yellow-400 focus:ring-yellow-400 rounded-l-lg"
                          />
                          <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-r-lg transition-colors">
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="border-t border-blue-800 mt-8 pt-8">
                      <div className="text-center">
                        <p className="text-blue-200">
                          {formData.copyright_text}
                        </p>
                      </div>
                    </div>
                  </div>
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

      {/* Brand Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Brand</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="brand_name">Nama Brand</Label>
            <Input
              id="brand_name"
              value={formData.brand_name}
              onChange={(e) => handleInputChange('brand_name', e.target.value)}
              disabled={!isEditing}
              placeholder="SALUT PERWIRA PURBALINGGA"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="brand_description">Deskripsi Brand</Label>
            <Textarea
              id="brand_description"
              value={formData.brand_description}
              onChange={(e) => handleInputChange('brand_description', e.target.value)}
              disabled={!isEditing}
              placeholder="Deskripsi singkat tentang institusi..."
              rows={3}
              className="mt-1 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-green-600" />
            <span>Informasi Kontak</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              placeholder="Jl. Pendidikan No. 123, Wonomulyo, Sulawesi Barat"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Telepon</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              placeholder="(0281) 123456"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              placeholder="info@salutperwira.ac.id"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <span>Quick Links</span>
            </span>
            {isEditing && (
              <Button onClick={handleAddQuickLink} disabled={addQuickLinkMutation.isPending} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Tambah Link
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Nama</Label>
                      <p className="text-gray-900">{link.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Link</Label>
                      <p className="text-gray-900 text-sm">{link.href}</p>
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingQuickLink(link)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteQuickLink(link.id)}
                      disabled={deleteQuickLinkMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Social Links</span>
            </span>
            {isEditing && (
              <Button onClick={handleAddSocialLink} disabled={addSocialLinkMutation.isPending} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Tambah Social
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialLinks.map((social) => {
              const IconComponent = getSocialIcon(social.platform);
              return (
                <div key={social.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Platform</Label>
                          <p className="text-gray-900">{social.platform}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Link</Label>
                          <p className="text-gray-900 text-sm">{social.href}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSocialLink(social)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSocialLink(social.id)}
                        disabled={deleteSocialLinkMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-green-600" />
            <span>Newsletter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="newsletter_title">Judul Newsletter</Label>
            <Input
              id="newsletter_title"
              value={formData.newsletter_title}
              onChange={(e) => handleInputChange('newsletter_title', e.target.value)}
              disabled={!isEditing}
              placeholder="Newsletter"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="newsletter_description">Deskripsi Newsletter</Label>
            <Textarea
              id="newsletter_description"
              value={formData.newsletter_description}
              onChange={(e) => handleInputChange('newsletter_description', e.target.value)}
              disabled={!isEditing}
              placeholder="Dapatkan informasi terbaru tentang pendaftaran dan program kami"
              rows={3}
              className="mt-1 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Copyright */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-600" />
            <span>Copyright</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="copyright_text">Teks Copyright</Label>
            <Input
              id="copyright_text"
              value={formData.copyright_text}
              onChange={(e) => handleInputChange('copyright_text', e.target.value)}
              disabled={!isEditing}
              placeholder="© 2024 SALUT PERWIRA PURBALINGGA. Semua Hak Dilindungi."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Quick Link Dialog */}
      <Dialog open={!!editingQuickLink} onOpenChange={() => setEditingQuickLink(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Quick Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="quick-link-name">Nama</Label>
              <Input
                id="quick-link-name"
                value={editingQuickLink?.name || ''}
                onChange={(e) => setEditingQuickLink(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Masukkan nama link"
              />
            </div>
            <div>
              <Label htmlFor="quick-link-href">Link URL</Label>
              <Input
                id="quick-link-href"
                value={editingQuickLink?.href || ''}
                onChange={(e) => setEditingQuickLink(prev => prev ? { ...prev, href: e.target.value } : null)}
                placeholder="Contoh: #about"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingQuickLink(null)}>
                Batal
              </Button>
              <Button onClick={handleUpdateQuickLink} disabled={updateQuickLinkMutation.isPending}>
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Quick Link Dialog */}
      <Dialog open={!!newQuickLink.name} onOpenChange={(open) => !open && setNewQuickLink({ name: '', href: '' })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Quick Link Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-quick-link-name">Nama</Label>
              <Input
                id="new-quick-link-name"
                value={newQuickLink.name}
                onChange={(e) => setNewQuickLink(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Masukkan nama link"
              />
            </div>
            <div>
              <Label htmlFor="new-quick-link-href">Link URL</Label>
              <Input
                id="new-quick-link-href"
                value={newQuickLink.href}
                onChange={(e) => setNewQuickLink(prev => ({ ...prev, href: e.target.value }))}
                placeholder="Contoh: #about"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNewQuickLink({ name: '', href: '' })}>
                Batal
              </Button>
              <Button onClick={handleAddQuickLink} disabled={addQuickLinkMutation.isPending}>
                Tambah
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Social Link Dialog */}
      <Dialog open={!!editingSocialLink} onOpenChange={() => setEditingSocialLink(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Social Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="social-platform">Platform</Label>
              <select
                id="social-platform"
                value={editingSocialLink?.platform || 'Facebook'}
                onChange={(e) => setEditingSocialLink(prev => prev ? { ...prev, platform: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
                <option value="Youtube">Youtube</option>
              </select>
            </div>
            <div>
              <Label htmlFor="social-href">Link URL</Label>
              <Input
                id="social-href"
                value={editingSocialLink?.href || ''}
                onChange={(e) => setEditingSocialLink(prev => prev ? { ...prev, href: e.target.value } : null)}
                placeholder="Contoh: https://facebook.com/page"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingSocialLink(null)}>
                Batal
              </Button>
              <Button onClick={handleUpdateSocialLink} disabled={updateSocialLinkMutation.isPending}>
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Social Link Dialog */}
      <Dialog open={!!newSocialLink.href} onOpenChange={(open) => !open && setNewSocialLink({ platform: 'Facebook', href: '' })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Social Link Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-social-platform">Platform</Label>
              <select
                id="new-social-platform"
                value={newSocialLink.platform}
                onChange={(e) => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
                <option value="Youtube">Youtube</option>
              </select>
            </div>
            <div>
              <Label htmlFor="new-social-href">Link URL</Label>
              <Input
                id="new-social-href"
                value={newSocialLink.href}
                onChange={(e) => setNewSocialLink(prev => ({ ...prev, href: e.target.value }))}
                placeholder="Contoh: https://facebook.com/page"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNewSocialLink({ platform: 'Facebook', href: '' })}>
                Batal
              </Button>
              <Button onClick={handleAddSocialLink} disabled={addSocialLinkMutation.isPending}>
                Tambah
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFooter;