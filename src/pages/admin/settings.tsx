"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Settings, 
  Save, 
  Upload, 
  Eye, 
  EyeOff, 
  Palette, 
  Globe, 
  Key, 
  User, 
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  Moon,
  Sun
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/admin/auth-provider';

interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  theme: 'light' | 'dark' | 'auto';
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  updated_at: string;
}

const AdminSettings = () => {
  const [message, setMessage] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Site settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    id: '',
    site_name: 'EduCampus',
    site_description: 'Universitas terkemuka yang berkomitmen untuk mencetak lulusan berkualitas dan siap bersaing di era global.',
    logo_url: '',
    favicon_url: '',
    theme: 'light',
    primary_color: '#004BFF',
    secondary_color: '#0A6CFF',
    accent_color: '#FFC700'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Username change state
  const [usernameData, setUsernameData] = useState({
    new_email: '',
    password: ''
  });

  // Fetch site settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();
      return data as SiteSettings;
    }
  });

  // Update form data when settings change
  React.useEffect(() => {
    if (settings) {
      setSiteSettings(settings);
    }
  }, [settings]);

  // Update site settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<SiteSettings>) => {
      if (settings?.id) {
        const { error } = await supabase
          .from('site_settings')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      setMessage('Pengaturan berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal menyimpan: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setMessage('Password berhasil diubah!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setIsPasswordDialogOpen(false);
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal mengubah password: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  // Change username/email mutation
  const changeUsernameMutation = useMutation({
    mutationFn: async (data: typeof usernameData) => {
      const { error } = await supabase.auth.updateUser({
        email: data.new_email
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setMessage('Email berhasil diubah! Silakan periksa email baru Anda untuk verifikasi.');
      setUsernameData({ new_email: '', password: '' });
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage('Gagal mengubah email: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `site-assets/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setSiteSettings(prev => ({ ...prev, logo_url: publicUrl }));
      setMessage('Logo berhasil diunggah');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Gagal mengunggah logo');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `favicon-${Date.now()}.${fileExt}`;
    const filePath = `site-assets/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setSiteSettings(prev => ({ ...prev, favicon_url: publicUrl }));
      setMessage('Favicon berhasil diunggah');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Gagal mengunggah favicon');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(siteSettings);
  };

  const handleChangePassword = () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('Password baru dan konfirmasi tidak cocok');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (passwordData.new_password.length < 6) {
      setMessage('Password baru minimal 6 karakter');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    changePasswordMutation.mutate(passwordData);
  };

  const handleChangeUsername = () => {
    if (!usernameData.new_email || !usernameData.password) {
      setMessage('Email dan password wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    changeUsernameMutation.mutate(usernameData);
  };

  const themeOptions = [
    { value: 'light', label: 'Terang', icon: Sun },
    { value: 'dark', label: 'Gelap', icon: Moon },
    { value: 'auto', label: 'Otomatis', icon: Palette }
  ];

  const colorPresets = [
    { name: 'EduCampus Blue', primary: '#004BFF', secondary: '#0A6CFF', accent: '#FFC700' },
    { name: 'Green', primary: '#059669', secondary: '#10B981', accent: '#FCD34D' },
    { name: 'Purple', primary: '#7C3AED', secondary: '#8B5CF6', accent: '#FBBF24' },
    { name: 'Red', primary: '#DC2626', secondary: '#EF4444', accent: '#FCD34D' }
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-500">Kelola pengaturan website dan akun admin</p>
      </div>

      {message && (
        <Alert className={message.includes('berhasil') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.includes('berhasil') ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Site Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Pengaturan Website</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="site_name">Nama Website</Label>
              <Input
                id="site_name"
                value={siteSettings.site_name}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, site_name: e.target.value }))}
                placeholder="Masukkan nama website"
              />
            </div>
            <div>
              <Label htmlFor="site_description">Deskripsi Website</Label>
              <Input
                id="site_description"
                value={siteSettings.site_description}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, site_description: e.target.value }))}
                placeholder="Masukkan deskripsi website"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <Label>Logo Website</Label>
            <div className="space-y-3">
              {siteSettings.logo_url && (
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={siteSettings.logo_url} 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Favicon Upload */}
          <div>
            <Label>Favicon</Label>
            <div className="space-y-3">
              {siteSettings.favicon_url && (
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={siteSettings.favicon_url} 
                    alt="Favicon" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('favicon-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Favicon
                </Button>
                <input
                  id="favicon-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div>
            <Label>Tema Website</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {themeOptions.map((theme) => {
                const IconComponent = theme.icon;
                return (
                  <Button
                    key={theme.value}
                    variant={siteSettings.theme === theme.value ? "default" : "outline"}
                    onClick={() => setSiteSettings(prev => ({ ...prev, theme: theme.value as any }))}
                    className="flex items-center space-x-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{theme.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Color Settings */}
          <div>
            <Label>Skema Warna</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {colorPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  onClick={() => setSiteSettings(prev => ({
                    ...prev,
                    primary_color: preset.primary,
                    secondary_color: preset.secondary,
                    accent_color: preset.accent
                  }))}
                  className="flex items-center space-x-2"
                >
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span>{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary_color">Warna Utama</Label>
              <Input
                id="primary_color"
                type="color"
                value={siteSettings.primary_color}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, primary_color: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="secondary_color">Warna Sekunder</Label>
              <Input
                id="secondary_color"
                type="color"
                value={siteSettings.secondary_color}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="accent_color">Warna Aksen</Label>
              <Input
                id="accent_color"
                type="color"
                value={siteSettings.accent_color}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, accent_color: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending}>
            {updateSettingsMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Simpan Pengaturan
          </Button>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-green-600" />
            <span>Pengaturan Akun</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Email Saat Ini</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            
            <div>
              <Label htmlFor="new_email">Email Baru</Label>
              <Input
                id="new_email"
                type="email"
                value={usernameData.new_email}
                onChange={(e) => setUsernameData(prev => ({ ...prev, new_email: e.target.value }))}
                placeholder="Masukkan email baru"
              />
            </div>

            <div>
              <Label htmlFor="username_password">Password</Label>
              <Input
                id="username_password"
                type="password"
                value={usernameData.password}
                onChange={(e) => setUsernameData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Masukkan password untuk konfirmasi"
              />
            </div>

            <Button onClick={handleChangeUsername} disabled={changeUsernameMutation.isPending}>
              {changeUsernameMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <User className="w-4 h-4 mr-2" />
              )}
              Ubah Email
            </Button>
          </div>

          <div className="border-t pt-6">
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(true)}
              className="flex items-center space-x-2"
            >
              <Key className="w-4 h-4" />
              Ubah Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current_password">Password Saat Ini</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                  placeholder="Masukkan password saat ini"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-2"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="new_password">Password Baru</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                  placeholder="Masukkan password baru"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-2"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                  placeholder="Masukkan kembali password baru"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-2"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleChangePassword} disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Ubah Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettings;