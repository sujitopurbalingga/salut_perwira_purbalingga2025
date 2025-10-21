"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

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
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Fetch footer content from database
  const { data: footerContent, isLoading } = useQuery({
    queryKey: ['footer-public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('footer_settings')
        .select('*')
        .maybeSingle();
      return data as FooterContent;
    }
  });

  // Default values if no data from database
  const defaultFooter = {
    brand_name: 'SALUT PERWIRA PURBALINGGA',
    brand_description: 'Universitas terkemuka yang berkomitmen untuk mencetak lulusan berkualitas dan siap bersaing di era global.',
    address: 'Jl. Pendidikan No. 123, Wonomulyo, Sulawesi Barat',
    phone: '(0281) 123456',
    email: 'info@salutperwira.ac.id',
    quick_links: [
      { id: '1', name: 'Tentang Kami', href: '#about' },
      { id: '2', name: 'Layanan', href: '#services' },
      { id: '3', name: 'Fakultas', href: '#faculties' },
      { id: '4', name: 'Berita', href: '#news' }
    ],
    social_links: [
      { id: '1', platform: 'Facebook', href: '#' },
      { id: '2', platform: 'Twitter', href: '#' },
      { id: '3', platform: 'Instagram', href: '#' },
      { id: '4', platform: 'Youtube', href: '#' }
    ],
    newsletter_title: 'Newsletter',
    newsletter_description: 'Dapatkan informasi terbaru tentang pendaftaran dan program kami',
    copyright_text: `© ${currentYear} SALUT PERWIRA PURBALINGGA. Semua Hak Dilindungi.`
  };

  // Use database data if available, otherwise use defaults
  const footer = footerContent || defaultFooter;

  const getSocialIcon = (platform: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      Facebook,
      Twitter,
      Instagram,
      Youtube
    };
    return iconMap[platform] || Facebook;
  };

  // Show loading state
  if (isLoading) {
    return (
      <footer className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Memuat footer...</p>
          </div>
        </div>
      </footer>
    );
  }

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
              <span className="text-xl font-bold">{footer.brand_name}</span>
            </div>
            <p className="text-blue-200 mb-6 leading-relaxed">
              {footer.brand_description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {footer.social_links.map((social) => {
                const IconComponent = getSocialIcon(social.platform);
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition-colors"
                    aria-label={social.platform}
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
              {footer.quick_links.map((link) => (
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
                <span className="text-blue-200">{footer.address}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-blue-200">{footer.phone}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-blue-200">{footer.email}</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6">{footer.newsletter_title}</h3>
            <p className="text-blue-200 mb-4">
              {footer.newsletter_description}
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-4 py-2 bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:border-yellow-400 focus:ring-yellow-400 rounded-l-lg"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-r-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-blue-800 mt-8 pt-8">
          <div className="text-center">
            <p className="text-blue-200">
              {footer.copyright_text}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;