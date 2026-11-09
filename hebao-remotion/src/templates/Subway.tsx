import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, inOut, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { makePath, type Cubic } from '../lib/curve';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 38 · 荣耀地铁版
 * 叙事：标题 → 线路自下而上勾画（金色渐变描边）→ 站点随勾画点亮
 *      → 列车沿线行驶 → 到站后整幅地图向上驶离 → 终点名牌 + 二维码
 * 原版依赖 SVG getPointAtLength，这里用弧长表解析式采样（见 lib/curve.ts）。
 */

const SEGS: Cubic[] = [
  { p0: { x: 540, y: 1560 }, c1: { x: 490, y: 1330 }, c2: { x: 585, y: 1150 }, p1: { x: 540, y: 940 } },
  { p0: { x: 540, y: 940 }, c1: { x: 500, y: 760 }, c2: { x: 565, y: 600 }, p1: { x: 540, y: 440 } },
];
const PATH = makePath(SEGS);
const D =
  'M540 1560 C 490 1330, 585 1150, 540 940 C 500 760, 565 600, 540 440';

const FR = [0.2, 0.45, 0.7, 1.0];

export const Subway: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const dp = outExpo(seg(t, 0.85, 2.3));
  const u = inOut(seg(t, 1.55, 5.15));

  const mt = outExpo(seg(t, 0.18, 0.55));
  const mt2 = seg(t, 1.6, 2.0);
  const leave = seg(t, 5.2, 5.85);
  const pl = outExpo(seg(t, 5.72, 6.32));
  const pq = outBack(seg(t, 6.22, 6.57), 1.5);

  const train = u > 0.02 ? PATH.at(u) : null;

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 地图层（到站后整幅驶离） */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1 - outExpo(seg(t, 5.3, 5.72)),
          transform: `translateY(${(-outExpo(leave) * 720).toFixed(1)}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 210,
            width: 1080,
            textAlign: 'center',
            opacity: mt * (1 - mt2 * 0.55),
            transform: `translateY(${((1 - mt) * 26).toFixed(1)}px)`,
          }}
        >
          <GoldText theme={T} size={64} weight={600} letterSpacing={14} lineHeight={88}>
            下一站 · 荣耀
          </GoldText>
        </div>
        <Txt
          size={24}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={8}
          lineHeight={34}
          style={{
            position: 'absolute',
            top: 312,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.35, 0.65)) * (1 - mt2 * 0.55),
          }}
        >
          NEXT STATION · GLORY
        </Txt>

        <svg
          width={1080}
          height={1920}
          viewBox="0 0 1080 1920"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <linearGradient id="subwayGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={T.goldA} />
              <stop offset="0.55" stopColor={T.goldC} />
              <stop offset="1" stopColor={T.goldD} />
            </linearGradient>
          </defs>

          {/* 底轨 */}
          <path d={D} fill="none" stroke={rgba(T.line, 0.16)} strokeWidth={10} strokeLinecap="round" />
          {/* 描金生长 */}
          <path
            d={D}
            fill="none"
            stroke="url(#subwayGold)"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={PATH.total}
            strokeDashoffset={PATH.total * (1 - dp)}
          />

          {/* 站点 */}
          {FR.map((f, i) => {
            const st = 0.85 + f * 1.45;
            const e = outBack(seg(t, st, st + 0.3), 1.6);
            const op = clamp01(seg(t, st, st + 0.16));
            const pt = PATH.at(f);
            const last = i === 3;
            const side = i % 2 === 0 ? 1 : -1;
            const tx = pt.x + side * (last ? 150 : 120);
            const anchor = side > 0 ? 'start' : 'end';
            const s = last
              ? { v: fmtNum(p.premium, hasDec), k: '荣耀站 · 保费(万元)' }
              : p.stats[i] ?? { v: '', k: '' };
            return (
              <g
                key={i}
                opacity={op}
                transform={`translate(${pt.x},${pt.y}) scale(${lerp(0.6, 1, e).toFixed(3)}) translate(${-pt.x},${-pt.y})`}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={last ? 20 : 15}
                  fill={T.bg[1]}
                  stroke={T.line}
                  strokeOpacity={0.85}
                  strokeWidth={last ? 5 : 4}
                />
                <circle cx={pt.x} cy={pt.y} r={last ? 9 : 6} fill={T.goldC} />
                <text
                  x={tx}
                  y={pt.y - 58}
                  textAnchor={anchor}
                  fontSize={last ? 44 : 30}
                  letterSpacing={last ? 8 : 4}
                  fontWeight={last ? 600 : 500}
                  fill={last ? T.bright : 'rgba(255,240,200,.92)'}
                >
                  {last ? '荣耀站' : s.k}
                </text>
                <text
                  x={tx}
                  y={pt.y + 2}
                  textAnchor={anchor}
                  fontSize={46}
                  fontWeight={700}
                  fill="url(#subwayGold)"
                  style={{ fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif' }}
                >
                  {s.v}
                </text>
                <text
                  x={tx}
                  y={pt.y + 44}
                  textAnchor={anchor}
                  fontSize={26}
                  letterSpacing={2}
                  fill={rgba(T.soft, 0.8)}
                >
                  {last ? 'TERMINUS' : ''}
                </text>
              </g>
            );
          })}

          {/* 列车 */}
          {train && (
            <>
              <circle cx={train.x} cy={train.y} r={34} fill={rgba(T.goldB, 0.35)} opacity={0.7} />
              <circle
                cx={train.x}
                cy={train.y}
                r={16}
                fill={T.goldB}
                stroke="rgba(0,0,0,.3)"
                strokeWidth={3}
                opacity={0.95}
              />
            </>
          )}
        </svg>
      </div>

      {/* 终点名牌 */}
      <div
        style={{
          position: 'absolute',
          top: 730,
          width: 1080,
          display: 'flex',
          justifyContent: 'center',
          opacity: clamp01(seg(t, 5.72, 5.97)),
          transform: `translateY(${((1 - pl) * 30).toFixed(1)}px)`,
        }}
      >
        <div
          style={{
            padding: '22px 60px',
            border: `2px solid ${rgba(T.line, 0.7)}`,
            borderRadius: 14,
            background: rgba(hexRgb(T.archbg), 0.72),
            textAlign: 'center',
            boxShadow: '0 14px 40px rgba(0,0,0,.4)',
          }}
        >
          <div
            style={{
              fontSize: 54,
              lineHeight: '74px',
              letterSpacing: 10,
              fontWeight: 600,
              color: '#fff',
              fontFamily: '"Noto Serif SC","Songti SC",serif',
            }}
          >
            {p.name}
          </div>
          <Txt
            size={25}
            color={rgba(T.soft, 0.85)}
            weight={300}
            letterSpacing={4}
            lineHeight={36}
            style={{ marginTop: 6 }}
          >
            {p.role}
          </Txt>
        </div>
      </div>

      <QrBlock
        theme={T}
        left={448}
        top={948}
        size={184}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.22, 6.42)),
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
          top: 1172,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.52, 6.82)),
        }}
      >
        {p.qrCap}
      </Txt>
      <Txt
        size={28}
        color={rgba(T.mist, 0.85)}
        weight={300}
        letterSpacing={6}
        lineHeight={40}
        style={{
          position: 'absolute',
          top: 1620,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.72, 7.02)),
        }}
      >
        {p.note}
      </Txt>
        <Sfx name="sfx_chime" at={6.45} vol={0.3} />
    </Stage>
  );
};
