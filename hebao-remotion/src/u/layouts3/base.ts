import type { Skin } from '../skins';
import type { UniversalProps } from '../types';

/* 第三批骨架（u116–u200）共用签名，与 Root 的注册接口一致 */
export type LP = { p: UniversalProps; s: Skin; accent: number; arr: number };

/** 版心（贺报统一 88–992），中轴 540 */
export const MX = 88;
export const MW = 904;
export const CX = 540;

/** 常见等宽字体：用于机读码、票面、刻度这类"工业感"文字 */
export const MONO = '"Oswald","Noto Sans SC",monospace';
export const SERIF = '"Noto Serif SC",serif';
export const SANS = '"Noto Sans SC",sans-serif';

/** 两色混色（p=0 取 a，p=1 取 b）——用于把皮肤色往固定金属/纸感色上拉 */
export const mixHex = (a: string, b: string, p: number) => {
  const pa = hexToArr(a);
  const pb = hexToArr(b);
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * p).toString(16).padStart(2, '0')).join('')}`;
};
const hexToArr = (h: string) => {
  const v = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(v.substr(i, 2), 16));
};

/** 给定底色，返回能看清的前景色（浅底走深墨，深底走白） */
export const onColor = (hex: string) => {
  const [r, g, b] = hexToArr(hex);
  const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return l > 0.62 ? '#0C0E12' : '#FFFFFF';
};
