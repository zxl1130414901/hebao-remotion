/**
 * 质感纹理库（纯 SVG data-uri，无外部图片、零版权风险）
 * 与 Stage 的胶片颗粒同一实现思路 —— 以 URL 常量 + CSS 叠层使用。
 */
import React from 'react';
import { makeRng } from '../lib/anim';
import type { Theme } from '../theme';

/** 纸张纤维纹理：细密定向噪纹，叠在纸面/信纸/存折上模拟真实纸张 */
export const PAPER_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.18' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.22  0 0 0 0.5 0'/></filter><rect width='220' height='220' filter='url(%23p)'/></svg>\")";

/** 印油斑驳 mask：粗糙斑块（油墨不均），叠在印章上做「盖印」质感 */
export const INK_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='i'><feTurbulence type='fractalNoise' baseFrequency='0.09' numOctaves='4' seed='11'/><feComponentTransfer><feFuncA type='discrete' tableValues='0 0 0 0.55 0.85 1 1'/></feComponentTransfer></filter><rect width='300' height='300' filter='url(%23i)'/></svg>\")";

/** 纸面凹痕（压印）：低频柔和凹凸，模拟章压下去时纸面的轻微形变 */
export const EMBOSS_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='e'><feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='3' seed='23'/><feDiffuseLighting lighting-color='%23ffffff' surfaceScale='1.4'><feDistantLight azimuth='235' elevation='58'/></feDiffuseLighting></filter><rect width='260' height='260' filter='url(%23e)'/></svg>\")";

/** 印章压印层：叠加印油斑驳 + 边缘微溢，给任何圆形章一个「真盖章」质感。
 *  用法：放进章的圆形容器内，inset:0 绝对定位。
 *  <StampInk color="rgba(154,24,24,0.9)" /> */
export const StampInk: React.FC<{ color?: string; opacity?: number }> = ({
  color = 'rgba(120, 18, 18, 0.85)',
  opacity = 0.5,
}) => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        backgroundImage: INK_URL,
        backgroundSize: 'cover',
        opacity,
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }}
    />
    {/* 纸面凹痕：章周围一圈轻微下压的光影 */}
    <div
      style={{
        position: 'absolute',
        inset: -14,
        borderRadius: '50%',
        boxShadow:
          'inset 0 0 26px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.05), 1px 2px 10px rgba(60,8,8,0.14)',
        pointerEvents: 'none',
      }}
    />
    {/* 印油颜色层：极淡地补一层章色，让斑驳吃在章色上 */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: `radial-gradient(circle at 42% 38%, ${color} 0%, rgba(0,0,0,0) 82%)`,
        opacity: 0.16,
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }}
    />
  </>
);

/** 金色粒子爆开：巨字砸落/盖章定音的瞬时火花（确定性 seed，帧纯函数）。
 *  用法：放在画面容器内，<GoldBurst theme={T} t={t} t0={0.08} cx={540} cy={560} /> */
export const GoldBurst: React.FC<{
  theme: Theme;
  t: number;
  /** 爆开时刻（秒） */
  t0: number;
  cx: number;
  cy: number;
  count?: number;
  /** 最大扩散半径 px */
  spread?: number;
  /** 持续时长（秒） */
  dur?: number;
  seed?: number;
}> = ({ theme, t, t0, cx, cy, count = 26, spread = 260, dur = 0.9, seed = 77 }) => {
  const p = (t - t0) / dur;
  if (p <= 0 || p >= 1) return null;
  const ease = 1 - Math.pow(1 - p, 3);
  const rnd = makeRng(seed);
  const dots = [];
  for (let i = 0; i < count; i++) {
    const ang = (i / count) * Math.PI * 2 + rnd() * 0.5;
    const sp = 0.55 + rnd() * 0.45;
    const d = spread * sp * ease;
    const sz = 2.5 + rnd() * 4;
    const x = cx + Math.cos(ang) * d;
    const y = cy + Math.sin(ang) * d + 70 * p * p * sp; // 轻微重力下坠
    const op = (1 - p) * (0.5 + rnd() * 0.45);
    dots.push({ x, y, sz, op, warm: rnd() > 0.4 });
  }
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: d.x,
            top: d.y,
            width: d.sz,
            height: d.sz,
            borderRadius: '50%',
            background: d.warm ? theme.goldB : theme.goldD,
            boxShadow: `0 0 ${d.sz * 2.2}px ${theme.goldA}`,
            opacity: d.op,
            filter: 'blur(0.4px)',
          }}
        />
      ))}
    </div>
  );
};
