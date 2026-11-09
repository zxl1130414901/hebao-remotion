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
  GsStage, gsBeats, SplitReveal, FootStrip,
  EASE, stagger, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 15 · 星芒绽放版（红金）
 * 叙事：光芒万丈——十二道星芒从中心依次绽出铺满全屏，
 *       三项战报分布在三条主光芒端点，呈三角鼎立。
 * 版式：放射构图——数据不再是竖排三行，而是绕中心 120° 分布；
 *       中心是主数字，芒尖是战报，几何秩序感强。
 * 结构：3 章（星芒绽出 / 三芒战报 / 中心数字+定版）。
 */
export const GsPulse: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const B = gsBeats({ num: 2.7, rows: 4.6, end: 6.72 });

  const CX = 540;
  const CY = 900;
  const rays = 12;
  const stats = p.stats.slice(0, 3);
  /* 三芒端点：上、左下、右下（120° 分布），距中心 560 */
  const tips = [270, 150, 30].map((deg) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return { x: CX + Math.cos(a) * 520, y: CY + Math.sin(a) * 480 };
  });

  return (
    <GsStage theme={T} p={p} bottomtag="RADIANT">
      {/* 章 1 · 星芒绽出（贯穿） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        {Array.from({ length: rays }).map((_, i) => {
          const main = i % 4 === 0; /* 3 条主芒更亮 */
          const st = B.hook + 0.15 + i * 0.07;
          const e = EASE.enter(seg(t, st, st + 0.5));
          const len = main ? 780 : 520 + (i % 3) * 60;
          const w = main ? 15 : 7;
          const a = (i * 360) / rays;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: CX - w,
                top: CY - len,
                width: w * 2,
                height: len,
                background: `linear-gradient(180deg, ${rgba(main ? T.pale : T.line, 0.6)}, ${rgba(main ? T.glow1 : T.line, 0)})`,
                clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
                transform: `rotate(${a}deg)`,
                transformOrigin: '50% 100%',
                opacity: e * (main ? 0.9 : 0.5),
                filter: main ? 'blur(0.5px)' : 'blur(1.5px)',
              }}
            />
          );
        })}
        {/* 中心辉光 */}
        <div
          style={{
            position: 'absolute',
            left: CX - 340,
            top: CY - 340,
            width: 680,
            height: 680,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(T.glow1, 0.3)} 0%, ${rgba(T.glow1, 0)} 66%)`,
            opacity: EASE.enter(seg(t, B.hook + 0.5, B.hook + 1.1)),
          }}
        />
        {/* 钩子标题：星芒绽出时同步亮题（主标题 108px，副题缩级，杜绝层级倒挂） */}
        <SplitReveal theme={T} t={t} text="光芒万丈" size={108} top={186} start={B.hook + 0.7}
          mode="drop" staggerEach={0.08} dur={0.42} lineHeight={134} />
        <Txt size={40} color={rgba(T.pale, 0.88)} weight={400} letterSpacing={10} lineHeight={40}
          style={{ position: 'absolute', left: 0, top: 348, width: 1080, textAlign: 'center',
            opacity: EASE.enter(seg(t, B.hook + 1.0, B.hook + 1.3)) }}>
          {p.slogan2 ?? '星芒绽放 · 照见热爱'}
        </Txt>
        <Sfx name="sfx_whoosh" at={B.hook + 0.16} vol={0.28} />
        <Sfx name="sfx_chime" at={B.hook + 1.0} vol={0.26} />
      </Chapter>

      {/* 章 2 · 三芒战报（绕中心三角分布） */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {stats.map((s, i) => {
          const st = B.num + 0.12 + i * 0.2;
          const e = EASE.glam(seg(t, st, st + 0.44));
          const tip = tips[i];
          const above = i === 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: Math.min(Math.max(tip.x - 150, 40), 740),
                top: above ? tip.y - 40 : tip.y - 110,
                width: 300,
                textAlign: 'center',
                opacity: clamp01(seg(t, st, st + 0.22)),
                transform: `scale(${lerp(0.6, 1, e)})`,
              }}
            >
              {s.hl ? (
                <GoldText theme={T} size={92} weight={700} font="num" lineHeight={108} letterSpacing={-2}>
                  {s.v}
                </GoldText>
              ) : (
                <Txt size={92} color={T.cream} weight={600} font="num" letterSpacing={-2} lineHeight={108}>
                  {s.v}
                </Txt>
              )}
              <Txt size={44} color={rgba(T.pale, 0.92)} weight={400} letterSpacing={7} lineHeight={44}
                style={{ marginTop: 8, display: 'block' }}>
                {s.k}
              </Txt>
            </div>
          );
        })}
        <Sfx name="sfx_stamp" at={B.num + 0.32} vol={0.26} />
        <Sfx name="sfx_stamp" at={B.num + 0.52} vol={0.22} />
      </Chapter>

      {/* 章 3 · 中心数字 */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 中心衬底圈 */}
        <div
          style={{
            position: 'absolute',
            left: CX - 260,
            top: CY - 260,
            width: 520,
            height: 520,
            borderRadius: '50%',
            border: `2px solid ${rgba(T.line, 0.7)}`,
            background: `radial-gradient(circle, ${rgba(T.mask, 0.5)} 0%, ${rgba(T.mask, 0.24)} 74%)`,
            opacity: clamp01(seg(t, B.rows + 0.05, B.rows + 0.3)),
            transform: `scale(${lerp(0.6, 1, EASE.glam(seg(t, B.rows + 0.05, B.rows + 0.5)))})`,
          }}
        />
        <Txt size={44} color={rgba(T.pale, 0.92)} weight={500} letterSpacing={7} lineHeight={44}
          style={{ position: 'absolute', left: 0, top: CY - 200, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.24, B.rows + 0.5)) }}>
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: CY - 130,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: clamp01(seg(t, B.rows + 0.28, B.rows + 0.54)),
          }}
        >
          <NumRoll theme={T} target={p.premium} t={t} start={B.rows + 0.38} dur={0.95} size={164}
            lineHeight={180} unit="万" unitSize={40} unitColor={rgba(T.soft, 1)}
            style={{ filter: 'brightness(1.22) drop-shadow(0 4px 16px rgba(0,0,0,.35))' }} />
        </div>
        <Sfx name="sfx_pop" at={B.rows + 0.38 + 0.95 * 0.78} vol={0.26} />
        <Txt size={42} color={T.cream2} weight={400} letterSpacing={3} lineHeight={42}
          style={{ position: 'absolute', left: 0, top: CY + 160, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 1.05, B.rows + 1.35)) }}>
          {p.delta}
        </Txt>
        {/* 底部日期带：填补下半屏 */}
        <FootStrip theme={T} t={t} text={p.dateText ?? '2026 年 10 月'} top={1560} start={B.rows + 1.2} />
        <Sfx name="sfx_shimmer" at={B.rows + 1.05} vol={0.26} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={142} titleText="光芒万丈"
          subText="星芒绽放 · 照见热爱" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
