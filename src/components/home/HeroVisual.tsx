export default function HeroVisual() {
  return (
    <>
      <div className="hero-mobile-visual is-visible" aria-hidden="true">
        <div className="hero-mobile-glow" />
        <div className="hero-mobile-seal" />
        <div className="hero-mobile-hands" />
      </div>

      <div className="hero-static-visual" dir="ltr" aria-hidden="true">
        <div className="hero-static-glow" />
        <div className="hero-static-shadow" />
        <div className="hero-static-seal" />
        <div className="hero-static-hands" />
      </div>
    </>
  );
}
