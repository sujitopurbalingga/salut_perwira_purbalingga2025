"use client";

import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    main: [
      { name: 'Tentang Kami', href: '#about' },
      { name: 'Berita', href: '#news' },
      { name: 'Kontak', href: '#contact' }
    ],
    legal: [
      { name: 'Kebijakan Privasi', href: '#' },
      { name: 'Syarat & Ketentuan', href: '#' },
      { name: 'Kebijakan Cookie', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const contactInfo = [
    { icon: MapPin, value: 'Jl. Merdeka No. 123, Wonomulyo' },
    { icon: Phone, value: '+62 812-3456-7890' },
    { icon: Mail, value: 'info@salutwonomulyo.com' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold">Salut Wonomulyo</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Mengabdi dan berinovasi untuk kemajuan masyarakat Wonomulyo melalui program-program yang berdampak positif.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Link Cepat</h3>
            <ul className="space-y-3">
              {footerLinks.main.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
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
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <item.icon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Dapatkan update terbaru tentang program dan kegiatan kami
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Email Anda"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                Subscribe
              </Button>
            </form>
            <Badge variant="secondary" className="mt-3 text-xs bg-gray-800 text-gray-300 border-gray-700">
              No spam, unsubscribe anytime
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Salut Wonomulyo. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              {footerLinks.legal.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;