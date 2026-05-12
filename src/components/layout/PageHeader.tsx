interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="bg-brand-950 text-white relative overflow-hidden py-14 sm:py-20">
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '36px 36px' }}
      />
      {/* Diagonal accent */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {eyebrow && (
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold text-[11px] font-medium tracking-[0.35em] uppercase">{eyebrow}</span>
          </div>
        )}
        <h1 className="font-display text-[clamp(2rem,6vw,4.5rem)] font-light text-white leading-tight mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-brand-300/70 text-base sm:text-lg max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
