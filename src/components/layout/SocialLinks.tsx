import type { SocialLink } from '@/lib/social-links';

const labels = {
  facebook: { en: 'Visit EGSOM on Facebook', ar: 'زيارة صفحة الجمعية على فيسبوك' },
  youtube: { en: 'Visit EGSOM on YouTube', ar: 'زيارة صفحة الجمعية على يوتيوب' },
  linkedin: { en: 'Visit EGSOM on LinkedIn', ar: 'زيارة صفحة الجمعية على لينكدإن' },
  x: { en: 'Visit EGSOM on X', ar: 'زيارة صفحة الجمعية على إكس' },
  whatsapp: { en: 'Contact EGSOM on WhatsApp', ar: 'التواصل مع الجمعية عبر واتساب' },
};

function Icon({ platform }: { platform: SocialLink['platform'] }) {
  if (platform === 'facebook') return <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9a1 1 0 0 1 1-1Z" />;
  if (platform === 'youtube') return <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />;
  if (platform === 'linkedin') return <><path d="M5 9h4v11H5zM7 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM11 9h4v1.6c.8-1.2 2.1-2 4-2 3.2 0 4 2.1 4 5v6.4h-4v-5.7c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V20H11V9Z" /></>;
  if (platform === 'x') return <path d="M18.8 3H22l-7 8 8.2 10H17l-4.9-6.1L6.8 21H3.6l7.5-8.6L3.2 3h6.4l4.4 5.5L18.8 3Zm-1.1 16h1.8L8.6 4.9H6.7L17.7 19Z" />;
  return <path d="M12.04 2a10 10 0 0 0-8.49 15.28L2 22l4.86-1.5A10 10 0 1 0 12.04 2Zm0 18.17a8.15 8.15 0 0 1-4.16-1.14l-.3-.18-2.88.89.94-2.8-.2-.3a8.16 8.16 0 1 1 6.6 3.53Zm4.47-5.98c-.24-.12-1.42-.7-1.64-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06a6.68 6.68 0 0 1-1.96-1.21 7.36 7.36 0 0 1-1.36-1.7c-.14-.24 0-.36.1-.48l.36-.42.18-.3c.06-.12.03-.22 0-.3l-.77-1.85c-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.5.58.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />;
}

export default function SocialLinks({ links, isArabic = false, compact = false }: { links: SocialLink[]; isArabic?: boolean; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'gap-3'}`}>
      {links.map((link) => (
        <a key={link.platform} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={labels[link.platform][isArabic ? 'ar' : 'en']} className={`inline-flex items-center justify-center rounded-full border outline-none transition-[color,border-color,background-color,transform] duration-150 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold ${compact ? 'h-8 w-8 border-brand-800 text-brand-200 hover:border-gold hover:text-gold' : 'h-11 w-11 border-brand-700 text-brand-300 hover:border-white/40 hover:text-white'} ${link.platform === 'whatsapp' ? 'text-[#25D366] hover:border-[#25D366] hover:text-[#25D366]' : ''}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={compact ? 'h-4 w-4' : 'h-5 w-5'}><Icon platform={link.platform} /></svg>
        </a>
      ))}
    </div>
  );
}
