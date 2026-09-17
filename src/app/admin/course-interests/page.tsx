'use client';

import AdminPagination from '@/components/admin/AdminPagination';
import { useAdminPage } from '@/components/admin/useAdminPage';

type Interest = { id: string; email: string; topic: string; notificationStatus: string; createdAt: string };

export default function CourseInterestsPage() {
  const page = useAdminPage<Interest>('/api/course-interests');
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900">Course interests</h1>
      <p className="mt-2 text-sm text-slate-600">Notification requests received from the public courses page.</p>
      <AdminPagination {...page} />
      {page.error && <p role="alert" className="my-6 text-red-700">{page.error} <button onClick={page.refresh} className="min-h-11 px-2 font-semibold underline">Try again</button></p>}
      {!page.isLoading && !page.error && page.items.length === 0 && <p className="mt-6 text-slate-500">No requests on this page.</p>}
      <div className="mt-6 divide-y divide-slate-200">
        {page.items.map((item) => (
          <article key={item.id} className="py-4">
            <div className="flex flex-wrap justify-between gap-2">
              <a className="break-all font-semibold text-brand-800 underline" href={`mailto:${item.email}`}>{item.email}</a>
              <time className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</time>
            </div>
            <p className="mt-2 break-words text-sm text-slate-700">Topic: {item.topic || 'Not provided'}</p>
            <p className="mt-1 text-xs text-slate-500">Admin notification: {item.notificationStatus}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
