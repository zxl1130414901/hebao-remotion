import React, { useMemo } from 'react';
import { Img } from 'remotion';
import { rgba } from '../lib/anim';
import type { Theme } from '../theme';

/**
 * 二维码位：220×220 白底卡片，内含 200×200 码。
 * 没有真实二维码时画「占位码」—— 用与原版相同的 LCG 生成，
 * 保证同一帧、任何机器上图案完全一致（Remotion 的确定性要求）。
 */
const N = 25;

const useQrCells = (seed = 88923) =>
  useMemo(() => {
    let s = seed;
    const rnd = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
    const isFinder = (x: number, y: number) =>
      (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
    const cells: [number, number][] = [];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (isFinder(x, y)) continue; // 注意：find 区不消耗随机数，与原算法一致
        if (rnd() > 0.52) cells.push([x, y]);
      }
    }
    return cells;
  }, [seed]);

export const QrBlock: React.FC<{
  theme: Theme;
  left: number;
  top: number;
  src?: string;
  size?: number;
  /** 圆角（invite 用 16px 大码） */
  radius?: number;
  style?: React.CSSProperties;
}> = ({ theme, left, top, src, size = 220, radius = 12, style }) => {
  const cells = useQrCells();
  const inner = size - 20;
  const cell = inner / N;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        borderRadius: radius,
        background: '#fff',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {src ? (
        <Img src={src} style={{ width: inner, height: inner, objectFit: 'contain' }} />
      ) : (
        <svg width={inner} height={inner} viewBox={`0 0 ${N} ${N}`} style={{ display: 'block' }}>
          <rect width={N} height={N} fill="#fff" />
          {cells.map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={1} height={1} fill="#111" />
          ))}
          {/* 三个定位角 */}
          {[
            [0, 0],
            [N - 7, 0],
            [0, N - 7],
          ].map(([ox, oy], i) => (
            <g key={`f${i}`}>
              <rect x={ox} y={oy} width={7} height={7} fill="#111" />
              <rect x={ox + 1} y={oy + 1} width={5} height={5} fill="#fff" />
              <rect x={ox + 2} y={oy + 2} width={3} height={3} fill="#111" />
            </g>
          ))}
        </svg>
      )}
      {/* 与画面呼应的细金边 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          boxShadow: `inset 0 0 0 1px ${rgba(theme.line, 0.5)}`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
