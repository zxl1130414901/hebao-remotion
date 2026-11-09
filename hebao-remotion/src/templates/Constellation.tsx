import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 54 · 星座加冕版
 * 叙事：夜空 → 三组小星座依次连线点亮（星点弹出 + 数值标注）
 *      → 压轴连出王冠星座 → 荣耀名号 + 保费 → 二维码
 */

type Group = {
  pts: [number, number][];
  label?: string;
  crown?: boolean;
  st: number;
};

const GROUPS: Group[] = [
  { pts: [[170, 560], [260, 500], [350, 560], [300, 650]], label: '承保件数', st: 1.15 },
  { pts: [[760, 470], [850, 430], [930, 500], [880, 590]], label: '目标达成率', st: 1.95 },
  { pts: [[130, 900], [230, 860], [300, 940], [210, 1010]], label: '全省排名', st: 2.75 },
  {
    pts: [[390, 760], [450, 640], [540, 560], [630, 640], [690, 760], [600, 820], [480, 820]],
    crown: true,
    st: 3.7,
  },
];

const polyLen = (pts: [number, number][]) => {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return l;
};

export const Constellation: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const cl = outExpo(seg(t, 5.15, 5.65));
  const pq = outBack(seg(t, 6.6, 7.0), 1.5);

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false} particleCount={60}>
      {/* 夜空 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg,#060913 0%,${T.bg[1]} 55%,${T.bg[2]} 100%)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 70% 20%,rgba(255,255,255,.06),transparent 55%)',
          }}
        />
      </div>

      {/* 星座 */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        {GROUPS.map((gr, gi) => {
          const closed = !!gr.crown;
          const d =
            gr.pts.map((pt, i) => `${i ? 'L' : 'M'}${pt[0]} ${pt[1]}`).join(' ') + (closed ? ' Z' : '');
          const len = polyLen(gr.pts) + (closed ? Math.hypot(gr.pts[0][0] - gr.pts[gr.pts.length - 1][0], gr.pts[0][1] - gr.pts[gr.pts.length - 1][1]) : 0);
          const drawP = outExpo(seg(t, gr.st, gr.st + (gr.crown ? 1.3 : 0.7)));
          const val = gr.crown ? '' : p.stats[gi]?.v ?? '';
          const lab = gr.crown ? '' : p.stats[gi]?.k ?? gr.label ?? '';
          return (
            <g key={gi}>
              <path
                d={d}
                fill="none"
                stroke={rgba(hexRgb(T.goldC), 0.85)}
                strokeWidth={2}
                style={{
                  filter: `drop-shadow(0 0 5px ${rgba(hexRgb(T.goldC), 0.7)})`,
                  strokeDasharray: len,
                  strokeDashoffset: len * (1 - drawP),
                }}
              />
              {gr.pts.map((pt, i) => {
                const st = gr.st + 0.15 * i;
                const e = outBack(seg(t, st, st + 0.4), 2);
                const tw = 0.6 + 0.4 * Math.sin(t * 3 + i * 2);
                return (
                  <circle
                    key={i}
                    cx={pt[0]}
                    cy={pt[1]}
                    r={gr.crown ? 7 : 5}
                    fill={T.pale}
                    opacity={clamp01(seg(t, st, st + 0.3)) * tw}
                    transform={`translate(${pt[0]} ${pt[1]}) scale(${lerp(0.2, 1, e).toFixed(
                      3
                    )}) translate(${-pt[0]} ${-pt[1]})`}
                    style={{ filter: `drop-shadow(0 0 6px ${rgba(T.pale, 0.9)})` }}
                  />
                );
              })}
              {!gr.crown && (
                <>
                  <text
                    x={gr.pts[0][0] - 10}
                    y={gr.pts[3][1] + 70}
                    fontSize={44}
                    fontWeight={700}
                    fill={T.goldB}
                    fontFamily='"Oswald","Bahnschrift","Arial Narrow",sans-serif'
                    opacity={outExpo(seg(t, gr.st + 0.5, gr.st + 0.9))}
                  >
                    {val}
                  </text>
                  <text
                    x={gr.pts[0][0] - 10}
                    y={gr.pts[3][1] + 108}
                    fontSize={26}
                    letterSpacing={3}
                    fill={rgba(T.soft, 0.95)}
                    opacity={outExpo(seg(t, gr.st + 0.5, gr.st + 0.9))}
                  >
                    {lab}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* 皇冠名号 + 保费 */}
      <div
        style={{
          position: 'absolute',
          top: 1180,
          width: 1080,
          textAlign: 'center',
          opacity: cl,
          transform: `translateY(${((1 - cl) * 26).toFixed(1)}px)`,
        }}
      >
        <GoldText theme={T} size={52} weight={600} letterSpacing={12} lineHeight={72}>
          荣耀星座 · 加冕
        </GoldText>
      </div>
      <Txt
        size={26}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={6}
        lineHeight={36}
        style={{
          position: 'absolute',
          top: 1264,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 5.4, 5.8)),
        }}
      >
        CONSTELLATION OF HONOR
      </Txt>
      <div
        style={{
          position: 'absolute',
          top: 1340,
          width: 1080,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 14,
          opacity: clamp01(seg(t, 5.6, 5.9)),
        }}
      >
        <GoldText theme={T} size={110} font="num" lineHeight={126}>
          {fmtNum(p.premium * outExpo(seg(t, 5.65, 6.45)), hasDec)}
        </GoldText>
        <Txt size={28} color={rgba(T.soft, 0.9)} weight={300} letterSpacing={4} lineHeight={40}>
          万元 · 个人承保保费
        </Txt>
      </div>

      {/* 收尾 */}
      <QrBlock
        theme={T}
        left={448}
        top={1500}
        size={170}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.6, 6.8)),
          transform: `scale(${lerp(0.85, 1, pq).toFixed(3)})`,
        }}
      />
      <Txt
        size={24}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 1710,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.9, 7.25)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={6.88} vol={0.3} />
    </Stage>
  );
};
