"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      showError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Alamat",
      value: "Jl. Merdeka No. 123, Wonomulyo, Sulawesi Barat"
    },
    {
      icon: Phone,
      label: "Telepon",
      value: "+62 812-3456-7890"
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@salutwonomulyo.com"
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "f", url: "#" },
    { name: "Twitter", icon: "𝕏", url: "#" },
    { name: "Instagram", icon: "📷", url: "#" },
    { name: "YouTube", icon: "▶", url: "#" }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Kami siap membantu dan menjawab pertanyaan Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                Kirim Pesan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-semibold">Nama Lengkap</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama Anda"
                    className="border-gray-300 focus:border-green-600"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-semibold">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    className="border-gray-300 focus:border-green-600"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="font-semibold">Pesan</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tulis pesan Anda di sini..."
                    rows={4}
                    className="border-gray-300 focus:border-green-600"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Mengirim...</>
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

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow border-2 border-gray-200">
                  <CardContent className="p-4 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <item.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.label}</h4>
                      <p className="text-gray-600">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Social Media */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Ikuti Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                      title={social.name}
                    >
                      <span className="font-bold">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="overflow-hidden border-2 border-gray-200">
              <CardContent className="p-0">
                <div className="relative h-64 bg-gray-200">
                  <img
                    src="https://salutwonomulyo.com/wp-content/uploads/2023/12/map-placeholder.jpg"
                    alt="Map"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-green-600 bg-opacity-20 flex items-center justify-center">
                    <div className="text-white text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-bold">Lokasi Kami</p>
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