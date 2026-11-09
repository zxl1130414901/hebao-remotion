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
 * 02 · 战报仪式版（template-battle.html）
 *
 * 开门红气质：捷报印章先压，四个字砸下来，数字往上滚，
 * 然后是三行「战报条目」—— 全库唯一用「左右对齐 + 底部细金线」列表讲数据的仪式模板。
 * 人物章用圆形照片 + 虚线转环，比证书版更轻快。
 */
export const Battle: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const sealChar = p.sealChar && p.sealChar !== '泰' ? p.sealChar : '捷';

  return (
    <Stage theme={T} brand={p.brand} brandLayout="top" bottomtag="BATTLE　REPORT">
      {/* 01 捷报印章 + 标语 */}
      <Chapter t={t} in={[0.04, 0.46]} out={[1.32, 1.64]}>
        {(() => {
          const sealP = outExpo(seg(t, 0.06, 0.92));
          const pe = outExpo(seg(t, 0.98, 1.26));
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 370,
                  top: 452,
                  width: 340,
                  height: 340,
                  opacity: clamp01(seg(t, 0.06, 0.42)),
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
                    inset: 24,
                    borderRadius: '50%',
                    border: `1px solid ${rgba(T.line, 0.28)}`,
                  }}
                />
                <GoldText
                  theme={T}
                  size={168}
                  weight={700}
                  lineHeight={340}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 340,
                    textAlign: 'center',
                    opacity: clamp01(seg(t, 0.14, 0.52)),
                  }}
                >
                  {sealChar}
                </GoldText>
              </div>
              <SloganChars
                theme={T}
                t={t}
                text={p.slogan}
                top={884}
                height={220}
                size={sloganSize(p.slogan, 168)}
                lineHeight={220}
                gap={10}
                start={0.34}
              />
              <Txt
                size={28}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={12}
                lineHeight={39}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 1152,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pe,
                  transform: `translateY(${(1 - pe) * 18}px)`,
                }}
              >
                OPENING　BATTLE　REPORT
              </Txt>
              <Rule
                theme={T}
                t={t}
                start={1.12}
                dur={0.32}
                left={120}
                top={1232}
                width={840}
                solid
                opacity={0.6}
              />
            </>
          );
        })()}
      </Chapter>

      {/* 02 核心数字 */}
      <Chapter t={t} in={[1.48, 1.8]} out={[3.0, 3.3]}>
        {(() => {
          const pl = outExpo(seg(t, 1.54, 1.8));
          const pd = outExpo(seg(t, 2.52, 2.8));
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
                  top: 470,
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
                  top: 556,
                  width: 1080,
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: outExpo(seg(t, 1.66, 1.92)),
                }}
              >
                <NumRoll
                  theme={T}
                  target={p.premium}
                  t={t}
                  start={1.6}
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
                  top: 940,
                  width: 1000,
                  height: 1,
                  background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(
                    T.pale,
                    0.6
                  )},${rgba(T.pale, 0)})`,
                  transform: `scaleX(${outExpo(seg(t, 2.02, 2.56))})`,
                  opacity: outExpo(seg(t, 2.02, 2.32)),
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
                  top: 992,
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

      {/* 03 战报条目 */}
      <Chapter t={t} in={[3.14, 3.46]} out={[4.54, 4.84]}>
        <RowHead theme={T} t={t} start={3.2} left={150} top={520} width={780} />
        <CeremonyRows
          theme={T}
          t={t}
          stats={p.stats}
          tops={[560, 756, 952]}
          start={3.28}
          align="between"
          left={150}
          width={780}
          labelSize={40}
          labelSpacing={8}
          valueSize={100}
          valueLineHeight={110}
        />
      </Chapter>

      {/* 04 人物亮相 */}
      <Chapter t={t} in={[4.68, 5.0]} out={[6.34, 6.64]}>
        {(() => {
          const pp = outBack(seg(t, 4.74, 5.12), 1.7);
          const ringP = outExpo(seg(t, 4.88, 5.2));
          const pn4 = outExpo(seg(t, 5.04, 5.32));
          const pr4 = outExpo(seg(t, 5.18, 5.44));
          const pq4 = outExpo(seg(t, 5.3, 5.56));
          const pm = outBack(seg(t, 5.42, 5.72), 1.4);
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 340,
                  top: 448,
                  width: 400,
                  height: 400,
                  borderRadius: '50%',
                  border: `1px dashed ${rgba(T.line, 0.45)}`,
                  opacity: ringP,
                  transform: `scale(${lerp(1.25, 1, ringP)}) rotate(${t * 8}deg)`,
                }}
              />
              <PhotoCard
                theme={T}
                src={p.photo}
                left={360}
                top={468}
                width={360}
                height={360}
                round
                objectPosition="50% 18%"
                style={{
                  opacity: clamp01(seg(t, 4.74, 4.94)),
                  transform: `scale(${lerp(0.62, 1, pp)})`,
                }}
              />
              <Txt
                size={92}
                color="#fff"
                weight={600}
                font="serif"
                letterSpacing={14}
                lineHeight={120}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 886,
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
                  top: 1026,
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
                  top: 1108,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pq4,
                  transform: `translateY(${(1 - pq4) * 20}px)`,
                }}
              >
                {p.quote ?? '专业赢得信赖 · 坚持成就卓越'}
              </Txt>
              <Pill
                theme={T}
                text={p.pill}
                top={1206}
                p={pm}
                size={28}
                minWidth={420}
                padX={46}
              />
            </>
          );
        })()}
      </Chapter>

      {/* 05 定版 */}
      <Chapter t={t} in={[6.48, 6.82]}>
        <Sfx name="sfx_pop" at={2.30} vol={0.28} />
        <CeremonyEnd
          theme={T}
          t={t}
          p={p}
          L={6.52}
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
