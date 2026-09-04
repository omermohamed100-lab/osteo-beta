'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';
  const [authorizedPath, setAuthorizedPath] = useState<string | null>(
    isLogin ? pathname : null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (isLogin) return;

    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) setAuthorizedPath(pathname);
        else router.push('/admin/login');
      })
      .catch(() => router.push('/admin/login'))
  }, [isLogin, pathname, router]);

  const isAuthorized = isLogin || authorizedPath === pathname;
  const isLoading = !isLogin && authorizedPath !== pathname;

  if (isLoading) {
    return <div role="status" aria-live="polite" dir="ltr" lang="en" className="admin-shell min-h-screen flex items-center justify-center bg-slate-50 font-sans">Loading admin portal…</div>;
  }

  if (!isAuthorized) return null;

  if (isLogin) {
    return <div dir="ltr" lang="en" className="admin-shell min-h-screen bg-slate-50 font-sans">{children}</div>;
  }

  return (
    <div dir="ltr" lang="en" className="admin-shell flex h-screen flex-col overflow-hidden bg-slate-50 font-sans lg:flex-row">
      <a href="#admin-main" className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-md bg-white px-4 py-2 font-semibold text-brand-900 shadow-lg transition-transform focus:translate-y-0">
        Skip to main content
      </a>

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden flex items-center justify-between h-14 px-4 bg-brand-950 text-white shrink-0 border-b border-brand-900">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-expanded={sidebarOpen}
          aria-controls="admin-mobile-navigation"
          className="-ml-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-brand-300 transition-colors hover:bg-brand-900 hover:text-white"
          aria-label="Open menu"
        >
          <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <Image src="/logo-clean.webp" alt="EGSOM" width={28} height={28} className="h-7 w-7 rounded-full bg-white object-contain p-0.5" />
          <span className="font-bold text-base">Admin Panel</span>
        </div>

        {/* Spacer to center the logo */}
        <div className="w-10" />
      </header>

      {/* ── Sidebar ── */}
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* ── Main content ── */}
      <div id="admin-main" tabIndex={-1} className="flex-1 overflow-y-auto p-4 outline-none lg:p-8">
        {children}
      </div>
    </div>
  );
}
