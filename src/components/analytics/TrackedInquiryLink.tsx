'use client';

import type { ComponentProps } from 'react';
import Link from '@/components/i18n/LocalizedLink';
import { educationInquiryProperties, safeTrack } from '@/lib/conversion-analytics';
import type { InquiryType } from '@/lib/inquiry-context';

export default function TrackedInquiryLink({
  inquiryType,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { inquiryType: InquiryType }) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        safeTrack('education_interest_click', educationInquiryProperties(inquiryType));
        onClick?.(event);
      }}
    />
  );
}
