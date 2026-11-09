import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { StatsRow } from '../components/StatsRow';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 10 · 仪表冲刺版
 * 叙事：半圆仪表盘刻度逐根亮起 → 指针扫至达成率 → 三项 → 人物 → 定版
 */
const TICKS = Array.from({ length: 41 }, (_, i) => {
  const a = Math.PI + (i * Math.PI) / 40;
  const major = i % 5 === 0;
  const r1 = major ? 290 : 306;
  return {
    major,
    x1: 450 + r1 * Math.cos(a),
    y1: 470 + r1 * Math.sin(a),
    x2: 450 + 330 * Math.cos(a),
    y2: 470 + 330 * Math.sin(a),
    i,
  };
});

export const Gauge: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const pprog = outExpo(seg(t, 0.52, 2.04));
  const raw = p.stats[1]?.v ?? '218%';
  const val = parseFloat(String(raw).match(/[\d.]+/)?.[0] ?? '218') || 218;

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 仪表 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        <Txt
          size={34}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={12}
          lineHeight={48}
          style={{
            position: 'absolute',
            top: 262,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.14, 0.44)),
          }}
        >
          {p.dlabel}
        </Txt>

        <div style={{ position: 'absolute', left: 90, top: 430, width: 900, height: 520 }}>
          <svg viewBox="0 0 900 520" width={900} height={520}>
            <path
              d="M120 470 A330 330 0 0 1 780 470"
              fill="none"
              stroke={rgba(T.line, 0.16)}
              strokeWidth={3}
              pathLength={1000}
            />
            <path
              d="M120 470 A330 330 0 0 1 780 470"
              fill="none"
              stroke={T.goldB}
              strokeWidth={10}
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray={`${pprog * 1000} 1000`}
              style={{ filter: `drop-shadow(0 0 14px ${rgba(T.line, 0.6)})` }}
            />
            {TICKS.map((tk) => (
              <line
                key={tk.i}
                x1={tk.x1}
                y1={tk.y1}
                x2={tk.x2}
                y2={tk.y2}
                stroke={tk.major ? rgba(T.pale, 0.8) : rgba(T.line, 0.42)}
                strokeWidth={tk.major ? 3 : 2}
                strokeLinecap="round"
                opacity={clamp01(seg(t, 0.18 + tk.i * 0.01, 0.28 + tk.i * 0.01))}
              />
            ))}
            <g transform={`rotate(${pprog * 180} 450 470)`}>
              <line
                x1={450}
                y1={470}
                x2={168}
                y2={470}
                stroke={rgba(T.pale, 0.95)}
                strokeWidth={5}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 12px ${rgba(T.line, 0.95)})` }}
              />
            </g>
            <circle cx={450} cy={470} r={15} fill={rgba(T.line, 0.2)} stroke={T.pale} strokeWidth={2} />
            <circle cx={450} cy={470} r={5} fill={T.pale} />
            <text x={118} y={508} fontSize={22} letterSpacing={2} fill={rgba(T.mist, 0.55)}>
              0
            </text>
            <text x={782} y={508} fontSize={22} letterSpacing={2} fill={rgba(T.mist, 0.55)} textAnchor="end">
              250%
            </text>
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 700,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.34, 0.6)),
          }}
        >
          <GoldText theme={T} size={186} font="num" weight={700} lineHeight={196} letterSpacing={-4}>
            {Math.round(val * pprog) + '%'}
          </GoldText>
        </div>
        <Txt
          size={31}
          color={rgba(T.soft, 0.9)}
          weight={300}
          letterSpacing={9}
          lineHeight={43}
          style={{
            position: 'absolute',
            top: 918,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.62, 0.92)),
          }}
        >
          目标达成率
        </Txt>
        <Txt
          size={27}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={38}
          style={{
            position: 'absolute',
            top: 1008,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 1.62, 1.92)),
            transform: `translateY(${(1 - outExpo(seg(t, 1.62, 1.92))) * 18}px)`,
          }}
        >
          {p.delta}
        </Txt>
      </Chapter>

      {/* 02 三项 */}
      <Chapter t={t} in={[2.46, 2.78]} out={[3.86, 4.16]}>
        <StatsRow theme={T} t={t} stats={p.stats} start={2.54} />
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.3, 4.62]} out={[5.86, 6.16]} photoTop={200} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <Sfx name="sfx_pop" at={1.95} vol={0.3} />
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
