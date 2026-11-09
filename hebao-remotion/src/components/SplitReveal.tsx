import React from 'react';
import { GoldText } from './GoldText';
import { clamp01, lerp, seg } from '../lib/anim';
import { EASE } from '../anim/easings';
import { stagger } from '../anim/stagger';
import { FONT_NUM, FONT_SANS, FONT_SERIF } from '../theme';
import type { Theme } from '../theme';

/**
 * SplitReveal —— GSAP SplitText「逐字揭示」的确定性移植（f(帧) 纯函数版）。
 *
 * 三种揭示模式：
 *   mask  遮罩上升：每个字从下方 overflow 遮罩里升上来（SplitText mask:"chars" 手法）
 *   drop  砸落定版：字从上方带过冲砸下，冲击感强，贺报巨字主力
 *   pop   弹性亮相：小字/标签的果冻式 pop（EASE.glam）
 *
 * 与旧库 SloganChars（整字 scale 1.34 落下）的区别：
 *   mask 有「从看不见到看得见」的揭示感；错位间隔默认 0.05s 更密，
 *   逐字节奏由 staggerEach 统一控制；支持 center/edges 错位方向。
 */

const familyOf = (font: 'serif' | 'sans' | 'num') =>
  font === 'serif' ? FONT_SERIF : font === 'num' ? FONT_NUM : FONT_SANS;

export type SplitMode = 'mask' | 'drop' | 'pop';

export const SplitReveal: React.FC<{
  theme: Theme;
  t: number;
  text: string;
  size: number;
  top: number;
  /** 首字入场时刻（秒） */
  start: number;
  mode?: SplitMode;
  /** 字间错位（秒） */
  staggerEach?: number;
  /** 单字动画时长（秒） */
  dur?: number;
  /** 错位方向：start 顺序 / center 从中心炸开 / edges 两端向心 */
  staggerMode?: 'start' | 'center' | 'edges';
  /** 金渐变金字；false 时用纯色 color */
  gold?: boolean;
  color?: string;
  weight?: number;
  font?: 'serif' | 'sans' | 'num';
  letterSpacing?: number;
  lineHeight?: number;
  width?: number;
  left?: number;
  align?: 'center' | 'left';
  style?: React.CSSProperties;
}> = ({
  theme,
  t,
  text,
  size,
  top,
  start,
  mode = 'mask',
  staggerEach = 0.05,
  dur = 0.42,
  staggerMode = 'start',
  gold = true,
  color,
  weight = 700,
  font = 'serif',
  letterSpacing,
  lineHeight,
  width = 1080,
  left = 0,
  align = 'center',
  style,
}) => {
  const chars = Array.from(text || '');
  const n = chars.length;
  const gap = letterSpacing ?? Math.round(size * 0.1);
  const lh = lineHeight ?? Math.round(size * 1.18);
  const family = familyOf(font);

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height: lh,
        display: 'flex',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        alignItems: 'center',
        gap,
        ...style,
      }}
    >
      {chars.map((c, i) => {
        const d = stagger(i, n, { mode: staggerMode, each: staggerEach });
        const st = start + d;
        const p = seg(t, st, st + dur);

        if (mode === 'mask') {
          const e = EASE.enter(p);
          /* transform 必须挂在独立包裹层上 —— 若直接通过 style 传给 GoldText
             会覆盖其 display:inline-grid，打散描边/渐变双层结构（渐变层被
             overflow:hidden 裁掉，只剩空心描边） */
          const inner = gold ? (
            <span style={{ display: 'block', transform: `translateY(${(1 - e) * 108}%)` }}>
              <GoldText theme={theme} size={size} weight={weight} font={font} lineHeight={lh}>
                {c}
              </GoldText>
            </span>
          ) : (
            <span
              style={{
                display: 'block',
                fontSize: size,
                fontWeight: weight,
                lineHeight: `${lh}px`,
                fontFamily: family,
                color,
                transform: `translateY(${(1 - e) * 108}%)`,
              }}
            >
              {c}
            </span>
          );
          return (
            <span
              key={`${c}-${i}`}
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                width: size,
                height: lh,
                textAlign: 'center',
                lineHeight: `${lh}px`,
                opacity: clamp01(p * 6),
              }}
            >
              {inner}
            </span>
          );
        }

        if (mode === 'drop') {
          const e = EASE.hook(p);
          const settle = EASE.settle(p);
          const body = gold ? (
            <GoldText
              theme={theme}
              size={size}
              weight={weight}
              font={font}
              lineHeight={lh}
            >
              {c}
            </GoldText>
          ) : (
            <span
              style={{
                fontSize: size,
                fontWeight: weight,
                lineHeight: `${lh}px`,
                fontFamily: family,
                color,
              }}
            >
              {c}
            </span>
          );
          return (
            <span
              key={`${c}-${i}`}
              style={{
                display: 'inline-block',
                opacity: clamp01(p * 4),
                transform: `translateY(${lerp(-lh * 0.85, 0, settle)}px) scale(${lerp(1.42, 1, e)})`,
                transformOrigin: '50% 80%',
              }}
            >
              {body}
            </span>
          );
        }

        /* pop */
        const e = EASE.glam(p);
        const body = gold ? (
          <GoldText theme={theme} size={size} weight={weight} font={font} lineHeight={lh}>
            {c}
          </GoldText>
        ) : (
          <span
            style={{
              fontSize: size,
              fontWeight: weight,
              lineHeight: `${lh}px`,
              fontFamily: family,
              color,
            }}
          >
            {c}
          </span>
        );
        return (
          <span
            key={`${c}-${i}`}
            style={{
              display: 'inline-block',
              opacity: clamp01(p * 5),
              transform: `scale(${lerp(0.42, 1, e)})`,
            }}
          >
            {body}
          </span>
        );
      })}
    </div>
  );
};
