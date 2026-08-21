'use client';

import { useRef, useState } from 'react';
import Link from '@/components/i18n/LocalizedLink';
import { useLanguage } from '@/components/i18n/LanguageProvider';

type FormState = {
  applicationType: 'new_listing' | 'profile_update';
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
  profileImage: string;
  credentialType: string;
  credentialTypeAr: string;
  credentialNumber: string;
  credentialIssuer: string;
  credentialIssuerAr: string;
  credentialIssuedAt: string;
  credentialExpiresAt: string;
  existingProfileUrl: string;
  applicantNotes: string;
  consentAccuracy: boolean;
  consentPrivacy: boolean;
  website: string;
};

const INITIAL_FORM: FormState = {
  applicationType: 'new_listing',
  name: '', nameAr: '', email: '', phone: '', specialty: '', specialtyAr: '',
  city: '', cityAr: '', country: 'Egypt', countryAr: 'مصر', location: '', locationAr: '',
  bio: '', bioAr: '', profileImage: '', credentialType: '', credentialTypeAr: '',
  credentialNumber: '', credentialIssuer: '', credentialIssuerAr: '',
  credentialIssuedAt: '', credentialExpiresAt: '', existingProfileUrl: '',
  applicantNotes: '', consentAccuracy: false, consentPrivacy: false, website: '',
};

const REQUIRED_FIELDS = [
  'name', 'nameAr', 'email', 'phone', 'specialty', 'specialtyAr', 'city', 'cityAr',
  'country', 'countryAr', 'location', 'locationAr', 'bio', 'bioAr', 'profileImage', 'credentialType',
  'credentialTypeAr', 'credentialNumber', 'credentialIssuer', 'credentialIssuerAr',
] as const;

export default function PractitionerApplicationForm() {
  const { isArabic } = useLanguage();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const copy = isArabic ? {
    intro: 'قبل البدء', introBody: 'هذا نموذج طلب مراجعة، وليس تسجيلًا تلقائيًا. يتحقق مسؤول مخول من المعلومات وبيانات الاعتماد قبل اتخاذ أي قرار بالنشر.',
    request: '1. نوع الطلب وبيانات التواصل', professional: '2. الملف المهني', credentials: '3. بيانات الاعتماد والموافقة',
    newListing: 'طلب إدراج جديد', profileUpdate: 'تحديث ملف موجود',
    name: 'الاسم المهني بالإنجليزية', nameAr: 'الاسم بالعربية', email: 'البريد الإلكتروني', phone: 'رقم الهاتف',
    profileUrl: 'رابط الملف الحالي', specialty: 'التخصص بالإنجليزية', specialtyAr: 'التخصص بالعربية',
    city: 'المدينة بالإنجليزية', cityAr: 'المدينة بالعربية', country: 'الدولة بالإنجليزية', countryAr: 'الدولة بالعربية',
    location: 'عنوان/منطقة الممارسة بالإنجليزية', locationAr: 'عنوان/منطقة الممارسة بالعربية',
    bio: 'نبذة مهنية بالإنجليزية', bioAr: 'نبذة مهنية بالعربية', photo: 'رابط صورة مهنية',
    credentialType: 'نوع المؤهل أو الاعتماد', credentialTypeAr: 'نوع المؤهل بالعربية', number: 'رقم المؤهل أو الترخيص',
    issuer: 'جهة الإصدار', issuerAr: 'جهة الإصدار بالعربية', issued: 'تاريخ الإصدار (اختياري)', expires: 'تاريخ الانتهاء (اختياري)',
    notes: 'ملاحظات إضافية (اختياري)', accuracy: 'أؤكد أن المعلومات المقدمة صحيحة وكاملة بحسب علمي.',
    privacy: 'أوافق على معالجة هذه المعلومات لغرض مراجعة الطلب وإدارة الدليل وفق ', privacyLink: 'إشعار الخصوصية',
    submit: 'إرسال الطلب للمراجعة', sending: 'جارٍ إرسال الطلب…', required: 'يرجى استكمال جميع الحقول المطلوبة والموافقات.',
    urlRequired: 'أضف رابط ملفك الحالي لطلب التحديث.', photoError: 'أضف رابط HTTPS عامًا وصحيحًا للصورة المهنية.', generic: 'تعذر إرسال الطلب الآن. يرجى المحاولة مرة أخرى.',
    successTitle: 'تم استلام طلبك', successBody: 'سيراجع فريق الجمعية المعلومات. لا يعني الاستلام الموافقة أو النشر، ولن يظهر أي ملف تلقائيًا.',
    another: 'إرسال طلب آخر', requiredHint: 'الحقول المطلوبة مميزة بعلامة *', photoHint: 'أضف رابط HTTPS عامًا للصورة المهنية. سيراجع المسؤول الصورة وينقل النسخة المعتمدة إلى وسائط الموقع قبل النشر.',
  } : {
    intro: 'Before you begin', introBody: 'This is a review application, not automatic registration. An authorized administrator checks the information and credentials before any publishing decision.',
    request: '1. Request and contact', professional: '2. Professional profile', credentials: '3. Credentials and consent',
    newListing: 'New directory listing', profileUpdate: 'Update an existing profile',
    name: 'Professional name in English', nameAr: 'Name in Arabic', email: 'Email address', phone: 'Phone number',
    profileUrl: 'Current profile URL', specialty: 'Specialty in English', specialtyAr: 'Specialty in Arabic',
    city: 'City in English', cityAr: 'City in Arabic', country: 'Country in English', countryAr: 'Country in Arabic',
    location: 'Practice address/area in English', locationAr: 'Practice address/area in Arabic',
    bio: 'Professional biography in English', bioAr: 'Professional biography in Arabic', photo: 'Professional photo URL',
    credentialType: 'Qualification or credential type', credentialTypeAr: 'Credential type in Arabic', number: 'Qualification or licence number',
    issuer: 'Issuing organization', issuerAr: 'Issuing organization in Arabic', issued: 'Issue date (optional)', expires: 'Expiry date (optional)',
    notes: 'Additional notes (optional)', accuracy: 'I confirm that the information is accurate and complete to the best of my knowledge.',
    privacy: 'I agree that this information may be processed to review the application and administer the directory under the ', privacyLink: 'privacy notice',
    submit: 'Submit application for review', sending: 'Submitting application…', required: 'Please complete all required fields and consents.',
    urlRequired: 'Add your current profile URL for an update request.', photoError: 'Add a valid public HTTPS URL for the professional photo.', generic: 'The application could not be submitted right now. Please try again.',
    successTitle: 'Application received', successBody: 'The EGSOM team will review the information. Receipt is not approval or publication, and no profile will appear automatically.',
    another: 'Submit another application', requiredHint: 'Required fields are marked with *', photoHint: 'Add a public HTTPS link to the professional photo. An administrator will review it and move the approved image into managed website media before publication.',
  };

  const set = (patch: Partial<FormState>) => setForm((current) => ({ ...current, ...patch }));
  const inputClass = (name: string) => `mt-1 min-h-11 w-full rounded-lg border bg-white px-3 py-2.5 text-base text-brand-950 shadow-sm outline-none transition-colors focus:ring-2 ${invalidFields.includes(name) ? 'border-red-400 focus:ring-red-200' : 'border-brand-950/20 focus:border-brand-600 focus:ring-brand-200'}`;
  const clearInvalid = (name: string) => setInvalidFields((fields) => fields.filter((field) => field !== name));

  const field = (name: keyof FormState, label: string, options: { type?: string; dir?: 'ltr' | 'rtl' | 'auto'; required?: boolean; maxLength?: number } = {}) => (
    <label className="block text-sm font-medium text-brand-950">
      {label}{options.required ? ' *' : ''}
      <input
        ref={name === 'name' ? firstFieldRef : undefined}
        id={name}
        name={name}
        type={options.type ?? 'text'}
        dir={options.dir ?? 'auto'}
        required={options.required}
        maxLength={options.maxLength ?? 240}
        value={String(form[name])}
        onChange={(event) => { set({ [name]: event.target.value }); clearInvalid(name); }}
        className={inputClass(name)}
        aria-invalid={invalidFields.includes(name)}
      />
    </label>
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const missing: string[] = REQUIRED_FIELDS.filter((name) => !String(form[name]).trim());
    if (form.bio.trim().length < 20 && !missing.includes('bio')) missing.push('bio');
    if (form.bioAr.trim().length < 20 && !missing.includes('bioAr')) missing.push('bioAr');
    const invalidPhotoUrl = !/^https:\/\/[^\s]+$/i.test(form.profileImage.trim());
    if (invalidPhotoUrl && !missing.includes('profileImage')) missing.push('profileImage');
    if (form.applicationType === 'profile_update' && !form.existingProfileUrl.trim()) missing.push('existingProfileUrl');
    if (!form.consentAccuracy) missing.push('consentAccuracy');
    if (!form.consentPrivacy) missing.push('consentPrivacy');
    const uniqueMissing = [...new Set(missing)];
    if (uniqueMissing.length) {
      setInvalidFields(uniqueMissing);
      setError(
        invalidPhotoUrl && uniqueMissing.includes('profileImage')
          ? copy.photoError
          : form.applicationType === 'profile_update' && uniqueMissing.includes('existingProfileUrl')
            ? copy.urlRequired
            : copy.required,
      );
      window.requestAnimationFrame(() => {
        document.getElementById(uniqueMissing[0])?.focus();
      });
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/practitioner-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(typeof body.error === 'string' ? body.error : copy.generic);
      }
      setStatus('success');
      setForm(INITIAL_FORM);
      setInvalidFields([]);
    } catch (submissionError) {
      setError(submissionError instanceof Error && !isArabic ? submissionError.message : copy.generic);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <section className="bg-slate-50/70 py-12 sm:py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <div role="status" className="surface-panel border-t-4 border-t-emerald-600 p-7 text-center sm:p-10">
            <h2 className="font-display text-3xl font-semibold text-brand-950">{copy.successTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-muted">{copy.successBody}</p>
            <button type="button" onClick={() => setStatus('idle')} className="mt-6 min-h-11 font-semibold text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950">{copy.another}</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50/70 py-10 sm:py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 border-s-4 border-gold bg-brand-950 px-5 py-5 text-bone sm:px-7">
          <h2 className="font-display text-2xl font-semibold">{copy.intro}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-100">{copy.introBody}</p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-6">
          <div className="sr-only" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => set({ website: event.target.value })} /></div>
          <p className="text-sm text-ink-muted">{copy.requiredHint}</p>
          {error && <div id="application-errors" role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</div>}

          <fieldset className="surface-panel p-5 sm:p-8">
            <legend className="px-2 font-display text-2xl font-semibold text-brand-950">{copy.request}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(['new_listing', 'profile_update'] as const).map((type) => (
                <label key={type} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold ${form.applicationType === type ? 'border-brand-700 bg-brand-50 text-brand-950' : 'border-brand-950/15 bg-white text-ink-muted'}`}>
                  <input type="radio" name="applicationType" value={type} checked={form.applicationType === type} onChange={() => set({ applicationType: type })} className="h-4 w-4 accent-[var(--color-brand-700)]" />
                  {type === 'new_listing' ? copy.newListing : copy.profileUpdate}
                </label>
              ))}
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {field('name', copy.name, { required: true, maxLength: 120 })}
              {field('nameAr', copy.nameAr, { required: true, dir: 'rtl', maxLength: 120 })}
              {field('email', copy.email, { required: true, type: 'email', dir: 'ltr', maxLength: 254 })}
              {field('phone', copy.phone, { required: true, type: 'tel', dir: 'ltr', maxLength: 40 })}
              {form.applicationType === 'profile_update' && <div className="sm:col-span-2">{field('existingProfileUrl', copy.profileUrl, { required: true, type: 'url', dir: 'ltr', maxLength: 500 })}</div>}
            </div>
          </fieldset>

          <fieldset className="surface-panel p-5 sm:p-8">
            <legend className="px-2 font-display text-2xl font-semibold text-brand-950">{copy.professional}</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              {field('specialty', copy.specialty, { required: true, maxLength: 160 })}
              {field('specialtyAr', copy.specialtyAr, { required: true, dir: 'rtl', maxLength: 160 })}
              {field('city', copy.city, { required: true, maxLength: 100 })}
              {field('cityAr', copy.cityAr, { required: true, dir: 'rtl', maxLength: 100 })}
              {field('country', copy.country, { required: true, maxLength: 100 })}
              {field('countryAr', copy.countryAr, { required: true, dir: 'rtl', maxLength: 100 })}
              {field('location', copy.location, { required: true, maxLength: 240 })}
              {field('locationAr', copy.locationAr, { required: true, dir: 'rtl', maxLength: 240 })}
              <label className="block text-sm font-medium text-brand-950 sm:col-span-2">{copy.bio} *<textarea id="bio" dir="auto" rows={5} maxLength={3000} value={form.bio} onChange={(event) => { set({ bio: event.target.value }); clearInvalid('bio'); }} className={inputClass('bio')} aria-invalid={invalidFields.includes('bio')} /></label>
              <label className="block text-sm font-medium text-brand-950 sm:col-span-2">{copy.bioAr} *<textarea id="bioAr" dir="rtl" lang="ar" rows={5} maxLength={3000} value={form.bioAr} onChange={(event) => { set({ bioAr: event.target.value }); clearInvalid('bioAr'); }} className={inputClass('bioAr')} aria-invalid={invalidFields.includes('bioAr')} /></label>
              <div className="sm:col-span-2">{field('profileImage', copy.photo, { required: true, type: 'url', dir: 'ltr', maxLength: 500 })}<p className="mt-2 text-xs leading-5 text-ink-muted">{copy.photoHint}</p></div>
            </div>
          </fieldset>

          <fieldset className="surface-panel p-5 sm:p-8">
            <legend className="px-2 font-display text-2xl font-semibold text-brand-950">{copy.credentials}</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              {field('credentialType', copy.credentialType, { required: true, maxLength: 160 })}
              {field('credentialTypeAr', copy.credentialTypeAr, { required: true, dir: 'rtl', maxLength: 160 })}
              {field('credentialNumber', copy.number, { required: true, maxLength: 120 })}
              {field('credentialIssuer', copy.issuer, { required: true, maxLength: 200 })}
              {field('credentialIssuerAr', copy.issuerAr, { required: true, dir: 'rtl', maxLength: 200 })}
              {field('credentialIssuedAt', copy.issued, { type: 'date', dir: 'ltr' })}
              {field('credentialExpiresAt', copy.expires, { type: 'date', dir: 'ltr' })}
              <label className="block text-sm font-medium text-brand-950 sm:col-span-2">{copy.notes}<textarea id="applicantNotes" dir="auto" rows={4} maxLength={2000} value={form.applicantNotes} onChange={(event) => set({ applicantNotes: event.target.value })} className={inputClass('applicantNotes')} /></label>
            </div>
            <div className="mt-7 space-y-4 border-t border-brand-950/10 pt-6">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink-muted"><input id="consentAccuracy" type="checkbox" checked={form.consentAccuracy} onChange={(event) => { set({ consentAccuracy: event.target.checked }); clearInvalid('consentAccuracy'); }} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand-700)]" />{copy.accuracy}</label>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink-muted"><input id="consentPrivacy" type="checkbox" checked={form.consentPrivacy} onChange={(event) => { set({ consentPrivacy: event.target.checked }); clearInvalid('consentPrivacy'); }} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand-700)]" /><span>{copy.privacy}<Link href="/privacy" className="font-semibold text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950">{copy.privacyLink}</Link>.</span></label>
            </div>
          </fieldset>

          <button type="submit" disabled={status === 'sending'} className="inline-flex min-h-12 w-full items-center justify-center bg-brand-700 px-6 py-3.5 text-base font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-brand-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {status === 'sending' ? copy.sending : copy.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
