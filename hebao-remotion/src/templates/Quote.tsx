import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { Rule } from '../components/Rule';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 04 · 金句箴言版
 * 叙事：大引号 + 金句逐字浮现 → 核心数字 → 人物 → 定版
 */
export const Quote: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const q = p.quote || '把简单的事做到极致';
  const chars = Array.from(q);
  const fs = chars.length <= 8 ? 110 : chars.length <= 12 ? 96 : 72;
  const sign = p.sign || `—— ${p.name} · 十月箴言`;

  const qmP = outExpo(seg(t, 0.12, 0.44));

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 金句 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.4, 2.7]}>
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 330,
            fontSize: 280,
            lineHeight: 1,
            fontFamily: 'Georgia,serif',
            color: rgba(T.line, 0.3),
            opacity: qmP,
            transform: `translateY(${(1 - qmP) * 30}px)`,
          }}
        >
          &ldquo;
        </div>

        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 520,
            width: 840,
          }}
        >
          {chars.map((c, i) => {
            const st = 0.26 + i * 0.085;
            const pr = seg(t, st, st + 0.26);
            return (
              <GoldText
                key={i}
                theme={T}
                size={fs}
                weight={700}
                letterSpacing={6}
                lineHeight={150}
                font="serif"
                style={{
                  transform: `scale(${lerp(1.5, 1, outBack(pr, 2))}) translateY(${
                    (1 - outExpo(pr)) * 30
                  }px)`,
                  opacity: clamp01(pr * 2.2),
                }}
              >
                {c}
              </GoldText>
            );
          })}
        </div>

        <Rule theme={T} t={t} start={1.42} dur={0.34} left={290} top={1090} width={500} />
        <Txt
          size={33}
          color={rgba(T.soft, 0.8)}
          weight={300}
          letterSpacing={8}
          lineHeight={46}
          style={{
            position: 'absolute',
            top: 1140,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 1.58, 1.92)),
          }}
        >
          {sign}
        </Txt>
      </Chapter>

      {/* 02 核心数字 */}
      <Chapter t={t} in={[2.54, 2.86]} out={[3.94, 4.24]}>
        <Txt
          size={34}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={6}
          lineHeight={48}
          style={{
            position: 'absolute',
            top: 560,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.6, 2.84)),
            transform: `translateY(${(1 - outExpo(seg(t, 2.6, 2.84))) * 18}px)`,
          }}
        >
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 648,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: outExpo(seg(t, 2.72, 2.98)),
          }}
        >
          <NumRoll
            theme={T}
            target={p.premium}
            t={t}
            start={2.66}
            dur={1.08}
            size={276}
            lineHeight={306}
            unit="万元"
            unitSize={54}
            unitColor={rgba(T.soft, 0.92)}
          />
        </div>
        <Txt
          size={29}
          color={rgba(T.soft, 0.85)}
          letterSpacing={4}
          lineHeight={41}
          style={{
            position: 'absolute',
            top: 1030,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.54, 3.8)),
            transform: `translateY(${(1 - outExpo(seg(t, 3.54, 3.8))) * 18}px)`,
          }}
        >
          {p.delta}
        </Txt>
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.38, 4.7]} out={[5.94, 6.24]} photoTop={220} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.38, 6.72]}>
        <Sfx name="sfx_pop" at={3.36} vol={0.28} />
        <EndCard theme={T} t={t} start={6.46} p={p} />
      </Chapter>
    </Stage>
  );
};
