'use client';

import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function HeroTitle() {
  const { isArabic } = useLanguage();

  if (isArabic) {
    return (
      <h1
        lang="ar"
        dir="rtl"
        className="mb-7 font-arabic sm:mb-9"
      >
        <span className="block text-[clamp(2.25rem,5.2vw,4.75rem)] font-medium leading-[1.25] text-white/55">
          نرتقي
        </span>
        <span className="block text-[clamp(2.45rem,5.9vw,5.35rem)] font-semibold leading-[1.22] text-white">
          بالرعاية الصحية
        </span>
        <span className="block text-[clamp(2.25rem,5.4vw,4.9rem)] font-medium leading-[1.24] text-gold">
          الأوستيوباثية
        </span>
      </h1>
    );
  }

  return (
    <h1
      lang="en"
      dir="ltr"
      className="mb-6 font-display leading-[0.92] tracking-tight sm:mb-8 sm:leading-[0.88]"
    >
      <span className="block text-[clamp(2.25rem,7.5vw,6.5rem)] font-light italic text-white/50">
        Advancing
      </span>
      <span className="block text-[clamp(2.75rem,9vw,8rem)] font-semibold text-white">
        Osteopathic
      </span>
      <span className="block text-[clamp(2.25rem,7vw,6rem)] font-light italic text-gold">
        Healthcare
      </span>
    </h1>
  );
}
