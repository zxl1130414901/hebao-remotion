import React from 'react';
import { Composition, Folder } from 'remotion';
import '@fontsource/noto-serif-sc/700.css';
import '@fontsource/noto-serif-sc/900.css';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/500.css';
import '@fontsource/noto-sans-sc/700.css';
import '@fontsource/noto-sans-sc/900.css';
import '@fontsource/oswald/400.css';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/600.css';
import '@fontsource/oswald/700.css';
import { TEMPLATES } from './templates';
import type { LayoutKind } from './templates';
import { DEFAULT_PROPS } from './types';
import type { UniversalProps } from './types';
import { SKIN_DEMO } from './demo';
import CONTENT from '../../content/demo.json';
import { SKINS, skinFor } from './skins';
import { Hero } from './layouts/Hero';
import { Portrait } from './layouts/Portrait';
import { MetricHero } from './layouts/Metric';
import { Ranking } from './layouts/Ranking';
import { Story } from './layouts/Story';
import { Medal, Certificate, Vaxis, Countdown, QuotePoster } from './layouts2/set1';
import { Collage, Diag, Film, Bcast, Chart } from './layouts2/set2';
import { Ticket, Marquee, Press, Light, Ascent } from './layouts2/set3';
import { Tower, Rings, Ticker, Podium, Stamp } from './layouts2/set4';
import { Tear, Lights, Stars, Bento, Wave } from './layouts2/set5';
import { Passport, Blueprint, Ledger, Cassette, Telegram } from './layouts3/set6';
import { Calendar, Timeline, Orbit, Ribbon, Banner } from './layouts3/set7';
import { Bars, Radar, Gauge, Steps, Scoreboard } from './layouts3/set8';
import { Flip, Docket, Envelope, Flag, Arch } from './layouts3/set9';
import { Lantern, Fan, InkStroke, Mosaic, Glitch } from './layouts3/set10';
import { Neon, Spotlight, Curtain, Split, Mirror } from './layouts3/set11';
import { Stack, Carousel, Magnifier, Wall, Plaque } from './layouts3/set12';
import { Trophy, Laurel, Crystal, Prism, Clock } from './layouts3/set13';
import { Hourglass, Compass, MapRoute } from './layouts3/set14';

export const FPS = 60;
export const DURATION = 482;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const LAYOUTS: Record<
  LayoutKind,
  React.FC<{ p: UniversalProps; s: ReturnType<typeof skinFor>; accent: number; arr: number }>
> = {
  hero: Hero,
  portrait: Portrait,
  metric: MetricHero,
  list: Ranking,
  story: Story,
  medal: Medal,
  cert: Certificate,
  vaxis: Vaxis,
  countdown: Countdown,
  quote: QuotePoster,
  collage: Collage,
  diag: Diag,
  film: Film,
  bcast: Bcast,
  chart: Chart,
  ticket: Ticket,
  marquee: Marquee,
  press: Press,
  light: Light,
  ascent: Ascent,
  tower: Tower,
  rings: Rings,
  ticker: Ticker,
  podium: Podium,
  stamp: Stamp,
  tear: Tear,
  lights: Lights,
  stars: Stars,
  bento: Bento,
  wave: Wave,
  passport: Passport,
  blueprint: Blueprint,
  ledger: Ledger,
  cassette: Cassette,
  telegram: Telegram,
  calendar: Calendar,
  timeline: Timeline,
  orbit: Orbit,
  ribbon: Ribbon,
  banner: Banner,
  bars: Bars,
  radar: Radar,
  gauge: Gauge,
  steps: Steps,
  scoreboard: Scoreboard,
  flip: Flip,
  docket: Docket,
  envelope: Envelope,
  flag: Flag,
  arch: Arch,
  lantern: Lantern,
  fan: Fan,
  ink: InkStroke,
  mosaic: Mosaic,
  glitch: Glitch,
  neon: Neon,
  spotlight: Spotlight,
  curtain: Curtain,
  split: Split,
  mirror: Mirror,
  stack: Stack,
  carousel: Carousel,
  magnifier: Magnifier,
  wall: Wall,
  plaque: Plaque,
  trophy: Trophy,
  laurel: Laurel,
  crystal: Crystal,
  prism: Prism,
  clock: Clock,
  hourglass: Hourglass,
  compass: Compass,
  map: MapRoute,
};

const FAMILY_ORDER = [
  'aurora',
  'chrome',
  'neon',
  'noir',
  'acid',
  'deco',
  'kinetic',
  'stadium',
  'holo',
  'ink',
  'riso',
  'cinema',
  'glass',
];

export const UniversalRoot: React.FC = () => (
  <>
    {FAMILY_ORDER.map((skinId, fi) => {
      const list = TEMPLATES.filter((x) => x.skin === skinId);
      if (!list.length) return null;
      const skin = SKINS[skinId];
      return (
        <Folder key={skinId} name={`${String(fi + 1).padStart(2, '0')}-${skin.en.replace(/\s+/g, '')}`}>
          {list.map((tpl) => {
            const Inner = LAYOUTS[tpl.layout];
            const Comp: React.FC<UniversalProps> = (props) => {
              const accent = props.accent ?? tpl.accent;
              const s = skinFor(tpl.skin, accent);
              return <Inner p={props} s={s} accent={accent} arr={tpl.arr} />;
            };
            // 演示内容三级注入：content/demo.json（按 u01–u65 一套剧情）> 皮肤兜底 > 通用兜底。
            // 文案全部住在 content/demo.json 里：改文案只改这个 JSON，不动任何代码。
            const demo = {
              ...(SKIN_DEMO[tpl.skin] ?? {}),
              ...((CONTENT as Record<string, Partial<UniversalProps>>)[tpl.id] ?? {}),
            };
            return (
              <Composition
                key={tpl.id}
                id={tpl.id}
                component={Comp}
                durationInFrames={DURATION}
                fps={FPS}
                width={WIDTH}
                height={HEIGHT}
                defaultProps={{
                  ...DEFAULT_PROPS,
                  ...demo,
                  accent: tpl.accent,
                  seed: 20260000 + Number(tpl.id.slice(1)) * 97,
                }}
              />
            );
          })}
        </Folder>
      );
    })}
  </>
);
