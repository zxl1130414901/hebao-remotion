import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { SloganChapter } from '../components/Chapters';
import { Rule } from '../components/Rule';
import { EndCard, Pill } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 18 · 领奖台版
 * 叙事：标语 → 领奖台 2-1-3 依次升起 → 冠军聚焦 → 定版
 * 领奖台：左 stats[0]（No.2）· 中 stats[2]（No.1 冠军位）· 右 stats[1]（No.3）
 */

const COLS: { key: string; left: number; h: number; numBottom: number; infoBottom: number; peak?: boolean }[] = [
  { key: 'p2', left: 60, h: 340, numBottom: 364, infoBottom: 470 },
  { key: 'p1', left: 390, h: 480, numBottom: 504, infoBottom: 610, peak: true },
  { key: 'p3', left: 720, h: 250, numBottom: 274, infoBottom: 380 },
];

export const Podium: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const st = p.stats;
  /* 领奖台映射：左 / 中 / 右。冠军位固定展示 No.1（与原版一致，避免与台号「1」矛盾） */
  const center = st[2] ? { ...st[2], v: 'No.1' } : undefined;
  const map = [st[0], center, st[1]];

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 标语 */}
      <SloganChapter theme={T} t={t} slogan={p.slogan} eyebrow="THE　PODIUM" in={[0.1, 0.44]} out={[2.0, 2.3]} />

      {/* 02 领奖台 2-1-3 依次升起 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[4.4, 4.7]}>
        <div style={{ position: 'absolute', left: 0, top: 420, width: 1080, height: 900 }}>
          {COLS.map((c, i) => {
            const st0 = 2.28 + i * 0.3;
            const bp = outExpo(seg(t, st0, st0 + 0.52));
            const np = outBack(seg(t, st0 + 0.3, st0 + 0.62), 1.8);
            const ip = outExpo(seg(t, st0 + 0.44, st0 + 0.76));
            const s = map[i];
            return (
              <div key={c.key} style={{ position: 'absolute', bottom: 0, left: c.left, width: 300, textAlign: 'center' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: 300,
                    height: c.h,
                    borderRadius: '8px 8px 0 0',
                    border: c.peak
                      ? `2px solid ${rgba(T.pale, 0.85)}`
                      : `1.5px solid ${rgba(T.line, 0.55)}`,
                    background: c.peak
                      ? `linear-gradient(180deg,${rgba(T.goldC, 0.55)},${rgba(T.goldD, 0.18)})`
                      : `linear-gradient(180deg,${rgba(T.line, 0.22)},${rgba(T.line, 0.05)})`,
                    boxShadow: c.peak ? `0 0 30px ${rgba(T.line, 0.35)}` : undefined,
                    transformOrigin: '50% 100%',
                    transform: `scaleY(${bp})`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: c.numBottom,
                    width: 300,
                    opacity: clamp01(seg(t, st0 + 0.3, st0 + 0.48)),
                    transform: `translateY(${(1 - np) * -40}px)`,
                  }}
                >
                  {c.peak ? (
                    <Txt size={76} color={T.bright} font="num" weight={700} lineHeight={90}>
                      1
                    </Txt>
                  ) : (
                    <GoldText theme={T} size={76} font="num" weight={700} lineHeight={90}>
                      {i === 0 ? '2' : '3'}
                    </GoldText>
                  )}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: c.infoBottom,
                    width: 300,
                    opacity: ip,
                    transform: `translateY(${(1 - ip) * 26}px)`,
                  }}
                >
                  <Txt
                    size={29}
                    color={rgba(T.mist, 1)}
                    weight={300}
                    letterSpacing={4}
                    lineHeight={40}
                  >
                    {s?.k ?? ''}
                  </Txt>
                  <div style={{ marginTop: 8 }}>
                    {c.peak ? (
                      <Txt size={62} color={T.bright} font="num" weight={600} lineHeight={84}>
                        {s?.v ?? ''}
                      </Txt>
                    ) : (
                      <GoldText theme={T} size={62} font="num" weight={600} lineHeight={84}>
                        {s?.v ?? ''}
                      </GoldText>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Chapter>

      {/* 03 冠军聚焦 */}
      <Chapter t={t} in={[4.54, 4.86]} out={[6.0, 6.3]}>
        <Rule theme={T} t={t} start={4.6} dur={0.34} left={290} top={600} width={500} opacity={0.6} />
        {(() => {
          const pn4 = outExpo(seg(t, 4.72, 5.06));
          return (
            <Txt
              size={116}
              color="#fff"
              weight={600}
              font="serif"
              letterSpacing={16}
              lineHeight={158}
              style={{
                position: 'absolute',
                top: 660,
                width: 1080,
                textAlign: 'center',
                opacity: pn4,
                transform: `translateY(${(1 - pn4) * 34}px)`,
              }}
            >
              {p.name}
            </Txt>
          );
        })()}
        <Txt
          size={32}
          color={rgba(T.soft, 0.88)}
          weight={300}
          letterSpacing={6}
          lineHeight={45}
          style={{
            position: 'absolute',
            top: 866,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 4.94, 5.24)),
          }}
        >
          {p.role}
        </Txt>
        <Pill theme={T} text={p.pill} top={968} p={outBack(seg(t, 5.14, 5.48), 1.5)} />
      </Chapter>

      {/* 04 定版 */}
      <Chapter t={t} in={[6.44, 6.78]}>
        <EndCard theme={T} t={t} start={6.52} p={p} />
      </Chapter>
    </Stage>
  );
};
