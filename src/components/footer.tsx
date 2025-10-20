"use client";

import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Youtube, href: '#' }
  ];

  const contactInfo = [
    { icon: MapPin, value: 'Jl. Pendidikan No. 123, Purbalingga' },
    { icon: Phone, value: '(0281) 123456' },
    { icon: Mail, value: 'info@salutperwira.ac.id' }
  ];

  const quickLinks = [
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Layanan', href: '#services' },
    { name: 'Fakultas', href: '#faculties' },
    { name: 'Berita', href: '#news' }
  ];

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-blue-900 font-bold text-lg">SP</span>
              </div>
              <span className="text-xl font-bold">SALUT PERWIRA PURBALINGGA</span>
            </div>
            <p className="text-blue-200 mb-6 leading-relaxed">
              Universitas terkemuka yang berkomitmen untuk mencetak lulusan berkualitas dan siap bersaing di era global.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition-colors duration-200"
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
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-blue-200 hover:text-yellow-400 transition-colors duration-200"
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
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <item.icon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-blue-200 mb-4">
              Dapatkan informasi terbaru tentang pendaftaran dan program kami
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
              © {currentYear} SALUT PERWIRA PURBALINGGA. Semua Hak Dilindungi.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;