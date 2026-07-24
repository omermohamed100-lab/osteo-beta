import Link from 'next/link';
import AnimatedBoxes from '@/components/home/AnimatedBoxes';
import HeroRemotion from '@/components/home/HeroRemotion';

const TICKER_WORDS = [
  'Osteopathic Medicine', 'Egypt', 'Education', 'Research',
  'Excellence', 'Cairo', 'Middle East', 'Healthcare', 'Training', 'Certification',
];

const TRUST_FACTS = [
  { label: 'Established', value: '2009' },
  { label: 'Registered practitioners', value: '500+' },
  { label: 'Countries represented', value: '16' },
];

const OSTEOPATHY_POINTS = [
  {
    title: 'Hands-on practice',
    body: 'Osteopathy is a regulated, manual approach to healthcare. Practitioners use their hands to assess, treat, and prevent disorders of the musculoskeletal and related systems.',
  },
  {
    title: 'Whole-body, evidence-led',
    body: 'Treatment considers the body as an integrated system. Modern osteopathic practice draws on anatomy, physiology, and a growing evidence base.',
  },
  {
    title: 'Patient-centred',
    body: 'Sessions begin with assessment and conversation. Care plans are tailored to the person, not the protocol.',
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
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle at 78% 48%, rgba(14, 165, 233, 0.11), transparent 32%), linear-gradient(90deg, rgba(8,47,73,0) 46%, rgba(3,105,161,0.08) 100%)',
          }}
        />

        <div className="container relative z-10 mx-auto px-4 py-12 sm:px-6 sm:py-16 md:py-10 lg:px-8">
          <div className="grid items-center gap-8 md:gap-5 lg:min-h-[calc(100svh-11.5rem)] lg:grid-cols-12 lg:gap-4">
            <div className="hero-copy-reveal relative z-20 lg:col-span-7">
              <div className="mb-7 flex items-center gap-3 sm:mb-9">
                <div className="h-px w-10 bg-gold" />
                <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-gold sm:text-[11px] sm:tracking-[0.35em]">
                  Egyptian Society of Osteopathic Medicine · Cairo
                </span>
              </div>

              <h1 className="mb-6 font-display leading-[0.92] tracking-tight sm:mb-8 sm:leading-[0.88]">
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

              <p className="mb-3 font-display text-[clamp(1.2rem,2.2vw,1.75rem)] font-light italic text-brand-300/70 sm:mb-4">
                in Egypt &amp; the Middle East
              </p>

              <p className="mb-8 max-w-lg text-sm leading-relaxed text-brand-200/75 sm:mb-10 sm:text-base">
                Dedicated to promoting excellence in osteopathic education, practice,
                and research, building a healthier future across the region.
              </p>

              <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-brand-900 transition-[background-color,color,transform] duration-200 hover:bg-gold hover:text-brand-950 active:scale-[0.97] sm:px-8 sm:py-4 sm:text-sm"
                >
                  Explore Courses
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/find-osteopath"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-white transition-[background-color,border-color,transform] duration-200 hover:border-white/60 hover:bg-white/5 active:scale-[0.97] sm:px-8 sm:py-4 sm:text-sm"
                >
                  Find an Osteopath
                </Link>
              </div>
            </div>

            <div className="relative min-h-[24rem] sm:min-h-[34rem] md:min-h-[22rem] lg:col-span-5 lg:min-h-[calc(100svh-11.5rem)]">
              <div
                className="pointer-events-none absolute bottom-[13%] left-0 top-[13%] hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block"
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
                <span key={word} className="inline-flex items-center gap-6 pr-6 text-white/75 text-[11px] font-medium tracking-[0.3em] uppercase">
                  {word}
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
          EGSOM at a glance
        </h2>
        <dl className="container mx-auto grid max-w-6xl grid-cols-1 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {TRUST_FACTS.map((fact, index) => (
            <div
              key={fact.label}
              className={`flex items-baseline justify-between gap-4 border-white/10 py-5 sm:block sm:px-7 sm:py-7 ${
                index > 0 ? 'border-t sm:border-l sm:border-t-0' : ''
              }`}
            >
              <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-200/80">
                {fact.label}
              </dt>
              <dd className="font-display text-3xl font-semibold leading-none text-gold-light sm:mt-2 sm:text-4xl">
                {fact.value}
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
                  New here?
                </span>
              </div>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-light text-brand-950 leading-tight">
                What is <em>osteopathy</em>?
              </h2>
              <p className="mt-5 text-gray-500 text-sm leading-relaxed max-w-sm">
                A short primer for patients, students, and clinicians who are new to the discipline.
              </p>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-3 gap-px bg-gray-100 border border-gray-100">
              {OSTEOPATHY_POINTS.map((point, i) => (
                <div key={point.title} className="bg-white p-6 sm:p-7 flex flex-col">
                  <span className="font-display text-brand-600 text-2xl font-semibold leading-none mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold text-brand-950 tracking-tight mb-2">
                    {point.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {point.body}
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
                  What We Offer
                </span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light text-brand-950 leading-tight">
                Discover <em>EGSOM</em>
              </h2>
            </div>
            <p className="hidden lg:block text-gray-400 max-w-xs text-sm leading-relaxed text-right">
              Explore our initiatives, learn about our history, or find a certified
              practitioner near you.
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
            Uniting practitioners, advancing education, and building a healthier
            future, one patient at a time.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px w-14 bg-brand-700" />
            <span className="text-brand-500 text-[10px] font-medium tracking-[0.4em] uppercase">EGSOM Mission</span>
            <div className="h-px w-14 bg-brand-700" />
          </div>
          <div className="mt-10">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-gold text-sm font-medium tracking-widest uppercase hover:gap-3 transition-all duration-200"
            >
              Our Story
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
