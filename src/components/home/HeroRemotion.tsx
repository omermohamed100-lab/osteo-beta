'use client';

import { Player } from '@remotion/player';
import { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

type HeroHandsCompositionProps = {
  reducedMotion: boolean;
};

export const HERO_DURATION_IN_FRAMES = 30;
const HERO_FINAL_FRAME = 69;

export const HeroHandsComposition = ({
  reducedMotion,
}: HeroHandsCompositionProps) => {
  const frame = useCurrentFrame();
  const animationFrame = reducedMotion
    ? HERO_FINAL_FRAME
    : (frame * HERO_FINAL_FRAME) / (HERO_DURATION_IN_FRAMES - 1);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 190,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 252, 245, 0.96) 0%, rgba(205, 168, 82, 0.12) 48%, rgba(205, 168, 82, 0) 72%)',
          opacity: interpolate(animationFrame, [14, 44], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(animationFrame, [14, 44], [0.78, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />

      <Interactive.Div
        name="Rising hand cradle"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: interpolate(animationFrame, [0, 10], [0.15, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: `0px ${interpolate(animationFrame, [0, 33], [430, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px`,
          scale: interpolate(animationFrame, [0, 33], [0.96, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          transformOrigin: '50% 100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 250,
            bottom: 62,
            width: 580,
            height: 80,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(2, 12, 27, 0.34) 0%, rgba(2, 12, 27, 0) 70%)',
            opacity: interpolate(animationFrame, [10, 35], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />

        <Img
          src={staticFile('hero-hands-rising.webp')}
          style={{
            position: 'absolute',
            top: 190,
            left: 130,
            width: 820,
            height: 'auto',
            clipPath: 'inset(0 50% 0 0)',
            translate: `${interpolate(animationFrame, [7, 37], [-30, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}px 0px`,
          }}
        />
        <Img
          src={staticFile('hero-hands-rising.webp')}
          style={{
            position: 'absolute',
            top: 190,
            left: 130,
            width: 820,
            height: 'auto',
            clipPath: 'inset(0 0 0 50%)',
            translate: `${interpolate(animationFrame, [7, 37], [30, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}px 0px`,
          }}
        />

        <Interactive.Div
          name="Centered EGSOM seal"
          style={{
            position: 'absolute',
            top: 246,
            left: '50%',
            zIndex: 20,
            width: 378,
            height: 378,
            opacity: interpolate(animationFrame, [12, 35], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: `-50% ${interpolate(animationFrame, [12, 41], [96, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}px`,
            scale: interpolate(animationFrame, [12, 41], [0.84, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -34,
              border: '2px solid rgba(201, 168, 76, 0.24)',
              borderRadius: '50%',
              opacity: interpolate(animationFrame, [23, 49], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              scale: interpolate(animationFrame, [23, 49], [0.78, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: -14,
              border: '1px solid rgba(205, 168, 82, 0.18)',
              borderRadius: '50%',
              opacity: interpolate(animationFrame, [27, 52], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              scale: interpolate(animationFrame, [27, 52], [0.84, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          />
          <Img
            src={staticFile('logo-clean.webp')}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter:
                'drop-shadow(0 24px 34px rgba(2, 12, 27, 0.28))',
            }}
          />
        </Interactive.Div>

        <Img
          src={staticFile('hero-hands-rising.webp')}
          style={{
            position: 'absolute',
            top: 190,
            left: 130,
            zIndex: 30,
            width: 820,
            height: 'auto',
            clipPath: 'inset(47% 50% 0 0)',
            translate: `${interpolate(animationFrame, [7, 37], [-30, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}px 0px`,
          }}
        />
        <Img
          src={staticFile('hero-hands-rising.webp')}
          style={{
            position: 'absolute',
            top: 190,
            left: 130,
            zIndex: 30,
            width: 820,
            height: 'auto',
            clipPath: 'inset(47% 0 0 50%)',
            translate: `${interpolate(animationFrame, [7, 37], [30, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}px 0px`,
          }}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export default function HeroRemotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  return (
    <div
      className="hero-remotion-player"
      dir="ltr"
      aria-hidden="true"
    >
      <Player
        component={HeroHandsComposition}
        inputProps={{ reducedMotion }}
        acknowledgeRemotionLicense
        durationInFrames={HERO_DURATION_IN_FRAMES}
        compositionWidth={1080}
        compositionHeight={1080}
        fps={30}
        autoPlay={!reducedMotion}
        loop={false}
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        allowFullscreen={false}
        showVolumeControls={false}
        numberOfSharedAudioTags={0}
        initiallyMuted
        moveToBeginningWhenEnded={false}
        overflowVisible={false}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
}
