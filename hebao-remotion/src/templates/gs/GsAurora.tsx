import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { NumRoll } from '../../components/NumRoll';
import { PhotoCard } from '../../components/PhotoCard';
import { EndCard } from '../../components/EndCard';
import {
  GsStage, gsBeats, SplitReveal,
  EASE, stagger, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 04 · 极光之夜版（翡翠）
 * 叙事：巅峰之夜，极光当空——三条对角极光带横贯全屏缓缓流动。
 * 版式：左栏非对称构图——全部内容左对齐 left=96，右侧留给极光；
 *       数字左对齐 240px，stats 纵向三行带左侧金竖线。
 * 结构：4 章（极光起 / 大数左栏 / 纵列战报 / 定版）。
 */
export const GsAurora: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.feicui;
  const B = gsBeats({ num: 1.9, rows: 3.7, person: 5.3, end: 6.72 });

  /* 三条对角极光带：不同角度、不同相位的流动 */
  const band = (top: number, angle: number, ph: number, c1: string, c2: string, h: number) => {
    const drift = Math.sin(t * 1.1 + ph) * 46;
    return (
      <div
        style={{
          position: 'absolute',
          left: -160 + drift,
          top,
          width: 1500,
          height: h,
          background: `linear-gradient(90deg, ${rgba(c1, 0)} 0%, ${rgba(c1, 0.34)} 24%, ${rgba(c2, 0.42)} 50%, ${rgba(c1, 0.2)} 76%, ${rgba(c1, 0)} 100%)`,
          filter: 'blur(26px)',
          transform: `rotate(${angle}deg)`,
        }}
      />
    );
  };

  const rows = p.stats.slice(0, 3);

  return (
    <GsStage theme={T} p={p} bottomtag="AURORA　NIGHT">
      {/* 章 1 · 极光起 */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.num - 0.26, B.num - 0.02]}>
        {band(560, -14, 0, T.glow1, T.glow2, 130)}
        {band(760, -14, 2.1, T.glow2, T.glow1, 110)}
        {band(960, -14, 4.2, T.glow1, T.line, 90)}
        <div style={{ position: 'absolute', left: 96, top: 470, textAlign: 'left' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: 38,
              fontWeight: 400,
              letterSpacing: 7,
              color: rgba(T.pale, 0.92),
              padding: '7px 22px',
              border: `1px solid ${rgba(T.line, 0.5)}`,
              borderRadius: 999,
              background: `rgba(${T.mask}, 0.35)`,
            }}
          >
            AURORA NIGHT · 巅峰之夜
          </span>
        </div>
        <SplitReveal
          theme={T}
          t={t}
          text="极光之夜"
          size={148}
          top={600}
          start={B.hook + 0.2}
          mode="mask"
          staggerEach={0.09}
          dur={0.44}
          width={880}
          left={96}
          align="left"
          lineHeight={176}
        />
        <Txt size={48} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={8} lineHeight={48}
          style={{ position: 'absolute', left: 100, top: 830, textAlign: 'left',
            opacity: EASE.enter(seg(t, B.hook + 0.66, B.hook + 0.96)) }}>
          {p.claim ?? '巅峰盛放 · 荣耀当空'}
        </Txt>
        <Sfx name="sfx_whoosh" at={B.hook + 0.12} vol={0.28} />
        <Sfx name="sfx_chime" at={B.hook + 0.7} vol={0.26} />
      </Chapter>

      {/* 章 1.5 · 右侧竖排铭文（贯穿中后段，平衡左栏的视觉重量） */}
      <Chapter t={t} in={[B.num + 0.2, B.num + 0.5]} out={[B.end - 0.26, B.end - 0.02]}>
        <div
          style={{
            position: 'absolute',
            right: 96,
            top: 620,
            writingMode: 'vertical-rl',
            fontSize: 48,
            fontWeight: 500,
            letterSpacing: 16,
            color: rgba(T.cream, 0.9),
            textShadow: '0 2px 12px rgba(0,0,0,.4)',
            opacity: clamp01(seg(t, B.num + 0.24, B.num + 0.54)),
          }}
        >
          {p.monthCN ?? '十月 · 荣耀揭晓'}
        </div>
        <div style={{ position: 'absolute', right: 170, top: 628, width: 2, height: 380,
          background: `linear-gradient(180deg, ${rgba(T.goldC, 0.6)}, ${rgba(T.goldC, 0)})`,
          opacity: clamp01(seg(t, B.num + 0.34, B.num + 0.64)) }} />
      </Chapter>

      {/* 章 2 · 大数左栏 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.rows - 0.26, B.rows - 0.02]}>
        {band(520, -14, 1.2, T.glow1, T.glow2, 160)}
        {band(880, -14, 3.4, T.glow2, T.glow1, 120)}
        {/* 左侧金竖线 */}
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 560,
            width: 5,
            height: 700,
            background: `linear-gradient(180deg, ${T.goldA}, ${T.goldC}, ${rgba(T.goldC, 0)})`,
            transform: `scaleY(${EASE.enter(seg(t, B.num, B.num + 0.44))})`,
            transformOrigin: 'top',
          }}
        />
        <Txt size={48} color={rgba(T.pale, 0.92)} weight={500} letterSpacing={8} lineHeight={48}
          style={{ position: 'absolute', left: 148, top: 560,
            opacity: clamp01(seg(t, B.num + 0.06, B.num + 0.32)) }}>
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 144,
            top: 660,
            display: 'flex',
            alignItems: 'baseline',
            opacity: clamp01(seg(t, B.num + 0.1, B.num + 0.36)),
          }}
        >
          <NumRoll theme={T} target={p.premium} t={t} start={B.num + 0.2} dur={1.05} size={228}
            lineHeight={252} unit="万元" unitSize={46} unitColor={rgba(T.soft, 0.95)} />
        </div>
        <Txt size={48} color={T.cream2} weight={400} letterSpacing={3} lineHeight={48}
          style={{ position: 'absolute', left: 150, top: 980,
            opacity: clamp01(seg(t, B.num + 1.0, B.num + 1.3)) }}>
          {p.delta}
        </Txt>
        <Sfx name="sfx_pop" at={B.num + 0.2 + 1.05 * 0.78} vol={0.26} />
      </Chapter>

      {/* 章 3 · 纵列战报（左对齐三行，金竖线延伸） */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.person - 0.26, B.person - 0.02]}>
        {rows.map((s, i) => {
          const st = B.rows + 0.08 + i * 0.16;
          const e = EASE.enter(seg(t, st, st + 0.46));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 148,
                top: 620 + i * 276,
                opacity: clamp01(seg(t, st, st + 0.24)),
                transform: `translateX(${(1 - e) * -80}px)`,
              }}
            >
              <Txt size={46} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={7} lineHeight={46}>
                {s.k}
              </Txt>
              {s.hl ? (
                <GoldText theme={T} size={110} weight={700} font="num" lineHeight={126} letterSpacing={-2}>
                  {s.v}
                </GoldText>
              ) : (
                <Txt size={110} color={T.cream} weight={600} font="num" letterSpacing={-2} lineHeight={126}>
                  {s.v}
                </Txt>
              )}
              <div style={{ position: 'absolute', left: -52, top: 12, width: 4, height: 170,
                background: `linear-gradient(180deg, ${T.goldC}, ${rgba(T.goldC, 0.1)})`, borderRadius: 2 }} />
            </div>
          );
        })}
        <Sfx name="sfx_stamp" at={B.rows + 0.24} vol={0.26} />
      </Chapter>

      {/* 章 4 · 人物收束（左栏照片 + 右侧极光） */}
      <Chapter t={t} in={[B.person - 0.06, B.person + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {band(700, -14, 0.6, T.glow1, T.glow2, 140)}
        <PhotoCard
          theme={T}
          src={p.photo}
          left={96}
          top={560}
          width={340}
          height={340}
          round
          objectPosition="50% 18%"
          style={{
            opacity: clamp01(seg(t, B.person + 0.06, B.person + 0.3)),
            transform: `scale(${lerp(0.7, 1, EASE.glam(seg(t, B.person + 0.06, B.person + 0.46)))})`,
          }}
        />
        <SplitReveal theme={T} t={t} text={p.name} size={82} top={960} start={B.person + 0.24}
          mode="mask" staggerEach={0.07} dur={0.42} width={880} left={96} align="left"
          gold={false} color="#fff" weight={600} letterSpacing={12} lineHeight={106} />
        <Txt size={44} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={5} lineHeight={44}
          style={{ position: 'absolute', left: 100, top: 1090, textAlign: 'left',
            opacity: clamp01(seg(t, B.person + 0.56, B.person + 0.84)) }}>
          {p.role}
        </Txt>
        <div style={{ display: 'inline-block', position: 'absolute', left: 96, top: 1170,
          opacity: clamp01(seg(t, B.person + 0.7, B.person + 1.0)) }}>
          <span style={{ display: 'inline-block', padding: '10px 30px', borderRadius: 999,
            border: `1px solid ${rgba(T.line, 0.7)}`, fontSize: 44, fontWeight: 500,
            letterSpacing: 4, color: T.cream, background: `rgba(${T.mask}, 0.4)` }}>
            {p.pill}
          </span>
        </div>
        <Sfx name="sfx_chime" at={B.person + 0.3} vol={0.26} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={132} titleText="巅峰盛放"
          subText="极光为证 · 荣耀加身" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
