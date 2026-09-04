'use client';

import { FormEvent, useState } from 'react';
import Link from '@/components/i18n/LocalizedLink';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { safeTrack } from '@/lib/conversion-analytics';

export default function CourseInterestForm() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!consent) return setStatus('error');
    setStatus('sending');
    try {
      const response = await fetch('/api/course-interests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, topic, consentNotifications: consent, website: '' }) });
      if (!response.ok) return setStatus('error');
      setStatus('success');
      setEmail(''); setTopic(''); setConsent(false);
      safeTrack('education_interest_received', { surface: 'courses' });
    } catch { setStatus('error'); }
  }

  if (status === 'success') return (
    <div className="surface-panel mx-auto max-w-2xl p-6 text-center" role="status">
      <h2 className="text-lg font-bold text-brand-950">{ar ? 'تم استلام طلب الإشعار' : 'Notification request received'}</h2>
      <p className="mt-2 text-sm text-slate-600">{ar ? 'سنتواصل معك عبر البريد الإلكتروني عند نشر فرصة دورة جديدة. هذا ليس حجزًا أو تسجيلًا.' : 'We will email you when a new course opportunity is published. This is not a booking or enrollment.'}</p>
    </div>
  );

  return (
    <section className="surface-panel mx-auto max-w-2xl p-6 sm:p-8" aria-labelledby="course-interest-title">
      <h2 id="course-interest-title" className="text-xl font-bold text-brand-950">{ar ? 'أبلغني بالدورة القادمة' : 'Notify me about the next course'}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{ar ? 'تُظهر القوائم المنشورة تفاصيل الدورة ومواعيدها وتكلفتها عند توفرها. تسجيل اهتمامك لا يضمن القبول أو يحجز مكانًا.' : 'Published listings show course details, dates, and fees when available. Registering interest does not confirm eligibility or reserve a place.'}</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-sm font-medium text-slate-800">{ar ? 'البريد الإلكتروني' : 'Email'}<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }} className="mt-1 min-h-11 w-full border border-slate-300 bg-white px-3 outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-200" /></label>
        <label className="block text-sm font-medium text-slate-800">{ar ? 'موضوع مفضل (اختياري)' : 'Topic preference (optional)'}<input maxLength={120} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={ar ? 'مثال: ورش العمل التمهيدية' : 'For example: introductory workshops'} className="mt-1 min-h-11 w-full border border-slate-300 bg-white px-3 outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-200" /></label>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700"><input required type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setStatus('idle'); }} className="mt-1 h-4 w-4 accent-brand-800" /><span>{ar ? 'أوافق على استخدام EGSOM لبريدي الإلكتروني لإبلاغي بفرص الدورات المنشورة حديثًا، كما هو موضح في ' : 'I agree that EGSOM may use my email to notify me about newly published course opportunities, as described in the '}<Link href="/privacy" className="font-semibold text-brand-700 underline">{ar ? 'إشعار الخصوصية' : 'privacy notice'}</Link>.</span></label>
        {status === 'error' && <p role="alert" className="text-sm font-medium text-red-700">{ar ? 'تعذر إرسال الطلب. تحقق من البيانات وحاول مرة أخرى.' : 'We could not submit your request. Check the fields and try again.'}</p>}
        <button disabled={status === 'sending'} className="min-h-11 bg-brand-950 px-5 text-sm font-semibold text-bone hover:bg-brand-800 disabled:opacity-60">{status === 'sending' ? (ar ? 'جارٍ الإرسال…' : 'Submitting…') : (ar ? 'أبلغني' : 'Notify me')}</button>
      </form>
    </section>
  );
}
