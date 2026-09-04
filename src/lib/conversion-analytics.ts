'use client';

import { track } from '@vercel/analytics';
import type { InquiryType } from '@/lib/inquiry-context';

const trackedSessionKeys = new Set<string>();

export function safeTrack(
  event: 'practitioner_profile_view' | 'practitioner_phone_click' | 'practitioner_email_click' | 'education_interest_click' | 'education_interest_received' | 'education_inquiry_received' | 'practitioner_application_start' | 'practitioner_application_complete',
  properties?: Record<string, string>,
) {
  try {
    track(event, properties);
  } catch {
    // Analytics must never interrupt navigation, contact, or application flows.
  }
}

export function trackOncePerSession(
  key: string,
  event: Parameters<typeof safeTrack>[0],
  properties?: Record<string, string>,
) {
  if (trackedSessionKeys.has(key)) return;
  try {
    const storageKey = `egsom-analytics:${key}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, '1');
    trackedSessionKeys.add(key);
    safeTrack(event, properties);
  } catch {
    trackedSessionKeys.add(key);
    safeTrack(event, properties);
  }
}

export const educationInquiryProperties = (type: InquiryType) => ({
  inquiry_type: type,
});
