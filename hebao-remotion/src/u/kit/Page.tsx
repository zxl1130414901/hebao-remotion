import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import type { Skin } from '../skins';
import { inOut, rgba } from '../lib/anim';
import { useT } from '../lib/useT';

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3'/><feColorMatrix type='saturate' values='0'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='.62'/></svg>\")";

export const Page: React.FC<{
  s: Skin;
  accent: number;
  brand: string;
  dateText: string;
  footnote: string;
  /** 镜头缓推强度：0 = 静止 */
  cam?: number;
  /** 底部与顶部的安全区是否画品牌条 */
  brandBar?: boolean;
  bgm?: string;
  children: React.ReactNode;
}> = ({ s, accent, brand, dateText, footnote, cam = 0.04, brandBar = true, bgm, children }) => {
  const t = useT();
  const dur = 8.03;
  const zoom = 1 + cam * inOut(Math.min(1, t / dur));
  const dx = Math.sin(t * 0.83) * 0.8 + Math.sin(t * 1.37 + 1.1) * 0.5;
  const dy = Math.sin(t * 0.61 + 0.7) * 1.3 + Math.sin(t * 1.09) * 0.5;

  return (
    <AbsoluteFill style={{ background: s.pg, overflow: 'hidden' }}>
      {/* 底 */}
      <AbsoluteFill>{s.bg(t, accent)}</AbsoluteFill>

      {/* 环境光：暗色皮肤底色普遍过深，单看会发闷。
          这里统一压一层极淡的顶光，把暗部抬起来，但不改变色相与对比关系。 */}
      {s.mode === 'dark' ? (
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,.062) 0%, rgba(255,255,255,.024) 48%, rgba(255,255,255,.004) 100%)',
            pointerEvents: 'none',
          }}
        />
      ) : null}

      {/* 内容层：镜头缓推 + 呼吸漂移 */}
      <AbsoluteFill
        style={{
          transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${zoom.toFixed(4)})`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* 皮肤装饰层 */}
      {s.decor ? <AbsoluteFill style={{ pointerEvents: 'none' }}>{s.decor(t, accent)}</AbsoluteFill> : null}

      {brandBar ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 88,
              top: 104,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              opacity: 0.9,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                border: `1.5px solid ${rgba(s.a1, 0.9)}`,
                display: 'grid',
                placeItems: 'center',
                transform: 'rotate(45deg)',
              }}
            >
              <div style={{ width: 8, height: 8, background: s.a1 }} />
            </div>
            <div
              style={{
                fontSize: 28,
                letterSpacing: 4,
                color: s.dim,
                fontWeight: 500,
              }}
            >
              {brand}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 88,
              top: 108,
              fontSize: 24,
              letterSpacing: 5,
              color: s.faint,
              fontFamily: '"Oswald","Noto Sans SC",sans-serif',
            }}
          >
            {dateText}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 88,
              top: 168,
              height: 1,
              width: 904 * Math.min(1, t / 0.9),
              background: `linear-gradient(90deg, ${rgba(s.a1, 0.75)}, ${rgba(s.a1, 0)})`,
            }}
          />
        </>
      ) : null}

      {/* 系列页脚轨：统一 60 套的版式骨架 */}
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 1688,
          width: 904,
          height: 1,
          background: rgba(s.a1, 0.22),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 1704,
          width: 904,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 22,
          letterSpacing: 5,
          color: s.faint,
          fontFamily: '"Oswald","Noto Sans SC",sans-serif',
        }}
      >
        <span>HONOUR SERIES</span>
        <span>{dateText.slice(0, 4)}</span>
        <span>CONGRATULATIONS</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 88,
          bottom: s.footnoteBottom ?? 62,
          fontSize: 24,
          letterSpacing: 1.5,
          color: s.faint,
          maxWidth: 860,
        }}
      >
        {footnote}
      </div>

      {/* 暗角 + 颗粒 */}
      <AbsoluteFill
        style={{
          background:
            s.mode === 'dark'
              ? 'radial-gradient(132% 88% at 50% 44%, transparent 56%, rgba(0,0,0,.22) 100%)'
              : 'radial-gradient(132% 88% at 50% 46%, transparent 52%, rgba(60,45,30,.13) 100%)',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN,
          backgroundPosition: `${(t * 137) % 180}px ${(t * 211) % 180}px`,
          opacity: s.grain,
          mixBlendMode: s.mode === 'dark' ? 'overlay' : 'multiply',
          pointerEvents: 'none',
        }}
      />
      {bgm ? <Audio src={staticFile(bgm)} volume={0.26} /> : null}
    </AbsoluteFill>
  );
};
