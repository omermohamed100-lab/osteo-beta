'use client';

import { useState, useEffect } from 'react';

type Activity = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string | null;
  isActive: boolean;
};

const EMPTY_FORM = {
  title: '', description: '', date: new Date().toISOString().split('T')[0],
  location: '', imageUrl: '', isActive: true,
};
const inputCls = 'w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-brand-500 focus:border-brand-500';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

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
      const res = await fetch('/api/activities');
      if (res.ok) setItems(await res.json());
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => { setFormData(EMPTY_FORM); setEditingId(null); setIsModalOpen(true); };
  const openEdit   = (a: Activity) => {
    setFormData({
      title: a.title, description: a.description,
      date: new Date(a.date).toISOString().split('T')[0],
      location: a.location, imageUrl: a.imageUrl ?? '', isActive: a.isActive,
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
        <button onClick={openCreate} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base">
          Add Activity
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading…</div>
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
                    <button onClick={() => openEdit(a)} className="text-brand-600 hover:text-brand-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Activity' : 'Add Activity'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input required type="text" value={formData.title} onChange={e => set({ title: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Description *</label>
                <textarea required rows={3} value={formData.description} onChange={e => set({ description: e.target.value })} className={inputCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Date *</label>
                  <input required type="date" value={formData.date} onChange={e => set({ date: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Location *</label>
                  <input required type="text" value={formData.location} onChange={e => set({ location: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Image URL</label>
                <input type="url" value={formData.imageUrl} onChange={e => set({ imageUrl: e.target.value })} className={inputCls} placeholder="https://…" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="actIsActive" checked={formData.isActive} onChange={e => set({ isActive: e.target.checked })} className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
                <label htmlFor="actIsActive" className="text-sm text-gray-900">Active (visible to public)</label>
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
