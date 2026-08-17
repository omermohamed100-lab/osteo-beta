'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  getLanguageFromPathname,
  localizePublicHref,
  type SiteLanguage,
} from '@/lib/i18n-routing';

export type Language = SiteLanguage;

type LanguageContextValue = {
  language: Language;
  isArabic: boolean;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  localizedHref: (href: string) => string;
};

const STORAGE_KEY = 'egsom-language';
const COOKIE_KEY = 'egsom-language';
const ONE_YEAR = 60 * 60 * 24 * 365;

const LanguageContext = createContext<LanguageContextValue | null>(null);

export default function LanguageProvider({
  children,
  initialLanguage = 'en',
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const pathname = usePathname();
  const language = getLanguageFromPathname(pathname) ?? initialLanguage;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch {
      // The language still changes for the current visit.
    }

    document.cookie = `${COOKIE_KEY}=${nextLanguage}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
    const nextPath = localizePublicHref(pathname, nextLanguage);
    const destination = new URL(
      `${nextPath}${window.location.search}${window.location.hash}`,
      window.location.origin,
    );
    window.location.assign(destination.toString());
  }, [pathname]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  }, [language, setLanguage]);

  const localizedHref = useCallback(
    (href: string) => localizePublicHref(href, language),
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      isArabic: language === 'ar',
      setLanguage,
      toggleLanguage,
      localizedHref,
    }),
    [language, localizedHref, setLanguage, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}
