import type { UniversalProps } from './types';

/* 13 套皮肤 × 各自独立的演示内容 —— 行业 / 品牌 / 人物 / 数字 / 金句全部不同，
   让画廊浏览时每一组都像真的换了一个客户，而不是同一份稿子换底色。
   全部字段仍可被 --props 覆盖。 */

export const SKIN_DEMO: Record<string, Partial<UniversalProps>> = {
  /* 01 极光玻璃 → 科技 SaaS 年度发布 */
  aurora: {
    brand: '某某智能 · 年度发布会',
    kicker: '2026 DEVNEXT 全球开发者大会 · 某某市',
    title: '智涌未来',
    subtitle: '让每一家公司，都拥有自己的大模型引擎',
    honoree: '某某大模型团队',
    role: '年度最佳技术团队 · 基础模型事业部',
    award: '2026 年度技术突破奖',
    metric: { value: 3.28, decimals: 2, unit: '亿', label: '年度签约总额' },
    facts: [
      { k: '推理提效', v: '4.6 倍' },
      { k: '服务客户', v: '2300 家' },
      { k: '模型可用性', v: '99.99%' },
    ],
    rows: [
      { name: '成员 A', role: '算法平台部', value: '128.6', hl: true },
      { name: '成员 B', role: '推理引擎组', value: '116.2' },
      { name: '成员 C', role: '数据中台', value: '104.8' },
      { name: '成员 D', role: '安全合规组', value: '98.5' },
      { name: '成员 E', role: '开发者关系', value: '91.3' },
    ],
    milestones: [
      { t: '02', label: '架构立项', note: '千亿参数定档' },
      { t: '06', label: '开放公测', note: '3 天 10 万调用' },
      { t: '10', label: '全面商用', note: '签约破三亿' },
    ],
    quote: '把复杂留给系统，把简单交给用户。',
    dateText: '2026.10.24',
    footnote: '数据口径 · 2026 财年 · 经第三方审计',
  },

  /* 02 液态铬 → 私募金融年度投资人大会 */
  chrome: {
    brand: '某某资本 · 年度投资人大会',
    kicker: '2026 LP ANNUAL MEETING · 某某江畔',
    title: '穿越周期',
    subtitle: '在不确定的时代，做确定性的事',
    honoree: '某某配置团队',
    role: '年度最佳投顾团队 · 多资产策略部',
    award: '年度资产配置金奖',
    metric: { value: 86.4, decimals: 1, unit: '亿', label: '年度管理规模' },
    facts: [
      { k: '年化回报', v: '18.6%' },
      { k: '最大回撤', v: '-4.2%' },
      { k: '客户留存', v: '96.2%' },
    ],
    rows: [
      { name: '某某', role: '宏观策略', value: '42.8', hl: true },
      { name: '经理 B', role: '权益投资', value: '36.5' },
      { name: '经理 C', role: '固收+组', value: '31.2' },
      { name: '经理 D', role: '量化对冲', value: '27.9' },
      { name: '经理 E', role: '客户服务', value: '22.4' },
    ],
    milestones: [
      { t: 'Q1', label: '逆势加仓', note: '在恐慌中建仓' },
      { t: 'Q3', label: '产品封盘', note: '超额收益 21%' },
      { t: 'Q4', label: '规模登顶', note: '管理破 86 亿' },
    ],
    quote: '时间是最好的杠杆，耐心是最贵的仓位。',
    dateText: '2026.12.18',
    footnote: '历史业绩不代表未来表现 · 投资有风险',
  },

  /* 03 霓虹赛博 → 电竞总决赛夺冠夜 */
  neon: {
    brand: '某某联赛 S10 · 总决赛',
    kicker: '2026 GRAND FINALS · 某某竞技中心',
    title: '一穿到底',
    subtitle: '从败者组杀回来的队伍，不值得任何怜悯',
    honoree: '某某战队',
    role: 'S10 总冠军 · 败者组五连胜奇迹',
    award: '总冠军戒指 · FMVP',
    metric: { value: 412, decimals: 0, unit: '万', label: '决赛实时在线峰值' },
    facts: [
      { k: '决赛比分', v: '4 : 2' },
      { k: '场均击杀', v: '18.4' },
      { k: '粉丝增长', v: '+217 万' },
    ],
    rows: [
      { name: '选手 A (打野)', role: 'FMVP', value: '9.2', hl: true },
      { name: '选手 B (中单)', role: 'MVP ×3', value: '8.6' },
      { name: '选手 C (射手)', role: '输出核心', value: '8.1' },
      { name: '选手 D (上单)', role: '抗压之王', value: '7.4' },
      { name: '选手 E (辅助)', role: '开团手', value: '6.8' },
    ],
    milestones: [
      { t: '08', label: '跌入败者组', note: '没人看好我们' },
      { t: '09', label: '五连胜', note: '一穿五杀回决赛' },
      { t: '11', label: '捧起冠军奖杯', note: 'S10 世界之巅' },
    ],
    quote: '落后的时候别看比分，看队友。',
    dateText: '2026.11.15',
    footnote: '赛事数据 · 官方统计口径',
  },

  /* 04 高定黑白 → 顶奢地产交付盛典 */
  noir: {
    brand: '某某壹号 · 交付盛典',
    kicker: 'THE PINNACLE · 城市天际线藏品',
    title: '如约而至',
    subtitle: '三年打磨，只为交付时那一眼值得',
    honoree: '某某塔项目组',
    role: '年度标杆项目 · 城市更新事业部',
    award: '年度人居典范金奖',
    metric: { value: 58, decimals: 0, unit: '万㎡', label: '年度高品质交付' },
    facts: [
      { k: '如期交付率', v: '100%' },
      { k: '业主满意度', v: '98.9%' },
      { k: '绿色认证', v: '绿色建筑铂金认证' },
    ],
    rows: [
      { name: '某某', role: '设计总监', value: '19.6', hl: true },
      { name: '负责人 B', role: '工程总包', value: '17.2' },
      { name: '负责人 C', role: '精装品控', value: '15.8' },
      { name: '负责人 D', role: '景观营造', value: '13.4' },
      { name: '负责人 E', role: '客户服务', value: '12.1' },
    ],
    milestones: [
      { t: '23', label: '方案定标', note: '七轮评审' },
      { t: '25', label: '结构封顶', note: '城市新天际线' },
      { t: '26', label: '完美交付', note: '零重大客诉' },
    ],
    quote: '建筑会老去，但一座城市的记忆不会。',
    dateText: '2026.09.28',
    footnote: '交付口径 · 竣工备案面积',
  },

  /* 05 酸性粗野 → 电商大促战报 */
  acid: {
    brand: '年中大促 全域狂欢 · 终极战报',
    kicker: '2026 MID-YEAR MEGASALE · 全平台',
    title: '卖爆了',
    subtitle: '开播 4 小时，直播间挤进了 100 万人',
    honoree: '美妆超级爆款组',
    role: '年度带货冠军 · 美妆事业部',
    award: '年中大促 年度销量大奖',
    metric: { value: 12.6, decimals: 1, unit: '亿', label: '大促总成交 GMV' },
    facts: [
      { k: '同比增长', v: '+186%' },
      { k: '爆品数', v: '7 支' },
      { k: '退货率', v: '仅 3.1%' },
    ],
    rows: [
      { name: '直播间 A', role: '美妆', value: '2.86', hl: true },
      { name: '家居直播间 A', role: '家居', value: '2.14' },
      { name: '食品直播间 A', role: '食品', value: '1.92' },
      { name: '数码直播间 A', role: '数码', value: '1.67' },
      { name: '服饰直播间 A', role: '服饰', value: '1.42' },
    ],
    milestones: [
      { t: 'D1', label: '开门红', note: '首小时破亿' },
      { t: 'D9', label: '品类第一', note: '美妆 TOP1' },
      { t: 'D18', label: '终极收官', note: 'GMV 12.6 亿' },
    ],
    quote: '货架会说话，顾客会记得，认真从不白费。',
    dateText: '2026.06.18',
    footnote: 'GMV 口径 · 含退款前支付金额',
  },

  /* 06 装饰艺术 → 国际艺术节闭幕颁奖 */
  deco: {
    brand: '国际艺术节 · 闭幕颁奖礼',
    kicker: '2026 GRAND ARTS FESTIVAL · 某某大剧院',
    title: '致 敬',
    subtitle: '所有伟大的作品，都始于一次不被理解的坚持',
    honoree: '《剧目甲》舞剧团',
    role: '年度最佳剧目 · 当代舞单元',
    award: '年度剧目大奖',
    metric: { value: 32, decimals: 0, unit: '场', label: '年度全国巡演' },
    facts: [
      { k: '上座率', v: '97.4%' },
      { k: '巡演城市', v: '19 城' },
      { k: '媒体评分', v: '9.1 / 10' },
    ],
    rows: [
      { name: '主创 A', role: '导演 · 编舞', value: '一等奖', hl: true },
      { name: '某某', role: '首席舞者', value: '最佳女舞者' },
      { name: '主创 B', role: '舞美设计', value: '最佳舞美' },
      { name: '主创 C', role: '原创配乐', value: '最佳音乐' },
      { name: '主创 D', role: '灯光设计', value: '提名奖' },
    ],
    milestones: [
      { t: '03', label: '首演', note: '甲市 · 谢幕 11 次' },
      { t: '07', label: '出海', note: '海外双场售罄' },
      { t: '11', label: '加冕', note: '捧起年度剧目大奖' },
    ],
    quote: '舞台上的每一秒，都是台下十年的回声。',
    dateText: '2026.11.08',
    footnote: '评委会最终裁定 · 2026 年度大奖',
  },

  /* 07 动能大字 → 年末大促 履约战报 */
  kinetic: {
    brand: '年末大促 履约战报 · 实时',
    kicker: '2026 LOGISTICS SPRINT · 全国仓网',
    title: '使命必达',
    subtitle: '从下单到上门，平均只用了 19 小时',
    honoree: '某某速运网络',
    role: '年度最佳履约团队 · 全国运营中心',
    award: '年度时效金奖',
    metric: { value: 9.6, decimals: 1, unit: '亿单', label: '大促总履约单量' },
    facts: [
      { k: '次日达', v: '96.3%' },
      { k: '平均时效', v: '19 h' },
      { k: '破损率', v: '0.02%' },
    ],
    rows: [
      { name: '分拣中心 A', role: '甲市', value: '1.82', hl: true },
      { name: '枢纽 B', role: '乙市', value: '1.56' },
      { name: '枢纽 C', role: '丙市', value: '1.34' },
      { name: '枢纽 D', role: '丁市', value: '1.18' },
      { name: '枢纽 E', role: '戊市', value: '1.02' },
    ],
    milestones: [
      { t: '00:00', label: '尾款开抢', note: '峰值 74 万单/分' },
      { t: 'T+1', label: '全网提速', note: '3 万车次在途' },
      { t: 'T+7', label: '全部妥投', note: '零积压收官' },
    ],
    quote: '把货送到是本事，把信任送到是本事里的本事。',
    dateText: '2026.11.11',
    footnote: '履约口径 · 签收量 · 行业监测',
  },

  /* 08 转播竞技 → 城市马拉松年度颁奖 */
  stadium: {
    brand: '城市马拉松联赛 · 年度颁奖',
    kicker: '2026 CITY MARATHON SERIES · 总决赛',
    title: '破风',
    subtitle: '42.195 公里，每一步都算数',
    honoree: '某某跑团',
    role: '年度最佳跑团 · 全 国联赛总榜',
    award: '年度总冠军奖杯',
    metric: { value: 486, decimals: 0, unit: '人次', label: '年度全马 / 半马参赛人次' },
    facts: [
      { k: '参赛人次', v: '486' },
      { k: '完赛率', v: '99.1%' },
      { k: '分站冠军', v: '6 站' },
    ],
    rows: [
      { name: '某某', role: '全马 · 2:09:47', value: '第 1', hl: true },
      { name: '选手 B', role: '全马 · 2:31:05', value: '第 1' },
      { name: '选手 C', role: '半马 · 1:06:12', value: '第 1' },
      { name: '选手 D', role: '半马 · 1:14:48', value: '第 2' },
      { name: '选手 E', role: '全马 · 2:44:33', value: '第 3' },
    ],
    milestones: [
      { t: '04', label: '揭幕站', note: '甲市 · 夺首冠' },
      { t: '09', label: '北方站', note: '雨战逆袭' },
      { t: '11', label: '总决赛', note: '锁定年度总榜' },
    ],
    quote: '风不会为任何人停下，所以我们要跑得比风快。',
    dateText: '2026.11.02',
    footnote: '计时口径 · 芯片净成绩',
  },

  /* 09 全息镭射 → 医疗 AI 峰会 */
  holo: {
    brand: '全球医疗 AI 峰会 · 年度颁奖',
    kicker: '2026 MEDAI SUMMIT · 某某国际会展',
    title: '影像之外',
    subtitle: 'AI 读片 0.8 秒，把医生还给病人',
    honoree: '某某影像诊断团队',
    role: '年度卓越团队 · 三甲医院影像科',
    award: '年度医疗创新金奖',
    metric: { value: 6800, decimals: 0, unit: '例', label: '年度 AI 辅助确诊' },
    facts: [
      { k: '早期检出率', v: '+28.4%' },
      { k: '平均读片', v: '0.8 秒' },
      { k: '误诊下降', v: '-46%' },
    ],
    rows: [
      { name: '某某', role: '影像科主任', value: 'AI 共诊', hl: true },
      { name: '医师 B', role: '算法负责人', value: '核心引擎' },
      { name: '医师 C', role: '临床验证', value: '12 家医院' },
      { name: '医师 D', role: '数据标注', value: '40 万例' },
      { name: '医师 E', role: '伦理审查', value: '全绿通过' },
    ],
    milestones: [
      { t: '01', label: '模型收敛', note: '40 万例训练' },
      { t: '05', label: '临床试点', note: '首批 3 家医院' },
      { t: '11', label: '全面落地', note: '12 家医院联网' },
    ],
    quote: '所谓奇迹，不过是有人不肯放手。',
    dateText: '2026.11.20',
    footnote: '临床数据 · 已通过伦理委员会审查',
  },

  /* 10 新中式水墨 → 书院教育年度礼成 */
  ink: {
    brand: '某某书院 · 年度礼成',
    kicker: '丙午年 · 金秋谢师礼',
    title: '桃李成蹊',
    subtitle: '点亮一个人，就点亮了一个家庭的未来',
    honoree: '格物教研组',
    role: '年度金牌教研团队 · 人文社科系',
    award: '年度育人成就奖',
    metric: { value: 12800, decimals: 0, unit: '人', label: '年度受益学子' },
    facts: [
      { k: '升学提升', v: '+31%' },
      { k: '课程完课', v: '94.7%' },
      { k: '家长推荐', v: '97.2%' },
    ],
    rows: [
      { name: '某某', role: '经史主讲', value: '甲等', hl: true },
      { name: '教习 B', role: '格物致知课', value: '甲等' },
      { name: '教习 C', role: '诗赋习作', value: '优等' },
      { name: '教习 D', role: '书法教习', value: '优等' },
      { name: '教习 E', role: '蒙学部', value: '优等' },
    ],
    milestones: [
      { t: '春', label: '开笔礼', note: '新生四百人' },
      { t: '夏', label: '游学', note: '外地访学一周' },
      { t: '秋', label: '礼成', note: '榜上有名者众' },
    ],
    quote: '教育是把灯递出去，而不是把路替人走完。',
    dateText: '丙午年 · 九月初九',
    footnote: '书院教务处 · 历年学籍统计',
  },

  /* 11 复古孔版 → 某某制造百万件下线 */
  riso: {
    brand: '某某车间 · 第 100 万件下线仪式',
    kicker: '2026 CRAFTED SERIES · 某某智造基地',
    title: '第 100 万件',
    subtitle: '良品率 99.86%，是这一百万件共同的签名',
    honoree: '良品率攻坚小组',
    role: '年度精益标杆 · 智能制造基地',
    award: '年度质量金奖',
    metric: { value: 100, decimals: 0, unit: '万件', label: '累计精密下线' },
    facts: [
      { k: '良品率', v: '99.86%' },
      { k: '自动化率', v: '82%' },
      { k: '返工率', v: '0.14%' },
    ],
    rows: [
      { name: 'A 线 · 光学模组', role: '无尘车间', value: '41.2', hl: true },
      { name: 'B 线 · 伺服电机', role: '精密装配', value: '33.6' },
      { name: 'C 线 · 精密齿轮', role: '热处理', value: '18.4' },
      { name: 'D 线 · 气密检测', role: '品控', value: '6.8' },
    ],
    milestones: [
      { t: '21', label: '基地落成', note: '第一件下线' },
      { t: '24', label: '工艺定型', note: '良率破 99%' },
      { t: '26', label: '百万达成', note: '零批次事故' },
    ],
    quote: '把标准做到极致，世界自然会让路。',
    dateText: '2026.08.16',
    footnote: '产量口径 · 累计合格下线件数',
  },

  /* 12 电影片头 → 能源年度盛典 */
  cinema: {
    brand: '某某能源 · 年度盛典',
    kicker: 'A YEAR IN LIGHT · 纪录式年度总结',
    title: '向光而行',
    subtitle: '每一度绿电，都是写给未来的答案',
    honoree: '高原光伏基地',
    role: '年度绿色标杆 · 新能源事业群',
    award: '年度碳中和先锋奖',
    metric: { value: 18.6, decimals: 1, unit: '亿度', label: '年度绿电产出' },
    facts: [
      { k: '减碳量', v: '152 万吨' },
      { k: '等效种树', v: '8400 公顷' },
      { k: '并网率', v: '100%' },
    ],
    rows: [
      { name: '基地 A', role: '海拔 3100m', value: '6.2', hl: true },
      { name: '基地 B', role: '沙漠治理', value: '5.1' },
      { name: '基地 C', role: '板上发电', value: '4.3' },
      { name: '基地 D', role: '山地光伏', value: '3.0' },
    ],
    milestones: [
      { t: '03', label: '解冻开工', note: '雪线上的桩基' },
      { t: '07', label: '全容量并网', note: '单日 720 万度' },
      { t: '12', label: '全年收官', note: '18.6 亿度绿电' },
    ],
    quote: '我们不做光的故事，我们就是光本身。',
    dateText: '2026.12.31',
    footnote: '电量口径 · 电网结算数据',
  },

  /* 13 玻璃拟态 → 美妆品牌会员之夜 */
  glass: {
    brand: '某某美妆 · 会员之夜',
    kicker: '2026 MEMBER GALA · 某某中心',
    title: '焕新致谢',
    subtitle: '把会员的每一次到店，都变成一场小型仪式',
    honoree: '线下体验焕新项目组',
    role: '年度最佳体验团队 · 零售体验中心',
    award: '年度体验设计金奖',
    metric: { value: 96.8, decimals: 1, unit: '%', label: '会员年度续卡率' },
    facts: [
      { k: '会员新增', v: '+86 万' },
      { k: '到店频次', v: '+2.4 次' },
      { k: 'NPS 净推荐', v: '72' },
    ],
    rows: [
      { name: '概念店 A', role: '甲市 · 门店销售(万)', value: '428.6', hl: true },
      { name: '旗舰店 A', role: '乙市 · 门店销售(万)', value: '396.2' },
      { name: '中心店 A', role: '丙市 · 门店销售(万)', value: '372.4' },
      { name: '汇店 A', role: '丁市 · 门店销售(万)', value: '351.8' },
      { name: '塔店 A', role: '戊市 · 门店销售(万)', value: '338.5' },
    ],
    milestones: [
      { t: '02', label: '空间焕新', note: '首店改造落地' },
      { t: '06', label: '会员体系 2.0', note: '积分即护肤' },
      { t: '10', label: '续卡新高', note: '96.8% 续卡率' },
    ],
    quote: '美的生意，本质是让人心甘情愿地被善待。',
    dateText: '2026.10.30',
    footnote: '会员数据 · 脱敏统计口径',
  },
};
