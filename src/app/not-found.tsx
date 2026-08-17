import Link from '@/components/i18n/LocalizedLink';

export default function NotFound() {
  return (
    <div className="flex flex-grow items-center bg-slate-50/70 px-4 py-16 sm:py-24">
      <div className="surface-panel mx-auto w-full max-w-2xl p-8 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-brand-950 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          The page may have moved or the address may be incorrect.
        </p>
        <div lang="ar" dir="rtl" className="mt-6 border-t border-brand-950/10 pt-6">
          <h2 className="font-arabic text-2xl font-semibold text-brand-950">الصفحة غير موجودة</h2>
          <p className="mt-2 text-sm leading-7 text-ink-muted">ربما تم نقل الصفحة أو أن العنوان غير صحيح.</p>
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center bg-brand-950 px-6 text-sm font-semibold text-bone outline-none transition-[background-color,transform] duration-150 hover:bg-brand-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
        >
          Home · الرئيسية
        </Link>
      </div>
    </div>
  );
}
