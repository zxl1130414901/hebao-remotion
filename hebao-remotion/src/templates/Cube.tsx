import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, inOut, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 42 · 战绩魔方版
 * 叙事：正四面（立方体四侧面）逐面停留 —— 宣言 / 三项战报 / 主角 / 保费
 *      标签随面同步，最后落到人物 + 二维码
 */

const FACE_LABS = ['FACE 01 · 宣言', 'FACE 02 · 战报', 'FACE 03 · 主角', 'FACE 04 · 战果'];
const FACE_BASE: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: 440,
  height: 440,
  border: '2px solid rgba(255,255,255,.18)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backfaceVisibility: 'hidden',
  boxShadow: 'inset 0 0 50px rgba(0,0,0,.35)',
};

export const Cube: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const faceBg = rgba(hexRgb(T.archbg), 0.88);
  const faceBorder = `2px solid ${rgba(T.line, 0.55)}`;

  const rx = (a: number, b: number) => -90 * inOut(seg(t, a, b));
  const ry = rx(1.0, 2.2) + rx(3.2, 4.4) + rx(5.4, 6.5);
  const idx = ry < -230 ? 3 : ry < -140 ? 2 : ry < -50 ? 1 : 0;

  const dp = outExpo(seg(t, 5.5, 6.3));
  const en = outExpo(seg(t, 6.7, 7.1));
  const pq = outBack(seg(t, 7.05, 7.4), 1.5);

  return (
    <Stage theme={T} brand={p.brand}>
      {/* 3D 场景 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 330,
          width: 1080,
          height: 760,
          perspective: 1700,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 320,
            top: 140,
            width: 440,
            height: 440,
            transformStyle: 'preserve-3d',
            opacity: clamp01(seg(t, 0.4, 0.9)),
            transform: `rotateX(-8deg) rotateY(${ry.toFixed(2)}deg)`,
          }}
        >
          {/* A 宣言 */}
          <div style={{ ...FACE_BASE, background: faceBg, border: faceBorder, transform: 'translateZ(220px)' }}>
            <GoldText
              theme={T}
              size={110}
              weight={700}
              letterSpacing={16}
              lineHeight={150}
              style={{ whiteSpace: 'nowrap' }}
            >
              {p.slogan}
            </GoldText>
            <Txt
              size={26}
              color={rgba(T.soft, 0.85)}
              weight={300}
              letterSpacing={8}
              lineHeight={36}
              style={{ marginTop: 18 }}
            >
              SLOGAN OF OCTOBER
            </Txt>
          </div>

          {/* B 三项 */}
          <div
            style={{
              ...FACE_BASE,
              background: faceBg,
              border: faceBorder,
              transform: 'rotateY(90deg) translateZ(220px)',
              gap: 30,
            }}
          >
            {p.stats.slice(0, 3).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <GoldText theme={T} size={74} font="num" lineHeight={84}>
                  {s.v}
                </GoldText>
                <Txt size={25} color={rgba(T.soft, 0.85)} weight={300} letterSpacing={3} lineHeight={36}>
                  {s.k}
                </Txt>
              </div>
            ))}
          </div>

          {/* C 主角 */}
          <div
            style={{
              ...FACE_BASE,
              background: faceBg,
              border: faceBorder,
              transform: 'rotateY(180deg) translateZ(220px)',
            }}
          >
            <div
              style={{
                width: 190,
                height: 190,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `4px solid ${rgba(hexRgb(T.goldC), 0.85)}`,
                boxShadow: `0 0 24px ${rgba(hexRgb(T.goldB), 0.5)}`,
              }}
            >
              <Img
                src={p.photo || staticFile('assets/portrait.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <Txt
              size={58}
              color="#fff"
              weight={600}
              font="serif"
              letterSpacing={10}
              lineHeight={80}
              style={{ marginTop: 22 }}
            >
              {p.name}
            </Txt>
            <Txt
              size={24}
              color={rgba(T.soft, 0.85)}
              weight={300}
              letterSpacing={3}
              lineHeight={34}
              style={{ marginTop: 6 }}
            >
              {p.role}
            </Txt>
          </div>

          {/* D 保费 */}
          <div
            style={{
              ...FACE_BASE,
              background: faceBg,
              border: faceBorder,
              transform: 'rotateY(270deg) translateZ(220px)',
            }}
          >
            <Txt size={26} color={rgba(T.soft, 0.85)} weight={300} letterSpacing={5} lineHeight={36}>
              {p.dlabel}
            </Txt>
            <GoldText theme={T} size={130} font="num" lineHeight={150} style={{ marginTop: 14 }}>
              {fmtNum(p.premium * dp, hasDec)}
            </GoldText>
            <Txt
              size={30}
              color={rgba(T.soft, 0.9)}
              weight={300}
              letterSpacing={6}
              lineHeight={42}
              style={{ marginTop: 16 }}
            >
              万元 · {p.dateText}
            </Txt>
          </div>
        </div>
      </div>

      {/* 底座投影 */}
      <div
        style={{
          position: 'absolute',
          left: 340,
          top: 900,
          width: 400,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(0,0,0,.4)',
          filter: 'blur(14px)',
        }}
      />

      {/* 面标签 */}
      <Txt
        size={32}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={10}
        lineHeight={44}
        style={{
          position: 'absolute',
          top: 960,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 1.0, 1.3)),
        }}
      >
        {FACE_LABS[idx]}
      </Txt>

      {/* 收尾 */}
      <Txt
        size={50}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={10}
        lineHeight={70}
        style={{
          position: 'absolute',
          top: 1100,
          width: 1080,
          textAlign: 'center',
          opacity: en,
          transform: `translateY(${((1 - en) * 22).toFixed(1)}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={26}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={36}
        style={{
          position: 'absolute',
          top: 1180,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.9, 7.25)),
        }}
      >
        {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={450}
        top={1270}
        size={180}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 7.05, 7.22)),
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
          top: 1488,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 7.2, 7.5)),
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
          top: 1590,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 7.35, 7.6)),
        }}
      >
        {p.dateText}
      </Txt>
        <Sfx name="sfx_chime" at={7.25} vol={0.3} />
    </Stage>
  );
};
