import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond, Noto_Sans_Arabic } from 'next/font/google';
import { cookies } from 'next/headers';
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

export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
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
  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get('egsom-language')?.value;
  const initialLanguage: Language = savedLanguage === 'ar' ? 'ar' : 'en';
  const hasLanguageCookie = savedLanguage === 'ar' || savedLanguage === 'en';

  return (
    <html
      lang={initialLanguage}
      dir={initialLanguage === 'ar' ? 'rtl' : 'ltr'}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={`${inter.variable} ${cormorant.variable} ${notoArabic.variable} min-h-screen flex flex-col bg-bone font-sans`}>
        <LanguageProvider
          initialLanguage={initialLanguage}
          hasLanguageCookie={hasLanguageCookie}
        >
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
