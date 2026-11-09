import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { EndCard } from '../../components/EndCard';
import {
  GsStage, gsBeats, SplitReveal,
  EASE, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 12 · 锦旗致谢版（红金）
 * 叙事：客户的信任是最好的奖状——一面锦旗从天垂落，竖排金字「信任为旗」，
 *       流苏随风轻摆，旗下是客户金句。
 * 版式：中心垂幅构图——锦旗占屏中 60%，左右留白极简，
 *       竖排文字（writing-mode vertical）是主视觉语言。
 * 结构：3 章（锦旗垂落 / 旗面竖字+金句 / 定版）。
 */
export const GsBanner: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const B = gsBeats({ num: 2.0, rows: 4.7, end: 6.72 });

  /* 锦旗垂落 */
  const drop = EASE.enter(seg(t, B.hook + 0.15, B.hook + 1.0));
  /* 流苏摆动 */
  const sway = Math.sin(t * 1.6) * 4;
  const BX = 240;
  const BW = 600;
  const BY = 340;
  const BH = 920;

  return (
    <GsStage theme={T} p={p} bottomtag="TRUST　&　HONOR">
      {/* 章 1 · 锦旗垂落（底层贯穿） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 旗杆横杆 */}
        <div
          style={{
            position: 'absolute',
            left: BX - 70,
            top: BY - 40,
            width: BW + 140,
            height: 16,
            borderRadius: 8,
            background: `linear-gradient(180deg, ${T.goldA}, ${T.goldD})`,
            boxShadow: '0 8px 20px rgba(0,0,0,.4)',
            opacity: clamp01(seg(t, B.hook + 0.05, B.hook + 0.25)),
          }}
        />
        {/* 杆端圆球 */}
        {[BX - 82, BX + BW + 62].map((x, i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: BY - 48, width: 32, height: 32,
            borderRadius: '50%', background: `radial-gradient(circle at 34% 30%, ${T.goldA}, ${T.goldD})`,
            opacity: clamp01(seg(t, B.hook + 0.05, B.hook + 0.25)) }} />
        ))}
        {/* 旗面 */}
        <div
          style={{
            position: 'absolute',
            left: BX,
            top: BY - 30 - (1 - drop) * 1100,
            width: BW,
            height: BH,
            background: `linear-gradient(165deg, ${T.bg[1]} 0%, ${T.bg[0]} 55%, ${T.archbg} 100%)`,
            border: `3px solid ${rgba(T.goldC, 0.85)}`,
            boxShadow: `0 26px 60px rgba(0,0,0,.5), inset 0 0 60px ${rgba(T.mask, 0.35)}`,
            borderRadius: 6,
          }}
        >
          {/* 旗面内衬线 */}
          <div style={{ position: 'absolute', inset: 22, border: `1px solid ${rgba(T.line, 0.4)}`, borderRadius: 4 }} />
          {/* 流苏（左右各 3 条） */}
          {[0, 1, 2].map((k) => (
            <React.Fragment key={k}>
              <div style={{ position: 'absolute', left: 30 + k * 36, bottom: -86, width: 3, height: 86,
                background: `linear-gradient(180deg, ${T.goldC}, ${rgba(T.goldD, 0.4)})`,
                transform: `rotate(${sway * (k - 1) * 0.5}deg)`, transformOrigin: 'top' }} />
              <div style={{ position: 'absolute', left: 27 + k * 36, bottom: -100, width: 10, height: 16,
                borderRadius: 4, background: T.goldD,
                transform: `rotate(${sway * (k - 1) * 0.5}deg)`, transformOrigin: 'top' }} />
              <div style={{ position: 'absolute', right: 30 + k * 36, bottom: -86, width: 3, height: 86,
                background: `linear-gradient(180deg, ${T.goldC}, ${rgba(T.goldD, 0.4)})`,
                transform: `rotate(${-sway * (k - 1) * 0.5}deg)`, transformOrigin: 'top' }} />
              <div style={{ position: 'absolute', right: 27 + k * 36, bottom: -100, width: 10, height: 16,
                borderRadius: 4, background: T.goldD,
                transform: `rotate(${-sway * (k - 1) * 0.5}deg)`, transformOrigin: 'top' }} />
            </React.Fragment>
          ))}
        </div>
        <Sfx name="sfx_whoosh" at={B.hook + 0.18} vol={0.28} />
        <Sfx name="sfx_gong" at={B.hook + 0.95} vol={0.34} />
      </Chapter>

      {/* 章 2 · 旗面竖字 + 金句 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 竖排主文（右起） */}
        <div
          style={{
            position: 'absolute',
            right: BX + 74,
            top: BY + 70 - (1 - drop) * 1100,
            writingMode: 'vertical-rl',
            fontFamily: "'Noto Serif SC', 'SimSun', serif",
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: 22,
            lineHeight: 1.2,
            color: T.goldA,
            textShadow: '0 3px 8px rgba(0,0,0,.5)',
            opacity: clamp01(seg(t, B.num + 0.1, B.num + 0.4)),
          }}
        >
          {p.quote ?? '信任为旗'}
        </div>
        {/* 竖排副文（左小列） */}
        <div
          style={{
            position: 'absolute',
            left: BX + 74,
            top: BY + 80 - (1 - drop) * 1100,
            writingMode: 'vertical-rl',
            fontSize: 38,
            fontWeight: 500,
            letterSpacing: 10,
            lineHeight: 1.4,
            color: T.cream,
            opacity: clamp01(seg(t, B.num + 0.4, B.num + 0.7)),
          }}
        >
          一诺千金 · {p.dateText}
        </div>
        <Sfx name="sfx_chime" at={B.num + 0.35} vol={0.28} />
      </Chapter>

      {/* 章 3 · 旗下金句 + 数据带 */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 客户金句（旗下） */}
        <div
          style={{
            position: 'absolute',
            left: 110,
            top: 1400,
            width: 860,
            textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.08, B.rows + 0.4)),
            transform: `translateY(${(1 - EASE.enter(seg(t, B.rows + 0.08, B.rows + 0.44))) * 26}px)`,
          }}
        >
          <span style={{ fontSize: 44, color: T.goldC, marginRight: 12 }}>「</span>
          <span style={{ fontSize: 46, fontWeight: 500, letterSpacing: 3, color: T.cream, lineHeight: '60px' }}>
            {p.claim ?? '服务有温度 · 专业有力量'}
          </span>
          <span style={{ fontSize: 44, color: T.goldC, marginLeft: 12 }}>」</span>
        </div>
        <Txt size={42} color={rgba(T.pale, 0.85)} weight={400} letterSpacing={4} lineHeight={42}
          style={{ position: 'absolute', left: 0, top: 1484, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.36, B.rows + 0.66)) }}>
          —— 来自客户最真实的肯定
        </Txt>
        <Sfx name="sfx_shimmer" at={B.rows + 0.4} vol={0.26} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={136} titleText="一诺千金"
          subText="信任为旗 · 服务为本" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
