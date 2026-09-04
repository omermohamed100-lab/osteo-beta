'use client';

import { useEffect, useRef, useState } from 'react';
import Link from '@/components/i18n/LocalizedLink';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { clearSessionDraft, readSessionDraft, writeSessionDraft } from '@/lib/session-draft';
import { safeTrack, trackOncePerSession } from '@/lib/conversion-analytics';

type FormState = {
  primaryLanguage: 'en' | 'ar';
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

type FieldName = keyof FormState;
type FieldErrors = Partial<Record<FieldName, string>>;

const INITIAL_FORM: FormState = {
  primaryLanguage: 'en',
  applicationType: 'new_listing',
  name: '', nameAr: '', email: '', phone: '', specialty: '', specialtyAr: '',
  city: '', cityAr: '', country: 'Egypt', countryAr: 'مصر', location: '', locationAr: '',
  bio: '', bioAr: '', profileImage: '', credentialType: '', credentialTypeAr: '',
  credentialNumber: '', credentialIssuer: '', credentialIssuerAr: '',
  credentialIssuedAt: '', credentialExpiresAt: '', existingProfileUrl: '',
  applicantNotes: '', consentAccuracy: false, consentPrivacy: false, website: '',
};

const APPLICATION_DRAFT_KEY = 'egsom-practitioner-application-draft';
const APPLICATION_DRAFT_FIELDS = [
  'primaryLanguage', 'applicationType', 'name', 'nameAr', 'email', 'phone', 'specialty', 'specialtyAr',
  'city', 'cityAr', 'country', 'countryAr', 'location', 'locationAr', 'bio', 'bioAr',
  'profileImage', 'credentialType', 'credentialTypeAr', 'credentialNumber',
  'credentialIssuer', 'credentialIssuerAr', 'credentialIssuedAt', 'credentialExpiresAt',
  'existingProfileUrl', 'applicantNotes',
] as const satisfies readonly (keyof FormState)[];

const REQUIRED_FIELDS = [
  'name', 'nameAr', 'email', 'phone', 'specialty', 'specialtyAr', 'city', 'cityAr',
  'country', 'countryAr', 'location', 'locationAr', 'bio', 'bioAr', 'profileImage', 'credentialType',
  'credentialTypeAr', 'credentialNumber', 'credentialIssuer', 'credentialIssuerAr',
] as const;

const VALIDATION_ORDER: FieldName[] = [
  'name', 'nameAr', 'email', 'phone', 'existingProfileUrl', 'specialty', 'specialtyAr',
  'city', 'cityAr', 'country', 'countryAr', 'location', 'locationAr', 'bio', 'bioAr',
  'profileImage', 'credentialType', 'credentialTypeAr', 'credentialNumber', 'credentialIssuer',
  'credentialIssuerAr', 'credentialIssuedAt', 'credentialExpiresAt', 'consentAccuracy', 'consentPrivacy',
];

const isPublicHttpsUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
};

export default function PractitionerApplicationForm() {
  const { isArabic } = useLanguage();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [draftReady, setDraftReady] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [submissionError, setSubmissionError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [step, setStep] = useState(0);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const successTitleRef = useRef<HTMLHeadingElement>(null);

  const copy = isArabic ? {
    intro: 'قبل البدء', introBody: 'هذا طلب للمراجعة، وليس تسجيلًا تلقائيًا. يتحقق مسؤول مفوّض من المعلومات والمؤهلات قبل اتخاذ أي قرار بالنشر.',
    request: '1. نوع الطلب وبيانات التواصل', professional: '2. الملف المهني', credentials: '3. المؤهلات والموافقات',
    newListing: 'طلب إدراج جديد', profileUpdate: 'تحديث ملف موجود',
    name: 'الاسم المهني بالإنجليزية', nameAr: 'الاسم بالعربية', email: 'البريد الإلكتروني', phone: 'رقم الهاتف',
    profileUrl: 'رابط الملف الحالي', specialty: 'التخصص بالإنجليزية', specialtyAr: 'التخصص بالعربية',
    city: 'المدينة بالإنجليزية', cityAr: 'المدينة بالعربية', country: 'الدولة بالإنجليزية', countryAr: 'الدولة بالعربية',
    location: 'عنوان أو منطقة الممارسة بالإنجليزية', locationAr: 'عنوان أو منطقة الممارسة بالعربية',
    bio: 'نبذة مهنية بالإنجليزية', bioAr: 'نبذة مهنية بالعربية', photo: 'صورة مهنية خاصة',
    credentialType: 'نوع المؤهل أو الاعتماد بالإنجليزية', credentialTypeAr: 'نوع المؤهل أو الاعتماد بالعربية', number: 'رقم المؤهل أو الترخيص',
    issuer: 'جهة الإصدار بالإنجليزية', issuerAr: 'جهة الإصدار بالعربية', issued: 'تاريخ الإصدار (اختياري)', expires: 'تاريخ الانتهاء (اختياري)',
    notes: 'ملاحظات إضافية (اختياري)', accuracy: 'أؤكد أن المعلومات المقدمة صحيحة وكاملة بحسب علمي.',
    privacy: 'أوافق على معالجة هذه المعلومات لغرض مراجعة الطلب وإدارة الدليل وفق ', privacyLink: 'إشعار الخصوصية',
    submit: 'إرسال الطلب للمراجعة', sending: 'جارٍ إرسال الطلب…', validationSummary: 'راجع الحقول الموضحة أدناه، ثم أرسل الطلب مرة أخرى.',
    required: 'هذا الحقل مطلوب.', invalidValue: 'راجع القيمة المدخلة في هذا الحقل.', emailError: 'أدخل عنوان بريد إلكتروني صحيحًا.',
    phoneError: 'أدخل رقم هاتف يتكون من 7 أحرف على الأقل.', urlRequired: 'أضف رابط ملفك الحالي لطلب التحديث.',
    profileUrlError: 'أدخل رابط HTTPS عامًا وصحيحًا للملف الحالي.', photoError: 'اختر صورة JPEG أو PNG أو WebP بحجم لا يتجاوز 2 ميجابايت.',
    bioError: 'اكتب 20 حرفًا على الأقل.', dateError: 'يجب أن يكون تاريخ الانتهاء بعد تاريخ الإصدار.',
    serverValidation: 'تعذر التحقق من بعض المعلومات. راجع الحقول وحاول مرة أخرى.', generic: 'تعذر إرسال الطلب الآن. يرجى المحاولة مرة أخرى.',
    successTitle: 'تم استلام طلبك', successBody: 'سيراجع فريق الجمعية المعلومات. لا يعني استلام الطلب الموافقة أو النشر، ولن يظهر أي ملف تلقائيًا.',
    another: 'إرسال طلب آخر', back: 'العودة إلى موارد الممارسين', requiredHint: 'الحقول المطلوبة مميزة بعلامة *',
    photoHint: 'تُحفظ الصورة بشكل خاص ولا تكون عامة قبل موافقة المسؤول.',
    discardDraft: 'حذف المسودة ومسح النموذج',
  } : {
    intro: 'Before you begin', introBody: 'This is an application for review, not automatic registration. An authorized administrator checks the information and credentials before any publishing decision.',
    request: '1. Request and contact', professional: '2. Professional profile', credentials: '3. Credentials and consent',
    newListing: 'New directory listing', profileUpdate: 'Update an existing profile',
    name: 'Professional name in English', nameAr: 'Name in Arabic', email: 'Email address', phone: 'Phone number',
    profileUrl: 'Current profile URL', specialty: 'Specialty in English', specialtyAr: 'Specialty in Arabic',
    city: 'City in English', cityAr: 'City in Arabic', country: 'Country in English', countryAr: 'Country in Arabic',
    location: 'Practice address or area in English', locationAr: 'Practice address or area in Arabic',
    bio: 'Professional biography in English', bioAr: 'Professional biography in Arabic', photo: 'Private professional photo',
    credentialType: 'Qualification or credential type in English', credentialTypeAr: 'Qualification or credential type in Arabic', number: 'Qualification or licence number',
    issuer: 'Issuing organization in English', issuerAr: 'Issuing organization in Arabic', issued: 'Issue date (optional)', expires: 'Expiry date (optional)',
    notes: 'Additional notes (optional)', accuracy: 'I confirm that the information is accurate and complete to the best of my knowledge.',
    privacy: 'I agree that this information may be processed to review the application and administer the directory under the ', privacyLink: 'privacy notice',
    submit: 'Submit for review', sending: 'Submitting…', validationSummary: 'Review the highlighted fields below, then submit the application again.',
    required: 'This field is required.', invalidValue: 'Review the value entered in this field.', emailError: 'Enter a valid email address.',
    phoneError: 'Enter a phone number with at least 7 characters.', urlRequired: 'Add your current profile URL for an update request.',
    profileUrlError: 'Enter a valid public HTTPS URL for the current profile.', photoError: 'Choose a JPEG, PNG, or WebP image no larger than 2 MB.',
    bioError: 'Enter at least 20 characters.', dateError: 'The expiry date must be after the issue date.',
    serverValidation: 'Some information could not be validated. Review the fields and try again.', generic: 'The application could not be submitted right now. Please try again.',
    successTitle: 'Application received', successBody: 'The EGSOM team will review the information. Receipt is not approval or publication, and no profile will appear automatically.',
    another: 'Submit another application', back: 'Back to practitioner resources', requiredHint: 'Required fields are marked with *',
    photoHint: 'Stored privately and never made public before administrator approval.',
    discardDraft: 'Discard draft and clear form',
  };

  const requiresEnglish = form.primaryLanguage === 'en';
  const requiresArabic = form.primaryLanguage === 'ar';

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const draft = readSessionDraft(APPLICATION_DRAFT_KEY, INITIAL_FORM, APPLICATION_DRAFT_FIELDS);
      if (draft) setForm((current) => ({ ...current, ...draft }));
      setDraftReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const hasDraft = draftReady && APPLICATION_DRAFT_FIELDS.some(
    (field) => form[field] !== INITIAL_FORM[field],
  );

  useEffect(() => {
    if (status !== 'success') return;
    window.requestAnimationFrame(() => successTitleRef.current?.focus());
  }, [status]);

  const set = (patch: Partial<FormState>) => {
    setForm((current) => {
      const next = { ...current, ...patch };

      // Flush each edit synchronously. The locale switch uses a full page
      // navigation, which may happen before an effect scheduled after render.
      if (draftReady && status !== 'success') {
        const nextHasDraft = APPLICATION_DRAFT_FIELDS.some(
          (field) => next[field] !== INITIAL_FORM[field],
        );
        if (nextHasDraft) {
          writeSessionDraft(APPLICATION_DRAFT_KEY, next, APPLICATION_DRAFT_FIELDS);
        } else {
          clearSessionDraft(APPLICATION_DRAFT_KEY);
        }
      }

      return next;
    });
  };
  const hasValidationErrors = Object.keys(fieldErrors).length > 0;
  const errorMessage = hasValidationErrors ? copy.validationSummary : submissionError;
  const inputClass = (name: FieldName) => `mt-1 min-h-11 w-full rounded-lg border bg-white px-3 py-2.5 text-base text-brand-950 shadow-sm outline-none transition-colors focus:ring-2 ${fieldErrors[name] ? 'border-red-400 focus:border-red-600 focus:ring-red-200' : 'border-brand-950/20 focus:border-brand-600 focus:ring-brand-200'}`;

  const clearFieldError = (name: FieldName) => {
    setSubmissionError('');
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const fieldError = (name: FieldName) => fieldErrors[name] ? (
    <p id={`${name}-error`} className="mt-1.5 text-sm leading-5 text-red-700">
      {fieldErrors[name]}
    </p>
  ) : null;

  const goToStep = (next: number) => {
    setStep(next);
    setSubmissionError('');
    window.requestAnimationFrame(() => document.getElementById(`application-step-${next}`)?.focus());
  };

  const nextStep = () => {
    const names: FieldName[] = step === 0
      ? ['email', 'phone', form.primaryLanguage === 'ar' ? 'nameAr' : 'name']
      : ['credentialNumber', form.primaryLanguage === 'ar' ? 'credentialTypeAr' : 'credentialType', form.primaryLanguage === 'ar' ? 'credentialIssuerAr' : 'credentialIssuer'];
    const errors: FieldErrors = {};
    for (const name of names) if (!String(form[name]).trim()) errors[name] = copy.required;
    if (step === 0 && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = copy.emailError;
    if (Object.keys(errors).length) { setFieldErrors(errors); focusFirstInvalid(errors); return; }
    setFieldErrors({}); goToStep(step + 1);
  };

  const field = (name: FieldName, label: string, options: {
    type?: string;
    dir?: 'ltr' | 'rtl' | 'auto';
    lang?: 'en' | 'ar';
    required?: boolean;
    maxLength?: number;
    describedBy?: string;
  } = {}) => {
    const errorId = fieldErrors[name] ? `${name}-error` : undefined;
    const describedBy = [options.describedBy, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="min-w-0">
        <label htmlFor={name} className="block text-sm font-medium text-brand-950">
          {label}{options.required ? ' *' : ''}
        </label>
        <input
          ref={name === 'name' ? firstFieldRef : undefined}
          id={name}
          name={name}
          type={options.type ?? 'text'}
          dir={options.dir ?? 'auto'}
          lang={options.lang}
          required={options.required}
          maxLength={options.maxLength ?? 240}
          value={String(form[name])}
          onChange={(event) => { set({ [name]: event.target.value }); clearFieldError(name); }}
          className={inputClass(name)}
          aria-invalid={Boolean(fieldErrors[name])}
          aria-describedby={describedBy}
        />
        {fieldError(name)}
      </div>
    );
  };

  const focusFirstInvalid = (errors: FieldErrors) => {
    const firstInvalid = VALIDATION_ORDER.find((name) => errors[name]);
    window.requestAnimationFrame(() => {
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmissionError('');

    const errors: FieldErrors = {};
    const primaryFields = form.primaryLanguage === 'ar'
      ? REQUIRED_FIELDS.filter((name) => !['name','specialty','city','country','location','bio','credentialType','credentialIssuer'].includes(name))
      : REQUIRED_FIELDS.filter((name) => !['nameAr','specialtyAr','cityAr','countryAr','locationAr','bioAr','credentialTypeAr','credentialIssuerAr'].includes(name));
    for (const name of primaryFields) {
      if (!String(form[name]).trim()) errors[name] = copy.required;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = copy.emailError;
    if (form.phone.trim() && form.phone.trim().length < 7) errors.phone = copy.phoneError;
    if (form.bio.trim() && form.bio.trim().length < 20) errors.bio = copy.bioError;
    if (form.bioAr.trim() && form.bioAr.trim().length < 20) errors.bioAr = copy.bioError;
    if (form.applicationType === 'profile_update') {
      if (!form.existingProfileUrl.trim()) errors.existingProfileUrl = copy.urlRequired;
      else if (!isPublicHttpsUrl(form.existingProfileUrl.trim())) errors.existingProfileUrl = copy.profileUrlError;
    }
    if (form.credentialIssuedAt && form.credentialExpiresAt && form.credentialExpiresAt < form.credentialIssuedAt) {
      errors.credentialExpiresAt = copy.dateError;
    }
    if (!form.consentAccuracy) errors.consentAccuracy = copy.required;
    if (!form.consentPrivacy) errors.consentPrivacy = copy.required;

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      focusFirstInvalid(errors);
      return;
    }

    setFieldErrors({});
    setStatus('sending');
    try {
      const response = await fetch('/api/practitioner-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 400) {
          const serverErrors: FieldErrors = {};
          if (Array.isArray(body.details)) {
            for (const issue of body.details) {
              const name = Array.isArray(issue?.path) ? issue.path[0] : undefined;
              if (typeof name === 'string' && VALIDATION_ORDER.includes(name as FieldName)) {
                serverErrors[name as FieldName] = copy.invalidValue;
              }
            }
          }
          if (Object.keys(serverErrors).length) {
            setFieldErrors(serverErrors);
            focusFirstInvalid(serverErrors);
          } else {
            setSubmissionError(copy.serverValidation);
          }
        } else {
          setSubmissionError(copy.generic);
        }
        setStatus('idle');
        return;
      }
      setStatus('success');
      safeTrack('practitioner_application_complete', { application_type: form.applicationType });
      clearSessionDraft(APPLICATION_DRAFT_KEY);
      setForm(INITIAL_FORM);
      setFieldErrors({});
    } catch {
      setSubmissionError(copy.generic);
      setStatus('idle');
    }
  };

  const startAnotherApplication = () => {
    setSubmissionError('');
    setFieldErrors({});
    setStatus('idle');
    window.requestAnimationFrame(() => firstFieldRef.current?.focus());
  };

  const discardDraft = () => {
    clearSessionDraft(APPLICATION_DRAFT_KEY);
    setForm(INITIAL_FORM);
    setFieldErrors({});
    setSubmissionError('');
    window.requestAnimationFrame(() => firstFieldRef.current?.focus());
  };

  if (status === 'success') {
    return (
      <section className="bg-slate-50/70 py-12 sm:py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <div role="status" aria-labelledby="application-success-title" className="surface-panel border-t-4 border-t-emerald-600 px-5 py-8 text-center sm:p-10">
            <h2 ref={successTitleRef} id="application-success-title" tabIndex={-1} className="font-display text-3xl font-semibold text-brand-950 outline-none">
              {copy.successTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-muted">{copy.successBody}</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
              <Link href="/practitioners" className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4">
                {copy.back}
              </Link>
              <button type="button" onClick={startAnotherApplication} className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4">
                {copy.another}
              </button>
            </div>
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
        <form
          onSubmit={submit}
          onFocusCapture={(event) => {
            if (!(event.target as HTMLElement).matches('input, textarea, select')) return;
            trackOncePerSession(
              'practitioner-application-start',
              'practitioner_application_start',
              { route_type: 'practitioner_application' },
            );
          }}
          noValidate
          aria-busy={status === 'sending'}
          className="space-y-6"
        >
          <div className="surface-panel p-4"><p className="text-sm font-semibold" aria-live="polite">{isArabic ? `الخطوة ${step + 1} من 3` : `Step ${step + 1} of 3`}</p><ol className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-600"><li aria-current={step === 0 ? 'step' : undefined}>{isArabic ? 'التواصل والأهلية' : 'Contact and eligibility'}</li><li aria-current={step === 1 ? 'step' : undefined}>{isArabic ? 'المؤهلات' : 'Credentials'}</li><li aria-current={step === 2 ? 'step' : undefined}>{isArabic ? 'الملف العام' : 'Public profile'}</li></ol></div>
          <div className="surface-panel p-5"><label htmlFor="primaryLanguage" className="block text-sm font-semibold text-brand-950">{isArabic ? 'لغة الطلب الأساسية' : 'Primary submission language'}</label><select id="primaryLanguage" value={form.primaryLanguage} onChange={(event) => set({ primaryLanguage: event.target.value as 'en' | 'ar' })} className="mt-2 min-h-11 rounded-lg border border-brand-950/20 bg-white px-3"><option value="en">English</option><option value="ar">العربية</option></select><p className="mt-2 text-xs text-slate-600">{isArabic ? 'تُطلب حقول اللغة الأساسية فقط عند التقديم. يجب أن يكمل المسؤول الترجمة ويراجعها قبل إنشاء مسودة.' : 'Only the primary-language profile fields are required initially. Staff must complete and review the translation before creating a draft.'}</p></div>
          <div className="sr-only" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => set({ website: event.target.value })} /></div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">{copy.requiredHint}</p>
            {hasDraft && (
              <button type="button" onClick={discardDraft} className="inline-flex min-h-11 items-center text-sm font-medium text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600">
                {copy.discardDraft}
              </button>
            )}
          </div>
          {errorMessage && <div id="application-errors" role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-800">{errorMessage}</div>}

          <fieldset hidden={step !== 0} className="surface-panel p-5 sm:p-8">
            <legend id="application-step-0" tabIndex={-1} className="max-w-[calc(100%-1rem)] px-2 font-display text-xl font-semibold leading-snug text-brand-950 sm:text-2xl">{isArabic ? '1. التواصل والأهلية' : '1. Contact and eligibility'}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(['new_listing', 'profile_update'] as const).map((type) => (
                <label key={type} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold focus-within:ring-2 focus-within:ring-brand-600 focus-within:ring-offset-2 ${form.applicationType === type ? 'border-brand-700 bg-brand-50 text-brand-950' : 'border-brand-950/15 bg-white text-ink-muted'}`}>
                  <input type="radio" name="applicationType" value={type} checked={form.applicationType === type} onChange={() => { set({ applicationType: type }); clearFieldError('existingProfileUrl'); }} className="h-4 w-4 shrink-0 accent-[var(--color-brand-700)] outline-none" />
                  {type === 'new_listing' ? copy.newListing : copy.profileUpdate}
                </label>
              ))}
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {field('name', copy.name, { required: requiresEnglish, dir: 'ltr', lang: 'en', maxLength: 120 })}
              {field('nameAr', copy.nameAr, { required: requiresArabic, dir: 'rtl', lang: 'ar', maxLength: 120 })}
              {field('email', copy.email, { required: true, type: 'email', dir: 'ltr', maxLength: 254 })}
              {field('phone', copy.phone, { required: true, type: 'tel', dir: 'ltr', maxLength: 40 })}
              {form.applicationType === 'profile_update' && <div className="sm:col-span-2">{field('existingProfileUrl', copy.profileUrl, { required: true, type: 'url', dir: 'ltr', maxLength: 500 })}</div>}
            </div>
          </fieldset>

          <fieldset hidden={step !== 2} className="surface-panel p-5 sm:p-8">
            <legend id="application-step-2" tabIndex={-1} className="max-w-[calc(100%-1rem)] px-2 font-display text-xl font-semibold leading-snug text-brand-950 sm:text-2xl">{isArabic ? '3. الملف العام والمراجعة النهائية' : '3. Public profile and final review'}</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              {field('specialty', copy.specialty, { required: requiresEnglish, dir: 'ltr', lang: 'en', maxLength: 160 })}
              {field('specialtyAr', copy.specialtyAr, { required: requiresArabic, dir: 'rtl', lang: 'ar', maxLength: 160 })}
              {field('city', copy.city, { required: requiresEnglish, dir: 'ltr', lang: 'en', maxLength: 100 })}
              {field('cityAr', copy.cityAr, { required: requiresArabic, dir: 'rtl', lang: 'ar', maxLength: 100 })}
              {field('country', copy.country, { required: requiresEnglish, dir: 'ltr', lang: 'en', maxLength: 100 })}
              {field('countryAr', copy.countryAr, { required: requiresArabic, dir: 'rtl', lang: 'ar', maxLength: 100 })}
              {field('location', copy.location, { required: requiresEnglish, dir: 'ltr', lang: 'en', maxLength: 240 })}
              {field('locationAr', copy.locationAr, { required: requiresArabic, dir: 'rtl', lang: 'ar', maxLength: 240 })}
              <div className="min-w-0 sm:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-brand-950">{copy.bio}{requiresEnglish ? ' *' : ''}</label>
                <textarea id="bio" name="bio" dir="ltr" lang="en" rows={5} required={requiresEnglish} maxLength={3000} value={form.bio} onChange={(event) => { set({ bio: event.target.value }); clearFieldError('bio'); }} className={inputClass('bio')} aria-invalid={Boolean(fieldErrors.bio)} aria-describedby={fieldErrors.bio ? 'bio-error' : undefined} />
                {fieldError('bio')}
              </div>
              <div className="min-w-0 sm:col-span-2">
                <label htmlFor="bioAr" className="block text-sm font-medium text-brand-950">{copy.bioAr}{requiresArabic ? ' *' : ''}</label>
                <textarea id="bioAr" name="bioAr" dir="rtl" lang="ar" rows={5} required={requiresArabic} maxLength={3000} value={form.bioAr} onChange={(event) => { set({ bioAr: event.target.value }); clearFieldError('bioAr'); }} className={inputClass('bioAr')} aria-invalid={Boolean(fieldErrors.bioAr)} aria-describedby={fieldErrors.bioAr ? 'bioAr-error' : undefined} />
                {fieldError('bioAr')}
              </div>
              <div className="sm:col-span-2"><label htmlFor="profile-photo" className="block text-sm font-medium text-brand-950">{isArabic ? 'صورة مهنية خاصة *' : 'Private professional photo *'}</label><input id="profile-photo" type="file" required accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (!file || file.size > 2 * 1024 * 1024) { setFieldErrors((current) => ({ ...current, profileImage: isArabic ? 'اختر صورة JPEG أو PNG أو WebP بحجم لا يتجاوز 2 ميجابايت.' : 'Choose a JPEG, PNG, or WebP image no larger than 2 MB.' })); return; } const reader = new FileReader(); reader.onload = () => { set({ profileImage: String(reader.result) }); clearFieldError('profileImage'); }; reader.readAsDataURL(file); }} className={inputClass('profileImage')} aria-describedby="profileImage-hint" /><p id="profileImage-hint" className="mt-2 text-xs leading-5 text-ink-muted">{isArabic ? 'تُحفظ الصورة بشكل خاص ولا تكون عامة قبل موافقة المسؤول.' : 'Stored privately and never made public before administrator approval.'}</p>{fieldError('profileImage')}</div>
            </div>
          </fieldset>

          <fieldset hidden={step !== 1} className="surface-panel p-5 sm:p-8">
            <legend id="application-step-1" tabIndex={-1} className="max-w-[calc(100%-1rem)] px-2 font-display text-xl font-semibold leading-snug text-brand-950 sm:text-2xl">{isArabic ? '2. المؤهلات' : '2. Credentials'}</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              {field('credentialType', copy.credentialType, { required: requiresEnglish, dir: 'ltr', lang: 'en', maxLength: 160 })}
              {field('credentialTypeAr', copy.credentialTypeAr, { required: requiresArabic, dir: 'rtl', lang: 'ar', maxLength: 160 })}
              <div className="sm:col-span-2">{field('credentialNumber', copy.number, { required: true, dir: 'ltr', maxLength: 120 })}</div>
              {field('credentialIssuer', copy.issuer, { required: requiresEnglish, dir: 'ltr', lang: 'en', maxLength: 200 })}
              {field('credentialIssuerAr', copy.issuerAr, { required: requiresArabic, dir: 'rtl', lang: 'ar', maxLength: 200 })}
              {field('credentialIssuedAt', copy.issued, { type: 'date', dir: 'ltr' })}
              {field('credentialExpiresAt', copy.expires, { type: 'date', dir: 'ltr' })}
              <div className="min-w-0 sm:col-span-2">
                <label htmlFor="applicantNotes" className="block text-sm font-medium text-brand-950">{copy.notes}</label>
                <textarea id="applicantNotes" name="applicantNotes" dir="auto" rows={4} maxLength={2000} value={form.applicantNotes} onChange={(event) => { set({ applicantNotes: event.target.value }); clearFieldError('applicantNotes'); }} className={inputClass('applicantNotes')} />
              </div>
            </div>
            <div className="mt-7 space-y-2 border-t border-brand-950/10 pt-4">
              <div>
                <label htmlFor="consentAccuracy" className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm leading-6 text-ink-muted">
                  <input id="consentAccuracy" type="checkbox" required checked={form.consentAccuracy} onChange={(event) => { set({ consentAccuracy: event.target.checked }); clearFieldError('consentAccuracy'); }} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand-700)]" aria-invalid={Boolean(fieldErrors.consentAccuracy)} aria-describedby={fieldErrors.consentAccuracy ? 'consentAccuracy-error' : undefined} />
                  <span>{copy.accuracy}</span>
                </label>
                {fieldError('consentAccuracy')}
              </div>
              <div>
                <div className="flex min-h-11 items-start gap-3 py-2 text-sm leading-6 text-ink-muted">
                  <input id="consentPrivacy" type="checkbox" required checked={form.consentPrivacy} onChange={(event) => { set({ consentPrivacy: event.target.checked }); clearFieldError('consentPrivacy'); }} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand-700)]" aria-invalid={Boolean(fieldErrors.consentPrivacy)} aria-describedby={fieldErrors.consentPrivacy ? 'consentPrivacy-error' : undefined} />
                  <span><label htmlFor="consentPrivacy" className="cursor-pointer">{copy.privacy}</label><Link href="/privacy" className="font-semibold text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2">{copy.privacyLink}</Link>.</span>
                </div>
                {fieldError('consentPrivacy')}
              </div>
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-3">{step > 0 && <button type="button" onClick={() => goToStep(step - 1)} className="min-h-12 border border-brand-700 px-6 font-semibold text-brand-800">{isArabic ? 'السابق' : 'Back'}</button>}{step < 2 ? <button type="button" onClick={nextStep} className="min-h-12 bg-brand-700 px-6 font-semibold text-white">{isArabic ? 'التالي' : 'Next'}</button> : <button type="submit" disabled={status === 'sending'} className="inline-flex min-h-12 items-center justify-center bg-brand-700 px-6 font-semibold text-white disabled:opacity-60">{status === 'sending' ? copy.sending : copy.submit}</button>}</div>
        </form>
      </div>
    </section>
  );
}
