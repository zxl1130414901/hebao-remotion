import React from 'react';
import { goldGradient } from '../lib/anim';
import { FONT_SERIF, type Theme } from '../theme';

/**
 * 竖排文字 —— 竖排书法/金句/姓名共用。
 * 每个字独立挂渐变裁切（HTML 版踩过的坑：父级 clip 传不到 inline-block 子元素）。
 */
export const VText: React.FC<{
  theme: Theme;
  text: string;
  size: number;
  weight?: number;
  letterSpacing?: number;
  lineHeight?: number;
  /** 纯色；不传则用金色渐变 */
  color?: string;
  gold?: boolean;
  /** 整体不透明度 */
  opacity?: number;
  /** 高度：给竖排容器一个明确行高，避免内容顶到不该在的位置 */
  height?: number;
  /** 逐字动画回调 */
  perChar?: (i: number) => React.CSSProperties;
  style?: React.CSSProperties;
}> = ({
  theme,
  text,
  size,
  weight = 700,
  letterSpacing = 0,
  lineHeight = 1.2,
  color,
  gold = false,
  opacity = 1,
  height,
  perChar,
  style,
}) => {
  const chars = Array.from(text || '');
  return (
    <div
      style={{
        writingMode: 'vertical-rl',
        textOrientation: 'upright',
        fontSize: size,
        fontWeight: weight,
        letterSpacing,
        /* 注意：竖排的 lineHeight 语义是「倍数」，绝不能走 lh() 的 px 转换 ——
           1 会被写成 1px，行盒压扁后渐变只剩一条细线（已踩坑验证） */
        lineHeight: typeof lineHeight === 'number' ? String(lineHeight) : lineHeight,
        fontFamily: FONT_SERIF,
        color: gold ? undefined : color,
        height,
        opacity,
        ...style,
      }}
    >
      {gold
        ? chars.map((c, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                backgroundImage: goldGradient(
                  theme.goldA,
                  theme.goldB,
                  theme.goldC,
                  theme.goldD
                ),
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                ...(perChar ? perChar(i) : null),
              }}
            >
              {c}
            </span>
          ))
        : text}
    </div>
  );
};
