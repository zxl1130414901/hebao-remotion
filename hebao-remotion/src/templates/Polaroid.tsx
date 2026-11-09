import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { StatsRow } from '../components/StatsRow';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 29 · 拍立得版
 * 叙事：拍立得甩入（双胶带固定）→ 便签贴上（图钉 + 大数字）→ 三项 → 定版
 */

const INK = '58,36,20'; // 相纸上的深棕墨色（固定，不随主题）

export const Polaroid: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 拍立得甩入 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        <Txt
          size={28}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={14}
          lineHeight={39}
          style={{
            position: 'absolute',
            top: 280,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.12, 0.4)),
          }}
        >
          OCTOBER MEMORY · 十月瞬间
        </Txt>
        {/* 底层相纸 */}
        <div
          style={{
            position: 'absolute',
            left: 280,
            top: 420,
            width: 620,
            height: 780,
            background: rgba(T.cream, 0.75),
            opacity: clamp01(seg(t, 0.2, 0.44)) * 0.9,
            transform: `rotate(4deg) translateY(${(1 - outExpo(seg(t, 0.2, 0.72))) * 90}px)`,
          }}
        />
        {/* 胶带 */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...(i === 0 ? { left: 120, top: 340 } : { right: 120, top: 336 }),
              width: 220,
              height: 56,
              background: rgba(T.mist, 0.35),
              borderLeft: '1px dashed rgba(255,255,255,.4)',
              borderRight: '1px dashed rgba(255,255,255,.4)',
              transform: `rotate(${i === 0 ? -38 : 36}deg)`,
              opacity: outExpo(seg(t, i === 0 ? 0.86 : 0.94, i === 0 ? 1.14 : 1.22)) * 0.9,
            }}
          />
        ))}
        {/* 主拍立得 */}
        <div
          style={{
            position: 'absolute',
            left: 210,
            top: 380,
            width: 660,
            height: 830,
            background: rgba(T.cream, 0.95),
            boxShadow: '0 30px 70px rgba(0,0,0,.5)',
            opacity: clamp01(seg(t, 0.34, 0.58)),
            transform: `rotate(${lerp(-9, -3, outBack(seg(t, 0.34, 1.0), 1.4))}deg) translateY(${
              (1 - outBack(seg(t, 0.34, 1.0), 1.4)) * 160
            }px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 26,
              top: 26,
              width: 608,
              height: 600,
              overflow: 'hidden',
              background: 'rgba(60,38,22,.08)',
            }}
          >
            <Img
              src={p.photo || staticFile('assets/portrait.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transform: `scale(${lerp(1.18, 1, outExpo(seg(t, 0.52, 1.3)))})`,
              }}
            />
          </div>
          <Txt
            size={34}
            color={`rgba(${INK},.85)`}
            weight={600}
            letterSpacing={4}
            lineHeight={48}
            style={{
              position: 'absolute',
              top: 668,
              width: 660,
              textAlign: 'center',
              opacity: outExpo(seg(t, 1.3, 1.58)),
            }}
          >
            2026.10 · {p.name}
          </Txt>
          <Txt
            size={22}
            color={`rgba(${INK},.55)`}
            weight={400}
            letterSpacing={3}
            lineHeight={31}
            style={{
              position: 'absolute',
              top: 730,
              width: 660,
              textAlign: 'center',
              opacity: outExpo(seg(t, 1.44, 1.72)),
            }}
          >
            向上生长的样子，真好看
          </Txt>
        </div>
      </Chapter>

      {/* 02 便签 */}
      <Chapter t={t} in={[2.46, 2.78]} out={[3.86, 4.16]}>
        <div
          style={{
            position: 'absolute',
            left: 230,
            top: 520,
            width: 620,
            height: 560,
            background: rgba(T.cream, 0.95),
            boxShadow: '0 24px 60px rgba(0,0,0,.45)',
            opacity: clamp01(seg(t, 2.52, 2.76)),
            transform: `rotate(1.6deg) translateY(${(1 - outBack(seg(t, 2.52, 3.06), 1.4)) * 120}px)`,
          }}
        >
          {/* 图钉 */}
          <div
            style={{
              position: 'absolute',
              left: 294,
              top: -16,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 36% 32%,rgba(255,255,255,.7),rgba(160,40,40,.9) 60%)',
              boxShadow: '0 6px 12px rgba(0,0,0,.4)',
            }}
          />
          <Txt
            size={30}
            color={`rgba(${INK},.65)`}
            weight={400}
            letterSpacing={6}
            lineHeight={42}
            style={{
              position: 'absolute',
              top: 96,
              width: 620,
              textAlign: 'center',
              opacity: outExpo(seg(t, 2.86, 3.14)),
            }}
          >
            {p.dlabel}
          </Txt>
          <div
            style={{
              position: 'absolute',
              top: 170,
              width: 620,
              textAlign: 'center',
              opacity: outExpo(seg(t, 2.96, 3.3)),
              transform: `scale(${lerp(1.15, 1, outBack(seg(t, 2.96, 3.36), 1.4))})`,
            }}
          >
            <Txt
              size={180}
              color={`rgba(${INK},.9)`}
              font="num"
              weight={700}
              letterSpacing={-3}
              lineHeight={220}
            >
              {p.premium.toFixed(hasDec ? 1 : 0)}
            </Txt>
          </div>
          <Txt
            size={26}
            color={`rgba(${INK},.6)`}
            weight={400}
            letterSpacing={4}
            lineHeight={36}
            style={{
              position: 'absolute',
              top: 414,
              width: 620,
              textAlign: 'center',
              opacity: outExpo(seg(t, 3.24, 3.48)),
            }}
          >
            万元
          </Txt>
          <Txt
            size={24}
            color={`rgba(${INK},.55)`}
            weight={400}
            letterSpacing={3}
            lineHeight={34}
            style={{
              position: 'absolute',
              top: 468,
              width: 620,
              textAlign: 'center',
              opacity: outExpo(seg(t, 3.38, 3.62)),
            }}
          >
            {p.delta}
          </Txt>
        </div>
      </Chapter>

      {/* 03 三项 */}
      <Chapter t={t} in={[4.3, 4.62]} out={[5.86, 6.16]}>
        <StatsRow theme={T} t={t} stats={p.stats} start={4.38} />
      </Chapter>

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <Sfx name="sfx_pop" at={0.88} vol={0.3} />
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
