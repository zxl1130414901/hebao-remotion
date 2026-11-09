import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { VText } from '../components/VerticalText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 47 · 剪纸窗花版
 * 叙事：挂穗垂落 → 对联对开滑入 → 花窗六瓣旋转收拢 + 圆环生长 + 照片圆显
 *      → 横批 + 名条 → 定版
 */

const PETALS = [1, 2, 3, 4, 5, 6];

export const Papercut: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const eL = outExpo(seg(t, 0.75, 1.35));
  const eR = outExpo(seg(t, 0.95, 1.55));
  const wr = outExpo(seg(t, 1.95, 2.55));
  const wp = outExpo(seg(t, 2.15, 2.75));
  const hc = outBack(seg(t, 2.95, 3.45), 1.5);
  const pl = outExpo(seg(t, 3.3, 3.85));
  const pq = outBack(seg(t, 5.9, 6.35), 1.5);

  const couplet = (text: string): React.CSSProperties => ({
    position: 'absolute',
    top: 330,
    width: 150,
    height: 820,
    background: rgba(hexRgb(T.archbg), 0.72),
    border: `2px solid ${rgba(hexRgb(T.goldC), 0.8)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  return (
    <Stage theme={T} brand={p.brand}>
      {/* 挂穗 */}
      {[80, 986].map((left, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left,
            top: 120,
            width: 14,
            height: 150,
            borderRadius: 7,
            background: `linear-gradient(180deg,${T.goldC},${rgba(hexRgb(T.goldC), 0)})`,
            opacity: clamp01(seg(t, 0.25, 0.45)),
            transform: `translateY(${((1 - outBack(seg(t, 0.25, 0.7), 1.5)) * -120).toFixed(1)}px)`,
            transformOrigin: '50% 0',
          }}
        />
      ))}

      {/* 对联 */}
      <div style={{ ...couplet(p.slogan), left: 120, opacity: clamp01(eL), transform: `translateX(${((1 - eL) * -360).toFixed(1)}px)` }}>
        <VText theme={T} text="一元复始开新宇" size={44} weight={600} letterSpacing={18} gold />
      </div>
      <div style={{ ...couplet(p.slogan), left: 810, opacity: clamp01(eR), transform: `translateX(${((1 - eR) * 360).toFixed(1)}px)` }}>
        <VText theme={T} text="万象更新展宏图" size={44} weight={600} letterSpacing={18} gold />
      </div>

      {/* 花窗 */}
      <div
        style={{
          position: 'absolute',
          left: 290,
          top: 400,
          width: 500,
          height: 500,
          opacity: clamp01(seg(t, 1.35, 1.6)),
        }}
      >
        {PETALS.map((i) => {
          const st = 1.35 + (i - 1) * 0.1;
          const e = outBack(seg(t, st, st + 0.46), 1.5);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 120,
                height: 250,
                margin: '-125px 0 0 -60px',
                border: `2px solid ${rgba(hexRgb(T.goldC), 0.85)}`,
                borderRadius: '50% 50% 50% 50%/60% 60% 40% 40%',
                opacity: clamp01(seg(t, st, st + 0.2)),
                transform: `rotate(${i * 60}deg) scale(${lerp(0.4, 1, e).toFixed(3)})`,
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 40,
            width: 420,
            height: 420,
            borderRadius: '50%',
            border: `3px solid ${rgba(hexRgb(T.goldC), 0.95)}`,
            boxShadow: `0 0 40px ${rgba(hexRgb(T.goldB), 0.35)}`,
            opacity: wr,
            transform: `scale(${lerp(1.3, 1, wr).toFixed(3)})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 70,
            top: 70,
            width: 360,
            height: 360,
            borderRadius: '50%',
            border: `1px solid ${rgba(hexRgb(T.goldC), 0.5)}`,
            opacity: wr * 0.8,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 95,
            top: 95,
            width: 310,
            height: 310,
            borderRadius: '50%',
            overflow: 'hidden',
            clipPath: `circle(${(wp * 50).toFixed(2)}% at 50% 50%)`,
          }}
        >
          <Img
            src={p.photo || staticFile('assets/portrait.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* 横批 */}
      <div
        style={{
          position: 'absolute',
          left: 340,
          top: 980,
          width: 400,
          height: 92,
          borderRadius: 8,
          background: `linear-gradient(160deg,${T.goldC},${T.goldD})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: clamp01(seg(t, 2.95, 3.15)),
          transform: `translateY(${((1 - hc) * -60).toFixed(1)}px)`,
        }}
      >
        <span
          style={{
            fontSize: 44,
            letterSpacing: 14,
            fontWeight: 700,
            fontFamily: '"Noto Serif SC","Songti SC",serif',
            color: rgba(hexRgb(T.goldA), 0.98),
          }}
        >
          喜庆丰年
        </span>
      </div>

      {/* 名条 */}
      <div
        style={{
          position: 'absolute',
          left: 190,
          top: 1120,
          width: 700,
          height: 150,
          border: `2px solid ${rgba(hexRgb(T.goldC), 0.75)}`,
          borderRadius: 12,
          background: rgba(hexRgb(T.archbg), 0.66),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 44px',
          opacity: clamp01(pl),
          transform: `translateY(${((1 - pl) * 40).toFixed(1)}px)`,
        }}
      >
        <Txt size={52} color="#fff" weight={600} font="serif" letterSpacing={8} lineHeight={72}>
          {p.name}
        </Txt>
        <div style={{ textAlign: 'right' }}>
          <Txt size={24} color={rgba(T.soft, 0.85)} weight={300} letterSpacing={3} lineHeight={36}>
            {p.role}
          </Txt>
          <Txt size={24} color={rgba(T.soft, 0.85)} weight={300} letterSpacing={3} lineHeight={36}>
            保费 {fmtNum(p.premium, p.premium % 1 !== 0)} 万
          </Txt>
        </div>
      </div>

      {/* 定版 */}
      <QrBlock
        theme={T}
        left={448}
        top={1330}
        size={180}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 5.9, 6.12)),
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
          top: 1550,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.25, 6.6)),
        }}
      >
        {p.qrCap}
      </Txt>
      <Txt
        size={24}
        color={rgba(T.mist, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 1650,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.45, 6.8)),
        }}
      >
        {p.note}
      </Txt>
        <Sfx name="sfx_chime" at={3.30} vol={0.3} />
    </Stage>
  );
};
