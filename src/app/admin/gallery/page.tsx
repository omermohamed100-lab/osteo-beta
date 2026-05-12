'use client';

import { useState, useEffect } from 'react';

type GalleryItem = {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  createdAt: string;
};

const EMPTY_FORM = { imageUrl: '', caption: '', category: 'General' };
const inputCls   = 'w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-brand-500 focus:border-brand-500';
const labelCls   = 'block text-sm font-medium text-gray-700 mb-1';

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

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => { setFormData(EMPTY_FORM); setEditingId(null); setIsModalOpen(true); };
  const openEdit   = (item: GalleryItem) => {
    setFormData({ imageUrl: item.imageUrl, caption: item.caption, category: item.category });
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
        <button onClick={openCreate} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base">
          Add Image
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading…</div>
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
                    <img src={item.imageUrl} alt={item.caption} className="w-16 h-12 object-cover rounded-md bg-gray-100" />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{item.caption || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-brand-50 text-brand-700 font-medium">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEdit(item)} className="text-brand-600 hover:text-brand-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Image' : 'Add Image'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Image URL *</label>
                <input required type="url" value={formData.imageUrl} onChange={e => set({ imageUrl: e.target.value })} className={inputCls} placeholder="https://…" />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="preview" className="mt-2 w-full h-32 object-cover rounded-md bg-gray-100" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
              </div>
              <div>
                <label className={labelCls}>Caption</label>
                <input type="text" value={formData.caption} onChange={e => set({ caption: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <input type="text" value={formData.category} onChange={e => set({ category: e.target.value })} className={inputCls} placeholder="e.g. Conference, Training, Outreach" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 text-sm disabled:opacity-50">
                  {isSaving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
