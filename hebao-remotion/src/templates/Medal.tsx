import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { Txt } from '../components/GoldText';
import { Rule } from '../components/Rule';
import { SloganChars, sloganSize } from '../components/SloganChars';
import { CeremonyRows, RowHead } from '../components/CeremonyRows';
import { CeremonyEnd } from '../components/CeremonyEnd';
import { Pill } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, fmtNum, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 04 · 勋章功勋版（template-medal.html）
 *
 * 全库唯一依赖实拍素材的一套：缎带勋章从画外垂下、回弹挂稳，
 * 数字直接「刻」在勋章面上（深墨色 + 浅金高光，不是滚数金字）。
 * 因此这一套的 02 章不是 NumChapter —— 数字必须跟着勋章整组淡出。
 */
export const Medal: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  /* ---- 勋章组（0~3.7s 常驻） ---- */
  const grpOut = seg(t, 3.42, 3.72);
  const grpOp = 1 - grpOut;
  const dropP = outExpo(seg(t, 0.06, 0.92));
  const swayA = t > 0.92 ? 1.6 * Math.sin((t - 0.92) * 3.0) * Math.exp(-(t - 0.92) * 1.6) : 0;
  const cntP = outExpo(seg(t, 1.86, 2.92));
  const hasDec = p.premium % 1 !== 0;
  const digits = String(p.premium.toFixed(hasDec ? 1 : 0)).replace('.', '').length;
  const numFs = digits <= 3 ? 128 : digits === 4 ? 106 : 88;
  const engraved = rgba(T.mask, 1);

  return (
    <Stage theme={T} brand={p.brand} brandSize={26} bottomtag="MEDAL　OF　HONOR">
      {/* 勋章 + 刻数（常驻，整组淡出） */}
      <Img
        src={staticFile('assets/medal.png')}
        style={{
          position: 'absolute',
          left: 226,
          top: -20,
          width: 615,
          height: 'auto',
          transformOrigin: '50% 0',
          filter: 'drop-shadow(0 18px 34px rgba(0,0,0,.45))',
          opacity: clamp01(seg(t, 0.06, 0.28)) * grpOp,
          transform: `translateY(${-1250 * (1 - dropP)}px) rotate(${swayA.toFixed(3)}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 700,
          width: 1080,
          lineHeight: '150px',
          textAlign: 'center',
          fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
          fontStretch: '87.5%',
          fontWeight: 700,
          fontSize: numFs,
          letterSpacing: -2,
          color: engraved,
          textShadow: '0 1px 1px rgba(255,235,180,.55)',
          opacity: clamp01(seg(t, 1.86, 2.06)) * grpOp,
        }}
      >
        {fmtNum(p.premium * cntP, hasDec)}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 856,
          width: 1080,
          textAlign: 'center',
          fontSize: 34,
          letterSpacing: 4,
          color: rgba(T.mask, 0.78),
          fontWeight: 400,
          opacity: clamp01(seg(t, 2.02, 2.22)) * grpOp,
        }}
      >
        万元
      </div>

      {/* 01 标语 */}
      <Chapter t={t} in={[0.9, 1.24]} out={[1.9, 2.2]}>
        {(() => {
          const pe = outExpo(seg(t, 1.44, 1.7));
          return (
            <>
              <SloganChars
                theme={T}
                t={t}
                text={p.slogan}
                top={1128}
                height={160}
                size={sloganSize(p.slogan, 118)}
                lineHeight={160}
                start={0.96}
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
                  top: 1326,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pe,
                  transform: `translateY(${(1 - pe) * 18}px)`,
                }}
              >
                MEDAL　OF　HONOR
              </Txt>
              <Rule
                theme={T}
                t={t}
                start={1.56}
                dur={0.3}
                left={190}
                top={1402}
                width={700}
                solid
                opacity={0.6}
              />
            </>
          );
        })()}
      </Chapter>

      {/* 02 说明（数字已在勋章上） */}
      <Chapter t={t} in={[2.02, 2.34]} out={[3.42, 3.72]}>
        {(() => {
          const pl = outExpo(seg(t, 2.08, 2.32));
          const pd = outExpo(seg(t, 2.94, 3.22));
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
                  top: 1096,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pl,
                  transform: `translateY(${(1 - pl) * 18}px)`,
                }}
              >
                {p.dlabel}
              </Txt>
              <Txt
                size={28}
                color={rgba(T.soft, 0.85)}
                weight={400}
                letterSpacing={4}
                lineHeight={39}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1160,
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
      <Chapter t={t} in={[3.6, 3.92]} out={[4.98, 5.28]}>
        {(() => {
          const pcx = outExpo(seg(t, 4.56, 4.86));
          return (
            <>
              <RowHead theme={T} t={t} start={3.66} left={170} top={458} width={740} />
              <CeremonyRows
                theme={T}
                t={t}
                stats={p.stats}
                tops={[500, 690, 880]}
                start={3.74}
                align="between"
                left={170}
                width={740}
                labelSize={38}
                labelSpacing={8}
                valueSize={92}
                valueLineHeight={102}
              />
              <Txt
                size={32}
                color={T.cream2}
                weight={300}
                font="serif"
                letterSpacing={5}
                lineHeight={45}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1120,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pcx,
                  transform: `translateY(${(1 - pcx) * 20}px)`,
                }}
              >
                每一份保单 · 都是一份托付
              </Txt>
            </>
          );
        })()}
      </Chapter>

      {/* 04 名牌揭牌 */}
      <Chapter t={t} in={[5.12, 5.44]} out={[6.46, 6.76]}>
        {(() => {
          const pq = outBack(seg(t, 5.18, 5.56), 1.5);
          const pn4 = outExpo(seg(t, 5.34, 5.62));
          const pr4 = outExpo(seg(t, 5.5, 5.76));
          const pq4 = outExpo(seg(t, 5.62, 5.88));
          const pm = outBack(seg(t, 5.76, 6.06), 1.4);
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 180,
                  top: 560,
                  width: 720,
                  height: 220,
                  border: `2px solid ${rgba(T.line, 0.65)}`,
                  opacity: clamp01(seg(t, 5.18, 5.38)),
                  transform: `scale(${lerp(0.86, 1, pq)})`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 10,
                    border: `1px solid ${rgba(T.line, 0.3)}`,
                  }}
                />
                {/* 顶部菱形铆钉 */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: -7,
                    width: 14,
                    height: 14,
                    marginLeft: -7,
                    background: `linear-gradient(135deg,${T.goldB},${T.goldD})`,
                    transform: 'rotate(45deg)',
                  }}
                />
              </div>
              <Txt
                size={72}
                color="#fff"
                weight={600}
                font="serif"
                letterSpacing={14}
                lineHeight={100}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 600,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pn4,
                  transform: `translateY(${(1 - pn4) * 26}px)`,
                }}
              >
                {p.name}
              </Txt>
              <Txt
                size={29}
                color={rgba(T.soft, 0.88)}
                weight={300}
                letterSpacing={6}
                lineHeight={41}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 706,
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
                  top: 856,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pq4,
                  transform: `translateY(${(1 - pq4) * 20}px)`,
                }}
              >
                {p.quote ?? '专业赢得信赖 · 坚持成就卓越'}
              </Txt>
              <Pill theme={T} text={p.pill} top={952} p={pm} />
            </>
          );
        })()}
      </Chapter>

      {/* 05 定版 */}
      <Chapter t={t} in={[6.6, 6.94]}>
        <Sfx name="sfx_gong" at={5.44} vol={0.45} />
        <CeremonyEnd
          theme={T}
          t={t}
          p={p}
          L={6.64}
          logo={{ left: 490, top: 286, size: 100, fontSize: 46 }}
          companyTop={414}
          title={{ top: 520, size: 128, lineHeight: 170, letterSpacing: 24 }}
          titleSizes={[128, 96, 72]}
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
