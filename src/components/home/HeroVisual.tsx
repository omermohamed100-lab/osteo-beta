'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DesktopHero = dynamic(() => import('./HeroRemotion'), {
  ssr: false,
});

export default function HeroVisual() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileAnimationStarted, setMobileAnimationStarted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const updateViewport = () => setIsDesktop(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      return;
    }

    const timer = window.setTimeout(() => {
      setMobileAnimationStarted(true);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [isDesktop]);

  return (
    <>
      <div
        className={`hero-mobile-visual ${
          mobileAnimationStarted ? 'is-visible' : 'is-waiting'
        }`}
        aria-hidden="true"
      >
        <div className="hero-mobile-glow" />
        <div className="hero-mobile-seal" />
        <div className="hero-mobile-hands" />
      </div>

      {isDesktop ? <DesktopHero /> : null}
    </>
  );
}
