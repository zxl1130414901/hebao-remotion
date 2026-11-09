import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, inOut, lerp, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 36 · 冲天火箭版
 * 叙事：标语 → 火箭点火整程升空（一镜到底）→ 云层下扫 + 海拔 HUD 累计
 *      → 三块里程碑随掠过点亮 → 入轨成功 → 底部定版板升起
 * 原版 bug 修正：火箭鼻锥原本与箭体之间空 30px，已贴合；
 *              二维码说明原本被误放到画面顶部（top:306），已归位到定版板内。
 */

const CLOUDS = [
  { left: 80, top: 300, w: 340, h: 110 },
  { left: 660, top: 560, w: 420, h: 130 },
  { left: 140, top: 920, w: 300, h: 100 },
  { left: 640, top: 1180, w: 380, h: 120 },
];

/** 里程碑牌：[阈值, 固定 top] */
const MS_TOP = [640, 920, 1200];
const MS_TH = [0.3, 0.6, 0.92];

export const Rocket: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const fly = inOut(seg(t, 1.15, 5.2));
  const so = outExpo(seg(t, 0.15, 0.45));
  const so2 = seg(t, 0.95, 1.3);
  const rkOp = clamp01(seg(t, 0.55, 0.95));
  const flameOn = clamp01(seg(t, 1.15, 1.45)) * (1 - seg(t, 5.3, 5.9));
  const hudOp = clamp01(seg(t, 1.35, 1.65)) * (1 - seg(t, 5.35, 5.7));
  const dockP = outExpo(seg(t, 5.35, 5.9));
  const shP = outExpo(seg(t, 6.3, 6.92));

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 云层（升空视差） */}
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c.left,
            top: c.top,
            width: c.w,
            height: c.h,
            borderRadius: '50%',
            background: rgba(T.soft, 0.1),
            filter: 'blur(2px)',
            transform: `translateY(${((t * (150 + (i + 1) * 65)) % 2400 - 1400).toFixed(1)}px)`,
            opacity: clamp01(seg(t, 1.0, 1.6)) * (0.45 + 0.3 * Math.sin((i + 1) * 2.1 + t * 0.7)),
          }}
        />
      ))}

      {/* 01 标语 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 560,
          width: 1080,
          textAlign: 'center',
          opacity: so * (1 - so2),
          transform: `translateY(${(1 - so) * 30 - so2 * 24}px)`,
        }}
      >
        <GoldText theme={T} size={118} letterSpacing={24} lineHeight={168}>
          {p.slogan}
        </GoldText>
      </div>
      <Txt
        size={30}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={14}
        lineHeight={42}
        style={{
          position: 'absolute',
          top: 764,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 0.3, 0.58)) * (1 - so2),
        }}
      >
        OCTOBER LAUNCH · TO THE TOP
      </Txt>

      {/* 02 火箭 */}
      <div
        style={{
          position: 'absolute',
          left: 430,
          top: 340,
          width: 220,
          height: 560,
          opacity: rkOp,
          transform: `translateY(${((1 - fly) * 580).toFixed(1)}px)`,
        }}
      >
        {/* 箭体 */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 60,
            width: 100,
            height: 330,
            borderRadius: '50px 50px 26px 26px',
            background: `linear-gradient(90deg,${rgba(hexRgb(T.cream), 0.72)},${rgba(
              hexRgb(T.cream),
              0.98
            )} 45%,${rgba(hexRgb(T.cream), 0.78)})`,
            boxShadow: 'inset -8px 0 18px rgba(0,0,0,.22)',
          }}
        />
        {/* 鼻锥 */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: -20,
            width: 100,
            height: 80,
            background: `linear-gradient(180deg,${T.goldB},${T.goldD})`,
            clipPath: 'polygon(50% 0,100% 100%,0 100%)',
          }}
        />
        {/* 舷窗（人物照） */}
        <div
          style={{
            position: 'absolute',
            left: 84,
            top: 118,
            width: 52,
            height: 52,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `4px solid ${rgba(hexRgb(T.goldD), 0.92)}`,
            background: '#111',
            boxShadow: `0 0 10px ${rgba(hexRgb(T.goldB), 0.5)}`,
          }}
        >
          <Img
            src={p.photo || staticFile('assets/portrait.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        {/* 尾翼 */}
        <div
          style={{
            position: 'absolute',
            left: 6,
            top: 318,
            width: 54,
            height: 92,
            background: `linear-gradient(180deg,${T.goldB},${T.goldD})`,
            clipPath: 'polygon(100% 0,100% 100%,0 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 318,
            width: 54,
            height: 92,
            background: `linear-gradient(180deg,${T.goldB},${T.goldD})`,
            clipPath: 'polygon(0 0,0 100%,100% 100%)',
          }}
        />
        {/* 尾焰 */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 394,
            width: 60,
            height: 160,
            opacity: flameOn * (0.75 + 0.25 * Math.abs(Math.sin(t * 34))),
            transform: `scaleY(${(0.8 + 0.35 * Math.abs(Math.sin(t * 27))).toFixed(3)})`,
            background: `radial-gradient(ellipse at 50% 0,${rgba(hexRgb(T.goldA), 1)} 0%,${rgba(
              hexRgb(T.goldC),
              0.92
            )} 34%,rgba(255,120,40,.55) 60%,rgba(255,120,40,0) 78%)`,
            borderRadius: '50% 50% 50% 50%/26% 26% 74% 74%',
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* 发射台横线 */}
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 1330,
          width: 480,
          height: 6,
          opacity: 0.9 * (1 - seg(t, 1.5, 2.1)),
          background: `linear-gradient(90deg,${rgba(T.line, 0)},${rgba(T.line, 0.55)},${rgba(
            T.line,
            0
          )})`,
        }}
      />

      {/* 03 海拔 HUD */}
      <div style={{ position: 'absolute', left: 84, top: 268, width: 300, opacity: hudOp }}>
        <Txt size={24} color={rgba(T.soft, 0.85)} weight={300} letterSpacing={5} lineHeight={34}>
          保费海拔
        </Txt>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
          <GoldText theme={T} size={74} font="num" lineHeight={84}>
            {fmtNum(p.premium * fly, hasDec)}
          </GoldText>
          <Txt size={26} color={rgba(T.soft, 0.85)} weight={300} lineHeight={36}>
            万元
          </Txt>
        </div>
        <div
          style={{
            marginTop: 12,
            height: 5,
            borderRadius: 3,
            background: rgba(T.line, 0.16),
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(fly * 100).toFixed(1)}%`,
              background: `linear-gradient(90deg,${T.goldD},${T.goldB})`,
              boxShadow: `0 0 12px ${rgba(hexRgb(T.goldB), 0.6)}`,
            }}
          />
        </div>
      </div>

      {/* 04 里程碑牌 */}
      {MS_TOP.map((top, i) => {
        const st = 1.15 + MS_TH[i] * 4.05;
        const e = outExpo(seg(t, st, st + 0.2));
        const op = clamp01(e) * (1 - seg(t, 5.3, 5.62));
        const s = p.stats[i] ?? { v: '', k: '' };
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              right: 84,
              top,
              width: 330,
              padding: '16px 22px',
              opacity: op,
              transform: `translateX(${((1 - e) * 46).toFixed(1)}px)`,
              border: `1px solid ${rgba(T.line, 0.5)}`,
              borderRight: `4px solid ${rgba(hexRgb(T.goldC), 0.9)}`,
              background: rgba(hexRgb(T.archbg), 0.55),
            }}
          >
            <GoldText theme={T} size={44} font="num" lineHeight={52}>
              {s.v}
            </GoldText>
            <Txt
              size={22}
              color={rgba(T.soft, 0.85)}
              weight={300}
              letterSpacing={3}
              lineHeight={31}
              style={{ marginTop: 4 }}
            >
              {s.k}
            </Txt>
          </div>
        );
      })}

      {/* 05 入轨成功 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 196,
          width: 1080,
          textAlign: 'center',
          opacity: dockP,
          transform: `scale(${lerp(0.85, 1, dockP).toFixed(3)})`,
        }}
      >
        <GoldText theme={T} size={46} weight={600} letterSpacing={12} lineHeight={64}>
          {p.slogan2}
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
          top: 264,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 5.55, 5.95)),
        }}
      >
        MISSION COMPLETE · DOCKED AT GLORY
      </Txt>
      <div
        style={{
          position: 'absolute',
          left: 470,
          top: 330,
          width: 140,
          height: 60,
          borderRadius: '50%',
          border: `2px solid ${rgba(hexRgb(T.goldC), 0.8)}`,
          boxShadow: `0 0 22px ${rgba(hexRgb(T.goldB), 0.5)}`,
          opacity: clamp01(seg(t, 5.35, 5.6)) * (0.5 + 0.5 * Math.abs(Math.sin(t * 3))),
          transform: `scale(${lerp(1.6, 1, dockP).toFixed(3)})`,
        }}
      />

      {/* 06 底部定版板 */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 1330,
          width: 940,
          height: 430,
          opacity: clamp01(seg(t, 6.3, 6.6)),
          transform: `translateY(${((1 - shP) * 420).toFixed(1)}px)`,
          background: rgba(hexRgb(T.archbg), 0.78),
          border: `1px solid ${rgba(T.line, 0.55)}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 56,
            top: 0,
            width: 594,
            height: 430,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Txt size={66} color="#fff" weight={600} font="serif" letterSpacing={10} lineHeight={96}>
            {p.name}
          </Txt>
          <Txt
            size={28}
            color={rgba(T.soft, 0.85)}
            weight={300}
            letterSpacing={4}
            lineHeight={40}
            style={{ marginTop: 10 }}
          >
            {p.role}
          </Txt>
          <div
            style={{
              display: 'inline-block',
              marginTop: 22,
              height: 56,
              lineHeight: '54px',
              padding: '0 30px',
              border: `1px solid ${rgba(T.line, 0.5)}`,
              borderRadius: 28,
              fontSize: 24,
              letterSpacing: 3,
              color: T.bright,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              alignSelf: 'flex-start',
            }}
          >
            {p.pill}
          </div>
        </div>

        <QrBlock
          theme={T}
          left={706}
          top={96}
          size={190}
          src={p.qr}
        />
        <Txt
          size={22}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={3}
          lineHeight={32}
          style={{
            position: 'absolute',
            left: 640,
            top: 306,
            width: 320,
            textAlign: 'center',
            opacity: outExpo(seg(t, 6.9, 7.2)),
          }}
        >
          {p.qrCap}
        </Txt>
      </div>
        <Sfx name="sfx_whoosh" at={1.15} vol={0.35} />
    </Stage>
  );
};
