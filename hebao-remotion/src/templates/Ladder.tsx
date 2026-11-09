import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { Txt } from '../components/GoldText';
import { NumChapter } from '../components/Chapters';
import { StatsRow } from '../components/StatsRow';
import { EndCard } from '../components/EndCard';
import { PhotoCard } from '../components/PhotoCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 31 · 进阶阶梯版
 * 叙事：四级台阶逐级升起 + 人物压台阶顶 → 大数字 → 三项 → 定版
 */

const STEPS = [
  { left: 70, top: 1290, w: 230, h: 110, lab: '一月 · 起步', peak: false },
  { left: 300, top: 1180, w: 230, h: 220, lab: '季度 · 破百', peak: false },
  { left: 530, top: 1070, w: 230, h: 330, lab: '连续达成', peak: false },
  { left: 760, top: 960, w: 250, h: 440, lab: '十月 · 登顶', peak: true },
];

export const Ladder: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 台阶 + 人物 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        {(() => {
          const lt = outExpo(seg(t, 0.12, 0.44));
          const ln = outExpo(seg(t, 0.72, 1.1));
          const pp = outBack(seg(t, 1.28, 1.8), 1.6);
          return (
            <>
              <Txt
                size={76}
                color="#fff"
                weight={700}
                font="serif"
                letterSpacing={20}
                lineHeight={104}
                style={{
                  position: 'absolute',
                  top: 280,
                  width: 1080,
                  textAlign: 'center',
                  opacity: lt,
                  transform: `translateY(${(1 - lt) * 24}px)`,
                }}
              >
                拾级而上
              </Txt>
              <Txt
                size={26}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={10}
                lineHeight={36}
                style={{
                  position: 'absolute',
                  top: 390,
                  width: 1080,
                  textAlign: 'center',
                  opacity: outExpo(seg(t, 0.26, 0.54)),
                }}
              >
                STEP BY STEP · 每一步都算数
              </Txt>
              {STEPS.map((s, i) => {
                const st = 0.34 + i * 0.22;
                const pr = outExpo(seg(t, st, st + 0.4));
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: s.left,
                      top: s.top,
                      width: s.w,
                      height: s.h,
                      background: s.peak
                        ? `linear-gradient(180deg,${rgba(T.goldC, 0.34)},${rgba(T.goldD, 0.14)})`
                        : `linear-gradient(180deg,${rgba(T.line, 0.16)},${rgba(T.line, 0.05)})`,
                      border: `1px solid ${s.peak ? rgba(T.goldB, 0.6) : rgba(T.line, 0.35)}`,
                      borderBottom: `3px solid ${rgba(T.line, 0.5)}`,
                      transformOrigin: '50% 100%',
                      transform: `scaleY(${Math.max(0.001, pr)})`,
                    }}
                  >
                    <Txt
                      size={22}
                      color={s.peak ? rgba(T.bright, 0.95) : rgba(T.mist, 0.6)}
                      weight={s.peak ? 500 : 300}
                      letterSpacing={4}
                      lineHeight={31}
                      style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 14,
                        width: '100%',
                        textAlign: 'center',
                        opacity: clamp01(seg(t, st + 0.22, st + 0.42)),
                      }}
                    >
                      {s.lab}
                    </Txt>
                  </div>
                );
              })}
              <Txt
                size={96}
                color="#fff"
                weight={600}
                font="serif"
                letterSpacing={12}
                lineHeight={130}
                style={{
                  position: 'absolute',
                  left: 70,
                  top: 640,
                  width: 640,
                  textAlign: 'left',
                  opacity: ln,
                  transform: `translateY(${(1 - ln) * 30}px)`,
                }}
              >
                {p.name}
              </Txt>
              <Txt
                size={30}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={5}
                lineHeight={42}
                style={{
                  position: 'absolute',
                  left: 74,
                  top: 790,
                  width: 640,
                  textAlign: 'left',
                  opacity: outExpo(seg(t, 0.9, 1.2)),
                }}
              >
                {p.role}
              </Txt>
              <Txt
                size={24}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={3}
                lineHeight={34}
                style={{
                  position: 'absolute',
                  left: 74,
                  top: 856,
                  width: 640,
                  textAlign: 'left',
                  opacity: outExpo(seg(t, 1.04, 1.34)),
                }}
              >
                从第一通电话，到全省领奖台
              </Txt>
              <PhotoCard
                theme={T}
                src={p.photo}
                left={766}
                top={610}
                width={238}
                height={300}
                style={{
                  opacity: clamp01(seg(t, 1.28, 1.46)),
                  transform: `translateY(${(1 - pp) * -60}px)`,
                }}
              />
            </>
          );
        })()}
      </Chapter>

      {/* 02 大数字 */}
      <NumChapter theme={T} t={t} p={p} in={[2.46, 2.78]} out={[3.86, 4.16]} numSize={276} />

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
