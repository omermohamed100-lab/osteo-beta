'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
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
                className="font-sans text-lg font-bold text-brand-900 sm:text-xl"
              >
                EGSOM
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-700 hover:text-brand-600 px-2 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isArabic ? l.ar : l.en}
              </Link>
            ))}
            <Link
              href="/contact"
              className="text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-brand-200"
            >
              {isArabic ? 'تواصل معنا' : 'Contact'}
            </Link>
            <LanguageToggle />
          </div>

          <div className="relative flex items-center gap-1.5 lg:hidden">
            <LanguageToggle />
            <details key={pathname} className="group">
              <summary
                aria-label={isArabic ? 'فتح قائمة التنقل أو إغلاقها' : 'Toggle navigation menu'}
                className="-me-2 cursor-pointer list-none rounded-md p-2 text-gray-700 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 [&::-webkit-details-marker]:hidden"
              >
                <svg className="h-6 w-6 group-open:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className="hidden h-6 w-6 group-open:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </summary>

              <div className="fixed inset-x-0 top-16 z-40 border-t border-gray-200 bg-white/98 shadow-xl backdrop-blur-md sm:top-20">
                <div className="space-y-1 px-4 py-3">
                  {links.map((l) => {
                    const active = pathname === l.href;
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={`block rounded-md px-3 py-3 text-base font-medium transition-colors ${
                          active
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-brand-600'
                        }`}
                      >
                        {isArabic ? l.ar : l.en}
                      </Link>
                    );
                  })}
                  <Link
                    href="/contact"
                    className="mt-2 block rounded-md bg-brand-600 px-3 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    {isArabic ? 'تواصل معنا' : 'Contact'}
                  </Link>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
