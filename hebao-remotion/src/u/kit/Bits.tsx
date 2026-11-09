import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import type { Skin } from '../skins';
import { EASE, clamp01, fitSize, rgba, seg } from '../lib/anim';

/* ── 通用入场容器 ─────────────────────────────────────── */
export const Reveal: React.FC<{
  t: number;
  start: number;
  dur?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ t, start, dur = 0.6, y = 24, children, style }) => {
  const p = EASE.enter(seg(t, start, start + dur));
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * y}px)`,
        filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ── 细线 ─────────────────────────────────────────────── */
export const Rule: React.FC<{
  s: Skin;
  t: number;
  x: number;
  y: number;
  w: number;
  start: number;
  vertical?: boolean;
  color?: string;
  thick?: number;
}> = ({ s, t, x, y, w, start, vertical = false, color, thick = 1 }) => {
  const p = EASE.move(seg(t, start, start + 0.7));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: vertical ? thick : w,
        height: vertical ? w : thick,
        background: color ?? rgba(s.a1, 0.55),
        transform: vertical ? `scaleY(${p})` : `scaleX(${p})`,
        transformOrigin: vertical ? 'top' : 'left',
      }}
    />
  );
};

/* ── 音效 ─────────────────────────────────────────────── */
const SFX: Record<string, string> = {
  whoosh: 'assets/sfx/sfx_whoosh.wav',
  impact: 'assets/sfx/sfx_gong.wav',
  chime: 'assets/sfx/sfx_chime.wav',
  pop: 'assets/sfx/sfx_pop.wav',
  shimmer: 'assets/sfx/sfx_shimmer.wav',
  stamp: 'assets/sfx/sfx_stamp.wav',
};

export const Sfx: React.FC<{ name: keyof typeof SFX | string; at: number; vol?: number }> = ({
  name,
  at,
  vol = 0.3,
}) => {
  const { fps } = useVideoConfig();
  const from = Math.round(at * fps);
  return (
    <Sequence from={from} durationInFrames={Math.round(fps * 1.6)} layout="none">
      <Audio src={staticFile(SFX[name] ?? SFX.chime)} volume={vol} />
    </Sequence>
  );
};

/* ── 首字母徽记 / 人像位 ───────────────────────────────── */
export const Monogram: React.FC<{
  s: Skin;
  t: number;
  text: string;
  cx: number;
  cy: number;
  r: number;
  start: number;
  accent: number;
}> = ({ s, t, text, cx, cy, r, start, accent }) => {
  const p = EASE.pop(seg(t, start, start + 0.9));
  const ring = EASE.move(seg(t, start + 0.1, start + 1.3));
  // 徽记取「姓 + 名首字」两个字：只取首字时，三字名会在圆里显示一个巨大单字，
  // 既压不住圆心也像没填完；两字徽记才像一枚正经印章。占位符「某某」同理。
  const isPh = text.trim().startsWith('某某');
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).join('');
  const ch = isPh ? '某某' : cjk.slice(0, 2) || text.slice(0, 1).toUpperCase();
  return (
    <div style={{ position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `1px solid ${rgba(s.a1, 0.55 * ring)}`,
          transform: `scale(${0.7 + ring * 0.3})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 16,
          borderRadius: '50%',
          border: `1px solid ${rgba(s.a1, 0.3)}`,
          transform: `scale(${p})`,
          opacity: p,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${p})`,
          opacity: clamp01(seg(t, start + 0.2, start + 0.7)),
          borderRadius: '50%',
          background:
            accent === 2
              ? `radial-gradient(circle at 34% 28%, ${rgba(s.a2, 0.55)} 0%, ${rgba(s.a1, 0.18)} 52%, rgba(0,0,0,0) 74%)`
              : `radial-gradient(circle at 34% 28%, ${rgba(s.a1, 0.5)} 0%, ${rgba(s.a2, 0.16)} 52%, rgba(0,0,0,0) 74%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif',
          fontSize: Math.round(r * (isPh ? 0.52 : ch.length > 1 ? 0.55 : 0.72)),
          letterSpacing: isPh ? 6 : ch.length > 1 ? 2 : 0,
          fontWeight: 700,
          color: s.ink,
          opacity: p,
          transform: `scale(${0.86 + p * 0.14})`,
          textShadow: `0 0 60px ${rgba(s.a1, 0.5)}`,
        }}
      >
        {ch}
      </div>
      {/* 旋转铭牌 */}
      <div
        style={{
          position: 'absolute',
          inset: -22,
          borderRadius: '50%',
          border: `1px dashed ${rgba(s.a1, 0.3)}`,
          transform: `rotate(${t * 18}deg)`,
          opacity: 0.7,
        }}
      />
    </div>
  );
};

/* ── 印章 ─────────────────────────────────────────────── */
export const Seal: React.FC<{
  s: Skin;
  t: number;
  x: number;
  y: number;
  size?: number;
  chars?: [string, string];
  start: number;
}> = ({ s, t, x, y, size = 132, chars = ['恭', '贺'], start }) => {
  const p = EASE.pop(seg(t, start, start + 0.5));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        border: `5px solid ${s.a1}`,
        borderRadius: 6,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        justifyItems: 'center',
        color: s.a1,
        fontFamily: '"Noto Serif SC",serif',
        fontWeight: 700,
        fontSize: Math.round(size * 0.34),
        lineHeight: 1,
        opacity: 0.92 * p,
        transform: `rotate(-7deg) scale(${1.5 - p * 0.5})`,
        mixBlendMode: s.mode === 'light' ? 'multiply' : 'screen',
      }}
    >
      {chars.map((c, i) => (
        <span key={i}>{c}</span>
      ))}
    </div>
  );
};

/* ── 数据行 ───────────────────────────────────────────── */
export const FactRow: React.FC<{
  s: Skin;
  t: number;
  k: string;
  v: string;
  x: number;
  y: number;
  w: number;
  start: number;
  align?: 'row' | 'col';
  big?: boolean;
}> = ({ s, t, k, v, x, y, w, start, align = 'row', big = false }) => {
  const p = EASE.enter(seg(t, start, start + 0.55));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        display: 'flex',
        flexDirection: align === 'row' ? 'row' : 'column',
        alignItems: align === 'row' ? 'flex-end' : 'flex-start',
        justifyContent: 'space-between',
        gap: align === 'row' ? 12 : 4,
        opacity: p,
        transform: `translateX(${(1 - p) * (align === 'row' ? 18 : 0)}px) translateY(${
          (1 - p) * (align === 'row' ? 0 : 14)
        }px)`,
      }}
    >
      <div
        style={{
          fontSize: big ? 34 : 30,
          letterSpacing: 2,
          color: s.dim,
          fontWeight: 400,
          whiteSpace: 'nowrap',
        }}
      >
        {k}
      </div>
      <div
        style={{
          fontSize: big ? 52 : 42,
          fontFamily: s.numFamily,
          fontWeight: s.numWeight,
          color: s.ink,
          letterSpacing: align === 'row' ? 0 : 1,
          whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {v}
      </div>
    </div>
  );
};

/* ── 榜单行 ───────────────────────────────────────────── */
export const RankRow: React.FC<{
  s: Skin;
  t: number;
  i: number;
  name: string;
  role?: string;
  value?: string;
  hl?: boolean;
  x: number;
  y: number;
  w: number;
  start: number;
}> = ({ s, t, i, name, role, value, hl, x, y, w, start }) => {
  const p = EASE.enter(seg(t, start, start + 0.6));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: 118,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        opacity: p,
        transform: `translateX(${(1 - p) * 40}px)`,
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          flex: '0 0 68px',
          display: 'grid',
          placeItems: 'center',
          border: `1px solid ${rgba(hl ? s.a2 : s.a1, 0.55)}`,
          background: hl ? rgba(s.a2, 0.14) : 'transparent',
          color: hl ? s.a2 : s.dim,
          fontFamily: s.numFamily,
          fontSize: 32,
          letterSpacing: 1,
        }}
      >
        {String(i + 1).padStart(2, '0')}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 42,
            fontWeight: 600,
            color: s.ink,
            letterSpacing: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </div>
        {role ? (
          <div style={{ fontSize: 26, color: s.faint, letterSpacing: 1, marginTop: 4 }}>{role}</div>
        ) : null}
      </div>
      <div
        style={{
          fontFamily: s.numFamily,
          fontSize: 46,
          color: hl ? s.a2 : s.ink,
          letterSpacing: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
    </div>
  );
};

/* ── 定版 ─────────────────────────────────────────────── */
export const EndCard: React.FC<{
  s: Skin;
  t: number;
  p: { honoree: string; award: string; brand: string; dateText: string };
  start?: number;
  /** 竖向排版（新中式） */
  vertical?: boolean;
}> = ({ s, t, p, start = 6.5, vertical = false }) => {
  const pA = EASE.enter(seg(t, start, start + 0.6));
  const pB = EASE.enter(seg(t, start + 0.16, start + 0.86));
  const pC = EASE.enter(seg(t, start + 0.38, start + 1.05));
  const line = EASE.move(seg(t, start + 0.2, start + 1.0));
  // 名字必须单行：换行会被下面的渐变线穿过去，也会压住「谨此祝贺」
  const nameSize = Math.floor(fitSize(p.honoree, 872, vertical ? 118 : 132, vertical ? 10 : 4, 42));
  const nameLh = Math.round(nameSize * 1.16);
  const ruleY = 660 + nameLh + 32;
  const thanksY = Math.max(906, ruleY + 66);
  const brandY = thanksY + 130;
  const dateY = thanksY + 194;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 300,
          width: 904,
          textAlign: 'center',
          fontSize: 26,
          letterSpacing: 12,
          fontFamily: '"Oswald","Noto Sans SC",sans-serif',
          color: rgba(s.a1, 0.9),
          opacity: pA,
        }}
      >
        CONGRATULATIONS
      </div>
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 372,
          width: 904,
          textAlign: 'center',
          opacity: pA,
          transform: `translateY(${(1 - pA) * 18}px)`,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '8px 26px',
            fontSize: 30,
            letterSpacing: 6,
            color: s.dim,
            border: `1px solid ${rgba(s.a1, 0.5)}`,
            borderRadius: s.radius > 8 ? 999 : 2,
          }}
        >
          {p.award}
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 660,
          width: 904,
          textAlign: 'center',
          fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif',
          fontWeight: 700,
          fontSize: nameSize,
          lineHeight: `${nameLh}px`,
          letterSpacing: vertical ? 10 : 4,
          whiteSpace: 'nowrap',
          opacity: pB,
          transform: `translateY(${(1 - pB) * 26}px) scale(${0.94 + pB * 0.06})`,
          color: s.ink,
          textShadow: s.titleGlow,
        }}
      >
        {p.honoree}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 262,
          top: ruleY,
          width: 556 * line,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${rgba(s.a1, 0.9)}, transparent)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 88,
          top: thanksY,
          width: 904,
          textAlign: 'center',
          fontSize: 40,
          letterSpacing: 14,
          color: s.dim,
          opacity: pC,
          fontFamily: '"Noto Serif SC",serif',
        }}
      >
        谨 此 祝 贺
      </div>

      <div
        style={{
          position: 'absolute',
          left: 88,
          top: brandY,
          width: 904,
          textAlign: 'center',
          fontSize: 32,
          letterSpacing: 4,
          color: s.faint,
          opacity: pC,
        }}
      >
        {p.brand}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: dateY,
          width: 904,
          textAlign: 'center',
          fontFamily: '"Oswald","Noto Sans SC",sans-serif',
          fontSize: 30,
          letterSpacing: 6,
          color: rgba(s.a1, 0.9),
          opacity: pC,
        }}
      >
        {p.dateText}
      </div>
      {/* 年份描边水印：把定版下半版的重心压住，避免大片空场 */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 1244,
          width: 1000,
          textAlign: 'center',
          fontFamily: '"Oswald","Noto Sans SC",sans-serif',
          fontWeight: 700,
          fontSize: 272,
          lineHeight: '272px',
          letterSpacing: 8,
          color: 'transparent',
          WebkitTextStroke: `1px ${rgba(s.mode === 'dark' ? '#FFFFFF' : '#12110F', s.mode === 'dark' ? 0.11 : 0.07)}`,
          opacity: Math.min(1, Math.max(0, (t - start - 0.35) / 0.8)),
          pointerEvents: 'none',
        }}
      >
        {p.dateText.slice(0, 4)}
      </div>
      <Sfx name="impact" at={start + 0.1} vol={0.3} />
      <Sfx name="shimmer" at={start + 0.34} vol={0.24} />
    </>
  );
};

export const lineWidth = (w: number, p: number) => Math.max(0, w * clamp01(p));

/* ── 三段式章节轨（填住下半版，同时给出叙事结构） ─────── */
export const ChapterRail: React.FC<{
  s: Skin;
  t: number;
  labels: [string, string, string];
  y?: number;
  active?: number;
  start?: number;
}> = ({ s, t, labels, y = 1470, active = 0, start = 1.7 }) => {
  const p = EASE.move(seg(t, start, start + 0.9));
  return (
    <div style={{ position: 'absolute', left: 88, top: y, width: 904 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 904 * p, height: 1, background: rgba(s.a1, 0.32) }} />
      <div style={{ display: 'flex', gap: 28, marginTop: 26 }}>
        {labels.map((l, i) => {
          const on = i === active;
          const pi = EASE.enter(seg(t, start + 0.12 + i * 0.12, start + 0.6 + i * 0.12));
          return (
            <div key={i} style={{ flex: 1, opacity: pi * (on ? 1 : 0.55) }}>
              <div
                style={{
                  fontFamily: '"Oswald","Noto Sans SC",sans-serif',
                  fontSize: 24,
                  letterSpacing: 4,
                  color: on ? s.a1 : s.faint,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 30,
                  letterSpacing: 2,
                  color: on ? s.ink : s.dim,
                  fontWeight: on ? 600 : 400,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {l}
              </div>
              <div
                style={{
                  marginTop: 12,
                  width: on ? 64 : 26,
                  height: 2,
                  background: rgba(s.a1, on ? 0.9 : 0.28),
                  transition: undefined,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
