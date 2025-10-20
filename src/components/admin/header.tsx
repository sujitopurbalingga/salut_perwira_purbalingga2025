"use client";

import React from 'react';
import { Church, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
          <Church className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Gereja Salut Wonomulyo
          </h1>
          <p className="text-xs text-slate-500">Panel Administrasi</p>
        </div>
      </div>
    </div>
  );
};