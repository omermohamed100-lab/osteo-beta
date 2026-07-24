'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import { PUBLIC_PAGE_META } from '@/lib/public-page-meta';

export type Language = 'en' | 'ar';

type LanguageContextValue = {
  language: Language;
  isArabic: boolean;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const STORAGE_KEY = 'egsom-language';
const COOKIE_KEY = 'egsom-language';
const ONE_YEAR = 60 * 60 * 24 * 365;

const LanguageContext = createContext<LanguageContextValue | null>(null);

export default function LanguageProvider({
  children,
  initialLanguage = 'en',
  hasLanguageCookie = false,
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
  hasLanguageCookie?: boolean;
}) {
  const pathname = usePathname();
  const [language, setLanguageState] =
    useState<Language>(initialLanguage);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (!hasLanguageCookie && (saved === 'ar' || saved === 'en')) {
        const frame = window.requestAnimationFrame(() => {
          setLanguageState(saved);
        });
        document.cookie = `${COOKIE_KEY}=${saved}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
        return () => window.cancelAnimationFrame(frame);
      }

      window.localStorage.setItem(STORAGE_KEY, initialLanguage);
    } catch {
      // The server-provided language remains the safe source of truth.
    }
  }, [hasLanguageCookie, initialLanguage]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const pageMeta = PUBLIC_PAGE_META[pathname];
    if (!pageMeta) return;

    const localizedMeta = pageMeta[language];
    const frame = window.requestAnimationFrame(() => {
      document.title = localizedMeta.title;
    });

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    description?.setAttribute('content', localizedMeta.description);
    return () => window.cancelAnimationFrame(frame);
  }, [language, pathname]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);

    try {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch {
      // The language still changes for the current visit.
    }

    document.cookie = `${COOKIE_KEY}=${nextLanguage}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  }, [language, setLanguage]);

  const value = useMemo(
    () => ({
      language,
      isArabic: language === 'ar',
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage],
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
