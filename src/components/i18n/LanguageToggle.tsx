'use client';

import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function LanguageToggle() {
  const { isArabic, toggleLanguage } = useLanguage();
  const nextLanguage = isArabic ? 'English' : 'العربية';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    toggleLanguage();
    event.currentTarget.closest('details')?.removeAttribute('open');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        isArabic
          ? 'تغيير لغة الموقع إلى الإنجليزية'
          : 'تغيير لغة الموقع إلى العربية'
      }
      dir="ltr"
      className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-brand-200 bg-[rgb(252,254,255)] px-2.5 py-2 text-sm font-semibold text-brand-700 outline-none transition-[background-color,border-color,color,transform] duration-150 hover:border-brand-300 hover:bg-brand-50 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-brand-500/40 sm:px-3"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" strokeWidth="1.75" />
        <path
          strokeLinecap="round"
          strokeWidth="1.75"
          d="M3.5 12h17M12 3c2.2 2.35 3.3 5.35 3.3 9s-1.1 6.65-3.3 9c-2.2-2.35-3.3-5.35-3.3-9S9.8 5.35 12 3z"
        />
      </svg>
      <span
        lang={isArabic ? 'en' : 'ar'}
        dir={isArabic ? 'ltr' : 'rtl'}
        className="tracking-normal"
      >
        {nextLanguage}
      </span>
    </button>
  );
}
