'use client';

import { useState, useEffect } from 'react';
import ArabicContentWarning from '@/components/admin/ArabicContentWarning';

type Osteopath = {
  id: string;
  name: string;
  nameAr: string;
  specialty: string;
  specialtyAr: string;
  city: string;
  cityAr: string;
  country: string;
  countryAr: string;
  location: string;
  locationAr: string;
  phone: string;
  email: string;
  bio: string;
  bioAr: string;
  profileImage: string | null;
  credentialType: string;
  credentialTypeAr: string;
  credentialNumber: string;
  credentialIssuer: string;
  credentialIssuerAr: string;
  credentialStatus: 'unverified' | 'verified' | 'expired';
  credentialVerifiedAt: string | null;
  credentialExpiresAt: string | null;
  profileReviewedAt: string | null;
  isActive: boolean;
};

const EMPTY_FORM = {
  name: '', nameAr: '', specialty: '', specialtyAr: '', city: '', cityAr: '', country: 'Egypt', countryAr: 'مصر',
  location: '', locationAr: '', phone: '', email: '', bio: '', bioAr: '',
  credentialType: '', credentialTypeAr: '', credentialNumber: '', credentialIssuer: '', credentialIssuerAr: '', credentialStatus: 'unverified' as Osteopath['credentialStatus'],
  credentialVerifiedAt: '', credentialExpiresAt: '', profileReviewedAt: '',
  profileImage: '', isActive: true,
};

const inputCls = 'w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-brand-500 focus:border-brand-500';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

function getMissingArabicFields(record: typeof EMPTY_FORM | Osteopath) {
  const missing = [
    !record.nameAr?.trim() && 'name',
    !record.specialtyAr?.trim() && 'specialty',
    !record.cityAr?.trim() && 'city',
    !record.countryAr?.trim() && 'country',
    record.location?.trim() && !record.locationAr?.trim() && 'location/address',
    record.bio?.trim() && !record.bioAr?.trim() && 'biography',
    record.credentialType?.trim() && !record.credentialTypeAr?.trim() && 'credential type',
    record.credentialIssuer?.trim() && !record.credentialIssuerAr?.trim() && 'credential issuer',
  ];
  return missing.filter((field): field is string => Boolean(field));
}

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
      const res = await fetch('/api/osteopaths?admin=1');
      if (res.ok) setItems(await res.json());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    fetch('/api/osteopaths?admin=1')
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
  const openEdit   = (o: Osteopath) => {
    setFormData({
      name: o.name, nameAr: o.nameAr || '', specialty: o.specialty, specialtyAr: o.specialtyAr, city: o.city, cityAr: o.cityAr || '', country: o.country, countryAr: o.countryAr || '',
      location: o.location, locationAr: o.locationAr, phone: o.phone, email: o.email, bio: o.bio, bioAr: o.bioAr,
      credentialType: o.credentialType, credentialTypeAr: o.credentialTypeAr || '', credentialNumber: o.credentialNumber, credentialIssuer: o.credentialIssuer, credentialIssuerAr: o.credentialIssuerAr || '',
      credentialStatus: o.credentialStatus,
      credentialVerifiedAt: o.credentialVerifiedAt ? new Date(o.credentialVerifiedAt).toISOString().split('T')[0] : '',
      credentialExpiresAt: o.credentialExpiresAt ? new Date(o.credentialExpiresAt).toISOString().split('T')[0] : '',
      profileReviewedAt: o.profileReviewedAt ? new Date(o.profileReviewedAt).toISOString().split('T')[0] : '',
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
                        // Admin-entered profile URLs may use arbitrary hosts.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={o.profileImage} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">
                          {o.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-900 text-sm">{o.name}</span>
                        <ArabicContentWarning missingFields={getMissingArabicFields(o)} compact />
                      </div>
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
              <div><label className={labelCls}>Full Name (Arabic)</label><input dir="rtl" lang="ar" type="text" value={formData.nameAr} onChange={e => set({ nameAr: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Specialty (Arabic)</label><input dir="rtl" lang="ar" type="text" value={formData.specialtyAr} onChange={e => set({ specialtyAr: e.target.value })} className={inputCls} /></div>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>City (Arabic)</label><input dir="rtl" lang="ar" type="text" value={formData.cityAr} onChange={e => set({ cityAr: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Country (Arabic)</label><input dir="rtl" lang="ar" type="text" value={formData.countryAr} onChange={e => set({ countryAr: e.target.value })} className={inputCls} /></div>
              </div>
              <div>
                <label className={labelCls}>Location / Address</label>
                <input type="text" value={formData.location} onChange={e => set({ location: e.target.value })} className={inputCls} placeholder="e.g. Maadi, Cairo" />
              </div>
              <div><label className={labelCls}>Location / Address (Arabic)</label><input dir="rtl" lang="ar" type="text" value={formData.locationAr} onChange={e => set({ locationAr: e.target.value })} className={inputCls} /></div>
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
              <div><label className={labelCls}>Bio (Arabic)</label><textarea dir="rtl" lang="ar" rows={3} value={formData.bioAr} onChange={e => set({ bioAr: e.target.value })} className={inputCls} /></div>
              <div>
                <label className={labelCls}>Profile Image URL</label>
                <input type="url" value={formData.profileImage} onChange={e => set({ profileImage: e.target.value })} className={inputCls} placeholder="https://…" />
              </div>
              <fieldset className="space-y-4 border-t border-gray-200 pt-5">
                <legend className="text-base font-semibold text-gray-900">Credential evidence</legend>
                <p className="text-xs leading-5 text-gray-500">Keep the status unverified until the credential number, issuer, and verification date have been checked against supporting evidence.</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div><label className={labelCls}>Credential type</label><input required={formData.credentialStatus === 'verified'} value={formData.credentialType} onChange={e => set({ credentialType: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Credential type (Arabic)</label><input dir="rtl" lang="ar" value={formData.credentialTypeAr} onChange={e => set({ credentialTypeAr: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Credential number</label><input required={formData.credentialStatus === 'verified'} value={formData.credentialNumber} onChange={e => set({ credentialNumber: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Issuing organization</label><input required={formData.credentialStatus === 'verified'} value={formData.credentialIssuer} onChange={e => set({ credentialIssuer: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Issuing organization (Arabic)</label><input dir="rtl" lang="ar" value={formData.credentialIssuerAr} onChange={e => set({ credentialIssuerAr: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Verification status</label><select value={formData.credentialStatus} onChange={e => set({ credentialStatus: e.target.value as typeof formData.credentialStatus })} className={inputCls}><option value="unverified">Unverified</option><option value="verified">Verified</option><option value="expired">Expired</option></select></div>
                  <div><label className={labelCls}>Verification date</label><input required={formData.credentialStatus === 'verified'} type="date" value={formData.credentialVerifiedAt} onChange={e => set({ credentialVerifiedAt: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Expiry date</label><input type="date" value={formData.credentialExpiresAt} onChange={e => set({ credentialExpiresAt: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Profile review date</label><input type="date" value={formData.profileReviewedAt} onChange={e => set({ profileReviewedAt: e.target.value })} className={inputCls} /></div>
                </div>
              </fieldset>
              <ArabicContentWarning missingFields={getMissingArabicFields(formData)} />
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
