import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { Rule } from '../components/Rule';
import { SloganChars } from '../components/SloganChars';
import { CeremonyEnd } from '../components/CeremonyEnd';
import { FONT_SERIF, THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 01 · 喜庆红金版（原版 index.html，编辑器 key = honor）
 *
 * 这是整套贺报的「母版」，其余仪式类模板都由它派生，所以节奏最讲究：
 *   印章旋出 → 月份副题 → 恭贺二字砸落 → 姓名 → 拱门人像显影 → 定版。
 * 与原版的差异只有一处：主标题字距从 44 收到 24 的动画被保留，
 * 但字号按字数再收一档，避免 6 字标题换行压到副题。
 */
export const Honor: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const sealChar = p.sealChar && p.sealChar !== '泰' ? p.sealChar : '荣';

  return (
    <Stage theme={T} brand={p.brand} brandLayout="top" bottomtag="TOP　PERFORMER　OF　THE　MONTH">
      {/* 01 印章启幕 */}
      <Chapter t={t} in={[0.04, 0.42]} out={[1.16, 1.5]}>
        {(() => {
          const sealP = outExpo(seg(t, 0.06, 0.95));
          const p1a = outExpo(seg(t, 0.74, 1.06));
          const p1b = outExpo(seg(t, 0.86, 1.18));
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 330,
                  top: 650,
                  width: 420,
                  height: 420,
                  opacity: clamp01(seg(t, 0.06, 0.45)),
                  transform: `scale(${lerp(1.16, 1, sealP)})`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `2px solid ${rgba(T.line, 0.65)}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 28,
                    borderRadius: '50%',
                    border: `1px solid ${rgba(T.line, 0.28)}`,
                  }}
                />
                <GoldText
                  theme={T}
                  size={200}
                  weight={700}
                  lineHeight={420}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 420,
                    textAlign: 'center',
                    opacity: clamp01(seg(t, 0.14, 0.55)),
                  }}
                >
                  {sealChar}
                </GoldText>
              </div>
              <Rule
                theme={T}
                t={t}
                start={0.68}
                dur={0.34}
                left={500}
                top={1150}
                width={80}
                solid
                opacity={0.6}
              />
              <Txt
                size={40}
                color={T.cream}
                weight={400}
                font="serif"
                letterSpacing={6}
                lineHeight={56}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1206,
                  width: 1080,
                  textAlign: 'center',
                  opacity: p1a,
                  transform: `translateY(${(1 - p1a) * 22}px)`,
                }}
              >
                {p.monthCN ?? '十月 · 荣耀揭晓'}
              </Txt>
              <Txt
                size={28}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={6}
                lineHeight={39}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1290,
                  width: 1080,
                  textAlign: 'center',
                  opacity: p1b,
                  transform: `translateY(${(1 - p1b) * 22}px)`,
                }}
              >
                {p.monthEN ?? 'OCTOBER 2026 · HONOR MOMENT'}
              </Txt>
            </>
          );
        })()}
      </Chapter>

      {/* 02 恭贺 + 姓名 */}
      <Chapter t={t} in={[1.28, 1.6]} out={[2.72, 3.02]}>
        {(() => {
          const pe = outExpo(seg(t, 1.34, 1.62));
          const pn = outExpo(seg(t, 1.9, 2.2));
          const pr = outExpo(seg(t, 2.12, 2.4));
          const pp = outBack(seg(t, 2.26, 2.58), 1.4);
          return (
            <>
              <Txt
                size={28}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={12}
                lineHeight={39}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 462,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pe,
                  transform: `translateY(${(1 - pe) * 18}px)`,
                }}
              >
                CONGRATULATIONS
              </Txt>
              <Rule
                theme={T}
                t={t}
                start={1.46}
                dur={0.3}
                left={490}
                top={536}
                width={100}
                solid
                opacity={0.65}
              />
              <SloganChars
                theme={T}
                t={t}
                text="恭贺"
                top={600}
                height={280}
                size={200}
                lineHeight={260}
                gap={14}
                start={1.44}
                stagger={0.13}
                dur={0.28}
              />
              <Txt
                size={108}
                color="#fff"
                weight={600}
                font="serif"
                letterSpacing={16}
                lineHeight={140}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 930,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pn,
                  transform: `translateY(${(1 - pn) * 30}px)`,
                }}
              >
                {p.name}
              </Txt>
              <Rule
                theme={T}
                t={t}
                start={2.06}
                dur={0.28}
                left={500}
                top={1112}
                width={80}
                solid
                opacity={0.6}
                color={T.line}
              />
              <Txt
                size={36}
                color={rgba(T.warm, 1)}
                weight={300}
                letterSpacing={6}
                lineHeight={50}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1146,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pr,
                  transform: `translateY(${(1 - pr) * 22}px)`,
                }}
              >
                {p.role}
              </Txt>
              <div
                style={{
                  position: 'absolute',
                  left: 330,
                  top: 1320,
                  width: 420,
                  height: 78,
                  borderRadius: 39,
                  border: `1px solid ${rgba(T.line, 0.5)}`,
                  background: rgba(T.line, 0.14),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  opacity: clamp01(seg(t, 2.26, 2.45)),
                  transform: `scale(${lerp(0.9, 1, pp)})`,
                }}
              >
                <Txt size={30} color={T.bright} weight={500} letterSpacing={3} lineHeight={42}>
                  {p.pill}
                </Txt>
              </div>
            </>
          );
        })()}
      </Chapter>

      {/* 03 核心数字 + 三项 */}
      <Chapter t={t} in={[2.86, 3.14]} out={[4.24, 4.56]}>
        {(() => {
          const pl = outExpo(seg(t, 2.92, 3.18));
          const pd = outExpo(seg(t, 3.3, 3.58));
          const beamP = outExpo(seg(t, 3.0, 3.55));
          return (
            <>
              <Txt
                size={34}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={6}
                lineHeight={48}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 452,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pl,
                  transform: `translateY(${(1 - pl) * 18}px)`,
                }}
              >
                {p.dlabel}
              </Txt>
              <div
                style={{
                  position: 'absolute',
                  top: 530,
                  width: 1080,
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: outExpo(seg(t, 3.04, 3.3)),
                }}
              >
                <NumRoll
                  theme={T}
                  target={p.premium}
                  t={t}
                  start={2.98}
                  dur={1.18}
                  size={300}
                  lineHeight={330}
                  unit="万元"
                  unitSize={56}
                  unitColor={rgba(T.soft, 0.92)}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 40,
                  top: 892,
                  width: 1000,
                  height: 1,
                  background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(
                    T.pale,
                    0.6
                  )},${rgba(T.pale, 0)})`,
                  transform: `scaleX(${beamP})`,
                  opacity: outExpo(seg(t, 3.0, 3.3)),
                }}
              />
              <Txt
                size={28}
                color={rgba(T.soft, 0.85)}
                weight={400}
                letterSpacing={4}
                lineHeight={39}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 930,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pd,
                  transform: `translateY(${(1 - pd) * 18}px)`,
                }}
              >
                {p.delta}
              </Txt>
              {[400, 680].map((left) => (
                <div
                  key={left}
                  style={{
                    position: 'absolute',
                    left,
                    top: 1112,
                    width: 1,
                    height: 190,
                    background: rgba(T.pale, 0.32),
                  }}
                />
              ))}
              <div
                style={{
                  position: 'absolute',
                  left: 120,
                  top: 1080,
                  width: 840,
                  height: 260,
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                {p.stats.slice(0, 3).map((st, i) => {
                  const pp = outExpo(seg(t, 3.34 + i * 0.1, 3.66 + i * 0.1));
                  return (
                    <div
                      key={i}
                      style={{
                        width: 240,
                        textAlign: 'center',
                        opacity: pp,
                        transform: `translateY(${(1 - pp) * 44}px)`,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
                          fontWeight: 700,
                          fontStretch: '87.5%',
                          fontSize: 76,
                          lineHeight: '86px',
                          letterSpacing: -1,
                          color: st.hl ? T.bright : '#fff',
                        }}
                      >
                        {st.v}
                      </div>
                      <Txt
                        size={30}
                        color={rgba(T.mist, 0.88)}
                        weight={300}
                        letterSpacing={4}
                        lineHeight={42}
                        style={{ marginTop: 14 }}
                      >
                        {st.k}
                      </Txt>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </Chapter>

      {/* 04 拱门人像 */}
      <Chapter t={t} in={[4.4, 4.7]} out={[6.06, 6.36]}>
        {(() => {
          const pst = outExpo(seg(t, 4.44, 4.72));
          const archP = outExpo(seg(t, 4.5, 5.24));
          const pn4 = outExpo(seg(t, 5.18, 5.48));
          const pr4 = outExpo(seg(t, 5.34, 5.62));
          const pq = outExpo(seg(t, 5.5, 5.78));
          return (
            <>
              <Txt
                size={28}
                color={rgba(T.pale, 0.85)}
                weight={300}
                letterSpacing={8}
                lineHeight={39}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 200,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pst,
                  transform: `translateY(${(1 - pst) * 18}px)`,
                }}
              >
                {p.starLabel ?? '2026 · 10　月 度 之 星'}
              </Txt>
              <div
                style={{
                  position: 'absolute',
                  left: 140,
                  top: 270,
                  width: 800,
                  height: 1000,
                  border: `1px solid ${rgba(T.line, 0.28)}`,
                  borderRadius: '400px 400px 0 0',
                  opacity: outExpo(seg(t, 4.48, 4.86)),
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 160,
                  top: 290,
                  width: 760,
                  height: 980,
                  overflow: 'hidden',
                  border: `2px solid ${rgba(T.soft, 0.9)}`,
                  borderRadius: '380px 380px 0 0',
                  background: T.archbg,
                  clipPath: `inset(${((1 - archP) * 100).toFixed(2)}% 0 0 0 round 380px 380px 0 0)`,
                  transform: `translateY(${(1 - archP) * 40}px)`,
                }}
              >
                <Img
                  src={p.photo || staticFile('assets/portrait.png')}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 760,
                    height: 980,
                    objectFit: 'cover',
                    objectPosition: '50% 22%',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: 760,
                    height: 340,
                    background: `linear-gradient(180deg,${rgba(T.mask, 0)} 0%,${rgba(
                      T.mask,
                      0.95
                    )} 100%)`,
                  }}
                />
              </div>
              <Txt
                size={88}
                color="#fff"
                weight={600}
                font="serif"
                letterSpacing={14}
                lineHeight={110}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1318,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pn4,
                  transform: `translateY(${(1 - pn4) * 30}px)`,
                }}
              >
                {p.name}
              </Txt>
              <Txt
                size={32}
                color={rgba(T.soft, 0.88)}
                weight={300}
                letterSpacing={6}
                lineHeight={45}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1436,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pr4,
                  transform: `translateY(${(1 - pr4) * 22}px)`,
                }}
              >
                {p.role}
              </Txt>
              <Txt
                size={34}
                color={T.cream2}
                weight={300}
                font="serif"
                letterSpacing={4}
                lineHeight={48}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1540,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pq,
                  transform: `translateY(${(1 - pq) * 22}px)`,
                }}
              >
                {p.quote ?? '专业赢得信赖 · 坚持成就卓越'}
              </Txt>
            </>
          );
        })()}
      </Chapter>

      {/* 05 定版 */}
      <Chapter t={t} in={[6.22, 6.56]}>
        <Sfx name="sfx_pop" at={3.68} vol={0.28} />
        <CeremonyEnd
          theme={T}
          t={t}
          p={p}
          L={6.26}
          logo={{ left: 490, top: 286, size: 100, fontSize: 46 }}
          companyTop={414}
          title={{ top: 520, size: 128, lineHeight: 170, letterSpacing: 24 }}
          titleSizes={[128, 100, 84]}
          titleTrack
          sub={{ top: 752, size: 38 }}
          line={{ top: 846, width: 120 }}
          qr={{ top: 930, size: 220 }}
          capTop={1196}
          dateTop={1560}
          noteTop={1616}
        />
      </Chapter>
    </Stage>
  );
};
