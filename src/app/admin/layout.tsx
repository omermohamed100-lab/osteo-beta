'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) setIsAuthorized(true);
        else router.push('/admin/login');
      })
      .catch(() => router.push('/admin/login'))
      .finally(() => setIsLoading(false));
  }, [pathname, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  if (!isAuthorized) return null;

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 lg:flex-row">

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden flex items-center justify-between h-14 px-4 bg-brand-950 text-white shrink-0 border-b border-brand-900">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-brand-300 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="EGSOM" className="w-7 h-7 rounded-full bg-white p-0.5 object-contain" />
          <span className="font-bold text-base">Admin Panel</span>
        </div>

        {/* Spacer to center the logo */}
        <div className="w-10" />
      </header>

      {/* ── Sidebar ── */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
