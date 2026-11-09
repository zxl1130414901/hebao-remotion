import React from 'react';
import { GoldText } from './GoldText';
import { clamp01, lerp, outBack, outExpo, seg } from '../lib/anim';
import type { Theme } from '../theme';

/**
 * 逐字砸落的金色标语 —— 仪式类模板（honor / battle / scroll / medal / silk）共用。
 *
 * HTML 版结构是 #slogan > span×N，靠父级 background-clip:text 一次性上金。
 * 浏览器里行得通，是因为 span 是 inline-block 但 background 继承自父级裁切上下文；
 * React 里每个字必须自己挂渐变，否则第二字起会掉色 —— 这条坑在 GoldText 里统一处理。
 *
 * 动效：outBack(2.2) 从 1.34 倍缩放落到 1，同时从下方 26px 浮起，逐字间隔 stagger 秒。
 */
export const SloganChars: React.FC<{
  theme: Theme;
  t: number;
  text: string;
  top: number;
  height: number;
  size: number;
  lineHeight: number;
  gap?: number;
  /** 首字入场时间 */
  start: number;
  /** 字间间隔 */
  stagger?: number;
  /** 单字入场时长 */
  dur?: number;
}> = ({ theme, t, text, top, height, size, lineHeight, gap = 12, start, stagger = 0.11, dur = 0.3 }) => {
  const chars = Array.from(text || '');
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: 1080,
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap,
      }}
    >
      {chars.map((c, i) => {
        const p = seg(t, start + i * stagger, start + dur + i * stagger);
        return (
          <GoldText
            key={`${c}-${i}`}
            theme={theme}
            size={size}
            weight={700}
            lineHeight={lineHeight}
            style={{
              opacity: clamp01(p * 2.2),
              transform: `scale(${lerp(1.34, 1, outBack(p, 2.2))}) translateY(${
                (1 - outExpo(p)) * 26
              }px)`,
            }}
          >
            {c}
          </GoldText>
        );
      })}
    </div>
  );
};

/** 标语字号按字数收一档，避免 5~6 字自动换行（原版假定 4 字） */
export const sloganSize = (text: string, base: number): number => {
  const n = Array.from(text || '').length;
  if (n <= 4) return base;
  if (n === 5) return Math.round(base * 0.82);
  return Math.round(base * 0.7);
};
