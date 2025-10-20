"use client";

import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export const DashboardChart: React.FC = () => {
  // Mock data for the chart
  const data = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 90 },
    { month: 'Apr', value: 81 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 88 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Statistik Pengunjung</h2>
          <p className="text-sm text-slate-600 mt-1">6 bulan terakhir</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">+12.5%</span>
        </div>
      </div>

      <div className="relative h-64">
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
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-600"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: '8px'
                  }}
                />
              </div>
              <span className="text-xs text-slate-600 mt-2">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Total Pengunjung</span>
          <span className="font-semibold text-slate-900">497</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-600">Rata-rata per bulan</span>
          <span className="font-semibold text-slate-900">83</span>
        </div>
      </div>
    </div>
  );
};