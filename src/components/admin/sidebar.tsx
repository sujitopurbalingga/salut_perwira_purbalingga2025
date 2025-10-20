"use client";

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Info, 
  Briefcase, 
  Building2, 
  Newspaper, 
  Users, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from './auth-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/admin/dashboard',
  },
  {
    title: 'Karakter 3D',
    icon: <Sparkles className="w-5 h-5" />,
    path: '/admin/character-3d',
  },
  {
    title: 'Tentang',
    icon: <Info className="w-5 h-5" />,
    path: '/admin/about',
  },
  {
    title: 'Layanan',
    icon: <Briefcase className="w-5 h-5" />,
    path: '/admin/services',
  },
  {
    title: 'Fakultas',
    icon: <Building2 className="w-5 h-5" />,
    path: '/admin/faculties',
  },
  {
    title: 'Berita',
    icon: <Newspaper className="w-5 h-5" />,
    path: '/admin/news',
  },
  {
    title: 'Pendaftaran',
    icon: <Users className="w-5 h-5" />,
    path: '/admin/registrations',
    badge: 'Baru',
  },
  {
    title: 'Brosur',
    icon: <FileText className="w-5 h-5" />,
    path: '/admin/brochure',
  },
];

const AdminSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/admin/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-lg"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive(item.path)
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "transition-colors",
                    isActive(item.path) ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  )}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.title}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "px-2 py-1 text-xs font-semibold rounded-full",
                    isActive(item.path)
                      ? "bg-white/20 text-white"
                      : "bg-indigo-100 text-indigo-600"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-100">
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full justify-start p-3 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-gray-400 transition-transform",
                    isProfileOpen && "rotate-180"
                  )} />
                </div>
              </Button>

              {isProfileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Keluar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;