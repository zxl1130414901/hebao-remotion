import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 12 · 五维战力版
 * 叙事：雷达网格逐层亮起 → 五边形弹出 + 维度标签 → 核心数字 → 人物 → 定版
 */
const RC = { cx: 540, cy: 940, R: 310 };
const angOf = (i: number) => ((-90 + i * 72) * Math.PI) / 180;
const ptOn = (i: number, r: number): [number, number] => [
  RC.cx + r * Math.cos(angOf(i)),
  RC.cy + r * Math.sin(angOf(i)),
];

export const Radar: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const data = p.radar ?? [];

  const pr = outBack(seg(t, 0.86, 1.72), 1.5);
  const dataScale = Math.max(0.02, pr);

  const polyPoints = data
    .map((d, i) => ptOn(i, RC.R * d.v).map((n) => n.toFixed(1)).join(','))
    .join(' ');

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 雷达 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        <Txt
          size={34}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={12}
          lineHeight={48}
          style={{
            position: 'absolute',
            top: 238,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.14, 0.44)),
          }}
        >
          五维战力
        </Txt>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={8}
          lineHeight={34}
          style={{
            position: 'absolute',
            top: 292,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.26, 0.54)),
          }}
        >
          OCTOBER 2026 · PERFORMANCE
        </Txt>

        <div style={{ position: 'absolute', inset: 0 }}>
          <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
            {/* 网格 */}
            {[0.25, 0.5, 0.75, 1].map((k, gi) => (
              <polygon
                key={gi}
                points={data
                  .map((_, i) => ptOn(i, RC.R * k).map((n) => n.toFixed(1)).join(','))
                  .join(' ')}
                fill="none"
                stroke={rgba(T.line, 0.22)}
                strokeWidth={1.4}
                opacity={clamp01(seg(t, 0.24 + gi * 0.1, 0.5 + gi * 0.1))}
              />
            ))}
            {/* 轴 */}
            {data.map((_, i) => {
              const q = ptOn(i, RC.R);
              return (
                <line
                  key={i}
                  x1={RC.cx}
                  y1={RC.cy}
                  x2={q[0]}
                  y2={q[1]}
                  stroke={rgba(T.line, 0.2)}
                  strokeWidth={1.4}
                  opacity={clamp01(seg(t, 0.4 + i * 0.05, 0.66 + i * 0.05))}
                />
              );
            })}
            {/* 数据多边形（从中心弹出） */}
            <g
              transform={`translate(540 840) scale(${dataScale}) translate(-540 -840)`}
              opacity={clamp01(seg(t, 0.84, 1.06))}
            >
              <polygon
                points={polyPoints}
                fill={rgba(T.line, 0.2)}
                stroke={T.goldB}
                strokeWidth={3}
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 16px ${rgba(T.line, 0.45)})` }}
              />
              {data.map((d, i) => {
                const q = ptOn(i, RC.R * d.v);
                return <circle key={i} cx={q[0]} cy={q[1]} r={7} fill={T.pale} />;
              })}
            </g>
          </svg>

          {/* 轴标签 */}
          {data.map((d, i) => {
            const q = ptOn(i, RC.R + 72);
            const st = 1.44 + i * 0.09;
            const e = outExpo(seg(t, st, st + 0.32));
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: q[0],
                  top: q[1],
                  width: 280,
                  transform: `translate(-50%,-50%) translateY(${(1 - e) * 16}px)`,
                  textAlign: 'center',
                  opacity: e,
                  whiteSpace: 'nowrap',
                }}
              >
                <Txt size={26} color={rgba(T.soft, 0.88)} weight={400} letterSpacing={5} lineHeight={36}>
                  {d.label}
                </Txt>
                <Txt
                  size={22}
                  color={rgba(T.mist, 0.85)}
                  weight={400}
                  font="num"
                  letterSpacing={2}
                  lineHeight={31}
                  style={{ marginTop: 8 }}
                >
                  {Math.round(d.v * 100)}%
                </Txt>
              </div>
            );
          })}
        </div>
      </Chapter>

      {/* 02 核心数字 */}
      <Chapter t={t} in={[2.46, 2.78]} out={[3.86, 4.16]}>
        <Txt
          size={34}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={6}
          lineHeight={48}
          style={{
            position: 'absolute',
            top: 560,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.52, 2.76)),
            transform: `translateY(${(1 - outExpo(seg(t, 2.52, 2.76))) * 18}px)`,
          }}
        >
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 648,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: outExpo(seg(t, 2.64, 2.9)),
          }}
        >
          <NumRoll
            theme={T}
            target={p.premium}
            t={t}
            start={2.58}
            dur={1.08}
            size={276}
            lineHeight={306}
            unit="万元"
            unitSize={54}
            unitColor={rgba(T.soft, 0.92)}
          />
        </div>
        <Txt
          size={29}
          color={rgba(T.soft, 0.85)}
          letterSpacing={4}
          lineHeight={41}
          style={{
            position: 'absolute',
            top: 1030,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.46, 3.72)),
            transform: `translateY(${(1 - outExpo(seg(t, 3.46, 3.72))) * 18}px)`,
          }}
        >
          {p.delta}
        </Txt>
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.3, 4.62]} out={[5.86, 6.16]} photoTop={200} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <Sfx name="sfx_pop" at={3.28} vol={0.28} />
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
