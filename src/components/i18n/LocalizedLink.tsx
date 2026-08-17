'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

type LocalizedLinkProps = ComponentProps<typeof Link>;

export default function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const { localizedHref } = useLanguage();
  const localized = typeof href === 'string' ? localizedHref(href) : href;

  return <Link href={localized} {...props} />;
}
