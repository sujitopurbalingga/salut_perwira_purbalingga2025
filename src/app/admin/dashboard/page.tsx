"use client";

import React from 'react';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { DashboardActivities } from '@/components/admin/dashboard-activities';
import { DashboardRecent } from '@/components/admin/dashboard-recent';
import { DashboardChart } from '@/components/admin/dashboard-chart';
import { DashboardAnnouncements } from '@/components/admin/dashboard-announcements';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Selamat datang di panel administrasi Gereja Salut Wonomulyo
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DashboardChart />
        </div>
        <div>
          <DashboardRecent />
        </div>
      </div>

      {/* Activities and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardActivities />
        <DashboardAnnouncements />
      </div>
    </div>
  );
}