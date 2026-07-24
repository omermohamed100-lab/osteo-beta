'use client';

import { useLanguage } from '@/components/i18n/LanguageProvider';

type Props = {
  en: React.ReactNode;
  ar: React.ReactNode;
  className?: string;
};

export default function LocalizedText({ en, ar, className = '' }: Props) {
  const { isArabic } = useLanguage();

  return (
    <span
      lang={isArabic ? 'ar' : 'en'}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`${isArabic ? 'font-arabic tracking-normal normal-case not-italic' : ''} ${className}`.trim()}
    >
      {isArabic ? ar : en}
    </span>
  );
}
