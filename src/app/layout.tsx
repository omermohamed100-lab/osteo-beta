import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LanguageProvider, {
  type Language,
} from '@/components/i18n/LanguageProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getLocalizedMetadata } from '@/lib/localized-metadata';
import LocalizedText from '@/components/i18n/LocalizedText';
import {
  DEFAULT_LANGUAGE,
  isSiteLanguage,
  LANGUAGE_REQUEST_HEADER,
  localizePublicPath,
} from '@/lib/i18n-routing';
import { getSiteUrl } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

const inter = localFont({
  src: './fonts/inter-latin-variable.woff2',
  variable: '--font-inter',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

const cormorant = localFont({
  src: [
    {
      path: './fonts/cormorant-garamond-latin-variable.woff2',
      weight: '300 700',
      style: 'normal',
    },
    {
      path: './fonts/cormorant-garamond-latin-italic-variable.woff2',
      weight: '300 700',
      style: 'italic',
    },
  ],
  variable: '--font-cormorant',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

const notoArabic = localFont({
  src: './fonts/noto-sans-arabic-variable.woff2',
  variable: '--font-arabic',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
  preload: false,
  fallback: ['Tahoma', 'Arial', 'sans-serif'],
  adjustFontFallback: false,
});

export async function generateMetadata(): Promise<Metadata> {
  return getLocalizedMetadata('/');
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#082f49',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const requestedLanguage = headerStore.get(LANGUAGE_REQUEST_HEADER);
  const initialLanguage: Language = isSiteLanguage(requestedLanguage)
    ? requestedLanguage
    : DEFAULT_LANGUAGE;
  const siteUrl = getSiteUrl();
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': new URL('/#organization', siteUrl).toString(),
    name: 'Egyptian Society of Osteopathic Medicine',
    alternateName: 'EGSOM',
    url: new URL(localizePublicPath('/', 'en'), siteUrl).toString(),
    logo: new URL('/logo-clean.webp', siteUrl).toString(),
  };

  return (
    <html
      lang={initialLanguage}
      dir={initialLanguage === 'ar' ? 'rtl' : 'ltr'}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} ${notoArabic.variable} min-h-screen flex flex-col bg-bone`}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <a href="#main-content" className="skip-link">
            <LocalizedText
              en="Skip to main content"
              ar="انتقل إلى المحتوى الرئيسي"
            />
          </a>
          <Navbar />
          <main id="main-content" className="flex flex-grow flex-col" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
