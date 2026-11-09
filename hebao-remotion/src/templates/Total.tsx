import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { SloganChapter } from '../components/Chapters';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 15 · 年度累计版
 * 叙事：标语 → 年度累计大数字 → 进度条充能 + 月份刻度 → 三项 → 定版
 */
export const Total: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const pct = p.pct ?? 75;
  const fp = outExpo(seg(t, 3.8, 4.9));

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 标语 */}
      <SloganChapter theme={T} t={t} slogan={p.slogan} eyebrow="ANNUAL　ACCUMULATION" in={[0.1, 0.44]} out={[2.0, 2.3]} />

      {/* 02 累计大数字 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[3.54, 3.84]}>
        <Txt
          size={34}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={6}
          lineHeight={48}
          style={{
            position: 'absolute',
            top: 540,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.2, 2.44)),
            transform: `translateY(${(1 - outExpo(seg(t, 2.2, 2.44))) * 18}px)`,
          }}
        >
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 628,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: outExpo(seg(t, 2.32, 2.58)),
          }}
        >
          <NumRoll
            theme={T}
            target={p.premium}
            t={t}
            start={2.26}
            dur={1.08}
            size={264}
            lineHeight={294}
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
            top: 970,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.14, 3.4)),
            transform: `translateY(${(1 - outExpo(seg(t, 3.14, 3.4))) * 18}px)`,
          }}
        >
          {p.delta}
        </Txt>
      </Chapter>

      {/* 03 进度条 */}
      <Chapter t={t} in={[3.68, 4.0]} out={[5.2, 5.5]}>
        <div style={{ position: 'absolute', left: 140, top: 620, width: 800, height: 420 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 180,
              width: 800,
              height: 34,
              borderRadius: 17,
              border: `1px solid ${rgba(T.line, 0.45)}`,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${pct * fp}%`,
                borderRadius: 17,
                background: `linear-gradient(90deg,${T.goldD},${T.goldC} 60%,${T.goldB})`,
                boxShadow: `0 0 24px ${rgba(T.line, 0.45)}`,
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 752,
              top: 150,
              width: 2,
              height: 94,
              background: rgba(T.pale, 0.8),
              opacity: outExpo(seg(t, 4.6, 4.86)),
            }}
          />
          <Txt
            size={25}
            color={rgba(T.pale, 0.85)}
            weight={300}
            letterSpacing={3}
            lineHeight={35}
            style={{
              position: 'absolute',
              left: 640,
              top: 96,
              width: 226,
              textAlign: 'center',
              opacity: outExpo(seg(t, 4.66, 4.94)),
            }}
          >
            {p.goalTxt || ''}
          </Txt>
          <div
            style={{
              position: 'absolute',
              top: 210,
              width: 800,
              textAlign: 'center',
              opacity: outExpo(seg(t, 3.86, 4.16)),
            }}
          >
            <GoldText theme={T} size={96} font="num" weight={700} lineHeight={130}>
              {Math.round(pct * fp)}%
            </GoldText>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 300,
              width: 800,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Txt
                key={i}
                size={23}
                color={i + 1 === (p.curMonth ?? 10) ? T.bright : rgba(T.soft, 0.5)}
                weight={i + 1 === (p.curMonth ?? 10) ? 600 : 300}
                lineHeight={32}
                style={{ opacity: outExpo(seg(t, 4.3 + i * 0.05, 4.52 + i * 0.05)) }}
              >
                {i + 1}月
              </Txt>
            ))}
          </div>
        </div>
      </Chapter>

      {/* 04 三项 */}
      <Chapter t={t} in={[5.52, 5.84]} out={[6.4, 6.7]}>
        <div
          style={{
            position: 'absolute',
            top: 620,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {p.stats.slice(0, 3).map((st, i) => {
            const st0 = 5.58 + i * 0.18;
            const e = outExpo(seg(t, st0, st0 + 0.32));
            const L = String(st.v).length;
            const fs = L <= 4 ? 82 : L === 5 ? 70 : 60;
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div
                    style={{
                      width: 1,
                      height: 175,
                      marginTop: 10,
                      background: `linear-gradient(180deg,${rgba(T.line, 0)},${rgba(
                        T.line,
                        0.55
                      )},${rgba(T.line, 0)})`,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 300,
                    textAlign: 'center',
                    opacity: e,
                    transform: `translateY(${(1 - e) * 36}px)`,
                  }}
                >
                  <GoldText theme={T} size={fs} font="num" weight={700} lineHeight={118}>
                    {st.v}
                  </GoldText>
                  <Txt
                    size={29}
                    color={rgba(T.mist, 1)}
                    weight={300}
                    letterSpacing={5}
                    lineHeight={41}
                    style={{ marginTop: 14 }}
                  >
                    {st.k}
                  </Txt>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Chapter>

      {/* 05 定版 */}
      <Chapter t={t} in={[6.54, 6.88]}>
        <Sfx name="sfx_pop" at={2.96} vol={0.28} />
        <EndCard theme={T} t={t} start={6.62} p={p} />
      </Chapter>
    </Stage>
  );
};
