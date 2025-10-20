"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Newspaper, 
  Image, 
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/components/admin/auth-provider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  author: string;
  status: 'published' | 'draft';
}

interface GalleryItem {
  id: number;
  title: string;
  date: string;
  image: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState({
    totalNews: 0,
    totalGallery: 0,
    totalMessages: 0,
    totalVisitors: 0
  });
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load data based on active tab
    if (activeTab === 'news') {
      loadNews();
    } else if (activeTab === 'gallery') {
      loadGallery();
    }
    loadStats();
  }, [activeTab]);

  const loadNews = () => {
    // Mock data - replace with actual API call
    setNewsItems([
      { id: 1, title: 'Peluncuran Program UMKM Digital', date: '2024-11-15', author: 'Admin', status: 'published' },
      { id: 2, title: 'Workshop Kewirausahaan', date: '2024-11-10', author: 'Tim', status: 'published' },
      { id: 3, title: 'Kolaborasi dengan Pemda', date: '2024-11-05', author: 'Humas', status: 'draft' }
    ]);
  };

  const loadGallery = () => {
    // Mock data - replace with actual API call
    setGalleryItems([
      { id: 1, title: 'Kegiatan Pelatihan', date: '2024-11-15', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a' },
      { id: 2, title: 'Rapat Koordinasi', date: '2024-11-10', image: 'https://images.unsplash.com/photo-1515378791036-0648a814d6b6' },
      { id: 3, title: 'Bakti Sosial', date: '2024-11-05', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f' }
    ]);
  };

  const loadStats = () => {
    // Mock stats - replace with actual API call
    setStats({
      totalNews: 15,
      totalGallery: 24,
      totalMessages: 8,
      totalVisitors: 1234
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Berhasil logout');
  };

  const handleDeleteNews = (id: number) => {
    setNewsItems(newsItems.filter(item => item.id !== id));
    toast.success('Berita berhasil dihapus');
  };

  const handleDeleteGallery = (id: number) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
    toast.success('Foto berhasil dihapus');
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Berita</CardTitle>
          <Newspaper className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalNews}</div>
          <p className="text-xs text-muted-foreground">
            +2 dari bulan lalu
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Galeri</CardTitle>
          <Image className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalGallery}</div>
          <p className="text-xs text-muted-foreground">
            +5 dari bulan lalu
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pesan Masuk</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMessages}</div>
          <p className="text-xs text-muted-foreground">
            +3 dari minggu lalu
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pengunjung</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVisitors}</div>
          <p className="text-xs text-muted-foreground">
            +12% dari bulan lalu
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderNews = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola Berita</h2>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Berita
        </Button>
      </div>
      
      <div className="space-y-4">
        {newsItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    {item.date} • {item.author}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                    item.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'published' ? 'Diterbitkan' : 'Draft'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteNews(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderGallery = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola Galeri</h2>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Foto
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.date}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteGallery(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pesan Masuk</h2>
      <div className="space-y-4">
        {[
          { id: 1, name: 'Ahmad', email: 'ahmad@example.com', message: 'Tanya tentang program UMKM', date: '2024-11-15' },
          { id: 2, name: 'Siti', email: 'siti@example.com', message: 'Ingin bergabung sebagai relawan', date: '2024-11-14' }
        ].map((msg) => (
          <Card key={msg.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{msg.name}</h3>
                  <p className="text-sm text-gray-600">{msg.email}</p>
                  <p className="mt-2">{msg.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{msg.date}</p>
                </div>
                <Button variant="outline" size="sm">
                  Balas
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'news', label: 'Berita', icon: Newspaper },
              { id: 'gallery', label: 'Galeri', icon: Image },
              { id: 'messages', label: 'Pesan', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 border-b-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-900 text-blue-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'news' && renderNews()}
        {activeTab === 'gallery' && renderGallery()}
        {activeTab === 'messages' && renderMessages()}
      </div>
    </div>
  );
};

export default AdminDashboard;