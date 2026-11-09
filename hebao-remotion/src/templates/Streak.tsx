import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/** 本月 28 天里，哪 4 天没出单（固定值，保证渲染确定性） */
const OFF_DAYS = [3, 11, 19, 26];
const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

/**
 * 62 · 连续达成版
 * 叙事：日历逐日点亮 → 一条不断档的连击 → 火焰连击数 → 人 → 定版
 * 与旧模板差异：讲的是「持续性」而不是「一次性爆发」，主角是天数。
 */
export const Streak: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const flame = 0.9 + 0.1 * Math.sin(t * 7.2) + 0.05 * Math.sin(t * 13.1);
  const facts = [
    { k: '本月出单天数', v: '24 天' },
    { k: '历史最高连击', v: '21 天' },
    { k: '整月断档', v: '0 次' },
  ];

  return (
    <Stage theme={T} brand={p.brand} bottomtag="CONSISTENCY　·　STREAK">
      {/* 01 日历点亮 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[2.56, 2.84]}>
        <Txt
          size={62}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={12}
          lineHeight={84}
          style={{
            position: 'absolute',
            left: 0,
            top: 300,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.1, 0.42)),
            transform: `translateY(${(1 - outExpo(seg(t, 0.1, 0.42))) * 24}px)`,
          }}
        >
          日日不断
        </Txt>
        <Txt
          size={25}
          color={rgba(T.mist, 0.85)}
          letterSpacing={9}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 392,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.24, 0.54)),
          }}
        >
          OCTOBER　·　28 DAYS　ON　DUTY
        </Txt>

        <div style={{ position: 'absolute', left: 154, top: 478, width: 772 }}>
          {DAYS.map((d, i) => {
            const row = Math.floor(i / 7);
            const col = i % 7;
            const off = OFF_DAYS.includes(d);
            const s0 = 0.52 + i * 0.052;
            const e = outExpo(seg(t, s0, s0 + 0.24));
            return (
              <div
                key={d}
                style={{
                  position: 'absolute',
                  left: col * 112,
                  top: row * 112,
                  width: 100,
                  height: 100,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: off
                    ? rgba(T.mask, 0.45)
                    : `linear-gradient(158deg, ${rgba(gold, 0.92)} 0%, ${rgba(hexRgb(T.goldC), 0.9)} 100%)`,
                  border: `1px solid ${off ? rgba(T.line, 0.16) : rgba(T.goldA, 0.7)}`,
                  boxShadow: off ? 'none' : `0 6px 22px ${rgba(gold, 0.22)}, inset 0 1px 0 rgba(255,255,255,0.35)`,
                  opacity: off ? outExpo(seg(t, s0, s0 + 0.2)) * 0.75 : e,
                  transform: `scale(${off ? 1 : lerp(0.82, 1, outBack(seg(t, s0, s0 + 0.3), 2.2))})`,
                }}
              >
                <Txt
                  size={32}
                  color={off ? rgba(T.mist, 0.42) : rgba(T.archbg, 0.9)}
                  weight={700}
                  font="num"
                  lineHeight={40}
                >
                  {d}
                </Txt>
                {off && (
                  <div
                    style={{
                      position: 'absolute',
                      width: 54,
                      height: 1.5,
                      background: rgba(T.line, 0.22),
                      transform: 'rotate(-38deg)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={5}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 986,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 1.9, 2.2)),
          }}
        >
          出单 24 天　·　休整 4 天　·　从未连续缺勤
        </Txt>
      </Chapter>

      {/* 02 连击数 */}
      <Chapter t={t} in={[2.62, 2.92]} out={[4.5, 4.78]}>
        <Sfx name="sfx_chime" at={2.86} vol={0.36} />
        <svg
          width={132}
          height={158}
          viewBox="0 0 132 158"
          style={{
            position: 'absolute',
            left: 474,
            top: 356,
            opacity: outExpo(seg(t, 2.7, 3.0)),
            transform: `scale(${flame.toFixed(3)})`,
            filter: `drop-shadow(0 10px 34px ${rgba(gold, 0.5)})`,
          }}
        >
          <path
            d="M66 8 C 96 50, 118 68, 118 100 C 118 132, 95 152, 66 152 C 37 152, 14 132, 14 100 C 14 74, 30 56, 46 34 C 50 52, 58 60, 66 66 C 74 48, 72 26, 66 8 Z"
            fill={`url(#flameGrad)`}
          />
          <defs>
            <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.goldA} />
              <stop offset="52%" stopColor={T.goldC} />
              <stop offset="100%" stopColor={`rgb(${hexRgb(T.glow2)})`} />
            </linearGradient>
          </defs>
        </svg>

        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={13}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 570,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.74, 3.04)),
          }}
        >
          连 续 达 成
        </Txt>
        <div style={{ position: 'absolute', left: 0, top: 612, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={272}
            weight={700}
            font="num"
            lineHeight={302}
            style={{
              opacity: outExpo(seg(t, 2.68, 2.96)),
              transform: `scale(${lerp(1.18, 1, outBack(seg(t, 2.68, 3.1), 1.9))})`,
            }}
          >
            {p.hero || '21'}
          </GoldText>
          <Txt
            size={72}
            color={rgba(cream, 0.92)}
            weight={500}
            font="serif"
            letterSpacing={6}
            lineHeight={90}
            style={{ marginTop: -34, opacity: outExpo(seg(t, 2.86, 3.16)) }}
          >
            天
          </Txt>
        </div>
        <Txt
          size={32}
          color={rgba(cream, 0.84)}
          font="serif"
          letterSpacing={7}
          lineHeight={46}
          style={{
            position: 'absolute',
            left: 0,
            top: 1006,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.0, 3.32)),
          }}
        >
          {p.subValue || '一天不落 · 一天不松'}
        </Txt>

        {facts.map((f, i) => {
          const s0 = 3.16 + i * 0.18;
          const e = outExpo(seg(t, s0, s0 + 0.34));
          return (
            <div
              key={f.k}
              style={{
                position: 'absolute',
                left: 150,
                top: 1130 + i * 112,
                width: 780,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: `1px solid ${rgba(T.line, 0.2)}`,
                paddingBottom: 20,
                opacity: e,
                transform: `translateY(${(1 - e) * 24}px)`,
              }}
            >
              <Txt size={30} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={6} lineHeight={42}>
                {f.k}
              </Txt>
              <Txt size={42} color={T.bright} weight={700} font="num" lineHeight={54}>
                {f.v}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.64, 4.94]} out={[6.06, 6.34]} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.36, 6.7]}>
        <EndCard theme={T} t={t} start={6.42} p={p} />
      </Chapter>
    </Stage>
  );
};
