/* 缓动与插值工具 —— 与 HTML 版 HB 的算法逐行一致
   Remotion 化之后所有动效都是 f(frame) 的纯函数，无 CSS transition，
   同一帧号在任何机器上渲染结果完全相同 */

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** 归一化区间进度：t 从 a 到 b 映射到 0..1 */
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

export const outExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

export const outBack = (x: number, s = 1.9) =>
  1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);

export const inOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** 颜色 + alpha → rgba()。双格式通吃：'r,g,b' 三元组或 '#RRGGBB' hex 均可
 *  （hex 会先转三元组，避免产出 rgba(#F5BE55,.5) 这类非法 CSS 导致整条声明被浏览器丢弃） */
export const rgba = (rgb: string, a: number) =>
  `rgba(${rgb.startsWith('#') ? hexRgb(rgb) : rgb},${a})`;

/** '#RRGGBB' → 'r,g,b'，用于把主题 hex 色拼进 rgba() */
export const hexRgb = (hex: string) => {
  const v = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(v.substr(i, 2), 16)).join(',');
};

/** 金色四段渐变，用于 background-clip:text */
export const goldGradient = (a: string, b: string, c: string, d: string) =>
  `linear-gradient(180deg,${a} 0%,${b} 38%,${c} 62%,${d} 100%)`;

/** 数字格式：滚动时保留一位小数 / 整数千分位 */
export const fmtNum = (pv: number, hasDec: boolean) =>
  hasDec ? pv.toFixed(1) : Math.round(pv).toLocaleString('en-US');

/** 章节出入场：返回 opacity 与 transform 片段（对应 HTML 版 chOut） */
export const chOut = (t: number, inRange: [number, number], outRange?: [number, number]) => {
  const pIn = seg(t, inRange[0], inRange[1]);
  const pOut = outRange ? seg(t, outRange[0], outRange[1]) : 0;
  return {
    opacity: pIn * (1 - pOut),
    transform: `translateY(${(1 - pIn) * 26 - pOut * 34}px) scale(${1 + pOut * 0.03})`,
  };
};

/** 确定性伪随机（与 HTML 版 makeParticles 同一 LCG） */
export const makeRng = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
};
