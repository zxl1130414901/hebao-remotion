import { Sfx } from '../components/Sfx';
import { GoldBurst } from '../components/textures';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 80 · 开门红动员版
 * 叙事：倒计时 → 目标缺口 → 拆到每一天 → 全员口号 → 定版
 * 与旧模板差异：全库唯一「未达成」叙事 —— 不庆功，是出发前的动员令。
 */
export const Kickoff: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const beat = 0.94 + 0.06 * Math.sin(t * 5.2);

  return (
    <Stage theme={T} brand={p.brand} bottomtag="KICKOFF　·　DAY　ONE">
      {/* 01 倒计时 */}
      <Chapter t={t} in={[0.04, 0.32]} out={[2.62, 2.9]}>
        <Sfx name="sfx_gong" at={0.1} vol={0.5} />
        {/* 巨字砸落金花 */}
        <GoldBurst theme={T} t={t} t0={0.08} cx={540} cy={640} spread={340} count={30} />
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 236,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          COUNTDOWN　TO　THE　FINISH
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 452,
            width: 1080,
            textAlign: 'center',
            transform: `scale(${beat.toFixed(4)})`,
          }}
        >
          <GoldText
            theme={T}
            size={340}
            weight={700}
            font="num"
            lineHeight={380}
            letterSpacing={-8}
            style={{
              opacity: outExpo(seg(t, 0.04, 0.4)),
              filter: `drop-shadow(0 16px 52px ${rgba(gold, 0.4)})`,
            }}
          >
            {p.hero || '61'}
          </GoldText>
        </div>
        <Txt
          size={44}
          color={rgba(cream, 0.92)}
          weight={500}
          font="serif"
          letterSpacing={12}
          lineHeight={60}
          style={{
            position: 'absolute',
            left: 0,
            top: 852,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.36, 0.68)),
          }}
        >
          天 · 到年底收官
        </Txt>
        <Txt
          size={30}
          color={rgba(cream, 0.8)}
          font="serif"
          letterSpacing={6}
          lineHeight={44}
          style={{
            position: 'absolute',
            left: 0,
            top: 946,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.5, 0.82)),
          }}
        >
          {p.subValue || '时间不多，但够用 —— 前提是今天就开始'}
        </Txt>
      </Chapter>

      {/* 02 缺口拆解 */}
      <Chapter t={t} in={[2.72, 3.02]} out={[5.0, 5.28]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 342,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.8, 3.1)),
          }}
        >
          缺 口 拆 到 每 一 天
        </Txt>

        {/* 缺口条：当前 vs 目标 */}
        <div style={{ position: 'absolute', left: 120, top: 430, width: 840 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 14 }}>
            <Txt size={27} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={4} lineHeight={38}>
              当前完成
            </Txt>
            <Txt
              size={40}
              color={T.bright}
              weight={700}
              font="num"
              lineHeight={52}
              style={{ marginLeft: 'auto' }}
            >
              620 万 / 1,000 万
            </Txt>
          </div>
          <div
            style={{
              width: 840,
              height: 54,
              borderRadius: 27,
              background: rgba(T.mask, 0.6),
              border: `1px solid ${rgba(T.line, 0.16)}`,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${62 * outExpo(seg(t, 2.9, 3.5))}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${rgba(hexRgb(T.goldD), 0.9)}, ${rgba(gold, 1)})`,
                boxShadow: `0 0 22px ${rgba(gold, 0.5)}`,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              justifyContent: 'flex-end',
              opacity: outExpo(seg(t, 3.3, 3.62)),
            }}
          >
            <Txt size={27} color={rgba(gold, 0.85)} weight={600} font="num" letterSpacing={2} lineHeight={38}>
              缺口 380 万 →
            </Txt>
          </div>
        </div>

        {/* 拆解三行 */}
        {[
          { k: '拆到每天', v: '6.2 万', d: '61 天 × 6.2 万 = 380 万' },
          { k: '拆到每件', v: '56 件', d: '按件均 6.8 万，全组 4 人分摊' },
          { k: '拆到每周', v: '43.5 万', d: '每周五晚复盘，差多少补多少' },
        ].map((f, i) => {
          const s0 = 3.5 + i * 0.26;
          const e = outExpo(seg(t, s0, s0 + 0.4));
          return (
            <div
              key={f.k}
              style={{
                position: 'absolute',
                left: 120,
                top: 660 + i * 190,
                width: 840,
                opacity: e,
                transform: `translateX(${(1 - e) * 40}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Txt size={31} color={rgba(cream, 0.88)} weight={500} letterSpacing={5} lineHeight={44}>
                  {f.k}
                </Txt>
                <Txt
                  size={48}
                  color={T.bright}
                  weight={700}
                  font="num"
                  lineHeight={62}
                  style={{ marginLeft: 'auto' }}
                >
                  {f.v}
                </Txt>
              </div>
              <Txt
                size={24}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={2}
                lineHeight={36}
                style={{ marginTop: 8 }}
              >
                {f.d}
              </Txt>
              <div
                style={{
                  marginTop: 18,
                  height: 1,
                  background: `linear-gradient(90deg, ${rgba(T.line, 0.3)}, ${rgba(T.line, 0.02)})`,
                }}
              />
            </div>
          );
        })}
      </Chapter>

      {/* 03 动员口号 */}
      <Chapter t={t} in={[5.12, 5.44]} out={[6.5, 6.78]}>
        {['开门红', '就是开年饭'].map((ln, i) => (
          <div
            key={ln}
            style={{
              position: 'absolute',
              left: 0,
              top: 560 + i * 190,
              width: 1080,
              textAlign: 'center',
              opacity: outExpo(seg(t, 5.2 + i * 0.24, 5.52 + i * 0.24)),
              transform: `scale(${lerp(1.3, 1, outBack(seg(t, 5.2 + i * 0.24, 5.66 + i * 0.24), 2))})`,
            }}
          >
            <GoldText
              theme={T}
              size={i === 0 ? 150 : 106}
              weight={700}
              font="serif"
              letterSpacing={i === 0 ? 14 : 10}
              lineHeight={i === 0 ? 190 : 140}
            >
              {ln}
            </GoldText>
          </div>
        ))}
        <Txt
          size={31}
          color={rgba(cream, 0.82)}
          font="serif"
          letterSpacing={7}
          lineHeight={46}
          style={{
            position: 'absolute',
            left: 0,
            top: 1020,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 5.7, 6.04)),
          }}
        >
          {p.quote || '今年的团圆饭，能不能加个菜，就看这两个月'}
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 1128,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 5.9, 6.24)),
          }}
        >
          <Txt size={27} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={5} lineHeight={40}>
            {p.brand} · 全员 · 即日出发
          </Txt>
        </div>
      </Chapter>

      {/* 04 定版 */}
      <Chapter t={t} in={[6.6, 6.94]}>
        <EndCard theme={T} t={t} start={6.66} p={p} />
      </Chapter>
    </Stage>
  );
};
