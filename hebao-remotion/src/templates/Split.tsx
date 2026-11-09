import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { Rule } from '../components/Rule';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 07 · 今昔对比版
 * 叙事：标语 → 目标 vs 实际 双栏对垒 → 双项补充 → 人物 → 定版
 */
export const Split: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const peb = outExpo(seg(t, 0.14, 0.4));
  const psg = outBack(seg(t, 0.28, 0.68), 1.8);
  const pL = outExpo(seg(t, 2.22, 2.52));
  const pR = outBack(seg(t, 2.46, 2.9), 1.7);
  const realV = p.stats[1]?.v ?? '218%';

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 标语 */}
      <Chapter t={t} in={[0.1, 0.44]} out={[2.0, 2.3]}>
        <Txt
          size={26}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={14}
          lineHeight={36}
          style={{
            position: 'absolute',
            top: 560,
            width: 1080,
            textAlign: 'center',
            opacity: peb,
            transform: `translateY(${(1 - peb) * 18}px)`,
          }}
        >
          GOOD　NEWS　EXPRESS
        </Txt>
        <GoldText
          theme={T}
          size={150}
          weight={700}
          letterSpacing={26}
          lineHeight={200}
          font="serif"
          style={{
            position: 'absolute',
            top: 640,
            width: 1080,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: clamp01(seg(t, 0.28, 0.52)),
            transform: `scale(${lerp(1.3, 1, psg)})`,
          }}
        >
          {p.slogan}
        </GoldText>
        <Rule theme={T} t={t} start={0.9} dur={0.36} left={290} top={910} width={500} />
      </Chapter>

      {/* 02 双栏对比 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[3.54, 3.84]}>
        <div
          style={{
            position: 'absolute',
            top: 470,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 420,
              textAlign: 'center',
              opacity: pL,
              transform: `translateX(${(1 - pL) * -60}px)`,
            }}
          >
            <Txt size={31} color={rgba(T.mist, 1)} weight={300} letterSpacing={8} lineHeight={43}>
              {p.goalLabel || '时 序 目 标'}
            </Txt>
            <div style={{ marginTop: 40 }}>
              <Txt
                size={150}
                color={rgba(T.soft, 0.85)}
                weight={700}
                font="num"
                lineHeight={190}
                letterSpacing={-2}
              >
                {p.goalValue || '100%'}
              </Txt>
            </div>
          </div>
          <div
            style={{
              width: 1,
              height: 430,
              marginTop: 14,
              background: `linear-gradient(180deg,${rgba(T.line, 0)},${rgba(T.line, 0.55)},${rgba(
                T.line,
                0
              )})`,
            }}
          />
          <div
            style={{
              width: 420,
              textAlign: 'center',
              opacity: clamp01(seg(t, 2.46, 2.66)),
              transform: `translateX(${(1 - outExpo(seg(t, 2.46, 2.8))) * 60}px) scale(${lerp(
                1.15,
                1,
                pR
              )})`,
            }}
          >
            <Txt size={31} color={rgba(T.mist, 1)} weight={300} letterSpacing={8} lineHeight={43}>
              实 际 达 成
            </Txt>
            <div style={{ marginTop: 40 }}>
              <GoldText
                theme={T}
                size={200}
                font="num"
                weight={700}
                lineHeight={240}
                letterSpacing={-3}
              >
                {realV}
              </GoldText>
            </div>
          </div>
        </div>
        <Txt
          size={29}
          color={rgba(T.soft, 0.85)}
          letterSpacing={4}
          lineHeight={41}
          style={{
            position: 'absolute',
            top: 1060,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.1, 3.4)),
            transform: `translateY(${(1 - outExpo(seg(t, 3.1, 3.4))) * 18}px)`,
          }}
        >
          {p.delta}
        </Txt>
      </Chapter>

      {/* 03 双项补充 */}
      <Chapter t={t} in={[3.68, 4.0]} out={[5.06, 5.36]}>
        {[0, 2].map((si, i) => {
          const st0 = 3.8 + i * 0.28;
          const e = outExpo(seg(t, st0, st0 + 0.34));
          const st = p.stats[si];
          if (!st) return null;
          return (
            <div
              key={si}
              style={{
                position: 'absolute',
                left: 190,
                top: 620 + i * 230,
                width: 700,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: `1px solid ${rgba(T.line, 0.28)}`,
                paddingBottom: 26,
                opacity: e,
                transform: `translateY(${(1 - e) * 34}px)`,
              }}
            >
              <Txt size={36} color={rgba(T.mist, 1)} weight={300} letterSpacing={8} lineHeight={50}>
                {st.k}
              </Txt>
              <GoldText theme={T} size={88} font="num" weight={700} lineHeight={100}>
                {st.v}
              </GoldText>
            </div>
          );
        })}
      </Chapter>

      {/* 04 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[5.2, 5.52]} out={[6.54, 6.84]} photoTop={200} nameTop={580} roleTop={780} pillTop={892} />

      {/* 05 定版 */}
      <Chapter t={t} in={[6.68, 7.02]}>
        <Sfx name="sfx_gong" at={0.58} vol={0.45} />
        <EndCard theme={T} t={t} start={6.76} p={p} />
      </Chapter>
    </Stage>
  );
};
