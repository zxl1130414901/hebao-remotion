import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, makeRng, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 39 · 烟花礼赞版
 * 叙事：标题 → 四组确定性烟花依次绽放（三组各带一枚数据浮标）
 *      → 压轴大数字弹入 → 人物 + 二维码 + 日期
 * 粒子全部由 seed 推导，同一帧号永远同一图案。
 */

type Burst = { x: number; y: number; t0: number; n: number; cls: 'A' | 'B' | 'C'; seed: number; big?: boolean };
type Pt = { vx: number; vy: number; g: number; sz: number };

const BURSTS: Burst[] = [
  { x: 360, y: 640, t0: 1.3, n: 40, cls: 'A', seed: 11 },
  { x: 740, y: 560, t0: 2.55, n: 40, cls: 'B', seed: 23 },
  { x: 540, y: 690, t0: 3.85, n: 40, cls: 'C', seed: 37 },
  { x: 540, y: 500, t0: 5.2, n: 64, cls: 'A', seed: 53, big: true },
];

const buildPts = (b: Burst): Pt[] => {
  const rnd = makeRng(b.seed * 7919 + 13);
  const out: Pt[] = [];
  for (let i = 0; i < b.n; i++) {
    const ang = (i / b.n) * Math.PI * 2 + rnd() * 0.5;
    const spd = (b.big ? 380 : 280) * (0.55 + rnd() * 0.45);
    const sz = 5 + rnd() * 7;
    out.push({ vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 60, g: 260 + rnd() * 70, sz });
  }
  return out;
};

const PTS = BURSTS.map(buildPts);

const CAP_T: [number, number][] = [
  [1.75, 3.0],
  [3.0, 4.3],
  [4.3, 5.5],
];

export const Firework: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const colorOf = (cls: 'A' | 'B' | 'C') =>
    cls === 'A'
      ? { bg: T.goldB, glow: rgba(hexRgb(T.goldB), 0.9) }
      : cls === 'B'
      ? { bg: `rgb(${T.pale})`, glow: rgba(T.pale, 0.8) }
      : { bg: T.goldC, glow: rgba(hexRgb(T.goldC), 0.9) };

  const bn = outBack(seg(t, 5.45, 5.9), 1.4);
  const en = outExpo(seg(t, 6.2, 6.6));
  const pq = outBack(seg(t, 6.55, 6.95), 1.5);

  return (
    <Stage theme={T} brand={p.brand}>
      {/* 01 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 250,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 0.15, 0.5)),
        }}
      >
        <GoldText theme={T} size={70} weight={600} letterSpacing={16} lineHeight={96}>
          {p.slogan}
        </GoldText>
      </div>
      <Txt
        size={24}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={10}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 360,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 0.32, 0.6)),
        }}
      >
        FIREWORKS OF HONOR
      </Txt>

      {/* 02 烟花粒子 */}
      {BURSTS.map((b, bi) => {
        const life = b.big ? 2.4 : 1.9;
        const age = t - b.t0;
        if (age < 0 || age > life) return null;
        const col = colorOf(b.cls);
        return (
          <React.Fragment key={bi}>
            {PTS[bi].map((pt, i) => {
              const x = b.x + pt.vx * age;
              const y = b.y + pt.vy * age + 0.5 * pt.g * age * age;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: pt.sz,
                    height: pt.sz,
                    borderRadius: '50%',
                    background: col.bg,
                    boxShadow: `0 0 10px ${col.glow}`,
                    transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`,
                    opacity: Math.max(0, 1 - age / life),
                  }}
                />
              );
            })}
          </React.Fragment>
        );
      })}

      {/* 03 三段数据浮标 */}
      {CAP_T.map(([a, b], i) => {
        const pin = outExpo(seg(t, a, a + 0.3));
        const pout = seg(t, b - 0.25, b);
        const s = p.stats[i] ?? { v: '', k: '' };
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 880,
              width: 1080,
              textAlign: 'center',
              opacity: pin * (1 - pout),
              transform: `translateY(${((1 - pin) * 24).toFixed(1)}px)`,
            }}
          >
            <GoldText theme={T} size={96} font="num" lineHeight={110}>
              {s.v}
            </GoldText>
            <Txt
              size={28}
              color={rgba(T.soft, 0.85)}
              weight={300}
              letterSpacing={6}
              lineHeight={40}
              style={{ marginTop: 8 }}
            >
              {s.k}
            </Txt>
          </div>
        );
      })}

      {/* 04 压轴大数字 */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          width: 1080,
          textAlign: 'center',
          opacity: clamp01(seg(t, 5.45, 5.7)),
          transform: `scale(${lerp(1.35, 1, bn).toFixed(3)})`,
        }}
      >
        <GoldText theme={T} size={230} font="num" lineHeight={260} letterSpacing={-4}>
          {fmtNum(p.premium * outExpo(seg(t, 5.5, 6.1)), hasDec)}
        </GoldText>
      </div>
      <Txt
        size={32}
        color={rgba(T.soft, 0.9)}
        weight={300}
        letterSpacing={8}
        lineHeight={44}
        style={{
          position: 'absolute',
          top: 840,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 5.8, 6.15)),
        }}
      >
        {p.dlabel}
      </Txt>

      {/* 05 收尾 */}
      <Txt
        size={58}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={12}
        lineHeight={82}
        style={{
          position: 'absolute',
          top: 1000,
          width: 1080,
          textAlign: 'center',
          opacity: en,
          transform: `translateY(${((1 - en) * 24).toFixed(1)}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={27}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={38}
        style={{
          position: 'absolute',
          top: 1096,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.4, 6.75)),
        }}
      >
        {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={445}
        top={1210}
        size={190}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.55, 6.75)),
          transform: `scale(${lerp(0.85, 1, pq).toFixed(3)})`,
        }}
      />
      <Txt
        size={24}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 1444,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.85, 7.15)),
        }}
      >
        {p.qrCap}
      </Txt>
      <Txt
        size={26}
        color={rgba(T.mist, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={36}
        style={{
          position: 'absolute',
          top: 1560,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 7.0, 7.3)),
        }}
      >
        {p.dateText}
      </Txt>
      <Txt
        size={24}
        color={rgba(T.mist, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 1620,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 7.1, 7.4)),
        }}
      >
        {p.note}
      </Txt>
        <Sfx name="sfx_gong" at={5.72} vol={0.45} />
    </Stage>
  );
};
