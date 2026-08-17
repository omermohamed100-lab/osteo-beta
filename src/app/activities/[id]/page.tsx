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

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const path = `/activities/${encodeURIComponent(decodeURIComponent(id))}`;
  const { data: activity } = await getPublicData(
    () => db.activity.findFirst({ where: { id: decodeURIComponent(id), isActive: true } }),
    null,
  );
  return getLocalizedMetadata(path, activity ? {
    en: { title: `${activity.title} · EGSOM`, description: activity.description },
    ar: { title: `${activity.titleAr || activity.title} · EGSOM`, description: activity.descriptionAr || activity.description },
  } : undefined);
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: activity, unavailable } = await getPublicData(
    () => db.activity.findFirst({ where: { id: decodeURIComponent(id), isActive: true } }),
    null,
  );

  if (!activity && !unavailable) notFound();
  if (!activity) {
    return <div className="flex-grow bg-slate-50/70 py-16"><div className="container mx-auto max-w-4xl px-4"><PublicDataUnavailable title={{ en: 'Activity temporarily unavailable', ar: 'النشاط غير متاح مؤقتًا' }} description={{ en: 'Activity details cannot be retrieved right now. Please try again shortly.', ar: 'يتعذر استرجاع تفاصيل النشاط حاليًا. يُرجى المحاولة مرة أخرى بعد قليل.' }} /></div></div>;
  }

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`;

  return (
    <div className="flex-grow">
      <PageHeader eyebrow="Activity" eyebrowAr="نشاط" title={activity.title} titleAr={activity.titleAr || activity.title} subtitle={activity.description} subtitleAr={activity.descriptionAr || activity.description} />
      <section className="bg-slate-50/70 py-10 sm:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
            <article className="border border-brand-950/15 bg-white p-6 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600"><LocalizedText en="Activity details" ar="تفاصيل النشاط" /></p>
              <h2 dir="auto" className="mt-3 font-display text-3xl font-semibold text-brand-950"><LocalizedText en={activity.title} ar={activity.titleAr || activity.title} /></h2>
              <p dir="auto" className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600"><LocalizedText en={activity.description} ar={activity.descriptionAr || activity.description} /></p>
              <div className="mt-8"><PublicRecordActions title={activity.title} description={activity.description} start={activity.date.toISOString()} location={activity.location} /></div>
            </article>

            <aside className="h-fit border border-brand-950/15 bg-bone p-6 sm:p-8" aria-label="Activity information">
              <h2 className="font-display text-2xl font-semibold text-brand-950"><LocalizedText en="When and where" ar="الموعد والمكان" /></h2>
              <dl className="mt-6 space-y-5 text-sm">
                <div><dt className="text-slate-500"><LocalizedText en="Date" ar="التاريخ" /></dt><dd className="mt-1 font-semibold text-brand-950"><LocalizedDate value={activity.date.toISOString()} /></dd></div>
                <div><dt className="text-slate-500"><LocalizedText en="Published location" ar="الموقع المنشور" /></dt><dd dir="auto" className="mt-1 font-semibold leading-6 text-brand-950"><LocalizedText en={activity.location} ar={activity.locationAr || activity.location} /></dd></div>
              </dl>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-950"><LocalizedText en="Open location in Maps" ar="فتح الموقع في الخرائط" /></a>
            </aside>
          </div>
          <Link href="/activities" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-950"><span className="rtl-flip" aria-hidden="true">←</span><LocalizedText en="Back to activities" ar="العودة إلى الأنشطة" /></Link>
        </div>
      </section>
    </div>
  );
}
