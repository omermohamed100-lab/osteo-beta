'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LanguageToggle from '@/components/i18n/LanguageToggle';
import { useLanguage } from '@/components/i18n/LanguageProvider';

const links = [
  { href: '/about', en: 'About EGSOM', ar: 'عن الجمعية' },
  { href: '/courses', en: 'Education', ar: 'التعليم' },
  { href: '/#standards', en: 'Standards', ar: 'المعايير' },
  { href: '/find-osteopath', en: 'For the Public', ar: 'للجمهور' },
  { href: '/contact', en: 'For Practitioners', ar: 'للممارسين' },
  { href: '/activities', en: 'News & Events', ar: 'الأخبار والفعاليات' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isArabic } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 8);
    updateScrolledState();
    window.addEventListener('scroll', updateScrolledState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolledState);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = window.requestAnimationFrame(() => {
      const firstFocusable = menuPanelRef.current?.querySelector<HTMLElement>(
        'button:not([disabled]), a[href]',
      );
      firstFocusable?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        menuPanelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href]',
        ) ?? [],
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMenuAndRestoreFocus = () => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  const menuTransition = reduceMotion
    ? { duration: 0.1 }
    : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <nav
      className={`site-navbar sticky top-0 z-50 w-full ${isScrolled ? 'is-scrolled' : ''}`}
      aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}
    >
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex h-[4.5rem] items-center justify-between xl:h-24">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3.5 outline-none transition-transform duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-brand-950"
          >
            <Image
              src="/logo-clean.png"
              alt="EGSOM"
              width={68}
              height={68}
              priority
              className="h-12 w-12 object-contain xl:h-[4.25rem] xl:w-[4.25rem]"
            />
            <span className="flex flex-col text-bone">
              <span className="font-display text-[1.1rem] font-medium leading-[0.92] tracking-[-0.015em] xl:text-[1.27rem]">
                {isArabic ? 'الجمعية المصرية' : 'Egyptian Society'}
              </span>
              <span className="mt-1 font-display text-[1.1rem] font-medium leading-[0.92] tracking-[-0.015em] xl:text-[1.27rem]">
                {isArabic ? 'لطب الأوستيوباثي' : 'of Osteopathic Medicine'}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1.5 xl:flex 2xl:gap-3">
            {links.map((link) => {
              const cleanHref = link.href.split('#')[0] || '/';
              const active = pathname === cleanHref && !link.href.includes('#');
              return (
                <Link
                  key={`${link.href}-${link.en}`}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative px-2 py-3 text-[0.77rem] font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 2xl:px-2.5 2xl:text-[0.81rem] ${
                    active ? 'text-bone' : 'text-brand-100/78 hover:text-bone'
                  }`}
                >
                  {isArabic ? link.ar : link.en}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-2 bottom-1 h-px origin-center bg-gold transition-transform duration-200 ease-out ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                    }`}
                  />
                </Link>
              );
            })}
            <Link
              href="/contact"
              aria-current={pathname === '/contact' ? 'page' : undefined}
              className="ms-1 border border-gold bg-gold px-4 py-2.5 text-[0.78rem] font-semibold text-brand-950 outline-none transition-[background-color,border-color,transform] duration-150 hover:border-gold-light hover:bg-gold-light active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 2xl:px-5"
            >
              {isArabic ? 'تواصل معنا' : 'Contact'}
            </Link>
            <LanguageToggle />
          </div>

          <div className="relative flex items-center gap-1.5 xl:hidden">
            <LanguageToggle />
            <button
              ref={menuButtonRef}
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
              className="-me-2 inline-flex h-11 w-11 items-center justify-center text-bone outline-none transition-[background-color,color,transform] duration-150 hover:bg-bone/10 hover:text-gold-light active:scale-[0.94] focus-visible:ring-2 focus-visible:ring-gold"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <div className="xl:hidden">
            <motion.button
              type="button"
              tabIndex={-1}
              aria-label={isArabic ? 'إغلاق قائمة التنقل' : 'Close navigation menu'}
              className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 cursor-default bg-brand-950/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.08 : 0.18 }}
              onClick={closeMenuAndRestoreFocus}
            />

            <motion.div
              ref={menuPanelRef}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label={isArabic ? 'قائمة التنقل' : 'Navigation menu'}
              className="mobile-nav-sheet fixed inset-x-3 top-[5rem] z-50 max-h-[calc(100svh-5.75rem)] overflow-y-auto border border-brand-950/15 p-2 shadow-[0_22px_70px_rgba(8,47,73,0.22)]"
              style={{ transformOrigin: isArabic ? 'top left' : 'top right' }}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
              transition={menuTransition}
            >
              <div className="space-y-1">
                <div className="flex justify-end pb-1">
                  <button
                    type="button"
                    onClick={closeMenuAndRestoreFocus}
                    aria-label={isArabic ? 'إغلاق قائمة التنقل' : 'Close navigation menu'}
                    className="inline-flex h-11 w-11 items-center justify-center text-brand-800 outline-none transition-[background-color,color,transform] duration-150 hover:bg-brand-50 hover:text-brand-950 active:scale-[0.94] focus-visible:ring-2 focus-visible:ring-brand-700"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M6 18L18 6" />
                    </svg>
                  </button>
                </div>
                {links.map((link) => {
                  const cleanHref = link.href.split('#')[0] || '/';
                  const active = pathname === cleanHref && !link.href.includes('#');
                  return (
                    <Link
                      key={`${link.href}-${link.en}`}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`flex min-h-12 items-center justify-between px-4 py-3 text-base font-medium outline-none transition-[background-color,color,transform] duration-150 active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-brand-700 ${
                        active ? 'bg-brand-100 text-brand-900' : 'text-ink hover:bg-brand-50 hover:text-brand-800'
                      }`}
                    >
                      {isArabic ? link.ar : link.en}
                      {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-deep" />}
                    </Link>
                  );
                })}
                <Link
                  href="/contact"
                  aria-current={pathname === '/contact' ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 flex min-h-12 items-center justify-center bg-brand-950 px-4 py-3 text-base font-semibold text-bone outline-none transition-[background-color,transform] duration-150 hover:bg-brand-800 active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-gold"
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
