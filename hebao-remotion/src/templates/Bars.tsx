import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { PhotoCard } from '../components/PhotoCard';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 09 · 柱状战力版
 * 叙事：标语 → 人物×核心数字 → 五柱逐根升起（峰值高亮）→ 定版
 */
const BARS = [
  { h: 0.56, v: '42.6', lab: '第一周' },
  { h: 0.74, v: '58.3', lab: '第二周' },
  { h: 0.66, v: '51.7', lab: '第三周' },
  { h: 0.86, v: '66.4', lab: '第四周' },
  { h: 1.0, v: '67.5', lab: '峰值周', peak: true },
];
const CH = 560;

export const Bars: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const peb = outExpo(seg(t, 0.14, 0.4));
  const psg = outBack(seg(t, 0.28, 0.68), 1.8);
  const psgText = clamp01(seg(t, 0.28, 0.52));

  const pp2 = outBack(seg(t, 2.2, 2.56), 1.4);
  const pn2 = outExpo(seg(t, 2.34, 2.66));
  const pr2 = outExpo(seg(t, 2.48, 2.78));
  const pm2 = outBack(seg(t, 2.6, 2.92), 1.5);

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
          style={{ position: 'absolute', top: 540, width: 1080, textAlign: 'center', opacity: peb }}
        >
          WEEKLY　MOMENTUM
        </Txt>
        <GoldText
          theme={T}
          size={140}
          weight={700}
          letterSpacing={24}
          lineHeight={190}
          font="serif"
          style={{
            position: 'absolute',
            top: 620,
            width: 1080,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: psgText,
            transform: `scale(${lerp(1.3, 1, psg)})`,
          }}
        >
          {p.slogan}
        </GoldText>
      </Chapter>

      {/* 02 人物 × 核心数字 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[4.1, 4.4]}>
        <PhotoCard
          theme={T}
          src={p.photo}
          left={150}
          top={510}
          width={300}
          height={390}
          style={{
            opacity: clamp01(seg(t, 2.2, 2.38)),
            transform: `scale(${lerp(0.92, 1, pp2)})`,
          }}
        />
        <Txt
          size={64}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={8}
          lineHeight={92}
          style={{
            position: 'absolute',
            left: 520,
            top: 566,
            width: 430,
            textAlign: 'left',
            opacity: pn2,
            transform: `translateY(${(1 - pn2) * 26}px)`,
          }}
        >
          {p.name}
        </Txt>
        <Txt
          size={28}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={39}
          style={{ position: 'absolute', left: 522, top: 672, width: 430, opacity: pr2 }}
        >
          {p.role}
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 522,
            top: 728,
            height: 60,
            borderRadius: 30,
            padding: '0 34px',
            border: `1px solid ${rgba(T.line, 0.5)}`,
            background: rgba(T.line, 0.12),
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            opacity: clamp01(seg(t, 2.6, 2.76)),
            transform: `scale(${lerp(0.92, 1, pm2)})`,
            transformOrigin: '0% 50%',
          }}
        >
          <Txt size={24} color={T.bright} weight={500} letterSpacing={3} lineHeight={33}>
            {p.pill}
          </Txt>
        </div>

        <Txt
          size={30}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={6}
          lineHeight={42}
          style={{
            position: 'absolute',
            top: 972,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.7, 2.94)),
            transform: `translateY(${(1 - outExpo(seg(t, 2.7, 2.94))) * 18}px)`,
          }}
        >
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 1032,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: outExpo(seg(t, 2.82, 3.08)),
          }}
        >
          <NumRoll
            theme={T}
            target={p.premium}
            t={t}
            start={2.76}
            dur={1.08}
            size={150}
            lineHeight={168}
            unit="万元"
            unitSize={40}
            unitColor={rgba(T.soft, 0.92)}
          />
        </div>
        <Txt
          size={27}
          color={rgba(T.soft, 0.85)}
          letterSpacing={4}
          lineHeight={38}
          style={{
            position: 'absolute',
            top: 1236,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.5, 3.76)),
            transform: `translateY(${(1 - outExpo(seg(t, 3.5, 3.76))) * 18}px)`,
          }}
        >
          {p.delta}
        </Txt>
      </Chapter>

      {/* 03 柱状图 */}
      <Chapter t={t} in={[4.42, 4.74]} out={[6.24, 6.54]}>
        <div style={{ position: 'absolute', left: 140, top: 520, width: 800, height: 760 }}>
          {BARS.map((b, i) => {
            const st0 = 4.6 + i * 0.2;
            const pr = outExpo(seg(t, st0, st0 + 0.44));
            const val = p.stats[i]?.v ?? b.v;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 24 + i * 158,
                  bottom: 70,
                  width: 104,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: clamp01(seg(t, st0, st0 + 0.14)),
                }}
              >
                <Txt
                  size={36}
                  color={T.bright}
                  weight={600}
                  font="num"
                  lineHeight={50}
                  style={{
                    marginBottom: 14,
                    opacity: clamp01(seg(t, st0 + 0.3, st0 + 0.52)),
                  }}
                >
                  {val}
                </Txt>
                <div
                  style={{
                    width: 104,
                    height: Math.round(CH * b.h * pr),
                    borderRadius: '6px 6px 0 0',
                    background: b.peak
                      ? `linear-gradient(180deg,${T.goldB} 0%,${T.goldC} 55%,${T.goldD} 100%)`
                      : `linear-gradient(180deg,${rgba(T.line, 0.62)},${rgba(T.line, 0.14)})`,
                    boxShadow: b.peak ? `0 0 26px ${rgba(T.line, 0.4)}` : undefined,
                  }}
                />
                <Txt
                  size={27}
                  color={rgba(T.soft, 0.85)}
                  weight={300}
                  letterSpacing={3}
                  lineHeight={38}
                  style={{ position: 'absolute', bottom: -52, whiteSpace: 'nowrap' }}
                >
                  {b.lab}
                </Txt>
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 70,
              width: 800,
              height: 1,
              background: `linear-gradient(90deg,${rgba(T.line, 0)},${rgba(T.line, 0.5)},${rgba(
                T.line,
                0
              )})`,
              transform: `scaleX(${outExpo(seg(t, 4.48, 4.78))})`,
            }}
          />
        </div>
      </Chapter>

      {/* 05 定版 */}
      <Chapter t={t} in={[6.68, 7.02]}>
        <Sfx name="sfx_pop" at={3.46} vol={0.28} />
        <EndCard theme={T} t={t} start={6.76} p={p} />
      </Chapter>
    </Stage>
  );
};
