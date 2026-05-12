'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Stats = { courses: number; osteopaths: number; activities: number; gallery: number };

const statCards = [
  {
    key: 'courses' as keyof Stats,
    label: 'Active Courses',
    href: '/admin/courses',
    color: 'bg-brand-100 text-brand-600',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    key: 'osteopaths' as keyof Stats,
    label: 'Osteopaths',
    href: '/admin/osteopaths',
    color: 'bg-emerald-100 text-emerald-600',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    key: 'activities' as keyof Stats,
    label: 'Activities',
    href: '/admin/activities',
    color: 'bg-amber-100 text-amber-600',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    key: 'gallery' as keyof Stats,
    label: 'Gallery Images',
    href: '/admin/gallery',
    color: 'bg-purple-100 text-purple-600',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
];

const quickLinks = [
  { label: 'Manage Osteopaths', href: '/admin/osteopaths', desc: 'Add or update the practitioner directory.' },
  { label: 'Manage Courses', href: '/admin/courses', desc: 'Add, edit, or remove training programs.' },
  { label: 'Manage Activities', href: '/admin/activities', desc: 'Post upcoming events and seminars.' },
  { label: 'Manage Gallery', href: '/admin/gallery', desc: 'Upload photos from past initiatives.' },
  { label: 'Site Settings', href: '/admin/contact-info', desc: 'Update contact info and social links.' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ courses: 0, osteopaths: 0, activities: 0, gallery: 0 });

  useEffect(() => {
    const fetches = [
      fetch('/api/courses').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      fetch('/api/osteopaths').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      fetch('/api/activities').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      fetch('/api/gallery').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
    ];
    Promise.all(fetches).then(([courses, osteopaths, activities, gallery]) =>
      setStats({ courses, osteopaths, activities, gallery })
    );
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.key} href={card.href} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${card.color} shrink-0`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats[card.key]}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group">
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-brand-600 transition-colors">{link.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-brand-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
