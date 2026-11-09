/* 四套主题色板 —— 与 HTML 版 template-base.js 的 THEMES 逐字段对应
   三元组字符串（'r,g,b'）用于 rgba() 拼接；hex 用于实色 */

export type ThemeKey = 'hongjin' | 'shenmo' | 'lanjin' | 'feicui';
export type RGB = string;

export type Theme = {
  key: ThemeKey;
  name: string;
  bg: [string, string, string];
  glow1: RGB;
  glow2: RGB;
  goldA: string;
  goldB: string;
  goldC: string;
  goldD: string;
  soft: RGB;
  line: RGB;
  pale: RGB;
  cream: string;
  cream2: string;
  warm: RGB;
  mist: RGB;
  bright: string;
  archbg: string;
  mask: RGB;
  pt: string;
};

export const THEMES: Record<ThemeKey, Theme> = {
  hongjin: {
    key: 'hongjin',
    name: '喜庆红金',
    bg: ['#7E0E13', '#B01E25', '#8A1216'],
    glow1: '255,196,96',
    glow2: '255,130,60',
    goldA: '#FFF6D8',
    goldB: '#FFE29A',
    goldC: '#F5BE55',
    goldD: '#C07E1C',
    soft: '255,224,160',
    line: '255,214,140',
    pale: '255,240,200',
    cream: '#FFF3D9',
    cream2: '#FFE9C9',
    warm: '248,223,180',
    mist: '245,217,172',
    bright: '#FFE9BC',
    archbg: '#5A0A0E',
    mask: '96,10,14',
    pt: '#FFE6A8',
  },
  shenmo: {
    key: 'shenmo',
    name: '深墨鎏金',
    bg: ['#0A0C10', '#12100F', '#1A0D0B'],
    glow1: '201,161,92',
    glow2: '176,31,36',
    goldA: '#FAECCB',
    goldB: '#E3C48A',
    goldC: '#C9A15C',
    goldD: '#8A6634',
    soft: '201,161,92',
    line: '201,161,92',
    pale: '246,227,180',
    cream: '#E8DCC8',
    cream2: '#C9BFB4',
    warm: '184,178,166',
    mist: '184,178,166',
    bright: '#F6E3B4',
    archbg: '#14110E',
    mask: '10,10,12',
    pt: '#F6E3B4',
  },
  lanjin: {
    key: 'lanjin',
    name: '蓝金商务',
    bg: ['#0A1C33', '#14365C', '#0C2240'],
    glow1: '140,190,255',
    glow2: '212,175,55',
    goldA: '#FDF6DC',
    goldB: '#F1DFA6',
    goldC: '#D9BC6E',
    goldD: '#8F7420',
    soft: '176,200,235',
    line: '212,190,130',
    pale: '226,238,255',
    cream: '#EAF2FC',
    cream2: '#DDE9F7',
    warm: '201,216,238',
    mist: '201,216,238',
    bright: '#F2E2B8',
    archbg: '#0C1E38',
    mask: '10,26,52',
    pt: '#CFE4FF',
  },
  feicui: {
    key: 'feicui',
    name: '翡翠鎏金',
    bg: ['#062A1E', '#0E4A32', '#0A3324'],
    glow1: '120,220,170',
    glow2: '201,161,92',
    goldA: '#F7FBE6',
    goldB: '#EBE3A0',
    goldC: '#D9C264',
    goldD: '#8F7420',
    soft: '168,224,196',
    line: '212,190,130',
    pale: '224,248,230',
    cream: '#E9F7EF',
    cream2: '#DFF2E6',
    warm: '196,227,210',
    mist: '196,227,210',
    bright: '#F2E6B8',
    archbg: '#0A2E22',
    mask: '8,40,30',
    pt: '#C8F2DC',
  },
};

/* 字体栈 —— 与原 HTML 版完全一致，保证视觉对齐 */
export const FONT_SANS = '"Noto Sans SC","Microsoft YaHei",sans-serif';
export const FONT_SERIF = '"Noto Serif SC","Songti SC",serif';
/* Oswald（@fontsource 内嵌，tabular 数字）为首选；Bahnschrift/Arial Narrow 仅作兜底 */
export const FONT_NUM = '"Oswald","Oswald","Bahnschrift","Arial Narrow",sans-serif';
