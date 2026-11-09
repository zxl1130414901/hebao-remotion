import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { VText } from '../components/VerticalText';
import { Seal } from '../components/Seal';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 02 · 竖排书法版
 * 叙事：竖排大字右起逐字落 + 方章 → 核心数字 → 竖排姓名 → 定版
 * 特点：全竖排右起，书卷气；无人物照片。
 */
export const Vertical: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const chars = Array.from(p.slogan || '荣耀登顶');

  const vsubP = outExpo(seg(t, 0.9, 1.3));
  const sealP = outBack(seg(t, 1.7, 2.1), 1.9);
  const nameP = outExpo(seg(t, 4.06, 4.5));
  const roleP = outExpo(seg(t, 4.24, 4.62));
  const quoteP = outExpo(seg(t, 4.42, 4.8));

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 竖排大字 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.3, 2.6]}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 180,
            width: 1080,
            height: 1150,
            display: 'flex',
            justifyContent: 'center',
            gap: 70,
          }}
        >
          <VText
            theme={T}
            text={p.claim || '恭贺十月佳绩频传'}
            size={44}
            weight={300}
            letterSpacing={16}
            lineHeight={1.2}
            color={rgba(T.soft, 0.8)}
            opacity={vsubP}
            height={900}
            style={{ paddingTop: 16 }}
          />
          <VText
            theme={T}
            text={p.slogan || '荣耀登顶'}
            size={190}
            weight={700}
            letterSpacing={34}
            lineHeight={1}
            gold
            perChar={(i) => {
              const st = 0.16 + i * 0.2;
              const pr = seg(t, st, st + 0.3);
              return {
                opacity: clamp01(pr * 2.2),
                transform: `scale(${lerp(1.6, 1, outBack(pr, 2.1))})`,
              };
            }}
          />
        </div>

        <Seal
          theme={T}
          text={p.sealChar || '泰'}
          left={806}
          top={1210}
          size={110}
          shape="square"
          fontSize={56}
          rotate={lerp(-14, 0, sealP)}
          p={sealP}
        />
      </Chapter>

      {/* 02 核心数字 */}
      <Chapter t={t} in={[2.44, 2.76]} out={[3.84, 4.14]}>
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
            opacity: outExpo(seg(t, 2.5, 2.74)),
            transform: `translateY(${(1 - outExpo(seg(t, 2.5, 2.74))) * 18}px)`,
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
            opacity: outExpo(seg(t, 2.62, 2.88)),
          }}
        >
          <NumRoll
            theme={T}
            target={p.premium}
            t={t}
            start={2.56}
            dur={1.08}
            size={276}
            lineHeight={306}
            letterSpacing={-4}
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
            opacity: outExpo(seg(t, 3.44, 3.7)),
            transform: `translateY(${(1 - outExpo(seg(t, 3.44, 3.7))) * 18}px)`,
          }}
        >
          {p.delta}
        </Txt>
      </Chapter>

      {/* 03 竖排姓名 */}
      <Chapter t={t} in={[3.98, 4.3]} out={[6.1, 6.4]}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 220,
            width: 1080,
            height: 1100,
            display: 'flex',
            justifyContent: 'center',
            gap: 90,
            alignItems: 'flex-start',
          }}
        >
          <VText
            theme={T}
            text={p.quote || ''}
            size={36}
            weight={300}
            letterSpacing={14}
            lineHeight={1.8}
            color={T.cream2}
            opacity={quoteP}
            style={{ paddingTop: 30 }}
          />
          <VText
            theme={T}
            text={p.role}
            size={32}
            weight={300}
            letterSpacing={12}
            lineHeight={1.6}
            color={rgba(T.soft, 0.85)}
            opacity={roleP}
            style={{ paddingTop: 14 }}
          />
          <VText
            theme={T}
            text={p.name}
            size={150}
            weight={600}
            letterSpacing={26}
            lineHeight={1.4}
            color="#fff"
            opacity={nameP}
            style={{ transform: `translateY(${(1 - nameP) * 40}px)` }}
          />
        </div>
      </Chapter>

      {/* 04 定版 */}
      <Chapter t={t} in={[6.54, 6.88]}>
        <Sfx name="sfx_pop" at={3.26} vol={0.28} />
        <EndCard theme={T} t={t} start={6.62} p={p} />
      </Chapter>
    </Stage>
  );
};
