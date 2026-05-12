import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find an Osteopath',
  description: 'Search EGSOM\'s directory of certified osteopathic practitioners across Egypt and the Middle East by specialty, city, and country.',
};

export default function FindOsteopathLayout({ children }: { children: React.ReactNode }) {
  return children;
}
