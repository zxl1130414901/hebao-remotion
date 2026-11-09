import React from 'react';
import { rgba, seg, outExpo } from '../lib/anim';
import type { Theme } from '../theme';

/**
 * 金线 —— 所有模板里的分隔/装饰线统一走这里。
 * 默认两端淡出（贺报里最耐看的处理），支持按时间生长。
 */
export const Rule: React.FC<{
  theme: Theme;
  /** 进度时间点；不传则常显 */
  t?: number;
  start?: number;
  dur?: number;
  left?: number;
  top: number;
  width: number;
  height?: number;
  /** 方向：横线从左/中生长，竖线从上 */
  from?: 'center' | 'left' | 'top';
  opacity?: number;
  solid?: boolean;
  color?: string;
  style?: React.CSSProperties;
}> = ({
  theme,
  t,
  start = 0,
  dur = 0.4,
  left,
  top,
  width,
  height = 1,
  from = 'center',
  opacity = 0.6,
  solid = false,
  color,
  style,
}) => {
  const p = t === undefined ? 1 : outExpo(seg(t, start, start + dur));
  const c = color ?? theme.pale;
  const bg = solid
    ? rgba(c, opacity)
    : height > 1
    ? `linear-gradient(180deg,${rgba(c, 0)},${rgba(c, opacity)},${rgba(c, 0)})`
    : `linear-gradient(90deg,${rgba(c, 0)},${rgba(c, opacity)},${rgba(c, 0)})`;

  const isVertical = height > 1;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        background: bg,
        transform: isVertical || from === 'top' ? `scaleY(${p})` : `scaleX(${p})`,
        transformOrigin:
          from === 'left' ? '0% 50%' : from === 'top' ? '50% 0%' : '50% 50%',
        ...style,
      }}
    />
  );
};
