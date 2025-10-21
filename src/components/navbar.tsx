"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Info, Briefcase, Building, FileText, MessageSquare, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navigation = [
    { name: 'Beranda', href: '#home', icon: Home },
    { name: 'Tentang', href: '#about', icon: Info },
    { name: 'Layanan', href: '#services', icon: Briefcase },
    { name: 'Fakultas', href: '#faculties', icon: Building },
    { name: 'Berita', href: '#news', icon: FileText },
    { name: 'Kontak', href: '#contact', icon: MessageSquare },
  ];

  // Get first 5 items for bottom navigation
  const bottomNavItems = navigation.slice(0, 5);

  // Fetch site settings from database - ini harus bisa diakses oleh semua user
  const { data: siteSettings, isLoading, error } = useQuery({
    queryKey: ['site-settings-public'],
    queryFn: async () => {
      console.log('=== FETCHING SITE SETTINGS FOR NAVBAR ===');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
      
      console.log('Site settings fetched successfully:', data);
      console.log('Logo URL:', data?.logo_url);
      console.log('Site Name:', data?.site_name);
      return data as SiteSettings;
    },
    staleTime: 0, // No stale time - always fetch fresh data
    cacheTime: 1000, // Cache for 1 second only
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnMount: true, // Refetch when component mounts
    refetchInterval: 10000, // Refetch every 10 seconds to ensure freshness
    retry: 3, // Retry up to 3 times on failure
  });

  // Handle scroll untuk background navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scroll untuk active section
  useEffect(() => {
    const handleScrollForActiveSection = () => {
      const sections = navigation.map(item => item.href);
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.querySelector(section);
        if (element) {
          const { offsetTop, offsetHeight } = element as HTMLElement;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollForActiveSection);
    handleScrollForActiveSection();
    return () => window.removeEventListener('scroll', handleScrollForActiveSection);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Close mobile menu if open
    setIsMenuOpen(false);
    
    // Smooth scroll to section
    const htmlElement = document.querySelector(href) as HTMLElement;
    if (htmlElement) {
      const offsetTop = htmlElement.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Dynamic site name from database with loading state
  const siteName = siteSettings?.site_name || 'SALUT PERWIRA PURBALINGGA';
  const logoUrl = siteSettings?.logo_url;

  // Show loading state while fetching
  const displaySiteName = isLoading ? 'Loading...' : siteName;

  // Debug logging
  useEffect(() => {
    console.log('=== NAVBAR STATE UPDATE ===');
    console.log('isLoading:', isLoading);
    console.log('hasLogoUrl:', !!logoUrl);
    console.log('logoUrl:', logoUrl);
    console.log('siteName:', siteName);
    console.log('displaySiteName:', displaySiteName);
    console.log('error:', error);
    console.log('=============================');
  }, [isLoading, logoUrl, siteName, displaySiteName, error]);

  // Function to get logo component
  const getLogoComponent = () => {
    // If we have a valid logo URL and it's not loading, show the image
    if (!isLoading && logoUrl && logoUrl.trim() !== '') {
      console.log('Rendering logo image:', logoUrl);
      return (
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="w-8 h-8 rounded-lg mr-3 transition-all duration-300 object-contain bg-white shadow-sm"
          onError={(e) => {
            // Fallback to icon if image fails to load
            console.error('Logo failed to load:', logoUrl);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const iconContainer = target.nextElementSibling as HTMLElement;
            if (iconContainer) {
              iconContainer.style.display = 'flex';
            }
          }}
          onLoad={() => {
            console.log('Logo loaded successfully:', logoUrl);
          }}
        />
      );
    }
    
    // Always show the icon fallback
    return null;
  };

  return (
    <div className="navbar-container">
      {/* Desktop Navigation */}
      <nav className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg backdrop-blur-md bg-opacity-95' 
          : 'bg-transparent'
      }`}>
        {/* Background split design with inward curved separator */}
        <div className={`absolute inset-0 flex transition-opacity duration-300 ${
          isScrolled ? 'opacity-0' : 'opacity-100'
        }`}>
          {/* Yellow section - 45% */}
          <div className="w-[45%] bg-yellow-400"></div>
          {/* White section - 55% */}
          <div className="w-[55%] bg-white"></div>
          {/* Inward curved and sharp separator using SVG */}
          <svg 
            className="absolute top-0 left-[45%] h-full w-32 pointer-events-none"
            viewBox="0 0 128 64"
            preserveAspectRatio="none"
          >
            {/* Inward curve with sharp point - yellow part */}
            <path 
              d="M 0 0 C 20 0 40 16 64 32 C 88 48 108 64 128 64 L 0 64 Z" 
              fill="#facc15"
            />
            {/* White part */}
            <path 
              d="M 0 0 C 20 0 40 16 64 32 C 88 48 108 64 128 64 L 128 0 L 0 0 Z" 
              fill="white"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex justify-between h-full">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                {getLogoComponent()}
                {/* Icon fallback - always rendered but hidden if image is available */}
                <div 
                  className={`w-8 h-8 rounded-lg mr-3 transition-all duration-300 flex items-center justify-center ${
                    !isLoading && logoUrl && logoUrl.trim() !== '' ? 'hidden' : 'flex'
                  } ${
                    isScrolled 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-gray-900'
                }`}>
                  {displaySiteName}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                    activeSection === item.href
                      ? 'text-indigo-600 bg-indigo-50'
                      : isScrolled
                        ? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-white hover:bg-opacity-50'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              <Button 
                asChild
                className={`transition-all duration-300 ${
                  isScrolled
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                }`}
              >
                <Link to="/admin/login">Admin Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Fixed position, always visible */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16 px-2">
          {bottomNavItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.href;
            
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                <span className={`text-xs mt-1 ${isActive ? 'text-blue-600 font-medium' : ''}`}>
                  {item.name}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Mobile Top Bar (Minimal) - Fixed position */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              {getLogoComponent()}
              {/* Icon fallback - always rendered but hidden if image is available */}
              <div 
                className={`w-8 h-8 rounded-lg mr-2 flex items-center justify-center ${
                  !isLoading && logoUrl && logoUrl.trim() !== '' ? 'hidden' : 'flex'
                } bg-gradient-to-br from-indigo-500 to-purple-600`}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                {displaySiteName}
              </span>
            </Link>
            <Button 
              asChild
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              <Link to="/admin/login">Admin</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Side Menu for remaining items */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Side Panel */}
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {/* Show remaining items (6th item onwards) */}
                {navigation.slice(5).map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                      setIsMenuOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                      activeSection === item.href
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add padding to bottom to prevent content from being hidden behind bottom nav */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default Navbar;