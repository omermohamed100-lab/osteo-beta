'use client';

import { useState, useEffect, useMemo, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from '@/components/i18n/LocalizedLink';
import PageHeader from '@/components/layout/PageHeader';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import PublicDataUnavailable from '@/components/public/PublicDataUnavailable';
import { getArabicContent } from '@/lib/arabic-content';

type Osteopath = {
  id: string;
  name: string;
  nameAr?: string;
  specialty: string;
  specialtyAr?: string;
  city: string;
  cityAr?: string;
  country: string;
  countryAr?: string;
  location: string;
  locationAr?: string;
  phone: string;
  email: string;
  bio: string;
  bioAr?: string;
  profileImage: string | null;
  directoryCities?: string[];
  directoryCitiesAr?: string[];
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

function DirectoryPortrait({ osteopath, isArabic }: { osteopath: Osteopath; isArabic: boolean }) {
  const alt = isArabic
    ? `صورة مهنية لـ ${getArabicContent(osteopath.nameAr)}، ${getArabicContent(osteopath.specialtyAr)}`
    : `Professional portrait of ${osteopath.name}, ${osteopath.specialty}`;
  const isDirectoryCutout = /-cutout\.(?:png|webp)$/i.test(osteopath.profileImage ?? '');

  if (osteopath.profileImage?.startsWith('/images/osteopaths/')) {
    return (
      <Image
        src={osteopath.profileImage}
        alt={alt}
        fill
        sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc(50vw - 2.5rem), 360px"
        quality={75}
        className={isDirectoryCutout ? 'directory-portrait-subject' : 'object-cover object-center'}
      />
    );
  }

  if (osteopath.profileImage) {
    return (
      // Directory profile images may be hosted on arbitrary approved domains.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={osteopath.profileImage}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
    );
  }

  return (
    <div aria-hidden="true" className="flex h-full w-full items-center justify-center bg-brand-100 text-4xl font-bold text-brand-600">
      {(isArabic ? getArabicContent(osteopath.nameAr) : osteopath.name).charAt(0).toUpperCase()}
    </div>
  );
}

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
        retry: 'حاول مرة أخرى',
        noResults: 'لم يتم العثور على ممارسين',
        adjustFilters: 'جرّب تعديل عوامل البحث أو',
        clearAll: 'امسحها جميعًا',
        noPractitioners: 'لم تتم إضافة ممارسين بعد.',
        other: 'أخرى',
        profile: 'عرض الملف المهني',
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
        retry: 'Try again',
        noResults: 'No osteopaths found',
        adjustFilters: 'Try adjusting your filters or',
        clearAll: 'clear all',
        noPractitioners: 'No practitioners have been added yet.',
        other: 'Other',
        profile: 'View professional profile',
      };

  const [osteopaths, setOsteopaths] = useState<Osteopath[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [loadError, setLoadError]   = useState(false);
  const [dataUnavailable, setDataUnavailable] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [nameFilter,    setNameFilter]    = useState('');
  const [cityFilter,    setCityFilter]    = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [directoryIntroduced, setDirectoryIntroduced] = useState(false);

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

  useEffect(() => {
    if (isLoading || loadError || dataUnavailable || directoryIntroduced) return;
    const timer = window.setTimeout(() => setDirectoryIntroduced(true), 320);
    return () => window.clearTimeout(timer);
  }, [dataUnavailable, directoryIntroduced, isLoading, loadError]);

  const specialtyOptions = useMemo(() => {
    const options = new Map<string, string>();
    for (const o of osteopaths) {
      if (o.specialty?.trim()) {
        options.set(
          o.specialty.trim(),
          isArabic ? getArabicContent(o.specialtyAr) : o.specialty.trim(),
        );
      }
    }
    return Array.from(options, ([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, isArabic ? 'ar' : 'en'));
  }, [isArabic, osteopaths]);

  const filtered = useMemo(() => {
    const s = specialtyFilter.toLowerCase();
    const n = nameFilter.trim().toLowerCase();
    const c = cityFilter.trim().toLowerCase();
    const co = countryFilter.toLowerCase();
    return osteopaths
      .filter((o) => {
        if (s  && o.specialty.toLowerCase() !== s)         return false;
        if (n && ![o.name, o.nameAr].some((name) => name?.toLowerCase().includes(n))) return false;
        const serviceCities = o.directoryCities?.length ? o.directoryCities : [o.city];
        const serviceCitiesAr = o.directoryCitiesAr?.length ? o.directoryCitiesAr : [o.cityAr];
        if (c && ![...serviceCities, ...serviceCitiesAr].some((city) => city?.toLowerCase().includes(c))) return false;
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
    const groups: { city: string; cityAr?: string; country: string; countryAr?: string; items: Osteopath[] }[] = [];
    const directoryItems = filtered.flatMap((o) =>
      (o.directoryCities?.length ? o.directoryCities : [o.city]).map((city, index) => ({
        ...o,
        city,
        cityAr: o.directoryCitiesAr?.[index] || o.cityAr,
      })),
    );
    directoryItems.sort((a, b) => {
      const countryCompare = a.country.localeCompare(b.country);
      if (countryCompare !== 0) return countryCompare;
      const cityCompare = a.city.localeCompare(b.city);
      if (cityCompare !== 0) return cityCompare;
      return a.name.localeCompare(b.name);
    });

    for (const o of directoryItems) {
      const last = groups[groups.length - 1];
      if (last && last.city === o.city && last.country === o.country) {
        last.items.push(o);
      } else {
        groups.push({ city: o.city, cityAr: o.cityAr, country: o.country, countryAr: o.countryAr, items: [o] });
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
        subtitle="Search published profiles for osteopathic practitioners listed by EGSOM. Credential details appear only when verification information is recorded."
        subtitleAr="ابحث في الملفات المنشورة لممارسي الأوستيوباثي المدرجين لدى الجمعية. ولا تظهر بيانات الاعتماد إلا عند تسجيل معلومات التحقق."
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
                {specialtyOptions.map((option) => (
                  <option key={option.value} value={option.value} dir="auto">{option.label}</option>
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
              <span aria-live="polite" aria-atomic="true" className="text-sm text-slate-600">
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
          <div role="status" aria-live="polite" aria-atomic="true" className="py-20 text-center text-slate-500">
            <svg aria-hidden="true" className="status-spinner mx-auto mb-3 h-8 w-8" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {copy.loading}
          </div>
        ) : dataUnavailable ? (
          <PublicDataUnavailable
            title={{ en: 'Directory unavailable', ar: 'الدليل غير متاح' }}
            description={{
              en: 'Directory data is temporarily unavailable. You can continue browsing the site and try again shortly.',
              ar: 'بيانات الدليل غير متاحة مؤقتًا. يمكنك متابعة تصفح الموقع والمحاولة مرة أخرى بعد قليل.',
            }}
            onRetry={retryDirectory}
          />
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
                    <span dir="auto">{isArabic ? getArabicContent(group.cityAr) : (group.city || copy.other)}</span>
                  </h2>
                  <span dir="auto" className="text-xs uppercase tracking-[0.22em] text-slate-500">{isArabic ? getArabicContent(group.countryAr) : group.country}</span>
                  <span className="ms-auto text-xs text-slate-500">
                    {isArabic
                      ? formatArabicPractitioners(group.items.length)
                      : `${group.items.length} practitioner${group.items.length !== 1 ? 's' : ''}`}
                  </span>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {group.items.map((o, index) => (
              <article
                key={o.id}
                className={`surface-card directory-practitioner-card group flex h-full flex-col overflow-hidden p-0 ${directoryIntroduced ? '' : 'directory-entry'}`}
                style={directoryIntroduced ? undefined : ({ '--directory-delay': `${Math.min(index, 4) * 25}ms` } as CSSProperties)}
              >
                <div className="directory-practitioner-content flex flex-grow flex-col p-5 sm:p-6">
                  <div className="directory-practitioner-header">
                    <div className="directory-practitioner-intro min-w-0 pt-1">
                      <p dir="auto" className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">{isArabic ? getArabicContent(o.specialtyAr) : o.specialty}</p>
                      <h3 dir="auto" className="mt-1.5 font-display text-xl font-semibold leading-tight tracking-tight text-brand-950">{isArabic ? getArabicContent(o.nameAr) : o.name}</h3>
                      <p dir="auto" className="mt-2 text-sm text-slate-500">
                        {isArabic ? getArabicContent(o.cityAr) : o.city}{o.city && o.country ? (isArabic ? '، ' : ', ') : ''}{isArabic ? getArabicContent(o.countryAr) : o.country}
                      </p>
                    </div>
                    <div className="directory-portrait-float relative">
                      <DirectoryPortrait osteopath={o} isArabic={isArabic} />
                    </div>
                  </div>

                  {o.bio && (
                    <p dir="auto" className="directory-practitioner-bio mt-5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {isArabic ? getArabicContent(o.bioAr) : o.bio}
                    </p>
                  )}

                  {o.location && (
                    <p dir="auto" title={isArabic ? getArabicContent(o.locationAr) : o.location} className="mt-4 flex gap-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21s7-5.52 7-12A7 7 0 105 9c0 6.48 7 12 7 12z" />
                        <circle cx="12" cy="9" r="2.25" strokeWidth={1.5} />
                      </svg>
                      <span>{isArabic ? getArabicContent(o.locationAr) : o.location}</span>
                    </p>
                  )}

                  {(o.phone || o.email) && (
                    <div className="mt-auto space-y-1.5 border-t border-gray-100 pt-4">
                    {o.phone && (
                      <a href={`tel:${o.phone.replace(/[^+\d]/g, '')}`} dir="ltr" className="flex min-h-11 items-center gap-2 font-sans text-sm text-slate-600 transition-colors hover:text-brand-700">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {o.phone}
                      </a>
                    )}
                    {o.email && (
                      <a href={`mailto:${o.email}`} dir="ltr" className="flex min-h-11 items-center gap-2 font-sans text-sm text-slate-600 transition-colors hover:text-brand-700">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {o.email}
                      </a>
                    )}
                    </div>
                  )}
                  <Link
                    href={`/find-osteopath/${encodeURIComponent(o.id)}`}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 border-t border-brand-100/80 pt-4 text-sm font-semibold text-brand-700 outline-none transition-colors hover:text-brand-950 focus-visible:ring-2 focus-visible:ring-brand-600"
                  >
                    {copy.profile}
                    <span className="rtl-flip" aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
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
