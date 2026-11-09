// 一次性脚本：典藏系列(gs)字号系统性放大
// 背景：正文小字 22~34px 在 1080×1920 竖屏上过小(相当于海报 8 号字)
// 映射原则：小字 ×~1.4，中字 ×~1.25，≥60 的大数字不动；单遍替换避免链式误替换
import { readFileSync, writeFileSync, readdirSync } from 'fs';

const dir = new URL('../src/templates/gs/', import.meta.url).pathname.replace(/^\/([A-Za-z]):/, '$1:');

const map = {
  19: 30, 22: 34, 24: 36, 25: 36, 26: 38, 27: 40, 28: 40, 29: 42, 30: 44,
  31: 44, 32: 46, 33: 46, 34: 48, 36: 50, 38: 52, 40: 54, 42: 56, 44: 58,
  46: 60, 48: 62, 50: 64, 52: 66, 54: 68, 56: 70,
};
// lineHeight px 值随字号同步放大
const lhMap = { 36: 46, 48: 60, 52: 64 };

for (const f of readdirSync(dir).filter((x) => x.endsWith('.tsx'))) {
  const p = new URL(f, new URL('../src/templates/gs/', import.meta.url)).pathname.replace(/^\/([A-Za-z]):/, '$1:');
  let s = readFileSync(p, 'utf8');
  s = s.replace(/(fontSize:\s*)(\d+)/g, (m, a, n) => a + (map[n] ?? n));
  s = s.replace(/(size=\{)(\d+)(\})/g, (m, a, n, c) => a + (map[n] ?? n) + c);
  s = s.replace(/(lineHeight:\s*')(\d+)(px')/g, (m, a, n, c) => a + (lhMap[n] ?? n) + c);
  s = s.replace(/(brandSize=\{)(\d+)(\})/g, (m, a, n, c) => a + (map[n] ?? n) + c);
  writeFileSync(p, s);
  console.log('done', f);
}
