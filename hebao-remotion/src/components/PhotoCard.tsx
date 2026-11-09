import React from 'react';
import { Img, staticFile } from 'remotion';
import { rgba } from '../lib/anim';
import type { Theme } from '../theme';

/**
 * 人像卡：金框 + 内衬金线 + 投影。对应 HTML 版 .pcard
 * 未提供照片时回落内置人像，保证任何模板都不会出现空框。
 */
export const PhotoCard: React.FC<{
  theme: Theme;
  src?: string;
  left: number;
  top: number;
  width: number;
  height: number;
  round?: boolean;
  /** 裁切焦点。人像默认 '50% 18%' 之外的模板可自行指定（badge/silk 用 22%） */
  objectPosition?: string;
  style?: React.CSSProperties;
}> = ({ theme, src, left, top, width, height, round, objectPosition = '50% 50%', style }) => {
  const radius = round ? '50%' : 16;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        borderRadius: radius,
        overflow: 'hidden',
        background: rgba(theme.line, 0.12),
        border: `1px solid ${rgba(theme.line, 0.55)}`,
        boxShadow: '0 20px 48px rgba(0,0,0,.38)',
        ...style,
      }}
    >
      <Img
        src={src || staticFile('assets/portrait.png')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          display: 'block',
        }}
      />
      {/* 内衬金线（等价 .pcard::after） */}
      <div
        style={{
          position: 'absolute',
          inset: 9,
          border: `1px solid ${rgba(theme.pale, 0.3)}`,
          borderRadius: round ? '50%' : 10,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
