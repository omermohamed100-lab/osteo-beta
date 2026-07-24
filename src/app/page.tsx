import Link from 'next/link';
import AnimatedBoxes from '@/components/home/AnimatedBoxes';
import HeroRemotion from '@/components/home/HeroRemotion';
import HeroTitle from '@/components/home/HeroTitle';
import LocalizedText from '@/components/i18n/LocalizedText';

const TICKER_WORDS = [
  { en: 'Osteopathic Medicine', ar: 'الطب الأوستيوباثي' },
  { en: 'Egypt', ar: 'مصر' },
  { en: 'Education', ar: 'التعليم' },
  { en: 'Research', ar: 'البحث العلمي' },
  { en: 'Excellence', ar: 'التميّز' },
  { en: 'Cairo', ar: 'القاهرة' },
  { en: 'Middle East', ar: 'الشرق الأوسط' },
  { en: 'Healthcare', ar: 'الرعاية الصحية' },
  { en: 'Training', ar: 'التدريب' },
  { en: 'Certification', ar: 'الاعتماد' },
];

const TRUST_FACTS = [
  { label: 'Established', labelAr: 'تأسست عام', value: '2009' },
  { label: 'Registered practitioners', labelAr: 'ممارسون مسجّلون', value: '500+' },
  { label: 'Countries represented', labelAr: 'دول ممثّلة', value: '16' },
];

const OSTEOPATHY_POINTS = [
  {
    title: 'Hands-on practice',
    titleAr: 'ممارسة علاجية يدوية',
    body: 'Osteopathy is a regulated, manual approach to healthcare. Practitioners use their hands to assess, treat, and prevent disorders of the musculoskeletal and related systems.',
    bodyAr: 'الطب الأوستيوباثي نهج علاجي يدوي منظّم. يستخدم الممارسون أيديهم لتقييم اضطرابات الجهاز العضلي الهيكلي والأنظمة المرتبطة به وعلاجها والوقاية منها.',
  },
  {
    title: 'Whole-body, evidence-led',
    titleAr: 'رؤية متكاملة قائمة على الدليل',
    body: 'Treatment considers the body as an integrated system. Modern osteopathic practice draws on anatomy, physiology, and a growing evidence base.',
    bodyAr: 'ينظر العلاج إلى الجسم بوصفه منظومة متكاملة، وتستند الممارسة الحديثة إلى علم التشريح ووظائف الأعضاء وقاعدة متنامية من الأدلة العلمية.',
  },
  {
    title: 'Patient-centred',
    titleAr: 'رعاية تتمحور حول المريض',
    body: 'Sessions begin with assessment and conversation. Care plans are tailored to the person, not the protocol.',
    bodyAr: 'تبدأ الجلسات بالتقييم والحوار، ثم تُصمَّم خطة الرعاية بما يناسب كل شخص لا وفق بروتوكول موحّد.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-grow">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100svh-6.5rem)] flex-col justify-center overflow-hidden bg-brand-950 text-white">
        {/* Quiet dot-grid texture from the original hero */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.92) 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div
          className="hero-atmosphere pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        <div className="container relative z-10 mx-auto px-4 py-12 sm:px-6 sm:py-16 md:py-10 lg:px-8">
          <div className="grid items-center gap-8 md:gap-5 lg:min-h-[calc(100svh-11.5rem)] lg:grid-cols-12 lg:gap-4">
            <div className="hero-copy-reveal relative z-20 lg:col-span-7">
              <div className="mb-7 flex items-center gap-3 sm:mb-9">
                <div className="h-px w-10 bg-gold" />
                <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-gold sm:text-[11px] sm:tracking-[0.35em]">
                  <LocalizedText
                    en="Egyptian Society of Osteopathic Medicine · Cairo"
                    ar="الجمعية المصرية لطب الأوستيوباثية · القاهرة"
                  />
                </span>
              </div>

              <HeroTitle />

              <p className="mb-3 font-display text-[clamp(1.2rem,2.2vw,1.75rem)] font-light italic text-brand-300/70 sm:mb-4">
                <LocalizedText en="in Egypt & the Middle East" ar="في مصر والشرق الأوسط" />
              </p>

              <p className="mb-8 max-w-lg text-sm leading-relaxed text-brand-200/75 sm:mb-10 sm:text-base">
                <LocalizedText
                  en="Dedicated to promoting excellence in osteopathic education, practice, and research, building a healthier future across the region."
                  ar="نكرّس جهودنا للارتقاء بالتعليم والممارسة والبحث في مجال الطب الأوستيوباثي، لبناء مستقبل صحي أفضل في المنطقة."
                />
              </p>

              <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-brand-900 transition-[background-color,color,transform] duration-200 hover:bg-gold hover:text-brand-950 active:scale-[0.97] sm:px-8 sm:py-4 sm:text-sm"
                >
                  <LocalizedText en="Explore Courses" ar="استكشف الدورات" />
                  <svg className="rtl-flip h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/find-osteopath"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-white transition-[background-color,border-color,transform] duration-200 hover:border-white/60 hover:bg-white/5 active:scale-[0.97] sm:px-8 sm:py-4 sm:text-sm"
                >
                  <LocalizedText en="Find an Osteopath" ar="ابحث عن ممارس أوستيوباثي" />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[24rem] sm:min-h-[34rem] md:min-h-[22rem] lg:col-span-5 lg:min-h-[calc(100svh-11.5rem)]">
              <div
                className="pointer-events-none absolute bottom-[13%] start-0 top-[13%] hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block"
                aria-hidden="true"
              />
              <HeroRemotion />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      </section>

      {/* ── Scrolling ticker ─────────────────────────────────────────────── */}
      <div className="ticker-strip overflow-hidden border-y border-brand-700 bg-brand-600 py-[11px]">
        <div className="flex animate-ticker select-none whitespace-nowrap" aria-hidden="true">
          {[0, 1].map((i) => (
            <span key={i} className="flex items-center pr-0">
              {TICKER_WORDS.map((word) => (
                <span key={word.en} className="inline-flex items-center gap-6 pe-6 text-white/75 text-[11px] font-medium tracking-[0.3em] uppercase">
                  <LocalizedText en={word.en} ar={word.ar} />
                  <span className="text-white/25 text-[8px]">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Verified trust markers ────────────────────────────────────────── */}
      <section className="border-b border-brand-800 bg-brand-900 text-white" aria-labelledby="egs-at-a-glance">
        <h2 id="egs-at-a-glance" className="sr-only">
          <LocalizedText en="EGSOM at a glance" ar="الجمعية في لمحة" />
        </h2>
        <dl className="container mx-auto grid max-w-6xl grid-cols-1 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {TRUST_FACTS.map((fact, index) => (
            <div
              key={fact.label}
              className={`flex items-baseline justify-between gap-4 border-white/10 py-5 sm:block sm:px-7 sm:py-7 ${
                index > 0 ? 'border-t sm:border-s sm:border-t-0' : ''
              }`}
            >
              <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-200/80">
                <LocalizedText en={fact.label} ar={fact.labelAr} />
              </dt>
              <dd className="font-display text-3xl font-semibold leading-none text-gold-light sm:mt-2 sm:text-4xl">
                <bdi
                  dir="ltr"
                  lang="en"
                  className="font-display-latin tabular-nums"
                >
                  {fact.value}
                </bdi>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── What is osteopathy? ───────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-brand-600" />
                <span className="text-brand-600 text-[11px] font-medium tracking-[0.35em] uppercase">
                  <LocalizedText en="New here?" ar="هل تزورنا للمرة الأولى؟" />
                </span>
              </div>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-light text-brand-950 leading-tight">
                <LocalizedText
                  en={<>What is <em>osteopathy</em>?</>}
                  ar="ما هو الطب الأوستيوباثي؟"
                />
              </h2>
              <p className="mt-5 text-gray-500 text-sm leading-relaxed max-w-sm">
                <LocalizedText
                  en="A short primer for patients, students, and clinicians who are new to the discipline."
                  ar="مقدمة موجزة للمرضى والطلاب والممارسين الصحيين الراغبين في التعرّف إلى هذا التخصص."
                />
              </p>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-3 gap-px bg-gray-100 border border-gray-100">
              {OSTEOPATHY_POINTS.map((point, i) => (
                <div key={point.title} className="bg-white p-6 sm:p-7 flex flex-col">
                  <span className="font-display text-brand-600 text-2xl font-semibold leading-none mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold text-brand-950 tracking-tight mb-2">
                    <LocalizedText en={point.title} ar={point.titleAr} />
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    <LocalizedText en={point.body} ar={point.bodyAr} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Discover section ─────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 sm:mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-brand-600" />
                <span className="text-brand-600 text-[11px] font-medium tracking-[0.35em] uppercase">
                  <LocalizedText en="What We Offer" ar="ما نقدمه" />
                </span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light text-brand-950 leading-tight">
                <LocalizedText
                  en={<>Discover <em>EGSOM</em></>}
                  ar="اكتشف الجمعية"
                />
              </h2>
            </div>
            <p className="hidden lg:block text-gray-400 max-w-xs text-sm leading-relaxed text-end">
              <LocalizedText
                en="Explore our initiatives, learn about our history, or find a certified practitioner near you."
                ar="استكشف مبادراتنا وتعرّف على تاريخنا أو ابحث عن ممارس معتمد بالقرب منك."
              />
            </p>
          </div>

          <AnimatedBoxes />
        </div>
      </section>

      {/* ── Mission quote ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-28 bg-brand-950 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '36px 36px' }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center relative z-10">
          <div className="font-display text-gold/30 text-[8rem] leading-none mb-[-2rem]">&ldquo;</div>
          <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-light italic text-brand-100 leading-relaxed">
            <LocalizedText
              en="Uniting practitioners, advancing education, and building a healthier future, one patient at a time."
              ar="نوحّد الممارسين، ونطوّر التعليم، ونبني مستقبلًا أكثر صحة، مريضًا تلو الآخر."
            />
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px w-14 bg-brand-700" />
            <span className="text-brand-500 text-[10px] font-medium tracking-[0.4em] uppercase">
              <LocalizedText en="EGSOM Mission" ar="رسالة الجمعية" />
            </span>
            <div className="h-px w-14 bg-brand-700" />
          </div>
          <div className="mt-10">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-gold text-sm font-medium tracking-widest uppercase hover:gap-3 transition-all duration-200"
            >
              <LocalizedText en="Our Story" ar="قصتنا" />
              <svg className="rtl-flip w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
