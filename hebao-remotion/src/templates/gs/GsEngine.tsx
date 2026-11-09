import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { NumRoll } from '../../components/NumRoll';
import { EndCard } from '../../components/EndCard';
import {
  GsStage, HookCap, gsBeats, SplitReveal,
  EASE, stagger, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 08 · 决胜引擎版（蓝金）
 * 叙事：四季度冲刺——把战报做成「驾驶舱 HUD」：顶部三仪表、中部主转速、底部推进条。
 * 版式：仪表盘构图——数据不居中堆叠，而是上（三仪表横排）中（主数字）
 *       下（全宽进度条）三层，机械感十足。
 * 结构：3 章（HUD 启动 / 主数字点火 / 推进条全开+定版前置金句）。
 */
export const GsEngine: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.lanjin;
  const B = gsBeats({ num: 2.0, rows: 4.3, end: 6.72 });

  const gauges = p.stats.slice(0, 3);
  const gx = [100, 400, 700];
  const pct = clamp01((p.pct ?? 75) / 100);

  return (
    <GsStage theme={T} p={p} bottomtag="FULL　THROTTLE">
      {/* 章 1 · HUD 启动：标题 + 三仪表 */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.num - 0.26, B.num - 0.02]}>
        <HookCap theme={T} t={t} text="FULL THROTTLE · 引擎全开" top={330} start={B.hook + 0.08} />
        <SplitReveal theme={T} t={t} text="决胜四季度" size={124} top={430} start={B.hook + 0.18}
          mode="drop" staggerEach={0.07} dur={0.4} lineHeight={154} />
        {/* 三仪表横排 */}
        {gauges.map((g, i) => {
          const st = B.hook + 0.7 + i * 0.14;
          const e = EASE.glam(seg(t, st, st + 0.42));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: gx[i],
                top: 700,
                width: 280,
                height: 300,
                borderRadius: 16,
                border: `1px solid ${rgba(T.line, 0.5)}`,
                background: `linear-gradient(180deg, ${rgba(T.line, 0.13)}, ${rgba(T.line, 0.03)})`,
                boxShadow: '0 14px 34px rgba(0,0,0,.36)',
                opacity: clamp01(seg(t, st, st + 0.2)),
                transform: `translateY(${(1 - e) * 40}px)`,
              }}
            >
              {/* 半圆表盘刻度（加强可见度 + 指针） */}
              <svg width={280} height={120} viewBox="0 0 280 120" style={{ position: 'absolute', top: 16, left: 0 }}>
                {Array.from({ length: 13 }).map((_, k) => {
                  const a = Math.PI * (k / 12);
                  const x1 = 140 - Math.cos(a) * 80;
                  const y1 = 104 - Math.sin(a) * 80;
                  const x2 = 140 - Math.cos(a) * 96;
                  const y2 = 104 - Math.sin(a) * 96;
                  return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={rgba(T.goldC, k % 3 === 0 ? 0.85 : 0.5)} strokeWidth={k % 3 === 0 ? 3.5 : 2} />;
                })}
                {/* 指针（指向中位，呼应仪表感） */}
                <line x1={140} y1={104} x2={104} y2={52} stroke={rgba(T.goldB, 0.9)} strokeWidth={3.5} strokeLinecap="round" />
                <circle cx={140} cy={104} r={6} fill={T.goldB} />
              </svg>
              <Txt size={44} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={4} lineHeight={42}
                style={{ position: 'absolute', top: 148, width: '100%', textAlign: 'center' }}>
                {g.k}
              </Txt>
              {g.hl ? (
                <GoldText theme={T} size={84} weight={700} font="num" lineHeight={98}
                  style={{ position: 'absolute', top: 194, width: '100%', textAlign: 'center' }}>
                  {g.v}
                </GoldText>
              ) : (
                <Txt size={84} color={T.cream} weight={600} font="num" letterSpacing={-1} lineHeight={98}
                  style={{ position: 'absolute', top: 194, width: '100%', textAlign: 'center' }}>
                  {g.v}
                </Txt>
              )}
            </div>
          );
        })}
        <Sfx name="sfx_whoosh" at={B.hook + 0.1} vol={0.26} />
        <Sfx name="sfx_pop" at={B.hook + 0.7} vol={0.24} />
      </Chapter>

      {/* 章 2 · 主数字点火 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        <Txt size={50} color={rgba(T.pale, 0.94)} weight={500} letterSpacing={10} lineHeight={52}
          style={{ position: 'absolute', left: 0, top: 620, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 0.04, B.num + 0.3)) }}>
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 710,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: clamp01(seg(t, B.num + 0.08, B.num + 0.34)),
          }}
        >
          <NumRoll theme={T} target={p.premium} t={t} start={B.num + 0.18} dur={1.05} size={280}
            lineHeight={308} unit="万元" unitSize={52} unitColor={rgba(T.soft, 0.95)} />
        </div>
        <Sfx name="sfx_pop" at={B.num + 0.18 + 1.05 * 0.78} vol={0.28} />
        <Txt size={48} color={T.cream2} weight={400} letterSpacing={4} lineHeight={48}
          style={{ position: 'absolute', left: 0, top: 1080, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 1.0, B.num + 1.3)) }}>
          {p.delta}
        </Txt>
        {/* 引擎辉光 */}
        <div
          style={{
            position: 'absolute',
            left: 190,
            top: 980,
            width: 700,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${rgba(T.glow2, 0.2)}, ${rgba(T.glow2, 0)} 68%)`,
            opacity: clamp01(seg(t, B.num + 0.2, B.num + 0.6)),
          }}
        />
      </Chapter>

      {/* 章 3 · 推进条全开 + 金句 */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        <Txt size={46} color={rgba(T.pale, 0.92)} weight={500} letterSpacing={6} lineHeight={46}
          style={{ position: 'absolute', left: 0, top: 1150, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows, B.rows + 0.26)) }}>
          {p.goalTxt ?? '年度目标推进'}
        </Txt>
        {/* 全宽推进条（大数字驻留区之下，避免穿字） */}
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 1240,
            width: 900,
            height: 34,
            borderRadius: 17,
            background: 'rgba(0,0,0,.32)',
            border: `1px solid ${rgba(T.line, 0.4)}`,
            overflow: 'hidden',
            opacity: clamp01(seg(t, B.rows + 0.1, B.rows + 0.36)),
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${EASE.enter(seg(t, B.rows + 0.24, B.rows + 1.3)) * pct * 100}%`,
              background: `linear-gradient(90deg, ${T.goldD}, ${T.goldC}, ${T.goldA})`,
              borderRadius: 17,
              boxShadow: `0 0 24px ${rgba(T.glow2, 0.5)}`,
            }}
          />
        </div>
        <Txt size={58} color={T.cream} weight={600} font="num" letterSpacing={0} lineHeight={60}
          style={{ position: 'absolute', left: 0, top: 1310, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 1.1, B.rows + 1.4)) }}>
          {(p.pct ?? 75) + '%'}
        </Txt>
        <Sfx name="sfx_whoosh" at={B.rows + 0.24} vol={0.26} />
        {/* 金句 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 1430,
            width: 1080,
            textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 1.5, B.rows + 1.8)),
          }}
        >
          <span style={{ fontSize: 52, fontWeight: 500, letterSpacing: 12, color: T.cream }}>
            势不可挡 · 一往无前
          </span>
        </div>
        <Sfx name="sfx_shimmer" at={B.rows + 1.5} vol={0.26} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={136} titleText="引擎全开"
          subText="决胜四季度 · 势不可挡" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
