import { getLocalizedMetadata } from '@/lib/localized-metadata';

export async function generateMetadata() {
  return getLocalizedMetadata('/find-osteopath');
}

export default function FindOsteopathLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
