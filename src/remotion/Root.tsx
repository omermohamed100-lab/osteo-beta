import { Composition } from 'remotion';
import {
  HERO_DURATION_IN_FRAMES,
  HeroHandsComposition,
} from '../components/home/HeroRemotion';

export function RemotionRoot() {
  return (
    <Composition
      id="HeroHands"
      component={HeroHandsComposition}
      durationInFrames={HERO_DURATION_IN_FRAMES}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{
        reducedMotion: false,
      }}
    />
  );
}
