import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { NumRoll } from '../../components/NumRoll';
import { EndCard } from '../../components/EndCard';
import { DrawRect } from '../../components/DrawLine';
import {
  GsStage, HookCap, gsBeats, SplitReveal,
  EASE, stagger, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 02 · 开门大吉版（红金）
 * 叙事：大幕拉开好戏开场——左右两块对开数据牌 + 中缝金线，2×2 战果格。
 * 版式：对开双栏构图（保费居左、达成率居右），条目用 2×2 网格满铺。
 * 结构：5 章（开幕 / 对开双牌 / 战果格 / 金句框 / 定版）。
 */
export const GsCurtain: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const B = gsBeats({ num: 1.9, rows: 3.9, person: 5.4, end: 6.72 });

  /* 幕布对开 */
  const open = EASE.enter(seg(t, B.hook + 0.22, B.hook + 1.0));
  const curtain = (side: 'l' | 'r') => ({
    position: 'absolute' as const,
    top: 0,
    [side]: 0,
    width: 540,
    height: 1920,
    background: `linear-gradient(${side === 'l' ? '90deg' : '270deg'}, ${T.archbg} 0%, ${T.bg[0]} 58%, ${rgba(T.bg[1], 0.94)} 100%)`,
    transform: `translateX(${(side === 'l' ? -1 : 1) * open * 560}px)`,
    boxShadow: side === 'l' ? '14px 0 40px rgba(0,0,0,.4)' : '-14px 0 40px rgba(0,0,0,.4)',
  });
  const folds = [40, 120, 200, 280, 360, 440];
  const cells = (p.items ?? []).slice(0, 4);

  return (
    <GsStage theme={T} p={p} bottomtag="GRAND　OPENING">
      {/* 章 1 · 双幕对开 */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.num - 0.26, B.num - 0.02]}>
        <div style={curtain('l')}>
          {folds.map((x) => (
            <div key={x} style={{ position: 'absolute', left: x, top: 0, width: 2, height: '100%', background: 'rgba(0,0,0,.22)' }} />
          ))}
        </div>
        <div style={curtain('r')}>
          {folds.map((x) => (
            <div key={x} style={{ position: 'absolute', right: x, top: 0, width: 2, height: '100%', background: 'rgba(0,0,0,.22)' }} />
          ))}
        </div>
        {open > 0.5 && (
          <>
            <HookCap theme={T} t={t} text="GRAND OPENING · 开门大吉" top={540} start={B.hook + 0.7} />
            <SplitReveal
              theme={T}
              t={t}
              text={p.slogan}
              size={200}
              top={690}
              start={B.hook + 0.82}
              mode="mask"
              staggerEach={0.09}
              dur={0.44}
              lineHeight={240}
            />
            <Sfx name="sfx_whoosh" at={B.hook + 0.24} vol={0.3} />
            <Sfx name="sfx_chime" at={B.hook + 0.92} vol={0.28} />
          </>
        )}
      </Chapter>

      {/* 章 2 · 对开双数据牌 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.rows - 0.26, B.rows - 0.02]}>
        <HookCap theme={T} t={t} text="TWO PILLARS · 双柱数据" top={470} start={B.num + 0.05} />
        <div
          style={{
            position: 'absolute',
            left: 70,
            top: 640,
            width: 420,
            height: 560,
            borderRadius: 20,
            border: `1px solid ${rgba(T.line, 0.55)}`,
            background: `linear-gradient(180deg, ${rgba(T.line, 0.14)}, ${rgba(T.line, 0.03)})`,
            boxShadow: '0 18px 44px rgba(0,0,0,.36)',
            opacity: clamp01(seg(t, B.num + 0.14, B.num + 0.4)),
            transform: `translateX(${(1 - EASE.enter(seg(t, B.num + 0.14, B.num + 0.46))) * -140}px)`,
          }}
        >
          <Txt size={44} color={rgba(T.pale, 0.92)} weight={500} letterSpacing={2} lineHeight={44}
            style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center' }}>
            {p.dlabel}
          </Txt>
          <div style={{ position: 'absolute', top: 190, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <NumRoll theme={T} target={p.premium} t={t} start={B.num + 0.3} dur={1.0} size={128}
              lineHeight={140} unit="万" unitSize={38} unitColor={rgba(T.soft, 0.95)} />
          </div>
          <div style={{ position: 'absolute', top: 430, width: '100%', textAlign: 'center',
            opacity: 1 }}>
            {(p.delta ?? '').split(/[|｜]/).map((s) => s.trim()).filter(Boolean).map((s, i) => (
              <Txt key={i} size={38} color={T.cream2} weight={400} letterSpacing={2} lineHeight={54}>
                {s}
              </Txt>
            ))}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 70,
            top: 640,
            width: 420,
            height: 560,
            borderRadius: 20,
            border: `1px solid ${rgba(T.line, 0.55)}`,
            background: `linear-gradient(180deg, ${rgba(T.line, 0.14)}, ${rgba(T.line, 0.03)})`,
            boxShadow: '0 18px 44px rgba(0,0,0,.36)',
            opacity: clamp01(seg(t, B.num + 0.3, B.num + 0.56)),
            transform: `translateX(${(1 - EASE.enter(seg(t, B.num + 0.3, B.num + 0.62))) * 140}px)`,
          }}
        >
          <Txt size={48} color={rgba(T.pale, 0.92)} weight={500} letterSpacing={8} lineHeight={48}
            style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center' }}>
            {p.stats[1]?.k ?? '目标达成率'}
          </Txt>
          <GoldText theme={T} size={150} weight={700} font="num" lineHeight={166} letterSpacing={-3}
            style={{ position: 'absolute', top: 168, width: '100%', textAlign: 'center' }}>
            {p.stats[1]?.v ?? '218%'}
          </GoldText>
          <div
            style={{
              position: 'absolute',
              left: 60,
              top: 400,
              width: 300,
              height: 8,
              borderRadius: 4,
              background: 'rgba(0,0,0,.28)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${clamp01(seg(t, B.num + 0.6, B.num + 1.5)) * 100}%`,
                background: `linear-gradient(90deg, ${T.goldC}, ${T.goldA})`,
                borderRadius: 4,
              }}
            />
          </div>
          <Txt size={36} color={rgba(T.pale, 0.88)} weight={400} letterSpacing={1} lineHeight={42}
            style={{ position: 'absolute', top: 440, width: '100%', textAlign: 'center' }}>
            超额达成 · 时序领先
          </Txt>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 539,
            top: 660,
            width: 2,
            height: 520,
            background: `linear-gradient(180deg, ${rgba(T.line, 0)}, ${rgba(T.line, 0.9)}, ${rgba(T.line, 0)})`,
            opacity: clamp01(seg(t, B.num + 0.4, B.num + 0.7)),
          }}
        />
        <Sfx name="sfx_whoosh" at={B.num + 0.16} vol={0.24} />
        <Sfx name="sfx_pop" at={B.num + 0.3 + 1.0 * 0.78} vol={0.26} />
      </Chapter>

      {/* 章 3 · 2×2 战果格（满铺 90 边距） */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.person - 0.26, B.person - 0.02]}>
        <HookCap theme={T} t={t} text="BATTLE LOG · 战果盘点" top={420} start={B.rows + 0.04} />
        {cells.map((it, i) => {
          const d = stagger(i, 4, { mode: 'center', each: 0.13 });
          const st = B.rows + 0.18 + d;
          const e = EASE.glam(seg(t, st, st + 0.46));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 90 + (i % 2) * 465,
                top: 570 + Math.floor(i / 2) * 430,
                width: 435,
                height: 380,
                borderRadius: 18,
                border: `1px solid ${rgba(T.line, 0.5)}`,
                background: `linear-gradient(180deg, ${rgba(T.line, 0.13)}, ${rgba(T.line, 0.03)})`,
                boxShadow: '0 14px 34px rgba(0,0,0,.32)',
                opacity: clamp01(seg(t, st, st + 0.22)),
                transform: `scale(${lerp(0.72, 1, e)})`,
              }}
            >
              <Txt size={46} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={6} lineHeight={46}
                style={{ position: 'absolute', top: 48, width: '100%', textAlign: 'center' }}>
                {it.k}
              </Txt>
              <Txt size={96} color={T.cream} weight={600} font="num" letterSpacing={-2} lineHeight={112}
                  style={{ position: 'absolute', top: 116, width: '100%', textAlign: 'center' }}>
                  {it.v}
                </Txt>
              <Txt size={42} color={T.cream2} weight={400} letterSpacing={2} lineHeight={40}
                style={{ position: 'absolute', top: 262, width: '100%', textAlign: 'center' }}>
                {it.d ?? ''}
              </Txt>
            </div>
          );
        })}
        <Sfx name="sfx_stamp" at={B.rows + 0.3} vol={0.28} />
      </Chapter>

      {/* 章 4 · 金句描线框 */}
      <Chapter t={t} in={[B.person - 0.06, B.person + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        <DrawRect left={150} top={600} w={780} h={600} radius={24} t={t} start={B.person + 0.05}
          dur={0.7} color={rgba(T.line, 0.85)} strokeWidth={2} opacity={0.8} />
        <SplitReveal theme={T} t={t} text="开门大吉" size={120} top={740} start={B.person + 0.3}
          mode="mask" staggerEach={0.1} dur={0.44} lineHeight={150} />
        <Txt size={54} color={T.cream} weight={500} letterSpacing={12} lineHeight={56}
          style={{ position: 'absolute', left: 0, top: 930, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.person + 0.7, B.person + 0.96)) }}>
          全年红 · 一路旺
        </Txt>
        <Txt size={46} color={rgba(T.pale, 0.88)} weight={400} letterSpacing={6} lineHeight={46}
          style={{ position: 'absolute', left: 0, top: 1020, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.person + 0.86, B.person + 1.12)) }}>
          {p.quote ?? '信任为帆 · 实干为桨'}
        </Txt>
        <Sfx name="sfx_shimmer" at={B.person + 0.5} vol={0.26} />
      </Chapter>

      {/* 章 5 · 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={140} titleText="开门大吉"
          subText="捷报开年 · 全年皆红" splitTitle drawLine titleLetterSpacing={20} />
      </Chapter>
    </GsStage>
  );
};
