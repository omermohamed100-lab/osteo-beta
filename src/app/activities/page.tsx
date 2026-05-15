import type { Metadata } from 'next';
import type { Activity } from '@prisma/client';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
import PageHeader from '@/components/layout/PageHeader';

export const metadata: Metadata = {
  title: 'Activities & Events',
  description: 'Upcoming workshops, seminars, and community events from the Egyptian Society of Osteopathic Medicine.',
};

export default async function ActivitiesPage() {
  const activities = await db.activity.findMany({
    where: { isActive: true },
    orderBy: { date: 'desc' },
  });

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Events"
        title="Activities & Events"
        subtitle="Stay engaged with the osteopathic community through seminars, annual conferences, and community outreach programs."
      />

      <div className="bg-slate-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {activities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-medium">No upcoming activities at the moment.</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {activities.map((activity: Activity) => (
                <div key={activity.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow duration-200">
                  {activity.imageUrl ? (
                    <img
                      src={activity.imageUrl}
                      alt={activity.title}
                      className="w-full sm:w-52 h-44 sm:h-auto object-cover shrink-0"
                    />
                  ) : (
                    <div className="hidden sm:flex w-52 bg-brand-950 items-center justify-center shrink-0">
                      <svg className="w-8 h-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5 sm:p-7 flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                        {new Date(activity.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-lg mb-2 leading-snug">{activity.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{activity.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {activity.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
