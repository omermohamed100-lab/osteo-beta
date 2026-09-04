'use client';

import { useState, useEffect } from 'react';
import ArabicContentWarning from '@/components/admin/ArabicContentWarning';
import AdminDialog from '@/components/admin/AdminDialog';

type GalleryItem = {
  id: string;
  imageUrl: string;
  caption: string;
  captionAr: string;
  category: string;
  categoryAr: string;
  createdAt: string;
};

const EMPTY_FORM = { imageUrl: '', caption: '', captionAr: '', category: 'General', categoryAr: '' };
const inputCls   = 'w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-brand-500 focus:border-brand-500';
const labelCls   = 'block text-sm font-medium text-gray-700 mb-1';

function getMissingArabicFields(item: Pick<GalleryItem, 'caption' | 'captionAr' | 'category' | 'categoryAr'>) {
  return [
    item.caption?.trim() && !item.captionAr?.trim() && 'caption',
    item.category?.trim() && !item.categoryAr?.trim() && 'category',
  ].filter((field): field is string => Boolean(field));
}

function GalleryPreview({ src, alt, large = false }: { src: string; alt: string; large?: boolean }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 ${large ? 'aspect-[16/10] w-full' : 'aspect-[4/3] w-24'}`}>
      {failed ? (
        <span className="px-2 text-center text-xs text-slate-500">Preview unavailable</span>
      ) : (
        // Admin-entered image URLs may use arbitrary hosts.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-contain" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

export default function AdminGalleryPage() {
  const [items, setItems]             = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [isSaving, setIsSaving]       = useState(false);

  const set = (patch: Partial<typeof EMPTY_FORM>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) setItems(await res.json());
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
    let cancelled = false;

    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setItems(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => { setFormData(EMPTY_FORM); setEditingId(null); setIsModalOpen(true); };
  const openEdit   = (item: GalleryItem) => {
    setFormData({ imageUrl: item.imageUrl, caption: item.caption, captionAr: item.captionAr, category: item.category, categoryAr: item.categoryAr });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const url    = editingId ? `/api/gallery/${editingId}` : '/api/gallery';
    const method = editingId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) { setIsModalOpen(false); fetchItems(); }
      else alert('Failed to save');
    } catch { alert('Error saving'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch { alert('Error deleting'); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Gallery</h1>
        <button type="button" onClick={openCreate} className="min-h-11 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base">
          Add Image
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div role="status" aria-live="polite" className="p-8 text-center text-gray-500">Loading gallery…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No gallery images yet. Add one!</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Preview', 'Caption', 'Category', 'Added', 'Actions'].map((h) => (
                  <th key={h} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider${h === 'Actions' ? ' text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <GalleryPreview key={item.imageUrl} src={item.imageUrl} alt={item.caption || 'Gallery image preview'} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                    <span className="block truncate">{item.caption || '—'}</span>
                    <ArabicContentWarning missingFields={getMissingArabicFields(item)} compact />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-brand-50 text-brand-700 font-medium">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button type="button" onClick={() => openEdit(item)} className="min-h-11 px-2 text-brand-600 hover:text-brand-900">Edit <span className="sr-only">{item.caption || 'gallery image'}</span></button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="min-h-11 px-2 text-red-600 hover:text-red-900">Delete <span className="sr-only">{item.caption || 'gallery image'}</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AdminDialog onClose={() => setIsModalOpen(false)} titleId="gallery-dialog-title" className="max-w-lg">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 id="gallery-dialog-title" className="text-xl font-bold text-gray-900">{editingId ? 'Edit Image' : 'Add Image'}</h2>
              <button data-dialog-initial-focus type="button" aria-label="Close image editor" onClick={() => setIsModalOpen(false)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="gallery-image-url" className={labelCls}>Image URL *</label>
                <input id="gallery-image-url" required type="url" value={formData.imageUrl} onChange={e => set({ imageUrl: e.target.value })} className={inputCls} placeholder="https://…" />
                {formData.imageUrl && (
                  <div className="mt-3"><GalleryPreview key={formData.imageUrl} src={formData.imageUrl} alt="New gallery image preview" large /></div>
                )}
              </div>
              <div>
                <label htmlFor="gallery-caption" className={labelCls}>Caption</label>
                <input id="gallery-caption" type="text" value={formData.caption} onChange={e => set({ caption: e.target.value })} className={inputCls} />
              </div>
              <div><label htmlFor="gallery-caption-ar" className={labelCls}>Caption (Arabic)</label><input id="gallery-caption-ar" dir="rtl" lang="ar" type="text" value={formData.captionAr} onChange={e => set({ captionAr: e.target.value })} className={inputCls} /></div>
              <div>
                <label htmlFor="gallery-category" className={labelCls}>Category</label>
                <input id="gallery-category" type="text" value={formData.category} onChange={e => set({ category: e.target.value })} className={inputCls} placeholder="e.g. Conference, Training, Outreach" />
              </div>
              <div><label htmlFor="gallery-category-ar" className={labelCls}>Category (Arabic)</label><input id="gallery-category-ar" dir="rtl" lang="ar" type="text" value={formData.categoryAr} onChange={e => set({ categoryAr: e.target.value })} className={inputCls} /></div>
              <ArabicContentWarning missingFields={getMissingArabicFields(formData)} />
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="min-h-11 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" disabled={isSaving} aria-busy={isSaving} className="min-h-11 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 text-sm disabled:cursor-wait disabled:opacity-50">
                  {isSaving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
        </AdminDialog>
      )}
    </div>
  );
}
