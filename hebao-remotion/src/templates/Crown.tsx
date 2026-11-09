import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumChapter } from '../components/Chapters';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 21 · 王者加冕版
 * 叙事：旋转光芒 + 皇冠勾画 → NO.1 砸落 → 大数字 → 人物 → 定版
 */

export const Crown: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  /* 皇冠勾线时间表（与原版一致） */
  const parts: { id: string; a: number; b: number; d: string; gold?: boolean; circle?: boolean }[] = [
    { id: 'cp1', a: 0.3, b: 1.1, d: 'M110 380 L110 170 L230 280 L320 110 L410 280 L530 170 L530 380 Z' },
    { id: 'cp2', a: 0.95, b: 1.35, d: 'M110 380 L530 380' },
    { id: 'cp3', a: 1.05, b: 1.45, d: 'M126 416 L514 416' },
    { id: 'cg1', a: 1.15, b: 1.42, d: '', gold: true, circle: true },
    { id: 'cg2', a: 1.22, b: 1.5, d: '', gold: true, circle: true },
    { id: 'cg3', a: 1.29, b: 1.56, d: '', gold: true, circle: true },
    { id: 'cg4', a: 1.4, b: 1.86, d: 'M320 190 L336 226 L374 230 L346 256 L354 294 L320 274 L286 294 L294 256 L266 230 L304 226 Z', gold: true },
  ];
  const dash = (id: string) => {
    const pt = parts.find((x) => x.id === id)!;
    return (1 - outExpo(seg(t, pt.a, pt.b))).toFixed(3);
  };

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 皇冠勾画 + 光芒 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        {/* 旋转光芒（conic 条纹 + 径向遮罩） */}
        <div
          style={{
            position: 'absolute',
            left: 190,
            top: 290,
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: `repeating-conic-gradient(from 0deg,${rgba(T.line, 0.14)} 0deg 5deg,${rgba(
              T.line,
              0
            )} 5deg 20deg)`,
            maskImage: 'radial-gradient(circle,rgba(0,0,0,.9) 0%,rgba(0,0,0,.45) 45%,rgba(0,0,0,0) 72%)',
            WebkitMaskImage:
              'radial-gradient(circle,rgba(0,0,0,.9) 0%,rgba(0,0,0,.45) 45%,rgba(0,0,0,0) 72%)',
            opacity: clamp01(seg(t, 0.5, 1.0)) * (0.55 + 0.2 * Math.sin(t * 1.4)),
            transform: `rotate(${t * 9}deg)`,
          }}
        />
        {(() => {
          const rp = outExpo(seg(t, 0.14, 0.44));
          return (
            <GoldText
              theme={T}
              size={104}
              weight={700}
              lineHeight={140}
              letterSpacing={36}
              style={{
                position: 'absolute',
                top: 250,
                left: 0,
                width: 1080,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: rp,
                transform: `translateY(${(1 - rp) * 30}px)`,
              }}
            >
              王者加冕
            </GoldText>
          );
        })()}
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            top: 412,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.3, 0.58)),
          }}
        >
          CROWNING MOMENT · 十月之王
        </Txt>
        <div style={{ position: 'absolute', left: 270, top: 560, width: 540, height: 400 }}>
          <svg viewBox="0 0 640 480" width={540} height={400}>
            <path
              d={parts[0].d}
              pathLength={1}
              fill="none"
              stroke={rgba(T.pale, 0.95)}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={1}
              strokeDashoffset={dash('cp1')}
            />
            <path
              d={parts[1].d}
              pathLength={1}
              fill="none"
              stroke={rgba(T.pale, 0.95)}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={dash('cp2')}
            />
            <path
              d={parts[2].d}
              pathLength={1}
              fill="none"
              stroke={rgba(T.pale, 0.95)}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={dash('cp3')}
            />
            {[
              { id: 'cg1', cx: 110, cy: 158, r: 13 },
              { id: 'cg2', cx: 320, cy: 96, r: 15 },
              { id: 'cg3', cx: 530, cy: 158, r: 13 },
            ].map((c) => (
              <circle
                key={c.id}
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                pathLength={1}
                fill="none"
                stroke={T.goldB}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={1}
                strokeDashoffset={dash(c.id)}
              />
            ))}
            <path
              d={parts[6].d}
              pathLength={1}
              fill="none"
              stroke={T.goldB}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={dash('cg4')}
            />
          </svg>
        </div>
        {(() => {
          const pn = outBack(seg(t, 1.86, 2.24), 1.6);
          return (
            <GoldText
              theme={T}
              size={56}
              font="serif"
              weight={700}
              lineHeight={78}
              letterSpacing={6}
              style={{
                position: 'absolute',
                top: 1050,
                left: 0,
                width: 1080,
                textAlign: 'center',
                opacity: clamp01(seg(t, 1.86, 2.02)),
                transform: `scale(${lerp(1.6, 1, pn)})`,
              }}
            >
              NO.1
            </GoldText>
          );
        })()}
        <Txt
          size={28}
          color={rgba(T.soft, 0.8)}
          weight={300}
          letterSpacing={8}
          lineHeight={39}
          style={{
            position: 'absolute',
            top: 1130,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.06, 2.3)),
          }}
        >
          全省个人保费排名第一 · 截至 10 月末
        </Txt>
      </Chapter>

      {/* 02 大数字 */}
      <NumChapter theme={T} t={t} p={p} in={[2.46, 2.78]} out={[3.86, 4.16]} numSize={276} />

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.3, 4.62]} out={[5.86, 6.16]} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
