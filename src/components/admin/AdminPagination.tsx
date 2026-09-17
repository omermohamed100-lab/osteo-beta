'use client';

type Props = {
  page: number;
  isLoading: boolean;
  hasNext: boolean;
  next: () => void;
  previous: () => void;
  refresh: () => void;
};

export default function AdminPagination({ page, isLoading, hasNext, next, previous, refresh }: Props) {
  const button = 'min-h-11 rounded-lg border border-slate-300 bg-paper px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-default disabled:opacity-50';
  return (
    <nav aria-label="Records pagination" className="my-5 flex flex-wrap items-center gap-3">
      <button type="button" disabled={isLoading || page === 1} onClick={previous} className={button}>Previous</button>
      <span role="status" aria-live="polite" className="text-sm text-slate-600">{isLoading ? 'Loading records…' : `Page ${page}`}</span>
      <button type="button" disabled={isLoading || !hasNext} onClick={next} className={button}>Next</button>
      <button type="button" disabled={isLoading} onClick={refresh} className={`${button} ms-auto`}>Refresh</button>
    </nav>
  );
}
