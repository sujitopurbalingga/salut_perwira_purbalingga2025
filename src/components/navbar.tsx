"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang', href: '#about' },
    { name: 'Layanan', href: '#services' },
    { name: 'Fakultas', href: '#faculties' },
    { name: 'Berita', href: '#news' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <nav className="relative h-16 shadow-lg sticky top-0 z-50 overflow-hidden">
      {/* Background split design with inward curved separator */}
      <div className="absolute inset-0 flex">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-3"></div>
              <span className="text-xl font-bold text-gray-900">EduCampus</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button 
              asChild
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Link to="/admin/login">Admin Login</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <Link to="/admin/login">Admin Login</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;