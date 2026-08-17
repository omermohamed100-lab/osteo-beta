import type { MetadataRoute } from 'next';
import {
  PUBLIC_PAGE_PATHS,
  SITE_LANGUAGES,
  localizePublicPath,
} from '@/lib/i18n-routing';
import { getSiteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return PUBLIC_PAGE_PATHS.flatMap((pathname) => {
    const languages = {
      en: new URL(localizePublicPath(pathname, 'en'), siteUrl).toString(),
      ar: new URL(localizePublicPath(pathname, 'ar'), siteUrl).toString(),
    };

    return SITE_LANGUAGES.map((language) => ({
      url: languages[language],
      alternates: { languages },
    }));
  });
}
