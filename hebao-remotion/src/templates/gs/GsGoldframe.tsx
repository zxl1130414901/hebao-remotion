import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { NumRoll } from '../../components/NumRoll';
import { EndCard } from '../../components/EndCard';
import { DrawRect, DrawPath } from '../../components/DrawLine';
import {
  GsStage, gsBeats, SplitReveal,
  EASE, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 07 · 鎏金典藏版（深墨）
 * 叙事：把这一战裱进画框——博物馆级画框占据 84% 高度，内容按「展品」逻辑排布。
 * 版式：画框构图——外框描画生长 + 内衬双线，框内自上而下：
 *       眉题 → 大数字 → 铭牌（说明+环比）→ 黄铜作者牌。
 * 结构：3 章（画框生长 / 展品入框 / 定版）。
 */
export const GsGoldframe: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.shenmo;
  const B = gsBeats({ num: 1.5, rows: 4.6, end: 6.72 });

  const FX = 100;
  const FY = 330;
  const FW = 880;
  const FH = 1330;

  return (
    <GsStage theme={T} p={p} bottomtag="COLLECTOR'S　EDITION">
      {/* 章 1 · 画框描画生长 */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 外框 */}
        <DrawRect left={FX} top={FY} w={FW} h={FH} radius={10} t={t} start={B.hook + 0.1}
          dur={1.1} color={rgba(T.goldC, 0.9)} strokeWidth={5} opacity={0.95} />
        {/* 内衬双线 */}
        <DrawRect left={FX + 26} top={FY + 26} w={FW - 52} h={FH - 52} radius={6} t={t}
          start={B.hook + 0.55} dur={0.8} color={rgba(T.line, 0.85)} strokeWidth={1.5} opacity={0.7} />
        {/* 框角花饰（四角小方） */}
        {[
          [FX - 9, FY - 9],
          [FX + FW - 9, FY - 9],
          [FX - 9, FY + FH - 9],
          [FX + FW - 9, FY + FH - 9],
        ].map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 18,
              height: 18,
              background: `linear-gradient(135deg, ${T.goldA}, ${T.goldC})`,
              transform: `rotate(45deg) scale(${clamp01(seg(t, B.hook + 0.9 + i * 0.06, B.hook + 1.14 + i * 0.06))})`,
              boxShadow: '0 0 14px rgba(0,0,0,.4)',
            }}
          />
        ))}
        <Sfx name="sfx_whoosh" at={B.hook + 0.1} vol={0.26} />
        <Sfx name="sfx_chime" at={B.hook + 1.0} vol={0.26} />
      </Chapter>

      {/* 章 2 · 展品入框 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 眉题 */}
        <SplitReveal theme={T} t={t} text="传世典藏" size={84} top={FY + 110} start={B.num + 0.1}
          mode="mask" staggerEach={0.1} dur={0.44} lineHeight={106} />
        {/* 短分隔线 */}
        <div
          style={{
            position: 'absolute',
            left: FX + FW / 2 - 70,
            top: FY + 250,
            width: 140,
            height: 2,
            background: `linear-gradient(90deg, ${rgba(T.line, 0)}, ${rgba(T.line, 0.9)}, ${rgba(T.line, 0)})`,
            transform: `scaleX(${EASE.enter(seg(t, B.num + 0.5, B.num + 0.8))})`,
          }}
        />
        {/* 大数字 */}
        <Txt size={46} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={8} lineHeight={46}
          style={{ position: 'absolute', left: 0, top: FY + 320, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 0.56, B.num + 0.84)) }}>
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: FY + 410,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: clamp01(seg(t, B.num + 0.6, B.num + 0.88)),
          }}
        >
          <NumRoll theme={T} target={p.premium} t={t} start={B.num + 0.7} dur={1.05} size={244}
            lineHeight={268} unit="万元" unitSize={48} unitColor={rgba(T.soft, 0.95)} />
        </div>
        <Sfx name="sfx_pop" at={B.num + 0.7 + 1.05 * 0.78} vol={0.26} />
        {/* 铭牌：环比 */}
        <div
          style={{
            position: 'absolute',
            left: FX + 150,
            top: FY + 780,
            width: FW - 300,
            padding: '22px 0',
            borderRadius: 12,
            border: `1px solid ${rgba(T.line, 0.5)}`,
            background: `rgba(${T.mask}, 0.4)`,
            textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 1.3, B.num + 1.56)),
          }}
        >
          {(p.delta ?? '').split(/[|｜]/).map((s) => s.trim()).filter(Boolean).map((s, i) => (
            <span key={i} style={{ display: 'block', fontSize: 40, fontWeight: 500, letterSpacing: 3, color: T.cream2, lineHeight: '58px' }}>
              {s}
            </span>
          ))}
        </div>
        {/* 黄铜作者牌 */}
        <div
          style={{
            position: 'absolute',
            left: FX + FW / 2 - 240,
            top: FY + FH - 210,
            width: 480,
            height: 126,
            borderRadius: 10,
            background: `linear-gradient(180deg, ${T.goldC}, ${T.goldD})`,
            boxShadow: '0 10px 26px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.35)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: clamp01(seg(t, B.rows + 0.1, B.rows + 0.4)),
            transform: `scale(${lerp(0.8, 1, EASE.glam(seg(t, B.rows + 0.1, B.rows + 0.5)))})`,
          }}
        >
          <span style={{ fontSize: 54, fontWeight: 700, letterSpacing: 8, color: '#3A2506', lineHeight: '64px' }}>
            {p.name}
          </span>
          <span style={{ fontSize: 34, fontWeight: 500, letterSpacing: 1, color: '#5A3B10', lineHeight: '44px' }}>
            {p.role}
          </span>
        </div>
        <Sfx name="sfx_stamp" at={B.rows + 0.44} vol={0.28} />
        <Sfx name="sfx_shimmer" at={B.rows + 0.8} vol={0.26} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={136} titleText="典藏时刻"
          subText="大师之作 · 传世为证" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
