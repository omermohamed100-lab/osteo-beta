const LOCAL_SITE_URL = 'http://localhost:3000';
export const VERCEL_FALLBACK_SITE_URL = 'https://osteo-beta.vercel.app';

function normalizeSiteUrl(value: string | undefined): URL | null {
  if (!value?.trim()) return null;

  try {
    const normalizedValue = value.trim();
    const url = new URL(
      normalizedValue.includes('://')
        ? normalizedValue
        : `https://${normalizedValue}`,
    );
    const isLocalHttp = url.protocol === 'http:'
      && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);

    if ((url.protocol !== 'https:' && !isLocalHttp) || url.username || url.password) {
      return null;
    }

    url.pathname = '/';
    url.search = '';
    url.hash = '';
    return url;
  } catch {
    return null;
  }
}

export function getSiteUrl(): URL {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL ? VERCEL_FALLBACK_SITE_URL : undefined,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const siteUrl = normalizeSiteUrl(candidate);
    if (siteUrl) return siteUrl;
  }

  return new URL(LOCAL_SITE_URL);
}
