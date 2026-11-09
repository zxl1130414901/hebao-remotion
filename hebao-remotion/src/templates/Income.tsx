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

const PARTS = [
  { k: '首年佣金', v: 24300 },
  { k: '续期佣金', v: 8420 },
  { k: '管理津贴', v: 9600 },
  { k: '达成奖金', v: 6300 },
];
const TOTAL = PARTS.reduce((a, b) => a + b.v, 0);
const money = (n: number) => `¥${n.toLocaleString('en-US')}`;

/**
 * 77 · 收入构成版
 * 叙事：本月到手收入 → 四级阶梯逐级累加（首佣/续佣/津贴/奖金）→ 定版
 * 与旧模板差异：讲「我挣了多少、从哪挣的」——全库唯一以收入为主角的模板。
 */
export const Income: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  // 阶梯
  let acc = 0;
  const steps = PARTS.map((m) => {
    acc += m.v;
    return { ...m, cum: acc };
  });
  const H = 470;

  return (
    <Stage theme={T} brand={p.brand} bottomtag="INCOME　BREAKDOWN">
      {/* 01 总额 */}
      <Chapter t={t} in={[0.04, 0.32]} out={[2.36, 2.64]}>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={11}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 214,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          THIS　MONTH　·　TAKE　HOME
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 268,
            width: 1080,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <Txt size={64} color={rgba(cream, 0.85)} weight={500} font="num" lineHeight={84}>
            ¥
          </Txt>
          <GoldText
            theme={T}
            size={196}
            weight={700}
            font="num"
            lineHeight={228}
            letterSpacing={-2}
            style={{
              opacity: outExpo(seg(t, 0.04, 0.36)),
              transform: `scale(${lerp(1.14, 1, outBack(seg(t, 0.04, 0.46), 1.9))})`,
              filter: `drop-shadow(0 12px 38px ${rgba(gold, 0.3)})`,
            }}
          >
            {TOTAL.toLocaleString('en-US')}
          </GoldText>
        </div>
        <Txt
          size={31}
          color={rgba(cream, 0.8)}
          font="serif"
          letterSpacing={7}
          lineHeight={44}
          style={{
            position: 'absolute',
            left: 0,
            top: 528,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.38, 0.7)),
          }}
        >
          {p.subValue || '这个月的每一分，都清清楚楚'}
        </Txt>
      </Chapter>

      {/* 02 阶梯累加 */}
      <Chapter t={t} in={[2.46, 2.76]} out={[5.0, 5.28]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 336,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.54, 2.84)),
          }}
        >
          四 级 阶 梯
        </Txt>

        {/* 基线 */}
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 1176,
            width: 880,
            height: 1.4,
            background: `linear-gradient(90deg, ${rgba(T.line, 0.1)}, ${rgba(T.line, 0.5)}, ${rgba(T.line, 0.1)})`,
          }}
        />

        {steps.map((s, i) => {
          const s0 = 2.62 + i * 0.3;
          const g = outExpo(seg(t, s0, s0 + 0.52));
          const h = (s.cum / TOTAL) * H * g;
          const x = 108 + i * 222;
          return (
            <React.Fragment key={s.k}>
              {/* 柱 */}
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: 1176 - h,
                  width: 186,
                  height: h,
                  borderRadius: '10px 10px 0 0',
                  background: `linear-gradient(180deg, ${T.goldA} 0%, ${T.goldC} 42%, ${rgba(hexRgb(T.goldD), 0.85)} 100%)`,
                  boxShadow: `0 0 30px ${rgba(gold, 0.22)}, inset 0 2px 0 rgba(255,255,255,0.4)`,
                  opacity: g > 0.02 ? 1 : 0,
                }}
              />
              {/* 累计值 */}
              <div
                style={{
                  position: 'absolute',
                  left: x - 12,
                  top: 1176 - h - 52,
                  width: 210,
                  textAlign: 'center',
                  opacity: g > 0.55 ? 1 : 0,
                  transform: `translateY(${(1 - Math.max(0, (g - 0.55) / 0.45)) * 12}px)`,
                }}
              >
                <Txt size={28} color={T.bright} weight={700} font="num" lineHeight={38}>
                  {money(s.cum)}
                </Txt>
              </div>
              {/* 标签 */}
              <div
                style={{
                  position: 'absolute',
                  left: x - 12,
                  top: 1196,
                  width: 210,
                  textAlign: 'center',
                  opacity: outExpo(seg(t, s0 + 0.1, s0 + 0.4)),
                }}
              >
                <Txt size={27} color={rgba(cream, 0.86)} weight={500} letterSpacing={3} lineHeight={38}>
                  {s.k}
                </Txt>
                <Txt size={23} color={rgba(gold, 0.85)} font="num" letterSpacing={1} lineHeight={32} style={{ marginTop: 4 }}>
                  +{money(s.v)}
                </Txt>
              </div>
            </React.Fragment>
          );
        })}

        <Txt
          size={25}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={3}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 1330,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.9, 4.24)),
          }}
        >
          续期佣金 {Math.round((PARTS[1].v / TOTAL) * 100)}% —— 上个月的工作，这个月还在发钱
        </Txt>
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.22, 5.58]}>
        <Sfx name="sfx_gong" at={0.40} vol={0.45} />
        <EndCard theme={T} t={t} start={5.28} p={p} />
      </Chapter>
    </Stage>
  );
};
