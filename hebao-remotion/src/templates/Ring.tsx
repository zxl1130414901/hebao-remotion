import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 08 · 目标冲刺版
 * 叙事：标语 → 进度环充能（环心滚数）→ 三项 → 人物 → 定版
 */
const R = 310;
const CIRC = 2 * Math.PI * R;

export const Ring: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const peb = outExpo(seg(t, 0.14, 0.4));
  const psg = outBack(seg(t, 0.28, 0.68), 1.8);

  const raw = p.stats[1]?.v ?? '218%';
  const m = String(raw).match(/[\d.]+/);
  const goalVal = m ? parseFloat(m[0]) : 218;
  const goalSuf = m ? String(raw).slice(String(raw).indexOf(m[0]) + m[0].length) : '%';

  const rp = outExpo(seg(t, 2.26, 3.6));
  const rc = outExpo(seg(t, 2.4, 2.8));
  const gv = goalVal * rp;

  const psgText = clamp01(seg(t, 0.28, 0.52));

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 标语 */}
      <Chapter t={t} in={[0.1, 0.44]} out={[2.0, 2.3]}>
        <Txt
          size={26}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={14}
          lineHeight={36}
          style={{ position: 'absolute', top: 520, width: 1080, textAlign: 'center', opacity: peb }}
        >
          SPRINT　TO　THE　GOAL
        </Txt>
        <GoldText
          theme={T}
          size={140}
          weight={700}
          letterSpacing={24}
          lineHeight={190}
          font="serif"
          style={{
            position: 'absolute',
            top: 600,
            width: 1080,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: psgText,
            transform: `scale(${lerp(1.3, 1, psg)})`,
          }}
        >
          {p.slogan}
        </GoldText>
      </Chapter>

      {/* 02 进度环 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[4.3, 4.6]}>
        <div style={{ position: 'absolute', left: 190, top: 430, width: 700, height: 700 }}>
          <svg viewBox="0 0 700 700" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={T.goldB} />
                <stop offset=".6" stopColor={T.goldC} />
                <stop offset="1" stopColor={T.goldD} />
              </linearGradient>
            </defs>
            <circle cx={350} cy={350} r={R} fill="none" stroke={rgba(T.line, 0.16)} strokeWidth={26} />
            <circle
              cx={350}
              cy={350}
              r={R}
              fill="none"
              stroke="url(#ring-grad)"
              strokeWidth={26}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - rp)}
              style={{ filter: `drop-shadow(0 0 16px ${rgba(T.line, 0.45)})` }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: rc,
              transform: `scale(${lerp(0.85, 1, rc)})`,
            }}
          >
            <GoldText
              theme={T}
              size={170}
              font="num"
              weight={700}
              lineHeight={200}
              letterSpacing={-2}
            >
              {(goalVal % 1 !== 0 ? gv.toFixed(1) : String(Math.round(gv))) + goalSuf}
            </GoldText>
            <Txt
              size={44}
              color={rgba(T.soft, 0.9)}
              weight={300}
              letterSpacing={4}
              lineHeight={61}
              style={{ marginTop: 8 }}
            >
              目标达成
            </Txt>
          </div>
        </div>
        <Txt
          size={33}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={6}
          lineHeight={46}
          style={{
            position: 'absolute',
            top: 1160,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.6, 3.94)),
            transform: `translateY(${(1 - outExpo(seg(t, 3.6, 3.94))) * 18}px)`,
          }}
        >
          {p.dlabel ? `${p.dlabel} · 全面超越` : '十月时序进度 · 全面超越'}
        </Txt>
        <Txt
          size={28}
          color={rgba(T.soft, 0.85)}
          letterSpacing={4}
          lineHeight={39}
          style={{
            position: 'absolute',
            top: 1240,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.86, 4.16)),
          }}
        >
          {p.delta}
        </Txt>
      </Chapter>

      {/* 03 三项 */}
      <Chapter t={t} in={[4.62, 4.94]} out={[5.36, 5.66]}>
        <div
          style={{
            position: 'absolute',
            top: 620,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {p.stats.slice(0, 3).map((st, i) => {
            const st0 = 4.64 + i * 0.16;
            const e = outExpo(seg(t, st0, st0 + 0.32));
            const L = String(st.v).length;
            const fs = L <= 4 ? 82 : L === 5 ? 70 : 60;
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div
                    style={{
                      width: 1,
                      height: 175,
                      marginTop: 10,
                      background: `linear-gradient(180deg,${rgba(T.line, 0)},${rgba(
                        T.line,
                        0.55
                      )},${rgba(T.line, 0)})`,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 300,
                    textAlign: 'center',
                    opacity: e,
                    transform: `translateY(${(1 - e) * 36}px)`,
                  }}
                >
                  <GoldText theme={T} size={fs} font="num" weight={700} lineHeight={118}>
                    {st.v}
                  </GoldText>
                  <Txt
                    size={29}
                    color={rgba(T.mist, 1)}
                    weight={300}
                    letterSpacing={5}
                    lineHeight={41}
                    style={{ marginTop: 14 }}
                  >
                    {st.k}
                  </Txt>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Chapter>

      {/* 04 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[5.68, 6.0]} out={[6.54, 6.84]} photoTop={200} nameTop={580} roleTop={780} pillTop={892} />

      {/* 05 定版 */}
      <Chapter t={t} in={[6.68, 7.02]}>
        <Sfx name="sfx_gong" at={0.58} vol={0.45} />
        <EndCard theme={T} t={t} start={6.76} p={p} />
      </Chapter>
    </Stage>
  );
};
