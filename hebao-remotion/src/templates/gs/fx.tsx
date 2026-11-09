import React from 'react';
import { Stage } from '../../components/Stage';
import { SplitReveal } from '../../components/SplitReveal';
import { Txt } from '../../components/GoldText';
import { EASE } from '../../anim/easings';
import { stagger } from '../../anim/stagger';
import { clamp01, lerp, seg, hexRgb } from '../../lib/anim';
import type { Theme } from '../../theme';
import type { HebaoProps } from '../../data/types';

export { EASE, stagger, SplitReveal, clamp01, lerp, seg };

/**
 * 万能色拼装：'r,g,b'（pale/warm/soft/line/mask）与 '#RRGGBB'（goldA~D/cream/archbg）都接受。
 * lib/anim 的 rgba 只做字符串拼接，遇到 hex 会产出非法 CSS 导致整条声明被丢弃——
 * 典藏系列统一用这里这个。
 */
export const rgba = (c: string, a: number): string =>
  c.startsWith('#') ? `rgba(${hexRgb(c)},${a})` : `rgba(${c},${a})`;

/* =====================================================================
 * 典藏系列 · 公共底层件
 *
 * 设计原则（2026-11 二次返工后确立）：
 *  1. 不再提供共享的「数字章/条目章/人物章/定版章」——那正是 20 套
 *     模板千篇一律的根源。每套模板自己决定章节结构与版式锚点。
 *  2. 这里只保留真正底层的东西：节拍基准、舞台框、文字小工具。
 *  3. 清晰度公约：中文正文 ≥ 30px、weight ≥ 400、透明度 ≥ 0.85；
 *     繁杂背景上的文字必须垫暗色衬底（scrim）。
 * ===================================================================== */

/** 节拍基准（秒）。各模板按自己的章节数改写，不必五段俱全 */
export const gsBeats = (o: Record<string, number> = {}) => ({
  hook: 0.12,
  num: 2.1,
  rows: 3.6,
  person: 5.1,
  end: 6.72,
  ...o,
});

/** 典藏系列统一舞台框：brand 顶部居中 + 底部英文小字 */
export const GsStage: React.FC<{
  theme: Theme;
  p: HebaoProps;
  bottomtag?: string;
  children: React.ReactNode;
  bgLayer?: React.ReactNode;
}> = ({ theme, p, bottomtag = 'GOOD　NEWS', children, bgLayer }) => (
  <Stage theme={theme} brand={p.brand} brandTop={104} brandSize={40} bottomtag={bottomtag}>
    {bgLayer}
    {children}
  </Stage>
);

/** 英文装饰 caption（小而清晰：26px / weight 400 / 0.8） */
export const HookCap: React.FC<{
  theme: Theme;
  t: number;
  text: string;
  top: number;
  start: number;
  align?: 'center' | 'left';
  left?: number;
  width?: number;
}> = ({ theme: T, t, text, top, start, align = 'center', left = 0, width = 1080 }) => {
  const e = EASE.enter(seg(t, start, start + 0.36));
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        textAlign: align,
        opacity: e,
        transform: `translateY(${(1 - e) * 14}px)`,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          padding: '6px 22px',
          border: `1px solid ${rgba(T.line, 0.5)}`,
          borderRadius: 999,
          fontSize: 36,
          fontWeight: 400,
          letterSpacing: 7,
          color: rgba(T.pale, 0.92),
          background: `rgba(${T.mask}, 0.3)`,
          fontFamily:
            "'Bahnschrift', 'Oswald', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** 中文章节小标（清晰度公约版：34px / weight 500 / 0.95） */
export const ChapLab: React.FC<{
  theme: Theme;
  t: number;
  text: string;
  top: number;
  start: number;
  align?: 'center' | 'left';
  left?: number;
  width?: number;
}> = ({ theme: T, t, text, top, start, align = 'center', left = 0, width = 1080 }) => {
  const e = EASE.enter(seg(t, start, start + 0.34));
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        textAlign: align,
        opacity: e,
        transform: `translateY(${(1 - e) * 14}px)`,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          fontSize: 48,
          fontWeight: 500,
          letterSpacing: 10,
          lineHeight: '60px',
          color: T.cream,
          textShadow: '0 2px 12px rgba(0,0,0,.45)',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** 暗色衬底（scrim）：放在繁杂背景与文字之间，保证可读性 */
export const Scrim: React.FC<{
  theme: Theme;
  top: number;
  height: number;
  strength?: number;
  horiz?: boolean;
}> = ({ theme: T, top, height, strength = 0.42, horiz = false }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top,
      width: 1080,
      height,
      background: horiz
        ? `linear-gradient(90deg, rgba(${T.mask},${strength}) 0%, rgba(${T.mask},${strength * 0.55}) 60%, rgba(${T.mask},0) 100%)`
        : `linear-gradient(180deg, rgba(${T.mask},0) 0%, rgba(${T.mask},${strength}) 26%, rgba(${T.mask},${strength}) 74%, rgba(${T.mask},0) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** 底部信息带：金线 + 日期文案，填充下半屏空洞的标准收尾件 */
export const FootStrip: React.FC<{
  theme: Theme;
  t: number;
  text: string;
  top: number;
  start: number;
}> = ({ theme: T, t, text, top, start }) => {
  const e = EASE.enter(seg(t, start, start + 0.4));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: 1080,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        opacity: e,
        transform: `translateY(${(1 - e) * 16}px)`,
      }}
    >
      <div style={{ width: 120, height: 1.5, background: `linear-gradient(90deg, ${rgba(T.line, 0)}, ${rgba(T.goldC, 0.7)})` }} />
      <Txt size={44} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={8} lineHeight={44}>
        {text}
      </Txt>
      <div style={{ width: 120, height: 1.5, background: `linear-gradient(90deg, ${rgba(T.goldC, 0.7)}, ${rgba(T.line, 0)})` }} />
    </div>
  );
};
