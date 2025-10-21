"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Briefcase, Building2, Newspaper, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Beranda', href: '#home', icon: Home },
    { name: 'Tentang', href: '#about', icon: Info },
    { name: 'Layanan', href: '#services', icon: Briefcase },
    { name: 'Fakultas', href: '#faculties', icon: Building2 },
    { name: 'Kontak', href: '#contact', icon: Phone },
  ];

  const isActive = (href: string) => {
    return location.hash === href;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href) as HTMLElement;
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Hanya tampilkan 5 item pertama
  const visibleNavigation = navigation.slice(0, 5);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div className="grid grid-cols-5 h-16">
        {visibleNavigation.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.href);
          
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 text-xs transition-colors duration-200",
                active
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <IconComponent className={cn(
                "w-5 h-5",
                active && "text-blue-600"
              )} />
              <span className={cn(
                "font-medium",
                active && "text-blue-600"
              )}>
                {item.name}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;