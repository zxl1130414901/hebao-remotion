import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { SloganChars, sloganSize } from '../components/SloganChars';
import { THEMES } from '../theme';
import { clamp01, hexRgb, inOut, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { makePath, quadToCubic } from '../lib/curve';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 45 · 纸飞机航线版
 * 叙事：白纸显影 → 对折压扁 → 变纸飞机 → 虚线航线逐段生长
 *      → 飞机沿线飞行（沿途空投三块战报）→ 旗帜 + 人物 + 二维码
 */

const PATH = makePath([
  quadToCubic({ x: 320, y: 1150 }, { x: 520, y: 1020 }, { x: 560, y: 820 }),
  quadToCubic({ x: 560, y: 820 }, { x: 600, y: 620 }, { x: 810, y: 545 }),
]);
const D = 'M320 1150 Q 520 1020 560 820 Q 600 620 810 545';

const DROPS = [
  { left: 150, top: 640 },
  { left: 420, top: 430 },
  { left: 640, top: 600 },
];
const DROP_T: [number, number][] = [
  [0.36, 3.4],
  [0.66, 4.15],
  [0.97, 4.95],
];

export const Origami: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const pp = outBack(seg(t, 0.35, 0.85), 1.4);
  const fold = seg(t, 1.05, 1.85);
  const paperOp = clamp01(seg(t, 0.35, 0.6)) * (1 - clamp01(seg(t, 1.85, 2.1)));
  const planeOp = clamp01(seg(t, 1.85, 2.15));
  const dp = seg(t, 2.0, 2.5);
  const u = inOut(seg(t, 2.35, 5.6));

  const P = u > 0.01 ? PATH.at(u) : null;
  const bob = Math.sin(t * 7) * 4;

  const en = outExpo(seg(t, 6.05, 6.5));
  const pq = outBack(seg(t, 6.5, 6.9), 1.5);

  /* 钩子：0~0.6s 巨字砸落成形（0.8s 规则），纸折叠时上浮淡出让位 */
  const hookIn = clamp01(seg(t, 0.06, 0.3));
  const hookOut = 1 - clamp01(seg(t, 1.0, 1.45));
  const hookTxt = p.slogan || '捷报频传';
  const hookSize = sloganSize(hookTxt, 150);

  return (
    <Stage theme={T} brand={p.brand}>
      {/* 巨字钩子（hebao-design ①幕：0.8s 内主视觉成形） */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: hookIn * hookOut,
          transform: `translateY(${((1 - hookOut) * -36).toFixed(1)}px)`,
          pointerEvents: 'none',
        }}
      >
        <SloganChars
          theme={T}
          t={t}
          text={hookTxt}
          top={296}
          height={Math.round(hookSize * 1.3)}
          size={hookSize}
          lineHeight={Math.round(hookSize * 1.25)}
          start={0.06}
          stagger={0.09}
          dur={0.26}
        />
      </div>
      {/* 航线 */}
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <mask id="origamiReveal">
            <path
              d={D}
              fill="none"
              stroke="#fff"
              strokeWidth={20}
              strokeLinecap="round"
              strokeDasharray={PATH.total}
              strokeDashoffset={PATH.total * (1 - dp)}
            />
          </mask>
        </defs>
        <path d={D} fill="none" stroke={rgba(hexRgb(T.goldC), 0.16)} strokeWidth={3} strokeDasharray="14 12" />
        <path
          d={D}
          fill="none"
          stroke={rgba(hexRgb(T.goldC), 0.95)}
          strokeWidth={3}
          strokeDasharray="14 12"
          mask="url(#origamiReveal)"
        />
      </svg>

      {/* 白纸 → 折叠 */}
      <div
        style={{
          position: 'absolute',
          left: 170,
          top: 1010,
          width: 340,
          height: 340,
          opacity: paperOp * clamp01(seg(t, 0.35, 0.6)),
          background: `linear-gradient(160deg,${rgba(hexRgb(T.cream), 0.98)},${rgba(
            hexRgb(T.cream2),
            0.9
          )})`,
          border: `1px solid ${rgba(hexRgb(T.goldD), 0.4)}`,
          boxShadow: '0 20px 50px rgba(0,0,0,.3)',
          transform: `rotate(${(-7 - 38 * fold).toFixed(2)}deg) scale(${lerp(
            0.85,
            1,
            pp
          ).toFixed(3)}) scaleY(${(1 - 0.62 * inOut(fold)).toFixed(3)})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 'calc(50% - 1px)',
            width: '100%',
            height: 2,
            background: rgba(hexRgb(T.goldD), 0.45),
          }}
        />
      </div>

      {/* 纸飞机 */}
      <svg
        width={150}
        height={150}
        viewBox="0 0 150 150"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          opacity: planeOp,
          transform: P
            ? `translate(${(P.x - 75).toFixed(1)}px,${(P.y - 75 + bob).toFixed(1)}px) rotate(${P.ang.toFixed(1)}deg)`
            : 'translate(245px,1075px)',
        }}
      >
        <polygon
          points="10,80 140,22 74,88"
          fill={rgba(hexRgb(T.cream), 0.98)}
          stroke={rgba(hexRgb(T.goldD), 0.55)}
        />
        <polygon
          points="74,88 140,22 96,128"
          fill={rgba(hexRgb(T.cream2), 0.92)}
          stroke={rgba(hexRgb(T.goldD), 0.55)}
        />
        <polygon points="74,88 96,128 62,104" fill={rgba(hexRgb(T.goldC), 0.85)} />
      </svg>

      {/* 终点旗 */}
      <div
        style={{
          position: 'absolute',
          left: 760,
          top: 420,
          opacity: clamp01(seg(t, 2.5, 2.9)),
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 0,
            width: 6,
            height: 260,
            background: `linear-gradient(180deg,${rgba(T.line, 0.9)},${rgba(T.line, 0.2)})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 6,
            width: 190,
            height: 96,
            transformOrigin: '0 50%',
            transform: `skewY(${(Math.sin(t * 5) * 4).toFixed(2)}deg)`,
            background: `linear-gradient(160deg,${T.goldC},${T.goldD})`,
            clipPath: 'polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            letterSpacing: 6,
            color: rgba(hexRgb(T.goldA), 0.96),
            fontWeight: 600,
          }}
        >
          荣耀之巅
        </div>
      </div>

      {/* 空投战报 */}
      {DROPS.map((d, i) => {
        const st = DROP_T[i][1];
        const e = outBack(seg(t, st, st + 0.4), 1.7);
        const s = p.stats[i] ?? { v: '', k: '' };
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: d.left,
              top: d.top,
              width: 280,
              padding: '16px 20px',
              textAlign: 'center',
              opacity: clamp01(seg(t, st, st + 0.16)),
              transform: `translateY(${((1 - e) * -26).toFixed(1)}px) scale(${lerp(0.9, 1, e).toFixed(3)})`,
              border: `1px solid ${rgba(T.line, 0.55)}`,
              background: rgba(hexRgb(T.archbg), 0.78),
              borderRadius: 10,
              boxShadow: '0 14px 34px rgba(0,0,0,.4)',
            }}
          >
            <GoldText theme={T} size={52} font="num" lineHeight={62}>
              {s.v}
            </GoldText>
            <Txt
              size={22}
              color={rgba(T.soft, 0.8)}
              weight={300}
              letterSpacing={3}
              lineHeight={29}
              style={{ marginTop: 4 }}
            >
              {s.k}
            </Txt>
          </div>
        );
      })}

      {/* 收尾 */}
      <Txt
        size={56}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={12}
        lineHeight={78}
        style={{
          position: 'absolute',
          top: 1360,
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
          top: 1450,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.3, 6.65)),
        }}
      >
        {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={455}
        top={1530}
        size={170}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.5, 6.7)),
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
          top: 1736,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.8, 7.1)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_gong" at={0.75} vol={0.42} />
    </Stage>
  );
};
