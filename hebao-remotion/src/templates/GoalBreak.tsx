import { Sfx } from '../components/Sfx';
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
 * 78 · 目标拆解版
 * 叙事：年度大目标 → 12 个月格子逐格填色（完成的金、未完成的暗）→ 剩下两个月怎么打 → 定版
 * 与旧模板差异：讲「年」不讲「月」；允许未完成月份在场，叙事是剩余冲刺而非庆功。
 */
export const GoalBreak: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const cells = (p.goalCells ?? []).slice(0, 12);
  const done = cells.filter((c) => c.done).length;
  const pct = Math.round((done / Math.max(1, cells.length)) * 100);

  return (
    <Stage theme={T} brand={p.brand} bottomtag="GOAL　BREAKDOWN">
      {/* 01 大目标 */}
      <Chapter t={t} in={[0.04, 0.32]} out={[3.3, 3.58]}>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={11}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 190,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          {p.goalTxt || '年度目标 1000 万'}
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 238,
            width: 1080,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <GoldText
            theme={T}
            size={190}
            weight={700}
            font="num"
            lineHeight={222}
            style={{
              opacity: outExpo(seg(t, 0.04, 0.34)),
              transform: `scale(${lerp(1.14, 1, outBack(seg(t, 0.04, 0.46), 1.9))})`,
            }}
          >
            {String(done).padStart(2, '0')}
          </GoldText>
          <Txt size={58} color={rgba(T.mist, 0.85)} weight={400} font="num" lineHeight={74}>
            / 12
          </Txt>
        </div>
        <Txt
          size={30}
          color={rgba(cream, 0.82)}
          font="serif"
          letterSpacing={7}
          lineHeight={44}
          style={{
            position: 'absolute',
            left: 0,
            top: 468,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.36, 0.68)),
          }}
        >
          {p.subValue || '个月已达标 · 格子填满就是圆满年'}
        </Txt>

        {/* 12 格 */}
        <div style={{ position: 'absolute', left: 118, top: 570, width: 844 }}>
          {cells.map((c, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const s0 = 0.5 + i * 0.11;
            const e = outExpo(seg(t, s0, s0 + 0.3));
            return (
              <div
                key={c.label}
                style={{
                  position: 'absolute',
                  left: col * 216,
                  top: row * 172,
                  width: 196,
                  height: 152,
                  borderRadius: 14,
                  background: c.done
                    ? `linear-gradient(158deg, ${rgba(gold, 0.88)} 0%, ${rgba(hexRgb(T.goldD), 0.86)} 100%)`
                    : rgba(T.mask, 0.55),
                  border: `1px solid ${c.done ? rgba(T.goldA, 0.6) : rgba(T.line, 0.16)}`,
                  boxShadow: c.done ? `0 8px 24px ${rgba(gold, 0.2)}` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: e * (c.done ? 1 : 0.85),
                  transform: `scale(${lerp(0.86, 1, outBack(seg(t, s0, s0 + 0.34), 2))})`,
                }}
              >
                <Txt
                  size={27}
                  color={c.done ? rgba(T.archbg, 0.92) : rgba(T.mist, 0.4)}
                  weight={600}
                  letterSpacing={3}
                  lineHeight={38}
                >
                  {c.label}
                </Txt>
                <Txt
                  size={38}
                  color={c.done ? rgba(T.archbg, 0.95) : rgba(T.mist, 0.32)}
                  weight={700}
                  font="num"
                  lineHeight={50}
                  style={{ marginTop: 4 }}
                >
                  {c.v}
                </Txt>
                {c.done ? (
                  <svg width={22} height={22} viewBox="0 0 22 22" style={{ marginTop: 6 }}>
                    <path
                      d="M4 12 L9 17 L18 5"
                      fill="none"
                      stroke={rgba(T.archbg, 0.85)}
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <Txt size={22} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={2} lineHeight={28} style={{ marginTop: 8 }}>
                    {c.label === '十一月' ? '进行中' : '待启'}
                  </Txt>
                )}
              </div>
            );
          })}
        </div>
      </Chapter>

      {/* 02 收官计划 */}
      <Chapter t={t} in={[3.42, 3.72]} out={[5.42, 5.7]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 350,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.5, 3.8)),
          }}
        >
          收 官 两 个 月
        </Txt>
        <div style={{ position: 'absolute', left: 0, top: 394, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={172}
            weight={700}
            font="num"
            lineHeight={200}
            style={{
              opacity: outExpo(seg(t, 3.42, 3.74)),
              transform: `scale(${lerp(1.14, 1, outBack(seg(t, 3.42, 3.84), 1.9))})`,
            }}
          >
            {p.hero || '61'}
          </GoldText>
          <Txt
            size={52}
            color={rgba(cream, 0.9)}
            weight={500}
            font="serif"
            letterSpacing={8}
            lineHeight={70}
            style={{ marginTop: -12 }}
          >
            天 · 冲刺剩余目标
          </Txt>
        </div>

        {[
          { k: '目标缺口', v: '380 万', d: '按当前件均 6.8 万，还需 56 件' },
          { k: '日均节奏', v: '6.2 万/天', d: '相当于每天 1 件年金 + 半件重疾' },
          { k: '关键动作', v: '3 件', d: '沙龙获客 · 老客户加保 · 增员补充' },
        ].map((f, i) => {
          const s0 = 3.9 + i * 0.24;
          const e = outExpo(seg(t, s0, s0 + 0.4));
          return (
            <div
              key={f.k}
              style={{
                position: 'absolute',
                left: 130,
                top: 680 + i * 200,
                width: 820,
                opacity: e,
                transform: `translateX(${(1 - e) * 40}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Txt size={32} color={rgba(cream, 0.88)} weight={500} letterSpacing={4} lineHeight={46}>
                  {f.k}
                </Txt>
                <Txt size={46} color={T.bright} weight={700} font="num" lineHeight={60}>
                  {f.v}
                </Txt>
              </div>
              <Txt
                size={24}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={2}
                lineHeight={36}
                style={{ marginTop: 10 }}
              >
                {f.d}
              </Txt>
              <div
                style={{
                  marginTop: 20,
                  height: 1,
                  background: `linear-gradient(90deg, ${rgba(T.line, 0.3)}, ${rgba(T.line, 0.02)})`,
                }}
              />
            </div>
          );
        })}
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.64, 6.0]}>
        <Sfx name="sfx_gong" at={0.40} vol={0.45} />
        <EndCard theme={T} t={t} start={5.7} p={p} />
      </Chapter>
    </Stage>
  );
};
