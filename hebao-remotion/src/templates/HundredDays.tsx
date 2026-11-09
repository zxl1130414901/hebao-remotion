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

const TICKS = Array.from({ length: 101 }, (_, i) => i);

/**
 * 64 · 新人百日版
 * 叙事：横向刻度尺从 1 走到 100 → 百天里程碑 → 三段成长记录 → 人 → 定版
 * 与旧模板差异：横向量尺取代「一个大数字居中」，中间章是成长记录而非业绩条目。
 */
export const HundredDays: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const run = outExpo(seg(t, 0.46, 2.16));
  const px = 880 * run;

  const growth = [
    { no: '01', k: '累计出单', v: '38 件', d: '第一个月 3 件，第十个月 9 件' },
    { no: '02', k: '服务客户', v: '126 人', d: '从邻居开始，到陌生转介绍' },
    { no: '03', k: '月度达标', v: '7 次', d: '第 4 个月起，稳定不掉队' },
  ];

  return (
    <Stage theme={T} brand={p.brand} bottomtag="100　DAYS　JOURNEY">
      {/* 01 刻度尺走到 100 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[2.62, 2.9]}>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 268,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.1, 0.4)),
          }}
        >
          DAY　{String(Math.round(run * 100)).padStart(3, '0')}　IN
        </Txt>
        <Txt
          size={56}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={10}
          lineHeight={78}
          style={{
            position: 'absolute',
            left: 0,
            top: 316,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.14, 0.46)),
          }}
        >
          入职第一程
        </Txt>

        {/* 尺 */}
        <div style={{ position: 'absolute', left: 100, top: 640, width: 880, height: 120 }}>
          {TICKS.map((i) => {
            const major = i % 10 === 0;
            const reached = i <= run * 100;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: (i / 100) * 880,
                  bottom: 62,
                  width: major ? 2.4 : 1,
                  height: major ? 30 : 13,
                  background: reached
                    ? rgba(gold, major ? 0.95 : 0.55)
                    : rgba(T.line, 0.14),
                  transform: 'translateX(-50%)',
                }}
              />
            );
          })}
          {/* 基线 */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 60,
              width: 880,
              height: 1.4,
              background: `linear-gradient(90deg, ${rgba(T.line, 0.14)}, ${rgba(T.line, 0.5)}, ${rgba(T.line, 0.14)})`,
            }}
          />
          {/* 刻字 */}
          {[0, 25, 50, 75, 100].map((i) => (
            <Txt
              key={i}
              size={22}
              color={rgba(T.mist, i <= run * 100 ? 0.66 : 0.26)}
              font="num"
              letterSpacing={2}
              lineHeight={28}
              style={{ position: 'absolute', left: (i / 100) * 880 - 12, bottom: 24 }}
            >
              {i}
            </Txt>
          ))}
          {/* 指针 */}
          <div
            style={{
              position: 'absolute',
              left: px,
              bottom: 46,
              width: 3,
              height: 74,
              marginLeft: -1.5,
              background: `linear-gradient(180deg, ${T.goldA}, ${rgba(gold, 0.2)})`,
              boxShadow: `0 0 20px ${rgba(gold, 0.75)}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: px,
              bottom: 118,
              width: 18,
              height: 18,
              marginLeft: -9,
              borderRadius: '50%',
              background: T.goldA,
              boxShadow: `0 0 26px ${rgba(gold, 0.9)}`,
            }}
          />
        </div>

        {/* 百天大字 */}
        <div style={{ position: 'absolute', left: 0, top: 856, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={236}
            weight={700}
            font="num"
            lineHeight={268}
            letterSpacing={-4}
            style={{
              opacity: outExpo(seg(t, 2.02, 2.32)),
              transform: `scale(${lerp(1.14, 1, outBack(seg(t, 2.02, 2.44), 1.9))})`,
              filter: `drop-shadow(0 12px 36px ${rgba(gold, 0.3)})`,
            }}
          >
            {p.hero || '100'}
          </GoldText>
          <Txt
            size={66}
            color={rgba(cream, 0.9)}
            weight={500}
            font="serif"
            letterSpacing={10}
            lineHeight={86}
            style={{ marginTop: -26, opacity: outExpo(seg(t, 2.18, 2.48)) }}
          >
            天
          </Txt>
        </div>
        <Txt
          size={31}
          color={rgba(cream, 0.8)}
          font="serif"
          letterSpacing={7}
          lineHeight={44}
          style={{
            position: 'absolute',
            left: 0,
            top: 1224,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.3, 2.6)),
          }}
        >
          {p.subValue || '从递出第一张名片，到客户主动来找'}
        </Txt>
      </Chapter>

      {/* 02 三段成长记录 */}
      <Chapter t={t} in={[2.7, 3.0]} out={[4.66, 4.94]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 356,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.78, 3.08)),
          }}
        >
          这 一 百 天
        </Txt>

        {growth.map((g, i) => {
          const s0 = 2.9 + i * 0.26;
          const e = outExpo(seg(t, s0, s0 + 0.38));
          return (
            <div
              key={g.no}
              style={{
                position: 'absolute',
                left: 120,
                top: 460 + i * 292,
                width: 840,
                opacity: e,
                transform: `translateX(${(1 - e) * 40}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
                <Txt
                  size={26}
                  color={rgba(gold, 0.85)}
                  weight={700}
                  font="num"
                  letterSpacing={2}
                  lineHeight={36}
                >
                  {g.no}
                </Txt>
                <Txt size={36} color={rgba(cream, 0.9)} weight={400} letterSpacing={6} lineHeight={50}>
                  {g.k}
                </Txt>
                <GoldText
                  theme={T}
                  size={62}
                  weight={700}
                  font="num"
                  lineHeight={76}
                  style={{ marginLeft: 'auto' }}
                >
                  {g.v}
                </GoldText>
              </div>
              <div
                style={{
                  marginTop: 16,
                  height: 1,
                  background: `linear-gradient(90deg, ${rgba(T.line, 0.36)}, ${rgba(T.line, 0.02)})`,
                }}
              />
              <Txt
                size={25}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={2}
                lineHeight={38}
                style={{ marginTop: 14 }}
              >
                {g.d}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.78, 5.08]} out={[6.12, 6.4]} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.42, 6.76]}>
        <Sfx name="sfx_chime" at={2.32} vol={0.3} />
        <EndCard theme={T} t={t} start={6.48} p={p} />
      </Chapter>
    </Stage>
  );
};
