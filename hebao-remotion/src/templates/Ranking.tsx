import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { Rule } from '../components/Rule';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 17 · 榜单风云版
 * 叙事：金榜标题 → No.5→No.2 hairline 行自下而上揭晓 → 冠军登顶（双环印章压轴）→ 定版共存
 * 独立定版版式（主标题缩小、二维码上移，与通用 EndCard 不同，故自绘）。
 */

type RankRow = { name: string; org: string; value: string };
const parseVal = (v: string) => {
  const m = /^\s*([\d,.]+)\s*(.*)$/.exec(v || '');
  return m
    ? { num: parseFloat(m[1].replace(/,/g, '')), dec: m[1].indexOf('.') >= 0 ? 1 : 0, suffix: m[2] }
    : { num: null as number | null, dec: 0, suffix: v || '' };
};

export const Ranking: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const list: RankRow[] = (p.rankings ?? []).slice(0, 5);
  const n = list.length || 5;
  const chasers = n >= 2 ? list.slice(0, n - 1) : [];
  const top1 = n >= 1 ? list[n - 1] : null;
  const champ = top1 ? parseVal(top1.value) : null;

  /* 标题逐字弹出 */
  const titleChars = Array.from('荣耀榜单');
  const m = chasers.length;
  const top0 = m >= 4 ? 780 : m === 3 ? 846 : m === 2 ? 912 : m === 1 ? 978 : 1044;
  const champName = top1?.name ?? '虚位以待';
  const nl = champName.length;
  const cf = nl <= 3 ? 100 : nl <= 4 ? 88 : 72;

  return (
    <Stage theme={T} brand={p.brand} brandLayout="top" bottomtag="HONOR　RANKING">
      {/* 01 榜单标题 */}
      <Chapter t={t} in={[0.04, 0.4]} out={[1.16, 1.46]}>
        <div
          style={{
            position: 'absolute',
            top: 560,
            width: 1080,
            textAlign: 'center',
          }}
        >
          {titleChars.map((c, i) => {
            const pr = seg(t, 0.1 + i * 0.09, 0.42 + i * 0.09);
            const e = outBack(pr, 2.2);
            return (
              <GoldText
                key={i}
                theme={T}
                size={132}
                lineHeight={170}
                letterSpacing={22}
                weight={700}
                style={{
                  opacity: clamp01(pr * 2.4),
                  transform: `scale(${lerp(1.5, 1, e)})`,
                }}
              >
                {c}
              </GoldText>
            );
          })}
        </div>
        {(() => {
          const prs = outExpo(seg(t, 0.56, 0.84));
          return (
            <Txt
              size={38}
              color={T.cream}
              weight={400}
              font="serif"
              letterSpacing={10}
              lineHeight={53}
              style={{
                position: 'absolute',
                top: 780,
                width: 1080,
                textAlign: 'center',
                opacity: prs,
                transform: `translateY(${(1 - prs) * 20}px)`,
              }}
            >
              十月 · 谁与争锋
            </Txt>
          );
        })()}
        <Rule theme={T} t={t} start={0.72} dur={0.3} left={440} top={886} width={200} />
      </Chapter>

      {/* 02 金榜名单 No.5 → No.2 */}
      <Chapter t={t} in={[1.34, 1.58]} out={[4.1, 4.42]}>
        <Rule
          theme={T}
          t={t}
          start={1.4}
          dur={0.3}
          left={150}
          top={top0 - 40}
          width={780}
          opacity={0.45}
        />
        {chasers.map((r, i) => {
          const rank = n - i;
          const st = 1.46 + i * 0.62;
          const pr = outExpo(seg(t, st, st + 0.3));
          const pv = parseVal(r.value);
          const cp = outExpo(seg(t, st + 0.05, st + 0.5));
          const val =
            pv.num !== null
              ? `${(pv.num * cp).toFixed(pv.dec)}${pv.suffix ? ' ' + pv.suffix : ''}`
              : pv.suffix;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 150,
                top: top0 + i * 124,
                width: 780,
                display: 'flex',
                alignItems: 'baseline',
                paddingBottom: 24,
                borderBottom: `1px solid ${rgba(T.line, 0.25)}`,
                opacity: pr,
                transform: `translateY(${(1 - pr) * 30}px)`,
              }}
            >
              <Txt
                size={36}
                color={rgba(T.soft, 0.92)}
                font="num"
                weight={700}
                letterSpacing={1}
                lineHeight={44}
                style={{ width: 132, flex: 'none' }}
              >
                {`No.${rank}`}
              </Txt>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
                <Txt
                  size={46}
                  color="#fff"
                  weight={600}
                  letterSpacing={4}
                  lineHeight={56}
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {r.name}
                </Txt>
                <Txt
                  size={24}
                  color={rgba(T.mist, 0.9)}
                  weight={300}
                  letterSpacing={2}
                  lineHeight={34}
                  style={{
                    marginTop: 8,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {r.org}
                </Txt>
              </div>
              <Txt
                size={46}
                color="#fff"
                font="num"
                weight={700}
                lineHeight={56}
                style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}
              >
                {val}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 03 冠军登顶（压轴，保留到结尾） */}
      <Chapter t={t} in={[4.06, 4.4]}>
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 120,
            width: 960,
            height: 760,
            opacity: outExpo(seg(t, 4.06, 4.5)) * (0.8 + 0.2 * Math.sin((t / 4) * Math.PI * 2)),
            background: `radial-gradient(ellipse at 50% 45%, ${rgba(T.glow1, 0.4)} 0%, ${rgba(
              T.glow1,
              0
            )} 66%)`,
          }}
        />
        {(() => {
          const sealP = outExpo(seg(t, 4.16, 5.0));
          const ringP = outExpo(seg(t, 4.36, 4.76));
          const pulse = 1 + 0.012 * Math.sin(seg(t, 5.5, 8) * Math.PI * 1.4);
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 360,
                  top: 300,
                  width: 360,
                  height: 360,
                  opacity: clamp01(seg(t, 4.16, 4.5)),
                  transform: `scale(${lerp(1.5, 1, sealP) * pulse})`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `2px solid ${rgba(T.line, 0.7)}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 26,
                    borderRadius: '50%',
                    border: `1px solid ${rgba(T.line, 0.3)}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GoldText
                    theme={T}
                    size={104}
                    font="num"
                    weight={700}
                    lineHeight={120}
                    letterSpacing={1}
                    style={{ opacity: clamp01(seg(t, 4.26, 4.64)) }}
                  >
                    No.1
                  </GoldText>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 342,
                  top: 282,
                  width: 396,
                  height: 396,
                  borderRadius: '50%',
                  border: `1px dashed ${rgba(T.line, 0.4)}`,
                  opacity: ringP,
                  transform: `rotate(${t * 8}deg) scale(${lerp(1.35, 1, ringP)})`,
                }}
              />
            </>
          );
        })()}
        {(() => {
          const ebP = outExpo(seg(t, 4.52, 4.78));
          return (
            <Txt
              size={26}
              color={rgba(T.soft, 0.85)}
              weight={400}
              letterSpacing={8}
              lineHeight={36}
              style={{
                position: 'absolute',
                top: 724,
                width: 1080,
                textAlign: 'center',
                opacity: ebP,
                transform: `translateY(${(1 - ebP) * 18}px)`,
              }}
            >
              本月冠军 · CHAMPION
            </Txt>
          );
        })()}
        {(() => {
          const nmP = outExpo(seg(t, 4.62, 4.92));
          return (
            <Txt
              size={cf}
              color={T.bright}
              weight={700}
              font="serif"
              letterSpacing={12}
              lineHeight={Math.round(cf * 1.28)}
              style={{
                position: 'absolute',
                top: 782,
                width: 1080,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: nmP,
                transform: `translateY(${(1 - nmP) * 28}px)`,
              }}
            >
              {champName}
            </Txt>
          );
        })()}
        <Txt
          size={30}
          color={rgba(T.mist, 1)}
          weight={300}
          letterSpacing={5}
          lineHeight={42}
          style={{
            position: 'absolute',
            top: 936,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 4.76, 5.02)),
          }}
        >
          {top1?.org ?? '下一期由你登顶'}
        </Txt>
        <Rule
          theme={T}
          t={t}
          start={4.88}
          dur={0.54}
          left={120}
          top={1008}
          width={840}
          opacity={0.6}
        />
        {(() => {
          const vRowP = outExpo(seg(t, 4.96, 5.22));
          const sfP = outExpo(seg(t, 5.15, 5.4));
          const cp = outExpo(seg(t, 4.9, 5.65));
          return (
            <div
              style={{
                position: 'absolute',
                top: 1046,
                width: 1080,
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: 18,
                opacity: vRowP,
              }}
            >
              {champ?.num != null && (
                <GoldText
                  theme={T}
                  size={180}
                  font="num"
                  weight={700}
                  lineHeight={200}
                  letterSpacing={-2}
                >
                  {cp <= 0 ? '' : (champ.num * cp).toFixed(champ.dec)}
                </GoldText>
              )}
              <Txt
                size={56}
                color={rgba(T.soft, 0.95)}
                weight={300}
                lineHeight={78}
                style={{ opacity: sfP }}
              >
                {champ?.suffix ?? ''}
              </Txt>
            </div>
          );
        })()}
      </Chapter>

      {/* 04 定版（与冠军共存） */}
      <Chapter t={t} in={[5.55, 5.87]}>
        {(() => {
          const pco = outExpo(seg(t, 5.67, 5.93));
          const pt5 = outExpo(seg(t, 5.77, 6.23));
          const pq2 = outBack(seg(t, 6.13, 6.47), 1.5);
          const pc2 = outExpo(seg(t, 6.31, 6.57));
          return (
            <>
              <Rule
                theme={T}
                t={t}
                start={5.61}
                dur={0.26}
                left={440}
                top={1300}
                width={200}
                height={2}
                solid
                opacity={0.6}
              />
              <Txt
                size={30}
                color={rgba(T.mist, 1)}
                weight={300}
                letterSpacing={6}
                lineHeight={42}
                style={{
                  position: 'absolute',
                  top: 1340,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pco,
                  transform: `translateY(${(1 - pco) * 16}px)`,
                }}
              >
                {p.company ?? '泰康养老保险股份有限公司'}
              </Txt>
              <GoldText
                theme={T}
                size={64}
                font="serif"
                weight={700}
                lineHeight={88}
                letterSpacing={lerp(28, 14, pt5)}
                style={{
                  position: 'absolute',
                  top: 1402,
                  left: 0,
                  width: 1080,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  opacity: pt5,
                  transform: `translateY(${(1 - pt5) * 34}px)`,
                }}
              >
                {p.slogan2}
              </GoldText>
              <QrBlock
                theme={T}
                left={450}
                top={1512}
                size={180}
                src={p.qr}
                style={{
                  opacity: clamp01(seg(t, 6.13, 6.31)),
                  transform: `scale(${lerp(0.86, 1, pq2)})`,
                }}
              />
              <Txt
                size={26}
                color={rgba(T.soft, 0.85)}
                weight={400}
                letterSpacing={5}
                lineHeight={36}
                style={{
                  position: 'absolute',
                  top: 1712,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pc2,
                  transform: `translateY(${(1 - pc2) * 16}px)`,
                }}
              >
                2026 年 10 月 · 本榜单仅用于内部表彰
              </Txt>
            </>
          );
        })()}
      </Chapter>
        <Sfx name="sfx_chime" at={6.35} vol={0.3} />
    </Stage>
  );
};
