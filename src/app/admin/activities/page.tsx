'use client';

import { useState, useEffect } from 'react';
import ArabicContentWarning from '@/components/admin/ArabicContentWarning';
import AdminDialog from '@/components/admin/AdminDialog';

type Activity = {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  date: string;
  location: string;
  locationAr: string;
  imageUrl: string | null;
  isActive: boolean;
};

const EMPTY_FORM = {
  title: '', titleAr: '', description: '', descriptionAr: '', date: new Date().toISOString().split('T')[0],
  location: '', locationAr: '', imageUrl: '', isActive: true,
};
const inputCls = 'w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-brand-500 focus:border-brand-500';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

function getMissingArabicFields(activity: Pick<Activity, 'titleAr' | 'descriptionAr' | 'locationAr'>) {
  return [
    !activity.titleAr?.trim() && 'title',
    !activity.descriptionAr?.trim() && 'description',
    !activity.locationAr?.trim() && 'location',
  ].filter((field): field is string => Boolean(field));
}

export default function AdminActivitiesPage() {
  const [items, setItems]             = useState<Activity[]>([]);
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
      const res = await fetch('/api/activities?admin=1');
      if (res.ok) setItems(await res.json());
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
    let cancelled = false;

    fetch('/api/activities?admin=1')
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
  const openEdit   = (a: Activity) => {
    setFormData({
      title: a.title, titleAr: a.titleAr, description: a.description, descriptionAr: a.descriptionAr,
      date: new Date(a.date).toISOString().split('T')[0],
      location: a.location, locationAr: a.locationAr, imageUrl: a.imageUrl ?? '', isActive: a.isActive,
    });
    setEditingId(a.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const url    = editingId ? `/api/activities/${editingId}` : '/api/activities';
    const method = editingId ? 'PUT' : 'POST';
    const payload = { ...formData, imageUrl: formData.imageUrl || undefined };
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { setIsModalOpen(false); fetchItems(); }
      else alert('Failed to save');
    } catch { alert('Error saving'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    try {
      const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch { alert('Error deleting'); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Activities</h1>
        <button type="button" onClick={openCreate} className="min-h-11 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base">
          Add Activity
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div role="status" aria-live="polite" className="p-8 text-center text-gray-500">Loading activities…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No activities yet. Add one!</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Title', 'Date', 'Location', 'Status', 'Actions'].map((h) => (
                  <th key={h} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider${h === 'Actions' ? ' text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((a) => (
                <tr key={a.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-sm">{a.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{a.description}</div>
                    <ArabicContentWarning missingFields={getMissingArabicFields(a)} compact />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(a.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{a.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${a.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {a.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button type="button" onClick={() => openEdit(a)} className="min-h-11 px-2 text-brand-600 hover:text-brand-900">Edit <span className="sr-only">{a.title}</span></button>
                    <button type="button" onClick={() => handleDelete(a.id)} className="min-h-11 px-2 text-red-600 hover:text-red-900">Delete <span className="sr-only">{a.title}</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AdminDialog onClose={() => setIsModalOpen(false)} titleId="activity-dialog-title">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 id="activity-dialog-title" className="text-xl font-bold text-gray-900">{editingId ? 'Edit Activity' : 'Add Activity'}</h2>
              <button data-dialog-initial-focus type="button" aria-label="Close activity editor" onClick={() => setIsModalOpen(false)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="activity-title" className={labelCls}>Title *</label>
                <input id="activity-title" required type="text" value={formData.title} onChange={e => set({ title: e.target.value })} className={inputCls} />
              </div>
              <div><label htmlFor="activity-title-ar" className={labelCls}>Title (Arabic)</label><input id="activity-title-ar" dir="rtl" lang="ar" type="text" value={formData.titleAr} onChange={e => set({ titleAr: e.target.value })} className={inputCls} /></div>
              <div>
                <label htmlFor="activity-description" className={labelCls}>Description *</label>
                <textarea id="activity-description" required rows={3} value={formData.description} onChange={e => set({ description: e.target.value })} className={inputCls} />
              </div>
              <div><label htmlFor="activity-description-ar" className={labelCls}>Description (Arabic)</label><textarea id="activity-description-ar" dir="rtl" lang="ar" rows={3} value={formData.descriptionAr} onChange={e => set({ descriptionAr: e.target.value })} className={inputCls} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="activity-date" className={labelCls}>Date *</label>
                  <input id="activity-date" required type="date" value={formData.date} onChange={e => set({ date: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="activity-location" className={labelCls}>Location *</label>
                  <input id="activity-location" required type="text" value={formData.location} onChange={e => set({ location: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div><label htmlFor="activity-location-ar" className={labelCls}>Location (Arabic)</label><input id="activity-location-ar" dir="rtl" lang="ar" type="text" value={formData.locationAr} onChange={e => set({ locationAr: e.target.value })} className={inputCls} /></div>
              <div>
                <label htmlFor="activity-image-url" className={labelCls}>Image URL</label>
                <input id="activity-image-url" type="url" value={formData.imageUrl} onChange={e => set({ imageUrl: e.target.value })} className={inputCls} placeholder="https://…" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="actIsActive" checked={formData.isActive} onChange={e => set({ isActive: e.target.checked })} className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
                <label htmlFor="actIsActive" className="text-sm text-gray-900">Active (visible to public)</label>
              </div>
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
