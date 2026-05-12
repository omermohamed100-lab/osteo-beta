import Link from 'next/link';
import AnimatedBoxes from '@/components/home/AnimatedBoxes';

const TICKER_WORDS = [
  'Osteopathic Medicine', 'Egypt', 'Education', 'Research',
  'Excellence', 'Cairo', 'Middle East', 'Healthcare', 'Training', 'Certification',
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
      <section className="relative bg-brand-950 text-white overflow-hidden min-h-[80vh] md:min-h-[88vh] flex flex-col justify-center">

        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '36px 36px' }}
        />

        {/* Diagonal accent line */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-14 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left — headline block */}
            <div className="lg:col-span-8">

              {/* Eyebrow */}
              <div className="hero-delay-1 flex items-center gap-3 mb-6 sm:mb-10">
                <div className="h-px w-10 bg-gold" />
                <span className="text-gold text-[11px] font-medium tracking-[0.35em] uppercase">
                  Egyptian Society of Osteopathic Medicine · Cairo
                </span>
              </div>

              {/* Display headline */}
              <h1 className="hero-delay-2 font-display leading-[0.92] sm:leading-[0.88] tracking-tight mb-6 sm:mb-8">
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

              <p className="hero-delay-3 font-display text-[clamp(1.1rem,2.5vw,1.75rem)] font-light text-brand-300/70 italic mb-3 sm:mb-4">
                in Egypt &amp; the Middle East
              </p>

              <p className="hero-delay-4 text-brand-200/60 text-sm sm:text-base max-w-lg mb-8 sm:mb-12 leading-relaxed">
                Dedicated to promoting excellence in osteopathic education, practice,
                and research, building a healthier future across the region.
              </p>

              {/* CTAs */}
              <div className="hero-delay-5 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-brand-900 text-xs sm:text-sm font-semibold tracking-widest uppercase hover:bg-gold hover:text-white transition-colors duration-300"
                >
                  Explore Courses
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/find-osteopath"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 border border-white/20 text-white text-xs sm:text-sm font-medium tracking-widest uppercase hover:border-white/60 hover:bg-white/5 transition-colors duration-300"
                >
                  Find an Osteopath
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-white/70 text-xs sm:text-sm font-medium tracking-widest uppercase hover:text-gold transition-colors duration-300"
                >
                  For Practitioners
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right — flagship figure */}
            <div className="hero-delay-3 lg:col-span-4 lg:border-l border-white/10 lg:pl-10">
              <div className="border-t border-white/10 pt-5">
                <div className="font-display text-[clamp(3.5rem,6vw,5rem)] font-semibold leading-none text-gold">
                  500<span className="text-gold/60">+</span>
                </div>
                <div className="mt-3 text-brand-200/70 text-sm leading-relaxed max-w-[18rem]">
                  Registered practitioners across <span className="text-white">Egypt and 15 countries</span> of the Middle East and North Africa.
                </div>
                <div className="mt-6 flex items-center gap-3 text-brand-300/50 text-[10px] font-medium tracking-[0.3em] uppercase">
                  <span>Since 2009</span>
                  <span className="h-px w-6 bg-white/20" />
                  <span>16 Countries</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      {/* ── Scrolling ticker ─────────────────────────────────────────────── */}
      <div className="bg-brand-600 py-[11px] overflow-hidden border-y border-brand-700">
        <div className="flex animate-ticker whitespace-nowrap select-none">
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
