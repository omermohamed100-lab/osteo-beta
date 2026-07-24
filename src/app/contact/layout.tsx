import { getLocalizedMetadata } from '@/lib/localized-metadata';

export async function generateMetadata() {
  return getLocalizedMetadata('/contact');
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
