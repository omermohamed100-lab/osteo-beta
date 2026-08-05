import LocalizedText from '@/components/i18n/LocalizedText';

interface Props {
  eyebrow?: string;
  eyebrowAr?: string;
  title: string;
  titleAr?: string;
  subtitle?: string;
  subtitleAr?: string;
}

export default function PageHeader({
  eyebrow,
  eyebrowAr,
  title,
  titleAr,
  subtitle,
  subtitleAr,
}: Props) {
  return (
    <header className="relative overflow-hidden border-b border-brand-950/12 bg-bone py-14 text-brand-950 sm:py-20 lg:py-24">
      <div className="absolute inset-y-0 end-0 hidden w-[42%] border-s border-brand-950/8 bg-mist/65 lg:block" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(oklch(17.5% 0.038 238 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(17.5% 0.038 238 / 0.04) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage: 'linear-gradient(90deg, transparent, black)',
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-[90rem] gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:px-12 xl:px-16">
        <div className="lg:col-span-8">
          {eyebrow && (
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-9 bg-gold-deep" aria-hidden="true" />
              <p className="text-[0.69rem] font-semibold uppercase tracking-[0.22em] text-gold-deep">
                <LocalizedText en={eyebrow} ar={eyebrowAr || eyebrow} />
              </p>
            </div>
          )}
          <h1 className="max-w-[15ch] text-balance font-sans text-[clamp(2.75rem,5.6vw,6rem)] font-medium leading-[0.96] tracking-[-0.05em] text-brand-950">
            <LocalizedText en={title} ar={titleAr || title} />
          </h1>
        </div>
        {subtitle && (
          <div className="flex items-end lg:col-span-4">
            <p className="page-header-copy max-w-[36rem] border-t border-brand-950/18 pt-5 text-base leading-7 text-ink-muted sm:text-lg sm:leading-8 lg:pb-1">
              <LocalizedText en={subtitle} ar={subtitleAr || subtitle} />
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
