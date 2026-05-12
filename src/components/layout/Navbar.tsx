'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/courses', label: 'Courses' },
  { href: '/activities', label: 'Activities' },
  { href: '/find-osteopath', label: 'Find an Osteopath' },
  { href: '/gallery', label: 'Gallery' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="EGSOM Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <span className="font-bold text-lg sm:text-xl text-brand-900">
                EGSOM
              </span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-700 hover:text-brand-600 px-2 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-brand-200"
            >
              Contact
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="text-gray-700 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 rounded-md p-2 -mr-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-brand-600'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="block px-3 py-3 rounded-md text-base font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors text-center mt-2"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
