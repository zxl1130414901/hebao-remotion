import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { Txt } from '../components/GoldText';
import { SloganChapter, PersonNumChapter } from '../components/Chapters';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 11 · 全勤日历版
 * 叙事：标语 → 人物×核心数字 → 月历逐格点亮（峰值日星标）→ 定版
 */
const ON_DAYS = new Set([1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28, 29, 30]);
const STAR_DAY = 30;
const BLANKS = 4; // 周四开头

export const Calendar: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 标语 */}
      <SloganChapter theme={T} t={t} slogan={p.slogan} eyebrow="FULL　ATTENDANCE　·　OCTOBER" in={[0.1, 0.44]} out={[2.0, 2.3]} />

      {/* 02 人物×数字 */}
      <PersonNumChapter theme={T} t={t} p={p} in={[2.14, 2.46]} out={[4.1, 4.4]} />

      {/* 03 月历 */}
      <Chapter t={t} in={[4.42, 4.74]} out={[6.2, 6.5]}>
        <div style={{ position: 'absolute', left: 190, top: 540, width: 700 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 6px 18px',
              opacity: outExpo(seg(t, 4.48, 4.72)),
            }}
          >
            <Txt size={28} color={rgba(T.mist, 1)} weight={300} letterSpacing={4} lineHeight={39}>
              十月 · OCT
            </Txt>
            <Txt size={28} color={rgba(T.mist, 1)} weight={300} letterSpacing={4} lineHeight={39}>
              出勤 22 天 · 出单 16 天
            </Txt>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 10 }}>
            {Array.from({ length: BLANKS }).map((_, i) => (
              <div key={`b${i}`} style={{ height: 96 }} />
            ))}
            {days.map((day) => {
              const dow = (BLANKS + day - 1) % 7;
              const isOn = ON_DAYS.has(day);
              const isStar = day === STAR_DAY;
              const st = 4.6 + (day / 31) * 1.0 + (isOn ? 0.05 : 0);
              const pr = outExpo(seg(t, st, st + 0.22));
              const sp = isStar ? outBack(seg(t, st + 0.14, st + 0.44), 2.0) : 0;
              return (
                <div
                  key={day}
                  style={{
                    height: 96,
                    borderRadius: 8,
                    border: isStar
                      ? `2px solid ${rgba(T.pale, 0.9)}`
                      : isOn
                      ? `1px solid ${rgba(T.line, 0.65)}`
                      : `1px solid ${rgba(T.line, 0.16)}`,
                    background: isStar
                      ? `linear-gradient(160deg,${T.goldC},${T.goldD})`
                      : isOn
                      ? `linear-gradient(160deg,${rgba(T.line, 0.3)},${rgba(T.line, 0.08)})`
                      : 'transparent',
                    color: isStar ? '#2A1503' : isOn ? T.bright : rgba(T.soft, dow === 0 || dow === 6 ? 0.3 : 0.55),
                    fontWeight: isStar ? 700 : isOn ? 600 : 300,
                    fontSize: isStar ? 36 : 32,
                    boxShadow: isStar
                      ? `0 0 22px ${rgba(T.line, 0.55)}`
                      : isOn
                      ? `0 0 14px ${rgba(T.line, 0.25)}`
                      : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.35 + 0.65 * pr,
                    transform: `scale(${
                      isStar ? lerp(1, 1.18, Math.max(0, sp)) : lerp(0.7, 1, pr)
                    })`,
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </Chapter>

      {/* 05 定版 */}
      <Chapter t={t} in={[6.68, 7.02]}>
        <EndCard theme={T} t={t} start={6.76} p={p} />
      </Chapter>
    </Stage>
  );
};
