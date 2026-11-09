import React from 'react';
import type { Category, HebaoProps } from '../data/types';
import { Honor } from './Honor';
import { FirstOrder } from './FirstOrder';
import { Relay } from './Relay';
import { Claim } from './Claim';
import { Portfolio } from './Portfolio';
import { Income } from './Income';
import { GoalBreak } from './GoalBreak';
import { Review } from './Review';
import { Kickoff } from './Kickoff';
import { ClientVoice } from './ClientVoice';
import { Thanks } from './Thanks';
import { Service } from './Service';
import { Referral } from './Referral';
import { Versus } from './Versus';
import { Expand } from './Expand';
import { Mentor } from './Mentor';
import { Morning } from './Morning';
import { Streak } from './Streak';
import { Achieve } from './Achieve';
import { HundredDays } from './HundredDays';
import { Graduate } from './Graduate';
import { HonorPro } from './HonorPro';
import { Battle } from './Battle';
import { Scroll } from './Scroll';
import { Medal } from './Medal';
import { Silk } from './Silk';
import { Giant } from './Giant';
import { Vertical } from './Vertical';
import { News } from './News';
import { Quote } from './Quote';
import { Flash } from './Flash';
import { Ticket } from './Ticket';
import { Rocket } from './Rocket';
import { Elevator } from './Elevator';
import { Subway } from './Subway';
import { Firework } from './Firework';
import { Domino } from './Domino';
import { Chat } from './Chat';
import { Cube } from './Cube';
import { Coin } from './Coin';
import { Led } from './Led';
import { Origami } from './Origami';
import { Ink } from './Ink';
import { Papercut } from './Papercut';
import { Neon } from './Neon';
import { Terminal } from './Terminal';
import { Blueprint } from './Blueprint';
import { Score } from './Score';
import { Bankbook } from './Bankbook';
import { Mahjong } from './Mahjong';
import { Constellation } from './Constellation';
import { Thermo } from './Thermo';
import { Split } from './Split';
import { Ring } from './Ring';
import { Bars } from './Bars';
import { Gauge } from './Gauge';
import { Calendar } from './Calendar';
import { Radar } from './Radar';
import { Checklist } from './Checklist';
import { Mosaic } from './Mosaic';
import { Total } from './Total';
import { Share } from './Share';
import { Kpi } from './Kpi';
import { Ranking } from './Ranking';
import { Podium } from './Podium';
import { Trophy } from './Trophy';
import { Star } from './Star';
import { Crown } from './Crown';
import { Grid } from './Grid';
import { Cert } from './Cert';
import { Dossier } from './Dossier';
import { Timeline } from './Timeline';
import { Path } from './Path';
import { Tenure } from './Tenure';
import { Letter } from './Letter';
import { Polaroid } from './Polaroid';
import { Film } from './Film';
import { Ladder } from './Ladder';
import { Team } from './Team';
import { Duo } from './Duo';
import { Invite } from './Invite';
/* ── 第三批：典藏系列（GSAP 手法移植版）── */
import { GsImpact } from './gs/GsImpact';
import { GsCurtain } from './gs/GsCurtain';
import { GsBeacon } from './gs/GsBeacon';
import { GsAurora } from './gs/GsAurora';
import { GsMedalwall } from './gs/GsMedalwall';
import { GsSpotlight } from './gs/GsSpotlight';
import { GsGoldframe } from './gs/GsGoldframe';
import { GsEngine } from './gs/GsEngine';
import { GsNameflow } from './gs/GsNameflow';
import { GsMonolith } from './gs/GsMonolith';
import { GsLaurel } from './gs/GsLaurel';
import { GsBanner } from './gs/GsBanner';
import { GsCrystal } from './gs/GsCrystal';
import { GsAscent } from './gs/GsAscent';
import { GsPulse } from './gs/GsPulse';
import { GsGazette } from './gs/GsGazette';
import { GsRibbon } from './gs/GsRibbon';
import { GsGalaxy } from './gs/GsGalaxy';
import { GsHerald } from './gs/GsHerald';
import { GsCapsule } from './gs/GsCapsule';

/**
 * 模板注册表 —— 全库唯一入口。
 * 新增模板只需在数组里加一行，Root 会自动按分类分组、生成 Composition。
 */
export type TemplateDef = {
  /** Composition id，与 HTML 版 key 一致，方便互相对照 */
  id: string;
  name: string;
  cat: Category;
  component: React.FC<HebaoProps>;
  /** 是否使用人物照片 */
  photo?: boolean;
  /** 一句话叙事结构 */
  note?: string;
};

export const TEMPLATES: TemplateDef[] = [
  // ── 仪式贺报 ──
  { id: 'honor', name: '喜庆红金版', cat: '仪式贺报', component: Honor, photo: true, note: '母版 / 印章启幕 · 恭贺二字 · 拱门人像' },
  { id: 'battle', name: '战报仪式版', cat: '仪式贺报', component: Battle, photo: true, note: '捷报印章 / 滚数 / 战报条目，开门红气质' },
  { id: 'scroll', name: '鎏金卷轴版', cat: '仪式贺报', component: Scroll, photo: true, note: '卷轴启封 / 纸面展开 / 荣录条目，最高贵典雅' },
  { id: 'medal', name: '勋章功勋版', cat: '仪式贺报', component: Medal, photo: false, note: '缎带勋章 / 数字刻章 / 名牌揭牌' },
  { id: 'silk', name: '喜报红绸版', cat: '仪式贺报', component: Silk, photo: true, note: '喜报头匾 / 报喜条目，日常转发最喜庆' },
  { id: 'honorpro', name: '喜庆红金 · PRO 演示', cat: '仪式贺报', component: HonorPro, photo: true, note: '提质对比样张：镜头震动 / 冲击光环 / 彩带 / 扫光 / 颗粒 / Ken-Burns' },

  // ── 巨字排版 ──
  { id: 'giant', name: '巨字宣言版', cat: '巨字排版', component: Giant, photo: true, note: '两行巨字交错砸落 / 滚数 / 三项' },
  { id: 'vertical', name: '竖排书法版', cat: '巨字排版', component: Vertical, photo: false, note: '竖排大字右起 / 竖名 / 方章' },
  { id: 'news', name: '号外头条版', cat: '巨字排版', component: News, photo: true, note: '报头压落 / 头条大标题 / 报纸条目+照片' },
  { id: 'quote', name: '金句箴言版', cat: '巨字排版', component: Quote, photo: true, note: '大引号金句逐字 / 滚数 / 人物' },
  { id: 'ticket', name: '荣誉存根版', cat: '巨字排版', component: Ticket, photo: true, note: '票券撕线 / 存根编号 / 条码' },
  { id: 'flash', name: '数字快闪版', cat: '巨字排版', component: Flash, photo: true, note: '三组数字连闪定格，节奏最快' },

  // ── 数据图表 ──
  { id: 'split', name: '今昔对比版', cat: '数据图表', component: Split, photo: true, note: '目标vs达成双栏对垒 / 补充条目' },
  { id: 'ring', name: '目标冲刺版', cat: '数据图表', component: Ring, photo: true, note: '进度环充能 / 环心滚数 / 三项' },
  { id: 'bars', name: '柱状战力版', cat: '数据图表', component: Bars, photo: true, note: '人物×数字 / 五柱逐根升起 / 峰值高亮' },
  { id: 'gauge', name: '仪表冲刺版', cat: '数据图表', component: Gauge, photo: true, note: '半圆仪表盘指针扫至达成率 / 三项' },
  { id: 'calendar', name: '全勤日历版', cat: '数据图表', component: Calendar, photo: true, note: '人物×数字 / 月历逐格点亮' },
  { id: 'radar', name: '五维战力版', cat: '数据图表', component: Radar, photo: true, note: '雷达图五维展开 / 带百分比轴标' },
  { id: 'checklist', name: '战果清单版', cat: '数据图表', component: Checklist, photo: true, note: '清单逐条打勾 / 汇总大数字' },
  { id: 'total', name: '年度累计版', cat: '数据图表', component: Total, photo: false, note: '年度滚数 / 进度条充能 / 月份刻度' },
  { id: 'mosaic', name: '像素战报版', cat: '数据图表', component: Mosaic, photo: true, note: '人像像素块显影开场 / 滚数 / 三项' },
  { id: 'share', name: '占比称雄版', cat: '数据图表', component: Share, photo: false, note: '占比大环 / No.1 环心 / 图例' },
  { id: 'kpi', name: '数据长卷版', cat: '数据图表', component: Kpi, photo: false, note: '五项KPI逐行翻牌 / 汇总大数字压轴' },

  // ── 荣誉榜单 ──
  { id: 'ranking', name: '榜单风云版', cat: '荣誉榜单', component: Ranking, photo: false, note: 'No.5→No.1 金榜揭晓 / 冠军双环印章压轴' },
  { id: 'podium', name: '领奖台版', cat: '荣誉榜单', component: Podium, photo: false, note: '领奖台 2-1-3 升起 / 冠军聚焦' },
  { id: 'trophy', name: '金杯荣耀版', cat: '荣誉榜单', component: Trophy, photo: true, note: '奖杯勾线 / 大数字 / 三项 / 人物' },
  { id: 'star', name: '五星认证版', cat: '荣誉榜单', component: Star, photo: true, note: '五星逐颗点亮 / 大数字 / 格言收尾' },
  { id: 'crown', name: '王者加冕版', cat: '荣誉榜单', component: Crown, photo: true, note: '光芒 + 皇冠勾画 / NO.1 / 人物' },
  { id: 'grid', name: '九宫战绩版', cat: '荣誉榜单', component: Grid, photo: false, note: '九宫逐格点亮 / 中心「贺」字压轴' },
  { id: 'cert', name: '荣誉奖状版', cat: '荣誉榜单', component: Cert, photo: true, note: '奖状斜插升起 / 朱砂章 / 圆角小照' },
  { id: 'dossier', name: '荣誉档案版', cat: '荣誉榜单', component: Dossier, photo: true, note: '档案袋盖章 / 条目滑入 / 人物' },

  // ── 历程故事 ──
  { id: 'timeline', name: '足迹时间轴版', cat: '历程故事', component: Timeline, photo: true, note: '居中交替时间轴 / 末节点金色高亮' },
  { id: 'path', name: '冠军之路版', cat: '历程故事', component: Path, photo: false, note: 'SVG 波线勾画 / 四节点点亮' },
  { id: 'tenure', name: '司龄荣光版', cat: '历程故事', component: Tenure, photo: true, note: '周年滚数 / 三里程碑 / 专属定版' },
  { id: 'letter', name: '感谢信版', cat: '历程故事', component: Letter, photo: false, note: '信笺逐段浮现 / 落款 / 定版' },
  { id: 'polaroid', name: '拍立得版', cat: '历程故事', component: Polaroid, photo: true, note: '拍立得甩入 / 图钉便签大数字' },
  { id: 'film', name: '胶片时刻版', cat: '历程故事', component: Film, photo: true, note: '胶片三格亮起 / 三项 / 人物' },
  { id: 'ladder', name: '进阶阶梯版', cat: '历程故事', component: Ladder, photo: true, note: '四级台阶 / 人物压顶 / 大数字' },

  // ── 团队招募 ──
  { id: 'team', name: '团队荣耀版', cat: '团队招募', component: Team, photo: true, note: '队徽逐字 / 合影揭幕 / 成员名单定版' },
  { id: 'duo', name: '双星联贺版', cat: '团队招募', component: Duo, photo: false, note: '双列对称入场 / 圆章头像 / 共同荣誉' },
  { id: 'invite', name: '诚邀入伙版', cat: '团队招募', component: Invite, photo: true, note: '巨字诚邀 / 邀请函 / 大二维码收尾' },

  // ── 创意场景 ──
  { id: 'rocket', name: '冲天火箭版', cat: '创意场景', component: Rocket, photo: true, note: '火箭整程升空 / 海拔HUD累计 / 里程碑掠过' },
  { id: 'elevator', name: '业绩电梯版', cat: '创意场景', component: Elevator, photo: false, note: '楼层牌连续上行 / 到站叮声 / 过冲回落' },
  { id: 'subway', name: '荣耀地铁版', cat: '创意场景', component: Subway, photo: false, note: '线路描金生长 / 列车逐站停靠 / 终点荣耀站' },
  { id: 'firework', name: '烟花礼赞版', cat: '创意场景', component: Firework, photo: false, note: '四组确定性烟花 / 数据浮标随爆显影' },
  { id: 'domino', name: '多米诺战报版', cat: '创意场景', component: Domino, photo: false, note: '五张骨牌连锁倒地 / 金印砸落' },
  { id: 'chat', name: '捷报弹屏版', cat: '创意场景', component: Chat, photo: true, note: '群聊气泡逐条弹出 / 红包拆开爆数' },
  { id: 'cube', name: '战绩魔方版', cat: '创意场景', component: Cube, photo: true, note: '立方体四面轮转 / 宣言·战报·主角·战果' },
  { id: 'coin', name: '鎏金铸币版', cat: '创意场景', component: Coin, photo: true, note: '压铸机冲压 / 火花四溅 / 金币翻面' },
  { id: 'led', name: '户外大屏版', cat: '创意场景', component: Led, photo: false, note: 'LED点阵屏 / 跑马灯 / 城市剪影' },
  { id: 'origami', name: '纸飞机航线版', cat: '创意场景', component: Origami, photo: false, note: '白纸折成飞机 / 虚线航线 / 沿途空投' },

  // ── 创意风格 ──
  { id: 'ink', name: '水墨丹青版', cat: '创意风格', component: Ink, photo: false, note: '宣纸墨滴 / 笔书逐字写出 / 朱砂钤印' },
  { id: 'papercut', name: '剪纸窗花版', cat: '创意风格', component: Papercut, photo: true, note: '对联对开 / 花窗六瓣 / 横批名条' },
  { id: 'neon', name: '霓虹招牌版', cat: '创意风格', component: Neon, photo: false, note: '霓虹字逐管点亮 / 灯管数字 / 手写名牌' },
  { id: 'terminal', name: '复古终端版', cat: '创意风格', component: Terminal, photo: false, note: 'CRT日志逐行打字 / MISSION COMPLETE' },
  { id: 'blueprint', name: '工程蓝图版', cat: '创意风格', component: Blueprint, photo: false, note: '五层塔逐层绘制 / 尺寸标注 / 竣工章' },
  { id: 'score', name: '成绩放榜版', cat: '创意风格', component: Score, photo: true, note: '成绩单逐科翻牌 / 特优红章压榜' },
  { id: 'bankbook', name: '存折入账版', cat: '创意风格', component: Bankbook, photo: true, note: '存折翻开 / 明细逐行打印 / 合计烫金' },
  { id: 'mahjong', name: '天胡开局版', cat: '创意风格', component: Mahjong, photo: false, note: '麻将牌滑入立起 / 胡字大印' },
  { id: 'constellation', name: '星座加冕版', cat: '创意风格', component: Constellation, photo: false, note: '星图连线讲战报 / 王冠星座压轴' },
  { id: 'thermo', name: '业绩温度版', cat: '创意风格', component: Thermo, photo: false, note: '温度计充能218° / 沸点旗标 / 热浪' },
  { id: 'firstorder', name: '首单破冰版', cat: '新人成长', component: FirstOrder, photo: true, note: '空白保单→笔迹签下→破冰红章，讲「第 1 单」而不是金额' },
  { id: 'streak', name: '连续达成版', cat: '新人成长', component: Streak, photo: true, note: '28 天日历逐日点亮 + 连击火焰，讲持续性' },
  { id: 'achieve', name: '成就解锁版', cat: '新人成长', component: Achieve, photo: true, note: '6 枚徽章，已解锁高光 / 未解锁灰锁，允许「还差什么」在场' },
  { id: 'hundreddays', name: '新人百日版', cat: '新人成长', component: HundredDays, photo: true, note: '横向刻度尺走到 100 + 三段成长记录，新人阶段专用' },
  { id: 'graduate', name: '结业通关版', cat: '新人成长', component: Graduate, photo: true, note: '成绩单表格 + 结业大章，培训结业 / 考证通过' },
  { id: 'relay', name: '薪火接力版', cat: '团队协作', component: Relay, photo: false, note: '纵向接力轨道，四人各留一句 + 全队合计，多人叙事' },
  { id: 'versus', name: '红蓝对战版', cat: '团队协作', component: Versus, photo: false, note: '双阵营并列 + VS 撞入 + 对比条，团队 PK / 区域对抗' },
  { id: 'expand', name: '增员裂变版', cat: '团队协作', component: Expand, photo: true, note: '放射裂变图 1→7，讲组织生长而非业绩' },
  { id: 'mentor', name: '师徒传承版', cat: '团队协作', component: Mentor, photo: true, note: '师傅在上徒弟在下，双人关系结构' },
  { id: 'morning', name: '早会播报版', cat: '团队协作', component: Morning, photo: false, note: '榜单表格逐行滑入 + 冠军聚焦，日/周群发用' },
  { id: 'claim', name: '理赔送达版', cat: '客户服务', component: Claim, photo: false, note: '理赔结案书 + 赔付金额 + 三天三节点，服务通报而非业绩' },
  { id: 'clientvoice', name: '客户见证版', cat: '客户服务', component: ClientVoice, photo: false, note: '微信对话六连弹，用客户的话说话' },
  { id: 'thanks', name: '答谢客户版', cat: '客户服务', component: Thanks, photo: false, note: '手写信 + 客户名字墙，年末/司庆群发' },
  { id: 'service', name: '服务年报版', cat: '客户服务', component: Service, photo: false, note: '四宫格服务数据 + 时间分配条，全程不出现保费' },
  { id: 'referral', name: '转介绍图谱版', cat: '客户服务', component: Referral, photo: false, note: '三层分叉传播链：我→老客户→新客户' },
  { id: 'portfolio', name: '产品结构版', cat: '经营复盘', component: Portfolio, photo: false, note: '堆叠条讲「钱从哪来」，年金/重疾/医疗/意外占比' },
  { id: 'income', name: '收入构成版', cat: '经营复盘', component: Income, photo: false, note: '四级阶梯累加：首佣/续佣/津贴/奖金，全库唯一收入主角' },
  { id: 'goalbreak', name: '目标拆解版', cat: '经营复盘', component: GoalBreak, photo: false, note: '12 个月格逐格填色 + 剩余冲刺计划，讲年不讲月' },
  { id: 'review', name: '季度复盘版', cat: '经营复盘', component: Review, photo: false, note: '做对了/待改进/下一步三段式，全库第一个不报喜的模板' },
  { id: 'kickoff', name: '开门红动员版', cat: '经营复盘', component: Kickoff, photo: false, note: '倒计时 + 缺口拆到每天，唯一「未达成」动员叙事' },

  // ── 典藏系列（GSAP 手法移植版：品牌缓动 / 逐字揭示 / stagger / 描线）──
  { id: 'gs-impact', name: '冲击巨字版', cat: '典藏系列', component: GsImpact, photo: true, note: '巨字逐字砸入 + 冲击波 + 屏震，SplitText drop 移植' },
  { id: 'gs-curtain', name: '双幕启幕版', cat: '典藏系列', component: GsCurtain, photo: true, note: '左右幕布对开 + 描画内框 + 逐字升起' },
  { id: 'gs-beacon', name: '灯塔聚能版', cat: '典藏系列', component: GsBeacon, photo: true, note: '天降光束 + 双环描画，聚焦感蓝金商务' },
  { id: 'gs-aurora', name: '流金极光版', cat: '典藏系列', component: GsAurora, photo: true, note: '极光光带流动背景 + 遮罩逐字，静谧高级' },
  { id: 'gs-medalwall', name: '勋章墙版', cat: '典藏系列', component: GsMedalwall, photo: true, note: '五枚勋章从中心炸开上墙，stagger center' },
  { id: 'gs-spotlight', name: '追光亮相版', cat: '典藏系列', component: GsSpotlight, photo: true, note: '聚光灯锥扫过亮出标题，剧场感深墨' },
  { id: 'gs-goldframe', name: '鎏金画框版', cat: '典藏系列', component: GsGoldframe, photo: true, note: '大画框逐笔描出 + 四角饰件弹上' },
  { id: 'gs-engine', name: '数字引擎版', cat: '典藏系列', component: GsEngine, photo: true, note: '刻度环逐格点亮 + 指针扫掠，精密仪器感' },
  { id: 'gs-nameflow', name: '星光名单版', cat: '典藏系列', component: GsNameflow, photo: true, note: '六人榜单两端向心点亮，团队叙事' },
  { id: 'gs-monolith', name: '丰碑铭刻版', cat: '典藏系列', component: GsMonolith, photo: true, note: '三层碑体升起 + 铭文逐字，里程碑气质' },
  { id: 'gs-laurel', name: '桂冠加冕版', cat: '典藏系列', component: GsLaurel, photo: true, note: '月桂逐笔描画 + 叶片逐个绽放' },
  { id: 'gs-banner', name: '锦旗贺版', cat: '典藏系列', component: GsBanner, photo: true, note: '燕尾锦旗落定 + 旗面飘动 + 巨字砸上' },
  { id: 'gs-crystal', name: '水晶奖杯版', cat: '典藏系列', component: GsCrystal, photo: true, note: '奖杯轮廓四笔雕出 + 高光斜扫' },
  { id: 'gs-ascent', name: '峰线攀登版', cat: '典藏系列', component: GsAscent, photo: true, note: '峰线逐笔攀登 + 旗标沿线爬顶，增长叙事' },
  { id: 'gs-pulse', name: '星芒爆发版', cat: '典藏系列', component: GsPulse, photo: true, note: '十二金芒中心炸出 + 巨字砸落' },
  { id: 'gs-gazette', name: '钤印官报版', cat: '典藏系列', component: GsGazette, photo: true, note: '官报纸面 + 边框描画 + 朱砂大印盖下' },
  { id: 'gs-ribbon', name: '绶带飞扬版', cat: '典藏系列', component: GsRibbon, photo: true, note: '双绶带甩出 + 中央勋章弹亮' },
  { id: 'gs-galaxy', name: '星轨环绕版', cat: '典藏系列', component: GsGalaxy, photo: true, note: '双星轨描画 + 星点环绕，浩瀚深墨' },
  { id: 'gs-herald', name: '号角启幕版', cat: '典藏系列', component: GsHerald, photo: true, note: '八道光束号角齐鸣 + 巨字砸落，开门红' },
  { id: 'gs-capsule', name: '时光胶囊版', cat: '典藏系列', component: GsCapsule, photo: true, note: '胶囊开启飘出三年战绩卡，周年叙事' },
];

/** 分类展示顺序 —— 与编辑器面板一致 */
export const CAT_ORDER: Category[] = [
  '仪式贺报',
  '巨字排版',
  '数据图表',
  '荣誉榜单',
  '历程故事',
  '团队招募',
  '创意场景',
  '创意风格',
  '新人成长',
  '团队协作',
  '客户服务',
  '经营复盘',
  '典藏系列',
];
