import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { SloganChapter } from '../components/Chapters';
import { StatsRow } from '../components/StatsRow';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 26 · 冠军之路版
 * 叙事：标语 → SVG 波线勾画 + 四节点点亮（起步→成长→突破→登顶）→ 三项 → 定版
 */

const CURVE = 'M60 620 C180 620 210 280 340 280 C470 280 480 610 610 610 C700 610 740 300 800 170';
const NODES = [
  { cx: 60, cy: 620, r: 17, end: false },
  { cx: 340, cy: 280, r: 17, end: false },
  { cx: 610, cy: 610, r: 17, end: false },
  { cx: 800, cy: 170, r: 24, end: true },
];
const LABELS = [
  { l: '起步', s: '拜访 60 位客户', lx: 52, ly: 580, sx: 52, sy: 636, st: 2.46 },
  { l: '成长', s: '连续 12 天出单', lx: 362, ly: 230, sx: 362, sy: 286, st: 2.84 },
  { l: '突破', s: '单日 6 件创纪录', lx: 648, ly: 560, sx: 648, sy: 616, st: 3.22 },
  { l: '登顶', s: '达成 218% · 全省前三', lx: 600, ly: 120, sx: 600, sy: 176, st: 3.6 },
];

export const Path: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const drawP = outExpo(seg(t, 2.24, 3.6));

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 标语 */}
      <SloganChapter theme={T} t={t} slogan={p.slogan} eyebrow="ROAD　TO　CHAMPION" in={[0.1, 0.44]} out={[2.0, 2.3]} />

      {/* 02 路径勾画 + 节点亮 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[4.9, 5.2]}>
        <div style={{ position: 'absolute', left: 90, top: 460, width: 900, height: 820 }}>
          <svg viewBox="0 0 900 820" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="path-grad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor={T.goldD} />
                <stop offset=".5" stopColor={T.goldC} />
                <stop offset="1" stopColor={T.goldB} />
              </linearGradient>
            </defs>
            <path
              d={CURVE}
              pathLength={1}
              fill="none"
              stroke="url(#path-grad)"
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={1 - drawP}
            />
            {NODES.map((n, i) => {
              const st = 2.4 + i * 0.38;
              const pr = outBack(seg(t, st, st + 0.3), 2.0);
              return (
                <g
                  key={i}
                  opacity={clamp01(seg(t, st, st + 0.16))}
                  style={{ transform: `scale(${lerp(0.2, 1, pr)})`, transformOrigin: `${n.cx}px ${n.cy}px` }}
                >
                  <circle
                    cx={n.cx}
                    cy={n.cy}
                    r={n.r}
                    fill="none"
                    stroke={n.end ? rgba(T.pale, 0.95) : rgba(T.line, 0.7)}
                    strokeWidth={n.end ? 3 : 2.5}
                  />
                  <circle
                    cx={n.cx}
                    cy={n.cy}
                    r={n.end ? 11 : 7}
                    fill={n.end ? 'url(#path-grad)' : rgba(T.line, 0.25)}
                  />
                </g>
              );
            })}
          </svg>
          {LABELS.map((lb, i) => {
            const pl = outExpo(seg(t, lb.st, lb.st + 0.34));
            const ps = outExpo(seg(t, lb.st + 0.12, lb.st + 0.44));
            return (
              <React.Fragment key={i}>
                <GoldText
                  theme={T}
                  size={31}
                  font="serif"
                  weight={500}
                  letterSpacing={4}
                  lineHeight={43}
                  style={{
                    position: 'absolute',
                    left: lb.lx,
                    top: lb.ly,
                    whiteSpace: 'nowrap',
                    opacity: pl,
                    transform: `translateY(${(1 - pl) * 18}px)`,
                  }}
                >
                  {lb.l}
                </GoldText>
                <Txt
                  size={24}
                  color={rgba(T.soft, 0.85)}
                  weight={300}
                  letterSpacing={2}
                  lineHeight={34}
                  style={{
                    position: 'absolute',
                    left: lb.sx,
                    top: lb.sy,
                    whiteSpace: 'nowrap',
                    opacity: ps,
                  }}
                >
                  {lb.s}
                </Txt>
              </React.Fragment>
            );
          })}
        </div>
      </Chapter>

      {/* 03 三项 */}
      <Chapter t={t} in={[5.22, 5.54]} out={[6.1, 6.4]}>
        <StatsRow theme={T} t={t} stats={p.stats} start={5.28} top={620} height={180} />
      </Chapter>

      {/* 04 定版 */}
      <Chapter t={t} in={[6.54, 6.88]}>
        <EndCard theme={T} t={t} start={6.62} p={p} />
      </Chapter>
    </Stage>
  );
};
