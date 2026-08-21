import Link from '@/components/i18n/LocalizedLink';
import LocalizedText from '@/components/i18n/LocalizedText';
import PageHeader from '@/components/layout/PageHeader';
import { getLocalizedMetadata } from '@/lib/localized-metadata';

export async function generateMetadata() {
  return getLocalizedMetadata('/practitioners');
}

const resources = [
  {
    number: '01',
    title: 'Education and development',
    titleAr: 'التعليم والتطوير المهني',
    body: 'Review currently published courses, workshops, and professional-development opportunities.',
    bodyAr: 'اطّلع على الدورات وورش العمل وفرص التطوير المهني المنشورة حاليًا.',
    href: '/courses',
    action: 'View courses',
    actionAr: 'عرض الدورات',
  },
  {
    number: '02',
    title: 'Activities & Events',
    titleAr: 'الأنشطة والفعاليات',
    body: 'Follow published seminars, meetings, conferences, and community activities.',
    bodyAr: 'تابع الندوات والاجتماعات والمؤتمرات والأنشطة المجتمعية المنشورة.',
    href: '/activities',
    action: 'View activities and events',
    actionAr: 'عرض الأنشطة والفعاليات',
  },
  {
    number: '03',
    title: 'Directory and profile enquiries',
    titleAr: 'استفسارات الدليل والملفات المهنية',
    body: 'Ask about a directory listing, request a profile review, or submit updated professional information for review.',
    bodyAr: 'استفسر عن الإدراج في الدليل أو اطلب مراجعة ملفك أو أرسل معلومات مهنية محدثة للمراجعة.',
    href: '/contact',
    action: 'Contact EGSOM',
    actionAr: 'تواصل مع الجمعية',
  },
];

export default function PractitionerResourcesPage() {
  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Professional Resources"
        eyebrowAr="موارد مهنية"
        title="For Practitioners"
        titleAr="للممارسين"
        subtitle="A clear starting point for published education, professional activities, and directory enquiries."
        subtitleAr="نقطة بداية واضحة للتعليم والأنشطة المهنية المنشورة واستفسارات الدليل."
      />

      <section className="bg-slate-50/70 py-14 sm:py-20" aria-labelledby="practitioner-resources-heading">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-600">
                <LocalizedText en="Professional pathways" ar="المسارات المهنية" />
              </p>
              <h2 id="practitioner-resources-heading" className="mt-4 max-w-[14ch] font-display text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.02] text-brand-950">
                <LocalizedText en="Find the right next step" ar="اختر خطوتك التالية" />
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
                <LocalizedText
                  en="This area links to information that is currently available on the website. Membership, credential, and listing decisions are handled through direct review, not automatic online approval."
                  ar="تربط هذه الصفحة بالمعلومات المتاحة حاليًا على الموقع. وتُراجع طلبات العضوية والاعتماد والإدراج مباشرة، ولا تتم الموافقة عليها تلقائيًا عبر الإنترنت."
                />
              </p>
            </div>

            <div className="border-y border-brand-950/15">
              {resources.map((resource) => (
                <Link
                  key={resource.number}
                  href={resource.href}
                  className="group grid min-h-40 grid-cols-[3rem_1fr] gap-4 border-b border-brand-950/15 py-7 outline-none last:border-b-0 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4 sm:grid-cols-[4rem_1fr_auto] sm:items-center sm:gap-6"
                >
                  <span className="font-display text-2xl text-gold-deep" aria-hidden="true">{resource.number}</span>
                  <span>
                    <span className="block text-lg font-semibold text-brand-950">
                      <LocalizedText en={resource.title} ar={resource.titleAr} />
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-6 text-slate-600">
                      <LocalizedText en={resource.body} ar={resource.bodyAr} />
                    </span>
                  </span>
                  <span className="col-start-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors group-hover:text-brand-950 sm:col-start-auto">
                    <LocalizedText en={resource.action} ar={resource.actionAr} />
                    <span className="rtl-flip" aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-950 py-12 text-bone sm:py-16">
        <div className="container mx-auto flex max-w-5xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-medium sm:text-3xl">
              <LocalizedText en="A note about directory listings" ar="ملاحظة حول الإدراج في الدليل" />
            </h2>
            <p className="mt-3 text-sm leading-6 text-brand-200/80">
              <LocalizedText
                en="A directory listing presents reviewed profile information. It does not, by itself, state that a practitioner holds a particular certification. Verified credentials are shown only when supporting details are recorded."
                ar="يعرض الإدراج في الدليل معلومات ملف تمت مراجعتها، لكنه لا يعني بمفرده أن الممارس يحمل اعتمادًا محددًا. ولا تُعرض بيانات الاعتماد الموثقة إلا عند تسجيل التفاصيل الداعمة."
              />
            </p>
          </div>
          <Link href="/find-osteopath" className="inline-flex min-h-12 shrink-0 items-center justify-center border border-gold bg-gold px-6 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-light focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-4 focus-visible:ring-offset-brand-950">
            <LocalizedText en="View the directory" ar="عرض الدليل" />
          </Link>
        </div>
      </section>
    </div>
  );
}
