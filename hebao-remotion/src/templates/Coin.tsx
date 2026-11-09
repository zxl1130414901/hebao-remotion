import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, inOut, lerp, makeRng, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 43 · 鎏金铸币版
 * 叙事：压铸机落下 → 金币成型（受压微倾）→ 火花四溅 → 金币翻面亮出保费
 *      → 高光扫过 → 成就句 + 人物 + 二维码
 */

type Spark = { vx: number; vy: number; ph: number };
const SPARKS: Spark[] = (() => {
  const rnd = makeRng(777);
  const out: Spark[] = [];
  for (let i = 0; i < 26; i++) {
    out.push({ vx: (rnd() * 2 - 1) * 420, vy: -(120 + rnd() * 380), ph: rnd() * 2 });
  }
  return out;
})();

export const Coin: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const pressIn = outExpo(seg(t, 0.55, 1.3));
  const pressOut = inOut(seg(t, 1.75, 2.25));
  const pressOp = clamp01(seg(t, 0.4, 0.7));

  const c3Op = clamp01(seg(t, 1.25, 1.55));
  const pressTilt = Math.sin(clamp01(seg(t, 1.25, 1.75)) * Math.PI) * 14;
  const flip = -180 * inOut(seg(t, 3.7, 4.7));

  const age = t - 1.45;
  const shp = seg(t, 4.85, 5.35);
  const bd = outExpo(seg(t, 5.55, 6.0));
  const pq = outBack(seg(t, 6.35, 6.75), 1.5);

  return (
    <Stage theme={T} brand={p.brand}>
      {/* 压铸机 */}
      <div
        style={{
          position: 'absolute',
          left: 390,
          top: 300,
          width: 300,
          height: 120,
          opacity: pressOp,
          transform: `translateY(${(pressIn * 104 - pressOut * 104).toFixed(1)}px)`,
          background: `linear-gradient(180deg,${rgba(T.line, 0.9)},${rgba(hexRgb(T.goldD), 0.7)})`,
          borderRadius: 8,
          boxShadow: '0 16px 40px rgba(0,0,0,.4)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 46,
            width: '100%',
            textAlign: 'center',
            fontSize: 22,
            letterSpacing: 8,
            color: rgba(hexRgb(T.goldA), 0.85),
          }}
        >
          HONOR MINT
        </div>
      </div>

      {/* 砧座 */}
      <div
        style={{
          position: 'absolute',
          left: 330,
          top: 992,
          width: 420,
          height: 26,
          borderRadius: 6,
          opacity: pressOp,
          background: `linear-gradient(180deg,${rgba(hexRgb(T.goldD), 0.8)},${rgba(
            hexRgb(T.goldD),
            0.35
          )})`,
        }}
      />

      {/* 金币 */}
      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 520,
          width: 460,
          height: 460,
          perspective: 1500,
          opacity: c3Op,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${pressTilt.toFixed(2)}deg) rotateY(${flip.toFixed(2)}deg)`,
          }}
        >
          {/* 正面：边铭 + 人物 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backfaceVisibility: 'hidden',
              background: `radial-gradient(circle at 42% 34%,${T.goldA} 0%,${T.goldB} 34%,${T.goldC} 62%,${T.goldD} 100%)`,
              boxShadow: `0 30px 70px rgba(0,0,0,.45), inset 0 0 0 10px ${rgba(
                hexRgb(T.goldD),
                0.35
              )}, inset 0 0 60px ${rgba(hexRgb(T.goldD), 0.28)}`,
            }}
          >
            <svg width={460} height={460} viewBox="0 0 460 460" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <path id="coinRim" d="M230 52 a178 178 0 1 1 -0.01 0" />
              </defs>
              <text
                fontSize={26}
                letterSpacing={10}
                fontWeight={600}
                fill={rgba(hexRgb(T.goldD), 0.95)}
              >
                <textPath href="#coinRim" startOffset="2%">
                  {`TAIKANG · HONOR COIN · 2026 ·`}
                </textPath>
              </text>
            </svg>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 200,
                height: 200,
                marginLeft: -100,
                marginTop: -100,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `5px solid ${rgba(hexRgb(T.goldD), 0.7)}`,
              }}
            >
              <Img
                src={p.photo || staticFile('assets/portrait.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'sepia(.55) contrast(1.05)',
                }}
              />
            </div>
          </div>

          {/* 背面：保费 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: `radial-gradient(circle at 58% 34%,${T.goldB} 0%,${T.goldC} 48%,${T.goldD} 100%)`,
              boxShadow: `0 30px 70px rgba(0,0,0,.45), inset 0 0 0 10px ${rgba(hexRgb(T.goldD), 0.35)}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: 120,
                lineHeight: '140px',
                color: rgba(hexRgb(T.goldA), 0.95),
                fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
                fontWeight: 700,
                textShadow: `0 3px 0 ${rgba(hexRgb(T.goldD), 0.6)}`,
              }}
            >
              {fmtNum(p.premium * outExpo(seg(t, 4.1, 4.9)), hasDec)}
            </div>
            <div
              style={{
                fontSize: 26,
                letterSpacing: 5,
                color: rgba(hexRgb(T.goldA), 0.9),
                marginTop: 8,
                fontWeight: 500,
              }}
            >
              {p.dlabel}
            </div>
          </div>
        </div>
      </div>

      {/* 高光扫过 */}
      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 520,
          width: 460,
          height: 460,
          borderRadius: '50%',
          overflow: 'hidden',
          opacity: shp > 0 && shp < 1 ? 0.85 : 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${((shp * 2 - 1) * 520).toFixed(0)}px)`,
            background:
              'linear-gradient(115deg,rgba(255,255,255,0) 38%,rgba(255,255,255,.75) 50%,rgba(255,255,255,0) 62%)',
          }}
        />
      </div>

      {/* 火花 */}
      {SPARKS.map((s, i) => {
        const a = age - s.ph * 0.12;
        if (a < 0 || a > 0.9) return null;
        const x = 540 + s.vx * a;
        const y = 740 + s.vy * a + 700 * a * a;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: T.goldB,
              boxShadow: `0 0 8px ${rgba(hexRgb(T.goldB), 0.9)}`,
              transform: `translate(${x.toFixed(0)}px,${y.toFixed(0)}px)`,
              opacity: Math.max(0, 1 - a / 0.9),
            }}
          />
        );
      })}

      {/* 成就 + 收尾 */}
      <div
        style={{
          position: 'absolute',
          top: 1030,
          width: 1080,
          textAlign: 'center',
          opacity: bd,
          transform: `translateY(${((1 - bd) * 26).toFixed(1)}px)`,
        }}
      >
        <GoldText theme={T} size={52} weight={600} letterSpacing={12} lineHeight={72}>
          十月铸币 · 战功入册
        </GoldText>
      </div>
      <Txt
        size={30}
        color={rgba(T.pale, 0.9)}
        weight={400}
        letterSpacing={5}
        lineHeight={42}
        style={{
          position: 'absolute',
          top: 1130,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 5.8, 6.15)),
        }}
      >
        {p.name} · {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={450}
        top={1220}
        size={180}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.35, 6.55)),
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
          top: 1438,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.65, 6.95)),
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
          top: 1540,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.85, 7.15)),
        }}
      >
        {p.dateText}
      </Txt>
        <Sfx name="sfx_chime" at={6.60} vol={0.3} />
    </Stage>
  );
};
