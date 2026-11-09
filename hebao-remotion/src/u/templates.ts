/* 60 套模板 = 12 套视觉皮肤 × 5 种叙事结构
   同一皮肤下的五种结构共用底/字/装饰，但构图、镜头与信息重心完全不同。
   u66–u115 为第二批 50 套：25 个全新版式骨架 × 2 种皮肤，骨架互不重复。 */

export type LayoutKind =
  | 'hero' | 'portrait' | 'metric' | 'list' | 'story'
  | 'medal' | 'cert' | 'vaxis' | 'countdown' | 'quote'
  | 'collage' | 'diag' | 'film' | 'bcast' | 'chart'
  | 'ticket' | 'marquee' | 'press' | 'light' | 'ascent'
  | 'tower' | 'rings' | 'ticker' | 'podium' | 'stamp'
  | 'tear' | 'lights' | 'stars' | 'bento' | 'wave'
  /* 第三批 43 个骨架 */
  | 'passport' | 'blueprint' | 'ledger' | 'cassette' | 'telegram'
  | 'calendar' | 'timeline' | 'orbit' | 'ribbon' | 'banner'
  | 'bars' | 'radar' | 'gauge' | 'steps' | 'scoreboard'
  | 'flip' | 'docket' | 'envelope' | 'flag' | 'arch'
  | 'lantern' | 'fan' | 'ink' | 'mosaic' | 'glitch'
  | 'neon' | 'spotlight' | 'curtain' | 'split' | 'mirror'
  | 'stack' | 'carousel' | 'magnifier' | 'wall' | 'plaque'
  | 'trophy' | 'laurel' | 'crystal' | 'prism' | 'clock'
  | 'hourglass' | 'compass' | 'map';

export type TemplateDef = {
  id: string;
  name: string;
  en: string;
  skin: string;
  layout: LayoutKind;
  accent: 1 | 2;
  /** 构图变体：0 / 1 */
  arr: number;
};

const FAMILIES: {
  skin: string;
  items: [string, string, string, string, string];
}[] = [
  {
    skin: 'aurora',
    items: ['极光·巨字', '极光·星环', '极光·深空', '极光·星榜', '极光·极昼'],
  },
  {
    skin: 'chrome',
    items: ['铬·镜面', '铬·金属肖像', '铬·重量', '铬·镀铬榜', '铬·锻造'],
  },
  {
    skin: 'neon',
    items: ['霓虹·电路', '霓虹·夜行', '霓虹·脉冲', '霓虹·街头榜', '霓虹·赛博纪'],
  },
  {
    skin: 'noir',
    items: ['黑白·高定', '黑白·特写', '黑白·极简数', '黑白·名人录', '黑白·纪事'],
  },
  {
    skin: 'acid',
    items: ['酸性·爆破', '酸性·贴纸', '酸性·数字炸弹', '酸性·街头榜', '酸性·切片'],
  },
  {
    skin: 'deco',
    items: ['金线·殿堂', '金线·徽章', '金线·鎏金数', '金线·名门榜', '金线·年代'],
  },
  {
    skin: 'kinetic',
    items: ['动能·极速', '动能·登场', '动能·冲刺', '动能·竞速榜', '动能·加速度'],
  },
  {
    skin: 'stadium',
    items: ['竞技·夺冠', '竞技·MVP', '竞技·战报', '竞技·联赛榜', '竞技·赛季'],
  },
  {
    skin: 'holo',
    items: ['全息·镭射', '全息·未来偶像', '全息·幻彩数', '全息·星云榜', '全息·时间褶'],
  },
  {
    skin: 'ink',
    items: ['水墨·东方', '水墨·立传', '水墨·留白', '水墨·群英谱', '水墨·山水'],
  },
  {
    skin: 'riso',
    items: ['孔版·海报', '孔版·套色', '孔版·印刷数', '孔版·独立榜', '孔版·小志'],
  },
  {
    skin: 'cinema',
    items: ['电影·片头', '电影·登场', '电影·票房', '电影·演职员', '电影·三幕'],
  },
  {
    skin: 'glass',
    items: ['玻璃·清透', '玻璃·光斑', '玻璃·透数', '玻璃·浮榜', '玻璃·折射'],
  },
];

const EN: Record<string, string[]> = {
  aurora: ['AURORA TYPE', 'AURORA RING', 'DEEP SPACE', 'STARBOARD', 'POLAR DAY'],
  chrome: ['MIRROR TYPE', 'METAL PORTRAIT', 'HEAVY NUMBER', 'CHROME RANK', 'FORGED'],
  neon: ['CIRCUIT CRY', 'NIGHT RUNNER', 'PULSE', 'STREET BOARD', 'CYBER CHRONICLE'],
  noir: ['COUTURE TYPE', 'PORTRAIT NOIR', 'BARE NUMBER', "WHO'S WHO", 'CHRONIQUE'],
  acid: ['ACID BLAST', 'STICKER HERO', 'NUMBER BOMB', 'STREET RANK', 'RAW CUTS'],
  deco: ['GRAND TYPE', 'GOLDEN CREST', 'GILDED NUMBER', 'NOBLE LIST', 'DECO ERA'],
  kinetic: ['VELOCITY', 'ENTER HERO', 'SPRINT', 'RACE BOARD', 'ACCELERATION'],
  stadium: ["CHAMPION'S CALL", 'MVP MOMENT', 'MATCH STATS', 'LEAGUE TABLE', 'SEASON ROAD'],
  holo: ['HOLO TYPE', 'FUTURE ICON', 'IRIDESCENT DATA', 'NEBULA LIST', 'TIME FOLD'],
  ink: ['EASTERN TYPE', 'PORTRAIT SCROLL', 'NEGATIVE SPACE', 'ROSTER SCROLL', 'LANDSCAPE'],
  riso: ['RISO POSTER', 'OVERPRINT', 'PRINT RUN', 'INDIE CHART', 'ZINE STORY'],
  cinema: ['TITLE SEQUENCE', 'STAR ENTRANCE', 'BOX OFFICE', 'END CREDITS', 'THREE ACTS'],
  glass: ['CRYSTAL TYPE', 'GLASS ICON', 'SHEER NUMBER', 'FLOAT BOARD', 'PRISM STORY'],
};

const LAYOUTS: LayoutKind[] = ['hero', 'portrait', 'metric', 'list', 'story'];

/* ── 第二批 50 套（u66–u115）：25 个全新骨架，每个骨架配 2 种皮肤，不与旧组合重复 ── */
type NewRow = [kind: LayoutKind, skin: string, name: string, en: string];
const NEW_ROWS: NewRow[] = [
  ['medal', 'aurora', '极光·勋章', 'AURORA MEDAL'],
  ['medal', 'kinetic', '动能·勋章', 'VELOCITY MEDAL'],
  ['cert', 'chrome', '铬·证书', 'CHROME CERT'],
  ['cert', 'stadium', '竞技·证书', 'LEAGUE CERT'],
  ['vaxis', 'neon', '霓虹·竖轴', 'NEON VERTICAL'],
  ['vaxis', 'holo', '全息·竖轴', 'HOLO VERTICAL'],
  ['countdown', 'noir', '黑白·倒计', 'BLACKOUT COUNT'],
  ['countdown', 'ink', '水墨·倒计', 'INK COUNTDOWN'],
  ['quote', 'acid', '酸性·金句', 'ACID QUOTE'],
  ['quote', 'riso', '孔版·金句', 'RISO QUOTE'],
  ['collage', 'deco', '金线·拼贴', 'DECO COLLAGE'],
  ['collage', 'cinema', '电影·拼贴', 'CINE COLLAGE'],
  ['diag', 'kinetic', '动能·斜切', 'DIAGONAL DASH'],
  ['diag', 'glass', '玻璃·斜切', 'PRISM SPLIT'],
  ['film', 'stadium', '竞技·胶片', 'MATCH REEL'],
  ['film', 'aurora', '极光·胶片', 'AURORA REEL'],
  ['bcast', 'holo', '全息·字幕条', 'HOLO CHYRON'],
  ['bcast', 'chrome', '铬·字幕条', 'CHROME CHYRON'],
  ['chart', 'ink', '水墨·图表', 'INK CHART'],
  ['chart', 'neon', '霓虹·图表', 'NEON CHART'],
  ['ticket', 'riso', '孔版·票根', 'RISO TICKET'],
  ['ticket', 'noir', '黑白·票根', 'NOIR ADMIT'],
  ['marquee', 'cinema', '电影·灯箱', 'CINE MARQUEE'],
  ['marquee', 'deco', '金线·灯箱', 'GOLD MARQUEE'],
  ['press', 'glass', '玻璃·头版', 'GLASS PRESS'],
  ['press', 'kinetic', '动能·头版', 'DAILY DASH'],
  ['light', 'aurora', '极光·追光', 'AURORA SPOT'],
  ['light', 'stadium', '竞技·追光', 'ARENA SPOT'],
  ['ascent', 'chrome', '铬·登顶', 'CHROME ASCENT'],
  ['ascent', 'neon', '霓虹·登顶', 'NEON ASCENT'],
  ['tower', 'stadium', '竞技·数字塔', 'SCORE TOWER'],
  ['tower', 'holo', '全息·数字塔', 'HOLO TOWER'],
  ['rings', 'ink', '水墨·双环', 'INK RINGS'],
  ['rings', 'riso', '孔版·双环', 'RISO RINGS'],
  ['ticker', 'cinema', '电影·弹幕', 'CINE TICKER'],
  ['ticker', 'acid', '酸性·弹幕', 'ACID TICKER'],
  ['podium', 'glass', '玻璃·领奖台', 'GLASS PODIUM'],
  ['podium', 'aurora', '极光·领奖台', 'AURORA PODIUM'],
  ['stamp', 'deco', '金线·盖章', 'GOLD SEAL'],
  ['stamp', 'kinetic', '动能·盖章', 'DASH SEAL'],
  ['tear', 'noir', '黑白·揭幕', 'NOIR TEAR'],
  ['tear', 'stadium', '竞技·揭幕', 'MATCH TEAR'],
  ['lights', 'holo', '全息·点灯', 'HOLO LIGHTS'],
  ['lights', 'chrome', '铬·点灯', 'CHROME LIGHTS'],
  ['stars', 'ink', '水墨·星图', 'INK STARS'],
  ['stars', 'cinema', '电影·星图', 'CINE STARS'],
  ['bento', 'riso', '孔版·门格', 'RISO BENTO'],
  ['bento', 'neon', '霓虹·门格', 'NEON BENTO'],
  ['wave', 'cinema', '电影·声浪', 'CINE WAVE'],
  ['wave', 'glass', '玻璃·声浪', 'GLASS WAVE'],
];

const NEW_TEMPLATES: TemplateDef[] = NEW_ROWS.map((r, i) => ({
  id: `u${66 + i}`,
  name: r[2],
  en: r[3],
  skin: r[1],
  layout: r[0],
  accent: (i % 2 === 0 ? 1 : 2) as 1 | 2,
  arr: i % 2,
}));

/* ── 第三批 85 套（u116–u200）：43 个全新骨架，前 42 个各配 2 种皮肤，最后一个单套 ── */
const SKIN_CN3: Record<string, string> = {
  aurora: '极光', chrome: '铬', neon: '霓虹', noir: '黑白', acid: '酸性', deco: '金线',
  kinetic: '动能', stadium: '竞技', holo: '全息', ink: '水墨', riso: '孔版', cinema: '电影', glass: '玻璃',
};
const SKIN_EN3: Record<string, string> = {
  aurora: 'AURORA', chrome: 'CHROME', neon: 'NEON', noir: 'NOIR', acid: 'ACID', deco: 'GOLD',
  kinetic: 'VELOCITY', stadium: 'LEAGUE', holo: 'HOLO', ink: 'INK', riso: 'RISO', cinema: 'CINE', glass: 'GLASS',
};
const SKIN_IDS3 = ['aurora', 'chrome', 'neon', 'noir', 'acid', 'deco', 'kinetic', 'stadium', 'holo', 'ink', 'riso', 'cinema', 'glass'];

/** [骨架, 中文后缀, 英文后缀] —— 43 个空间机制互不重复的骨架 */
const SK3: [LayoutKind, string, string][] = [
  ['passport', '证件', 'PASS'],
  ['blueprint', '蓝图', 'BLUEPRINT'],
  ['ledger', '账本', 'LEDGER'],
  ['cassette', '磁带', 'CASSETTE'],
  ['telegram', '电报', 'TELEGRAM'],
  ['calendar', '日历', 'CALENDAR'],
  ['timeline', '横轴', 'TIMELINE'],
  ['orbit', '轨道', 'ORBIT'],
  ['ribbon', '绶带', 'RIBBON'],
  ['banner', '卷轴', 'SCROLL'],
  ['bars', '柱阵', 'BARS'],
  ['radar', '雷达', 'RADAR'],
  ['gauge', '仪表', 'GAUGE'],
  ['steps', '进度', 'PROGRESS'],
  ['scoreboard', '记分', 'SCOREBOARD'],
  ['flip', '翻牌', 'FLIP'],
  ['docket', '小票', 'DOCKET'],
  ['envelope', '信封', 'ENVELOPE'],
  ['flag', '旗帜', 'FLAG'],
  ['arch', '拱门', 'ARCH'],
  ['lantern', '灯笼', 'LANTERN'],
  ['fan', '折扇', 'FAN'],
  ['ink', '墨迹', 'INKSTROKE'],
  ['mosaic', '马赛', 'MOSAIC'],
  ['glitch', '故障', 'GLITCH'],
  ['neon', '灯管', 'NEONTUBE'],
  ['spotlight', '追光', 'SPOTLIGHT'],
  ['curtain', '幕布', 'CURTAIN'],
  ['split', '分屏', 'SPLIT'],
  ['mirror', '倒影', 'MIRROR'],
  ['stack', '叠卡', 'STACK'],
  ['carousel', '横卡', 'CAROUSEL'],
  ['magnifier', '放大镜', 'MAGNIFY'],
  ['wall', '相框墙', 'WALL'],
  ['plaque', '铭牌', 'PLAQUE'],
  ['trophy', '奖杯', 'TROPHY'],
  ['laurel', '桂冠', 'LAUREL'],
  ['crystal', '水晶', 'CRYSTAL'],
  ['prism', '棱镜', 'PRISM'],
  ['clock', '表盘', 'CLOCK'],
  ['hourglass', '沙漏', 'HOURGLASS'],
  ['compass', '罗盘', 'COMPASS'],
  ['map', '路线图', 'ROUTE'],
];

const NEW_ROWS3: TemplateDef[] = (() => {
  const out: TemplateDef[] = [];
  let idx = 0;
  SK3.forEach(([kind, cn, en], j) => {
    const copies = j === SK3.length - 1 ? 1 : 2;
    for (let c = 0; c < copies; c++) {
      const skin = SKIN_IDS3[(idx + c * 7) % SKIN_IDS3.length];
      out.push({
        id: `u${116 + idx}`,
        name: `${SKIN_CN3[skin]}·${cn}`,
        en: `${SKIN_EN3[skin]} ${en}`,
        skin,
        layout: kind,
        accent: (idx % 2 === 0 ? 1 : 2) as 1 | 2,
        arr: idx % 2,
      });
      idx++;
    }
  });
  return out;
})();


export const TEMPLATES: TemplateDef[] = [
  ...FAMILIES.flatMap((fam, fi) =>
    fam.items.map((name, li) => ({
      id: `u${String(fi * 5 + li + 1).padStart(2, '0')}`,
      name,
      en: EN[fam.skin][li],
      skin: fam.skin,
      layout: LAYOUTS[li],
      accent: ((fi + li) % 2 === 0 ? 1 : 2) as 1 | 2,
      arr: (fi + li) % 2,
    })),
  ),
  ...NEW_TEMPLATES,
  ...NEW_ROWS3,
];


export const TEMPLATE_MAP: Record<string, TemplateDef> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t]),
);
