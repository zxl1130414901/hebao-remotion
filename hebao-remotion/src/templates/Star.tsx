import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumChapter } from '../components/Chapters';
import { StatsRow } from '../components/StatsRow';
import { PersonChapter } from '../components/PersonChapter';
import { Rule } from '../components/Rule';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 20 · 五星认证版
 * 叙事：五星逐颗点亮 + 认证标题 → 大数字 → 三项 → 人物+格言 → 定版
 */

const STARP = 'M65 8 L80.5 46.5 L122 50 L90 76.5 L99.5 117 L65 95 L30.5 117 L40 76.5 L8 50 L49.5 46.5 Z';

export const Star: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 五星 + 认证标题 */}
      <Chapter t={t} in={[0.1, 0.44]} out={[2.0, 2.3]}>
        <div style={{ position: 'absolute', top: 470, width: 1080, display: 'flex', justifyContent: 'center', gap: 26 }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const st = 0.16 + i * 0.13;
            const pr = outBack(seg(t, st, st + 0.32), 2.0);
            return (
              <div
                key={i}
                style={{
                  width: 130,
                  height: 130,
                  opacity: clamp01(seg(t, st, st + 0.18)),
                  transform: `scale(${lerp(0.2, 1, pr)}) rotate(${(1 - pr) * -30}deg)`,
                }}
              >
                <svg viewBox="0 0 130 130" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id={`star-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor={T.goldA} />
                      <stop offset=".4" stopColor={T.goldB} />
                      <stop offset=".65" stopColor={T.goldC} />
                      <stop offset="1" stopColor={T.goldD} />
                    </linearGradient>
                  </defs>
                  <path
                    d={STARP}
                    fill={`url(#star-grad-${i})`}
                    opacity={clamp01(seg(t, st + 0.1, st + 0.3))}
                  />
                  <path d={STARP} fill="none" stroke={rgba(T.line, 0.55)} strokeWidth={3} />
                </svg>
              </div>
            );
          })}
        </div>
        {(() => {
          const pt = outExpo(seg(t, 0.86, 1.2));
          return (
            <GoldText
              theme={T}
              size={92}
              weight={700}
              lineHeight={130}
              letterSpacing={14}
              style={{
                position: 'absolute',
                top: 690,
                left: 0,
                width: 1080,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: pt,
                transform: `translateY(${(1 - pt) * 30}px)`,
              }}
            >
              五星绩优 · 荣耀认证
            </GoldText>
          );
        })()}
        <Txt
          size={28}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={10}
          lineHeight={39}
          style={{
            position: 'absolute',
            top: 860,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 1.06, 1.36)),
          }}
        >
          FIVE　STAR　PERFORMANCE
        </Txt>
        <Rule theme={T} t={t} start={1.26} dur={0.34} left={290} top={950} width={500} opacity={0.6} />
      </Chapter>

      {/* 02 大数字 */}
      <NumChapter theme={T} t={t} p={p} in={[2.14, 2.46]} out={[3.54, 3.84]} numSize={276} />

      {/* 03 三项 */}
      <Chapter t={t} in={[3.68, 4.0]} out={[5.06, 5.36]}>
        <StatsRow theme={T} t={t} stats={p.stats} start={3.8} top={640} height={180} />
      </Chapter>

      {/* 04 人物 + 格言 */}
      <PersonChapter theme={T} t={t} p={p} in={[5.2, 5.52]} out={[6.54, 6.84]} photoTop={200} nameTop={580} roleTop={780} hidePill>
        <Txt
          size={33}
          color={T.cream2}
          weight={300}
          font="serif"
          letterSpacing={4}
          lineHeight={46}
          style={{
            position: 'absolute',
            top: 868,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 5.62, 5.9)),
          }}
        >
          {p.quote || '专业赢得信赖 · 坚持成就卓越'}
        </Txt>
      </PersonChapter>

      {/* 05 定版 */}
      <Chapter t={t} in={[6.68, 7.02]}>
        <EndCard theme={T} t={t} start={6.76} p={p} />
      </Chapter>
    </Stage>
  );
};
