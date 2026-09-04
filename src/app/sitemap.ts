import type { MetadataRoute } from 'next';
import {
  PUBLIC_PAGE_PATHS,
  SITE_LANGUAGES,
  localizePublicPath,
} from '@/lib/i18n-routing';
import { getSiteUrl } from '@/lib/site-url';
import { approvedOsteopaths } from '@/data/approved-osteopaths';
import { db } from '@/lib/db';
import { getPublicData } from '@/lib/public-data';
import { getPublicOsteopaths } from '@/lib/public-osteopath';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [courses, activities, practitionerResult] = await Promise.all([
    getPublicData(
      () => db.course.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true },
      }),
      [] as { id: string; updatedAt: Date }[],
    ),
    getPublicData(
      () => db.activity.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true },
      }),
      [] as { id: string; updatedAt: Date }[],
    ),
    getPublicOsteopaths(),
  ]);
  const profileReviewDates = new Map(
    practitionerResult.data.map((profile) => [
      `/find-osteopath/${encodeURIComponent(profile.id)}`,
      approvedOsteopaths.find((approved) => approved.email.toLowerCase() === profile.email.toLowerCase())?.profileReviewedAt ?? undefined,
    ]),
  );
  const recordDates = new Map<string, Date | string | undefined>([
    ...courses.data.map((course) => [`/courses/${encodeURIComponent(course.id)}`, course.updatedAt] as const),
    ...activities.data.map((activity) => [`/activities/${encodeURIComponent(activity.id)}`, activity.updatedAt] as const),
    ...profileReviewDates,
  ]);
  const publicPaths = [
    ...PUBLIC_PAGE_PATHS,
    ...recordDates.keys(),
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
      lastModified: recordDates.get(pathname),
    }));
  });
}
