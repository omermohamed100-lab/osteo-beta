export const SITE_LANGUAGES = ['en', 'ar'] as const;

export type SiteLanguage = (typeof SITE_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SiteLanguage = 'en';
export const LANGUAGE_REQUEST_HEADER = 'x-egsom-locale';

export const PUBLIC_PAGE_PATHS = [
  '/',
  '/about',
  '/courses',
  '/activities',
  '/find-osteopath',
  '/practitioners',
  '/gallery',
  '/contact',
  '/privacy',
] as const;

const publicPagePathSet = new Set<string>(PUBLIC_PAGE_PATHS);
const dynamicPublicPagePatterns = [
  /^\/courses\/[^/]+$/,
  /^\/activities\/[^/]+$/,
  /^\/find-osteopath\/[^/]+$/,
];

export function isSiteLanguage(value: string | null | undefined): value is SiteLanguage {
  return SITE_LANGUAGES.includes(value as SiteLanguage);
}

export function getLanguageFromPathname(pathname: string): SiteLanguage | null {
  const firstSegment = pathname.split('/')[1];
  return isSiteLanguage(firstSegment) ? firstSegment : null;
}

export function getPublicPathFromPathname(pathname: string): string {
  const language = getLanguageFromPathname(pathname);
  if (!language) return pathname || '/';

  const unprefixed = pathname.slice(language.length + 1);
  return unprefixed || '/';
}

export function isPublicPagePath(pathname: string): boolean {
  return publicPagePathSet.has(pathname)
    || dynamicPublicPagePatterns.some((pattern) => pattern.test(pathname));
}

export function localizePublicPath(
  pathname: string,
  language: SiteLanguage,
): string {
  const publicPath = getPublicPathFromPathname(pathname);
  if (!isPublicPagePath(publicPath)) return pathname;
  return publicPath === '/' ? `/${language}` : `/${language}${publicPath}`;
}

export function localizePublicHref(
  href: string,
  language: SiteLanguage,
): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;

  const hashIndex = href.indexOf('#');
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf('?');
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : '';
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;

  return `${localizePublicPath(pathname || '/', language)}${query}${hash}`;
}
