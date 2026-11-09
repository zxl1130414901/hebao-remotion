import type { ThemeKey } from '../theme';

/** 贺报数据契约 —— 与原 HTML 版 CFG 字段一一对应，方便互相对照 */
export type Stat = { v: string; k: string; hl?: boolean };
export type Item = { k: string; v: string; d?: string };
export type Node4 = { label: string; value: string; note?: string };

/* ── 第二批模板（内容结构拓展）新增的数据形态 ──
   全部可选；老模板不读这些字段，行为完全不变 */

/** 名单行：早会播报 / 荣誉墙 / 接力 */
export type RosterRow = { name: string; org?: string; value: string; note?: string; hl?: boolean };
/** 产品结构切片：v 为百分比（合计 100） */
export type MixSlice = { label: string; v: number; note?: string };
/** 目标拆解格子 */
export type GoalCell = { label: string; done: boolean; v?: string };
/** 季度复盘三栏 */
export type Retro = { good: string[]; bad: string[]; next: string[] };
/** 成就徽章 */
export type Badge = { name: string; desc: string; unlocked: boolean };
/** 对话气泡：客户见证 / 微信长图 */
export type Bubble = { side: 'l' | 'r'; text: string; name?: string };
/** 阵营比分：红蓝对战 */
export type Camp = { name: string; value: string; pct: number; sub?: string };

export type HebaoProps = {
  theme: ThemeKey;
  brand: string;
  bottomtag: string;
  /** 首屏宣言（2~4 字最佳） */
  slogan: string;
  /** 定版主标题 */
  slogan2: string;
  endsub: string;
  name: string;
  role: string;
  /** 荣誉标签（MDRT / 星级会员 等） */
  pill: string;
  /** 大数字说明标签 */
  dlabel: string;
  /** 核心数字（万元） */
  premium: number;
  /** 环比同比文案 */
  delta: string;
  stats: Stat[];
  /** 宣言式短句（恭贺语 / 副标 / 开场说明），各模板按需取用 */
  claim?: string;
  /** 头条大标题（号外版等） */
  headline?: string;
  /** 头条副题 */
  headsub?: string;
  /** 金句落款 */
  sign?: string;
  /** 公司落款全称（报纸/证书类模板用） */
  company?: string;
  /** 对比类模板：目标值与标签（今昔对比版等） */
  goalLabel?: string;
  goalValue?: string;
  /** 格言 / 金句 */
  quote?: string;
  /** 印章字（单字最佳） */
  sealChar?: string;
  /** 通用条目（战果清单 / 明细 / 里程碑名称+数值） */
  items?: Item[];
  /** 节点序列（时间轴 / 阶梯 / 旅程） */
  nodes?: Node4[];
  /** 五维雷达（五维战力版）：0~1 */
  radar?: { label: string; v: number }[];
  /** 年度累计版：进度百分比 / 目标文案 / 当前月份 */
  pct?: number;
  goalTxt?: string;
  curMonth?: number;
  /** 占比环中心说明（占比称雄版） */
  shareLab?: string;
  /** 榜单风云版：从第 5 名到第 1 名，最多 5 条（最后一条为冠军） */
  rankings?: { name: string; org: string; value: string }[];
  /** 足迹时间轴版：4 步历程，每条「标题｜副说明」 */
  steps?: string[];
  qrCap: string;
  dateText: string;
  note: string;
  /** 喜庆红金版（honor）专属：月份中/英副题与月度之星标签 */
  monthCN?: string;
  monthEN?: string;
  starLabel?: string;
  /** 人物照片 URL；不传则回落内置人像 */
  photo?: string;

  /* ── 第二批模板专属字段 ── */

  /** 主视觉大字（首单 / 连续达成 / 结业 等非常规数字位） */
  hero?: string;
  /** 主视觉下的短标签，如「第 1 单」「连续 21 天」 */
  ribbon?: string;
  /** 主数值第二行说明（单位 / 语境） */
  subValue?: string;
  /** 名单（早会播报 / 荣誉墙 / 接力） */
  roster?: RosterRow[];
  /** 产品结构占比 */
  mix?: MixSlice[];
  /** 目标拆解格子 */
  goalCells?: GoalCell[];
  /** 季度复盘 */
  retro?: Retro;
  /** 成就徽章 */
  badges?: Badge[];
  /** 对话流（客户见证 / 微信长截图） */
  bubbles?: Bubble[];
  /** 红蓝对战双方 */
  versusA?: Camp;
  versusB?: Camp;
  /** 师徒：师傅行与徒弟行 */
  mentorLine?: string;
  rookieLine?: string;

  /** 二维码图片 URL；不传则画占位码 */
  qr?: string;

  /* ── 可选语音播报（Stage 自动识别，模板零改动）── */

  /** 播报音频路径（相对 public/，如 'assets/voices/zhangsan.wav'）。
   *  用外部 TTS 工具（如本机 VoxCPM/yzylauncher）预生成 wav 后放入该目录；
   *  不传则无播报；传入后底乐自动闪避给语音让位。 */
  voice?: string;
  /** 播报开始时刻（秒），默认 0.6 —— 等标题落定再开口 */
  voiceStart?: number;
};

export const DEFAULT_PROPS: HebaoProps = {
  theme: 'hongjin',
  brand: '泰康养老 · 个险渠道',
  bottomtag: 'GOOD　NEWS',
  slogan: '捷报频传',
  slogan2: '再攀高峰',
  endsub: '荣耀属于奋斗者',
  name: '李静怡',
  role: '高级业务经理 · 杭州三区',
  pill: 'MDRT · 2026 年度会员',
  dlabel: '十月个人承保保费',
  premium: 286.5,
  delta: '环比 +38.2%　　｜　　同比 +112.6%',
  stats: [
    { v: '42', k: '承保件数' },
    { v: '218%', k: '目标达成率' },
    { v: 'No.3', k: '全省排名', hl: true },
  ],
  qrCap: '扫码 · 加入我的团队',
  dateText: '2026 年 10 月',
  /* 合规小字（hebao-design 红线3：数字须带口径与时间范围——轻方案：并入定版小字） */
  note: '数据口径：2026 年 10 月 · 个险渠道新单保费 · 仅用于内部表彰',
  monthCN: '十月 · 荣耀揭晓',
  monthEN: 'OCTOBER 2026 · HONOR MOMENT',
  starLabel: '2026 · 10　月 度 之 星',
  claim: '恭贺十月佳绩频传',
  quote: '专业赢得信赖',
  sealChar: '泰',
  items: [
    { k: '新单件数', v: '42 件', d: '▲ 环比 +12.0%' },
    { k: '目标达成率', v: '218%', d: '▲ 超时序 31.4pt' },
    { k: '新增客户', v: '36 人', d: '▲ 环比 +18.5%' },
    { k: '13 个月继续率', v: '98.6%', d: '— 持续保持高位' },
    { k: '全省排名', v: 'No.3', d: '▲ 前进 2 位' },
  ],
  nodes: [
    { label: '一月', value: '18.2 万', note: '起步' },
    { label: '四月', value: '42.6 万', note: '突破' },
    { label: '七月', value: '96.4 万', note: '进位' },
    { label: '十月', value: '286.5 万', note: '登顶' },
  ],
  radar: [
    { label: '业绩达成', v: 0.92 },
    { label: '承保件数', v: 0.82 },
    { label: '活动率', v: 0.88 },
    { label: '续保率', v: 0.74 },
    { label: '增员', v: 0.66 },
  ],
  pct: 75,
  goalTxt: '年度目标 1000 万',
  curMonth: 10,
  shareLab: '组内占比 38%',
  rankings: [
    { name: '周子墨', org: '杭州三区', value: '52.8万' },
    { name: '吴 倩', org: '宁波一支', value: '61.3万' },
    { name: '王志远', org: '杭州三区', value: '74.6万' },
    { name: '陈晓婷', org: '绍兴二支', value: '89.2万' },
    { name: '李静怡', org: '杭州三区', value: '286.5万' },
  ],
  steps: [
    '月初启动｜拜访 60 位客户 · 布局全月',
    '月中冲刺｜连续 12 天出单 · 稳住节奏',
    '月末收官｜单日 6 件 · 完成致命一击',
    '荣耀时刻｜达成 218% · 荣登全省前三',
  ],

  /* ── 第二批模板默认数据 ──
     hero / ribbon / subValue 故意不设默认：它们是跨模板通用字段，
     默认值会「串味」（接力版显示 01 万元就是教训），由各模板自行兜底 */
  roster: [
    { name: '李静怡', org: '杭州三区', value: '286.5 万', hl: true },
    { name: '周子墨', org: '杭州三区', value: '52.8 万' },
    { name: '吴 倩', org: '宁波一支', value: '48.2 万' },
    { name: '王志远', org: '绍兴二支', value: '41.6 万' },
    { name: '陈晓婷', org: '温州三区', value: '38.4 万' },
    { name: '林 越', org: '金华一支', value: '32.1 万' },
  ],
  mix: [
    { label: '年金险', v: 46, note: '131.8 万' },
    { label: '重疾险', v: 27, note: '77.4 万' },
    { label: '医疗险', v: 18, note: '51.6 万' },
    { label: '意外险', v: 9, note: '25.8 万' },
  ],
  goalCells: [
    { label: '一月', done: true, v: '82%' },
    { label: '二月', done: true, v: '96%' },
    { label: '三月', done: true, v: '104%' },
    { label: '四月', done: true, v: '112%' },
    { label: '五月', done: true, v: '98%' },
    { label: '六月', done: true, v: '121%' },
    { label: '七月', done: true, v: '136%' },
    { label: '八月', done: true, v: '118%' },
    { label: '九月', done: true, v: '142%' },
    { label: '十月', done: true, v: '218%' },
    { label: '十一月', done: false, v: '冲刺中' },
    { label: '十二月', done: false, v: '待启' },
  ],
  retro: {
    good: ['聚焦年金险高客经营', '连续 12 天出单不断档', '老客户转介绍 9 位'],
    bad: ['拜访量月末掉档', '重疾险开口率偏低', '增员进度落后 1 人'],
    next: ['11 月主攻重疾险开口', '每周固定 2 场客户沙龙', '完成 2 名增员储备'],
  },
  badges: [
    { name: '首单破冰', desc: '职业生涯第一单', unlocked: true },
    { name: '连续出单', desc: '连续21天有件', unlocked: true },
    { name: '百万达成', desc: '单月突破百万', unlocked: true },
    { name: '全省前十', desc: '跻身全省前十', unlocked: true },
    { name: '增员达人', desc: '年度增员3人', unlocked: false },
    { name: '金质团队', desc: '团队年度达标', unlocked: false },
  ],
  bubbles: [
    { side: 'l', text: '李经理，这份年金方案我看了三遍，就按这个办。', name: '张女士 · 老客户' },
    { side: 'r', text: '您放心，我今晚就把保单资料整理好发您。' },
    { side: 'l', text: '我妈的理赔三天就到账了，谢谢您跑前跑后。', name: '王先生 · 转介绍' },
    { side: 'r', text: '这是我应该做的，后续有任何问题随时找我。' },
    { side: 'l', text: '我把你推荐给我同事了，她也想了解一下。', name: '刘女士 · 转介绍' },
    { side: 'r', text: '感谢信任，我一定不辜负。' },
  ],
  versusA: { name: '杭州三区', value: '486.2 万', pct: 62, sub: '达成 186%' },
  versusB: { name: '宁波一支', value: '298.4 万', pct: 46, sub: '达成 142%' },
  mentorLine: '师傅　陈立群 · 资深总监',
  rookieLine: '徒弟　李静怡 · 高级业务经理',
};

/** 模板分类 —— 与原编辑器的八大类保持一致 */
export type Category =
  | '仪式贺报'
  | '巨字排版'
  | '数据图表'
  | '荣誉榜单'
  | '历程故事'
  | '团队招募'
  | '创意场景'
  | '创意风格'
  /* 第二批：按「使用场景」而非「视觉风格」分类 */
  | '新人成长'
  | '团队协作'
  | '客户服务'
  | '经营复盘'
  /* 第三批：GSAP 手法移植版（典藏系列） */
  | '典藏系列';

export type TemplateMeta = {
  id: string;
  name: string;
  cat: Category;
  /** 该模板是否需要人物照片 */
  photo?: boolean;
  /** 一句话说明它的叙事结构，便于选型 */
  note?: string;
};
