import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 55 · 业绩温度版
 * 叙事：巨型温度计 → 水银柱充能至 218°，刻度逐格点亮，左侧沸点旗标
 *      → 大读数 + 热浪 → 姓名 + 二维码
 */

const MAXD = 240;
const RATE = 218;
const FLAGS = [
  { v: '60°', k: '首单破百', top: 1076 },
  { v: '120°', k: '百件达人', top: 776 },
  { v: '218°', k: '目标达成', top: 486 },
];

export const Thermo: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const heat = outExpo(seg(t, 0.95, 5.0));
  const en = outExpo(seg(t, 5.75, 6.2));
  const pq = outBack(seg(t, 6.05, 6.5), 1.5);

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 0.15, 0.55)),
        }}
      >
        <GoldText theme={T} size={64} weight={600} letterSpacing={14} lineHeight={88}>
          业绩温度计
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
          top: 318,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 0.35, 0.7)),
        }}
      >
        OCTOBER HEAT · {RATE}°C
      </Txt>

      {/* 温度计管 */}
      <div
        style={{
          position: 'absolute',
          left: 420,
          top: 430,
          width: 120,
          height: 980,
          borderRadius: 60,
          border: `3px solid ${rgba(T.line, 0.6)}`,
          background: 'rgba(0,0,0,.35)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: `${(heat * (RATE / MAXD) * 100).toFixed(2)}%`,
            background: `linear-gradient(180deg,${T.goldA} 0%,${T.goldC} 45%,${T.goldD} 100%)`,
            boxShadow: `0 0 26px ${rgba(hexRgb(T.goldB), 0.7)}`,
          }}
        />
      </div>
      {/* 球泡 */}
      <div
        style={{
          position: 'absolute',
          left: 365,
          top: 1370,
          width: 230,
          height: 230,
          borderRadius: '50%',
          border: `3px solid ${rgba(T.line, 0.6)}`,
          background: `radial-gradient(circle at 40% 34%,${T.goldB},${T.goldC} 55%,${T.goldD})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 305,
          top: 1310,
          width: 350,
          height: 350,
          borderRadius: '50%',
          opacity: Math.min(1, 0.4 + 0.3 * Math.abs(Math.sin(t * 4)) + heat * 0.3),
          background: `radial-gradient(circle,${rgba(hexRgb(T.goldB), 0.5)},${rgba(hexRgb(T.goldB), 0)} 66%)`,
        }}
      />

      {/* 刻度 */}
      {Array.from({ length: Math.floor(MAXD / 40) + 1 }, (_, i) => i * 40).map((d) => {
        const y = 980 - (d / MAXD) * 980;
        return (
          <div
            key={d}
            style={{
              position: 'absolute',
              left: 560,
              top: 430 + y,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: heat >= d / MAXD ? 0.9 : 0,
            }}
          >
            <div style={{ width: 34, height: 2, background: rgba(T.line, 0.55) }} />
            <div
              style={{
                fontSize: 24,
                color: rgba(T.soft, 0.8),
                fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
              }}
            >
              {d}°
            </div>
          </div>
        );
      })}

      {/* 沸点旗标 */}
      {FLAGS.map((f, i) => {
        const m = [60 / MAXD, 120 / MAXD, RATE / MAXD][i];
        const e = outExpo(seg(t, 0.95 + m * 4.05, 1.15 + m * 4.05));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 150,
              top: f.top,
              width: 240,
              textAlign: 'right',
              opacity: clamp01(e),
              transform: `translateX(${((1 - e) * -36).toFixed(1)}px)`,
            }}
          >
            <div style={{ fontSize: 34, color: T.bright, fontWeight: 700, lineHeight: '44px' }}>{f.v}</div>
            <Txt size={22} color={rgba(T.soft, 0.85)} weight={300} letterSpacing={2} lineHeight={29} style={{ marginTop: 2 }}>
              {f.k}
            </Txt>
          </div>
        );
      })}

      {/* 读数 */}
      <div
        style={{
          position: 'absolute',
          left: 660,
          top: 900,
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          opacity: clamp01(seg(t, 1.3, 1.7)),
        }}
      >
        <GoldText theme={T} size={150} font="num" lineHeight={170}>
          {Math.round(RATE * heat)}
        </GoldText>
        <span style={{ fontSize: 60, color: T.goldB, fontWeight: 700 }}>°</span>
      </div>
      <Txt
        size={28}
        color={rgba(T.soft, 0.9)}
        weight={300}
        letterSpacing={5}
        lineHeight={40}
        style={{
          position: 'absolute',
          left: 660,
          top: 1080,
          opacity: outExpo(seg(t, 5.0, 5.4)),
        }}
      >
        十月业绩热度 · 持续升温中
      </Txt>

      {/* 热浪 */}
      {[
        { left: 470, top: 1180, w: 140, h: 70 },
        { left: 430, top: 1260, w: 200, h: 90 },
      ].map((w, i) => {
        const cyc = (t * 0.5 + i * 0.5) % 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: w.left,
              top: w.top,
              width: w.w,
              height: w.h,
              borderRadius: '50%',
              filter: 'blur(12px)',
              background: `radial-gradient(circle,${rgba(hexRgb(T.goldB), 0.28)},${rgba(hexRgb(T.goldB), 0)} 70%)`,
              transform: `translateY(${(-cyc * 260).toFixed(0)}px) scale(${(1 + cyc * 0.6).toFixed(2)})`,
              opacity: heat * 0.5 * (1 - cyc),
            }}
          />
        );
      })}

      {/* 收尾 */}
      <Txt
        size={44}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={8}
        lineHeight={60}
        style={{
          position: 'absolute',
          left: 0,
          top: 1690,
          width: 560,
          textAlign: 'center',
          opacity: en,
          transform: `translateY(${((1 - en) * 20).toFixed(1)}px)`,
        }}
      >
        {p.name} · {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={720}
        top={1630}
        size={150}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.05, 6.25)),
          transform: `scale(${lerp(0.85, 1, pq).toFixed(3)})`,
        }}
      />
      <Txt
        size={22}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={3}
        lineHeight={30}
        style={{
          position: 'absolute',
          left: 640,
          top: 1764,
          width: 320,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.35, 6.7)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={6.38} vol={0.3} />
    </Stage>
  );
};
