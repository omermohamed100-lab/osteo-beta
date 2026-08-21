import PageHeader from '@/components/layout/PageHeader';
import LocalizedText from '@/components/i18n/LocalizedText';
import Link from '@/components/i18n/LocalizedLink';
import { getLocalizedMetadata } from '@/lib/localized-metadata';

export async function generateMetadata() {
  return getLocalizedMetadata('/privacy');
}

const sections = [
  {
    title: { en: 'Information we handle', ar: 'المعلومات التي نتعامل معها' },
    body: {
      en: 'When you use the contact form, we receive the name, email address, and message you choose to provide. A practitioner application can also include contact details, professional biography, practice location, credential details, profile links, and an optional approved image link. Public practitioner, course, activity, gallery, and organizational information is managed by authorized administrators. Security controls also process limited technical request data and privacy-preserving derived identifiers to prevent abuse.',
      ar: 'عند استخدام نموذج التواصل، نستلم الاسم وعنوان البريد الإلكتروني والرسالة التي تختار تقديمها. وقد يتضمن طلب الممارس أيضًا بيانات التواصل والنبذة المهنية وموقع الممارسة وتفاصيل المؤهلات وروابط الملف ورابط صورة معتمد اختياري. ويدير المسؤولون المخولون المعلومات العامة الخاصة بالممارسين والدورات والأنشطة والمعرض والجمعية. كما تعالج ضوابط الأمان قدرًا محدودًا من بيانات الطلب الفنية ومعرّفات مشتقة تراعي الخصوصية لمنع إساءة الاستخدام.',
    },
  },
  {
    title: { en: 'How information is used', ar: 'كيفية استخدام المعلومات' },
    body: {
      en: 'Information is used to respond to enquiries, review practitioner applications, operate the practitioner directory and educational services, administer the website, maintain security, and meet applicable legal obligations. Applications do not create or publish a directory profile automatically. EGSOM does not sell submitted information.',
      ar: 'تُستخدم المعلومات للرد على الاستفسارات ومراجعة طلبات الممارسين وتشغيل دليل الممارسين والخدمات التعليمية وإدارة الموقع والحفاظ على الأمان والوفاء بالالتزامات القانونية المعمول بها. ولا تنشئ الطلبات ملفًا في الدليل أو تنشره تلقائيًا، كما لا تبيع الجمعية المعلومات المقدمة.',
    },
  },
  {
    title: { en: 'Storage, service providers, and retention', ar: 'التخزين ومقدمو الخدمات والاحتفاظ' },
    body: {
      en: 'The website uses contracted hosting, database, analytics, and communication services that process only the information needed to provide those services. Contact messages and practitioner applications are retained only while reasonably necessary to review or respond, maintain an audit and operational record, protect the service, or satisfy legal obligations. Authorized administrators should review retained records periodically.',
      ar: 'يستخدم الموقع خدمات تعاقدية للاستضافة وقواعد البيانات والتحليلات والاتصالات، ولا تعالج هذه الخدمات إلا المعلومات اللازمة لتقديمها. ويُحتفظ برسائل التواصل وطلبات الممارسين فقط للمدة اللازمة بصورة معقولة للمراجعة أو الرد والاحتفاظ بسجل تدقيق وتشغيل وحماية الخدمة أو الوفاء بالالتزامات القانونية. وينبغي أن يراجع المسؤولون المخولون السجلات المحتفظ بها دوريًا.',
    },
  },
  {
    title: { en: 'Your choices and requests', ar: 'خياراتك وطلباتك' },
    body: {
      en: 'You may ask about personal information you submitted or request its correction or deletion, subject to applicable legal and operational requirements. Use the contact form and clearly identify the original enquiry so an authorized administrator can review the request safely.',
      ar: 'يمكنك الاستفسار عن المعلومات الشخصية التي قدمتها أو طلب تصحيحها أو حذفها، مع مراعاة المتطلبات القانونية والتشغيلية المعمول بها. استخدم نموذج التواصل وحدد الاستفسار الأصلي بوضوح حتى يتمكن مسؤول مخول من مراجعة الطلب بأمان.',
    },
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Governance"
        eyebrowAr="الحوكمة"
        title="Privacy"
        titleAr="الخصوصية"
        subtitle="How EGSOM handles information submitted through this website."
        subtitleAr="كيفية تعامل الجمعية مع المعلومات المقدمة عبر هذا الموقع."
      />
      <div className="bg-slate-50/70 py-9 sm:py-14">
        <article className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="surface-panel p-6 sm:p-10">
            <p className="text-sm leading-relaxed text-ink-muted">
              <LocalizedText
                en="This notice applies to the public EGSOM website. Directory information is informational and does not replace professional medical advice or independently guarantee a practitioner’s credentials."
                ar="ينطبق هذا الإشعار على الموقع العام للجمعية. ومعلومات الدليل إرشادية ولا تحل محل المشورة الطبية المهنية ولا تضمن بصورة مستقلة بيانات اعتماد أي ممارس."
              />
            </p>
            <div className="mt-8 space-y-8">
              {sections.map((section) => (
                <section key={section.title.en}>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl">
                    <LocalizedText en={section.title.en} ar={section.title.ar} />
                  </h2>
                  <p className="mt-3 leading-7 text-ink-muted">
                    <LocalizedText en={section.body.en} ar={section.body.ar} />
                  </p>
                </section>
              ))}
            </div>
            <div className="mt-10 border-t border-brand-950/10 pt-6">
              <p className="text-sm text-ink-muted">
                <LocalizedText en="Last updated: 22 August 2026" ar="آخر تحديث: 22 أغسطس 2026" />
              </p>
              <Link href="/contact" className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950 focus-visible:ring-2 focus-visible:ring-brand-600">
                <LocalizedText en="Submit a privacy request" ar="تقديم طلب متعلق بالخصوصية" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
