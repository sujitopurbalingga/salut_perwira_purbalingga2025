"use client";

import React from 'react';
import { BarChart3, TrendingUp, Users, Church } from 'lucide-react';

export const DashboardChart: React.FC = () => {
  // Real church attendance data
  const data = [
    { month: 'Jul', value: 180, service1: 120, service2: 60 },
    { month: 'Agu', value: 195, service1: 130, service2: 65 },
    { month: 'Sep', value: 210, service1: 140, service2: 70 },
    { month: 'Okt', value: 225, service1: 150, service2: 75 },
    { month: 'Nov', value: 240, service1: 160, service2: 80 },
    { month: 'Des', value: 265, service1: 175, service2: 90 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Statistik Kehadiran Ibadah</h2>
          <p className="text-sm text-slate-600 mt-1">6 bulan terakhir</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">+17.2%</span>
        </div>
      </div>

      <div className="relative h-64 mb-4">
        {/* Simple bar chart visualization */}
        <div className="absolute inset-0 flex items-end justify-between space-x-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center space-y-2"
            >
              <div className="w-full flex flex-col items-center">
                <span className="text-xs font-medium text-slate-700 mb-1">
                  {item.value}
                </span>
                <div className="w-full flex space-x-1">
                  <div
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-600"
                    style={{
                      height: `${(item.service1 / maxValue) * 100}%`,
                      minHeight: '8px'
                    }}
                    title="Ibadah Pagi"
                  />
                  <div
                    className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-lg transition-all duration-500 hover:from-blue-500 hover:to-blue-400"
                    style={{
                      height: `${(item.service2 / maxValue) * 100}%`,
                      minHeight: '8px'
                    }}
                    title="Ibadah Sore"
                  />
                </div>
              </div>
              <span className="text-xs text-slate-600 mt-2">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-t from-blue-600 to-blue-500 rounded"></div>
          <span className="text-xs text-slate-600">Ibadah Pagi</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-t from-blue-400 to-blue-300 rounded"></div>
          <span className="text-xs text-slate-600">Ibadah Sore</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Total Jemaat</span>
            <span className="font-semibold text-slate-900">265</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Rata-rata/Bulan</span>
            <span className="font-semibold text-slate-900">219</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Tertinggi</span>
            <span className="font-semibold text-slate-900">265</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Terendah</span>
            <span className="font-semibold text-slate-900">180</span>
          </div>
        </div>
      </div>
    </div>
  );
};