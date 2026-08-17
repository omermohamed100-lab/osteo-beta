'use client';

import { useRef, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import Link from '@/components/i18n/LocalizedLink';

type FieldErrors = { name?: string; email?: string; message?: string };

export default function ContactPage() {
  const { isArabic } = useLanguage();
  const copy = isArabic
    ? {
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        message: 'الرسالة',
        nameError: 'يرجى إدخال الاسم (حرفان على الأقل).',
        emailError: 'يرجى إدخال بريد إلكتروني صحيح.',
        messageError: 'يجب ألا تقل الرسالة عن 10 أحرف.',
        errorSummary: 'يرجى تصحيح الحقول التالية:',
        genericError: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        networkError: 'تعذر الاتصال. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.',
        sentTitle: 'تم استلام رسالتك',
        sentBody: 'شكرًا لتواصلك معنا. تم استلام رسالتك وسيراجعها فريقنا في أقرب وقت ممكن.',
        another: 'إرسال رسالة أخرى',
        sending: 'جارٍ الإرسال…',
        send: 'إرسال الرسالة',
        privacyPrefix: 'باستخدام هذا النموذج، فإنك تقر بأن الجمعية ستتعامل مع معلوماتك وفق ',
        privacyLink: 'إشعار الخصوصية',
        privacySuffix: '.',
      }
    : {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        nameError: 'Please enter your name (at least 2 characters).',
        emailError: 'Please enter a valid email address.',
        messageError: 'Message must be at least 10 characters.',
        errorSummary: 'Please correct the following fields:',
        genericError: 'Something went wrong. Please try again.',
        networkError: 'Network error. Please check your connection and try again.',
        sentTitle: 'Message received',
        sentBody: 'Thank you for contacting us. Your message was received and will be reviewed by our team.',
        another: 'Send another message',
        sending: 'Sending…',
        send: 'Send Message',
        privacyPrefix: 'By using this form, you acknowledge that EGSOM will handle your information as described in the ',
        privacyLink: 'privacy notice',
        privacySuffix: '.',
      };

  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const set = (patch: Partial<typeof form>) => setForm((p) => ({ ...p, ...patch }));

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) errors.name = copy.nameError;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = copy.emailError;
    if (!form.message.trim() || form.message.trim().length < 10) errors.message = copy.messageError;
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      window.requestAnimationFrame(() => {
        if (errors.name) nameRef.current?.focus();
        else if (errors.email) emailRef.current?.focus();
        else messageRef.current?.focus();
      });
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '', website: '' });
        setFieldErrors({});
      } else {
        const data = await res.json();
        setServerError(
          isArabic ? copy.genericError : data.error || copy.genericError,
        );
        setStatus('error');
      }
    } catch {
      setServerError(copy.networkError);
      setStatus('error');
    }
  };

  const inputCls = (field: keyof FieldErrors) =>
    `mt-1 block w-full rounded-lg bg-[rgb(252,254,255)] p-3 border text-base shadow-sm focus:outline-none focus:ring-2 ${
      fieldErrors[field]
        ? 'border-red-400 focus:ring-red-300'
        : 'border-gray-300 focus:border-brand-500 focus:ring-brand-300'
    }`;

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Get in Touch"
        eyebrowAr="تواصل معنا"
        title="Contact Us"
        titleAr="تواصل معنا"
        subtitle="Have questions about membership, upcoming courses, or osteopathic medicine in Egypt? We'd love to hear from you."
        subtitleAr="هل لديك أسئلة حول العضوية أو الدورات القادمة أو الطب الأوستيوباثي في مصر؟ يسعدنا تواصلك معنا."
      />
      <div className="bg-slate-50/70 py-8 sm:py-11">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="surface-panel p-6 sm:p-9">

          {status === 'success' ? (
            <div role="status" className="space-y-2 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
              <p className="text-green-800 font-semibold text-lg">{copy.sentTitle}</p>
              <p className="text-green-700 text-sm">{copy.sentBody}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-3 text-sm text-green-700 underline hover:text-green-900"
              >
                {copy.another}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) => set({ website: event.target.value })}
                />
              </div>
              {Object.keys(fieldErrors).length > 0 && (
                <div
                  id="contact-error-summary"
                  role="alert"
                  aria-atomic="true"
                  className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                  <p className="font-semibold">{copy.errorSummary}</p>
                  <ul className="mt-2 list-disc space-y-1 ps-5">
                    {fieldErrors.name && <li><a className="underline underline-offset-2" href="#name">{fieldErrors.name}</a></li>}
                    {fieldErrors.email && <li><a className="underline underline-offset-2" href="#email">{fieldErrors.email}</a></li>}
                    {fieldErrors.message && <li><a className="underline underline-offset-2" href="#message">{fieldErrors.message}</a></li>}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">{copy.name}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    ref={nameRef}
                    dir="auto"
                    autoComplete="name"
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => { set({ name: e.target.value }); setFieldErrors((p) => ({ ...p, name: undefined })); }}
                    className={inputCls('name')}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  />
                  {fieldErrors.name && <p id="name-error" className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">{copy.email}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    ref={emailRef}
                    dir="ltr"
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(e) => { set({ email: e.target.value }); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                    className={`${inputCls('email')} font-sans`}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  />
                  {fieldErrors.email && <p id="email-error" className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">{copy.message}</label>
                <textarea
                  id="message"
                  name="message"
                  ref={messageRef}
                  dir="auto"
                  rows={4}
                  maxLength={5000}
                  value={form.message}
                  onChange={(e) => { set({ message: e.target.value }); setFieldErrors((p) => ({ ...p, message: undefined })); }}
                  className={inputCls('message')}
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                />
                {fieldErrors.message && <p id="message-error" className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>}
              </div>

              {serverError && (
                <p role="alert" aria-atomic="true" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{serverError}</p>
              )}

              <p className="text-sm leading-relaxed text-ink-muted">
                {copy.privacyPrefix}
                <Link href="/privacy" className="font-medium text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950 focus-visible:ring-2 focus-visible:ring-brand-600">
                  {copy.privacyLink}
                </Link>
                {copy.privacySuffix}
              </p>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex justify-center rounded-lg border border-transparent bg-brand-700 px-6 py-3 text-base font-semibold tracking-[0.01em] text-white shadow-sm transition-[background-color,transform] duration-150 hover:bg-brand-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? copy.sending : copy.send}
              </button>
            </form>
          )}

        </div>
      </div>
      </div>
    </div>
  );
}
