import type { Activity } from '@prisma/client';
import { db } from '@/lib/db';
import { getPublicData } from '@/lib/public-data';
import LocalizedText from '@/components/i18n/LocalizedText';
import LocalizedDate from '@/components/i18n/LocalizedDate';
import PublicDataUnavailable from '@/components/public/PublicDataUnavailable';
import { getLocalizedMetadata } from '@/lib/localized-metadata';
import Link from '@/components/i18n/LocalizedLink';
import { getArabicContent } from '@/lib/arabic-content';

export const dynamic = 'force-dynamic';
import PageHeader from '@/components/layout/PageHeader';

export async function generateMetadata() {
  return getLocalizedMetadata('/activities');
}

function activityState(date: Date, today: Date) {
  const activityDay = new Date(date);
  activityDay.setHours(0, 0, 0, 0);
  if (activityDay > today) return { en: 'Upcoming', ar: 'قادمة' };
  if (activityDay < today) return { en: 'Past', ar: 'سابقة' };
  return { en: 'Today', ar: 'اليوم' };
}

export default async function ActivitiesPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: activities, unavailable: dataUnavailable } = await getPublicData(
    () => db.activity.findMany({
      where: { isActive: true },
      orderBy: { date: 'desc' },
    }),
    [],
  );

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Events"
        eyebrowAr="الفعاليات"
        title="Activities & Events"
        titleAr="الأنشطة والفعاليات"
        subtitle="Stay engaged with the osteopathic community through seminars, annual conferences, and community outreach programs."
        subtitleAr="ابقَ على تواصل مع مجتمع الطب الأوستيوباثي من خلال الندوات والمؤتمرات السنوية وبرامج التواصل المجتمعي."
      />

      <div className="bg-slate-50/70 py-9 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {dataUnavailable ? (
            <PublicDataUnavailable
              title={{ en: 'Activities & Events temporarily unavailable', ar: 'الأنشطة والفعاليات غير متاحة مؤقتًا' }}
              description={{
                en: 'Activities and event information is temporarily unavailable. Please try again shortly.',
                ar: 'بيانات الأنشطة والفعاليات غير متاحة مؤقتًا. يُرجى المحاولة مرة أخرى بعد قليل.',
              }}
            />
          ) : activities.length === 0 ? (
            <div className="surface-panel p-10 text-center sm:p-12">
              <svg className="mx-auto mb-4 h-12 w-12 text-brand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-medium text-slate-600">
                <LocalizedText en="No upcoming activities or events at the moment." ar="لا توجد أنشطة أو فعاليات قادمة في الوقت الحالي." />
              </p>
              <p className="mt-1 text-sm text-slate-500">
                <LocalizedText
                  en="Check back soon."
                  ar="عُد قريبًا للاطلاع على أحدث الأنشطة."
                />
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex min-h-12 items-center justify-center bg-brand-950 px-5 text-sm font-semibold text-bone outline-none transition-[background-color,transform] duration-150 hover:bg-brand-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
              >
                <LocalizedText en="Ask about upcoming activities" ar="استفسر عن الأنشطة القادمة" />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {activities.map((activity: Activity) => {
                const state = activityState(activity.date, today);
                return (
                <div key={activity.id} className="surface-card flex flex-col overflow-hidden sm:flex-row">
                  {activity.imageUrl ? (
                    // CMS images may be hosted on practitioner-selected domains.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activity.imageUrl}
                      alt={`${activity.title} / ${getArabicContent(activity.titleAr)}`}
                      className="w-full sm:w-52 h-44 sm:h-auto object-cover shrink-0"
                    />
                  ) : (
                    <div className="hidden sm:flex w-52 bg-brand-950 items-center justify-center shrink-0">
                      <svg className="w-8 h-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5 sm:p-7 flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                        <LocalizedDate value={activity.date.toISOString()} />
                      </span>
                      <span className="border border-brand-100 bg-white px-2.5 py-1 text-xs font-semibold text-brand-700">
                        <LocalizedText en={state.en} ar={state.ar} />
                      </span>
                    </div>
                    <h2 dir="auto" className="font-bold text-gray-900 text-lg mb-2 leading-snug"><LocalizedText en={activity.title} ar={getArabicContent(activity.titleAr)} /></h2>
                    <p dir="auto" className="mb-4 text-sm leading-relaxed text-slate-600"><LocalizedText en={activity.description} ar={getArabicContent(activity.descriptionAr)} /></p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span dir="auto"><LocalizedText en={activity.location} ar={getArabicContent(activity.locationAr)} /></span>
                    </div>
                    <Link href={`/activities/${encodeURIComponent(activity.id)}`} className="mt-4 inline-flex min-h-11 items-center gap-2 border-t border-brand-100/70 pt-4 text-sm font-semibold text-brand-700 hover:text-brand-950 focus-visible:ring-2 focus-visible:ring-brand-600">
                      <LocalizedText en="View activity details" ar="عرض تفاصيل النشاط" />
                      <span className="rtl-flip" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
