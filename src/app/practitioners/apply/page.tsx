import PageHeader from '@/components/layout/PageHeader';
import PractitionerApplicationForm from '@/components/practitioners/PractitionerApplicationForm';
import { getLocalizedMetadata } from '@/lib/localized-metadata';

export async function generateMetadata() {
  return getLocalizedMetadata('/practitioners/apply');
}

export default function PractitionerApplicationPage() {
  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Directory Review"
        eyebrowAr="مراجعة الدليل"
        title="Practitioner listing application"
        titleAr="طلب إدراج ممارس"
        subtitle="Submit professional information for EGSOM review. Applications are reviewed individually and are never published automatically."
        subtitleAr="أرسل معلوماتك المهنية لمراجعتها من الجمعية. تُراجع الطلبات بصورة فردية ولا تُنشر تلقائيًا."
      />
      <PractitionerApplicationForm />
    </div>
  );
}
