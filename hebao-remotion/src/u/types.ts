/* 通用贺报 · 数据契约
   一套字段覆盖 12 个行业：颁奖/晋升/签约/融资/上市/夺冠/毕业/交付/周年/新品……
   所有字段均可被 --props 覆盖，模板对缺省值做兜底。 */

export type Fact = { k: string; v: string };
export type Row = { name: string; role?: string; value?: string; hl?: boolean };
export type Milestone = { t: string; label: string; note?: string };

export type IndustryKey =
  | 'tech'
  | 'retail'
  | 'finance'
  | 'manufacture'
  | 'education'
  | 'health'
  | 'realestate'
  | 'media'
  | 'logistics'
  | 'energy'
  | 'sports'
  | 'culture';

export type UniversalProps = {
  /** 机构 / 品牌名（顶部品牌条） */
  brand: string;
  /** 眉标：大会名 / 时间 / 场景 */
  kicker: string;
  /** 主标题（2~8 字最佳） */
  title: string;
  /** 副标一句话 */
  subtitle: string;
  /** 受贺人 / 团队 / 主体 */
  honoree: string;
  /** 身份 / 职务 / 城市 */
  role: string;
  /** 奖项 / 事件名 */
  award: string;
  /** 核心数字 */
  metric: {
    value: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    unit: string;
    label: string;
  };
  /** 三项事实（战报 / 关键指标） */
  facts: Fact[];
  /** 榜单 / 名单（第一条为冠军） */
  rows: Row[];
  /** 三段历程 */
  milestones: Milestone[];
  /** 金句 / 评语 */
  quote: string;
  /** 日期 / 届次 */
  dateText: string;
  /** 合规 / 口径小字 */
  footnote: string;
  /** 视觉变体：1 | 2（同一套皮肤的两种配色） */
  accent: number;
  /** 粒子 / 随机的确定性种子 */
  seed: number;
  /** 行业预设：只影响默认文案口吻，不锁死视觉 */
  industry: IndustryKey;
};

export const DEFAULT_PROPS: UniversalProps = {
  brand: 'WORKBUDDY · 年度盛典',
  kicker: '2026 GLOBAL PARTNER SUMMIT · 某某市',
  title: '荣耀时刻',
  subtitle: '把每一次全力以赴，都变成值得被看见的高光',
  honoree: '某某计划团队',
  role: '年度最佳跨部门协作团队 · 产品与增长中心',
  award: '2026 年度卓越奖',
  metric: {
    value: 3.28,
    decimals: 2,
    prefix: '',
    suffix: '',
    unit: '亿',
    label: '年度签约总额',
  },
  facts: [
    { k: '同比增长', v: '+186%' },
    { k: '覆盖城市', v: '42 座' },
    { k: '交付准时率', v: '99.4%' },
  ],
  rows: [
    { name: '成员 A', role: '甲大区', value: '128.6', hl: true },
    { name: '成员 B', role: '乙大区', value: '116.2' },
    { name: '成员 C', role: '丙大区', value: '104.8' },
    { name: '成员 D', role: '丁大区', value: '98.5' },
    { name: '成员 E', role: '戊大区', value: '91.3' },
  ],
  milestones: [
    { t: '03', label: '立项起航', note: '从 0 到 1 组队' },
    { t: '07', label: '首战告捷', note: '单月破千万' },
    { t: '11', label: '登顶年度', note: '全司第一' },
  ],
  quote: '真正的荣耀，不是站在台上的一刻，而是没人看见时也没有停下。',
  dateText: '2026.11.05',
  footnote: '数据口径 · 2026 财年 · 内部表彰使用',
  accent: 1,
  seed: 20261105,
  industry: 'tech',
};

/** 行业预设：切换行业时同时给出一套通顺的默认文案 */
export const INDUSTRY_PRESETS: Record<
  IndustryKey,
  Pick<UniversalProps, 'kicker' | 'title' | 'subtitle' | 'honoree' | 'role' | 'award' | 'metric' | 'facts' | 'quote'>
> = {
  tech: {
    kicker: '2026 全球产品大会 · 某某市',
    title: '重新定义',
    subtitle: '把复杂留给系统，把简单交给用户',
    honoree: '某某计划团队',
    role: '年度最佳产品团队 · 平台事业群',
    award: '2026 年度卓越奖',
    metric: { value: 3.28, decimals: 2, unit: '亿', label: '年度签约总额' },
    facts: [
      { k: '同比增长', v: '+186%' },
      { k: '服务用户', v: '4200 万' },
      { k: '准时交付', v: '99.4%' },
    ],
    quote: '把每一次全力以赴，都变成值得被看见的高光。',
  },
  retail: {
    kicker: '2026 零售增长峰会 · 某某市',
    title: '万店同庆',
    subtitle: '一城一店，都是品牌与顾客的现场',
    honoree: '某某零售铁军',
    role: '年度冠军大区 · 门店运营中心',
    award: '年度增长先锋奖',
    metric: { value: 12.6, decimals: 1, unit: '亿', label: '年度零售总额' },
    facts: [
      { k: '新开门店', v: '386 家' },
      { k: '同店增长', v: '+42%' },
      { k: '会员复购', v: '68.3%' },
    ],
    quote: '货架会说话，顾客会记得，认真从不白费。',
  },
  finance: {
    kicker: '2026 财富管理年会 · 某某市',
    title: '稳中致远',
    subtitle: '穿越周期的人，才配得上时间给的复利',
    honoree: '某某资产配置团队',
    role: '年度最佳投顾团队 · 财富管理部',
    award: '年度资产配置金奖',
    metric: { value: 86.4, decimals: 1, unit: '亿', label: '年度管理规模' },
    facts: [
      { k: '年化回报', v: '18.6%' },
      { k: '客户留存', v: '96.2%' },
      { k: '风控评级', v: 'AAA' },
    ],
    quote: '时间是最好的杠杆，耐心是最贵的仓位。',
  },
  manufacture: {
    kicker: '2026 智能制造大会 · 某某市',
    title: '智造巅峰',
    subtitle: '每 0.01 毫米的坚持，汇成中国制造的底气',
    honoree: '某某智造事业部',
    role: '年度精益标杆 · 智能制造基地',
    award: '年度质量金奖',
    metric: { value: 128, decimals: 0, unit: '万件', label: '年度下线产量' },
    facts: [
      { k: '良品率', v: '99.86%' },
      { k: '自动化率', v: '82%' },
      { k: '交付周期', v: '-36%' },
    ],
    quote: '把标准做到极致，世界自然会让路。',
  },
  education: {
    kicker: '2026 教育成果发布会 · 某某市',
    title: '桃李成林',
    subtitle: '点亮一个人，就点亮了一个家庭的未来',
    honoree: '某某教研组',
    role: '年度金牌教研团队 · 基础教育中心',
    award: '年度育人成就奖',
    metric: { value: 12800, decimals: 0, unit: '人', label: '年度受益学员' },
    facts: [
      { k: '升学提升', v: '+31%' },
      { k: '课程完课', v: '94.7%' },
      { k: '家长推荐', v: '97.2%' },
    ],
    quote: '教育是把灯递出去，而不是把路替人走完。',
  },
  health: {
    kicker: '2026 医疗创新大会 · 某某市',
    title: '守护新生',
    subtitle: '每一次精准判断，背后都是无数个不眠夜',
    honoree: '某某临床团队',
    role: '年度卓越科室 · 三甲医院',
    award: '年度医疗创新奖',
    metric: { value: 6800, decimals: 0, unit: '例', label: '年度成功手术' },
    facts: [
      { k: '成功率', v: '99.2%' },
      { k: '平均住院', v: '-2.4 天' },
      { k: '患者满意度', v: '98.6%' },
    ],
    quote: '所谓奇迹，不过是有人不肯放手。',
  },
  realestate: {
    kicker: '2026 城市发展论坛 · 某某市',
    title: '城市封面',
    subtitle: '把一片土地，变成一座城市愿意记住的地方',
    honoree: '某某城市综合体',
    role: '年度标杆项目 · 城市更新事业部',
    award: '年度人居典范奖',
    metric: { value: 58, decimals: 0, unit: '万㎡', label: '年度交付面积' },
    facts: [
      { k: '去化率', v: '92%' },
      { k: '交付满意度', v: '96.8%' },
      { k: '绿色认证', v: '金级' },
    ],
    quote: '建筑会老去，但一座城市的记忆不会。',
  },
  media: {
    kicker: '2026 内容生态大会 · 某某市',
    title: '破圈生长',
    subtitle: '好内容自己会长脚，走到它该去的地方',
    honoree: '某某内容实验室',
    role: '年度最具影响力团队 · 内容中心',
    award: '年度内容大奖',
    metric: { value: 42, decimals: 0, unit: '亿', label: '年度总播放' },
    facts: [
      { k: '涨粉', v: '+1280 万' },
      { k: '爆款率', v: '18.6%' },
      { k: '完播率', v: '62.4%' },
    ],
    quote: '流量会过去，作品会留下。',
  },
  logistics: {
    kicker: '2026 供应链大会 · 某某市',
    title: '万里必达',
    subtitle: '每一公里，都是承诺在路上的样子',
    honoree: '某某履约网络',
    role: '年度最佳履约团队 · 全国运营中心',
    award: '年度时效金奖',
    metric: { value: 9.6, decimals: 1, unit: '亿单', label: '年度履约单量' },
    facts: [
      { k: '次日达', v: '96.3%' },
      { k: '破损率', v: '0.02%' },
      { k: '覆盖区县', v: '2861 个' },
    ],
    quote: '把货送到，是本事；把信任送到，是本事里的本事。',
  },
  energy: {
    kicker: '2026 全球能源峰会 · 某某市',
    title: '向光而行',
    subtitle: '每一度绿电，都是写给未来的答案',
    honoree: '某某新能源基地',
    role: '年度绿色标杆 · 新能源事业群',
    award: '年度碳中和先锋奖',
    metric: { value: 18.6, decimals: 1, unit: '亿度', label: '年度绿电产出' },
    facts: [
      { k: '减碳量', v: '152 万吨' },
      { k: '利用小时', v: '1680 h' },
      { k: '并网率', v: '100%' },
    ],
    quote: '我们不是在发电，是在把阳光存进未来。',
  },
  sports: {
    kicker: '2026 全国总决赛 · 某某市',
    title: '登顶之姿',
    subtitle: '所有看不见的训练，都在这一刻被看见',
    honoree: '某某竞技战队',
    role: '年度总冠军 · 职业联赛',
    award: '2026 赛季总冠军',
    metric: { value: 4, decimals: 0, unit: '连冠', label: '赛季连胜纪录' },
    facts: [
      { k: '胜率', v: '86.7%' },
      { k: '场均得分', v: '112.4' },
      { k: 'MVP', v: '2 人' },
    ],
    quote: '冠军不是终点，是下一次起跑线。',
  },
  culture: {
    kicker: '2026 城市文化季 · 某某市',
    title: '万象新生',
    subtitle: '让古老的东西，用年轻人喜欢的方式再活一次',
    honoree: '某某数字文创计划',
    role: '年度文化 IP · 城市文旅集团',
    award: '年度文化创新大奖',
    metric: { value: 2600, decimals: 0, unit: '万人次', label: '年度观展人次' },
    facts: [
      { k: '全网曝光', v: '8.6 亿' },
      { k: '文创销售', v: '1.2 亿' },
      { k: '海外展演', v: '12 城' },
    ],
    quote: '传统不是过去，是还没被讲完的故事。',
  },
};
