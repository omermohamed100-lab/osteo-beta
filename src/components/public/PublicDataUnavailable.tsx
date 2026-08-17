'use client';

import LocalizedText from '@/components/i18n/LocalizedText';

type LocalizedCopy = {
  en: string;
  ar: string;
};

type PublicDataUnavailableProps = {
  title: LocalizedCopy;
  description: LocalizedCopy;
  retryLabel?: LocalizedCopy;
  onRetry?: () => void;
  variant?: 'panel' | 'footer';
};

const defaultRetryLabel = {
  en: 'Try again',
  ar: 'حاول مرة أخرى',
};

export default function PublicDataUnavailable({
  title,
  description,
  retryLabel = defaultRetryLabel,
  onRetry,
  variant = 'panel',
}: PublicDataUnavailableProps) {
  const retry = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  if (variant === 'footer') {
    return (
      <div role="status" aria-live="polite" aria-atomic="true" className="rounded-lg border border-gold/25 bg-brand-900/65 p-3">
        <p className="text-xs font-semibold text-gold-soft">
          <LocalizedText en={title.en} ar={title.ar} />
        </p>
        <p className="mt-1 text-xs leading-5 text-brand-200/80">
          <LocalizedText en={description.en} ar={description.ar} />
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-1.5 inline-flex min-h-11 items-center text-xs font-medium text-gold underline decoration-gold/60 underline-offset-4 transition-colors hover:text-gold-soft"
        >
          <LocalizedText en={retryLabel.en} ar={retryLabel.ar} />
        </button>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="flex items-start gap-4 rounded-xl border border-gold/35 bg-gold-soft/45 p-6 sm:p-8">
      <svg className="mt-0.5 h-6 w-6 shrink-0 text-gold-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 9.75h1.5v6h-1.5v-6zm0-3h1.5v1.5h-1.5v-1.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="flex-1">
        <p className="text-sm font-semibold text-brand-950">
          <LocalizedText en={title.en} ar={title.ar} />
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          <LocalizedText en={description.en} ar={description.ar} />
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-2 inline-flex min-h-11 items-center font-medium text-brand-700 underline decoration-gold/70 underline-offset-4 transition-colors hover:text-brand-950"
        >
          <LocalizedText en={retryLabel.en} ar={retryLabel.ar} />
        </button>
      </div>
    </div>
  );
}
