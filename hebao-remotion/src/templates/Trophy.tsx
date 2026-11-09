import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { SloganChapter, NumChapter } from '../components/Chapters';
import { StatsRow } from '../components/StatsRow';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 19 · 金杯荣耀版
 * 叙事：奖杯线稿勾画 → 标语 → 大数字（奖杯缩小上移常驻）→ 三项 → 人物 → 定版
 * 勾线动画用 pathLength=1 + dashoffset 实现（与原 getTotalLength 方案等价）。
 */

const TROPHY_PATHS: { id: string; d: string; circle?: boolean }[] = [
  { id: 'cup', d: 'M120 40 L280 40 C280 150 250 210 200 224 C150 210 120 150 120 40 Z' },
  { id: 'h1', d: 'M120 64 C60 64 52 130 112 150' },
  { id: 'h2', d: 'M280 64 C340 64 348 130 288 150' },
  { id: 'stem', d: 'M200 224 L200 272' },
  { id: 'base1', d: 'M150 272 L250 272 L262 300 L138 300 Z' },
  { id: 'base2', d: 'M112 316 L288 316' },
  { id: 'starp', d: 'M200 96 L212 132 L250 132 L220 154 L231 190 L200 168 L169 190 L180 154 L150 132 L188 132 Z' },
];

export const Trophy: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  /* 奖杯勾线（0.1-1.1s）→ 缩小上移常驻 → 4.2s 后随章退场 */
  const drawP = seg(t, 0.1, 1.1);
  const tshrink = outExpo(seg(t, 1.55, 2.15));
  const trophyOpacity = clamp01(seg(t, 0.08, 0.3)) * (1 - seg(t, 4.2, 4.55));

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 奖杯（不挂在章节里，独立控制缩放与退场） */}
      <div
        style={{
          position: 'absolute',
          left: 340,
          top: 400,
          width: 400,
          height: 420,
          opacity: trophyOpacity,
          transform: `translateY(${lerp(0, -96, tshrink)}px) scale(${lerp(1, 0.52, tshrink)})`,
          filter: `drop-shadow(0 0 18px ${rgba(T.line, 0.35)})`,
        }}
      >
        <svg viewBox="0 0 400 420" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="trophy-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={T.goldB} />
              <stop offset=".55" stopColor={T.goldC} />
              <stop offset="1" stopColor={T.goldD} />
            </linearGradient>
          </defs>
          {TROPHY_PATHS.map((s, i) => {
            const local = clamp01((drawP - i * 0.06) / (1 - i * 0.06));
            return (
              <path
                key={s.id}
                d={s.d}
                pathLength={1}
                fill="none"
                stroke="url(#trophy-gold)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={1}
                strokeDashoffset={(1 - outExpo(local)) * 1}
              />
            );
          })}
        </svg>
      </div>

      {/* 01 标语 */}
      <SloganChapter
        theme={T}
        t={t}
        slogan={p.slogan}
        eyebrow="CHAMPION　TROPHY"
        in={[0.55, 0.88]}
        out={[1.86, 2.16]}
        eyebrowTop={880}
        sloganTop={950}
        size={130}
      />

      {/* 02 大数字 */}
      <NumChapter theme={T} t={t} p={p} in={[2.14, 2.46]} out={[3.54, 3.84]} numSize={260} labelTop={600} numTop={700} deltaTop={1070} />

      {/* 03 三项 */}
      <Chapter t={t} in={[3.68, 4.0]} out={[5.06, 5.36]}>
        <StatsRow theme={T} t={t} stats={p.stats} start={3.8} top={640} height={180} />
      </Chapter>

      {/* 04 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[5.2, 5.52]} out={[6.54, 6.84]} photoTop={200} nameTop={580} roleTop={780} pillTop={892} />

      {/* 05 定版 */}
      <Chapter t={t} in={[6.68, 7.02]}>
        <EndCard theme={T} t={t} start={6.76} p={p} />
      </Chapter>
    </Stage>
  );
};
