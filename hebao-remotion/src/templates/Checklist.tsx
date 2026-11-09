import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { Txt } from '../components/GoldText';
import { NumChapter } from '../components/Chapters';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, hexRgb, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 13 · 战果清单版
 * 叙事：清单标题 → 四条战果逐条打勾 → 核心数字 → 人物 → 定版
 */
export const Checklist: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);

  const rows = [
    ...(p.stats ?? []).slice(0, 3),
    { k: p.dlabel || '个人承保保费', v: `${p.premium.toFixed(p.premium % 1 !== 0 ? 1 : 0)} 万` },
  ];

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 清单 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        <Txt
          size={66}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={10}
          lineHeight={92}
          style={{
            position: 'absolute',
            left: 120,
            top: 286,
            opacity: outExpo(seg(t, 0.12, 0.42)),
            transform: `translateY(${(1 - outExpo(seg(t, 0.12, 0.42))) * 22}px)`,
          }}
        >
          {'十月战果'}
        </Txt>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={8}
          lineHeight={36}
          style={{ position: 'absolute', left: 122, top: 376, opacity: outExpo(seg(t, 0.24, 0.5)) }}
        >
          CHECKLIST · 逐条清零
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 452,
            width: 840,
            height: 1,
            background: `linear-gradient(90deg,${rgba(T.line, 0.5)},${rgba(T.line, 0.08)})`,
            transform: `scaleX(${outExpo(seg(t, 0.3, 0.72))})`,
            transformOrigin: '0 50%',
          }}
        />

        {rows.map((st, i) => {
          const st0 = 0.42 + i * 0.3;
          const e = outExpo(seg(t, st0, st0 + 0.34));
          const tick = outExpo(seg(t, st0 + 0.16, st0 + 0.5));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 120,
                top: 452 + i * 150,
                width: 840,
                height: 150,
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                opacity: e,
                transform: `translateX(${(1 - e) * 46}px)`,
              }}
            >
              {/* 行分隔线 */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  height: 1,
                  background: `linear-gradient(90deg,${rgba(T.line, 0.26)},${rgba(T.line, 0.04)})`,
                }}
              />
              <svg width={54} height={54} viewBox="0 0 56 56" style={{ flex: 'none' }}>
                <rect
                  x={3}
                  y={3}
                  width={50}
                  height={50}
                  rx={11}
                  fill={rgba(T.line, 0.06)}
                  stroke={rgba(T.line, e > 0.6 ? 0.85 : 0.5)}
                  strokeWidth={2}
                />
                <path
                  d="M15 29 L24 38 L41 17"
                  fill="none"
                  stroke={T.goldB}
                  strokeWidth={5.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={100}
                  strokeDashoffset={100 * (1 - tick)}
                  pathLength={100}
                  style={{ filter: `drop-shadow(0 0 8px ${rgba(T.line, 0.7)})` }}
                />
              </svg>
              <Txt size={38} color={rgba(cream, 0.9)} letterSpacing={5} lineHeight={53}>
                {st.k}
              </Txt>
              <Txt
                size={String(st.v).length <= 4 ? 42 : String(st.v).length === 5 ? 36 : 30}
                color={T.bright}
                weight={700}
                font="num"
                letterSpacing={1}
                lineHeight={59}
                style={{ marginLeft: 'auto' }}
              >
                {st.v}
              </Txt>
            </div>
          );
        })}

        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 120,
            top: 1092,
            width: 840,
            textAlign: 'right',
            opacity: outExpo(seg(t, 1.82, 2.1)),
          }}
        >
          全部达成 · 无一项落空
        </Txt>
      </Chapter>

      {/* 02 核心数字 */}
      <NumChapter theme={T} t={t} p={p} in={[2.46, 2.78]} out={[3.86, 4.16]} />

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.3, 4.62]} out={[5.86, 6.16]} photoTop={200} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
