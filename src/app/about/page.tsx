import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import { egsomStats } from '@/lib/stats';
import LocalizedText from '@/components/i18n/LocalizedText';
import { getLocalizedMetadata } from '@/lib/localized-metadata';

export async function generateMetadata() {
  return getLocalizedMetadata('/about');
}

const values = [
  {
    title: 'Excellence',
    titleAr: 'التميّز',
    desc: 'We uphold the highest standards of osteopathic education and clinical practice, ensuring our members deliver world-class care.',
    descAr: 'نلتزم بأعلى معايير التعليم والممارسة السريرية في الطب الأوستيوباثي، بما يضمن تقديم أعضائنا رعاية بمستوى عالمي.',
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
    desc: 'Our members share knowledge, mentor one another, and collaborate across Egypt and the wider Middle East to raise the standard of care.',
    descAr: 'يتبادل أعضاؤنا المعرفة والخبرة ويتعاونون في مصر والشرق الأوسط للارتقاء بمستوى الرعاية.',
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

export default function AboutPage() {
  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Who We Are"
        eyebrowAr="من نحن"
        title="About EGSOM"
        titleAr="عن الجمعية"
        subtitle="The Egyptian Society of Osteopathic Medicine: the leading professional body for osteopaths in Egypt and the wider Middle East."
        subtitleAr="الجمعية المصرية لطب الأوستيوباثية، الهيئة المهنية الرائدة لممارسي الطب الأوستيوباثي في مصر والشرق الأوسط."
      />

      {/* Story section */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-brand-600" />
                <span className="text-brand-600 text-[11px] font-medium tracking-[0.35em] uppercase">
                  <LocalizedText en="Our Story" ar="قصتنا" />
                </span>
              </div>
              <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-light text-brand-950 leading-tight mb-6">
                <LocalizedText
                  en={<>Advancing healthcare <em>across the region</em></>}
                  ar="نرتقي بالرعاية الصحية في أنحاء المنطقة"
                />
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                <LocalizedText
                  en="EGSOM was founded with a singular purpose: to establish osteopathic medicine as a respected, evidence-based discipline within Egypt's healthcare landscape. Since our founding in Cairo, we have grown into the region's foremost professional association for osteopathic practitioners."
                  ar="تأسست الجمعية بهدف واضح، وهو ترسيخ الطب الأوستيوباثي كتخصص مهني محترم قائم على الدليل ضمن منظومة الرعاية الصحية في مصر. ومنذ انطلاقنا في القاهرة، أصبحنا من أبرز الجمعيات المهنية لممارسي هذا التخصص في المنطقة."
                />
              </p>
              <p className="text-gray-600 leading-relaxed">
                <LocalizedText
                  en="Today, our network spans Egypt and extends across the Middle East, uniting practitioners who share a commitment to holistic, patient-centred care, and to raising the bar for what osteopathic medicine can achieve."
                  ar="تمتد شبكتنا اليوم عبر مصر والشرق الأوسط، وتجمع ممارسين يلتزمون برعاية شاملة تتمحور حول المريض وبالارتقاء بما يمكن أن يقدمه الطب الأوستيوباثي."
                />
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {egsomStats.map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-2xl p-5 border border-gray-100">
                  <div className="font-display text-[2.5rem] font-semibold text-brand-600 leading-none mb-2">
                    <bdi
                      dir="ltr"
                      lang="en"
                      className="font-display-latin tabular-nums"
                    >
                      {stat.num}
                    </bdi>
                  </div>
                  <div className="text-gray-500 text-sm">
                    <LocalizedText en={stat.label} ar={stat.labelAr} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-brand-950 text-white rounded-2xl p-8 sm:p-10">
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
                  en="To integrate osteopathic principles into the wider healthcare system in Egypt, ensuring patients have access to safe, effective, and holistic care, while supporting the ongoing professional development of every member."
                  ar="دمج مبادئ الطب الأوستيوباثي في منظومة الرعاية الصحية في مصر، وضمان وصول المرضى إلى رعاية آمنة وفعّالة وشاملة، مع دعم التطوير المهني المستمر لكل عضو."
                />
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brand-950 mb-3">
                <LocalizedText en="Our Vision" ar="رؤيتنا" />
              </h3>
              <p className="text-gray-600 leading-relaxed">
                <LocalizedText
                  en="A future where osteopathic medicine is widely recognised and practised across Egypt and the Middle East, improving health outcomes for millions of patients through evidence-based, holistic treatment."
                  ar="مستقبل يحظى فيه الطب الأوستيوباثي بالاعتراف والممارسة الواسعة في مصر والشرق الأوسط، ويسهم في تحسين صحة ملايين المرضى من خلال علاج شامل قائم على الدليل."
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
              <div key={v.title} className="group flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    <LocalizedText en={v.title} ar={v.titleAr} />
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
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
              en="Become part of Egypt's premier osteopathic community. Access exclusive training, connect with peers, and help shape the future of healthcare in the region."
              ar="انضم إلى مجتمع مهني رائد للطب الأوستيوباثي في مصر، واستفد من التدريب المتخصص والتواصل مع الزملاء والمساهمة في تشكيل مستقبل الرعاية الصحية في المنطقة."
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-brand-900 text-sm font-semibold tracking-widest uppercase hover:bg-gold hover:text-white transition-colors duration-300"
            >
              <LocalizedText en="Get in Touch" ar="تواصل معنا" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/20 text-white text-sm font-medium tracking-widest uppercase hover:border-white/60 hover:bg-white/5 transition-colors duration-300"
            >
              <LocalizedText en="View Courses" ar="عرض الدورات" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
