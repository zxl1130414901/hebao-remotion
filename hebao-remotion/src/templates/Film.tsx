import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { StatsRow } from '../components/StatsRow';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 30 · 胶片时刻版
 * 叙事：胶片带升起（三格逐格亮起：照片 / 保费 / 达成率）→ 三项 → 人物 → 定版
 */

const CELL_LEFT = [26, 330, 634];

export const Film: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 胶片逐格亮起 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        <Txt
          size={30}
          color={rgba(T.soft, 0.8)}
          weight={300}
          letterSpacing={14}
          lineHeight={42}
          style={{
            position: 'absolute',
            top: 300,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.12, 0.42)),
          }}
        >
          胶片时刻
        </Txt>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={8}
          lineHeight={34}
          style={{
            position: 'absolute',
            top: 356,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.24, 0.52)),
          }}
        >
          FILM MOMENTS · 2026.10
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 70,
            top: 640,
            width: 940,
            height: 560,
            background: 'rgba(10,10,12,.55)',
            border: `1px solid ${rgba(T.line, 0.35)}`,
            boxShadow: '0 30px 70px rgba(0,0,0,.5)',
            opacity: clamp01(seg(t, 0.22, 0.48)),
            transform: `translateY(${(1 - outExpo(seg(t, 0.22, 0.8))) * 120}px)`,
          }}
        >
          {/* 齿孔条 */}
          {[14, 522].map((top, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 24,
                right: 24,
                top,
                height: 24,
                background: `repeating-linear-gradient(90deg,transparent 0 18px,${rgba(
                  T.mist,
                  0.55
                )} 18px 42px,transparent 42px 60px)`,
              }}
            />
          ))}
          {/* 三格 */}
          {CELL_LEFT.map((left, i) => {
            const st = 0.66 + i * 0.3;
            const pr = outExpo(seg(t, st, st + 0.3));
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left,
                  top: 70,
                  width: 280,
                  height: 420,
                  overflow: 'hidden',
                  background: rgba(T.mist, 0.06),
                  opacity: pr,
                  transform: `scale(${lerp(1.12, 1, pr)})`,
                }}
              >
                {i === 0 && (
                  <Img
                    src={p.photo || staticFile('assets/portrait.png')}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transform: `scale(${lerp(1.15, 1, outExpo(seg(t, 0.66, 1.5)))})`,
                    }}
                  />
                )}
                {i === 1 && (
                  <>
                    <GoldText
                      theme={T}
                      size={96}
                      font="num"
                      weight={700}
                      lineHeight={120}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 120,
                        width: 280,
                        textAlign: 'center',
                      }}
                    >
                      {p.premium.toFixed(hasDec ? 1 : 0)}
                    </GoldText>
                    <Txt
                      size={26}
                      color={rgba(T.cream, 0.9)}
                      weight={400}
                      letterSpacing={4}
                      lineHeight={36}
                      style={{ position: 'absolute', left: 0, top: 270, width: 280, textAlign: 'center' }}
                    >
                      {p.dlabel}
                    </Txt>
                    <Txt
                      size={22}
                      color={rgba(T.mist, 0.85)}
                      weight={300}
                      letterSpacing={3}
                      lineHeight={31}
                      style={{ position: 'absolute', left: 0, top: 330, width: 280, textAlign: 'center' }}
                    >
                      OCT · 2026
                    </Txt>
                  </>
                )}
                {i === 2 && (
                  <>
                    <GoldText
                      theme={T}
                      size={96}
                      font="num"
                      weight={700}
                      lineHeight={120}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 120,
                        width: 280,
                        textAlign: 'center',
                      }}
                    >
                      {p.stats[1]?.v ?? '218%'}
                    </GoldText>
                    <Txt
                      size={26}
                      color={rgba(T.cream, 0.9)}
                      weight={400}
                      letterSpacing={4}
                      lineHeight={36}
                      style={{ position: 'absolute', left: 0, top: 270, width: 280, textAlign: 'center' }}
                    >
                      {p.stats[1]?.k ?? '目标达成率'}
                    </Txt>
                    <Txt
                      size={22}
                      color={rgba(T.mist, 0.85)}
                      weight={300}
                      letterSpacing={3}
                      lineHeight={31}
                      style={{ position: 'absolute', left: 0, top: 330, width: 280, textAlign: 'center' }}
                    >
                      SPRINT · 冲刺
                    </Txt>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Chapter>

      {/* 02 三项 */}
      <Chapter t={t} in={[2.46, 2.78]} out={[3.86, 4.16]}>
        <StatsRow theme={T} t={t} stats={p.stats} start={2.54} />
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.3, 4.62]} out={[5.86, 6.16]} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <Sfx name="sfx_chime" at={0.70} vol={0.3} />
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
