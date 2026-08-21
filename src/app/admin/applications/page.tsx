'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  profileImage: string | null;
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
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'open' | 'all' | Status>('open');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [reviewStatus, setReviewStatus] = useState<Status>('pending');
  const [reviewNotes, setReviewNotes] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/practitioner-applications', { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load practitioner applications.');
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('The application response was invalid.');
      setApplications(data as Application[]);
      setSelectedId((current) => current ?? (data[0] as Application | undefined)?.id ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load applications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/practitioner-applications', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load practitioner applications.');
        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error('The application response was invalid.');
        if (cancelled) return;
        const items = data as Application[];
        setApplications(items);
        if (items[0]) {
          setSelectedId(items[0].id);
          setReviewStatus(items[0].status);
          setReviewNotes(items[0].reviewNotes);
        }
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Could not load applications.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => applications.filter((application) => {
    if (filter === 'all') return true;
    if (filter === 'open') return application.status === 'pending' || application.status === 'needs_information';
    return application.status === filter;
  }), [applications, filter]);
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
      const response = await fetch(`/api/practitioner-applications/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: reviewStatus, reviewNotes }),
      });
      if (!response.ok) throw new Error('The review could not be saved.');
      const updated = await response.json() as Application;
      setApplications((items) => items.map((item) => item.id === updated.id ? updated : item));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'The review could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const createDraft = async () => {
    if (!selected || selected.applicationType !== 'new_listing') return;
    setIsSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/practitioner-applications/${selected.id}/approve`, { method: 'POST' });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body.error === 'string' ? body.error : 'The draft could not be created.');
      await load();
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
        <button type="button" onClick={() => void load()} className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refresh</button>
      </div>

      {error && <div role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

      <div className="mb-5 flex flex-wrap gap-2" aria-label="Filter applications">
        {(['open', 'all', 'pending', 'needs_information', 'approved', 'rejected'] as const).map((option) => (
          <button key={option} type="button" onClick={() => setFilter(option)} className={`min-h-10 rounded-full border px-4 text-sm font-medium ${filter === option ? 'border-brand-700 bg-brand-700 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>
            {option === 'open' ? 'Open' : option === 'all' ? 'All' : STATUS_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <section aria-label="Application list" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? <p className="p-6 text-sm text-slate-500">Loading applications…</p> : filtered.length === 0 ? <p className="p-6 text-sm text-slate-500">No applications match this filter.</p> : (
            <ul className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto">
              {filtered.map((application) => (
                <li key={application.id}>
                  <button type="button" onClick={() => selectApplication(application)} className={`w-full px-4 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600 ${selectedId === application.id ? 'bg-brand-50' : 'bg-white'}`}>
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
                  {selected.profileImage && <a href={selected.profileImage} target="_blank" rel="noreferrer" className="font-semibold text-brand-700 underline underline-offset-4">Open submitted photo</a>}
                </div>

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
