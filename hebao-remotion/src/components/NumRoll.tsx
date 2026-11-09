import React from 'react';
import { GoldText, Txt } from './GoldText';
import { fmtNum, seg, outExpo } from '../lib/anim';
import type { Theme } from '../theme';

/**
 * 数字滚动 —— 全项目统一实现。
 * 与 HTML 版一致：outExpo 缓动 + 一位小数判定 + 千分位。
 * 所有模板的核心数字都必须走这里，保证「滚数手感」一致。
 */
export const useNum = (target: number, t: number, start: number, dur: number) => {
  const hasDec = target % 1 !== 0;
  const p = outExpo(seg(t, start, start + dur));
  return { text: fmtNum(target * p, hasDec), p, hasDec };
};

export const NumRoll: React.FC<{
  theme: Theme;
  target: number;
  t: number;
  start: number;
  dur?: number;
  size: number;
  /** 数字化尺寸（位数多时自动缩） */
  font?: 'num' | 'serif' | 'sans';
  weight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  unit?: string;
  unitSize?: number;
  unitColor?: string;
  unitWeight?: number;
  style?: React.CSSProperties;
  /** 是否按位数自适应字号（默认开） */
  autoFit?: boolean;
}> = ({
  theme,
  target,
  t,
  start,
  dur = 0.9,
  size,
  font = 'num',
  weight = 700,
  lineHeight,
  letterSpacing = -3,
  unit,
  unitSize,
  unitColor,
  unitWeight = 300,
  style,
  autoFit = true,
}) => {
  const { text, hasDec } = useNum(target, t, start, dur);
  const digits = String(target.toFixed(hasDec ? 1 : 0)).replace('.', '').length;
  const fs =
    autoFit && digits > 4
      ? digits === 5
        ? size * 0.87
        : digits === 6
        ? size * 0.74
        : size * 0.62
      : size;

  const num = (
    <GoldText
      theme={theme}
      size={Math.round(fs)}
      font={font}
      weight={weight}
      lineHeight={lineHeight ?? Math.round(fs * 1.12)}
      letterSpacing={letterSpacing}
    >
      {text}
    </GoldText>
  );

  if (!unit) return <span style={style}>{num}</span>;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, ...style }}>
      {num}
      <Txt
        size={unitSize ?? Math.round(fs * 0.19)}
        color={unitColor ?? `rgba(${theme.soft},0.92)`}
        weight={unitWeight}
        letterSpacing={2}
        lineHeight={Math.round((unitSize ?? fs * 0.19) * 1.35)}
      >
        {unit}
      </Txt>
    </span>
  );
};
