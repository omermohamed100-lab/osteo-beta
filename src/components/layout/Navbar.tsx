'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LanguageToggle from '@/components/i18n/LanguageToggle';
import { useLanguage } from '@/components/i18n/LanguageProvider';

const links = [
  { href: '/', en: 'Home', ar: 'الرئيسية' },
  { href: '/about', en: 'About Us', ar: 'من نحن' },
  { href: '/courses', en: 'Courses', ar: 'الدورات' },
  { href: '/activities', en: 'Activities', ar: 'الأنشطة' },
  {
    href: '/find-osteopath',
    en: 'Find an Osteopath',
    ar: 'ابحث عن ممارس أوستيوباثي',
  },
  { href: '/gallery', en: 'Gallery', ar: 'معرض الصور' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isArabic } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 8);
    updateScrolledState();
    window.addEventListener('scroll', updateScrolledState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolledState);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const menuTransition = reduceMotion
    ? { duration: 0.12 }
    : { type: 'spring' as const, stiffness: 520, damping: 42, mass: 0.82 };

  return (
    <nav
      className={`site-navbar sticky top-0 z-50 w-full ${
        isScrolled ? 'is-scrolled' : ''
      }`}
      aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <div className="flex shrink-0 items-center">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg outline-none transition-transform duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-500/45"
            >
              <Image
                src="/logo-clean.png"
                alt="EGSOM Logo"
                width={48}
                height={48}
                priority
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
              <span
                lang="en"
                dir="ltr"
                className="font-sans text-lg font-bold tracking-[-0.015em] text-brand-900 sm:text-xl"
              >
                EGSOM
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-4 lg:flex xl:gap-6">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative rounded-lg px-2 py-3 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                    active
                      ? 'text-brand-800'
                      : 'text-slate-700 hover:text-brand-700'
                  }`}
                >
                  {isArabic ? link.ar : link.en}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-2 bottom-1 h-px origin-center bg-gold transition-transform duration-200 ease-out ${
                      active
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-50'
                    }`}
                  />
                </Link>
              );
            })}
            <Link
              href="/contact"
              aria-current={pathname === '/contact' ? 'page' : undefined}
              className={`rounded-lg border px-4 py-2.5 text-sm font-semibold tracking-[0.01em] outline-none transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                pathname === '/contact'
                  ? 'border-brand-300 bg-brand-100 text-brand-800'
                  : 'border-brand-200 bg-brand-50/80 text-brand-700 hover:border-brand-300 hover:bg-brand-100'
              }`}
            >
              {isArabic ? 'تواصل معنا' : 'Contact'}
            </Link>
            <LanguageToggle />
          </div>

          <div className="relative flex items-center gap-1.5 lg:hidden">
            <LanguageToggle />
            <button
              type="button"
              aria-label={
                menuOpen
                  ? isArabic
                    ? 'إغلاق قائمة التنقل'
                    : 'Close navigation menu'
                  : isArabic
                    ? 'فتح قائمة التنقل'
                    : 'Open navigation menu'
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="-me-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 outline-none transition-[background-color,color,transform] duration-150 hover:bg-brand-50 hover:text-brand-700 active:scale-[0.94] focus-visible:ring-2 focus-visible:ring-brand-500/40"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 6l12 12M6 18L18 6"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <div className="lg:hidden">
            <motion.button
              type="button"
              aria-label={isArabic ? 'إغلاق قائمة التنقل' : 'Close navigation menu'}
              className="fixed inset-x-0 bottom-0 top-16 z-40 cursor-default bg-brand-950/20 backdrop-blur-[2px] sm:top-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.18 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              id="mobile-navigation"
              className="mobile-nav-sheet fixed inset-x-3 top-[4.5rem] z-50 overflow-hidden rounded-xl border border-white/75 p-2 shadow-[0_22px_70px_rgba(8,47,73,0.22)] sm:top-[5.5rem]"
              style={{
                transformOrigin: isArabic ? 'top left' : 'top right',
              }}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -10, scale: 0.985 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, scale: 0.99 }
              }
              transition={menuTransition}
            >
              <div className="space-y-1">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`flex min-h-12 items-center justify-between rounded-lg px-4 py-3 text-base font-medium outline-none transition-[background-color,color,transform] duration-150 active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                        active
                          ? 'bg-brand-50 text-brand-800'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-brand-700'
                      }`}
                    >
                      {isArabic ? link.ar : link.en}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-gold"
                        />
                      )}
                    </Link>
                  );
                })}
                <Link
                  href="/contact"
                  aria-current={pathname === '/contact' ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 flex min-h-12 items-center justify-center rounded-lg bg-brand-700 px-4 py-3 text-base font-semibold text-white outline-none transition-[background-color,transform] duration-150 hover:bg-brand-800 active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-brand-500/50"
                >
                  {isArabic ? 'تواصل معنا' : 'Contact'}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
