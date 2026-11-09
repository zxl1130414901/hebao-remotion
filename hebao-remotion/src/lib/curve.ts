/* 贝塞尔路径采样工具
   HTML 版靠 SVG 的 getTotalLength / getPointAtLength 驱动「列车沿轨道行驶」「纸飞机沿线飞行」，
   这两套 API 在 Remotion 里不可用（SVG 尚未布局），
   所以这里把曲线展平成折线，自己建弧长表 —— 结果与浏览器一致，且是纯函数。 */

export type Pt = { x: number; y: number };
export type Cubic = { p0: Pt; c1: Pt; c2: Pt; p1: Pt };

const cubicAt = ({ p0, c1, c2, p1 }: Cubic, s: number): Pt => {
  const m = 1 - s;
  const a = m * m * m;
  const b = 3 * m * m * s;
  const c = 3 * m * s * s;
  const d = s * s * s;
  return {
    x: a * p0.x + b * c1.x + c * c2.x + d * p1.x,
    y: a * p0.y + b * c1.y + c * c2.y + d * p1.y,
  };
};

/** 二次贝塞尔升阶成三次，便于统一采样 */
export const quadToCubic = (p0: Pt, q: Pt, p1: Pt): Cubic => ({
  p0,
  p1,
  c1: { x: p0.x + (2 / 3) * (q.x - p0.x), y: p0.y + (2 / 3) * (q.y - p0.y) },
  c2: { x: p1.x + (2 / 3) * (q.x - p1.x), y: p1.y + (2 / 3) * (q.y - p1.y) },
});

/**
 * 把若干三次曲线拼成一条可查询的路径。
 * at(u)：u∈[0,1] 的弧长归一点 → 坐标 + 切线角度（度）
 */
export const makePath = (segs: Cubic[], per = 140) => {
  const pts: Pt[] = [];
  segs.forEach((sg, si) => {
    for (let i = si === 0 ? 0 : 1; i <= per; i++) pts.push(cubicAt(sg, i / per));
  });

  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = cum[cum.length - 1];

  const at = (u: number) => {
    const target = Math.max(0, Math.min(1, u)) * total;
    let i = 1;
    while (i < cum.length && cum[i] < target) i++;
    const i0 = Math.max(0, i - 1);
    const i1 = Math.min(pts.length - 1, i);
    const span = cum[i1] - cum[i0] || 1;
    const k = (target - cum[i0]) / span;
    const a = pts[i0];
    const b = pts[i1];
    return {
      x: a.x + (b.x - a.x) * k,
      y: a.y + (b.y - a.y) * k,
      ang: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
    };
  };

  return { at, total, pts };
};
