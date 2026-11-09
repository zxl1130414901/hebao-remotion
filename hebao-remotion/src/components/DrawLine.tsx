import React from 'react';
import { seg } from '../lib/anim';
import { EASE } from '../anim/easings';
import { rgba } from '../lib/anim';
import type { Theme } from '../theme';

/**
 * DrawLine —— GSAP DrawSVG「描线生长」的确定性移植（f(帧) 版）。
 *
 * 原理：SVG path 加 pathLength="1"，strokeDasharray=1，
 * strokeDashoffset 从 1 → 0 即「线被画出来」。
 * Chrome 渲染管线（Remotion 同源）对 pathLength 属性支持完好。
 *
 * 三种形状封装：
 *   DrawPath   任意 SVG path（自带 d 的模板用）
 *   DrawCircle 圆环描画 —— 印章圈 / 光环 / 聚焦环
 *   DrawRect   圆角矩形描画 —— 画框 / 证书框 / 边饰
 *
 * 与旧库 Rule（scaleX 生长的渐变线）的区别：
 *   DrawSVG 是「笔尖沿路径走」，端点有推进感；线宽、端帽可控。
 */

export const DrawPath: React.FC<{
  d: string;
  t: number;
  start: number;
  dur?: number;
  color: string;
  strokeWidth?: number;
  /** 端帽：butt 尖 / round 圆 */
  cap?: 'butt' | 'round';
  opacity?: number;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  style?: React.CSSProperties;
  /** 起笔 eased 曲线，默认 EASE.settle（快出缓停，笔速前快后慢） */
  easeFn?: (x: number) => number;
}> = ({
  d,
  t,
  start,
  dur = 0.6,
  color,
  strokeWidth = 2,
  cap = 'round',
  opacity = 1,
  width = 1080,
  height = 1920,
  left = 0,
  top = 0,
  style,
  easeFn = EASE.settle,
}) => {
  const p = easeFn(seg(t, start, start + dur));
  if (p <= 0) return null;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left, top, overflow: 'visible', pointerEvents: 'none', ...style }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap={cap}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.min(1, Math.max(0, p))}
        opacity={opacity}
      />
    </svg>
  );
};

export const DrawCircle: React.FC<{
  /** 圆心（相对 svg 左上角） */
  cx: number;
  cy: number;
  r: number;
  t: number;
  start: number;
  dur?: number;
  color: string;
  strokeWidth?: number;
  opacity?: number;
  /** svg 画布尺寸（要罩住圆即可） */
  box?: number;
  left?: number;
  top?: number;
  style?: React.CSSProperties;
  easeFn?: (x: number) => number;
}> = ({ cx, cy, r, t, start, dur = 0.7, color, strokeWidth = 2, opacity = 1, box = 1080, left = 0, top = 0, style, easeFn }) => {
  const d = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`;
  return (
    <DrawPath
      d={d}
      t={t}
      start={start}
      dur={dur}
      color={color}
      strokeWidth={strokeWidth}
      opacity={opacity}
      width={box}
      height={box}
      left={left}
      top={top}
      style={style}
      easeFn={easeFn}
    />
  );
};

export const DrawRect: React.FC<{
  left: number;
  top: number;
  w: number;
  h: number;
  radius?: number;
  t: number;
  start: number;
  dur?: number;
  color: string;
  strokeWidth?: number;
  opacity?: number;
  style?: React.CSSProperties;
  easeFn?: (x: number) => number;
}> = ({ left, top, w, h, radius = 0, t, start, dur = 0.9, color, strokeWidth = 2, opacity = 1, style, easeFn }) => {
  const r = radius;
  /* 从顶边中点出发顺时针一整圈，视觉上「绕框一周」最对称 */
  const d =
    r > 0
      ? `M ${w / 2} 0 L ${w - r} 0 A ${r} ${r} 0 0 1 ${w} ${r} L ${w} ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} L ${r} ${h} A ${r} ${r} 0 0 1 0 ${h - r} L 0 ${r} A ${r} ${r} 0 0 1 ${r} 0 L ${w / 2} 0`
      : `M ${w / 2} 0 L ${w} 0 L ${w} ${h} L 0 ${h} L 0 0 L ${w / 2} 0`;
  return (
    <DrawPath
      d={d}
      t={t}
      start={start}
      dur={dur}
      color={color}
      strokeWidth={strokeWidth}
      opacity={opacity}
      width={w}
      height={h}
      left={left}
      top={top}
      style={style}
      easeFn={easeFn}
    />
  );
};

/** 主题色快捷：描一圈主题金线的圆环（大量模板会用，提出来省参数） */
export const GoldRing: React.FC<{
  theme: Theme;
  cx: number;
  cy: number;
  r: number;
  t: number;
  start: number;
  dur?: number;
  strokeWidth?: number;
  opacity?: number;
  box?: number;
  left?: number;
  top?: number;
}> = ({ theme, cx, cy, r, t, start, dur = 0.7, strokeWidth = 2, opacity = 0.85, box = 1080, left = 0, top = 0 }) => (
  <DrawCircle
    cx={cx}
    cy={cy}
    r={r}
    t={t}
    start={start}
    dur={dur}
    color={rgba(theme.line, opacity)}
    strokeWidth={strokeWidth}
    opacity={opacity}
    box={box}
    left={left}
    top={top}
  />
);
