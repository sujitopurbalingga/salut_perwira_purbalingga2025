"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, MessageSquare, Clock, Loader2, Send, User, GraduationCap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  form_title: string;
  form_description: string;
  submit_button: string;
  address: string;
  address_description: string;
  phone: string;
  phone_description: string;
  email: string;
  email_description: string;
  map_title: string;
  map_description: string;
}

interface Faculty {
  id: string;
  name: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    selected_faculty: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch contact content from database
  const { data: contactContent, isLoading } = useQuery({
    queryKey: ['contact-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('contact_settings')
        .select('*')
        .maybeSingle();
      return data as ContactContent;
    }
  });

  // Fetch faculties for the dropdown
  const { data: faculties, isLoading: isLoadingFaculties } = useQuery({
    queryKey: ['faculties-for-registration'],
    queryFn: async () => {
      const { data } = await supabase
        .from('faculties')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true });
      return data as Faculty[];
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
      selected_faculty: value === 'none' ? '' : value
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
          selected_faculty: formData.selected_faculty || null,
          message: formData.message,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      showSuccess('Pendaftaran berhasil! Kami akan segera menghubungi Anda untuk informasi selanjutnya.');
      setFormData({ full_name: '', email: '', phone: '', selected_faculty: '', message: '' });
    } catch (error: any) {
      console.error('Error submitting registration form:', error);
      showError('Terjadi kesalahan saat mengirim pendaftaran: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Default values if no data from database
  const defaultContact = {
    hero_title: 'Mari Berkolaborasi',
    hero_subtitle: 'untuk Masyarakat',
    form_title: 'Formulir Pendaftaran',
    form_description: 'Isi formulir pendaftaran di bawah ini dan kami akan segera menghubungi Anda',
    submit_button: 'Daftar', // Pastikan ini 'Daftar'
    address: 'Jl. Merdeka No. 123, Wonomulyo, Sulawesi Barat',
    address_description: 'Kunjungi kantor kami',
    phone: '+62 812-3456-7890',
    phone_description: 'Hubungi kami langsung',
    email: 'info@salutwonomulyo.com',
    email_description: 'Kirim email kapan saja',
    map_title: 'Map Location',
    map_description: 'Lokasi Kami\nJl. Merdeka No. 123, Wonomulyo'
  };

  // Use database data if available, otherwise use defaults
  const contact = contactContent || defaultContact;

  // Force button text to 'Daftar' regardless of database value
  const buttonText = 'Daftar';

  const officeHours = [
    { day: "Senin - Jumat", hours: "08:00 - 17:00" },
    { day: "Sabtu", hours: "09:00 - 15:00" },
    { day: "Minggu", hours: "Tutup" }
  ];

  if (isLoading) {
    return (
      <section id="contact" className="py-24 bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 border-green-200 text-green-700 bg-green-50">
            Formulir Pendaftaran
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {contact.hero_title}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
              {contact.hero_subtitle}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {contact.form_description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Registration Form */}
          <div>
            <Card className="shadow-xl border-0">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center text-2xl font-bold">
                  <User className="w-6 h-6 mr-3 text-green-600" />
                  {contact.form_title}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {contact.form_description}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="full_name" className="font-semibold text-gray-900">Nama Lengkap*</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan nama lengkap Anda"
                      className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="font-semibold text-gray-900">Email*</Label>
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
                  
                  <div>
                    <Label htmlFor="phone" className="font-semibold text-gray-900">Nomor Telepon</Label>
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
                    <Label htmlFor="selected_faculty" className="font-semibold text-gray-900">Program Studi yang Diminati</Label>
                    <Select
                      value={formData.selected_faculty}
                      onValueChange={handleSelectChange}
                      disabled={isLoadingFaculties}
                    >
                      <SelectTrigger className="w-full mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Pilih Program Studi" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingFaculties ? (
                          <SelectItem value="loading" disabled>Memuat program studi...</SelectItem>
                        ) : (
                          <>
                            <SelectItem value="none">Belum memilih</SelectItem> 
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
                    <Label htmlFor="message" className="font-semibold text-gray-900">Pesan atau Pertanyaan</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tulis pesan atau pertanyaan Anda di sini... (Opsional)"
                      rows={4}
                      className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Informasi:</strong> Data Anda akan kami proses dan kami akan menghubungi Anda untuk informasi selanjutnya mengenai proses pendaftaran.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Memproses Pendaftaran...
                      </>
                    ) : (
                      <>
                        {buttonText}
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
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">Alamat</h4>
                      <p className="text-gray-900 font-medium mb-1">{contact.address}</p>
                      <p className="text-sm text-gray-600">{contact.address_description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">Telepon</h4>
                      <p className="text-gray-900 font-medium mb-1">{contact.phone}</p>
                      <p className="text-sm text-gray-600">{contact.phone_description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">Email</h4>
                      <p className="text-gray-900 font-medium mb-1">{contact.email}</p>
                      <p className="text-sm text-gray-600">{contact.email_description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Office Hours */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold">
                  <Clock className="w-5 h-5 text-green-600 mr-2" />
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
                        <span className="font-bold">{contact.map_title}</span>
                      </div>
                      <p className="text-sm opacity-90 whitespace-pre-line">{contact.map_description}</p>
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