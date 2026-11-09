import React from 'react';
import { chOut } from '../lib/anim';
import { Sfx } from './Sfx';

/**
 * 章节容器：把「入场 / 退场」收进一个组件，模板正文只关心章节内动效。
 * 出入场曲线与 HTML 版 chOut 完全一致（translateY + 轻微 scale）。
 * 章节允许时间重叠 —— 上一章退场与下一章入场交叉 0.1~0.2s 是刻意设计。
 * 每章入场自动带一道轻 whoosh（广播包装的转场呼吸），音量刻意压低不抢底乐。
 */
export const Chapter: React.FC<{
  t: number;
  in: [number, number];
  out?: [number, number];
  /** 章节转场音效名，传 false 关掉 */
  sfx?: string | false;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ t, in: inRange, out, sfx = 'sfx_whoosh', children, style }) => {
  const { opacity, transform } = chOut(t, inRange, out);
  /* 入场亮度脉冲：0.28s 内从 1.3 收回 1，配合 whoosh 形成「光擦过」的转场质感 */
  const inPulse = Math.max(0, 1 - (t - inRange[0]) / 0.28);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transform,
        filter: inPulse > 0.01 ? `brightness(${(1 + 0.3 * inPulse).toFixed(3)})` : undefined,
        willChange: 'transform,opacity',
        ...style,
      }}
    >
      {sfx && <Sfx name={sfx} at={inRange[0]} vol={0.16} />}
      {children}
    </div>
  );
};

/** 章节内的「元素入场」小工具：淡入 + 上浮 */
export const rise = (t: number, start: number, dur: number, dist = 20) => {
  const p = Math.max(0, Math.min(1, (t - start) / dur));
  const e = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
  return { opacity: p * 1, transform: `translateY(${(1 - e) * dist}px)` };
};

/** 绝对定位盒子（1080×1920 坐标系，与 HTML 版一致） */
export const Box: React.FC<{
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ left = 0, top, width = 1080, height, children, style }) => (
  <div style={{ position: 'absolute', left, top, width, height, ...style }}>{children}</div>
);
