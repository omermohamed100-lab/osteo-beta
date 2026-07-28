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
    <div className="relative overflow-hidden bg-brand-950 py-10 text-white sm:py-14 lg:py-16">
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '36px 36px' }}
      />
      {/* Diagonal accent */}
      <div className="absolute end-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {eyebrow && (
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <div className="h-px w-8 bg-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-light">
              <LocalizedText en={eyebrow} ar={eyebrowAr || eyebrow} />
            </span>
          </div>
        )}
        <h1 className="mb-3 font-display text-[clamp(2rem,5.4vw,4rem)] font-light leading-[1.04] tracking-[-0.018em] text-white">
          <LocalizedText en={title} ar={titleAr || title} />
        </h1>
        {subtitle && (
          <p className="page-header-copy max-w-2xl text-base leading-relaxed text-brand-100/82 sm:text-lg">
            <LocalizedText en={subtitle} ar={subtitleAr || subtitle} />
          </p>
        )}
      </div>
    </div>
  );
}
