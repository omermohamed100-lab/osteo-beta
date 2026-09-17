'use client';

import { useEffect, useState } from 'react';
import { fetchJsonWithTimeout, RequestTimeoutError } from '@/lib/fetch-with-timeout';

type Page<T> = { items: T[]; nextCursor: string | null };
class AdminPageLoadError extends Error {}

export function useAdminPage<T>(endpoint: string) {
  const [navigation, setNavigation] = useState<{ endpoint: string; cursors: (string | null)[] }>({ endpoint, cursors: [null] });
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<Page<T> & { key: string; error: string }>({ items: [], nextCursor: null, key: '', error: '' });
  const cursors = navigation.endpoint === endpoint ? navigation.cursors : [null];
  const cursor = cursors.at(-1);
  const url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}limit=25${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
  const key = `${url}:${revision}`;
  const isLoading = result.key !== key;

  useEffect(() => {
    const controller = new AbortController();
    fetchJsonWithTimeout<Page<T>>(url, { cache: 'no-store', signal: controller.signal })
      .then(({ response, data }) => {
        if (!response.ok) throw new AdminPageLoadError(response.status === 401
          ? 'Your session has expired. Sign in again to view these records.'
          : 'Records could not be loaded. Please try again.');
        if (!data || !Array.isArray(data.items) || !(data.nextCursor === null || typeof data.nextCursor === 'string')) {
          throw new AdminPageLoadError('Records could not be loaded. Please try again.');
        }
        if (!controller.signal.aborted) setResult({ ...data, key, error: '' });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setResult({ items: [], nextCursor: null, key, error: error instanceof RequestTimeoutError
          ? 'Loading took too long. Please try again.'
          : error instanceof AdminPageLoadError ? error.message : 'Records could not be loaded. Please try again.' });
      });
    return () => controller.abort();
  }, [url, key]);

  return {
    items: isLoading ? [] : result.items,
    setItems: (update: (items: T[]) => T[]) => setResult((current) => ({ ...current, items: update(current.items) })),
    error: isLoading ? '' : result.error,
    isLoading,
    page: cursors.length,
    hasNext: !isLoading && result.nextCursor !== null,
    refresh: () => setRevision((value) => value + 1),
    reset: () => setNavigation({ endpoint, cursors: [null] }),
    next: () => {
      if (!isLoading && result.nextCursor) setNavigation({ endpoint, cursors: [...cursors, result.nextCursor] });
    },
    previous: () => {
      if (!isLoading && cursors.length > 1) setNavigation({ endpoint, cursors: cursors.slice(0, -1) });
    },
  };
}
