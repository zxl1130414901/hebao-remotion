import React, { useMemo } from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { Txt } from '../components/GoldText';
import { NumChapter } from '../components/Chapters';
import { StatsRow } from '../components/StatsRow';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, makeRng, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 14 · 像素战报版
 * 叙事：人像被 72 格像素覆盖 → 像素随机消散显影 → 姓名 → 核心数字 → 三项 → 定版
 */
const CELL_N = 72;
const CELL_T0 = 0.28;
const CELL_SPAN = 1.15;

export const Mosaic: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const delays = useMemo(() => {
    const rnd = makeRng(20261124);
    return Array.from({ length: CELL_N }, () => rnd());
  }, []);

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 像素显影 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        <Txt
          size={30}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={14}
          lineHeight={42}
          style={{
            position: 'absolute',
            top: 280,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.12, 0.42)),
          }}
        >
          战绩定格 · PIXEL MOMENT
        </Txt>

        <div
          style={{
            position: 'absolute',
            left: 220,
            top: 420,
            width: 640,
            height: 760,
            overflow: 'hidden',
            border: `1px solid ${rgba(T.line, 0.45)}`,
            boxShadow: '0 26px 60px rgba(0,0,0,.4)',
            background: rgba(T.line, 0.1),
            opacity: clamp01(seg(t, 0.16, 0.4)),
            transform: `scale(${lerp(1.05, 1, outExpo(seg(t, 0.16, 1.9)))})`,
          }}
        >
          <Img
            src={p.photo || staticFile('assets/portrait.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(8,1fr)',
              gridTemplateRows: 'repeat(9,1fr)',
            }}
          >
            {delays.map((d, i) => {
              const d0 = CELL_T0 + d * CELL_SPAN;
              return (
                <div
                  key={i}
                  style={{
                    background: rgba(T.mist, 0.92),
                    opacity: 1 - clamp01(seg(t, d0, d0 + 0.16)),
                  }}
                />
              );
            })}
          </div>
        </div>

        <Txt
          size={76}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={14}
          lineHeight={104}
          style={{
            position: 'absolute',
            top: 1248,
            width: 1080,
            textAlign: 'center',
            opacity: clamp01(seg(t, 1.62, 1.8)),
            transform: `translateY(${(1 - outExpo(seg(t, 1.62, 1.94))) * 28}px)`,
          }}
        >
          {p.name}
        </Txt>
        <Txt
          size={30}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={6}
          lineHeight={42}
          style={{
            position: 'absolute',
            top: 1372,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 1.86, 2.14)),
          }}
        >
          {p.role}
        </Txt>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={36}
          style={{
            position: 'absolute',
            top: 1444,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.0, 2.26)),
          }}
        >
          {p.quote || '每一个像素，都是一次拜访的脚印'}
        </Txt>
      </Chapter>

      {/* 02 核心数字 */}
      <NumChapter theme={T} t={t} p={p} in={[2.46, 2.78]} out={[3.86, 4.16]} />

      {/* 03 三项 */}
      <Chapter t={t} in={[4.3, 4.62]} out={[5.86, 6.16]}>
        <StatsRow theme={T} t={t} stats={p.stats} start={4.38} />
      </Chapter>

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
