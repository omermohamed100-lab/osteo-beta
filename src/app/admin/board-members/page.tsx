'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminDialog from '@/components/admin/AdminDialog';

type BoardMember = { id: string; name: string; nameAr: string; position: string; positionAr: string; biography: string; biographyAr: string; email: string; linkedin: string; sortOrder: number; isPublished: boolean; photoUrl: string | null };
type Form = Omit<BoardMember, 'id' | 'photoUrl'>;
const emptyForm: Form = { name: '', nameAr: '', position: '', positionAr: '', biography: '', biographyAr: '', email: '', linkedin: '', sortOrder: 0, isPublished: false };

export default function BoardMembersPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [form, setForm] = useState<Form>(emptyForm);
  const [editing, setEditing] = useState<BoardMember | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    const response = await fetch('/api/board-members?admin=1');
    if (response.ok) setMembers(await response.json());
    else setMessage('Unable to load board members.');
    setLoading(false);
  };
  useEffect(() => {
    fetch('/api/board-members?admin=1')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setMembers(data))
      .catch(() => setMessage('Unable to load board members.'))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setEditing(null); setPhoto(null); setForm({ ...emptyForm, sortOrder: members.length }); setEditorOpen(true); };
  const openEdit = (member: BoardMember) => { setEditing(member); setPhoto(null); setForm({ name: member.name, nameAr: member.nameAr, position: member.position, positionAr: member.positionAr, biography: member.biography, biographyAr: member.biographyAr, email: member.email, linkedin: member.linkedin, sortOrder: member.sortOrder, isPublished: member.isPublished }); setEditorOpen(true); };
  const close = () => { setEditing(null); setPhoto(null); setEditorOpen(false); };
  const update = <K extends keyof Form>(key: K, value: Form[K]) => setForm((current) => ({ ...current, [key]: value }));

  const upload = async (id: string) => {
    if (!photo) return true;
    const body = new FormData(); body.set('photo', photo);
    const response = await fetch(`/api/board-members/${id}/photo`, { method: 'POST', body });
    return response.ok;
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setMessage('');
    try {
      const response = await fetch(editing ? `/api/board-members/${editing.id}` : '/api/board-members', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save board member.');
      if (!(await upload(data.id))) throw new Error('Profile saved, but the photo could not be uploaded.');
      close(); await load(); setMessage('Board member saved successfully.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save board member.'); }
    finally { setSaving(false); }
  };

  const remove = async (member: BoardMember) => {
    if (!confirm(`Delete ${member.name}? This cannot be undone.`)) return;
    const response = await fetch(`/api/board-members/${member.id}`, { method: 'DELETE' });
    if (response.ok) { await load(); setMessage('Board member deleted.'); } else setMessage('Unable to delete board member.');
  };
  const removePhoto = async () => {
    if (!editing || !confirm('Remove this profile photo?')) return;
    const response = await fetch(`/api/board-members/${editing.id}/photo`, { method: 'DELETE' });
    if (response.ok) { await load(); setEditing({ ...editing, photoUrl: null }); setMessage('Photo removed.'); } else setMessage('Unable to remove photo.');
  };

  return <div className="mx-auto max-w-6xl">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8"><div><h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Board Members Management</h1><p dir="rtl" lang="ar" className="mt-1 text-sm text-gray-500">إدارة أعضاء مجلس الإدارة</p></div><button onClick={openCreate} type="button" className="min-h-11 rounded-lg bg-brand-600 px-4 py-2 font-medium text-white transition-colors hover:bg-brand-700">Add board member</button></div>
    {message && <p role={message.includes('success') || message.includes('deleted') || message.includes('removed') ? 'status' : 'alert'} className={`mb-4 rounded-md p-3 text-sm ${message.includes('Unable') || message.includes('could not') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message}</p>}
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {loading ? <p role="status" className="p-8 text-center text-gray-500">Loading board members…</p> : members.length === 0 ? <p className="p-8 text-center text-gray-500">No board members yet. Add the first profile when details are ready.</p> : <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Member</th><th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Position</th><th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status / order</th><th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th></tr></thead><tbody className="divide-y divide-gray-200">{members.map((member) => <tr key={member.id}><td className="px-4 py-3"><div className="flex items-center gap-3">{member.photoUrl ? <Image src={member.photoUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" /> : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">{member.name.slice(0, 1)}</span>}<div><p className="font-medium text-gray-900">{member.name}</p><p dir="rtl" className="text-xs text-gray-500">{member.nameAr}</p></div></div></td><td className="px-4 py-3 text-sm text-gray-600">{member.position}<br /><span dir="rtl" className="text-xs">{member.positionAr}</span></td><td className="px-4 py-3 text-sm"><span className={member.isPublished ? 'text-green-700' : 'text-amber-700'}>{member.isPublished ? 'Published' : 'Draft'}</span><span className="ml-2 text-gray-500">#{member.sortOrder}</span></td><td className="px-4 py-3 text-right text-sm"><button type="button" onClick={() => openEdit(member)} className="min-h-11 px-2 text-brand-700 hover:text-brand-950">Edit</button><button type="button" onClick={() => remove(member)} className="min-h-11 px-2 text-red-600 hover:text-red-900">Delete</button></td></tr>)}</tbody></table></div>}
    </div>
    {editorOpen && <AdminDialog onClose={close} titleId="board-member-dialog-title"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-5"><h2 id="board-member-dialog-title" className="text-xl font-bold text-gray-900">{editing ? 'Edit board member' : 'Add board member'}</h2><button data-dialog-initial-focus type="button" onClick={close} aria-label="Close board member editor" className="min-h-11 min-w-11 rounded-md text-gray-500 hover:bg-gray-100">×</button></div><form onSubmit={save} className="space-y-5 p-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name (English)" value={form.name} onChange={(value) => update('name', value)} required /><Field label="الاسم الكامل (العربية)" value={form.nameAr} onChange={(value) => update('nameAr', value)} dir="rtl" required /><Field label="Position (English)" value={form.position} onChange={(value) => update('position', value)} required /><Field label="المنصب (العربية)" value={form.positionAr} onChange={(value) => update('positionAr', value)} dir="rtl" required /></div><div className="grid gap-4 sm:grid-cols-2"><TextArea label="Biography (English)" value={form.biography} onChange={(value) => update('biography', value)} /><TextArea label="السيرة الذاتية (العربية)" value={form.biographyAr} onChange={(value) => update('biographyAr', value)} dir="rtl" /></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Email (optional)" type="email" value={form.email} onChange={(value) => update('email', value)} /><Field label="LinkedIn URL (optional)" type="url" value={form.linkedin} onChange={(value) => update('linkedin', value)} /></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Display order" type="number" value={String(form.sortOrder)} onChange={(value) => update('sortOrder', Number(value))} /><label className="flex min-h-11 items-center gap-2 pt-6 text-sm font-medium text-gray-700"><input type="checkbox" checked={form.isPublished} onChange={(event) => update('isPublished', event.target.checked)} className="h-4 w-4" /> Published on the public site</label></div><div><label className="block text-sm font-medium text-gray-700">Profile photograph</label>{editing?.photoUrl && <Image src={editing.photoUrl} alt="Current profile" width={96} height={96} className="mt-2 h-24 w-24 rounded-lg object-cover" />}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm" /><p className="mt-1 text-xs text-gray-500">JPEG, PNG, or WebP up to 5 MB. {photo?.name}</p>{editing?.photoUrl && <button type="button" onClick={removePhoto} className="mt-2 min-h-11 text-sm text-red-600 hover:text-red-900">Remove current photo</button>}</div><div className="flex justify-end gap-3 border-t border-gray-100 pt-4"><button type="button" onClick={close} className="min-h-11 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Cancel</button><button disabled={saving} aria-busy={saving} className="min-h-11 rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 disabled:opacity-60">{saving ? 'Saving…' : 'Save board member'}</button></div></form></AdminDialog>}
  </div>;
}

function Field({ label, value, onChange, type = 'text', dir, required }: { label: string; value: string; onChange: (value: string) => void; type?: string; dir?: 'rtl'; required?: boolean }) { return <label className="block text-sm font-medium text-gray-700">{label}<input required={required} dir={dir} lang={dir ? 'ar' : undefined} type={type} min={type === 'number' ? 0 : undefined} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-brand-500 focus:ring-brand-500" /></label>; }
function TextArea({ label, value, onChange, dir }: { label: string; value: string; onChange: (value: string) => void; dir?: 'rtl' }) { return <label className="block text-sm font-medium text-gray-700">{label}<textarea dir={dir} lang={dir ? 'ar' : undefined} rows={5} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-brand-500 focus:ring-brand-500" /></label>; }
