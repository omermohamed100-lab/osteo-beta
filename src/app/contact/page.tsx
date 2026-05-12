'use client';

import Link from 'next/link';
import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';

type FieldErrors = { name?: string; email?: string; message?: string };

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');

  const set = (patch: Partial<typeof form>) => setForm((p) => ({ ...p, ...patch }));

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email address.';
    if (!form.message.trim() || form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setFieldErrors({});
      } else {
        const data = await res.json();
        setServerError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  const inputCls = (field: keyof FieldErrors) =>
    `mt-1 block w-full rounded-md shadow-sm p-3 border text-base focus:outline-none focus:ring-2 ${
      fieldErrors[field]
        ? 'border-red-400 focus:ring-red-300'
        : 'border-gray-300 focus:border-brand-500 focus:ring-brand-300'
    }`;

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Have questions about membership, upcoming courses, or osteopathic medicine in Egypt? We'd love to hear from you."
      />
      <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">

          {status === 'success' ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center space-y-2">
              <p className="text-green-800 font-semibold text-lg">Message sent!</p>
              <p className="text-green-700 text-sm">Thank you for reaching out. We&apos;ll get back to you as soon as possible.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-3 text-sm text-green-700 underline hover:text-green-900"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6 mt-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={(e) => { set({ name: e.target.value }); setFieldErrors((p) => ({ ...p, name: undefined })); }}
                    className={inputCls('name')}
                  />
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) => { set({ email: e.target.value }); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                    className={inputCls('email')}
                  />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => { set({ message: e.target.value }); setFieldErrors((p) => ({ ...p, message: undefined })); }}
                  className={inputCls('message')}
                />
                {fieldErrors.message && <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>}
              </div>

              {serverError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}

        </div>
      </div>
      </div>
    </div>
  );
}
