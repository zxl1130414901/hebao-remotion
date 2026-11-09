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
  EASE, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 17 · 捷报频传版（红金）
 * 叙事：三道捷报斜带依次甩入——每条带子承载一行内容，斜贯全屏，
 *       像三张捷报从天而降又满屏飘扬。
 * 版式：斜向满屏构图（-13°）——打破一切横平竖直，
 *       带 1 载标语、带 2 载核心数字（斜带内滚数）、带 3 载环比+英文。
 * 结构：2 章（三带甩入连播 / 定版），全程一条时间轴。
 */
export const GsRibbon: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const B = gsBeats({ num: 1.4, rows: 2.9, end: 6.72 });

  const bandT = [B.hook + 0.2, B.num + 0.2, B.rows + 0.2];
  const bandY = [560, 900, 1240];
  const ANGLE = -13;

  return (
    <GsStage theme={T} p={p} bottomtag="FLASH　NEWS">
      {/* 章 1 · 三带连播（贯穿） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        {[0, 1, 2].map((i) => {
          const st = bandT[i];
          const inE = EASE.enter(seg(t, st, st + 0.55));
          /* 带子从两侧甩入：奇数从左、偶数从右 */
          const fromL = i % 2 === 0;
          const hold = 1 - inE;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: -80,
                top: bandY[i],
                width: 1240,
                height: 210,
                transform: `translateX(${(fromL ? -1 : 1) * hold * 1400}px) rotate(${ANGLE}deg)`,
                transformOrigin: '50% 50%',
              }}
            >
              {/* 带身 */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: i === 1
                    ? `linear-gradient(90deg, ${rgba(T.goldD, 0.24)} 0%, ${rgba(T.goldC, 0.34)} 50%, ${rgba(T.goldD, 0.24)} 100%)`
                    : `linear-gradient(90deg, ${rgba(T.mask, 0.72)} 0%, ${rgba(T.mask, 0.5)} 50%, ${rgba(T.mask, 0.72)} 100%)`,
                  borderTop: `2px solid ${rgba(T.goldC, 0.85)}`,
                  borderBottom: `2px solid ${rgba(T.goldC, 0.85)}`,
                  boxShadow: '0 18px 44px rgba(0,0,0,.4)',
                }}
              />
              {/* 燕尾端头 */}
              <div style={{ position: 'absolute', left: -46, top: 0, width: 60, height: 210,
                background: `linear-gradient(180deg, ${T.bg[0]}, ${T.archbg})`,
                clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />
              <div style={{ position: 'absolute', right: -46, top: 0, width: 60, height: 210,
                background: `linear-gradient(180deg, ${T.bg[0]}, ${T.archbg})`,
                clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />

              {/* 带内内容 */}
              {i === 0 && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SplitReveal theme={T} t={t} text={p.slogan} size={118} top={44} start={st + 0.3}
                    mode="drop" staggerEach={0.08} dur={0.4} width={1080} left={80} lineHeight={140} />
                </div>
              )}
              {i === 1 && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 22,
                      opacity: clamp01(seg(t, st + 0.28, st + 0.52)),
                      transform: `translateY(${(1 - EASE.enter(seg(t, st + 0.28, st + 0.56))) * 20}px)`,
                    }}
                  >
                    <Txt size={48} color={T.cream2} weight={400} letterSpacing={5} lineHeight={48}>
                      {p.dlabel}
                    </Txt>
                    <NumRoll theme={T} target={p.premium} t={t} start={st + 0.34} dur={1.0} size={122}
                      lineHeight={134} unit="万元" unitSize={40} unitColor={rgba(T.goldB, 0.98)} />
                  </div>
                </div>
              )}
              {i === 2 && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Txt size={54} color={T.cream} weight={600} letterSpacing={5} lineHeight={56}
                    style={{ opacity: clamp01(seg(t, st + 0.26, st + 0.5)) }}>
                    {p.delta}
                  </Txt>
                  <span style={{ fontSize: 36, fontWeight: 400, letterSpacing: 9,
                    color: rgba(T.pale, 0.8),
                    opacity: clamp01(seg(t, st + 0.42, st + 0.66)) }}>
                    GOOD NEWS KEEPS COMING · 喜讯连连
                  </span>
                </div>
              )}
              <Sfx name="sfx_whoosh" at={st} vol={0.26} />
            </div>
          );
        })}
        {t > bandT[1] + 0.4 && <Sfx name="sfx_pop" at={bandT[1] + 0.34 + 1.0 * 0.78} vol={0.26} />}
        <Sfx name="sfx_gong" at={bandT[2] + 0.7} vol={0.3} />
        {/* 底部信息带：填补下半屏 */}
        <FootStrip theme={T} t={t} text={p.dateText ?? '2026 年 10 月'} top={1560} start={B.rows + 0.9} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={144} titleText="捷报频传"
          subText="喜讯连连 · 好戏连台" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
