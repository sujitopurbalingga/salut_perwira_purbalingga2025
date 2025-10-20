"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Calendar, 
  MapPin,
  ChevronRight,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Clock,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: ''
  });

  const programs = [
    { name: 'Teknik Informatika', icon: '💻' },
    { name: 'Sistem Informasi', icon: '📊' },
    { name: 'Manajemen', icon: '📈' },
    { name: 'Akuntansi', icon: '💰' },
    { name: 'Psikologi', icon: '🧠' },
    { name: 'Hukum', icon: '⚖️' }
  ];

  const stats = [
    { number: '15,000+', label: 'Mahasiswa Aktif' },
    { number: '500+', label: 'Dosen Profesional' },
    { number: '50+', label: 'Program Studi' },
    { number: '95%', label: 'Tingkat Kelulusan' }
  ];

  const news = [
    {
      id: 1,
      title: 'EduCampus Raih Penghargaan Kampus Terbaik 2024',
      excerpt: 'Prestasi membanggakan diraih EduCampus dalam ajang penghargaan pendidikan tinggi nasional.',
      date: '2 hari yang lalu',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400'
    },
    {
      id: 2,
      title: 'Kerjasama Internasional dengan 10 Universitas Luar Negeri',
      excerpt: 'Program pertukaran mahasiswa dan penelitian bersama untuk meningkatkan kualitas pendidikan.',
      date: '5 hari yang lalu',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400'
    },
    {
      id: 3,
      title: 'Beasiswa Prestasi 2024 Telah Dibuka',
      excerpt: 'Kesempatan emas untuk mahasiswa berprestasi mendapatkan beasiswa penuh dari EduCampus.',
      date: '1 minggu yang lalu',
      image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-2 fill-current" />
                  Kampus Terbaik #1 di Indonesia
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Wujudkan Masa Depanmu di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">EduCampus</span>
                </h1>
                <p className="text-xl text-gray-600">
                  Bergabunglah dengan ribuan mahasiswa yang telah meraih kesuksesan bersama kami. 
                  Temukan program studi yang sesuai dengan passion dan tujuan karirmu.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                  Download Brosur
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600" 
                  alt="Students in campus"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Terakreditasi A</div>
                      <div className="text-sm text-gray-600">BAN-PT</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl transform rotate-6"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tentang EduCampus</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mencetak lulusan berkualitas yang siap menghadapi tantangan global dengan pendidikan berbasis teknologi dan inovasi
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Visi</h3>
              <p className="text-gray-600">
                Menjadi universitas terdepan dalam menghasilkan lulusan yang berkarakter, inovatif, dan berdaya saing global.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Misi</h3>
              <p className="text-gray-600">
                Menyediakan pendidikan berkualitas, melakukan penelitian inovatif, dan memberikan layanan terbaik kepada masyarakat.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Nilai</h3>
              <p className="text-gray-600">
                Integritas, Profesionalisme, Inovasi, dan Tanggung Jawab Sosial menjadi fondasi setiap langkah kami.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Program Studi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pilih dari berbagai program studi unggulan yang disesuaikan dengan kebutuhan industri dan masa depan
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {program.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{program.name}</h3>
                  <p className="text-gray-600 mb-4">
                    Program studi dengan kurikulum terkini dan didukung oleh dosen profesional di bidangnya.
                  </p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    Pelajari Lebih Lanjut
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Berita Terkini</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dapatkan informasi terbaru tentang kegiatan kampus dan prestasi mahasiswa
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <Link 
                    to={`/news/${item.id}`}
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                  >
                    Baca Selengkapnya
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Siap Memulai Perjalananmu?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Daftar sekarang dan dapatkan informasi lengkap tentang program pilihanmu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
              Daftar Online
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl">
              Jadwalkan Kunjungan
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tim kami siap membantu menjawab semua pertanyaan Anda
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Informasi Kontak</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold">Alamat Kampus</div>
                      <div className="text-gray-600">
                        Jl. Pendidikan No. 123, Jakarta Selatan, 12345
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold">Jam Operasional</div>
                      <div className="text-gray-600">
                        Senin - Jumat: 08:00 - 20:00<br />
                        Sabtu: 08:00 - 16:00<br />
                        Minggu: Tutup
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold mb-2">Butuh Bantuan Cepat?</h4>
                <p className="text-gray-600 mb-4">
                  Hubungi hotline kami untuk informasi lebih lanjut
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="tel:+62123456789" className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    📞 +62 123-456-789
                  </a>
                  <a href="mailto:info@educampus.ac.id" className="flex items-center justify-center bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    ✉️ info@educampus.ac.id
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+62 812-3456-7890"
                  />
                </div>
                
                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                    Program Studi yang Diminati
                  </label>
                  <select
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Program Studi</option>
                    {programs.map((program, index) => (
                      <option key={index} value={program.name}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl">
                  Kirim Pesan
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;