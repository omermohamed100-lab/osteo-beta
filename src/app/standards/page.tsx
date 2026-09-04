import Link from '@/components/i18n/LocalizedLink';
import LocalizedText from '@/components/i18n/LocalizedText';
import PageHeader from '@/components/layout/PageHeader';
import { getLocalizedMetadata } from '@/lib/localized-metadata';

export async function generateMetadata() {
  return getLocalizedMetadata('/standards');
}

const steps = [
  {
    en: 'Application review',
    ar: 'مراجعة الطلب',
    body: 'Every new listing or profile-update application is reviewed individually. Submission does not create or change a public profile automatically.',
    bodyAr: 'يُراجع كل طلب إدراج جديد أو تحديث ملف بصورة فردية. ولا يؤدي إرسال الطلب إلى إنشاء ملف عام أو تغييره تلقائيًا.',
  },
  {
    en: 'Inactive draft first',
    ar: 'مسودة غير نشطة أولًا',
    body: 'An approved new-listing application creates an inactive draft with an unverified credential status. Profile updates require manual comparison with the live profile.',
    bodyAr: 'ينشئ طلب الإدراج الجديد الموافق عليه مسودة غير نشطة بحالة مؤهل غير موثق. وتتطلب تحديثات الملفات مقارنة يدوية مع الملف المنشور.',
  },
  {
    en: 'Separate publication decision',
    ar: 'قرار نشر منفصل',
    body: 'A profile appears in the public directory only when an authorized administrator activates it after review.',
    bodyAr: 'لا يظهر الملف في الدليل العام إلا عندما يفعّله مسؤول مخول بعد المراجعة.',
  },
];

export default function StandardsPage() {
  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Public information process"
        eyebrowAr="إجراءات المعلومات العامة"
        title="Directory review and credential status"
        titleAr="مراجعة الدليل وحالة المؤهلات"
        subtitle="What the website's review labels mean, and what they do not mean."
        subtitleAr="ما الذي تعنيه تسميات المراجعة في الموقع، وما الذي لا تعنيه."
      />

      <div className="bg-slate-50/70 py-10 sm:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <section aria-labelledby="listing-review-heading" className="border border-brand-950/15 bg-white p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              <LocalizedText en="Published process" ar="الإجراءات المنشورة" />
            </p>
            <h2 id="listing-review-heading" className="mt-3 font-display text-3xl font-semibold text-brand-950">
              <LocalizedText en="A listing is reviewed, not automatically certified" ar="يُراجع الإدراج ولا يُعتمد تلقائيًا" />
            </h2>
            <p className="mt-5 max-w-[70ch] leading-8 text-ink-muted">
              <LocalizedText
                en="Directory inclusion means profile information passed the website's individual publication workflow. It does not, by itself, state that EGSOM certified, licensed, accredited, or regulated the practitioner."
                ar="يعني الإدراج في الدليل أن معلومات الملف مرت بإجراءات النشر الفردية في الموقع. ولا يعني ذلك في حد ذاته أن الجمعية منحت الممارس شهادة أو ترخيصًا أو اعتمادًا أو مارست عليه سلطة تنظيمية."
              />
            </p>

            <ol className="mt-9 border-t border-brand-950/15">
              {steps.map((step, index) => (
                <li key={step.en} className="grid gap-3 border-b border-brand-950/15 py-6 sm:grid-cols-[3rem_1fr] sm:gap-5">
                  <span className="font-sans text-sm font-semibold tabular-nums text-gold-deep" aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-950"><LocalizedText en={step.en} ar={step.ar} /></h3>
                    <p className="mt-2 max-w-[70ch] text-sm leading-7 text-ink-muted"><LocalizedText en={step.body} ar={step.bodyAr} /></p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="credential-heading" className="mt-8 bg-brand-950 p-6 text-bone sm:p-9">
            <h2 id="credential-heading" className="font-display text-3xl font-semibold">
              <LocalizedText en="How credential status is displayed" ar="كيفية عرض حالة المؤهل" />
            </h2>
            <div className="mt-6 grid gap-7 md:grid-cols-3">
              <div><h3 className="font-semibold text-gold-light"><LocalizedText en="Unverified" ar="غير موثق" /></h3><p className="mt-2 text-sm leading-7 text-brand-100"><LocalizedText en="The status is not shown publicly when complete evidence fields are absent or the record is not marked verified." ar="لا تظهر الحالة للعامة عند غياب حقول الأدلة الكاملة أو عندما لا يكون السجل محددًا كموثق." /></p></div>
              <div><h3 className="font-semibold text-gold-light"><LocalizedText en="Verified record" ar="سجل موثق" /></h3><p className="mt-2 text-sm leading-7 text-brand-100"><LocalizedText en="Display requires a credential type, number, issuing organization, verification date, and a verified status recorded in the website." ar="يتطلب العرض نوع المؤهل ورقمه والجهة المانحة وتاريخ التحقق وحالة موثقة مسجلة في الموقع." /></p></div>
              <div><h3 className="font-semibold text-gold-light"><LocalizedText en="Expired record" ar="سجل منتهي" /></h3><p className="mt-2 text-sm leading-7 text-brand-100"><LocalizedText en="A recorded expiry date in the past is shown as expired, never as currently verified." ar="يُعرض تاريخ الانتهاء المسجل الذي مضى على أنه منتهٍ، ولا يُعرض على أنه موثق حاليًا." /></p></div>
            </div>
            <p className="mt-7 max-w-[70ch] border-t border-brand-700 pt-5 text-sm leading-7 text-brand-100">
              <LocalizedText en="These labels describe evidence recorded for this directory. They are not a statement of government licensure, statutory regulation, or course accreditation." ar="تصف هذه التسميات الأدلة المسجلة لهذا الدليل، ولا تمثل إقرارًا بترخيص حكومي أو تنظيم قانوني أو اعتماد للدورات." />
            </p>
          </section>

          <section aria-labelledby="corrections-heading" className="mt-8 border border-brand-950/15 bg-bone p-6 sm:p-9">
            <h2 id="corrections-heading" className="font-display text-3xl font-semibold text-brand-950"><LocalizedText en="Questions and corrections" ar="الأسئلة والتصحيحات" /></h2>
            <p className="mt-4 max-w-[70ch] leading-8 text-ink-muted"><LocalizedText en="To ask about published directory information or request a correction, use the contact form and identify the profile concerned. Practitioners can use the application route to request a profile update; updates are compared manually and do not overwrite a live profile automatically." ar="للاستفسار عن معلومات الدليل المنشورة أو طلب تصحيحها، استخدم نموذج التواصل وحدد الملف المعني. ويمكن للممارسين استخدام مسار الطلب لتحديث الملف؛ إذ تُقارن التحديثات يدويًا ولا تستبدل الملف المنشور تلقائيًا." /></p>
            <div className="mt-6 flex flex-wrap gap-5">
              <Link href="/contact" className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950"><LocalizedText en="Contact EGSOM" ar="تواصل مع الجمعية" /></Link>
              <Link href="/practitioners/apply" className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950"><LocalizedText en="Request a profile update" ar="اطلب تحديث ملف" /></Link>
              <Link href="/privacy" className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline decoration-gold/70 underline-offset-4 hover:text-brand-950"><LocalizedText en="Read the privacy notice" ar="اقرأ إشعار الخصوصية" /></Link>
            </div>
            <p className="mt-7 text-xs text-slate-500"><LocalizedText en="Process page updated 5 September 2026." ar="تم تحديث صفحة الإجراءات في 5 سبتمبر 2026." /></p>
          </section>
        </div>
      </div>
    </div>
  );
}
