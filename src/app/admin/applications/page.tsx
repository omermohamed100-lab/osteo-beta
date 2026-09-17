'use client';

import Link from 'next/link';
import { useState } from 'react';
import AdminPagination from '@/components/admin/AdminPagination';
import { useAdminPage } from '@/components/admin/useAdminPage';
import { fetchJsonWithTimeout } from '@/lib/fetch-with-timeout';

type Status = 'pending' | 'needs_information' | 'approved' | 'rejected';
type Application = {
  id: string;
  applicationType: 'new_listing' | 'profile_update';
  status: Status;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  specialty: string;
  specialtyAr: string;
  city: string;
  cityAr: string;
  country: string;
  countryAr: string;
  location: string;
  locationAr: string;
  bio: string;
  bioAr: string;
  credentialType: string;
  credentialTypeAr: string;
  credentialNumber: string;
  credentialIssuer: string;
  credentialIssuerAr: string;
  credentialIssuedAt: string | null;
  credentialExpiresAt: string | null;
  existingProfileUrl: string;
  applicantNotes: string;
  reviewNotes: string;
  createdAt: string;
  reviewedAt: string | null;
  draftOsteopath: { id: string; name: string; isActive: boolean } | null;
};

const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pending',
  needs_information: 'Needs information',
  approved: 'Approved',
  rejected: 'Rejected',
};

const STATUS_STYLES: Record<Status, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-800',
  needs_information: 'border-blue-200 bg-blue-50 text-blue-800',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  rejected: 'border-rose-200 bg-rose-50 text-rose-800',
};

function Detail({ label, value, dir }: { label: string; value?: string | null; dir?: 'rtl' | 'ltr' }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd dir={dir ?? 'auto'} className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-800">{value || '—'}</dd>
    </div>
  );
}

export default function AdminApplicationsPage() {

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'open' | 'all' | Status>('open');
  const page = useAdminPage<Application>(`/api/practitioner-applications?status=${filter}`);
  const { items: applications, setItems: setApplications, isLoading } = page;
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [reviewStatus, setReviewStatus] = useState<Status>('pending');
  const [reviewNotes, setReviewNotes] = useState('');

  const selected = applications.find((application) => application.id === selectedId) ?? null;

  const selectApplication = (application: Application) => {
    setSelectedId(application.id);
    setReviewStatus(application.status);
    setReviewNotes(application.reviewNotes);
  };

  const saveReview = async () => {
    if (!selected) return;
    setIsSaving(true);
    setError('');
    try {
      const { response, data: updated } = await fetchJsonWithTimeout<Application>(`/api/practitioner-applications/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: reviewStatus, reviewNotes, name: selected.name, nameAr: selected.nameAr, specialty: selected.specialty, specialtyAr: selected.specialtyAr, city: selected.city, cityAr: selected.cityAr, country: selected.country, countryAr: selected.countryAr, location: selected.location, locationAr: selected.locationAr, bio: selected.bio, bioAr: selected.bioAr, credentialType: selected.credentialType, credentialTypeAr: selected.credentialTypeAr, credentialIssuer: selected.credentialIssuer, credentialIssuerAr: selected.credentialIssuerAr }),
      });
      if (!response.ok) throw new Error('The review could not be saved.');

      setApplications((items) => items.map((item) => item.id === updated.id ? updated : item));
      if (filter !== 'all' && (filter === 'open'
        ? !['pending', 'needs_information'].includes(updated.status)
        : updated.status !== filter)) {
        setSelectedId(null);
        page.refresh();
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'The review could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const editTranslation = (field: keyof Application, value: string) => setApplications((items) => items.map((item) => item.id === selectedId ? { ...item, [field]: value } : item));

  const createDraft = async () => {
    if (!selected || selected.applicationType !== 'new_listing') return;
    setIsSaving(true);
    setError('');
    try {
      const { response, data: body } = await fetchJsonWithTimeout<{ error?: string }>(`/api/practitioner-applications/${selected.id}/approve`, { method: 'POST' });
      if (!response.ok) throw new Error(typeof body.error === 'string' ? body.error : 'The draft could not be created.');
      page.refresh();
      setSelectedId(selected.id);
    } catch (draftError) {
      setError(draftError instanceof Error ? draftError.message : 'The draft could not be created.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Practitioner Applications</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Review new directory requests and profile updates. Creating a draft never publishes it.</p>
        </div>
      </div>

      <AdminPagination {...page} isLoading={isLoading || isSaving}
        next={() => { setSelectedId(null); setError(''); page.next(); }}
        previous={() => { setSelectedId(null); setError(''); page.previous(); }}
        refresh={() => { setSelectedId(null); setError(''); page.refresh(); }} />
      {page.error && <div role="alert" className="mb-5 text-sm text-rose-800">{page.error} <button onClick={page.refresh} className="min-h-11 px-2 font-semibold underline">Try again</button></div>}
      {error && <div role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

      <div className="mb-5 flex flex-wrap gap-2" aria-label="Filter applications">
        {(['open', 'all', 'pending', 'needs_information', 'approved', 'rejected'] as const).map((option) => (
          <button key={option} type="button" disabled={isSaving} aria-pressed={filter === option} onClick={() => { page.reset(); setFilter(option); setSelectedId(null); setError(''); }} className={`min-h-11 rounded-full border px-4 text-sm font-medium ${filter === option ? 'border-brand-700 bg-brand-700 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>
            {option === 'open' ? 'Open' : option === 'all' ? 'All' : STATUS_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <section aria-label="Application list" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? <p className="p-6 text-sm text-slate-500">Loading applications…</p> : page.error ? null : applications.length === 0 ? <p className="p-6 text-sm text-slate-500">No applications match this filter.</p> : (
            <ul className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto">
              {applications.map((application) => (
                <li key={application.id}>
                  <button type="button" disabled={isSaving} onClick={() => selectApplication(application)} className={`w-full px-4 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600 ${selectedId === application.id ? 'bg-brand-50' : 'bg-white'}`}>
                    <span className="flex items-start justify-between gap-3"><span className="font-semibold text-slate-900">{application.name}</span><span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[application.status]}`}>{STATUS_LABELS[application.status]}</span></span>
                    <span className="mt-1 block text-sm text-slate-600">{application.applicationType === 'new_listing' ? 'New listing' : 'Profile update'} · {application.specialty}</span>
                    <span className="mt-2 block text-xs text-slate-500">{new Date(application.createdAt).toLocaleString()}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Selected application" className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
          {!selected ? <p className="p-8 text-sm text-slate-500">Select an application to review it.</p> : (
            <div>
              <div className="border-b border-slate-100 p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wider text-brand-600">{selected.applicationType === 'new_listing' ? 'New listing' : 'Profile update'}</p><h2 className="mt-1 text-2xl font-bold text-slate-900">{selected.name}</h2>{selected.nameAr && <p dir="rtl" className="mt-1 text-lg text-slate-600">{selected.nameAr}</p>}</div><span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[selected.status]}`}>{STATUS_LABELS[selected.status]}</span></div>
              </div>

              <div className="space-y-8 p-5 sm:p-7">
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  <Detail label="Email" value={selected.email} dir="ltr" /><Detail label="Phone" value={selected.phone} dir="ltr" />
                  <Detail label="Specialty" value={selected.specialty} /><Detail label="Specialty (Arabic)" value={selected.specialtyAr} dir="rtl" />
                  <Detail label="City / country" value={`${selected.city}, ${selected.country}`} /><Detail label="City / country (Arabic)" value={[selected.cityAr, selected.countryAr].filter(Boolean).join('، ')} dir="rtl" />
                  <Detail label="Practice location" value={selected.location} /><Detail label="Practice location (Arabic)" value={selected.locationAr} dir="rtl" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2"><Detail label="Professional biography" value={selected.bio} /><Detail label="Biography (Arabic)" value={selected.bioAr} dir="rtl" /></div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  <Detail label="Credential type" value={selected.credentialType} /><Detail label="Credential number" value={selected.credentialNumber} /><Detail label="Issuer" value={selected.credentialIssuer} />
                  <Detail label="Issue date" value={selected.credentialIssuedAt ? new Date(selected.credentialIssuedAt).toLocaleDateString() : null} /><Detail label="Expiry date" value={selected.credentialExpiresAt ? new Date(selected.credentialExpiresAt).toLocaleDateString() : null} />
                </div>
                <Detail label="Applicant notes" value={selected.applicantNotes} />
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href={`mailto:${selected.email}`} className="font-semibold text-brand-700 underline underline-offset-4">Email applicant</a>
                  {selected.existingProfileUrl && <a href={selected.existingProfileUrl} target="_blank" rel="noreferrer" className="font-semibold text-brand-700 underline underline-offset-4">Open current profile</a>}
                  <a href={`/api/practitioner-applications/${selected.id}/photo`} target="_blank" rel="noreferrer" className="font-semibold text-brand-700 underline underline-offset-4">Preview private submitted photo</a>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5"><h3 className="font-semibold text-slate-900">Complete bilingual profile copy</h3><p className="mt-1 text-xs text-slate-600">Both versions must be completed and reviewed before a draft can be created.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{([['name','Name (English)'],['nameAr','Name (Arabic)'],['specialty','Specialty (English)'],['specialtyAr','Specialty (Arabic)'],['city','City (English)'],['cityAr','City (Arabic)'],['country','Country (English)'],['countryAr','Country (Arabic)'],['location','Location (English)'],['locationAr','Location (Arabic)'],['credentialType','Credential type (English)'],['credentialTypeAr','Credential type (Arabic)'],['credentialIssuer','Issuer (English)'],['credentialIssuerAr','Issuer (Arabic)']] as [keyof Application,string][]).map(([key,label]) => <label key={key} className="text-xs font-semibold text-slate-700">{label}<input value={String(selected[key] ?? '')} onChange={(event) => editTranslation(key,event.target.value)} dir={key.endsWith('Ar') ? 'rtl' : 'auto'} className="mt-1 min-h-10 w-full border border-slate-300 bg-white px-3 text-sm" /></label>)}</div><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold">Biography (English)<textarea value={selected.bio} onChange={(e) => editTranslation('bio',e.target.value)} rows={4} className="mt-1 w-full border bg-white p-2 text-sm" /></label><label className="text-xs font-semibold">Biography (Arabic)<textarea dir="rtl" value={selected.bioAr} onChange={(e) => editTranslation('bioAr',e.target.value)} rows={4} className="mt-1 w-full border bg-white p-2 text-sm" /></label></div></div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-semibold text-slate-900">Review decision</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-[13rem_1fr]">
                    <label className="text-sm font-medium text-slate-700">Status<select value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value as Status)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3"><option value="pending">Pending</option><option value="needs_information">Needs information</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label>
                    <label className="text-sm font-medium text-slate-700">Private review notes<textarea rows={4} maxLength={3000} value={reviewNotes} onChange={(event) => setReviewNotes(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2" /></label>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" onClick={() => void saveReview()} disabled={isSaving} className="min-h-11 rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50">{isSaving ? 'Saving…' : 'Save review'}</button>
                    {selected.applicationType === 'new_listing' && !selected.draftOsteopath && <button type="button" onClick={() => void createDraft()} disabled={isSaving} className="min-h-11 rounded-lg border border-emerald-700 bg-white px-4 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50">Create inactive draft</button>}
                    {selected.draftOsteopath && <Link href="/admin/osteopaths" className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Review directory draft</Link>}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-600">A new-listing draft is always inactive and unverified. Profile-update requests must be compared manually and never overwrite a live profile automatically.</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
