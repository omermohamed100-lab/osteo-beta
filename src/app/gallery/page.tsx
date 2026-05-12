import { db } from '@/lib/db';
import PageHeader from '@/components/layout/PageHeader';

export default async function GalleryPage() {
  const items = await db.galleryItem.findMany({ orderBy: { createdAt: 'desc' } });
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Moments"
        title="Initiatives Gallery"
        subtitle="Browse photos from our past training sessions, workshops, conferences, and community outreach initiatives."
      />

      <div className="bg-slate-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-medium">No gallery images have been added yet.</p>
            </div>
          ) : (
            <div className="space-y-14">
              {categories.map((cat) => {
                const catItems = items.filter((i) => i.category === cat);
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-px flex-grow bg-gray-200" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2">{cat}</span>
                      <div className="h-px flex-grow bg-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {catItems.map((item) => (
                        <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                          <img
                            src={item.imageUrl}
                            alt={item.caption || cat}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {item.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <p className="text-white text-xs leading-snug">{item.caption}</p>
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
