import { db } from '@/lib/db';
import { withPublicDataFallback } from '@/lib/public-data';
import LocalizedText from '@/components/i18n/LocalizedText';
import LocalizedDate from '@/components/i18n/LocalizedDate';
import { getLocalizedMetadata } from '@/lib/localized-metadata';

export const dynamic = 'force-dynamic';
import PageHeader from '@/components/layout/PageHeader';

export async function generateMetadata() {
  return getLocalizedMetadata('/courses');
}

export default async function CoursesPage() {
  const courses = await withPublicDataFallback(
    () => db.course.findMany({
      where: { isActive: true },
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
        subtitle="Comprehensive osteopathic training programs, from introductory workshops to advanced certification, designed to meet international standards."
        subtitleAr="برامج تدريبية متكاملة في الطب الأوستيوباثي، من ورش العمل التمهيدية إلى الاعتماد المتقدم، ومصممة وفق المعايير الدولية."
      />

      <div className="bg-slate-50/70 py-9 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {courses.length === 0 ? (
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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {courses.map((course) => (
                <div key={course.id} className="surface-card flex flex-col overflow-hidden">
                  {course.imageUrl ? (
                    // CMS images may be hosted on education-provider domains.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.imageUrl} alt={course.title} className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-44 bg-brand-950 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h2 dir="auto" className="font-bold text-gray-900 text-base leading-snug">{course.title}</h2>
                      {course.price != null && (
                        <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                          <bdi dir="ltr" lang="en" className="font-sans">
                            ${course.price}
                          </bdi>
                        </span>
                      )}
                    </div>
                    <p dir="auto" className="mb-5 flex-grow text-sm leading-relaxed text-slate-600">{course.description}</p>
                    <div className="space-y-2 border-t border-brand-100/70 pt-4 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span dir="auto">{course.instructor}</span>
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
                        <span dir="auto">{course.duration}</span>
                      </div>
                    </div>
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
