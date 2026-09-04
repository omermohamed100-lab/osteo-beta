import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from '@/components/i18n/LocalizedLink';
import LocalizedDate from '@/components/i18n/LocalizedDate';
import LocalizedText from '@/components/i18n/LocalizedText';
import PageHeader from '@/components/layout/PageHeader';
import PublicDataUnavailable from '@/components/public/PublicDataUnavailable';
import { getLocalizedMetadata } from '@/lib/localized-metadata';
import { getPublicOsteopathProfile } from '@/lib/public-osteopath';
import { getPublicCredentialStatus } from '@/lib/practitioner-credentials';
import { getArabicContent } from '@/lib/arabic-content';
import PractitionerProfileAnalytics from '@/components/analytics/PractitionerProfileAnalytics';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const path = `/find-osteopath/${encodeURIComponent(decodeURIComponent(id))}`;
  const { data: profile } = await getPublicOsteopathProfile(decodeURIComponent(id));
  return getLocalizedMetadata(path, profile ? {
    en: { title: `${profile.name} · EGSOM Directory`, description: `${profile.name}, ${profile.specialty}, ${profile.city}, ${profile.country}.` },
    ar: { title: `${getArabicContent(profile.nameAr)} · دليل EGSOM`, description: `${getArabicContent(profile.nameAr)}، ${getArabicContent(profile.specialtyAr)}، ${getArabicContent(profile.cityAr)}، ${getArabicContent(profile.countryAr)}.` },
  } : undefined);
}

function ProfilePortrait({ name, nameAr, src }: { name: string; nameAr?: string; src: string | null }) {
  const alt = `Professional portrait of ${name} / صورة مهنية لـ ${getArabicContent(nameAr)}`;
  if (src?.startsWith('/images/osteopaths/')) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 767px) 100vw, 380px"
        className="object-contain object-bottom"
        priority
      />
    );
  }

  if (src) {
    // Database profile images are validated before storage.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className="h-full w-full object-cover" />;
  }

  return <div aria-hidden="true" className="flex h-full items-center justify-center bg-brand-100 text-7xl font-semibold text-brand-700"><LocalizedText en={name.charAt(0)} ar={getArabicContent(nameAr).charAt(0)} /></div>;
}

export default async function OsteopathProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: profile, unavailable } = await getPublicOsteopathProfile(decodeURIComponent(id));

  if (!profile && !unavailable) notFound();

  if (!profile) {
    return (
      <div className="flex-grow bg-slate-50/70 py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <PublicDataUnavailable
            title={{ en: 'Profile temporarily unavailable', ar: 'الملف غير متاح مؤقتًا' }}
            description={{
              en: 'This practitioner profile cannot be retrieved right now. Please try again shortly.',
              ar: 'يتعذر استرجاع ملف الممارس حاليًا. يُرجى المحاولة مرة أخرى بعد قليل.',
            }}
          />
        </div>
      </div>
    );
  }

  const verifiedAt = profile.credentialVerifiedAt ? new Date(profile.credentialVerifiedAt) : null;
  const expiresAt = profile.credentialExpiresAt ? new Date(profile.credentialExpiresAt) : null;
  const credentialStatus = getPublicCredentialStatus(profile);

  return (
    <div className="flex-grow">
      <PageHeader
        eyebrow="Practitioner Profile"
        eyebrowAr="ملف الممارس"
        title={profile.name}
        titleAr={getArabicContent(profile.nameAr)}
        subtitle={profile.specialty}
        subtitleAr={getArabicContent(profile.specialtyAr)}
      />

      <section className="bg-slate-50/70 py-10 sm:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {unavailable && (
            <div className="mb-8">
              <PublicDataUnavailable
                title={{ en: 'Live directory data temporarily unavailable', ar: 'بيانات الدليل المباشرة غير متاحة مؤقتًا' }}
                description={{
                  en: 'This approved fallback profile remains available while live directory data is restored.',
                  ar: 'يظل هذا الملف الاحتياطي الموافق عليه متاحًا إلى حين استعادة بيانات الدليل المباشرة.',
                }}
              />
            </div>
          )}

          <div className="grid overflow-hidden border border-brand-950/15 bg-bone md:grid-cols-[minmax(17rem,0.72fr)_1.28fr]">
            <div className="relative min-h-[22rem] overflow-hidden bg-brand-50 md:min-h-[36rem]">
              <ProfilePortrait name={profile.name} nameAr={profile.nameAr} src={profile.profileImage} />
            </div>
            <div className="p-6 sm:p-9 lg:p-12">
              <p dir="auto" className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-700">
                <LocalizedText en={profile.specialty} ar={getArabicContent(profile.specialtyAr)} />
              </p>
              <h2 dir="auto" className="mt-3 font-display text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-none text-brand-950"><LocalizedText en={profile.name} ar={getArabicContent(profile.nameAr)} /></h2>
              <p dir="auto" className="mt-3 text-sm text-slate-500"><LocalizedText en={`${profile.city}, ${profile.country}`} ar={`${getArabicContent(profile.cityAr)}، ${getArabicContent(profile.countryAr)}`} /></p>

              <section className="mt-8 border-t border-brand-950/12 pt-6" aria-labelledby="profile-biography-heading">
                <h2 id="profile-biography-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  <LocalizedText en="Qualifications and professional biography" ar="المؤهلات والنبذة المهنية" />
                </h2>
                {profile.bio ? (
                  <p dir="auto" className="mt-3 max-w-2xl text-base leading-8 text-slate-600"><LocalizedText en={profile.bio} ar={getArabicContent(profile.bioAr)} /></p>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-slate-500"><LocalizedText en="Professional biography not provided." ar="لم تُقدَّم نبذة مهنية." /></p>
                )}
              </section>

              <section className="mt-8 border-t border-brand-950/12 pt-6" aria-labelledby="practice-locations-heading">
                  <h2 id="practice-locations-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                    <LocalizedText en="Practice locations" ar="مواقع الممارسة" />
                  </h2>
                  {profile.location ? (
                    <p dir="auto" className="mt-3 text-sm leading-7 text-slate-600"><LocalizedText en={profile.location} ar={getArabicContent(profile.locationAr)} /></p>
                  ) : (
                    <p className="mt-3 text-sm leading-7 text-slate-500"><LocalizedText en="Practice address not provided. Contact this practitioner for location details." ar="لم يُقدَّم عنوان الممارسة. تواصل مع الممارس للحصول على تفاصيل الموقع." /></p>
                  )}
              </section>

              <section className="mt-8 border-t border-brand-950/12 pt-6" aria-labelledby="practitioner-contact-heading">
                <h2 id="practitioner-contact-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  <LocalizedText en="Contact and appointments" ar="التواصل والمواعيد" />
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  <LocalizedText en="Use the published contact details to ask the practitioner directly about appointments, availability, and location details." ar="استخدم بيانات التواصل المنشورة للاستفسار من الممارس مباشرة عن المواعيد والتوفر وتفاصيل الموقع." />
                </p>
                <PractitionerProfileAnalytics profileId={profile.id} phone={profile.phone} email={profile.email} />
                {!profile.phone && !profile.email && (
                  <p className="mt-3 text-sm leading-7 text-slate-500"><LocalizedText en="Direct contact details are not published for this profile." ar="لا توجد بيانات تواصل مباشرة منشورة لهذا الملف." /></p>
                )}
              </section>
            </div>
          </div>

          {credentialStatus !== 'unverified' && (
            <section className="mt-8 border border-brand-950/15 bg-white p-6 sm:p-8" aria-labelledby="credential-heading">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                    <LocalizedText en="Recorded credential" ar="بيانات الاعتماد المسجلة" />
                  </p>
                  <h2 id="credential-heading" dir="auto" className="mt-2 text-xl font-semibold text-brand-950"><LocalizedText en={profile.credentialType || ''} ar={getArabicContent(profile.credentialTypeAr)} /></h2>
                  <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 sm:gap-x-10">
                    <div><dt className="text-slate-500"><LocalizedText en="Issuing organization" ar="الجهة المانحة" /></dt><dd dir="auto" className="mt-1 font-medium text-brand-950"><LocalizedText en={profile.credentialIssuer || ''} ar={getArabicContent(profile.credentialIssuerAr)} /></dd></div>
                    <div><dt className="text-slate-500"><LocalizedText en="Credential number" ar="رقم الاعتماد" /></dt><dd dir="ltr" className="mt-1 font-medium text-brand-950">{profile.credentialNumber}</dd></div>
                    <div><dt className="text-slate-500"><LocalizedText en="Verification date" ar="تاريخ التحقق" /></dt><dd className="mt-1 font-medium text-brand-950"><LocalizedDate value={verifiedAt!.toISOString()} /></dd></div>
                    {expiresAt && <div><dt className="text-slate-500"><LocalizedText en="Expiry date" ar="تاريخ الانتهاء" /></dt><dd className="mt-1 font-medium text-brand-950"><LocalizedDate value={expiresAt.toISOString()} /></dd></div>}
                  </dl>
                </div>
                <span className={`inline-flex min-h-9 items-center self-start px-3 text-xs font-semibold uppercase tracking-[0.12em] ${credentialStatus === 'verified' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                  <LocalizedText en={credentialStatus === 'verified' ? 'Verified record' : 'Expired record'} ar={credentialStatus === 'verified' ? 'بيانات موثقة' : 'بيانات منتهية'} />
                </span>
              </div>
            </section>
          )}

          {credentialStatus === 'unverified' && (
            <section className="mt-8 border border-brand-950/15 bg-white p-6 sm:p-8" aria-labelledby="credential-heading">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600"><LocalizedText en="Credential information" ar="معلومات المؤهل" /></p>
              <h2 id="credential-heading" className="mt-2 text-xl font-semibold text-brand-950"><LocalizedText en="No verified credential record is displayed" ar="لا يُعرض سجل مؤهل موثق" /></h2>
              <p className="mt-3 max-w-[70ch] text-sm leading-7 text-slate-600"><LocalizedText en="Directory inclusion and profile review do not, by themselves, verify a credential. A verified record is displayed only when the required evidence details and verification date are recorded." ar="لا يثبت الإدراج في الدليل أو مراجعة الملف، في حد ذاتهما، صحة مؤهل. ولا يُعرض سجل موثق إلا عند تسجيل تفاصيل الأدلة المطلوبة وتاريخ التحقق." /></p>
            </section>
          )}

          <div className="mt-8 flex flex-col gap-4 border-t border-brand-950/15 pt-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {profile.profileReviewedAt ? (
                <><LocalizedText en="Profile information reviewed" ar="تمت مراجعة معلومات الملف" />: <LocalizedDate value={new Date(profile.profileReviewedAt).toISOString()} /></>
              ) : (
                <LocalizedText en="No public profile-review date is recorded." ar="لا يوجد تاريخ منشور لمراجعة الملف." />
              )}
            </p>
            <p className="max-w-md text-xs leading-5 text-slate-500"><LocalizedText en="The profile-review date refers to the published profile information, not credential verification." ar="يشير تاريخ مراجعة الملف إلى معلومات الملف المنشورة، وليس إلى التحقق من المؤهل." /></p>
            <Link href="/find-osteopath" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-700 hover:text-brand-950">
              <span className="rtl-flip" aria-hidden="true">←</span>
              <LocalizedText en="Back to directory" ar="العودة إلى الدليل" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
