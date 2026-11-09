import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { PhotoCard } from '../../components/PhotoCard';
import { EndCard } from '../../components/EndCard';
import {
  GsStage, HookCap, gsBeats, SplitReveal, FootStrip,
  EASE, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 06 · 月度之星版（红金）
 * 叙事：人物优先——追光锥 0.4 秒就打下来，先见其人后见其数。
 * 版式：追光叙事构图——光锥从顶打下贯穿，名字超大贴在光锥上部，
 *       数据横条三格沉底，与传统「先数据后人」的模板完全相反。
 * 结构：3 章（追光亮相 / 沉底数据条 / 定版）。
 */
export const GsSpotlight: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const B = gsBeats({ hook: 0.12, num: 4.3, rows: 5.6, end: 6.72 });

  /* 追光锥展开 */
  const cone = EASE.enter(seg(t, B.hook, B.hook + 0.7));
  /* 光斑呼吸 */
  const breathe = 0.9 + Math.sin(t * 2.2) * 0.1;

  const cols = p.stats.slice(0, 3);
  const colX = [100, 400, 700];

  return (
    <GsStage theme={T} p={p} bottomtag="STAR　OF　THE　MONTH">
      {/* 章 1 · 追光亮相（人物打头） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.num - 0.26, B.num - 0.02]}>
        {/* 追光锥 */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 330,
            top: 0,
            width: 660,
            height: 1250,
            background: `linear-gradient(180deg, ${rgba(T.pale, 0.3)} 0%, ${rgba(T.pale, 0.08)} 55%, ${rgba(T.pale, 0)} 100%)`,
            clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
            opacity: cone * breathe,
          }}
        />
        {/* 地面光斑 */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 260,
            top: 1150,
            width: 520,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${rgba(T.pale, 0.3)}, ${rgba(T.pale, 0)} 70%)`,
            opacity: cone * 0.9,
            filter: 'blur(6px)',
          }}
        />
        {/* 月度之星标题（贴顶） */}
        <HookCap theme={T} t={t} text="STAR OF THE MONTH" top={330} start={B.hook + 0.24} />
        <SplitReveal theme={T} t={t} text="月度之星" size={116} top={410} start={B.hook + 0.34}
          mode="mask" staggerEach={0.08} dur={0.42} lineHeight={146} />
        <Sfx name="sfx_chime" at={B.hook + 0.5} vol={0.28} />

        {/* 照片在光锥中 */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 212,
            top: 620,
            width: 424,
            height: 424,
            borderRadius: '50%',
            border: `3px solid ${rgba(T.line, 0.8)}`,
            boxShadow: `0 0 90px ${rgba(T.glow1, 0.4)}, 0 0 26px ${rgba(T.glow1, 0.25)}`,
            opacity: clamp01(seg(t, B.hook + 0.5, B.hook + 0.78)),
          }}
        />
        <PhotoCard
          theme={T}
          src={p.photo}
          left={540 - 198}
          top={634}
          width={396}
          height={396}
          round
          objectPosition="50% 18%"
          style={{
            opacity: clamp01(seg(t, B.hook + 0.5, B.hook + 0.72)),
            transform: `scale(${lerp(0.62, 1, EASE.glam(seg(t, B.hook + 0.5, B.hook + 0.94)))})`,
          }}
        />
        <Sfx name="sfx_whoosh" at={B.hook + 0.5} vol={0.28} />

        {/* 名字超大 */}
        <SplitReveal theme={T} t={t} text={p.name} size={110} top={1090} start={B.hook + 0.72}
          mode="drop" staggerEach={0.09} dur={0.4} lineHeight={136} />
        <Sfx name="sfx_gong" at={B.hook + 1.1} vol={0.32} />
        <Txt size={48} color={T.cream} weight={500} letterSpacing={6} lineHeight={48}
          style={{ position: 'absolute', left: 0, top: 1268, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.hook + 1.06, B.hook + 1.34)) }}>
          {p.role}
        </Txt>
        <Txt size={46} color={T.cream2} weight={400} font="serif" letterSpacing={4} lineHeight={46}
          style={{ position: 'absolute', left: 0, top: 1330, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.hook + 1.22, B.hook + 1.5)) }}>
          {p.quote ?? '星光不问赶路人'}
        </Txt>
      </Chapter>

      {/* 章 2 · 沉底数据横条 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 顶部小标延续叙事，避免数据卡孤悬 */}
        <HookCap theme={T} t={t} text="STAR OF THE MONTH · 十月" top={380} start={B.num + 0.02} />
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 700,
            width: 920,
            height: 480,
            borderRadius: 24,
            border: `1px solid ${rgba(T.line, 0.5)}`,
            background: `linear-gradient(180deg, ${rgba(T.mask, 0.5)}, ${rgba(T.mask, 0.24)})`,
            boxShadow: '0 18px 46px rgba(0,0,0,.4)',
            opacity: clamp01(seg(t, B.num + 0.06, B.num + 0.32)),
            transform: `translateY(${(1 - EASE.enter(seg(t, B.num + 0.06, B.num + 0.4))) * 90}px)`,
          }}
        >
          <Txt size={48} color={rgba(T.pale, 0.92)} weight={500} letterSpacing={9} lineHeight={48}
            style={{ position: 'absolute', top: 56, width: '100%', textAlign: 'center' }}>
            {p.dlabel}
          </Txt>
          <div style={{ position: 'absolute', top: 120, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <NumRollLike theme={T} p={p} t={t} start={B.num + 0.2} />
          </div>
          <Txt size={44} color={T.cream2} weight={400} letterSpacing={3} lineHeight={44}
            style={{ position: 'absolute', top: 350, width: '100%', textAlign: 'center' }}>
            {p.delta}
          </Txt>
        </div>
        {/* 三格小数据横排在底 */}
        {cols.map((s, i) => {
          const st = B.rows + 0.08 + i * 0.12;
          const e = EASE.glam(seg(t, st, st + 0.4));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: colX[i],
                top: 1300,
                width: 280,
                textAlign: 'center',
                opacity: clamp01(seg(t, st, st + 0.2)),
                transform: `translateY(${(1 - e) * 26}px)`,
              }}
            >
              {s.hl ? (
                <GoldText theme={T} size={72} weight={700} font="num" lineHeight={86}>{s.v}</GoldText>
              ) : (
                <Txt size={72} color={T.cream} weight={600} font="num" lineHeight={86}>{s.v}</Txt>
              )}
              <Txt size={42} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={6} lineHeight={42}
                style={{ marginTop: 6, display: 'block' }}>
                {s.k}
              </Txt>
            </div>
          );
        })}
        <Sfx name="sfx_pop" at={B.num + 0.2 + 0.9 * 0.78} vol={0.26} />
        {/* 底部日期信息带 */}
        <FootStrip theme={T} t={t} text={p.dateText ?? '2026 年 10 月'} top={1560} start={B.rows + 0.6} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={140} titleText="星光不问赶路人"
          subText="月度之星 · 实至名归" splitTitle drawLine titleLetterSpacing={4} />
      </Chapter>
    </GsStage>
  );
};

/** 数字滚轮（本模板专用包装，避免顶导出多余依赖） */
const NumRollLike: React.FC<{
  theme: (typeof THEMES)['hongjin'];
  p: HebaoProps;
  t: number;
  start: number;
}> = ({ theme: T, p, t, start }) => {
  /* 简化：直接 GoldText 定格大数（追光版数字是配角，滚数抢戏） */
  return (
    <GoldText theme={T} size={170} weight={700} font="num" lineHeight={192} letterSpacing={-3}>
      {p.premium.toFixed(1)}
      <span style={{ fontSize: 60, letterSpacing: 4, marginLeft: 10 }}>万元</span>
    </GoldText>
  );
};
