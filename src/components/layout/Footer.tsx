import Link from 'next/link';
import type { SiteSettings } from '@prisma/client';
import { db } from '@/lib/db';
import { withPublicDataFallback } from '@/lib/public-data';
import LocalizedText from '@/components/i18n/LocalizedText';

export default async function Footer() {
  const settings = await withPublicDataFallback<SiteSettings | null>(
    () => db.siteSettings.findUnique({ where: { id: 'global' } }),
    null,
  );

  const email   = settings?.email   || null;
  const phone   = settings?.phone   || null;
  const address = settings?.address || null;
  const facebook  = settings?.facebook  || null;
  const instagram = settings?.instagram || null;
  const linkedin  = settings?.linkedin  || null;

  const hasSocial = facebook || instagram || linkedin;

  return (
    <footer className="bg-brand-950 text-white border-t border-brand-900 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <img src="/logo-clean.png" alt="EGSOM Logo" className="w-10 h-10 object-contain bg-white rounded-full p-0.5" />
              <span
                lang="en"
                dir="ltr"
                className="font-sans text-xl font-bold tracking-tight"
              >
                EGSOM
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-brand-200/78">
              <LocalizedText
                en="The Egyptian Society of Osteopathic Medicine: dedicated to promoting excellence in osteopathic education, practice, and research across Egypt and the Middle East."
                ar="الجمعية المصرية لطب الأوستيوباثية، مؤسسة مكرسة للارتقاء بالتعليم والممارسة والبحث في مجال الطب الأوستيوباثي في مصر والشرق الأوسط."
              />
            </p>
            {hasSocial && (
              <div className="flex items-center gap-3">
                {facebook && (
                    <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-700 text-brand-300 transition-colors hover:border-white/40 hover:text-white">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-700 text-brand-300 transition-colors hover:border-white/40 hover:text-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-700 text-brand-300 transition-colors hover:border-white/40 hover:text-white">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-5">
              <LocalizedText en="Quick Links" ar="روابط سريعة" />
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/about', en: 'About Us', ar: 'من نحن' },
                { href: '/courses', en: 'Courses & Training', ar: 'الدورات والتدريب' },
                { href: '/activities', en: 'Activities & Events', ar: 'الأنشطة والفعاليات' },
                { href: '/find-osteopath', en: 'Find an Osteopath', ar: 'ابحث عن ممارس أوستيوباثي' },
                { href: '/gallery', en: 'Gallery', ar: 'معرض الصور' },
                { href: '/contact', en: 'Contact Us', ar: 'تواصل معنا' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-brand-200/78 transition-colors hover:text-white">
                    <LocalizedText en={l.en} ar={l.ar} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-5">
              <LocalizedText en="Contact" ar="بيانات التواصل" />
            </h3>
            <ul className="space-y-3 text-sm text-brand-200/78">
              {address && (
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span dir="auto">{address}</span>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${email}`} dir="ltr" className="hover:text-white transition-colors">{email}</a>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${phone}`} dir="ltr" className="hover:text-white transition-colors">{phone}</a>
                </li>
              )}
              {!email && !phone && !address && (
                <li className="text-xs italic text-brand-300/75">
                  <LocalizedText
                    en="Contact info not configured yet."
                    ar="لم تتم إضافة بيانات التواصل بعد."
                  />
                </li>
              )}
            </ul>
            <div className="mt-6">
              <Link href="/admin/login" className="text-brand-600 hover:text-brand-400 text-xs transition-colors">
                <LocalizedText en="Admin Login" ar="دخول الإدارة" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-300/75">
            &copy;{' '}
            <bdi dir="ltr" lang="en" className="font-sans tabular-nums">
              {new Date().getFullYear()}
            </bdi>{' '}
            <LocalizedText
              en="Egyptian Society of Osteopathic Medicine. All rights reserved."
              ar="الجمعية المصرية لطب الأوستيوباثية. جميع الحقوق محفوظة."
            />
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-px w-6 bg-gold/40" />
            <span className="text-brand-600 text-[10px] tracking-[0.3em] uppercase">
              <LocalizedText en="Cairo, Egypt" ar="القاهرة، مصر" />
            </span>
            <div className="h-px w-6 bg-gold/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
