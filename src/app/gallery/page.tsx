import { db } from '@/lib/db';
import { withPublicDataFallback } from '@/lib/public-data';
import LocalizedText from '@/components/i18n/LocalizedText';
import { getLocalizedMetadata } from '@/lib/localized-metadata';

export const dynamic = 'force-dynamic';
import PageHeader from '@/components/layout/PageHeader';

export async function generateMetadata() {
  return getLocalizedMetadata('/gallery');
}

export default async function GalleryPage() {
  const items = await withPublicDataFallback(
    () => db.galleryItem.findMany({ orderBy: { createdAt: 'desc' } }),
    [],
  );
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Moments"
        eyebrowAr="لحظات"
        title="Initiatives Gallery"
        titleAr="معرض الصور"
        subtitle="Browse photos from our past training sessions, workshops, conferences, and community outreach initiatives."
        subtitleAr="تصفّح صور جلساتنا التدريبية وورش العمل والمؤتمرات ومبادرات التواصل المجتمعي السابقة."
      />

      <div className="bg-slate-50/70 py-9 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {items.length === 0 ? (
            <div className="surface-panel p-10 text-center sm:p-12">
              <svg className="mx-auto mb-4 h-12 w-12 text-brand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-medium text-slate-600">
                <LocalizedText en="No gallery images have been added yet." ar="لم تتم إضافة صور إلى المعرض بعد." />
              </p>
            </div>
          ) : (
            <div className="space-y-14">
              {categories.map((cat) => {
                const catItems = items.filter((i) => i.category === cat);
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-px flex-grow bg-gray-200" />
                      <span dir="auto" className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">{cat}</span>
                      <div className="h-px flex-grow bg-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {catItems.map((item) => (
                        <div key={item.id} className="gallery-card surface-card relative aspect-square overflow-hidden bg-slate-100">
                          {/* CMS images may be hosted on arbitrary approved domains. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.caption || cat}
                            className="gallery-image h-full w-full object-cover"
                          />
                          {item.caption && (
                            <div className="gallery-caption absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                              <p dir="auto" className="text-white text-xs leading-snug">{item.caption}</p>
                            </div>
                          )}
                        </div>
                      ))}
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
