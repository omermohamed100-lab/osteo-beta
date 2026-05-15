'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    name: 'Osteopaths',
    href: '/admin/osteopaths',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    name: 'Courses',
    href: '/admin/courses',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    name: 'Activities',
    href: '/admin/activities',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    name: 'Gallery',
    href: '/admin/gallery',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    name: 'Messages',
    href: '/admin/messages',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    name: 'Settings',
    href: '/admin/contact-info',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    extraPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    name: 'Account',
    href: '/admin/account',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [userName, setUserName] = useState('');

  // Close drawer on navigation
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => { if (data.user) setUserName(data.user.name); })
      .catch(() => {});
  }, []);

  const navContent = (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-brand-900">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="EGSOM" className="w-8 h-8 rounded-full bg-white p-0.5 object-contain" />
          <span className="font-bold text-xl">Admin Panel</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-4 px-2">Menu</div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive
                    ? 'bg-brand-800 text-white font-medium'
                    : 'text-brand-200 hover:bg-brand-900 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  {item.extraPath && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.extraPath} />
                  )}
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User / Logout */}
      <div className="p-4 border-t border-brand-900">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-sm font-bold shrink-0">
            {userName ? userName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{userName || 'Admin'}</span>
            <button
              onClick={() => {
                document.cookie = 'token=; Max-Age=0; path=/;';
                window.location.href = '/admin/login';
              }}
              className="text-xs text-brand-400 hover:text-white text-left transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar (always visible, part of flex flow) ── */}
      <div className="hidden lg:flex w-64 bg-brand-950 text-white flex-col h-full border-r border-brand-900 shrink-0">
        {navContent}
      </div>

      {/* ── Mobile backdrop ── */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* ── Mobile drawer ── */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-brand-950 text-white flex flex-col border-r border-brand-900 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-400 hover:text-white p-1"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {navContent}
      </div>
    </>
  );
}
