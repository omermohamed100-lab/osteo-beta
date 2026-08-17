'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { isArabic } = useLanguage();

  useEffect(() => {
    // The browser receives only an opaque digest; visitor content is not logged.
    console.error('Public page render failed.', { digest: error.digest });
  }, [error]);

  return (
    <div className="flex flex-grow items-center bg-slate-50/70 px-4 py-16 sm:py-24">
      <div role="alert" className="surface-panel mx-auto w-full max-w-2xl p-8 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
          {isArabic ? 'خطأ مؤقت' : 'Temporary error'}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-brand-950 sm:text-5xl">
          {isArabic ? 'تعذر عرض هذه الصفحة' : 'We could not display this page'}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-muted">
          {isArabic
            ? 'حدث خطأ مؤقت. يمكنك محاولة تحميل الصفحة مرة أخرى.'
            : 'A temporary error occurred. You can try loading the page again.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex min-h-12 items-center justify-center bg-brand-950 px-6 text-sm font-semibold text-bone outline-none transition-[background-color,transform] duration-150 hover:bg-brand-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
        >
          {isArabic ? 'حاول مرة أخرى' : 'Try again'}
        </button>
      </div>
    </div>
  );
}
