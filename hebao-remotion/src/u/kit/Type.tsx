import React from 'react';
import type { CSSProperties } from 'react';
import type { Skin } from '../skins';
import { EASE, clamp01, fitSize, fmtNum, lerp, rgba, seg, splitLines } from '../lib/anim';

const SANS = '"Noto Sans SC","Microsoft YaHei",sans-serif';
const SERIF = '"Noto Serif SC","Songti SC",serif';
const NUM = '"Oswald","Noto Sans SC",sans-serif';

/* ── 逐字遮罩上浮 + 可选渐变填充 ───────────────────────── */
export const Title: React.FC<{
  s: Skin;
  t: number;
  text: string;
  x: number;
  y: number;
  w: number;
  size: number;
  start: number;
  each?: number;
  dur?: number;
  align?: 'left' | 'center' | 'right';
  lines?: number;
  track?: number;
  weight?: number;
  family?: string;
  fill?: string;
  color?: string;
  glow?: string;
  uppercase?: boolean;
  /** 竖排（新中式） */
  vertical?: boolean;
  italic?: boolean;
  style?: CSSProperties;
}> = ({
  s,
  t,
  text,
  x,
  y,
  w,
  size,
  start,
  each = 0.06,
  dur = 0.52,
  align = 'left',
  lines,
  track,
  weight,
  family,
  fill,
  color,
  glow,
  uppercase = false,
  vertical = false,
  italic = false,
  style,
}) => {
  const tr = track ?? s.track;
  const fam = family ?? (s.serif ? SERIF : SANS);
  const wt = weight ?? s.weight;
  const content = uppercase ? text.toUpperCase() : text;
  const nLines = lines ?? (content.length > 9 ? 2 : 1);
  const ls = vertical ? [content] : splitLines(content, nLines);
  const sz = Math.min(
    size,
    ...ls.map((l) => fitSize(l, w, size, tr, 34, fam === NUM)),
  );
  const lh = Math.round(sz * 1.06);
  const f = fill ?? (s.titleFill ? s.titleFill(1) : 'none');
  let idx = 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        textAlign: align,
        fontFamily: fam,
        fontWeight: wt,
        fontSize: sz,
        lineHeight: `${lh}px`,
        letterSpacing: tr,
        fontStyle: italic ? 'italic' : undefined,
        ...style,
      }}
    >
      {ls.map((line, li) => (
        <div
          key={li}
          style={{
            whiteSpace: 'nowrap',
            /* 居中/右对齐时补偿末字字距 */
            paddingLeft: vertical ? 0 : align === 'center' && tr ? tr : 0,
            paddingRight: vertical ? 0 : align === 'right' && tr ? tr : 0,
            writingMode: vertical ? 'vertical-rl' : undefined,
            height: vertical ? undefined : lh,
          }}
        >
          {line.split('').map((ch, ci) => {
            const i = idx++;
            const p = EASE.enter(seg(t, start + i * each, start + i * each + dur));
            return (
              <span
                key={ci}
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: vertical ? undefined : 'top',
                  height: vertical ? undefined : lh,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${(1 - p) * 108}%)`,
                    opacity: p > 0 ? 1 : 0,
                    color: f === 'none' ? color ?? s.ink : 'transparent',
                    backgroundImage: f === 'none' ? undefined : f,
                    WebkitBackgroundClip: f === 'none' ? undefined : 'text',
                    backgroundClip: f === 'none' ? undefined : 'text',
                    WebkitTextFillColor: f === 'none' ? undefined : 'transparent',
                    filter: glow ? `drop-shadow(${glow.replace(/,\s*/g, ' ')})` : undefined,
                  }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ── 眉标：细线 + 小字 ─────────────────────────────────── */
export const Kicker: React.FC<{
  s: Skin;
  t: number;
  text: string;
  x: number;
  y: number;
  align?: 'left' | 'center' | 'right';
  start?: number;
  w?: number;
  color?: string;
  size?: number;
}> = ({ s, t, text, x, y, align = 'left', start = 0.05, w = 900, color, size = 30 }) => {
  const p = EASE.enter(seg(t, start, start + 0.6));
  const lineW = 56 * p;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        gap: 18,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
      }}
    >
      <div style={{ width: lineW, height: 1.5, background: rgba(s.a1, 0.9) }} />
      <div
        style={{
          fontSize: size,
          letterSpacing: 5,
          color: color ?? s.dim,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          fontFamily: NUM,
          textTransform: 'uppercase',
          ...s.kickerStyle,
        }}
      >
        {text}
      </div>
      <div style={{ width: lineW, height: 1.5, background: rgba(s.a1, 0.9) }} />
    </div>
  );
};

/* ── 副标 ─────────────────────────────────────────────── */
export const Lead: React.FC<{
  s: Skin;
  t: number;
  text: string;
  x: number;
  y: number;
  w: number;
  size?: number;
  start?: number;
  align?: 'left' | 'center' | 'right';
  color?: string;
  lines?: number;
  weight?: number;
}> = ({ s, t, text, x, y, w, size = 42, start = 0.6, align = 'left', color, lines, weight = 400 }) => {
  const p = EASE.enter(seg(t, start, start + 0.7));
  const n = lines ?? 2;
  const ls = splitLines(text, n);
  const fs = Math.min(size, ...ls.map((l) => fitSize(l, w, size, 1.5, 26)));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        textAlign: align,
        fontSize: fs,
        lineHeight: `${Math.round(fs * 1.55)}px`,
        color: color ?? s.dim,
        fontWeight: weight,
        letterSpacing: 1.5,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
        filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
      }}
    >
      {ls.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
};

/* ── 大数字 ───────────────────────────────────────────── */
export const Metric: React.FC<{
  s: Skin;
  t: number;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  unit: string;
  label: string;
  x: number;
  y: number;
  w?: number;
  size?: number;
  start: number;
  align?: 'left' | 'center' | 'right';
  color?: string;
  labelColor?: string;
}> = ({
  s,
  t,
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  unit,
  label,
  x,
  y,
  w = 900,
  size: fontSize0 = 210,
  start,
  align = 'center',
  color,
  labelColor,
}) => {
  const p = Math.min(1, seg(t, start, start + 1.15));
  const eased = 1 - Math.pow(1 - p, 3);
  const shown = value * eased;
  const landed = seg(t, start + 0.95, start + 1.3);
  const op = clamp01(seg(t, start - 0.12, start + 0.16));
  // 按最终字符串宽度反推字号：5 位数 / 带千分位 / 中文单位都能统一收进版心
  const probe = `${prefix}${fmtNum(value, decimals)}${suffix}`;
  const glyphW = Array.from(probe).reduce((a, ch) => a + (/[,.\s]/.test(ch) ? 0.36 : 0.7), 0);
  const unitW = Array.from(unit).length * 0.34;
  const sizeFit = Math.floor((w * 0.86) / Math.max(0.4, glyphW + unitW));
  const size = Math.max(Math.round(fontSize0 * 0.46), Math.min(fontSize0, sizeFit));
  const unitSize = Math.round(size * 0.24);
  const numColor = color ?? s.ink;
  const isSerif = s.numFamily.includes('Serif');
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        textAlign: align,
        opacity: op,
        transform: `translateY(${(1 - clamp01(seg(t, start - 0.1, start + 0.4))) * 26}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
          gap: 10,
          color: numColor,
          fontFamily: s.numFamily,
          fontWeight: s.numWeight,
          fontSize: size,
          lineHeight: `${Math.round(size * 1.02)}px`,
          letterSpacing: isSerif ? 2 : -2,
          textShadow: landed < 1 ? `0 0 ${(1 - landed) * 60}px ${rgba(s.a1, 0.7 * (1 - landed))}` : undefined,
          ...s.numeral?.(1),
        }}
      >
        {prefix ? <span style={{ fontSize: Math.round(size * 0.5) }}>{prefix}</span> : null}
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtNum(shown, decimals)}</span>
        {suffix ? <span style={{ fontSize: Math.round(size * 0.4) }}>{suffix}</span> : null}
        <span style={{ fontSize: unitSize, letterSpacing: 2, opacity: 0.92, marginLeft: 4 }}>{unit}</span>
      </div>
      <div
        style={{
          marginTop: Math.round(size * 0.16),
          fontSize: Math.max(30, Math.round(size * 0.17)),
          letterSpacing: 4,
          color: labelColor ?? s.dim,
          fontWeight: 400,
          opacity: seg(t, start + 0.5, start + 0.95),
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ── 奖项 / 标签 ───────────────────────────────────────── */
export const Tag: React.FC<{
  s: Skin;
  t: number;
  text: string;
  x: number;
  y: number;
  start?: number;
  align?: 'left' | 'center' | 'right';
  w?: number;
  solid?: boolean;
  size?: number;
}> = ({ s, t, text, x, y, start = 0.5, align = 'left', w = 900, solid = false, size = 32 }) => {
  const p = EASE.enter(seg(t, start, start + 0.55));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        display: 'flex',
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: `${Math.round(size * 0.34)}px ${Math.round(size * 0.78)}px`,
          border: solid ? 'none' : `1px solid ${rgba(s.a1, 0.7)}`,
          background: solid ? s.a1 : rgba(s.a1, 0.1),
          color: solid ? (s.mode === 'dark' ? '#0A0A0A' : '#FFFFFF') : s.ink,
          borderRadius: s.radius > 8 ? 999 : 2,
          fontSize: size,
          letterSpacing: 4,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ── 竖排标题（新中式 / 编辑类） ───────────────────────── */
export const VerticalTitle: React.FC<{
  s: Skin;
  t: number;
  text: string;
  x: number;
  y: number;
  size: number;
  start: number;
  color?: string;
}> = ({ s, t, text, x, y, size, start, color }) => {
  const lh = Math.round(size * 1.16);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        writingMode: 'vertical-rl',
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: size,
        lineHeight: `${lh}px`,
        letterSpacing: 12,
        color: color ?? s.ink,
      }}
    >
      {text.split('').map((ch, i) => {
        const p = EASE.enter(seg(t, start + i * 0.12, start + i * 0.12 + 0.6));
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${(1 - p) * 30}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/* ── 竖向节奏线 ───────────────────────────────────────── */
export const Bar: React.FC<{
  s: Skin;
  t: number;
  x: number;
  y: number;
  h: number;
  start: number;
  w?: number;
  color?: string;
}> = ({ s, t, x, y, h, start, w = 4, color }) => {
  const p = EASE.enter(seg(t, start, start + 0.8));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h * p,
        background: color ?? `linear-gradient(180deg, ${s.a1}, ${rgba(s.a1, 0)})`,
      }}
    />
  );
};

export const nfmt = fmtNum;
export const nlerp = lerp;

/* ── 金句：均衡断行 + 自适应字号，绝不出现单字孤行 ─────── */
export const Quote: React.FC<{
  s: Skin;
  t: number;
  text: string;
  x: number;
  y: number;
  w: number;
  size?: number;
  start: number;
  align?: 'left' | 'center';
  lines?: number;
  color?: string;
}> = ({ s, t, text, x, y, w, size = 42, start, align = 'left', lines, color }) => {
  const ls = splitLines(text, lines ?? (text.length > 30 ? 3 : 2));
  const fs = Math.min(size, ...ls.map((l) => fitSize(l, w, size, 1.2, 26)));
  const p = EASE.enter(seg(t, start, start + 0.75));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        textAlign: align,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined,
      }}
    >
      <div
        style={{
          fontFamily: '"Noto Serif SC",serif',
          fontSize: Math.round(fs * 1.9),
          lineHeight: `${Math.round(fs * 1.9)}px`,
          color: rgba(s.a1, 0.55),
          height: Math.round(fs * 1.2),
          textAlign: align,
        }}
      >
        “
      </div>
      {ls.map((l, i) => (
        <div
          key={i}
          style={{
            fontFamily: '"Noto Serif SC",serif',
            fontSize: fs,
            lineHeight: `${Math.round(fs * 1.62)}px`,
            letterSpacing: 1.2,
            color: color ?? s.ink,
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};
