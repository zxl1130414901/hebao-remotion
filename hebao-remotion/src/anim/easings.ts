/* GSAP 曲线体系移植 —— 确定性 f(帧) 版
   来源：greensock/gsap-skills 的 gsap-core / CustomEase 知识，
   全部重写为纯函数（入参 0..1，出参 0..1，允许 back/elastic 越界），
   与 Remotion 渲染确定性完全兼容 —— 不引入 GSAP 运行时。

   全库「品牌缓动词表」：新模板只用 EASE 里的命名曲线，
   保证 20 套典藏系列的手感完全一致：
     EASE.hook    落定带过冲 —— 巨字/印章/徽章砸下
     EASE.enter   快出缓停 —— 遮罩逐字上升、条目浮现
     EASE.settle  极速收敛 —— 滚数收尾、描线
     EASE.exit    渐入退出 —— 章节退场
     EASE.glam    弹性亮相 —— 胶囊/徽标/照片 pop
     EASE.smooth  柔和往返 —— 位移/呼吸
     EASE.elastic 果冻回弹 —— 强调性小元素                    */

import { clamp01 } from '../lib/anim';

/* ---------- power 系（GSAP power1~4） ---------- */

export const powerIn =
  (n: number) =>
  (x: number): number =>
    Math.pow(x, n);

export const powerOut =
  (n: number) =>
  (x: number): number =>
    1 - Math.pow(1 - x, n);

export const powerInOut =
  (n: number) =>
  (x: number): number =>
    x < 0.5 ? Math.pow(2 * x, n) / 2 : 1 - Math.pow(-2 * x + 2, n) / 2;

/* ---------- back 系（s 即 GSAP back.out(k) 的 k） ---------- */

export const outBackK =
  (s = 1.7) =>
  (x: number): number =>
    1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);

export const inBack =
  (s = 1.7) =>
  (x: number): number =>
    (s + 1) * x * x * x - s * x * x;

export const inOutBack =
  (s = 1.7) =>
  (x: number): number => {
    const c2 = s * 1.525;
    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  };

/* ---------- elastic / bounce ---------- */

/** 对齐 GSAP 默认 elastic.out(1, 0.3) */
export const outElasticDefault = (x: number): number => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const c4 = (2 * Math.PI) / 0.3;
  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

export const outBounce = (x: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};

/* ---------- CustomEase：cubic-bezier(x1,y1,x2,y2) 求值 ----------
   与 CSS cubic-bezier() 同语义；牛顿迭代 + 二分兜底，确定性无损 */

export const cubicBezier =
  (x1: number, y1: number, x2: number, y2: number) =>
  (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const cx = (t: number) =>
      3 * t * (1 - t) * (1 - t) * x1 + 3 * t * t * (1 - t) * x2 + t * t * t;
    const cy = (t: number) =>
      3 * t * (1 - t) * (1 - t) * y1 + 3 * t * t * (1 - t) * y2 + t * t * t;
    const dx = (t: number) =>
      3 * (1 - t) * (1 - t) * x1 + 6 * t * (1 - t) * (x2 - x1) + 3 * t * t * (1 - x2);
    /* 牛顿迭代 8 轮足够收敛 */
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = cx(t) - x;
      if (Math.abs(e) < 1e-5) break;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    if (t < 0 || t > 1) {
      /* 二分兜底（极陡曲线） */
      let lo = 0;
      let hi = 1;
      t = x;
      for (let i = 0; i < 24; i++) {
        const v = cx(t);
        if (Math.abs(v - x) < 1e-5) break;
        if (v < x) lo = t;
        else hi = t;
        t = (lo + hi) / 2;
      }
    }
    return cy(t);
  };

/* ---------- 品牌缓动词表（典藏系列统一手感） ---------- */

export const EASE = {
  /** 砸落过冲（≈ GSAP back.out(1.7)）—— 巨字 / 印章 / 奖章 */
  hook: outBackK(1.7),
  /** 快出缓停（cubic-bezier(.22,1,.36,1)）—— 逐字遮罩上升 / 条目浮现 */
  enter: cubicBezier(0.22, 1, 0.36, 1),
  /** 极速收敛（power4.out）—— 滚数收尾 / 描线 / 进度充能 */
  settle: powerOut(4),
  /** 渐入退出（cubic-bezier(.55,0,1,.45)）—— 章节退场 / 收束 */
  exit: cubicBezier(0.55, 0, 1, 0.45),
  /** 弹性亮相（cubic-bezier(.34,1.56,.64,1)）—— 胶囊 / 徽标 / 照片 pop */
  glam: cubicBezier(0.34, 1.56, 0.64, 1),
  /** 柔和往返（power3.inOut）—— 位移 / 呼吸 / 镜头 */
  smooth: powerInOut(3),
  /** 果冻回弹（elastic.out(1,.3)）—— 强调性小元素的落点 */
  elastic: outElasticDefault,
  /** 弹跳落地（bounce.out）—— 倒计时 / 落珠类 */
  bounce: outBounce,
} as const;

/** 与 lib/anim 的 seg 配套：区间进度 → 品牌曲线 */
export const easeSeg = (
  t: number,
  a: number,
  b: number,
  fn: (x: number) => number
): number => {
  const x = clamp01((t - a) / (b - a));
  return fn(x);
};
