import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Egyptian Society of Osteopathic Medicine about membership, courses, or osteopathic care.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
