'use client';

import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { useLanguage } from '@/components/i18n/LanguageProvider';

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
  { value: 'Egypt', ar: 'مصر' },
  { value: 'Saudi Arabia', ar: 'السعودية' },
  { value: 'UAE', ar: 'الإمارات' },
  { value: 'Jordan', ar: 'الأردن' },
  { value: 'Lebanon', ar: 'لبنان' },
  { value: 'Kuwait', ar: 'الكويت' },
  { value: 'Qatar', ar: 'قطر' },
  { value: 'Bahrain', ar: 'البحرين' },
  { value: 'Oman', ar: 'عُمان' },
  { value: 'Libya', ar: 'ليبيا' },
  { value: 'Tunisia', ar: 'تونس' },
  { value: 'Morocco', ar: 'المغرب' },
  { value: 'Algeria', ar: 'الجزائر' },
  { value: 'Sudan', ar: 'السودان' },
  { value: 'Iraq', ar: 'العراق' },
  { value: 'Palestine', ar: 'فلسطين' },
];

const inputCls =
  'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white';

const arabicNumber = new Intl.NumberFormat('ar-EG');

function formatArabicResults(count: number) {
  if (count === 0) return 'لم يتم العثور على نتائج';
  if (count === 1) return 'تم العثور على نتيجة واحدة';
  if (count === 2) return 'تم العثور على نتيجتين';
  if (count >= 3 && count <= 10) {
    return `تم العثور على ${arabicNumber.format(count)} نتائج`;
  }
  return `تم العثور على ${arabicNumber.format(count)} نتيجة`;
}

function formatArabicPractitioners(count: number) {
  if (count === 1) return 'ممارس واحد';
  if (count === 2) return 'ممارسان';
  if (count >= 3 && count <= 10) {
    return `${arabicNumber.format(count)} ممارسين`;
  }
  return `${arabicNumber.format(count)} ممارسًا`;
}

export default function FindOsteopathPage() {
  const { isArabic } = useLanguage();
  const copy = isArabic
    ? {
        specialty: 'التخصص',
        allSpecialties: 'جميع التخصصات',
        city: 'المدينة',
        cityPlaceholder: 'مثال: القاهرة، الإسكندرية',
        country: 'الدولة',
        allCountries: 'جميع الدول',
        name: 'الاسم',
        namePlaceholder: 'اسم الممارس',
        clearFilters: 'مسح عوامل البحث',
        loading: 'جارٍ تحميل الدليل…',
        unavailable: 'الدليل غير متاح',
        loadError: 'تعذر تحميل الدليل. تحقق من اتصالك وحاول مرة أخرى.',
        temporaryUnavailable: 'بيانات الدليل غير متاحة مؤقتًا. يمكنك متابعة تصفح الموقع والمحاولة مرة أخرى بعد قليل.',
        retry: 'حاول مرة أخرى',
        noResults: 'لم يتم العثور على ممارسين',
        adjustFilters: 'جرّب تعديل عوامل البحث أو',
        clearAll: 'امسحها جميعًا',
        noPractitioners: 'لم تتم إضافة ممارسين بعد.',
        other: 'أخرى',
      }
    : {
        specialty: 'Specialty',
        allSpecialties: 'All specialties',
        city: 'City',
        cityPlaceholder: 'e.g. Cairo, Alexandria',
        country: 'Country',
        allCountries: 'All countries',
        name: 'Name',
        namePlaceholder: 'Practitioner name',
        clearFilters: 'Clear filters',
        loading: 'Loading directory…',
        unavailable: 'Directory unavailable',
        loadError: 'We could not load the directory. Please check your connection and try again.',
        temporaryUnavailable: 'Directory data is temporarily unavailable. You can continue browsing the site and try again shortly.',
        retry: 'Try again',
        noResults: 'No osteopaths found',
        adjustFilters: 'Try adjusting your filters or',
        clearAll: 'clear all',
        noPractitioners: 'No practitioners have been added yet.',
        other: 'Other',
      };

  const [osteopaths, setOsteopaths] = useState<Osteopath[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [loadError, setLoadError]   = useState(false);
  const [dataUnavailable, setDataUnavailable] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [nameFilter,    setNameFilter]    = useState('');
  const [cityFilter,    setCityFilter]    = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetch('/api/osteopaths?public=1')
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        const unavailable = r.headers.get('x-egsom-data-status') === 'unavailable';
        return r.json().then((data) => ({ data, unavailable }));
      })
      .then(({ data, unavailable }) => {
        if (cancelled) return;
        if (Array.isArray(data)) setOsteopaths(data);
        setDataUnavailable(unavailable);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
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

  const retryDirectory = async () => {
    setLoadError(false);
    setDataUnavailable(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/osteopaths?public=1');
      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      const data = await response.json();
      if (Array.isArray(data)) setOsteopaths(data);
      setDataUnavailable(
        response.headers.get('x-egsom-data-status') === 'unavailable',
      );
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Directory"
        eyebrowAr="الدليل"
        title="Find an Osteopath"
        titleAr="ابحث عن ممارس أوستيوباثي"
        subtitle="Search our directory of certified practitioners across Egypt and the Middle East, all meeting EGSOM's rigorous standards."
        subtitleAr="ابحث في دليل الممارسين المعتمدين في مصر والشرق الأوسط، وجميعهم يستوفون المعايير المهنية الصارمة للجمعية."
      />

      <div className="bg-slate-50/70 py-9 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* Search bar */}
        <div className="surface-panel mb-6 p-4 sm:mb-8 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="specialty-filter" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                {copy.specialty}
              </label>
              <select
                id="specialty-filter"
                dir={isArabic ? 'rtl' : 'ltr'}
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className={inputCls}
              >
                <option value="">{copy.allSpecialties}</option>
                {specialtyOptions.map((s) => (
                  <option key={s} value={s} dir="auto">{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city-filter" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                {copy.city}
              </label>
              <input
                id="city-filter"
                type="text"
                dir="auto"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder={copy.cityPlaceholder}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="country-filter" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                {copy.country}
              </label>
              <select
                id="country-filter"
                dir={isArabic ? 'rtl' : 'ltr'}
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className={inputCls}
              >
                <option value="">{copy.allCountries}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>{isArabic ? c.ar : c.value}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="name-filter" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                {copy.name}
              </label>
              <input
                id="name-filter"
                type="text"
                dir="auto"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder={copy.namePlaceholder}
                className={inputCls}
              />
            </div>
          </div>
          {hasFilters && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-600">
                {isArabic
                  ? formatArabicResults(filtered.length)
                  : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`}
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-800"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {copy.clearFilters}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500">
            <svg className="w-8 h-8 mx-auto mb-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {copy.loading}
          </div>
        ) : dataUnavailable ? (
          <div role="status" className="flex items-start gap-4 rounded-xl border border-gold/35 bg-gold-soft/45 p-6 sm:p-8">
            <svg className="mt-0.5 h-6 w-6 shrink-0 text-gold-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 9.75h1.5v6h-1.5v-6zm0-3h1.5v1.5h-1.5v-1.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-950">{copy.unavailable}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{copy.temporaryUnavailable}</p>
              <button
                type="button"
                onClick={retryDirectory}
                className="mt-2 inline-flex min-h-11 items-center font-medium text-brand-700 underline decoration-gold/70 underline-offset-4 transition-colors hover:text-brand-950"
              >
                {copy.retry}
              </button>
            </div>
          </div>
        ) : loadError ? (
          <div role="alert" className="flex items-start gap-4 rounded-xl border border-red-200 bg-red-50 p-6 sm:p-8">
            <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 font-semibold text-sm">{copy.unavailable}</p>
              <p className="text-red-700 text-sm mt-1">{copy.loadError}</p>
              <button
                type="button"
                onClick={retryDirectory}
                className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-red-700 underline underline-offset-4 hover:text-red-900"
              >
                {copy.retry}
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="surface-panel py-16 text-center sm:py-20">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="font-medium text-slate-600">{copy.noResults}</p>
            {hasFilters && (
              <p className="mt-1 text-sm text-slate-500">
                {copy.adjustFilters}{' '}
                <button type="button" onClick={clearFilters} className="inline-flex min-h-11 items-center text-brand-600 hover:underline">
                  {copy.clearAll}
                </button>
              </p>
            )}
            {!hasFilters && osteopaths.length === 0 && (
              <p className="mt-1 text-sm text-slate-500">{copy.noPractitioners}</p>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map((group) => (
              <section key={`${group.city}-${group.country}`}>
                <header className="flex items-baseline gap-3 mb-5 pb-3 border-b border-gray-200">
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-brand-950 tracking-tight">
                    <span dir="auto">{group.city || copy.other}</span>
                  </h2>
                  <span dir="auto" className="text-xs uppercase tracking-[0.22em] text-slate-500">{group.country}</span>
                  <span className="ms-auto text-xs text-slate-500">
                    {isArabic
                      ? formatArabicPractitioners(group.items.length)
                      : `${group.items.length} practitioner${group.items.length !== 1 ? 's' : ''}`}
                  </span>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {group.items.map((o) => (
              <div key={o.id} className="surface-card flex flex-col p-6">
                <div className="flex items-start gap-4 mb-4">
                  {o.profileImage ? (
                    // Directory profile images may be hosted on arbitrary approved domains.
                    // eslint-disable-next-line @next/next/no-img-element
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
                    <h3 dir="auto" className="font-semibold text-gray-900 text-base leading-tight">{o.name}</h3>
                    <p dir="auto" className="text-brand-600 text-sm font-medium mt-0.5">{o.specialty}</p>
                    <p dir="auto" className="mt-1 text-xs text-slate-500">
                      {o.city}{o.city && o.country ? (isArabic ? '، ' : ', ') : ''}{o.country}
                    </p>
                  </div>
                </div>

                {o.bio && (
                  <p dir="auto" className="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-slate-600">
                    {o.bio}
                  </p>
                )}

                {(o.phone || o.email) && (
                  <div className="border-t border-gray-100 pt-4 mt-auto space-y-1.5">
                    {o.phone && (
                      <a href={`tel:${o.phone}`} dir="ltr" className="flex items-center gap-2 font-sans text-sm text-slate-600 transition-colors hover:text-brand-700">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {o.phone}
                      </a>
                    )}
                    {o.email && (
                      <a href={`mailto:${o.email}`} dir="ltr" className="flex items-center gap-2 font-sans text-sm text-slate-600 transition-colors hover:text-brand-700">
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
