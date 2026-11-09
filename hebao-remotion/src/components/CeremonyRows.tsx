import React from 'react';
import { GoldText } from './GoldText';
import { outExpo, rgba, seg } from '../lib/anim';
import type { Theme } from '../theme';
import type { Stat } from '../data/types';

/**
 * 仪式类「荣录条目」—— battle / scroll / medal / silk 共用，两种版式：
 *   between：左右对齐 + 底部细金线（battle / scroll / medal，战报列表感）
 *   center ：居中竖排「标签在上、数字在下」（silk，喜报文体感）
 * 时间轴统一为 start + i×stagger，逐行上浮。
 */
export const CeremonyRows: React.FC<{
  theme: Theme;
  t: number;
  stats: Stat[];
  tops: number[];
  start: number;
  stagger?: number;
  dur?: number;
  align?: 'between' | 'center';
  left?: number;
  width?: number;
  labelSize: number;
  labelSpacing: number;
  valueSize: number;
  valueLineHeight: number;
  /** between 模式下的底部分隔线 */
  hairline?: boolean;
}> = ({
  theme: T,
  t,
  stats,
  tops,
  start,
  stagger = 0.24,
  dur = 0.3,
  align = 'between',
  left = 150,
  width = 780,
  labelSize,
  labelSpacing,
  valueSize,
  valueLineHeight,
  hairline = true,
}) => (
  <>
    {stats.slice(0, 3).map((st, i) => {
      const st0 = start + i * stagger;
      const p = outExpo(seg(t, st0, st0 + dur));
      const top = tops[i] ?? tops[0] + i * 196;

      if (align === 'center') {
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top,
              width: 1080,
              textAlign: 'center',
              opacity: p,
              transform: `translateY(${(1 - p) * 34}px)`,
            }}
          >
            <div
              style={{
                fontSize: labelSize,
                letterSpacing: labelSpacing,
                textIndent: labelSpacing,
                color: rgba(T.mist, 1),
                fontWeight: 300,
                lineHeight: 1.4,
              }}
            >
              {st.k}
            </div>
            <GoldText theme={T} size={valueSize} font="num" weight={700} lineHeight={valueLineHeight}>
              {st.v}
            </GoldText>
          </div>
        );
      }

      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left,
            top,
            width,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottom: hairline ? `1px solid ${rgba(T.line, 0.25)}` : undefined,
            paddingBottom: hairline ? 22 : 0,
            opacity: p,
            transform: `translateY(${(1 - p) * 34}px)`,
          }}
        >
          <div
            style={{
              fontSize: labelSize,
              letterSpacing: labelSpacing,
              color: rgba(T.mist, 1),
              fontWeight: 300,
              lineHeight: 1.4,
            }}
          >
            {st.k}
          </div>
          <div
            style={{
              fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
              fontStretch: '87.5%',
              fontWeight: 700,
              fontSize: valueSize,
              lineHeight: `${valueLineHeight}px`,
              letterSpacing: -1,
              color: st.hl ? T.bright : '#fff',
            }}
          >
            {st.v}
          </div>
        </div>
      );
    })}
  </>
);

/** 列表顶部的短金线（battle/scroll/medal 用） */
export const RowHead: React.FC<{
  theme: Theme;
  t: number;
  start: number;
  left: number;
  top: number;
  width: number;
}> = ({ theme: T, t, start, left, top, width }) => {
  const p = outExpo(seg(t, start, start + 0.32));
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height: 1,
        background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(T.pale, 0.45)},${rgba(
          T.pale,
          0
        )})`,
        transform: `scaleX(${p})`,
        opacity: outExpo(seg(t, start, start + 0.2)),
      }}
    />
  );
};
