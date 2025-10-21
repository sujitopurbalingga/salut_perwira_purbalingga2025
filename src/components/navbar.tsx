"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navigation = [
    { name: 'Beranda', href: '#home' },
    { name: 'Tentang', href: '#about' },
    { name: 'Layanan', href: '#services' },
    { name: 'Fakultas', href: '#faculties' },
    { name: 'Berita', href: '#news' },
    { name: 'Kontak', href: '#contact' },
  ];

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
    handleScrollForActiveSection(); // Initial check
    return () => window.removeEventListener('scroll', handleScrollForActiveSection);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Close mobile menu if open
    setIsMenuOpen(false);
    
    // Smooth scroll to section
    const htmlElement = document.querySelector(href) as HTMLElement;
    if (htmlElement) {
      const offsetTop = htmlElement.getBoundingClientRect().top + window.pageYOffset - 80; // 80px for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-lg backdrop-blur-md bg-opacity-95' 
        : 'bg-transparent'
    }`}>
      {/* Background split design with curved separator */}
      <div className={`absolute inset-0 flex transition-opacity duration-300 ${
        isScrolled ? 'opacity-0' : 'opacity-100'
      }`}>
        {/* Yellow section - 45% */}
        <div className="w-[45%] bg-yellow-400"></div>
        {/* White section - 55% */}
        <div className="w-[55%] bg-white"></div>
        {/* Curved separator from left to right using SVG */}
        <svg 
          className="absolute top-0 left-[45%] h-full w-32 pointer-events-none"
          viewBox="0 0 128 64"
          preserveAspectRatio="none"
        >
          {/* Curved line from left to right - yellow part */}
          <path 
            d="M 0 32 Q 32 0 64 32 T 128 32 L 0 64 Z" 
            fill="#facc15"
          />
          {/* White part */}
          <path 
            d="M 0 32 Q 32 0 64 32 T 128 32 L 128 0 L 0 0 Z" 
            fill="white"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex justify-between h-full">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className={`w-8 h-8 rounded-lg mr-3 transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}></div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-gray-900'
              }`}>EduCampus</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={isScrolled ? 'text-gray-700' : 'text-gray-700'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                    activeSection === item.href
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </a>
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