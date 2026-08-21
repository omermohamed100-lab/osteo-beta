import type { MetadataRoute } from 'next';
import {
  PUBLIC_PAGE_PATHS,
  SITE_LANGUAGES,
  localizePublicPath,
} from '@/lib/i18n-routing';
import { getSiteUrl } from '@/lib/site-url';
import { approvedOsteopaths } from '@/data/approved-osteopaths';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const profileReviewDates = new Map(
    approvedOsteopaths.map((profile) => [
      `/find-osteopath/${encodeURIComponent(profile.id)}`,
      profile.profileReviewedAt ?? undefined,
    ]),
  );
  const publicPaths = [
    ...PUBLIC_PAGE_PATHS,
    ...profileReviewDates.keys(),
  ];

  return publicPaths.flatMap((pathname) => {
    const languages = {
      en: new URL(localizePublicPath(pathname, 'en'), siteUrl).toString(),
      ar: new URL(localizePublicPath(pathname, 'ar'), siteUrl).toString(),
      'x-default': new URL(localizePublicPath(pathname, 'en'), siteUrl).toString(),
    };

    return SITE_LANGUAGES.map((language) => ({
      url: languages[language],
      alternates: { languages },
      lastModified: profileReviewDates.get(pathname),
    }));
  });
}
