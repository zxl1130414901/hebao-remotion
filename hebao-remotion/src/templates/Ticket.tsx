import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { StatsRow } from '../components/StatsRow';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 06 · 荣誉存根版
 * 叙事：票券甩入（撕线 + 缺口 + 条码 + 存根联）→ 三项 → 人物 → 定版
 */
export const Ticket: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);

  const tp = outExpo(seg(t, 0.16, 0.98));
  const hasDec = p.premium % 1 !== 0;
  const L = String(p.premium.toFixed(hasDec ? 1 : 0)).replace('.', '').length;
  const numFs = L <= 4 ? 150 : L === 5 ? 130 : 112;

  const el = (a: number, b: number) => outExpo(seg(t, a, b));

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 票券 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 360,
            width: 760,
            height: 1150,
            opacity: clamp01(seg(t, 0.16, 0.46)),
            transform: `translateY(${(1 - tp) * 180}px) rotate(${lerp(4, 0, outExpo(seg(t, 0.16, 1.05)))}deg)`,
            background: `linear-gradient(170deg,${rgba(cream, 0.12)},${rgba(hexRgb(T.cream2), 0.06)})`,
            border: `1px solid ${rgba(T.line, 0.55)}`,
            boxShadow: '0 30px 70px rgba(0,0,0,.45)',
          }}
        >
          {/* 主联 */}
          <Txt
            size={22}
            color={rgba(T.mist, 0.85)}
            weight={300}
            letterSpacing={10}
            lineHeight={31}
            style={{
              position: 'absolute',
              top: 64,
              width: 760,
              textAlign: 'center',
              opacity: el(0.62, 0.9),
            }}
          >
            HONOR TICKET · 荣誉典藏
          </Txt>
          <GoldText
            theme={T}
            size={96}
            weight={700}
            letterSpacing={22}
            lineHeight={134}
            font="serif"
            style={{
              position: 'absolute',
              top: 120,
              width: 760,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              opacity: el(0.72, 1.04),
              transform: `translateY(${(1 - el(0.72, 1.04)) * 20}px)`,
            }}
          >
            {p.slogan || '十月战绩'}
          </GoldText>
          <Txt
            size={38}
            color="#fff"
            weight={500}
            letterSpacing={8}
            lineHeight={53}
            style={{ position: 'absolute', top: 286, width: 760, textAlign: 'center', opacity: el(0.92, 1.18) }}
          >
            {p.name}
          </Txt>
          <Txt
            size={25}
            color={rgba(T.soft, 0.8)}
            weight={300}
            letterSpacing={5}
            lineHeight={35}
            style={{ position: 'absolute', top: 352, width: 760, textAlign: 'center', opacity: el(1.0, 1.26) }}
          >
            {p.role}
          </Txt>
          <div
            style={{
              position: 'absolute',
              top: 470,
              width: 760,
              textAlign: 'center',
              opacity: el(1.12, 1.42),
              transform: `scale(${lerp(1.25, 1, outBack(seg(t, 1.12, 1.56), 1.5))})`,
            }}
          >
            <GoldText
              theme={T}
              size={numFs}
              font="num"
              weight={700}
              lineHeight={Math.round(numFs * 1.12)}
              letterSpacing={-2}
            >
              {p.premium.toFixed(hasDec ? 1 : 0)}
            </GoldText>
          </div>
          <Txt
            size={30}
            color={rgba(T.soft, 0.85)}
            weight={300}
            letterSpacing={6}
            lineHeight={42}
            style={{ position: 'absolute', top: 648, width: 760, textAlign: 'center', opacity: el(1.34, 1.6) }}
          >
            {p.dlabel} · 万元
          </Txt>
          {/* 条码 */}
          <div
            style={{
              position: 'absolute',
              left: 130,
              top: 716,
              width: 500,
              height: 56,
              opacity: el(1.5, 1.76),
              background: `repeating-linear-gradient(90deg,${rgba(cream, 0.85)} 0 3px,transparent 3px 6px,${rgba(
                cream,
                0.85
              )} 6px 11px,transparent 11px 14px,${rgba(cream, 0.85)} 14px 16px,transparent 16px 21px)`,
            }}
          />

          {/* 撕线 + 缺口 */}
          <div style={{ position: 'absolute', left: 0, top: 800, width: 760, height: 2 }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                borderTop: `3px dashed ${rgba(T.line, 0.55)}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -20,
                top: -19,
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: T.bg[1],
                border: `1px solid ${rgba(T.line, 0.5)}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -20,
                top: -19,
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: T.bg[1],
                border: `1px solid ${rgba(T.line, 0.5)}`,
              }}
            />
          </div>

          {/* 存根联 */}
          <Txt
            size={24}
            color={rgba(T.mist, 0.85)}
            weight={300}
            letterSpacing={10}
            lineHeight={34}
            style={{ position: 'absolute', top: 866, width: 760, textAlign: 'center', opacity: el(1.62, 1.88) }}
          >
            STUB · 存根联
          </Txt>
          <Txt
            size={40}
            color={T.bright}
            weight={600}
            letterSpacing={8}
            lineHeight={56}
            style={{ position: 'absolute', top: 914, width: 760, textAlign: 'center', opacity: el(1.7, 1.96) }}
          >
            NO. 2026-1028
          </Txt>
          <Txt
            size={26}
            color={rgba(T.soft, 0.8)}
            weight={300}
            letterSpacing={5}
            lineHeight={36}
            style={{ position: 'absolute', top: 992, width: 760, textAlign: 'center', opacity: el(1.78, 2.04) }}
          >
            {p.dateText} · 长久保存
          </Txt>
          <Txt
            size={22}
            color={rgba(T.mist, 0.85)}
            weight={300}
            letterSpacing={3}
            lineHeight={31}
            style={{ position: 'absolute', top: 1052, width: 760, textAlign: 'center', opacity: el(1.86, 2.12) }}
          >
            {p.brand}
          </Txt>
        </div>
      </Chapter>

      {/* 02 三项 */}
      <Chapter t={t} in={[2.46, 2.78]} out={[3.86, 4.16]}>
        <StatsRow theme={T} t={t} stats={p.stats} start={2.54} />
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.3, 4.62]} out={[5.86, 6.16]} photoTop={200} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <Sfx name="sfx_chime" at={1.44} vol={0.3} />
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
