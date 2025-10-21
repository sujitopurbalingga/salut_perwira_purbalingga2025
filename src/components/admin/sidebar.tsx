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
  Sparkles,
  MessageSquare,
  Globe,
  Settings
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
  {
    title: 'Hubungi Kami',
    icon: <MessageSquare className="w-5 h-5" />,
    path: '/admin/contact',
  },
  {
    title: 'Footer',
    icon: <Globe className="w-5 h-5" />,
    path: '/admin/footer',
  },
  {
    title: 'Pengaturan',
    icon: <Settings className="w-5 h-5" />,
    path: '/admin/settings',
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
      {/* Sidebar untuk Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:min-h-screen lg:bg-gray-900 lg:border-r lg:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive(item.path)
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "transition-colors",
                  isActive(item.path) ? "text-white" : "text-gray-400 group-hover:text-gray-300"
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
        <div className="px-4 py-6 border-t border-gray-800 mt-auto">
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full justify-start p-3 hover:bg-gray-800 text-gray-300"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  isProfileOpen && "rotate-180"
                )} />
              </div>
            </Button>

            {isProfileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start px-4 py-3 text-red-400 hover:bg-red-900 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Keluar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Side Panel */}
          <div className="fixed left-0 top-0 h-full w-72 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                    isActive(item.path)
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "transition-colors",
                      isActive(item.path) ? "text-white" : "text-gray-400"
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

            {/* Mobile User Profile */}
            <div className="px-4 py-4 border-t border-gray-800 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-lg hover:bg-gray-50"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>
    </>
  );
};

export default AdminSidebar;