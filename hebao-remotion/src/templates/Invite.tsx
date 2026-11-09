import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { QrBlock } from '../components/QrBlock';
import { Rule } from '../components/Rule';
import { PhotoCard } from '../components/PhotoCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 34 · 诚邀入伙版
 * 叙事：巨字「诚邀」→ 邀请正文 → 战绩背书 → 大二维码 + 圆照 + 落款
 */

export const Invite: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 诚邀大字 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.3, 2.6]}>
        {(() => {
          const ph = outBack(seg(t, 0.16, 0.62), 1.9);
          return (
            <GoldText
              theme={T}
              size={210}
              font="serif"
              weight={700}
              lineHeight={270}
              letterSpacing={90}
              style={{
                position: 'absolute',
                top: 470,
                left: 0,
                width: 1080,
                textAlign: 'center',
                textIndent: 90,
                whiteSpace: 'nowrap',
                opacity: clamp01(seg(t, 0.16, 0.4)),
                transform: `scale(${lerp(1.45, 1, ph)})`,
              }}
            >
              诚邀
            </GoldText>
          );
        })()}
        <Rule theme={T} t={t} start={0.78} dur={0.34} left={330} top={790} width={420} opacity={0.6} />
        <Txt
          size={27}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={14}
          lineHeight={38}
          style={{
            position: 'absolute',
            top: 830,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.94, 1.26)),
          }}
        >
          JOIN　US　·　BE　THE　NEXT　STAR
        </Txt>
      </Chapter>

      {/* 02 邀请正文 */}
      <Chapter t={t} in={[2.44, 2.76]} out={[3.94, 4.24]}>
        {(() => {
          const p1 = outExpo(seg(t, 2.52, 2.86));
          const p2 = outExpo(seg(t, 2.76, 3.12));
          const pt = outExpo(seg(t, 3.24, 3.56));
          return (
            <>
              <Txt
                size={52}
                color="#fff"
                weight={500}
                font="serif"
                letterSpacing={5}
                lineHeight={88}
                style={{
                  position: 'absolute',
                  left: 140,
                  top: 560,
                  width: 800,
                  textAlign: 'center',
                  opacity: p1,
                  transform: `translateY(${(1 - p1) * 26}px)`,
                }}
              >
                我们正在寻找 · 下一位月度之星
              </Txt>
              <Txt
                size={34}
                color={T.cream2}
                weight={300}
                font="serif"
                letterSpacing={3}
                lineHeight={64}
                style={{
                  position: 'absolute',
                  left: 140,
                  top: 692,
                  width: 800,
                  textAlign: 'center',
                  opacity: p2,
                  transform: `translateY(${(1 - p2) * 26}px)`,
                }}
              >
                如果你渴望被看见、被认可、被记录
                <br />
                这里有你想要的舞台和战友
              </Txt>
              <Txt
                size={31}
                color={rgba(T.soft, 0.8)}
                weight={300}
                letterSpacing={6}
                lineHeight={43}
                style={{
                  position: 'absolute',
                  top: 1030,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pt,
                  transform: `translateY(${(1 - pt) * 20}px)`,
                }}
              >
                杭州三区 · 王牌团队 恭候你
              </Txt>
            </>
          );
        })()}
      </Chapter>

      {/* 03 战绩背书 */}
      <Chapter t={t} in={[4.08, 4.4]} out={[5.48, 5.78]}>
        {(() => {
          const pl = outExpo(seg(t, 4.14, 4.38));
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
                  top: 540,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pl,
                  transform: `translateY(${(1 - pl) * 18}px)`,
                }}
              >
                上个月我们做到了
              </Txt>
              <div
                style={{
                  position: 'absolute',
                  top: 626,
                  width: 1080,
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: outExpo(seg(t, 4.26, 4.52)),
                }}
              >
                <NumRoll theme={T} target={p.premium} t={t} start={4.2} dur={1.08} size={220} lineHeight={250} unit="万元" unitSize={50} />
              </div>
              <Txt
                size={28}
                color={rgba(T.soft, 0.85)}
                weight={400}
                letterSpacing={4}
                lineHeight={39}
                style={{
                  position: 'absolute',
                  top: 930,
                  width: 1080,
                  textAlign: 'center',
                  opacity: outExpo(seg(t, 5.08, 5.34)),
                  transform: `translateY(${(1 - outExpo(seg(t, 5.08, 5.34))) * 18}px)`,
                }}
              >
                {p.delta}
              </Txt>
            </>
          );
        })()}
      </Chapter>

      {/* 04 大二维码 */}
      <Chapter t={t} in={[5.62, 5.96]}>
        {(() => {
          const pq = outBack(seg(t, 5.7, 6.1), 1.7);
          const pc = outExpo(seg(t, 6.0, 6.3));
          const ps = outExpo(seg(t, 6.24, 6.54));
          return (
            <>
              <PhotoCard
                theme={T}
                src={p.photo}
                left={470}
                top={240}
                width={150}
                height={150}
                round
                style={{
                  opacity: clamp01(seg(t, 5.7, 5.9)),
                  transform: `scale(${lerp(0.6, 1, pq)})`,
                }}
              />
              <QrBlock
                theme={T}
                left={390}
                top={470}
                size={300}
                src={p.qr}
                radius={16}
                style={{
                  opacity: clamp01(seg(t, 5.7, 5.9)),
                  transform: `scale(${lerp(0.6, 1, pq)})`,
                }}
              />
              <Txt
                size={38}
                color={rgba(T.soft, 0.9)}
                weight={500}
                letterSpacing={8}
                lineHeight={53}
                style={{
                  position: 'absolute',
                  top: 830,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pc,
                  transform: `translateY(${(1 - pc) * 22}px)`,
                }}
              >
                {p.qrCap}
              </Txt>
              <Txt
                size={31}
                color={rgba(T.mist, 1)}
                weight={300}
                letterSpacing={5}
                lineHeight={43}
                style={{
                  position: 'absolute',
                  top: 960,
                  width: 1080,
                  textAlign: 'center',
                  opacity: ps,
                }}
              >
                你的伙伴 · {p.name}
              </Txt>
              <Txt
                size={30}
                color={rgba(T.mist, 1)}
                weight={300}
                letterSpacing={8}
                lineHeight={42}
                style={{
                  position: 'absolute',
                  top: 1568,
                  width: 1080,
                  textAlign: 'center',
                  opacity: outExpo(seg(t, 6.44, 6.74)),
                }}
              >
                {p.dateText}
              </Txt>
              <Txt
                size={28}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={4}
                lineHeight={39}
                style={{
                  position: 'absolute',
                  top: 1624,
                  width: 1080,
                  textAlign: 'center',
                  opacity: outExpo(seg(t, 6.58, 6.88)),
                }}
              >
                本贺报仅用于内部招募 · 请勿外传
              </Txt>
            </>
          );
        })()}
      </Chapter>
        <Sfx name="sfx_pop" at={5.04} vol={0.28} />
    </Stage>
  );
};
