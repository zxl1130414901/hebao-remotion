/* 通用贺报引擎 · 动效与色彩基元
   全部为 f(frame) 纯函数：禁 Math.random / new Date / CSS transition。 */

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** 区间归一化进度 */
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / Math.max(1e-6, b - a));

/* ── 缓动 ───────────────────────────────────────────── */
export const outCubic = (x: number) => 1 - Math.pow(1 - x, 3);
export const outQuart = (x: number) => 1 - Math.pow(1 - x, 4);
export const outQuint = (x: number) => 1 - Math.pow(1 - x, 5);
export const outExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const inOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
export const inOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const inOutExpo = (x: number) =>
  x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
export const outBack = (x: number, s = 1.9) =>
  1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);

export const EASE = {
  enter: outExpo,
  soft: outCubic,
  move: inOutCubic,
  pop: (x: number) => outBack(x, 1.6),
  drift: inOut,
};

/* ── 颜色 ───────────────────────────────────────────── */
export const hexRgb = (hex: string) => {
  let v = hex.replace('#', '');
  if (v.length === 3) v = v.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16)).join(',');
};

/** '#RRGGBB' | 'r,g,b' → rgba() */
export const rgba = (c: string, a: number) =>
  `rgba(${c.startsWith('#') ? hexRgb(c) : c},${clamp(a, 0, 1)})`;

export const mix = (a: string, b: string, p: number) => {
  const A = hexRgb(a).split(',').map(Number);
  const B = hexRgb(b).split(',').map(Number);
  const C = A.map((v, i) => Math.round(lerp(v, B[i], clamp01(p))));
  return `rgb(${C.join(',')})`;
};

/* ── 确定性随机 ─────────────────────────────────────── */
export const makeRng = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

/* ── 排版测量（不依赖 DOM，渲染环境安全） ─────────────── */
const charW = (ch: string, narrow: boolean) => {
  const code = ch.charCodeAt(0);
  if (code > 0x2e80) return 1; // CJK 全角
  if (ch === ' ') return narrow ? 0.26 : 0.3;
  if (/[iIl1.,:;'’!|]/.test(ch)) return 0.3;
  if (/[A-Z]/.test(ch)) return narrow ? 0.52 : 0.66;
  if (/[0-9]/.test(ch)) return narrow ? 0.5 : 0.58;
  return narrow ? 0.46 : 0.54;
};

export const textWidth = (text: string, size: number, spacing = 0, narrow = false) =>
  text.split('').reduce((w, ch) => w + charW(ch, narrow) * size, 0) +
  Math.max(0, text.length - 1) * spacing;

/** 单行自适应字号：在 maxW 内放下 text */
export const fitSize = (
  text: string,
  maxW: number,
  maxSize: number,
  spacing = 0,
  minSize = 30,
  narrow = false,
) => {
  if (!text) return maxSize;
  const units = textWidth(text, 1, 0, narrow);
  const byWidth = (maxW - Math.max(0, text.length - 1) * spacing) / Math.max(0.01, units);
  return Math.max(minSize, Math.min(maxSize, byWidth));
};

/** 按语义断行：优先标点/空格，其次前后长短均衡 */
export const splitLines = (text: string, n: number): string[] => {
  const chars = text.split('');
  if (n <= 1 || chars.length <= n) return [text];
  const per = Math.ceil(chars.length / n);
  const out: string[] = [];
  let rest = chars;
  for (let i = 0; i < n - 1; i++) {
    const target = Math.min(rest.length - (n - 1 - i), per);
    let cut = target;
    for (let d = 0; d <= 3; d++) {
      const a = target - d;
      const b = target + d;
      if (a > 1 && /[·、，。｜|/\s—-]/.test(rest[a - 1])) {
        cut = a;
        break;
      }
      if (b < rest.length - 1 && /[·、，。｜|/\s—-]/.test(rest[b])) {
        cut = b + 1;
        break;
      }
    }
    out.push(rest.slice(0, cut).join(''));
    rest = rest.slice(cut);
  }
  out.push(rest.join(''));
  // 续行不允许以分隔符/空格开头（避免「· 基础模型事业部」这种读到一半断掉的感觉）
  return out.map((line, i) =>
    i === 0 ? line.replace(/\s+$/, '') : line.replace(/^[\s·、，。｜|/—-]+/, '').replace(/\s+$/, ''),
  );
};

/** 数字千分位 + 固定小数 */
export const fmtNum = (v: number, decimals = 0) =>
  v.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** 帧驱动的周期性脉冲（0..1） */
export const pulse = (t: number, period = 2, phase = 0) =>
  0.5 + 0.5 * Math.sin((t / period) * Math.PI * 2 + phase);
