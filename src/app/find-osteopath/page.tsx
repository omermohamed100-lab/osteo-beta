'use client';

import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/layout/PageHeader';

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
};

const COUNTRIES = [
  'Egypt', 'Saudi Arabia', 'UAE', 'Jordan', 'Lebanon',
  'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Libya',
  'Tunisia', 'Morocco', 'Algeria', 'Sudan', 'Iraq', 'Palestine',
];

const inputCls =
  'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white';

export default function FindOsteopathPage() {
  const [osteopaths, setOsteopaths] = useState<Osteopath[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [loadError, setLoadError]   = useState<string | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [nameFilter,    setNameFilter]    = useState('');
  const [cityFilter,    setCityFilter]    = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  useEffect(() => {
    fetch('/api/osteopaths')
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        return r.json();
      })
      .then((data) => { if (Array.isArray(data)) setOsteopaths(data); })
      .catch(() => { setLoadError('We could not load the directory. Please check your connection and try again.'); })
      .finally(() => setIsLoading(false));
  }, []);

  const specialtyOptions = useMemo(() => {
    const set = new Set<string>();
    for (const o of osteopaths) {
      if (o.specialty?.trim()) set.add(o.specialty.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [osteopaths]);

  const filtered = useMemo(() => {
    const s = specialtyFilter.toLowerCase();
    const n = nameFilter.trim().toLowerCase();
    const c = cityFilter.trim().toLowerCase();
    const co = countryFilter.toLowerCase();
    return osteopaths
      .filter((o) => {
        if (s  && o.specialty.toLowerCase() !== s)         return false;
        if (n  && !o.name.toLowerCase().includes(n))       return false;
        if (c  && !o.city.toLowerCase().includes(c))       return false;
        if (co && !o.country.toLowerCase().includes(co))   return false;
        return true;
      })
      .sort((a, b) => {
        const cityCmp = (a.city || '').localeCompare(b.city || '');
        if (cityCmp !== 0) return cityCmp;
        return a.name.localeCompare(b.name);
      });
  }, [osteopaths, specialtyFilter, nameFilter, cityFilter, countryFilter]);

  const grouped = useMemo(() => {
    const groups: { city: string; country: string; items: Osteopath[] }[] = [];
    for (const o of filtered) {
      const last = groups[groups.length - 1];
      if (last && last.city === o.city && last.country === o.country) {
        last.items.push(o);
      } else {
        groups.push({ city: o.city, country: o.country, items: [o] });
      }
    }
    return groups;
  }, [filtered]);

  const hasFilters = specialtyFilter || nameFilter || cityFilter || countryFilter;

  const clearFilters = () => {
    setSpecialtyFilter('');
    setNameFilter('');
    setCityFilter('');
    setCountryFilter('');
  };

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Directory"
        title="Find an Osteopath"
        subtitle="Search our directory of certified practitioners across Egypt and the Middle East, all meeting EGSOM's rigorous standards."
      />

      <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Specialty
              </label>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className={inputCls}
              >
                <option value="">All specialties</option>
                {specialtyOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                City
              </label>
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="e.g. Cairo, Alexandria"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Country
              </label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className={inputCls}
              >
                <option value="">All countries</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Practitioner name"
                className={inputCls}
              />
            </div>
          </div>
          {hasFilters && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-brand-600 hover:text-brand-800 font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading directory…
          </div>
        ) : loadError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 flex items-start gap-4">
            <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 font-semibold text-sm">Directory unavailable</p>
              <p className="text-red-700 text-sm mt-1">{loadError}</p>
              <button
                onClick={() => { setLoadError(null); setIsLoading(true); fetch('/api/osteopaths').then((r) => { if (!r.ok) throw new Error(); return r.json(); }).then((data) => { if (Array.isArray(data)) setOsteopaths(data); }).catch(() => setLoadError('We could not load the directory. Please check your connection and try again.')).finally(() => setIsLoading(false)); }}
                className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 font-medium">No osteopaths found</p>
            {hasFilters && (
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your filters or{' '}
                <button onClick={clearFilters} className="text-brand-600 hover:underline">
                  clear all
                </button>
              </p>
            )}
            {!hasFilters && osteopaths.length === 0 && (
              <p className="text-sm text-gray-400 mt-1">No practitioners have been added yet.</p>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map((group) => (
              <section key={`${group.city}-${group.country}`}>
                <header className="flex items-baseline gap-3 mb-5 pb-3 border-b border-gray-200">
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-brand-950 tracking-tight">
                    {group.city || 'Other'}
                  </h2>
                  <span className="text-gray-400 text-xs tracking-[0.25em] uppercase">{group.country}</span>
                  <span className="ml-auto text-gray-400 text-xs">
                    {group.items.length} practitioner{group.items.length !== 1 ? 's' : ''}
                  </span>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {group.items.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  {o.profileImage ? (
                    <img
                      src={o.profileImage}
                      alt={o.name}
                      className="w-14 h-14 rounded-full object-cover shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xl font-bold shrink-0">
                      {o.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight">{o.name}</h3>
                    <p className="text-brand-600 text-sm font-medium mt-0.5">{o.specialty}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {o.city}{o.city && o.country ? ', ' : ''}{o.country}
                    </p>
                  </div>
                </div>

                {o.bio && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                    {o.bio}
                  </p>
                )}

                {(o.phone || o.email) && (
                  <div className="border-t border-gray-100 pt-4 mt-auto space-y-1.5">
                    {o.phone && (
                      <a href={`tel:${o.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600 transition-colors">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {o.phone}
                      </a>
                    )}
                    {o.email && (
                      <a href={`mailto:${o.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600 transition-colors">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {o.email}
                      </a>
                    )}
                  </div>
                )}
              </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
