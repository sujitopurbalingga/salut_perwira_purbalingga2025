"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, MessageSquare, Send, Clock, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { supabase, Faculty } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    selected_faculty: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch faculties for the dropdown
  const { data: faculties, isLoading: isLoadingFaculties } = useQuery({
    queryKey: ['faculties-for-registration'],
    queryFn: async () => {
      const { data } = await supabase
        .from('faculties')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true });
      return data as Pick<Faculty, 'id' | 'name'>[];
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      selected_faculty: value === 'none' ? '' : value // Set to empty string if 'none' is selected
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('registrations')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          selected_faculty: formData.selected_faculty || null, // Will be null if formData.selected_faculty is ''
          message: formData.message,
          status: 'pending' // Default status
        });

      if (error) {
        throw error;
      }

      showSuccess('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
      setFormData({ full_name: '', email: '', phone: '', selected_faculty: '', message: '' });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      showError('Terjadi kesalahan saat mengirim pesan: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Alamat",
      value: "Jl. Merdeka No. 123, Wonomulyo, Sulawesi Barat",
      description: "Kunjungi kantor kami"
    },
    {
      icon: Phone,
      label: "Telepon",
      value: "+62 812-3456-7890",
      description: "Hubungi kami langsung"
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@salutwonomulyo.com",
      description: "Kirim email kapan saja"
    }
  ];

  const officeHours = [
    { day: "Senin - Jumat", hours: "08:00 - 17:00" },
    { day: "Sabtu", hours: "09:00 - 15:00" },
    { day: "Minggu", hours: "Tutup" }
  ];

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 border-green-200 text-green-700 bg-green-50">
            Hubungi Kami
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mari Berkolaborasi
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
              untuk Masyarakat
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kami siap membantu dan menjawab pertanyaan Anda. 
            Jangan ragu untuk menghubungi kami untuk berdiskusi tentang program dan kerja sama.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <Card className="shadow-xl border-0">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center text-2xl font-bold">
                  <MessageSquare className="w-6 h-6 mr-3 text-green-600" />
                  Kirim Pesan
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Isi formulir di bawah ini dan kami akan segera merespons
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="full_name" className="font-semibold text-gray-900">Nama Lengkap</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan nama Anda"
                        className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-semibold text-gray-900">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="email@example.com"
                        className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="font-semibold text-gray-900">Nomor Telepon (Opsional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Contoh: +6281234567890"
                      className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="selected_faculty" className="font-semibold text-gray-900">Fakultas yang Diminati (Opsional)</Label>
                    <Select
                      value={formData.selected_faculty}
                      onValueChange={handleSelectChange}
                      disabled={isLoadingFaculties}
                    >
                      <SelectTrigger className="w-full mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Pilih Fakultas" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingFaculties ? (
                          <SelectItem value="loading" disabled>Memuat fakultas...</SelectItem>
                        ) : (
                          <>
                            {/* Changed value from "" to "none" */}
                            <SelectItem value="none">Tidak memilih fakultas</SelectItem> 
                            {faculties?.map((faculty) => (
                              <SelectItem key={faculty.id} value={faculty.id}>
                                {faculty.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="font-semibold text-gray-900">Pesan</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tulis pesan Anda di sini..."
                      rows={5}
                      className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Pesan
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{item.label}</h4>
                        <p className="text-gray-900 font-medium mb-1">{item.value}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Office Hours */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  Jam Operasional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-900">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="relative h-64 bg-gray-200">
                  <img
                    src="https://salutwonomulyo.com/wp-content/uploads/2023/12/map-placeholder.jpg"
                    alt="Map Location"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <div className="flex items-center mb-2">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="font-bold">Lokasi Kami</span>
                      </div>
                      <p className="text-sm opacity-90">Jl. Merdeka No. 123, Wonomulyo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;