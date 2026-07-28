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
      className="mb-5 font-display leading-[0.92] tracking-[-0.02em] sm:mb-8 sm:leading-[0.88]"
    >
      <span className="block text-[clamp(1.95rem,9vw,2.45rem)] font-light italic text-white/58 sm:text-[clamp(3rem,7.5vw,6.5rem)]">
        Advancing
      </span>
      <span className="block text-[clamp(2.35rem,11vw,2.9rem)] font-semibold text-white sm:text-[clamp(3.25rem,9vw,8rem)]">
        Osteopathic
      </span>
      <span className="block text-[clamp(2rem,9vw,2.5rem)] font-light italic text-gold sm:text-[clamp(3rem,7vw,6rem)]">
        Healthcare
      </span>
    </h1>
  );
}
