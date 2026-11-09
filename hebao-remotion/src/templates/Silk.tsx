import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
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
 * 05 · 喜报红绸版（template-silk.html）
 *
 * 日常转发最喜庆的一套：顶部一块「喜报」匾额（证书式细金线排版，不用实拍素材），
 * 匾额随开篇落下，两侧金线左右对开、菱形金粒弹出。
 * 报喜条目改成居中竖排（标签在上、数字在下），是五套仪式模板里唯一的居中列表。
 */
export const Silk: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  /* ---- 喜报头匾（常驻） ---- */
  const dropP = outExpo(seg(t, 0.05, 0.85));
  const pqP = outBack(seg(t, 0.55, 0.98), 1.7);
  const lnP = outExpo(seg(t, 0.72, 1.08));
  const diaP = outBack(seg(t, 0.98, 1.3), 1.7);
  const diaOp = clamp01(seg(t, 0.98, 1.14));

  return (
    <Stage theme={T} brand={p.brand} brandTop={104} brandSize={28} bottomtag="GOOD　NEWS">
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 195,
          width: 1080,
          height: 280,
          opacity: clamp01(seg(t, 0.05, 0.3)),
          transform: `translateY(${-260 * (1 - dropP)}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 220,
            top: 0,
            width: 640,
            height: 280,
            border: `2px solid ${rgba(T.line, 0.68)}`,
            background: `linear-gradient(180deg,${rgba(T.line, 0.09)},${rgba(
              T.line,
              0.015
            )} 52%,${rgba(T.line, 0.09)})`,
            boxShadow: '0 10px 30px rgba(0,0,0,.24)',
          }}
        >
          <div style={{ position: 'absolute', inset: 9, border: `1px solid ${rgba(T.line, 0.3)}` }} />
          <GoldText
            theme={T}
            size={146}
            weight={700}
            lineHeight={280}
            letterSpacing={52}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 640,
              textAlign: 'center',
              textIndent: 52,
              opacity: clamp01(seg(t, 0.55, 0.78)),
              transform: `scale(${lerp(0.84, 1, pqP)})`,
            }}
          >
            喜报
          </GoldText>
        </div>

        {/* 左右对开金线 */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 139,
            width: 132,
            height: 1,
            transformOrigin: '100% 50%',
            transform: `scaleX(${lnP})`,
            background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(T.pale, 0.55)})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 898,
            top: 139,
            width: 132,
            height: 1,
            transformOrigin: '0% 50%',
            transform: `scaleX(${lnP})`,
            background: `linear-gradient(90deg,${rgba(T.pale, 0.55)},${rgba(T.pale, 0)})`,
          }}
        />
        {/* 菱形金粒 */}
        {[190, 875].map((left) => (
          <div
            key={left}
            style={{
              position: 'absolute',
              left,
              top: 132,
              width: 15,
              height: 15,
              background: `linear-gradient(135deg,${T.goldB},${T.goldD})`,
              boxShadow: `0 0 10px ${rgba(T.line, 0.5)}`,
              opacity: diaOp,
              transform: `rotate(45deg) scale(${lerp(0, 1, diaP)})`,
            }}
          />
        ))}
      </div>

      {/* 01 开篇标语 */}
      <Chapter t={t} in={[0.88, 1.22]} out={[2.0, 2.3]}>
        {(() => {
          const peb = outExpo(seg(t, 0.88, 1.12));
          return (
            <>
              <Txt
                size={26}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={12}
                lineHeight={36}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 598,
                  width: 1080,
                  textAlign: 'center',
                  opacity: peb,
                  transform: `translateY(${(1 - peb) * 18}px)`,
                }}
              >
                GOOD　NEWS　EXPRESS
              </Txt>
              <SloganChars
                theme={T}
                t={t}
                text={p.slogan}
                top={672}
                height={220}
                size={sloganSize(p.slogan, 158)}
                lineHeight={220}
                start={0.98}
              />
              <Rule
                theme={T}
                t={t}
                start={1.62}
                dur={0.3}
                left={190}
                top={960}
                width={700}
                solid
                opacity={0.6}
              />
            </>
          );
        })()}
      </Chapter>

      {/* 02 核心数字 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[3.54, 3.84]}>
        {(() => {
          const pl = outExpo(seg(t, 2.2, 2.44));
          const pd = outExpo(seg(t, 3.14, 3.4));
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
                  top: 642,
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
                  top: 730,
                  width: 1080,
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: outExpo(seg(t, 2.32, 2.58)),
                }}
              >
                <NumRoll
                  theme={T}
                  target={p.premium}
                  t={t}
                  start={2.26}
                  dur={1.08}
                  size={278}
                  lineHeight={306}
                  unit="万元"
                  unitSize={54}
                  unitColor={rgba(T.soft, 0.92)}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 70,
                  top: 1086,
                  width: 940,
                  height: 1,
                  background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(
                    T.pale,
                    0.6
                  )},${rgba(T.pale, 0)})`,
                  transform: `scaleX(${outExpo(seg(t, 2.66, 3.18))})`,
                  opacity: outExpo(seg(t, 2.66, 2.96)),
                }}
              />
              <Txt
                size={29}
                color={rgba(T.soft, 0.85)}
                weight={400}
                letterSpacing={4}
                lineHeight={41}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1142,
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

      {/* 03 报喜条目（居中文体） */}
      <Chapter t={t} in={[3.68, 4.0]} out={[5.06, 5.36]}>
        <RowHead theme={T} t={t} start={3.74} left={270} top={642} width={540} />
        <RowHead theme={T} t={t} start={3.74} left={270} top={1352} width={540} />
        <CeremonyRows
          theme={T}
          t={t}
          stats={p.stats}
          tops={[702, 918, 1134]}
          start={3.82}
          align="center"
          labelSize={35}
          labelSpacing={12}
          valueSize={118}
          valueLineHeight={150}
        />
      </Chapter>

      {/* 04 人物亮相 */}
      <Chapter t={t} in={[5.2, 5.52]} out={[6.54, 6.84]}>
        {(() => {
          const pp = outBack(seg(t, 5.26, 5.62), 1.7);
          const ringP = outExpo(seg(t, 5.4, 5.7));
          const pn4 = outExpo(seg(t, 5.56, 5.84));
          const pr4 = outExpo(seg(t, 5.7, 5.96));
          const pq4 = outExpo(seg(t, 5.82, 6.08));
          const pm = outBack(seg(t, 5.94, 6.24), 1.4);
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 348,
                  top: 631,
                  width: 384,
                  height: 384,
                  borderRadius: '50%',
                  border: `1px dashed ${rgba(T.line, 0.45)}`,
                  opacity: ringP,
                  transform: `scale(${lerp(1.25, 1, ringP)}) rotate(${t * 8}deg)`,
                }}
              />
              <PhotoCard
                theme={T}
                src={p.photo}
                left={370}
                top={653}
                width={340}
                height={340}
                round
                objectPosition="50% 18%"
                style={{
                  opacity: clamp01(seg(t, 5.26, 5.46)),
                  transform: `scale(${lerp(0.62, 1, pp)})`,
                }}
              />
              <Txt
                size={92}
                color="#fff"
                weight={600}
                font="serif"
                letterSpacing={14}
                lineHeight={124}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1032,
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
                  top: 1186,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pr4,
                  transform: `translateY(${(1 - pr4) * 20}px)`,
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
                  top: 1264,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pq4,
                  transform: `translateY(${(1 - pq4) * 20}px)`,
                }}
              >
                {p.quote ?? '专业赢得信赖 · 坚持成就卓越'}
              </Txt>
              <Pill theme={T} text={p.pill} top={1352} p={pm} />
            </>
          );
        })()}
      </Chapter>

      {/* 05 定版（徽标并入公司行） */}
      <Chapter t={t} in={[6.68, 7.02]}>
        <Sfx name="sfx_pop" at={2.96} vol={0.28} />
        <CeremonyEnd
          theme={T}
          t={t}
          p={p}
          L={6.72}
          inlineRow
          logo={{ top: 672, size: 62, fontSize: 30 }}
          companyTop={672}
          companySize={31}
          title={{ top: 798, size: 138, lineHeight: 182, letterSpacing: 26 }}
          titleSizes={[138, 100, 74]}
          sub={{ top: 1044, size: 38 }}
          line={{ top: 1140, width: 120 }}
          qr={{ top: 1198, size: 220 }}
          capTop={1452}
          dateTop={1568}
          noteTop={1624}
        />
      </Chapter>
    </Stage>
  );
};
