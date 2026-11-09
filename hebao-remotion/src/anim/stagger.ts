/* GSAP stagger 对象语法移植 —— 确定性版
   来源：greensock/gsap-skills 的 stagger { each, from } 模式。
   返回第 i 个元素的「延迟秒数」，纯函数、无随机运行时
   （random 模式用 LCG seed，同一 seed 永远同一排布）。

   用法：
     const d = stagger(i, n, { mode: 'center', each: 0.06 });
     入场时间 = start + d                                   */

import { makeRng } from '../lib/anim';

export type StaggerMode = 'start' | 'end' | 'center' | 'edges' | 'random';

export const stagger = (
  i: number,
  n: number,
  opts: { mode?: StaggerMode; each?: number; seed?: number } = {}
): number => {
  const { mode = 'start', each = 0.06, seed = 42 } = opts;
  if (n <= 1) return 0;
  switch (mode) {
    case 'start':
      return i * each;
    case 'end':
      return (n - 1 - i) * each;
    case 'center': {
      /* 从中心向两侧炸开：离中心越近越先出现 */
      const mid = (n - 1) / 2;
      return Math.abs(i - mid) * each;
    }
    case 'edges': {
      /* 两端先、中心后：|i-mid| 越大越先 */
      const mid = (n - 1) / 2;
      const order = Math.abs(i - mid);
      const maxOrder = Math.ceil((n - 1) / 2);
      return (maxOrder - order) * each;
    }
    case 'random': {
      /* 确定性乱序：seed 固定则次序固定 */
      const rnd = makeRng(seed);
      const order: number[] = [];
      for (let k = 0; k < n; k++) order.push(rnd());
      const rank = order.filter((v, k) => k !== i && (v < order[i] || (v === order[i] && k < i))).length;
      return rank * each;
    }
    default:
      return i * each;
  }
};

/** 网格 stagger（GSAP stagger grid 思路）：行优先网格，from 指定起点 */
export const staggerGrid = (
  i: number,
  cols: number,
  rows: number,
  opts: { from?: 'center' | 'topleft'; each?: number } = {}
): number => {
  const { from = 'center', each = 0.05 } = opts;
  const r = Math.floor(i / cols);
  const c = i % cols;
  const midR = (rows - 1) / 2;
  const midC = (cols - 1) / 2;
  const d =
    from === 'center'
      ? Math.hypot(r - midR, c - midC)
      : Math.hypot(r, c);
  return d * each;
};
