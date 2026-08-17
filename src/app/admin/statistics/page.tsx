'use client';

import { useEffect, useState } from 'react';

type Statistic = {
  id: string;
  value: string;
  label: string;
  labelAr: string;
  sourceLabel: string;
  sourceUrl: string | null;
  lastVerifiedAt: string;
  isPublished: boolean;
  sortOrder: number;
};

const today = new Date().toISOString().slice(0, 10);
const emptyForm = {
  value: '', label: '', labelAr: '', sourceLabel: '', sourceUrl: '',
  lastVerifiedAt: today, isPublished: false, sortOrder: 0,
};
const inputClass = 'w-full rounded-md border border-gray-300 p-2 text-sm focus:border-brand-500 focus:ring-brand-500';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

export default function AdminStatisticsPage() {
  const [items, setItems] = useState<Statistic[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/statistics?admin=1');
      if (response.ok) setItems(await response.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/statistics?admin=1')
      .then((response) => response.ok ? response.json() : [])
      .then((data) => { if (!cancelled && Array.isArray(data)) setItems(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const edit = (item: Statistic) => {
    setEditingId(item.id);
    setForm({
      value: item.value,
      label: item.label,
      labelAr: item.labelAr,
      sourceLabel: item.sourceLabel,
      sourceUrl: item.sourceUrl ?? '',
      lastVerifiedAt: new Date(item.lastVerifiedAt).toISOString().slice(0, 10),
      isPublished: item.isPublished,
      sortOrder: item.sortOrder,
    });
  };

  const reset = () => { setEditingId(null); setForm(emptyForm); };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(editingId ? `/api/statistics/${editingId}` : '/api/statistics', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) { reset(); await load(); }
      else alert('Statistic could not be saved. Check the source and verification fields.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this statistic?')) return;
    const response = await fetch(`/api/statistics/${id}`, { method: 'DELETE' });
    if (response.ok) await load();
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Public Statistics</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">Statistics appear publicly only when published. Every entry requires bilingual labels, an identified source, and a verification date.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {loading ? <p className="p-8 text-gray-500">Loading…</p> : items.length === 0 ? <p className="p-8 text-gray-500">No sourced statistics have been added.</p> : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-xl font-bold text-brand-800">{item.value} <span className="text-sm font-medium text-gray-800">{item.label}</span></p>
                    <p dir="rtl" className="mt-1 text-sm text-gray-600">{item.labelAr}</p>
                    <p className="mt-2 text-xs text-gray-500">Source: {item.sourceLabel} · Verified {new Date(item.lastVerifiedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`self-start rounded-full px-2 py-1 text-xs font-semibold ${item.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{item.isPublished ? 'Published' : 'Draft'}</span>
                  <div className="flex gap-3 text-sm font-medium"><button onClick={() => edit(item)} className="text-brand-700 hover:text-brand-950">Edit</button><button onClick={() => remove(item.id)} className="text-red-600 hover:text-red-800">Delete</button></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={submit} className="h-fit space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit statistic' : 'Add sourced statistic'}</h2>
          <div><label className={labelClass}>Displayed value *</label><input required maxLength={32} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={inputClass} placeholder="e.g. 24" /></div>
          <div><label className={labelClass}>English label *</label><input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Arabic label *</label><input required dir="rtl" lang="ar" value={form.labelAr} onChange={(e) => setForm({ ...form, labelAr: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Source name *</label><input required value={form.sourceLabel} onChange={(e) => setForm({ ...form, sourceLabel: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Public source URL (optional)</label><input type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} className={inputClass} placeholder="https://…" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className={labelClass}>Verified date *</label><input required type="date" value={form.lastVerifiedAt} onChange={(e) => setForm({ ...form, lastVerifiedAt: e.target.value })} className={inputClass} /></div><div><label className={labelClass}>Sort order</label><input type="number" min={0} max={1000} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className={inputClass} /></div></div>
          <label className="flex items-start gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600" /><span>Publish on About page. Confirm the number and source are owner-approved before enabling.</span></label>
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">{editingId && <button type="button" onClick={reset} className="rounded-md border border-gray-300 px-4 py-2 text-sm">Cancel</button>}<button disabled={saving} className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save statistic'}</button></div>
        </form>
      </div>
    </div>
  );
}
