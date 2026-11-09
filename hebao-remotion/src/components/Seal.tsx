import React from 'react';
import { rgba } from '../lib/anim';
import type { Theme } from '../theme';
import { FONT_SERIF } from '../theme';

/**
 * 印章 —— 圆章 / 方章 / 骑缝章。
 * 贺报里「仪式感」的主要来源，几乎每套模板的定版都会用到。
 */
export const Seal: React.FC<{
  theme: Theme;
  text: string;
  left: number;
  top: number;
  size: number;
  /** 章面颜色，默认取主题浅金；朱砂章传 '#B22A24' */
  color?: string;
  shape?: 'round' | 'square';
  /** 旋转角度，模拟手盖的歪斜 */
  rotate?: number;
  /** 0~1 盖章进度 */
  p?: number;
  opacity?: number;
  fontSize?: number;
  /** 双圈 */
  doubleRing?: boolean;
}> = ({
  theme,
  text,
  left,
  top,
  size,
  color,
  shape = 'round',
  rotate = -8,
  p = 1,
  opacity = 1,
  fontSize,
  doubleRing = true,
}) => {
  const c = color ?? theme.goldC;
  const fs = fontSize ?? Math.round(size * 0.3);
  const chars = Array.from(text);
  const vertical = chars.length > 2;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        borderRadius: shape === 'round' ? '50%' : 6,
        border: `${Math.max(2, Math.round(size * 0.045))}px solid ${rgba(c, 0.85)}`,
        boxShadow: doubleRing ? `inset 0 0 0 ${Math.max(1, size * 0.012)}px ${rgba(c, 0.35)}` : undefined,
        transform: `rotate(${rotate}deg) scale(${0.72 + 0.28 * p})`,
        opacity: opacity * Math.min(1, p * 3),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mixBlendMode: 'normal',
      }}
    >
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 700,
          fontSize: fs,
          lineHeight: `${Math.round(fs * 1.06)}px`,
          letterSpacing: vertical ? 0 : 2,
          color: rgba(c, 0.95),
          textAlign: 'center',
          writingMode: vertical ? 'vertical-rl' : 'horizontal-tb',
          height: vertical ? undefined : 'auto',
        }}
      >
        {text}
      </div>
    </div>
  );
};
