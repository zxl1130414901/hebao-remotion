import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { Txt } from '../../components/GoldText';
import { EndCard } from '../../components/EndCard';
import {
  GsStage, gsBeats, SplitReveal,
  EASE, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 09 · 龙虎榜版（红金）
 * 叙事：一张真正的排行榜——roster 六行从上到下逐行点入，冠军行金条高亮压轴。
 * 版式：通栏行式榜单——标题贴顶、六行 190 行距铺满 520-1690 全高，
 *       左名·中org·右值，冠军行整条金底横带压轴点亮；金句居中收底。
 * 结构：3 章（榜单升起 / 冠军压轴+金句 / 定版）。
 */
export const GsNameflow: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const B = gsBeats({ num: 1.5, rows: 4.9, end: 6.72 });

  const roster = (p.roster ?? []).slice(0, 6);
  const ROW_H = 190;
  const ROW_Y0 = 520;

  return (
    <GsStage theme={T} p={p} bottomtag="DRAGON　BOARD">
      {/* 章 1 · 榜单升起 */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 贴顶标题 */}
        <SplitReveal theme={T} t={t} text="龙虎榜" size={116} top={256} start={B.hook + 0.1}
          mode="drop" staggerEach={0.1} dur={0.4} lineHeight={150} />
        <Txt size={40} color={rgba(T.pale, 0.85)} weight={400} letterSpacing={8} lineHeight={38}
          style={{ position: 'absolute', left: 0, top: 422, width: 1080, textAlign: 'center',
            opacity: EASE.enter(seg(t, B.hook + 0.5, B.hook + 0.8)) }}>
          {p.claim ?? '以业绩论英雄 · 十月战力排行'}
        </Txt>
        <Sfx name="sfx_gong" at={B.hook + 0.32} vol={0.36} />

        {/* 行式榜单：roster[0] 即冠军（数据即名次序），置顶金带；
            出现次序反过来——第六名先落，冠军行压轴点亮 */}
        {roster.map((r, i) => {
          const isTop = i === 0;
          const order = roster.length - 1 - i;
          const st = B.num + 0.1 + order * 0.22;
          const e = EASE.enter(seg(t, st, st + 0.46));
          const ink = 'rgba(42, 21, 5, 0.95)';
          const inkSoft = 'rgba(42, 21, 5, 0.78)';
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 70,
                top: ROW_Y0 + i * ROW_H,
                width: 940,
                height: isTop ? 168 : 150,
                borderRadius: isTop ? 18 : 14,
                border: `1px solid ${isTop ? rgba(T.goldA, 0.9) : rgba(T.line, 0.32)}`,
                background: isTop
                  ? `linear-gradient(90deg, ${T.goldC} 0%, ${T.goldB} 52%, ${rgba(T.goldD, 0.9)} 100%)`
                  : `linear-gradient(90deg, ${rgba(T.line, 0.09)}, ${rgba(T.line, 0.02)})`,
                boxShadow: isTop
                  ? `0 14px 38px ${rgba(T.goldD, 0.45)}, inset 0 1px 0 rgba(255,255,255,0.4)`
                  : 'none',
                opacity: clamp01(seg(t, st, st + 0.24)),
                transform: `translateX(${(1 - e) * (i % 2 === 0 ? -110 : 110)}px)`,
              }}
            >
              {/* 名次章：冠军行深墨圆底金字，其余细圈 */}
              <div
                style={{
                  position: 'absolute',
                  left: 30,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 78,
                  height: 78,
                  borderRadius: '50%',
                  border: isTop ? 'none' : `2px solid ${rgba(T.line, 0.5)}`,
                  background: isTop ? ink : 'rgba(0,0,0,.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: isTop ? 42 : 36, fontWeight: 700,
                  color: isTop ? T.goldA : rgba(T.pale, 0.85),
                  fontFamily: "'Oswald', 'Noto Sans SC', sans-serif" }}>
                  {i + 1}
                </span>
              </div>
              {/* 姓名 + 机构：冠军行深墨字压金底，对比最强 */}
              <div style={{ position: 'absolute', left: 136, top: '50%', transform: 'translateY(-50%)' }}>
                <Txt size={isTop ? 52 : 46} color={isTop ? ink : T.cream} weight={isTop ? 700 : 600}
                  letterSpacing={3} lineHeight={64}>
                  {r.name}
                </Txt>
                <Txt size={38} color={isTop ? inkSoft : rgba(T.pale, 0.72)} weight={400} letterSpacing={2} lineHeight={36}>
                  {r.org ?? ''}
                </Txt>
              </div>
              {/* 业绩值靠右 */}
              <div style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', textAlign: 'right' }}>
                {isTop ? (
                  <Txt size={62} color={ink} weight={700} font="num" lineHeight={76} letterSpacing={-1}>
                    {r.value}
                  </Txt>
                ) : (
                  <Txt size={70} color={T.cream} weight={600} font="num" lineHeight={68} letterSpacing={-1}>
                    {r.value}
                  </Txt>
                )}
              </div>
            </div>
          );
        })}
        <Sfx name="sfx_pop" at={B.num + 0.32} vol={0.22} />
        <Sfx name="sfx_pop" at={B.num + 0.54} vol={0.22} />
        <Sfx name="sfx_pop" at={B.num + 0.76} vol={0.22} />
        <Sfx name="sfx_pop" at={B.num + 0.98} vol={0.22} />
        <Sfx name="sfx_pop" at={B.num + 1.2} vol={0.22} />
      </Chapter>

      {/* 章 2 · 冠军压轴：金光扫过冠军行 + 金句居中收底（不再用印章） */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 冠军行光带扫过（冠军行位于 70,520,940,168） */}
        {(() => {
          const sp = seg(t, B.rows + 0.12, B.rows + 0.72);
          if (sp <= 0 || sp >= 1) return null;
          const x = lerp(-500, 1040, EASE.settle(sp));
          return (
            <div
              style={{
                position: 'absolute',
                left: 70,
                top: 520,
                width: 940,
                height: 168,
                borderRadius: 18,
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: 0,
                  width: 260,
                  height: '100%',
                  background: `linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,248,220,${0.55 * (1 - sp * 0.6)}) 50%, rgba(255,255,255,0) 100%)`,
                  transform: 'skewX(-14deg)',
                }}
              />
            </div>
          );
        })()}
        <Sfx name="sfx_shimmer" at={B.rows + 0.15} vol={0.3} />
        {/* 冠军行二次脉冲：金边呼吸 */}
        {(() => {
          const pp = seg(t, B.rows + 0.12, B.rows + 0.9);
          if (pp <= 0 || pp >= 1) return null;
          return (
            <div
              style={{
                position: 'absolute',
                left: 70,
                top: 520,
                width: 940,
                height: 168,
                borderRadius: 18,
                border: `3px solid rgba(255, 232, 168, ${(1 - pp) * 0.9})`,
                boxShadow: `0 0 ${lerp(46, 0, pp)}px ${rgba(T.goldA, (1 - pp) * 0.55)}`,
                pointerEvents: 'none',
              }}
            />
          );
        })()}
        {/* 金句居中收底（榜单底 1628，装饰条 1822） */}
        <Txt size={42} color={T.cream} weight={500} letterSpacing={10} lineHeight={46}
          style={{ position: 'absolute', left: 0, top: 1700, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.7, B.rows + 1.0)) }}>
          英雄榜上 · 见字如面
        </Txt>
        <Sfx name="sfx_gong" at={B.rows + 0.4} vol={0.3} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={138} titleText="英雄榜"
          subText="以业绩论英雄 · 下月再战" splitTitle drawLine titleLetterSpacing={24} />
      </Chapter>
    </GsStage>
  );
};
