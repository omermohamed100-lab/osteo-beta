'use client';

import { useEffect, useState } from 'react';

type Interest = { id: string; email: string; topic: string; notificationStatus: string; createdAt: string };

export default function CourseInterestsPage() {
  const [items, setItems] = useState<Interest[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { fetch('/api/course-interests').then(async (response) => { if (!response.ok) throw new Error(); setItems(await response.json()); }).catch(() => setError('Course interests are temporarily unavailable.')); }, []);
  return <div className="p-6"><h1 className="text-2xl font-bold text-slate-900">Course interests</h1><p className="mt-2 text-sm text-slate-600">Notification requests received from the public courses page.</p>{error && <p role="alert" className="mt-6 text-red-700">{error}</p>} {!error && items.length === 0 && <p className="mt-6 text-slate-500">No requests received yet.</p>}<div className="mt-6 space-y-3">{items.map((item) => <article key={item.id} className="surface-panel p-4"><div className="flex flex-wrap justify-between gap-2"><a className="font-semibold text-brand-800 underline" href={`mailto:${item.email}`}>{item.email}</a><time className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</time></div><p className="mt-2 text-sm text-slate-700">Topic: {item.topic || 'Not provided'}</p><p className="mt-1 text-xs text-slate-500">Admin notification: {item.notificationStatus}</p></article>)}</div></div>;
}
