import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { PUBLIC_PAGE_META, type SiteLanguage } from '@/lib/public-page-meta';

export async function getLocalizedMetadata(pathname: string): Promise<Metadata> {
  const cookieStore = await cookies();
  const language: SiteLanguage =
    cookieStore.get('egsom-language')?.value === 'ar' ? 'ar' : 'en';
  const pageMeta = PUBLIC_PAGE_META[pathname] ?? PUBLIC_PAGE_META['/'];
  const localizedMeta = pageMeta[language];

  return {
    title: { absolute: localizedMeta.title },
    description: localizedMeta.description,
  };
}
