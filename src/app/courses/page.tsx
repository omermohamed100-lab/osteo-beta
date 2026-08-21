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
  return getLocalizedMetadata('/courses');
}

export default async function CoursesPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: courses, unavailable: dataUnavailable } = await getPublicData(
    () => db.course.findMany({
      where: {
        isActive: true,
        OR: [
          { endDate: { gte: today } },
          { endDate: null, startDate: { gte: today } },
        ],
      },
      orderBy: { startDate: 'asc' },
    }),
    [],
  );

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Education"
        eyebrowAr="التعليم"
        title="Courses & Training"
        titleAr="الدورات والتدريب"
        subtitle="Published osteopathic workshops, courses, and professional-development opportunities."
        subtitleAr="ورش العمل والدورات وفرص التطوير المهني المنشورة في مجال الأوستيوباثي."
      />

      <div className="bg-slate-50/70 py-9 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {dataUnavailable ? (
            <PublicDataUnavailable
              title={{ en: 'Courses temporarily unavailable', ar: 'الدورات غير متاحة مؤقتًا' }}
              description={{
                en: 'Course information is temporarily unavailable. Please try again shortly.',
                ar: 'بيانات الدورات غير متاحة مؤقتًا. يُرجى المحاولة مرة أخرى بعد قليل.',
              }}
            />
          ) : courses.length === 0 ? (
            <div className="surface-panel p-10 text-center sm:p-12">
              <svg className="mx-auto mb-4 h-12 w-12 text-brand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="font-medium text-slate-600">
                <LocalizedText en="No courses are currently scheduled." ar="لا توجد دورات مجدولة حاليًا." />
              </p>
              <p className="mt-1 text-sm text-slate-500">
                <LocalizedText
                  en="Check back soon for upcoming programs."
                  ar="عُد قريبًا للاطلاع على البرامج القادمة."
                />
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex min-h-12 items-center justify-center bg-brand-950 px-5 text-sm font-semibold text-bone outline-none transition-[background-color,transform] duration-150 hover:bg-brand-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
              >
                <LocalizedText en="Ask about upcoming programs" ar="استفسر عن البرامج القادمة" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {courses.map((course) => (
                <div key={course.id} className="surface-card flex flex-col overflow-hidden">
                  {course.imageUrl ? (
                    // CMS images may be hosted on education-provider domains.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.imageUrl} alt={`${course.title} / ${getArabicContent(course.titleAr)}`} className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-44 bg-brand-950 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h2 dir="auto" className="font-bold text-gray-900 text-base leading-snug"><LocalizedText en={course.title} ar={getArabicContent(course.titleAr)} /></h2>
                      {course.price != null && course.priceCurrency && (
                        <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                          <bdi dir="ltr" lang="en" className="font-sans">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: course.priceCurrency }).format(course.price)}
                          </bdi>
                        </span>
                      )}
                    </div>
                    <p dir="auto" className="mb-5 flex-grow text-sm leading-relaxed text-slate-600"><LocalizedText en={course.description} ar={getArabicContent(course.descriptionAr)} /></p>
                    <div className="space-y-2 border-t border-brand-100/70 pt-4 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span dir="auto"><LocalizedText en={course.instructor} ar={getArabicContent(course.instructorAr)} /></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span><LocalizedDate value={course.startDate.toISOString()} /></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span dir="auto"><LocalizedText en={course.duration} ar={getArabicContent(course.durationAr)} /></span>
                      </div>
                    </div>
                    <Link href={`/courses/${encodeURIComponent(course.id)}`} className="mt-5 inline-flex min-h-11 items-center gap-2 border-t border-brand-100/70 pt-4 text-sm font-semibold text-brand-700 hover:text-brand-950 focus-visible:ring-2 focus-visible:ring-brand-600">
                      <LocalizedText en="View course details" ar="عرض تفاصيل الدورة" />
                      <span className="rtl-flip" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
