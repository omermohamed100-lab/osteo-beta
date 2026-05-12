'use client';

import { useState, useEffect } from 'react';

type Osteopath = {
  id: string;
  name: string;
  specialty: string;
  city: string;
  country: string;
  location: string;
  phone: string;
  email: string;
  bio: string;
  profileImage: string | null;
  isActive: boolean;
};

const EMPTY_FORM = {
  name: '', specialty: '', city: '', country: 'Egypt',
  location: '', phone: '', email: '', bio: '',
  profileImage: '', isActive: true,
};

const inputCls = 'w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-brand-500 focus:border-brand-500';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export default function AdminOsteopathsPage() {
  const [items, setItems]           = useState<Osteopath[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [isSaving, setIsSaving]     = useState(false);

  const set = (patch: Partial<typeof EMPTY_FORM>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/osteopaths');
      if (res.ok) setItems(await res.json());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => { setFormData(EMPTY_FORM); setEditingId(null); setIsModalOpen(true); };
  const openEdit   = (o: Osteopath) => {
    setFormData({
      name: o.name, specialty: o.specialty, city: o.city, country: o.country,
      location: o.location, phone: o.phone, email: o.email, bio: o.bio,
      profileImage: o.profileImage ?? '', isActive: o.isActive,
    });
    setEditingId(o.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const url    = editingId ? `/api/osteopaths/${editingId}` : '/api/osteopaths';
    const method = editingId ? 'PUT' : 'POST';
    const payload = { ...formData, profileImage: formData.profileImage || undefined };
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { setIsModalOpen(false); fetchItems(); }
      else alert('Failed to save');
    } catch { alert('Error saving'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this osteopath?')) return;
    try {
      const res = await fetch(`/api/osteopaths/${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch { alert('Error deleting'); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Osteopaths</h1>
        <button onClick={openCreate} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base">
          Add Osteopath
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No osteopaths yet. Add one!</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Specialty', 'City', 'Country', 'Status', 'Actions'].map((h) => (
                  <th key={h} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider${h === 'Actions' ? ' text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((o) => (
                <tr key={o.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {o.profileImage ? (
                        <img src={o.profileImage} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">
                          {o.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-gray-900 text-sm">{o.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.specialty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${o.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {o.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEdit(o)} className="text-brand-600 hover:text-brand-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(o.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Osteopath' : 'Add Osteopath'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input required type="text" value={formData.name} onChange={e => set({ name: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Specialty *</label>
                  <input required type="text" value={formData.specialty} onChange={e => set({ specialty: e.target.value })} className={inputCls} placeholder="e.g. Structural Osteopathy" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>City *</label>
                  <input required type="text" value={formData.city} onChange={e => set({ city: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Country *</label>
                  <input required type="text" value={formData.country} onChange={e => set({ country: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Location / Address</label>
                <input type="text" value={formData.location} onChange={e => set({ location: e.target.value })} className={inputCls} placeholder="e.g. Maadi, Cairo" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Phone</label>
                  <input type="text" value={formData.phone} onChange={e => set({ phone: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={formData.email} onChange={e => set({ email: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Bio</label>
                <textarea rows={3} value={formData.bio} onChange={e => set({ bio: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Profile Image URL</label>
                <input type="url" value={formData.profileImage} onChange={e => set({ profileImage: e.target.value })} className={inputCls} placeholder="https://…" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => set({ isActive: e.target.checked })} className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
                <label htmlFor="isActive" className="text-sm text-gray-900">Active (visible to public)</label>
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
