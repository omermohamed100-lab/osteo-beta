import type { Metadata } from 'next';
import { headers } from 'next/headers';
import {
  DEFAULT_LANGUAGE,
  isSiteLanguage,
  LANGUAGE_REQUEST_HEADER,
  localizePublicPath,
  type SiteLanguage,
} from '@/lib/i18n-routing';
import { PUBLIC_PAGE_META } from '@/lib/public-page-meta';
import { getSiteUrl } from '@/lib/site-url';
import type { PublicPageMeta } from '@/lib/public-page-meta';

const SITE_NAME = 'Egyptian Society of Osteopathic Medicine';
type LocalizedMetadataCopy = Record<SiteLanguage, PublicPageMeta>;

function metadataKeyForPath(pathname: string) {
  if (PUBLIC_PAGE_META[pathname]) return pathname;
  if (pathname.startsWith('/courses/')) return '/courses';
  if (pathname.startsWith('/activities/')) return '/activities';
  if (pathname.startsWith('/find-osteopath/')) return '/find-osteopath';
  return '/';
}

export function buildLocalizedMetadata(
  pathname: string,
  language: SiteLanguage,
  siteUrl = getSiteUrl(),
  override?: LocalizedMetadataCopy,
): Metadata {
  const pageMeta = override ?? PUBLIC_PAGE_META[metadataKeyForPath(pathname)];
  const localizedMeta = pageMeta[language];
  const canonicalPath = localizePublicPath(pathname, language);
  const englishPath = localizePublicPath(pathname, 'en');
  const arabicPath = localizePublicPath(pathname, 'ar');
  const imageUrl = new URL('/opengraph-image', siteUrl).toString();

  return {
    metadataBase: siteUrl,
    title: { absolute: localizedMeta.title },
    description: localizedMeta.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: englishPath,
        ar: arabicPath,
        'x-default': englishPath,
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: localizedMeta.title,
      description: localizedMeta.description,
      url: canonicalPath,
      locale: language === 'ar' ? 'ar_EG' : 'en_EG',
      alternateLocale: [language === 'ar' ? 'en_EG' : 'ar_EG'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'EGSOM',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedMeta.title,
      description: localizedMeta.description,
      images: [imageUrl],
    },
  };
}

export async function getLocalizedMetadata(
  pathname: string,
  override?: LocalizedMetadataCopy,
): Promise<Metadata> {
  const headerStore = await headers();
  const requestedLanguage = headerStore.get(LANGUAGE_REQUEST_HEADER);
  const language = isSiteLanguage(requestedLanguage)
    ? requestedLanguage
    : DEFAULT_LANGUAGE;

  return buildLocalizedMetadata(pathname, language, getSiteUrl(), override);
}
