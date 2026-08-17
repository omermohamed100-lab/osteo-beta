'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen bg-bone text-ink">
        <main className="flex min-h-screen items-center px-4 py-16">
          <div role="alert" className="surface-panel mx-auto w-full max-w-2xl p-8 text-center sm:p-12">
            <h1 className="font-display text-4xl font-semibold text-brand-950">The site is temporarily unavailable</h1>
            <p className="mt-4 text-ink-muted">Please try loading the page again.</p>
            <div lang="ar" dir="rtl" className="mt-6 border-t border-brand-950/10 pt-6">
              <h2 className="font-arabic text-2xl font-semibold text-brand-950">الموقع غير متاح مؤقتًا</h2>
              <p className="mt-2 text-ink-muted">يُرجى محاولة تحميل الصفحة مرة أخرى.</p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-8 min-h-12 bg-brand-950 px-6 text-sm font-semibold text-bone outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
            >
              Try again · حاول مرة أخرى
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
