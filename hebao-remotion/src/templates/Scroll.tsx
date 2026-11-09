import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { StampInk } from '../components/textures';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { Rule } from '../components/Rule';
import { PhotoCard } from '../components/PhotoCard';
import { SloganChars, sloganSize } from '../components/SloganChars';
import { CeremonyRows, RowHead } from '../components/CeremonyRows';
import { CeremonyEnd } from '../components/CeremonyEnd';
import { Pill } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 03 · 鎏金卷轴版（template-scroll.html）
 *
 * 全库最典雅的一套：一条卷芯从画卷中展开成纸面，天地杆从画外滑入收边，
 * 顶端挂一枚金坠。之后所有章节都发生在「纸面」之内。
 * 卷轴框架常驻（不属于任何章节），所以它直接挂在 Stage 下，
 * 纸面的高度与纵坐标随 openP 一起生长 —— 这是本套唯一的耦合点。
 */
export const Scroll: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const sealChar = p.sealChar && p.sealChar !== '泰' ? p.sealChar : '贺';

  /* ---- 卷轴展开：轴杆退开 · 纸面自轴卷开 · 卷芯收拢 ---- */
  const rodIn = clamp01(seg(t, 0.02, 0.26));
  const openP = outExpo(seg(t, 0.2, 1.38));
  const rodP = outBack(seg(t, 0.2, 1.44), 1.1);
  const rollP = outExpo(seg(t, 0.2, 1.34));
  const tsP = outBack(seg(t, 1.42, 1.72), 1.6);
  const panelOp = clamp01(seg(t, 0.2, 0.44));

  const paleBar = `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(T.pale, 0.4)},${rgba(
    T.pale,
    0
  )})`;

  const axle: React.CSSProperties = {
    position: 'absolute',
    top: -9,
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: `radial-gradient(circle at 34% 30%, ${T.goldA} 0%, ${T.goldC} 42%, ${T.goldD} 100%)`,
    boxShadow: '0 3px 12px rgba(0,0,0,.55), inset -4px -5px 10px rgba(0,0,0,.38)',
  };

  return (
    <Stage theme={T} brand={p.brand} brandLayout="top" bottomtag="SCROLL　OF　HONOR">
      {/* 纸面 */}
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 950 - 610 * openP,
          width: 820,
          height: 1220 * openP,
          background: `linear-gradient(180deg,${rgba(T.mask, 0.1)} 0%,${rgba(
            T.mask,
            0.42
          )} 100%)`,
          borderLeft: `1px solid ${rgba(T.line, 0.4)}`,
          borderRight: `1px solid ${rgba(T.line, 0.4)}`,
          opacity: panelOp,
        }}
      >
        <div style={{ position: 'absolute', left: 14, right: 14, top: 26, height: 1, background: paleBar }} />
        <div
          style={{ position: 'absolute', left: 14, right: 14, bottom: 26, height: 1, background: paleBar }}
        />
      </div>

      {/* 卷芯（展开前是一卷纸筒） */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 902,
          width: 780,
          height: 96,
          borderRadius: 48,
          opacity: rodIn * (1 - seg(t, 0.55, 0.78)),
          transform: `scaleY(${Math.max(0.03, 1 - rollP).toFixed(3)})`,
          background: [
            `radial-gradient(ellipse at 50% 50%, ${rgba(T.pale, 0.2)} 0%, rgba(0,0,0,.26) 76%)`,
            `repeating-linear-gradient(180deg, ${rgba(T.line, 0.24)} 0 3px, rgba(0,0,0,0) 3px 13px)`,
            `linear-gradient(180deg, ${rgba(T.mask, 0.92)}, ${rgba(T.mask, 0.62)})`,
          ].join(','),
          backgroundPosition: `0 ${(-rollP * 280).toFixed(1)}px, 0 ${(rollP * 170).toFixed(1)}px, 0 0`,
          boxShadow: `0 8px 26px rgba(0,0,0,.5), inset 0 3px 8px ${rgba(
            T.pale,
            0.3
          )}, inset 0 -5px 12px rgba(0,0,0,.42), inset 14px 0 26px rgba(0,0,0,.28), inset -14px 0 26px rgba(0,0,0,.28)`,
        }}
      />

      {/* 天地杆 */}
      {[
        { top: 327, from: 570 },
        { top: 1547, from: -570 },
      ].map((b) => (
        <div
          key={b.top}
          style={{
            position: 'absolute',
            left: 40,
            top: b.top,
            width: 1000,
            height: 26,
            borderRadius: 13,
            opacity: rodIn,
            transform: `translateY(${lerp(b.from, 0, rodP)}px)`,
            background: 'linear-gradient(180deg,#5C432A 0%,#3B2B19 52%,#22150A 100%)',
            boxShadow: `0 4px 16px rgba(0,0,0,.5), inset 0 1px 0 ${rgba(
              T.pale,
              0.22
            )}, inset 0 -2px 4px rgba(0,0,0,.5)`,
          }}
        >
          <div style={{ ...axle, left: -16 }} />
          <div style={{ ...axle, right: -16 }} />
        </div>
      ))}

      {/* 金坠 */}
      <div
        style={{
          position: 'absolute',
          left: 528,
          top: 356,
          width: 24,
          height: 24,
          background: `linear-gradient(135deg,${T.goldB},${T.goldD})`,
          boxShadow: `0 0 14px ${rgba(T.line, 0.5)}`,
          opacity: clamp01(seg(t, 1.42, 1.58)),
          transform: `rotate(45deg) scale(${lerp(0, 1, tsP)})`,
        }}
      />

      {/* 01 印章 + 标语（钩子章：0.8s 内印章大字成形，hebao-design ①幕纪律） */}
      <Chapter t={t} in={[0.5, 0.8]} out={[1.88, 2.18]}>
        {(() => {
          const sealP = outExpo(seg(t, 0.5, 1.06));
          const pe = outExpo(seg(t, 1.42, 1.68));
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 400,
                  top: 470,
                  width: 280,
                  height: 280,
                  opacity: clamp01(seg(t, 0.5, 0.78)),
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
                    inset: 20,
                    borderRadius: '50%',
                    border: `1px solid ${rgba(T.line, 0.28)}`,
                  }}
                />
                {/* 印油斑驳 */}
                <StampInk opacity={0.3} />
                <GoldText
                  theme={T}
                  size={140}
                  weight={700}
                  lineHeight={280}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 280,
                    textAlign: 'center',
                    opacity: clamp01(seg(t, 0.54, 0.8)),
                  }}
                >
                  {sealChar}
                </GoldText>
              </div>
              <SloganChars
                theme={T}
                t={t}
                text={p.slogan}
                top={820}
                height={200}
                size={sloganSize(p.slogan, 150)}
                lineHeight={200}
                start={0.68}
                stagger={0.08}
              />
              <Txt
                size={27}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={12}
                lineHeight={38}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1062,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pe,
                  transform: `translateY(${(1 - pe) * 18}px)`,
                }}
              >
                SCROLL　OF　HONOR
              </Txt>
              <Rule
                theme={T}
                t={t}
                start={1.64}
                dur={0.3}
                left={190}
                top={1142}
                width={700}
                solid
                opacity={0.6}
              />
            </>
          );
        })()}
      </Chapter>

      {/* 02 核心数字 */}
      <Chapter t={t} in={[2.02, 2.34]} out={[3.42, 3.72]}>
        {(() => {
          const pl = outExpo(seg(t, 2.08, 2.32));
          const pd = outExpo(seg(t, 3.02, 3.28));
          return (
            <>
              <Txt
                size={33}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={6}
                lineHeight={46}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 490,
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
                  top: 576,
                  width: 1080,
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: outExpo(seg(t, 2.2, 2.46)),
                }}
              >
                <NumRoll
                  theme={T}
                  target={p.premium}
                  t={t}
                  start={2.14}
                  dur={1.08}
                  size={270}
                  lineHeight={297}
                  unit="万元"
                  unitSize={54}
                  unitColor={rgba(T.soft, 0.92)}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 70,
                  top: 940,
                  width: 940,
                  height: 1,
                  background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(
                    T.pale,
                    0.6
                  )},${rgba(T.pale, 0)})`,
                  transform: `scaleX(${outExpo(seg(t, 2.54, 3.06))})`,
                  opacity: outExpo(seg(t, 2.54, 2.84)),
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
                  top: 994,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pd,
                  transform: `translateY(${(1 - pd) * 18}px)`,
                }}
              >
                {p.delta}
              </Txt>
            </>
          );
        })()}
      </Chapter>

      {/* 03 荣录条目 */}
      <Chapter t={t} in={[3.56, 3.88]} out={[4.96, 5.26]}>
        <RowHead theme={T} t={t} start={3.62} left={170} top={558} width={740} />
        <CeremonyRows
          theme={T}
          t={t}
          stats={p.stats}
          tops={[600, 788, 976]}
          start={3.7}
          align="between"
          left={170}
          width={740}
          labelSize={38}
          labelSpacing={8}
          valueSize={92}
          valueLineHeight={102}
        />
      </Chapter>

      {/* 04 人物亮相 */}
      <Chapter t={t} in={[5.1, 5.42]} out={[6.46, 6.76]}>
        {(() => {
          const pp = outBack(seg(t, 5.16, 5.52), 1.7);
          const ringP = outExpo(seg(t, 5.3, 5.6));
          const pn4 = outExpo(seg(t, 5.46, 5.74));
          const pr4 = outExpo(seg(t, 5.6, 5.86));
          const pq4 = outExpo(seg(t, 5.72, 5.98));
          const pm = outBack(seg(t, 5.84, 6.14), 1.4);
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 380,
                  top: 458,
                  width: 320,
                  height: 320,
                  borderRadius: '50%',
                  border: `1px dashed ${rgba(T.line, 0.45)}`,
                  opacity: ringP,
                  transform: `scale(${lerp(1.25, 1, ringP)}) rotate(${t * 8}deg)`,
                }}
              />
              <PhotoCard
                theme={T}
                src={p.photo}
                left={398}
                top={476}
                width={284}
                height={284}
                round
                objectPosition="50% 18%"
                style={{
                  opacity: clamp01(seg(t, 5.16, 5.36)),
                  transform: `scale(${lerp(0.62, 1, pp)})`,
                }}
              />
              <Txt
                size={84}
                color="#fff"
                weight={600}
                font="serif"
                letterSpacing={14}
                lineHeight={112}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 830,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pn4,
                  transform: `translateY(${(1 - pn4) * 30}px)`,
                }}
              >
                {p.name}
              </Txt>
              <Txt
                size={31}
                color={rgba(T.soft, 0.88)}
                weight={300}
                letterSpacing={6}
                lineHeight={44}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 966,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pr4,
                  transform: `translateY(${(1 - pr4) * 20}px)`,
                }}
              >
                {p.role}
              </Txt>
              <Txt
                size={33}
                color={T.cream2}
                weight={300}
                font="serif"
                letterSpacing={4}
                lineHeight={46}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1044,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pq4,
                  transform: `translateY(${(1 - pq4) * 20}px)`,
                }}
              >
                {p.quote ?? '专业赢得信赖 · 坚持成就卓越'}
              </Txt>
              <Pill theme={T} text={p.pill} top={1140} p={pm} />
            </>
          );
        })()}
      </Chapter>

      {/* 05 定版 */}
      <Chapter t={t} in={[6.6, 6.94]}>
        <Sfx name="sfx_pop" at={2.84} vol={0.28} />
        <CeremonyEnd
          theme={T}
          t={t}
          p={p}
          L={6.64}
          logo={{ left: 495, top: 404, size: 90, fontSize: 42 }}
          companyTop={520}
          companySize={29}
          title={{ top: 618, size: 112, lineHeight: 150, letterSpacing: 22 }}
          titleSizes={[112, 84, 64]}
          sub={{ top: 822, size: 36 }}
          line={{ top: 912, width: 120 }}
          qr={{ top: 976, size: 186 }}
          capTop={1206}
          dateTop={1602}
          noteTop={1652}
        />
      </Chapter>
    </Stage>
  );
};
