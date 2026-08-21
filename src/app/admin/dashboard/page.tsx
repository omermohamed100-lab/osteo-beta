'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Stats = {
  courses: number;
  osteopaths: number;
  activities: number;
  gallery: number;
  messages: number;
};

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
    label: 'Listed Osteopaths',
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
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    key: 'messages' as keyof Stats,
    label: 'Messages',
    href: '/admin/messages',
    color: 'bg-rose-100 text-rose-600',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
];

const quickLinks = [
  { label: 'Manage Osteopaths', href: '/admin/osteopaths', desc: 'Add or update the practitioner directory.' },
  { label: 'Manage Courses', href: '/admin/courses', desc: 'Add, edit, or remove training programs.' },
  { label: 'Manage Activities', href: '/admin/activities', desc: 'Post upcoming events and seminars.' },
  { label: 'Manage Gallery', href: '/admin/gallery', desc: 'Upload photos from past initiatives.' },
  { label: 'Review Messages', href: '/admin/messages', desc: 'Read and respond to website enquiries.' },
  { label: 'Site Settings', href: '/admin/contact-info', desc: 'Update contact info and social links.' },
];

function isStats(value: unknown): value is Stats {
  if (!value || typeof value !== 'object') return false;
  return ['courses', 'osteopaths', 'activities', 'gallery', 'messages'].every(
    (key) => typeof (value as Record<string, unknown>)[key] === 'number',
  );
}

async function fetchDashboardStats() {
  const response = await fetch('/api/admin/dashboard', { cache: 'no-store' });
  if (!response.ok) throw new Error(`Dashboard request failed (${response.status})`);

  const data: unknown = await response.json();
  if (!isStats(data)) throw new Error('Dashboard response is invalid');
  return data;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const retryStats = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      setStats(await fetchDashboardStats());
      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    fetchDashboardStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      {hasError && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span>Dashboard totals could not be loaded. Your records have not been changed.</span>
          <button
            type="button"
            onClick={() => void retryStats()}
            className="min-h-11 rounded-md px-3 font-semibold text-amber-900 underline decoration-amber-400 underline-offset-4 hover:text-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <Link key={card.key} href={card.href} className="flex min-h-28 items-center rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2">
            <div className={`p-3 rounded-lg ${card.color} shrink-0`}>
              <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
            </div>
            <div className="ml-4 min-w-0">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              {isLoading ? (
                <span aria-label={`Loading ${card.label.toLowerCase()} total`} className="mt-1 block h-7 w-9 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
              ) : (
                <p className="text-2xl font-semibold text-gray-900">{stats?.[card.key] ?? '—'}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600">
              <div>
                <p className="text-sm font-medium text-gray-900 transition-colors group-hover:text-brand-600">{link.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{link.desc}</p>
              </div>
              <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
