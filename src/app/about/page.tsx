import Link from '@/components/i18n/LocalizedLink';
import PageHeader from '@/components/layout/PageHeader';
import LocalizedText from '@/components/i18n/LocalizedText';
import LocalizedDate from '@/components/i18n/LocalizedDate';
import { getLocalizedMetadata } from '@/lib/localized-metadata';
import { db } from '@/lib/db';
import { getPublicData } from '@/lib/public-data';

export async function generateMetadata() {
  return getLocalizedMetadata('/about');
}

const values = [
  {
    title: 'Excellence',
    titleAr: 'التميّز',
    desc: 'We support clear professional standards for osteopathic education and clinical practice.',
    descAr: 'ندعم معايير مهنية واضحة للتعليم والممارسة السريرية في الطب الأوستيوباثي.',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  },
  {
    title: 'Integration',
    titleAr: 'التكامل',
    desc: 'We work to embed osteopathic principles into Egypt\'s wider healthcare system, building bridges between disciplines for better patient outcomes.',
    descAr: 'نعمل على دمج مبادئ الطب الأوستيوباثي في منظومة الرعاية الصحية المصرية وبناء جسور بين التخصصات لتحقيق نتائج أفضل للمرضى.',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  },
  {
    title: 'Community',
    titleAr: 'المجتمع المهني',
    desc: 'Our members share knowledge, mentor one another, and collaborate to support responsible osteopathic practice in Egypt.',
    descAr: 'يتبادل أعضاؤنا المعرفة والخبرة ويتعاونون لدعم الممارسة المسؤولة للأوستيوباثي في مصر.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    title: 'Research',
    titleAr: 'البحث العلمي',
    desc: 'We champion evidence-based practice and support ongoing research that advances the science and art of osteopathic medicine.',
    descAr: 'ندعم الممارسة القائمة على الدليل والبحوث المستمرة التي تطوّر علم وفن الطب الأوستيوباثي.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
];

export default async function AboutPage() {
  const { data: statistics } = await getPublicData(
    () => db.publicStatistic.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      take: 8,
    }),
    [],
  );

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Who We Are"
        eyebrowAr="من نحن"
        title="About EGSOM"
        titleAr="عن الجمعية"
        subtitle="The Egyptian Society of Osteopathic Medicine supports professional education, practice, and public understanding in Egypt."
        subtitleAr="تدعم الجمعية المصرية لطب الأوستيوباثي التعليم والممارسة المهنية والتوعية العامة في مصر."
      />

      {/* Story section */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className={`grid gap-10 lg:gap-16 items-start ${statistics.length > 0 ? 'lg:grid-cols-2' : ''}`}>
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-brand-600" />
                <span className="text-brand-600 text-[11px] font-medium tracking-[0.35em] uppercase">
                  <LocalizedText en="Our Story" ar="قصتنا" />
                </span>
              </div>
              <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-light text-brand-950 leading-tight mb-6">
                <LocalizedText
                  en="Advancing osteopathic practice in Egypt"
                  ar="نرتقي بممارسة الأوستيوباثي في مصر"
                />
              </h2>
              <p className="mb-4 leading-relaxed text-slate-600">
                <LocalizedText
                  en="EGSOM was established to support the professional development of osteopathic medicine within Egypt's healthcare landscape. Its work focuses on education, professional standards, and connections between practitioners and the public."
                  ar="تأسست الجمعية لدعم التطور المهني لطب الأوستيوباثي ضمن منظومة الرعاية الصحية في مصر. ويركز عملها على التعليم والمعايير المهنية والربط بين الممارسين والجمهور."
                />
              </p>
              <p className="leading-relaxed text-slate-600">
                <LocalizedText
                  en="Today, EGSOM brings practitioners together around responsible practice, professional learning, and clear public information in Egypt."
                  ar="تجمع الجمعية اليوم الممارسين حول الممارسة المسؤولة والتعلم المهني والمعلومات العامة الواضحة في مصر."
                />
              </p>
            </div>

            {statistics.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {statistics.map((stat) => (
                <div key={stat.id} className="surface-panel bg-slate-50/70 p-5">
                  <div className="font-display text-[2.5rem] font-semibold text-brand-600 leading-none mb-2">
                    <bdi
                      dir="ltr"
                      lang="en"
                      className="font-display-latin tabular-nums"
                    >
                      {stat.value}
                    </bdi>
                  </div>
                  <div className="text-sm text-slate-600">
                    <LocalizedText en={stat.label} ar={stat.labelAr} />
                  </div>
                  <div className="mt-4 border-t border-brand-100/80 pt-3 text-xs leading-5 text-slate-500">
                    <span className="block">
                      <LocalizedText en="Source" ar="المصدر" />:{' '}
                      {stat.sourceUrl ? (
                        <a href={stat.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-brand-300 underline-offset-2 hover:text-brand-700">
                          {stat.sourceLabel}
                        </a>
                      ) : stat.sourceLabel}
                    </span>
                    <span className="block">
                      <LocalizedText en="Verified" ar="تاريخ التحقق" />:{' '}
                      <LocalizedDate value={stat.lastVerifiedAt.toISOString()} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-brand-950 p-8 text-white sm:p-10">
              <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                <LocalizedText en="Our Mission" ar="رسالتنا" />
              </h3>
              <p className="text-brand-200/75 leading-relaxed">
                <LocalizedText
                  en="To support the responsible integration of osteopathic principles within healthcare in Egypt while encouraging professional learning, ethical practice, and clear public information."
                  ar="دعم الدمج المسؤول لمبادئ الطب الأوستيوباثي ضمن الرعاية الصحية في مصر، مع تشجيع التعلم المهني والممارسة الأخلاقية والمعلومات العامة الواضحة."
                />
              </p>
            </div>

            <div className="surface-panel p-8 sm:p-10">
              <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brand-950 mb-3">
                <LocalizedText en="Our Vision" ar="رؤيتنا" />
              </h3>
              <p className="leading-relaxed text-slate-600">
                <LocalizedText
                  en="A future where osteopathic medicine is understood clearly and practised responsibly in Egypt."
                  ar="مستقبل يُفهم فيه الطب الأوستيوباثي بوضوح ويُمارس بمسؤولية في مصر."
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-brand-600" />
              <span className="text-brand-600 text-[11px] font-medium tracking-[0.35em] uppercase">
                <LocalizedText en="What Guides Us" ar="ما يوجّه عملنا" />
              </span>
              <div className="h-px w-8 bg-brand-600" />
            </div>
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-light text-brand-950">
              <LocalizedText en="Our Core Values" ar="قيمنا الأساسية" />
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="surface-card group flex gap-5 p-6 hover:border-brand-200 hover:bg-brand-50/35">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    <LocalizedText en={v.title} ar={v.titleAr} />
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    <LocalizedText en={v.desc} ar={v.descAr} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-brand-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '36px 36px' }} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center relative z-10">
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-light text-white mb-4">
            <LocalizedText
              en={<>Ready to join <em className="text-gold">EGSOM?</em></>}
              ar="هل أنت مستعد للانضمام إلى الجمعية؟"
            />
          </h2>
          <p className="text-brand-300/70 mb-8 leading-relaxed">
            <LocalizedText
              en="Explore professional education, connect with peers, and ask about participating in EGSOM's work."
              ar="استكشف التعليم المهني وتواصل مع الزملاء واستفسر عن المشاركة في عمل الجمعية."
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white px-8 py-3.5 text-sm font-semibold tracking-[0.01em] text-brand-900 transition-[background-color,color,transform] duration-200 hover:bg-gold hover:text-brand-950 active:scale-[0.98]"
            >
              <LocalizedText en="Get in Touch" ar="تواصل معنا" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 border border-white/28 px-8 py-3.5 text-sm font-semibold tracking-[0.01em] text-white transition-[background-color,border-color,transform] duration-200 hover:border-white/60 hover:bg-white/8 active:scale-[0.98]"
            >
              <LocalizedText en="View Courses" ar="عرض الدورات" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
