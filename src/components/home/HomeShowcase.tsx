'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LocalizedText from '@/components/i18n/LocalizedText';

function PersonIcon() {
  return (
    <svg viewBox="0 0 48 58" className="path-icon" fill="none" aria-hidden="true">
      <circle cx="24" cy="11" r="8.5" />
      <path d="M11 35.5C11 27.5 16.4 22 24 22s13 5.5 13 13.5V48H11V35.5Z" />
      <path d="M24 31v17" />
    </svg>
  );
}

function GraduateIcon() {
  return (
    <svg viewBox="0 0 64 48" className="path-icon path-icon--wide" fill="none" aria-hidden="true">
      <path d="M3 15.5 32 3l29 12.5L32 28 3 15.5Z" />
      <path d="M14.5 21v14.5C24 42 40 42 49.5 35.5V21" />
      <path d="M5 17.5V35m0 0-2.5 7h5L5 35Z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 64 52" className="path-icon path-icon--wide" fill="none" aria-hidden="true">
      <rect x="4" y="14" width="56" height="34" rx="3" />
      <path d="M23 14V8.5A4.5 4.5 0 0 1 27.5 4h9A4.5 4.5 0 0 1 41 8.5V14" />
      <path d="M4 27c14 8 42 8 56 0M27 29h10v7H27z" />
    </svg>
  );
}

function HandsArtwork() {
  return (
    <Image
      src="/path-care-hands.png"
      alt=""
      width={1536}
      height={1024}
      unoptimized
      className="path-artwork path-care-hands-raster"
      aria-hidden="true"
    />
  );
}

function StudyPillarArtwork() {
  return (
    <Image
      src="/path-study-pillar-v2.webp"
      alt=""
      width={1536}
      height={1024}
      unoptimized
      className="path-artwork path-column-raster"
      aria-hidden="true"
    />
  );
}

function ClosingEmblemArtwork() {
  return (
    <span
      className="closing-logo-emblem"
      style={{
        display: 'block',
        aspectRatio: '1',
        backgroundColor: 'oklch(66% 0.103 80)',
        WebkitMask: "url('/closing-emblem-ankh-two-snakes.png') center / 210% no-repeat",
        mask: "url('/closing-emblem-ankh-two-snakes.png') center / 210% no-repeat",
        opacity: 0.88,
      }}
      aria-hidden="true"
    />
  );
}

function PractitionerEmblemArtwork() {
  return (
    <Image
      src="/path-practitioner-emblem.png"
      alt=""
      width={1254}
      height={1254}
      unoptimized
      className="path-artwork path-logo-emblem path-practitioner-emblem"
      aria-hidden="true"
    />
  );
}

function EgyptSkylineArtwork() {
  return (
    <span
      className="closing-skyline"
      style={{
        display: 'block',
        aspectRatio: '2040 / 771',
        backgroundColor: 'oklch(66% 0.103 80)',
        WebkitMask: "url('/closing-egypt-skyline-gold.png') center bottom / contain no-repeat",
        mask: "url('/closing-egypt-skyline-gold.png') center bottom / contain no-repeat",
        opacity: 0.72,
      }}
      aria-hidden="true"
    />
  );
}

const PATHS = [
  {
    href: '/find-osteopath',
    title: 'I need care',
    titleAr: 'أحتاج إلى رعاية',
    body: 'Find trusted osteopathic care and learn how osteopathy can help you.',
    bodyAr: 'اعثر على رعاية أوستيوباثية موثوقة وتعرّف على كيف يمكنها مساعدتك.',
    action: 'Find a qualified osteopath',
    actionAr: 'ابحث عن ممارس مؤهل',
    tone: 'dark',
    icon: PersonIcon,
    artwork: HandsArtwork,
  },
  {
    href: '/courses',
    title: 'I want to study',
    titleAr: 'أرغب في الدراسة',
    body: 'Explore accredited education pathways and build a career in osteopathy.',
    bodyAr: 'استكشف مسارات التعليم المعتمدة وابنِ مسيرة مهنية في الأوستيوباثي.',
    action: 'View education and training',
    actionAr: 'استكشف التعليم والتدريب',
    tone: 'light',
    icon: GraduateIcon,
    artwork: StudyPillarArtwork,
  },
  {
    href: '/contact',
    title: 'I am a practitioner',
    titleAr: 'أنا ممارس',
    body: 'Access professional resources, standards, and opportunities to grow your practice.',
    bodyAr: 'تعرّف على الموارد والمعايير والفرص المهنية لتطوير ممارستك.',
    action: 'Go to practitioner resources',
    actionAr: 'انتقل إلى موارد الممارسين',
    tone: 'dark',
    icon: BriefcaseIcon,
    artwork: PractitionerEmblemArtwork,
  },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export function PathwaysShowcase() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section ref={ref} className={`pathways-section bg-paper py-16 sm:py-24 lg:py-28 ${visible ? 'is-visible' : ''}`} aria-labelledby="choose-path">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="path-heading-lockup mx-auto mb-9 max-w-2xl text-center sm:mb-14">
          <div className="mb-5 flex items-center justify-center gap-4 text-gold-deep" aria-hidden="true">
            <span className="h-px w-20 bg-gold/70" />
            <span className="text-xl leading-none">✦</span>
            <span className="h-px w-20 bg-gold/70" />
          </div>
          <h2 id="choose-path" className="text-balance text-[clamp(2.85rem,5vw,5.1rem)] font-medium leading-[0.96] tracking-[-0.048em] text-brand-950">
            <LocalizedText en="Choose your path" ar="اختر مسارك" />
          </h2>
        </div>

        <div className="pathways-grid grid overflow-hidden border border-brand-950/18 lg:grid-cols-3">
          {PATHS.map((path, index) => {
            const Icon = path.icon;
            const Artwork = path.artwork;

            return (
              <Link
                key={path.title}
                href={path.href}
                style={{ '--path-index': index } as CSSProperties}
                className={`path-panel path-panel--${path.tone} group relative flex min-h-[27rem] flex-col overflow-hidden border-b border-brand-950/18 px-6 pb-7 pt-8 outline-none last:border-b-0 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold sm:min-h-[32rem] sm:px-10 sm:pb-10 sm:pt-10 lg:h-[35.5rem] lg:min-h-0 lg:border-b-0 lg:border-e lg:last:border-e-0`}
              >
                <div className="path-panel-content relative z-10">
                  <Icon />
                  <h3 className="mt-7 font-display text-[clamp(2.1rem,2.75vw,2.75rem)] font-medium leading-[1] tracking-[-0.025em]">
                    <LocalizedText en={path.title} ar={path.titleAr} />
                  </h3>
                  <span className="mt-5 block h-px w-11 bg-gold" aria-hidden="true" />
                  <p className="mt-6 max-w-[19rem] text-[0.94rem] leading-7">
                    <LocalizedText en={path.body} ar={path.bodyAr} />
                  </p>
                </div>

                <span className={`path-panel-action relative z-20 mt-auto inline-flex items-center gap-3 pt-8 text-[0.88rem] font-semibold sm:pt-10 lg:pt-12 ${path.tone === 'light' ? 'lg:mt-16' : 'mb-10 sm:mb-16'}`}>
                  <LocalizedText en={path.action} ar={path.actionAr} />
                  <span className="path-arrow" aria-hidden="true">→</span>
                </span>
                <Artwork />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ClosingStatement() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section ref={ref} className={`closing-section relative z-20 -mt-10 bg-transparent pb-20 sm:pb-24 lg:-mt-14 lg:pb-28 ${visible ? 'is-visible' : ''}`}>
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12 xl:px-16 min-[2200px]:max-w-[120rem] min-[2200px]:px-20">
        <Link href="/about" className="closing-statement group relative grid min-h-[22rem] w-full overflow-hidden px-7 py-8 text-center text-bone outline-none sm:min-h-[21rem] sm:px-10 md:min-h-[17rem] md:grid-cols-[7rem_minmax(15rem,0.9fr)_1.1fr] md:items-center md:gap-7 md:px-8 md:py-6 md:text-start lg:min-h-[14rem] lg:grid-cols-[8rem_minmax(21rem,1fr)_minmax(17rem,1.15fr)] lg:gap-10 lg:px-12 lg:py-6 xl:grid-cols-[8rem_minmax(28rem,1fr)_minmax(24rem,1.05fr)] xl:px-14 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-paper">
        <ClosingEmblemArtwork />
        <div className="closing-copy relative z-10 mt-4 md:mt-0">
          <h2 className="font-display text-[clamp(2.25rem,3.25vw,3.45rem)] font-medium leading-[1.02] tracking-[-0.025em] max-md:text-[clamp(2rem,9vw,2.45rem)] max-md:leading-[1.04] lg:text-[clamp(2.25rem,3vw,3.3rem)]">
            <span className="block lg:whitespace-nowrap"><LocalizedText en="Osteopathy for people." ar="الأوستيوباثي للناس." /></span>
            <span className="block lg:whitespace-nowrap"><LocalizedText en="A profession for Egypt." ar="ومهنة من أجل مصر." /></span>
          </h2>
          <span className="mx-auto mt-4 block h-px w-16 bg-gold md:mx-0" aria-hidden="true" />
          <span className="closing-action mt-4 inline-flex items-center justify-center gap-3 text-sm font-semibold md:justify-start">
            <LocalizedText en="Discover our vision and mission" ar="اكتشف رؤيتنا ورسالتنا" />
            <span className="path-arrow" aria-hidden="true">→</span>
          </span>
        </div>
        <EgyptSkylineArtwork />
        </Link>
      </div>
    </section>
  );
}
