'use client';

import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function LocalizedDate({ value }: { value: string }) {
  const { isArabic } = useLanguage();

  return (
    <time
      dateTime={value}
      lang={isArabic ? 'ar-EG' : 'en-US'}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {new Intl.DateTimeFormat(isArabic ? 'ar-EG' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        calendar: 'gregory',
        timeZone: 'Africa/Cairo',
      }).format(new Date(value))}
    </time>
  );
}
