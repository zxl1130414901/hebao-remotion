import React from 'react';
import { EASE, clamp01, seg } from '../lib/anim';

/** 场次容器：区间内进出场，透明度 + 位移 + 轻微虚化，避免硬切 */
export const Scene: React.FC<{
  t: number;
  inAt: number;
  outAt?: number;
  y?: number;
  x?: number;
  scale?: number;
  children: React.ReactNode;
}> = ({ t, inAt, outAt, y = 0, x = 0, scale = 1, children }) => {
  const pIn = EASE.enter(seg(t, inAt, inAt + 0.5));
  const pOut = outAt ? EASE.move(seg(t, outAt, outAt + 0.45)) : 0;
  const p = pIn * (1 - pOut);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: clamp01(p),
        transform: `translate(${(1 - pIn) * x + pOut * x * -0.5}px, ${
          (1 - pIn) * y - pOut * 30
        }px) scale(${scale * (0.985 + pIn * 0.015 - pOut * 0.02)})`,
        filter: p < 1 ? `blur(${Math.min(6, (1 - p) * 6)}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};
