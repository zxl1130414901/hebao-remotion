import React from 'react';
import { GoldText, Txt } from './GoldText';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import type { Theme } from '../theme';
import type { Stat } from '../data/types';

/**
 * 三项数据行 —— 快闪/票券/多项模板共用的横排数据组（竖分隔线 + 金数字 + 标签）。
 * start 为第一项入场时间，其后每项 +0.16s。
 */
export const StatsRow: React.FC<{
  theme: Theme;
  t: number;
  stats: Stat[];
  start: number;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}> = ({ theme, t, stats, start, top = 770, left = 80, width = 920, height = 150 }) => (
  <div style={{ position: 'absolute', left, top, width, display: 'flex', alignItems: 'center' }}>
    {stats.slice(0, 3).map((st, i) => {
      const st0 = start + i * 0.16;
      const e = outBack(seg(t, st0, st0 + 0.36), 1.5);
      const L = String(st.v).length;
      const fs = L <= 3 ? 92 : L === 4 ? 82 : L === 5 ? 68 : 58;
      return (
        <React.Fragment key={i}>
          {i > 0 && (
            <div
              style={{
                width: 1,
                height,
                background: `linear-gradient(180deg,${rgba(theme.line, 0)},${rgba(
                  theme.line,
                  0.45
                )},${rgba(theme.line, 0)})`,
              }}
            />
          )}
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              opacity: clamp01(seg(t, st0, st0 + 0.16)),
              transform: `translateY(${(1 - outExpo(seg(t, st0, st0 + 0.34))) * 26}px)`,
            }}
          >
            <div style={{ transform: `scale(${lerp(0.86, 1, e)})` }}>
              <GoldText
                theme={theme}
                size={fs}
                font="num"
                weight={700}
                lineHeight={Math.round(fs * 1.16)}
              >
                {st.v}
              </GoldText>
            </div>
            <Txt
              size={26}
              color={rgba(theme.soft, 0.85)}
              weight={300}
              letterSpacing={4}
              lineHeight={36}
              style={{ marginTop: 18 }}
            >
              {st.k}
            </Txt>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);
