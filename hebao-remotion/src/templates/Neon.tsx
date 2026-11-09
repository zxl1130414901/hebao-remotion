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
 * 48 · 霓虹招牌版
 * 叙事：夜街墙面 → 招牌框弹出 → 霓虹大字逐管点亮（启动抖闪）
 *      → 灯管数字框亮保费 → 手写体名牌 → 霓虹框二维码
 */

const ON = [0.85, 1.23, 1.61, 1.99];

export const Neon: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const chars = Array.from((p.slogan || '捷报频传').slice(0, 4));

  const bd = outBack(seg(t, 0.3, 0.8), 1.4);
  const tb = outBack(seg(t, 3.15, 3.6), 1.4);
  const qb = outBack(seg(t, 5.6, 6.1), 1.5);

  const neonShadow = `0 0 8px ${rgba(hexRgb(T.goldB), 0.9)},0 0 30px ${rgba(
    hexRgb(T.goldC),
    0.75
  )},0 0 80px ${rgba(hexRgb(T.goldC), 0.45)}`;

  return (
    <Stage theme={T} brand={p.brand}>
      {/* 夜街墙面 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'brightness(.6)',
          background: `linear-gradient(180deg,${T.archbg} 0%,${T.bg[1]} 60%,${T.archbg} 100%)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(0deg,transparent 0 118px,rgba(255,255,255,.035) 118px 122px),repeating-linear-gradient(90deg,transparent 0 236px,rgba(255,255,255,.03) 236px 240px)',
          }}
        />
      </div>

      {/* 主招牌 */}
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 330,
          width: 820,
          height: 470,
          borderRadius: 26,
          border: `4px solid ${rgba(hexRgb(T.goldB), 0.75)}`,
          boxShadow: `0 0 34px ${rgba(hexRgb(T.goldB), 0.45)}, inset 0 0 34px ${rgba(
            hexRgb(T.goldB),
            0.22
          )}`,
          opacity: clamp01(seg(t, 0.3, 0.55)),
          transform: `scale(${lerp(0.92, 1, bd).toFixed(3)})`,
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 78, width: '100%', textAlign: 'center' }}>
          {chars.map((c, i) => {
            const on = ON[i];
            let op = 0;
            if (t >= on) {
              const age = t - on;
              op = age < 0.35 ? (Math.sin(age * 46 + i * 2) > -0.2 ? 1 : 0.12) : 0.92 + 0.08 * Math.sin(t * 2 + i);
            }
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontSize: 158,
                  lineHeight: '206px',
                  fontWeight: 700,
                  margin: '0 8px',
                  color: T.goldB,
                  fontFamily: '"Noto Serif SC","Songti SC",serif',
                  textShadow: neonShadow,
                  opacity: op,
                }}
              >
                {c}
              </span>
            );
          })}
        </div>
        <Txt
          size={24}
          color={rgba(hexRgb(T.goldB), 0.85)}
          weight={400}
          letterSpacing={12}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 330,
            width: '100%',
            textAlign: 'center',
            opacity: clamp01(seg(t, 2.5, 2.9)) * (0.8 + 0.2 * Math.sin(t * 3)),
          }}
        >
          GOOD NEWS · NEON SIGN
        </Txt>
      </div>

      {/* 灯管数字框 */}
      <div
        style={{
          position: 'absolute',
          left: 230,
          top: 900,
          width: 620,
          height: 300,
          borderRadius: 20,
          border: `3px solid ${rgba(hexRgb(T.goldB), 0.7)}`,
          boxShadow: `0 0 26px ${rgba(hexRgb(T.goldB), 0.4)}, inset 0 0 26px ${rgba(
            hexRgb(T.goldB),
            0.18
          )}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: clamp01(seg(t, 3.15, 3.4)),
          transform: `scale(${lerp(0.94, 1, tb).toFixed(3)})`,
        }}
      >
        <div
          style={{
            fontSize: 120,
            lineHeight: '140px',
            color: T.goldB,
            fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
            fontWeight: 700,
            textShadow: `0 0 10px ${rgba(hexRgb(T.goldB), 0.95)},0 0 44px ${rgba(hexRgb(T.goldC), 0.7)}`,
            opacity: clamp01(seg(t, 3.45, 3.75)) * (0.9 + 0.1 * Math.abs(Math.sin(t * 13))),
          }}
        >
          {fmtNum(p.premium * outExpo(seg(t, 3.5, 4.4)), hasDec)}
        </div>
        <Txt size={26} color={rgba(hexRgb(T.goldB), 0.9)} weight={300} letterSpacing={8} lineHeight={36}>
          {p.dlabel}
        </Txt>
      </div>

      {/* 手写名牌 */}
      <div
        style={{
          position: 'absolute',
          top: 1270,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 4.65, 5.1)),
          transform: `translateY(${((1 - outExpo(seg(t, 4.65, 5.05))) * 24).toFixed(1)}px)`,
        }}
      >
        <span
          style={{
            fontSize: 64,
            lineHeight: '86px',
            letterSpacing: 6,
            color: T.goldB,
            fontStyle: 'italic',
            fontWeight: 600,
            fontFamily: '"Noto Serif SC","Songti SC",serif',
            textShadow: `0 0 12px ${rgba(hexRgb(T.goldB), 0.85)},0 0 44px ${rgba(hexRgb(T.goldC), 0.5)}`,
          }}
        >
          {p.name}
        </span>
      </div>
      <Txt
        size={25}
        color={rgba(hexRgb(T.goldB), 0.8)}
        weight={300}
        letterSpacing={6}
        lineHeight={36}
        style={{
          position: 'absolute',
          top: 1366,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 4.9, 5.3)),
        }}
      >
        {p.role} · 十月之星
      </Txt>

      {/* 霓虹二维码框 */}
      <div
        style={{
          position: 'absolute',
          left: 408,
          top: 1440,
          width: 264,
          height: 264,
          borderRadius: 18,
          border: `3px solid ${rgba(hexRgb(T.goldB), 0.75)}`,
          boxShadow: `0 0 22px ${rgba(hexRgb(T.goldB), 0.45)}`,
          opacity: clamp01(seg(t, 5.6, 5.85)),
          transform: `scale(${lerp(0.9, 1, qb).toFixed(3)})`,
        }}
      >
        <QrBlock theme={T} left={26} top={26} size={212} src={p.qr} radius={10} />
      </div>
      <Txt
        size={26}
        color={rgba(hexRgb(T.goldB), 0.9)}
        weight={300}
        letterSpacing={4}
        lineHeight={36}
        style={{
          position: 'absolute',
          top: 1742,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.0, 6.35)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={0.68} vol={0.3} />
    </Stage>
  );
};
