import {
  ArrowUpRight,
  BookOpenText,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import Link from '@/components/i18n/LocalizedLink';
import HeroVisual from '@/components/home/HeroVisual';
import { ClosingStatement, PathwaysShowcase } from '@/components/home/HomeShowcase';
import LocalizedText from '@/components/i18n/LocalizedText';

const STANDARDS = [
  {
    icon: ShieldCheck,
    title: 'Standards and regulation',
    titleAr: 'المعايير والتنظيم',
    body: 'Promoting clear standards for safe, ethical, and effective osteopathic care.',
    bodyAr: 'تعزيز معايير واضحة لرعاية أوستيوباثية آمنة وأخلاقية وفعّالة.',
  },
  {
    icon: UsersRound,
    title: 'Leadership and representation',
    titleAr: 'القيادة والتمثيل',
    body: 'Representing the profession and advancing osteopathy in Egypt and the region.',
    bodyAr: 'تمثيل المهنة ودعم تطور الأوستيوباثي في مصر والمنطقة.',
  },
  {
    icon: BookOpenText,
    title: 'Education and professional development',
    titleAr: 'التعليم والتطوير المهني',
    body: 'Supporting structured education and lifelong learning for practitioners.',
    bodyAr: 'دعم التعليم المنظم والتعلم المستمر للممارسين.',
  },
];

export default function Home() {
  return (
    <div className="home-concept flex flex-col bg-bone text-ink">
      <section className="hero-stage relative isolate overflow-hidden border-b border-brand-950/10">
        <div className="hero-architecture" aria-hidden="true" />
        <div className="mx-auto grid min-h-0 max-w-[90rem] items-stretch px-5 sm:px-8 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-12 lg:px-12 xl:min-h-[calc(100svh-6rem)] xl:px-16 min-[2200px]:min-h-[min(calc(100svh-6rem),60rem)] min-[2200px]:max-w-[120rem] min-[2200px]:px-20">
          <div className="hero-copy-reveal relative z-20 flex flex-col justify-center py-8 min-[375px]:py-10 sm:py-16 lg:col-span-6 lg:pe-12 lg:py-16 xl:col-span-5 xl:pe-8">
            <h1 className="max-w-[14ch] text-balance font-sans text-[clamp(2.5rem,11vw,3.65rem)] font-medium leading-[1.01] tracking-[-0.048em] text-brand-950 sm:text-[clamp(3rem,4.25vw,4.65rem)]">
              <LocalizedText
                en="Care, education and standards for osteopathy in Egypt"
                ar="رعاية وتعليم ومعايير للأوستيوباثي في مصر"
              />
            </h1>

            <span className="mt-6 h-0.5 w-20 bg-gold sm:mt-7" aria-hidden="true" />

            <p className="mt-6 max-w-[32rem] text-pretty text-[0.96rem] leading-7 text-ink-muted sm:text-base sm:leading-7">
              <LocalizedText
                en="EGSOM supports responsible osteopathic practice through education, professional standards, and clear information for practitioners and the public."
                ar="تدعم الجمعية الممارسة المسؤولة للأوستيوباثي من خلال التعليم والمعايير المهنية والمعلومات الواضحة للممارسين والجمهور."
              />
            </p>

            <div className="mt-7 flex max-w-[21rem] flex-col gap-3 sm:mt-8">
              <Link
                href="/find-osteopath"
                className="group inline-flex min-h-13 items-center justify-between gap-5 bg-brand-950 px-6 py-3.5 text-sm font-semibold text-bone outline-none transition-[background-color,transform] duration-200 ease-out hover:bg-brand-800 active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
              >
                <LocalizedText en="Browse practitioner profiles" ar="تصفّح ملفات الممارسين" />
                <ArrowUpRight className="interactive-arrow rtl-flip h-4 w-4 text-gold" aria-hidden="true" />
              </Link>
              <Link
                href="/courses"
                className="group inline-flex min-h-13 items-center justify-between gap-5 border border-brand-950/55 bg-bone/82 px-6 py-3.5 text-sm font-semibold text-brand-950 outline-none transition-[background-color,border-color,transform] duration-200 ease-out hover:border-brand-950 hover:bg-paper active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
              >
                <LocalizedText en="View education and training" ar="استكشف التعليم والتدريب" />
                <ArrowUpRight className="interactive-arrow rtl-flip h-4 w-4 text-gold-deep" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="hero-visual-column relative min-h-[19rem] min-[375px]:min-h-[23rem] sm:min-h-[34rem] lg:col-span-6 lg:min-h-0 xl:col-span-7">
            <div className="hero-stone-disc" aria-hidden="true" />
            <HeroVisual />
          </div>
        </div>
      </section>

      <PathwaysShowcase />

      <section id="standards" className="bg-bone py-16 sm:py-24 lg:py-32" aria-labelledby="standards-heading">
        <div className="mx-auto grid max-w-[82rem] gap-10 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20 lg:px-12">
          <div className="lg:py-4">
            <h2 id="standards-heading" className="max-w-[13ch] font-display text-[clamp(2.8rem,4.5vw,5rem)] font-medium leading-[0.98] tracking-[-0.03em] text-brand-950">
              <LocalizedText en="Rooted in standards." ar="راسخون في المعايير." />
              <span className="mt-1 block italic text-gold-deep">
                <LocalizedText en="Committed to patients." ar="ملتزمون بالمرضى." />
              </span>
            </h2>
            <p className="mt-8 max-w-[32rem] text-base leading-8 text-ink-muted">
              <LocalizedText
                en="We support high standards in osteopathic practice, education, and professional conduct to protect the public and advance the profession in Egypt."
                ar="ندعم معايير رفيعة في الممارسة والتعليم والسلوك المهني لحماية الجمهور وتطوير المهنة في مصر."
              />
            </p>
            <Link href="/about" className="group mt-9 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-brand-950 outline-none transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-bone">
              <LocalizedText en="Learn more about EGSOM" ar="تعرّف أكثر على الجمعية" />
              <ArrowUpRight className="interactive-arrow rtl-flip h-4 w-4 text-gold-deep" aria-hidden="true" />
            </Link>
          </div>

          <div className="standards-list mt-2 border-t border-brand-950/18 pt-7 lg:mt-0 lg:border-s lg:border-t-0 lg:pt-8 lg:ps-16">
            {STANDARDS.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-brand-950/14 py-6 first:pt-0 sm:grid-cols-[4.5rem_1fr] sm:gap-5 sm:py-8 lg:py-9 lg:first:pt-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/65 text-gold-deep sm:h-14 sm:w-14 lg:self-center">
                    <Icon className="h-5 w-5 stroke-[1.35] sm:h-6 sm:w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-brand-950 sm:text-xl">
                      <LocalizedText en={item.title} ar={item.titleAr} />
                    </h3>
                    <p className="mt-2 max-w-[36rem] text-sm leading-7 text-ink-muted sm:text-[0.98rem]">
                      <LocalizedText en={item.body} ar={item.bodyAr} />
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <ClosingStatement />
    </div>
  );
}
