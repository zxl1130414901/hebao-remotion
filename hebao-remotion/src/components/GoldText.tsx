import React from 'react';
import { goldGradient } from '../lib/anim';
import { FONT_NUM, FONT_SANS, FONT_SERIF, type Theme } from '../theme';

/**
 * 行高工具：React 中数字 lineHeight 是「倍数」而非像素！
 * 本项目所有尺寸都从 HTML 版的 px 语义迁移而来，
 * 数字一律转成 'Npx' 字符串，杜绝 84 倍行高把文字推出画布的事故。
 */
export const lh = (v: number | string | undefined, fallbackPx: number): string => {
  if (v === undefined || v === null) return `${fallbackPx}px`;
  return typeof v === 'number' ? `${v}px` : v;
};

const familyOf = (font: 'serif' | 'sans' | 'num') =>
  font === 'serif' ? FONT_SERIF : font === 'num' ? FONT_NUM : FONT_SANS;

/**
 * 金色渐变文字。
 * HTML 版踩过的坑：父级 background-clip:text 覆盖不到 inline-block 子元素，
 * 所以每个字必须自己挂渐变 —— 这里每个 GoldText 都是独立的裁切上下文。
 *
 * 红底金字公式（hebao-design skill：三条件缺一必发闷）：
 *   1. 金渐变（本层，底层不变）
 *   2. 1px gold-lo 描边（双层法：底层描边 span 垫底，渐变层盖住描边内半，只留外缘 1px）
 *      —— 仅大字（size>=64）启用，小字描边会糊
 *   3. 投影 0 4px 24px rgba(0,0,0,.35)（drop-shadow 作用在裁切后的像素上）
 */
export const GoldText: React.FC<{
  theme: Theme;
  size: number;
  children: React.ReactNode;
  weight?: number;
  font?: 'serif' | 'sans' | 'num';
  letterSpacing?: number;
  /** 数字按 px 处理（内部自动转字符串） */
  lineHeight?: number | string;
  style?: React.CSSProperties;
}> = ({ theme, size, children, weight = 700, font = 'serif', letterSpacing, lineHeight, style }) => {
  const textStyles: React.CSSProperties = {
    fontSize: size,
    fontWeight: weight,
    lineHeight: lh(lineHeight, Math.round(size * 1.2)),
    fontFamily: familyOf(font),
    fontStretch: font === 'num' ? '87.5%' : undefined,
    letterSpacing,
  };
  const useStroke = size >= 64;
  return (
    <span
      style={{
        position: 'relative',
        /* 投影 + 暖金辉光（bloom，仅大字启用）：让金字从红底上「发亮」而非只「发闷地浮起」 */
        filter: useStroke
          ? 'drop-shadow(0 4px 18px rgba(0,0,0,0.32)) drop-shadow(0 0 26px rgba(255,186,92,0.22))'
          : 'drop-shadow(0 4px 18px rgba(0,0,0,0.32))',
        ...style,
        /* 双层结构命脉：display 必须保持 inline-grid（描底层+渐变层同格堆叠），
           放在 spread 之后防止调用方传 style.display 打散层级 → 空心字 */
        display: 'inline-grid',
      }}
    >
      {useStroke && (
        <span
          aria-hidden
          style={{
            ...textStyles,
            gridArea: '1 / 1',
            color: 'transparent',
            WebkitTextStroke: `1px ${theme.goldD}`,
          }}
        >
          {children}
        </span>
      )}
      <span
        style={{
          ...textStyles,
          gridArea: '1 / 1',
          backgroundImage: goldGradient(theme.goldA, theme.goldB, theme.goldC, theme.goldD),
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** 纯色文字，带字距与字重的常用封装 */
export const Txt: React.FC<{
  children: React.ReactNode;
  size: number;
  color: string;
  weight?: number;
  font?: 'serif' | 'sans' | 'num';
  letterSpacing?: number;
  /** 数字按 px 处理（内部自动转字符串） */
  lineHeight?: number | string;
  style?: React.CSSProperties;
}> = ({ children, size, color, weight = 400, font = 'sans', letterSpacing, lineHeight, style }) => (
  <div
    style={{
      fontSize: size,
      fontWeight: weight,
      lineHeight: lh(lineHeight, Math.round(size * 1.4)),
      fontFamily: familyOf(font),
      fontStretch: font === 'num' ? '87.5%' : undefined,
      letterSpacing,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);
