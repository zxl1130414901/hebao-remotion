import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { Rule } from '../components/Rule';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 17 · 数据长卷版（月报口径）
 * 叙事：报告标题 → 五项 KPI 逐行翻牌 → 汇总大数字压轴 → 机构落款定版
 */
export const Kpi: React.FC<HebaoProps> = ({ ...p }) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const rows = (p.items ?? []).slice(0, 5);

  const peb = outExpo(seg(t, 0.1, 0.36));
  const pt = outExpo(seg(t, 0.22, 0.86));
  const sl = outExpo(seg(t, 5.4, 5.64));
  const pd = outExpo(seg(t, 6.1, 6.38));
  const plg = outBack(seg(t, 6.68, 7.02), 1.6);
  const pco = outExpo(seg(t, 6.78, 7.04));
  const pet = outExpo(seg(t, 6.84, 7.34));
  const ps = outExpo(seg(t, 7.12, 7.4));

  const title = p.headline || '十月经营数据';
  const endTitle = p.slogan2 || '稳中有进';
  const endSub = p.endsub || '每一分耕耘 · 都算数';

  return (
    <Stage theme={T} brand={p.brand} brandLayout="top" bottomtag="MONTHLY　KPI　REPORT">
      {/* 01 标题 */}
      <Chapter t={t} in={[0.06, 0.44]} out={[1.42, 1.72]}>
        <Txt
          size={26}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            top: 586,
            width: 1080,
            textAlign: 'center',
            opacity: peb,
            transform: `translateY(${(1 - peb) * 18}px)`,
          }}
        >
          MONTHLY　KPI　REPORT
        </Txt>
        <GoldText
          theme={T}
          size={118}
          weight={700}
          letterSpacing={16}
          lineHeight={160}
          font="serif"
          style={{
            position: 'absolute',
            top: 668,
            width: 1080,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: pt,
            transform: `translateY(${(1 - pt) * 34}px)`,
          }}
        >
          {title}
        </GoldText>
        <Rule theme={T} t={t} start={0.86} dur={0.32} left={190} top={912} width={700} />
      </Chapter>

      {/* 02 KPI 长卷 */}
      <Chapter t={t} in={[1.56, 1.86]} out={[4.92, 5.22]}>
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 428,
            width: 780,
            height: 1,
            background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(T.pale, 0.45)},${rgba(
              T.pale,
              0
            )})`,
            transform: `scaleX(${outExpo(seg(t, 1.62, 1.92))})`,
            opacity: outExpo(seg(t, 1.62, 1.82)),
          }}
        />
        {rows.map((it, i) => {
          const st0 = 1.72 + i * 0.52;
          const e = outExpo(seg(t, st0, st0 + 0.42));
          const L = String(it.v).length;
          const vs = L <= 2 ? 80 : L === 3 ? 80 : L === 4 ? 72 : L === 5 ? 62 : 54;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 150,
                top: 486 + i * 174,
                width: 780,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${rgba(T.line, 0.25)}`,
                paddingBottom: 24,
                opacity: e,
                transform: `translateY(${(1 - e) * 38}px)`,
              }}
            >
              <Txt size={38} color={rgba(T.mist, 1)} weight={300} letterSpacing={7} lineHeight={53}>
                {it.k}
              </Txt>
              <div style={{ textAlign: 'right' }}>
                <Txt
                  size={vs}
                  color={i === rows.length - 1 ? T.bright : '#fff'}
                  weight={700}
                  font="num"
                  letterSpacing={-1}
                  lineHeight={Math.round(vs * 1.15)}
                >
                  {it.v}
                </Txt>
                <Txt
                  size={25}
                  color={it.d?.startsWith('▲') ? T.bright : rgba(T.soft, 0.62)}
                  weight={400}
                  letterSpacing={2}
                  lineHeight={35}
                  style={{ marginTop: 6 }}
                >
                  {it.d ?? ''}
                </Txt>
              </div>
            </div>
          );
        })}
      </Chapter>

      {/* 03 汇总压轴 */}
      <Chapter t={t} in={[5.34, 5.66]} out={[6.5, 6.8]}>
        <Txt
          size={34}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={6}
          lineHeight={48}
          style={{
            position: 'absolute',
            top: 556,
            width: 1080,
            textAlign: 'center',
            opacity: sl,
            transform: `translateY(${(1 - sl) * 18}px)`,
          }}
        >
          {p.dlabel || '当月累计承保保费'}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 642,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: outExpo(seg(t, 5.52, 5.78)),
          }}
        >
          <NumRoll
            theme={T}
            target={p.premium}
            t={t}
            start={5.46}
            dur={0.9}
            size={280}
            lineHeight={310}
            unit="万元"
            unitSize={54}
            unitColor={rgba(T.soft, 0.92)}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 980,
            width: 940,
            height: 1,
            transform: `translateX(-470px) scaleX(${outExpo(seg(t, 5.88, 6.34))})`,
            opacity: outExpo(seg(t, 5.88, 6.18)),
            background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(T.pale, 0.6)},${rgba(
              T.pale,
              0
            )})`,
          }}
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
            top: 1036,
            width: 1080,
            textAlign: 'center',
            opacity: pd,
            transform: `translateY(${(1 - pd) * 18}px)`,
          }}
        >
          {p.quote || '数据不说谎 · 努力有回响'}
        </Txt>
      </Chapter>

      {/* 05 定版（机构落款版式） */}
      <Chapter t={t} in={[6.64, 6.98]}>
        <div
          style={{
            position: 'absolute',
            left: 490,
            top: 286,
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: `1.5px solid ${rgba(T.line, 0.75)}`,
            background: rgba(T.line, 0.12),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: clamp01(seg(t, 6.68, 6.87)),
            transform: `scale(${lerp(0.7, 1, plg)})`,
          }}
        >
          <Txt size={46} color={T.bright} weight={600} font="serif">
            {p.sealChar || '泰'}
          </Txt>
        </div>
        <Txt
          size={30}
          color={rgba(T.mist, 1)}
          weight={300}
          letterSpacing={6}
          lineHeight={42}
          style={{
            position: 'absolute',
            top: 414,
            width: 1080,
            textAlign: 'center',
            opacity: pco,
            transform: `translateY(${(1 - pco) * 16}px)`,
          }}
        >
          {p.company || '泰康养老保险股份有限公司'}
        </Txt>
        <GoldText
          theme={T}
          size={128}
          weight={700}
          letterSpacing={24}
          lineHeight={170}
          font="serif"
          style={{
            position: 'absolute',
            top: 520,
            width: 1080,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: pet,
            transform: `translateY(${(1 - pet) * 40}px)`,
          }}
        >
          {endTitle}
        </GoldText>
        <Txt
          size={38}
          color={T.cream2}
          weight={300}
          font="serif"
          letterSpacing={6}
          lineHeight={53}
          style={{
            position: 'absolute',
            top: 752,
            width: 1080,
            textAlign: 'center',
            opacity: ps,
            transform: `translateY(${(1 - ps) * 22}px)`,
          }}
        >
          {endSub}
        </Txt>
        <Rule theme={T} t={t} start={7.22} dur={0.28} left={480} top={846} width={120} />
        <QrBlock
          theme={T}
          left={430}
          top={930}
          src={p.qr}
          style={{
            opacity: clamp01(seg(t, 7.28, 7.44)),
            transform: `scale(${lerp(0.86, 1, outBack(seg(t, 7.28, 7.62), 1.5))})`,
          }}
        />
        <Txt
          size={32}
          color={rgba(T.soft, 0.9)}
          weight={500}
          letterSpacing={6}
          lineHeight={45}
          style={{
            position: 'absolute',
            top: 1196,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 7.42, 7.68)),
            transform: `translateY(${(1 - outExpo(seg(t, 7.42, 7.68))) * 18}px)`,
          }}
        >
          {p.qrCap}
        </Txt>
        <Txt
          size={30}
          color={rgba(T.mist, 1)}
          weight={300}
          letterSpacing={8}
          lineHeight={42}
          style={{
            position: 'absolute',
            top: 1560,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 7.56, 7.82)),
            transform: `translateY(${(1 - outExpo(seg(t, 7.56, 7.82))) * 16}px)`,
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
            top: 1616,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 7.66, 7.92)),
          }}
        >
          {p.note}
        </Txt>
      </Chapter>
        <Sfx name="sfx_pop" at={6.16} vol={0.28} />
    </Stage>
  );
};
