import { notFound } from 'next/navigation';
import Link from '@/components/i18n/LocalizedLink';
import LocalizedDate from '@/components/i18n/LocalizedDate';
import LocalizedText from '@/components/i18n/LocalizedText';
import PageHeader from '@/components/layout/PageHeader';
import PublicDataUnavailable from '@/components/public/PublicDataUnavailable';
import PublicRecordActions from '@/components/public/PublicRecordActions';
import { db } from '@/lib/db';
import { getLocalizedMetadata } from '@/lib/localized-metadata';
import { getPublicData } from '@/lib/public-data';
import { getArabicContent } from '@/lib/arabic-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const path = `/courses/${encodeURIComponent(decodeURIComponent(id))}`;
  const { data: course } = await getPublicData(
    () => db.course.findFirst({ where: { id: decodeURIComponent(id), isActive: true } }),
    null,
  );
  return getLocalizedMetadata(path, course ? {
    en: { title: `${course.title} · EGSOM`, description: course.description },
    ar: { title: `${getArabicContent(course.titleAr)} · EGSOM`, description: getArabicContent(course.descriptionAr) },
  } : undefined);
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: course, unavailable } = await getPublicData(
    () => db.course.findFirst({ where: { id: decodeURIComponent(id), isActive: true } }),
    null,
  );

  if (!course && !unavailable) notFound();
  if (!course) {
    return <div className="flex-grow bg-slate-50/70 py-16"><div className="container mx-auto max-w-4xl px-4"><PublicDataUnavailable title={{ en: 'Course temporarily unavailable', ar: 'الدورة غير متاحة مؤقتًا' }} description={{ en: 'Course details cannot be retrieved right now. Please try again shortly.', ar: 'يتعذر استرجاع تفاصيل الدورة حاليًا. يُرجى المحاولة مرة أخرى بعد قليل.' }} /></div></div>;
  }

  return (
    <div className="flex-grow">
      <PageHeader eyebrow="Course" eyebrowAr="دورة" title={course.title} titleAr={getArabicContent(course.titleAr)} subtitle={course.description} subtitleAr={getArabicContent(course.descriptionAr)} />
      <section className="bg-slate-50/70 py-10 sm:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
            <article className="border border-brand-950/15 bg-white p-6 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600"><LocalizedText en="Course overview" ar="نظرة عامة على الدورة" /></p>
              <h2 dir="auto" className="mt-3 font-display text-3xl font-semibold text-brand-950"><LocalizedText en={course.title} ar={getArabicContent(course.titleAr)} /></h2>
              <p dir="auto" className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600"><LocalizedText en={course.description} ar={getArabicContent(course.descriptionAr)} /></p>
              <div className="mt-8"><PublicRecordActions title={course.title} description={course.description} start={course.startDate.toISOString()} end={course.endDate?.toISOString()} /></div>
            </article>

            <aside className="h-fit border border-brand-950/15 bg-bone p-6 sm:p-8" aria-label="Course information">
              <h2 className="font-display text-2xl font-semibold text-brand-950"><LocalizedText en="Course information" ar="معلومات الدورة" /></h2>
              <dl className="mt-6 space-y-5 text-sm">
                <div><dt className="text-slate-500"><LocalizedText en="Instructor" ar="المحاضر" /></dt><dd dir="auto" className="mt-1 font-semibold text-brand-950"><LocalizedText en={course.instructor} ar={getArabicContent(course.instructorAr)} /></dd></div>
                <div><dt className="text-slate-500"><LocalizedText en="Starts" ar="تبدأ في" /></dt><dd className="mt-1 font-semibold text-brand-950"><LocalizedDate value={course.startDate.toISOString()} /></dd></div>
                {course.endDate && <div><dt className="text-slate-500"><LocalizedText en="Ends" ar="تنتهي في" /></dt><dd className="mt-1 font-semibold text-brand-950"><LocalizedDate value={course.endDate.toISOString()} /></dd></div>}
                <div><dt className="text-slate-500"><LocalizedText en="Published duration" ar="المدة المنشورة" /></dt><dd dir="auto" className="mt-1 font-semibold text-brand-950"><LocalizedText en={course.duration} ar={getArabicContent(course.durationAr)} /></dd></div>
                {course.price != null && course.priceCurrency && <div><dt className="text-slate-500"><LocalizedText en="Published fee" ar="الرسوم المنشورة" /></dt><dd dir="ltr" className="mt-1 font-semibold text-brand-950">{new Intl.NumberFormat('en-US', { style: 'currency', currency: course.priceCurrency }).format(course.price)}</dd></div>}
              </dl>
            </aside>
          </div>
          <Link href="/courses" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-950"><span className="rtl-flip" aria-hidden="true">←</span><LocalizedText en="Back to courses" ar="العودة إلى الدورات" /></Link>
        </div>
      </section>
    </div>
  );
}
