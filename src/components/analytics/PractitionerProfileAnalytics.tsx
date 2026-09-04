'use client';

import { useEffect } from 'react';
import { safeTrack, trackOncePerSession } from '@/lib/conversion-analytics';

export default function PractitionerProfileAnalytics({
  profileId,
  phone,
  email,
}: {
  profileId: string;
  phone?: string;
  email?: string;
}) {
  useEffect(() => {
    trackOncePerSession(
      `practitioner-profile-view:${profileId}`,
      'practitioner_profile_view',
      { route_type: 'practitioner_profile' },
    );
  }, [profileId]);

  if (!phone && !email) return null;

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {phone && (
        <a
          href={`tel:${phone.replace(/[^+\d]/g, '')}`}
          dir="ltr"
          onClick={() => safeTrack('practitioner_phone_click', { surface: 'practitioner_profile' })}
          className="inline-flex min-h-11 items-center border border-brand-950/20 px-4 text-sm font-semibold text-brand-800 hover:border-brand-700"
        >
          {phone}
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          dir="ltr"
          onClick={() => safeTrack('practitioner_email_click', { surface: 'practitioner_profile' })}
          className="inline-flex min-h-11 items-center border border-brand-950/20 px-4 text-sm font-semibold text-brand-800 hover:border-brand-700"
        >
          {email}
        </a>
      )}
    </div>
  );
}
