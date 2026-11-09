import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 44 · 户外大屏版
 * 叙事：大屏通电闪烁亮起（亮度抖动）→ 跑马灯滚动 + 扫描线 → 巨幅数字点亮
 *      → 底部三项 + 城市剪影 → 人物「城市封面」+ 二维码
 */

const PANEL_L = 90;
const PANEL_T = 230;
const PANEL_W = 900;
const PANEL_H = 800;

/** 城市剪影（与原版同坐标） */
const BUILDINGS = [
  { x: 20, y: 180, w: 130, h: 560 },
  { x: 180, y: 90, w: 100, h: 650 },
  { x: 310, y: 230, w: 140, h: 510 },
  { x: 480, y: 40, w: 120, h: 700 },
  { x: 630, y: 160, w: 110, h: 580 },
  { x: 770, y: 250, w: 150, h: 490 },
  { x: 950, y: 120, w: 110, h: 620 },
];
const WINDOWS = [
  [40, 220],
  [80, 260],
  [210, 140],
  [240, 200],
  [520, 90],
  [560, 150],
  [660, 210],
  [800, 300],
  [980, 170],
];

export const Led: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const tick = `热烈祝贺 ${p.name} 十月保费 ${fmtNum(p.premium, hasDec)} 万 · 达成 ${
    p.stats[1]?.v ?? '218%'
  } · 全省第三 · 泰康养老 · `;
  const tickW = Math.max(2400, tick.length * 46);

  const power = clamp01(seg(t, 0.35, 0.95));
  const flick = power < 1 ? (Math.sin(t * 53) > Math.sin(t * 7) ? 0.25 : 1) * power : 1;

  const bn = outExpo(seg(t, 1.1, 2.2));
  const en = outExpo(seg(t, 5.6, 6.1));
  const pq = outBack(seg(t, 6.2, 6.6), 1.5);

  return (
    <Stage theme={T} brand={p.brand}>
      {/* 城市剪影（置底） */}
      <svg
        width={1080}
        height={740}
        viewBox="0 0 1080 740"
        style={{
          position: 'absolute',
          left: 0,
          top: 1180,
          opacity: clamp01(seg(t, 0.6, 1.2)),
        }}
      >
        <g fill={rgba(T.line, 0.1)}>
          {BUILDINGS.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} />
          ))}
        </g>
        <g fill={rgba(hexRgb(T.goldB), 0.35)}>
          {WINDOWS.map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={10} height={10} />
          ))}
        </g>
      </svg>

      {/* 支架 */}
      <div
        style={{
          position: 'absolute',
          left: 430,
          top: 1030,
          width: 220,
          height: 180,
          opacity: clamp01(seg(t, 0.5, 1.0)),
          background: `linear-gradient(180deg,${rgba(T.line, 0.4)},${rgba(T.line, 0.08)})`,
          clipPath: 'polygon(18% 0,82% 0,64% 100%,36% 100%)',
        }}
      />

      {/* 大屏 */}
      <div
        style={{
          position: 'absolute',
          left: PANEL_L,
          top: PANEL_T,
          width: PANEL_W,
          height: PANEL_H,
          borderRadius: 18,
          border: `10px solid ${rgba(T.line, 0.28)}`,
          background: rgba(hexRgb(T.archbg), 0.96),
          boxShadow: `0 30px 90px rgba(0,0,0,.55), 0 0 60px ${rgba(hexRgb(T.goldB), 0.18)}`,
          overflow: 'hidden',
          opacity: Math.min(1, power * 1.1),
          filter: `brightness(${(0.8 + 0.2 * flick).toFixed(3)})`,
        }}
      >
        {/* 跑马灯 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: 86,
            borderBottom: `2px solid ${rgba(hexRgb(T.goldC), 0.4)}`,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              whiteSpace: 'nowrap',
              fontSize: 38,
              letterSpacing: 6,
              color: T.goldB,
              textShadow: `0 0 14px ${rgba(hexRgb(T.goldB), 0.8)}`,
              fontWeight: 600,
              transform: `translateX(${(-((t * 150) % tickW)).toFixed(1)}px)`,
            }}
          >
            {tick}
          </div>
        </div>

        {/* 巨幅数字 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 120,
            width: '100%',
            height: 430,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <div style={{ opacity: bn * (0.88 + 0.12 * Math.abs(Math.sin(t * 11))) }}>
            <div
              style={{
                fontSize: 230,
                lineHeight: '250px',
                letterSpacing: -4,
                color: T.goldB,
                fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
                fontWeight: 700,
                textShadow: `0 0 24px ${rgba(hexRgb(T.goldB), 0.9)}, 0 0 70px ${rgba(
                  hexRgb(T.goldC),
                  0.5
                )}`,
              }}
            >
              {fmtNum(p.premium * bn, hasDec)}
            </div>
          </div>
          <Txt size={34} color={rgba(T.pale, 0.85)} weight={400} letterSpacing={10} lineHeight={46}>
            {p.dlabel}
          </Txt>
        </div>

        {/* 底部三项 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 110,
            borderTop: `2px solid ${rgba(hexRgb(T.goldC), 0.4)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          {p.stats.slice(0, 3).map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 44,
                  color: T.goldB,
                  fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
                  fontWeight: 700,
                  textShadow: `0 0 12px ${rgba(hexRgb(T.goldB), 0.7)}`,
                  lineHeight: '54px',
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: 3,
                  color: rgba(T.pale, 0.6),
                  lineHeight: '28px',
                }}
              >
                {s.k}
              </div>
            </div>
          ))}
        </div>

        {/* LED 点阵 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle,rgba(0,0,0,.5) 1.4px,transparent 1.6px)',
            backgroundSize: '9px 9px',
          }}
        />
        {/* 扫描线 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            height: 120,
            top: ((t * 260) % 920) - 120,
            background: `linear-gradient(180deg,rgba(255,255,255,0),${rgba(T.pale, 0.07)},rgba(255,255,255,0))`,
          }}
        />
      </div>

      {/* 收尾 */}
      <Txt
        size={54}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={10}
        lineHeight={74}
        style={{
          position: 'absolute',
          top: 1230,
          width: 1080,
          textAlign: 'center',
          opacity: en,
          transform: `translateY(${((1 - en) * 24).toFixed(1)}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={26}
        color={rgba(T.soft, 0.9)}
        weight={300}
        letterSpacing={4}
        lineHeight={36}
        style={{
          position: 'absolute',
          top: 1316,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 5.85, 6.3)),
        }}
      >
        {p.role} · 本月城市封面人物
      </Txt>
      <QrBlock
        theme={T}
        left={455}
        top={1400}
        size={170}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.2, 6.4)),
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
          top: 1608,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.5, 6.85)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={0.5} vol={0.28} />
        <Sfx name="sfx_pop" at={2.0} vol={0.3} />
    </Stage>
  );
};
