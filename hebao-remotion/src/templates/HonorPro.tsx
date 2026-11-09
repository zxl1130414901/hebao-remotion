import { Sfx } from '../components/Sfx';
import React from 'react';
import { Audio, Img, staticFile, useCurrentFrame } from 'remotion';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { Rule } from '../components/Rule';
import { SloganChars } from '../components/SloganChars';
import { CeremonyEnd } from '../components/CeremonyEnd';
import { FONT_SERIF, THEMES } from '../theme';
import { clamp01, hexRgb, inOut, lerp, makeRng, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 喜庆红金 · PRO 演示版 —— 与 honor 同数据同节奏，叠加电影感增强层。
 * 仅用于对比「复刻版 vs 提质版」，验证 Remotion 链路的质量上限：
 *   1. 摄影机语言：全片缓推 + 数字落定时镜头震动（逐帧衰减，任何机器一致）
 *   2. 冲击反馈：数字落定瞬间的缩放冲击 + 金色余晖 + 扩散光环 + 实体物理彩带
 *   3. 光效：两道斜向掠光的 screen 混合扫光（恭贺砸落 / 定版标题各一道）
 *   4. 质感：逐帧变化的胶片颗粒（feTurbulence，帧号即种子）+ 暗角
 *   5. 人物：拱门照片 Ken-Burns 缓推 + 背后金色轮廓光
 *   6. 编码：CRF 16 高码率出片（对比命令行参数即可复现）
 */

const LAND = 4.16; // 数字滚动落定时刻（start 2.98 + dur 1.18）

/* ---------- 金色彩带雨：贝塞尔波浪丝带，波形沿带身流动，确定性 ---------- */
type Ribbon = {
  x0: number; delay: number; vy: number;
  swayA: number; swayW: number; ph: number;
  tilt: number; spin: number; curl: number;
  len: number; amp: number; waves: number;
  sw: number; hue: number;
};
const RIBBONS: Ribbon[] = (() => {
  const rng = makeRng(20264160);
  /* x 均匀铺开 + 抖动，避免扎堆；delay 拉开形成持续撒落 */
  return Array.from({ length: 18 }, (_, i) => ({
    x0: (((i + 0.5) / 18) * 1080 + (rng() - 0.5) * 90 + 1080) % 1080,
    delay: (i % 6) * 0.14 + rng() * 0.2,
    vy: 500 + rng() * 190,
    swayA: 30 + rng() * 44,
    swayW: 1.1 + rng() * 0.7,
    ph: rng() * Math.PI * 2,
    tilt: (rng() - 0.5) * 34,
    spin: (rng() - 0.5) * 260,
    curl: 3.2 + rng() * 1.8,
    len: 290 + rng() * 150,
    amp: 22 + rng() * 14,
    waves: 1.4 + rng() * 0.8,
    sw: 6 + rng() * 2.5,
    hue: Math.floor(rng() * 6),
  }));
})();

/* 六色庆祝配色：[主色, 亮部] —— 渐变让带身有翻转受光感 */
const RIBBON_COLORS: [string, string][] = [
  ['#FFD34D', '#FFF3C4'], // 金
  ['#FF9F45', '#FFE3B8'], // 橙黄
  ['#FF6B8A', '#FFD1DC'], // 粉
  ['#4ECDC4', '#C9F7F1'], // 青
  ['#9B7BFF', '#E3D9FF'], // 紫
  ['#FFFFFF', '#FFE9A8'], // 白金
];

/** 斜向掠光：band 从左扫到右，screen 混合只提亮不改色 */
const Sweep: React.FC<{ t: number; at: number; dur: number; op?: number }> = ({ t, at, dur, op = 0.5 }) => {
  const p = seg(t, at, at + dur);
  if (p <= 0 || p >= 1) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: -300,
          bottom: -300,
          left: 0,
          width: 480,
          transform: `translateX(${lerp(-820, 1900, p)}px) rotate(13deg)`,
          background:
            'linear-gradient(90deg, rgba(255,220,150,0) 0%, rgba(255,228,168,0.55) 50%, rgba(255,220,150,0) 100%)',
          mixBlendMode: 'screen',
          opacity: op * Math.sin(p * Math.PI),
        }}
      />
    </div>
  );
};

/** 胶片颗粒：帧号作 turbulence 种子，逐帧变化但完全确定 */

export const HonorPro: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const frame = useCurrentFrame();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const sealChar = p.sealChar && p.sealChar !== '泰' ? p.sealChar : '荣';
  const goldRgb = hexRgb(T.goldA);

  /* ── 1. 摄影机：数字落定的震动 + 微缩放脉冲 ── */
  const hitAge = t - LAND;
  const shakeEnv = hitAge > -0.02 ? Math.exp(-hitAge * 7) : 0;
  const shake = Math.sin(hitAge * 62) * 9 * shakeEnv;
  const punch = 1 + 0.014 * shakeEnv;

  /* ── 2. 数字冲击组 ── */
  const landP = clamp01(seg(t, LAND - 0.06, LAND + 0.32));
  const numScale = lerp(1.18, 1, outBack(landP, 2.4));
  const glow = clamp01(1 - seg(t, LAND, LAND + 1.1));
  const ringP = outExpo(seg(t, LAND, LAND + 0.75));
  const confAge = hitAge;
  /* 数字砸落的运动模糊：过冲速度越大越糊 */
  const numBlur = 3.0 * Math.exp(-Math.max(0, hitAge) * 9) * (hitAge > 0 ? 1 : 0);

  /* ── 5. 人物 Ken-Burns ── */
  const kb = inOut(seg(t, 4.5, 6.3));

  return (
    <Stage theme={T} brand={p.brand} brandLayout="top" bottomtag="TOP　PERFORMER　OF　THE　MONTH" bgm={false} sweep={false}>
      {/* 声轨：纯代码合成的喜庆 BGM，钟声与数字落定（4.16s）逐帧对齐 */}
      <Audio src={staticFile('assets/honor_bgm.wav')} />
      {/* 摄影机层：包住全部章节 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${(shake * 0.8).toFixed(2)}px, ${shake.toFixed(2)}px) scale(${punch.toFixed(4)})`,
        }}
      >
        {/* 01 印章启幕 */}
        <Chapter t={t} in={[0.04, 0.42]} out={[1.16, 1.5]}>
          {(() => {
            const sealP = outExpo(seg(t, 0.06, 0.95));
            const p1a = outExpo(seg(t, 0.74, 1.06));
            const p1b = outExpo(seg(t, 0.86, 1.18));
            return (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: 330,
                    top: 650,
                    width: 420,
                    height: 420,
                    opacity: clamp01(seg(t, 0.06, 0.45)),
                    transform: `scale(${lerp(1.16, 1, sealP)})`,
                    filter: `drop-shadow(0 14px ${40 * (1 - sealP) + 18}px ${rgba(goldRgb, 0.28 * (1 - sealP * 0.6))})`,
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${rgba(T.line, 0.65)}` }} />
                  <div style={{ position: 'absolute', inset: 28, borderRadius: '50%', border: `1px solid ${rgba(T.line, 0.28)}` }} />
                  <GoldText
                    theme={T}
                    size={200}
                    weight={700}
                    lineHeight={420}
                    style={{ position: 'absolute', left: 0, top: 0, width: 420, textAlign: 'center', opacity: clamp01(seg(t, 0.14, 0.55)) }}
                  >
                    {sealChar}
                  </GoldText>
                </div>
                <Rule theme={T} t={t} start={0.68} dur={0.34} left={500} top={1150} width={80} solid opacity={0.6} />
                <Txt
                  size={40}
                  color={T.cream}
                  weight={400}
                  font="serif"
                  letterSpacing={6}
                  lineHeight={56}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 1206,
                    width: 1080,
                    textAlign: 'center',
                    opacity: p1a,
                    transform: `translateY(${(1 - p1a) * 22}px)`,
                  }}
                >
                  {p.monthCN ?? '十月 · 荣耀揭晓'}
                </Txt>
                <Txt
                  size={28}
                  color={rgba(T.soft, 0.85)}
                  weight={300}
                  letterSpacing={6}
                  lineHeight={39}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 1290,
                    width: 1080,
                    textAlign: 'center',
                    opacity: p1b,
                    transform: `translateY(${(1 - p1b) * 22}px)`,
                  }}
                >
                  {p.monthEN ?? 'OCTOBER 2026 · HONOR MOMENT'}
                </Txt>
              </>
            );
          })()}
        </Chapter>

        {/* 02 恭贺 + 姓名（叠一道扫光） */}
        <Chapter t={t} in={[1.28, 1.6]} out={[2.72, 3.02]}>
          {(() => {
            const pe = outExpo(seg(t, 1.34, 1.62));
            const pn = outExpo(seg(t, 1.9, 2.2));
            const pr = outExpo(seg(t, 2.12, 2.4));
            const pp = outBack(seg(t, 2.26, 2.58), 1.4);
            return (
              <>
                <Txt
                  size={28}
                  color={rgba(T.soft, 0.85)}
                  weight={300}
                  letterSpacing={12}
                  lineHeight={39}
                  style={{ position: 'absolute', left: 0, top: 462, width: 1080, textAlign: 'center', opacity: pe, transform: `translateY(${(1 - pe) * 18}px)` }}
                >
                  CONGRATULATIONS
                </Txt>
                <Rule theme={T} t={t} start={1.46} dur={0.3} left={490} top={536} width={100} solid opacity={0.65} />
                {(() => {
                  /* 运动模糊：逐字砸落速度峰值在起手，随落定指数衰减 */
                  const slamIn = clamp01(seg(t, 1.4, 1.5));
                  const blur = 3.4 * slamIn * Math.exp(-(t - 1.44) * 6.5);
                  return (
                    <div style={{ filter: blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
                      <SloganChars theme={T} t={t} text="恭贺" top={600} height={280} size={200} lineHeight={260} gap={14} start={1.44} stagger={0.13} dur={0.28} />
                    </div>
                  );
                })()}
                <Txt
                  size={108}
                  color="#fff"
                  weight={600}
                  font="serif"
                  letterSpacing={16}
                  lineHeight={140}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 930,
                    width: 1080,
                    textAlign: 'center',
                    opacity: pn,
                    transform: `translateY(${(1 - pn) * 30}px)`,
                    filter: `drop-shadow(0 10px 26px rgba(0,0,0,0.35))`,
                  }}
                >
                  {p.name}
                </Txt>
                <Rule theme={T} t={t} start={2.06} dur={0.28} left={500} top={1112} width={80} solid opacity={0.6} color={T.line} />
                <Txt
                  size={36}
                  color={rgba(T.warm, 1)}
                  weight={300}
                  letterSpacing={6}
                  lineHeight={50}
                  style={{ position: 'absolute', left: 0, top: 1146, width: 1080, textAlign: 'center', opacity: pr, transform: `translateY(${(1 - pr) * 22}px)` }}
                >
                  {p.role}
                </Txt>
                <div
                  style={{
                    position: 'absolute',
                    left: 330,
                    top: 1320,
                    width: 420,
                    height: 78,
                    borderRadius: 39,
                    border: `1px solid ${rgba(T.line, 0.5)}`,
                    background: rgba(T.line, 0.14),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    opacity: clamp01(seg(t, 2.26, 2.45)),
                    transform: `scale(${lerp(0.9, 1, pp)})`,
                  }}
                >
                  <Txt size={30} color={T.bright} weight={500} letterSpacing={3} lineHeight={42}>
                    {p.pill}
                  </Txt>
                </div>
              </>
            );
          })()}
        </Chapter>

        {/* 03 核心数字：冲击 + 光环 + 彩带 */}
        <Chapter t={t} in={[2.86, 3.14]} out={[4.24, 4.56]}>
          {(() => {
            const pl = outExpo(seg(t, 2.92, 3.18));
            const pd = outExpo(seg(t, 3.3, 3.58));
            const beamP = outExpo(seg(t, 3.0, 3.55));
            return (
              <>
                <Txt
                  size={34}
                  color={rgba(T.soft, 0.85)}
                  weight={300}
                  letterSpacing={6}
                  lineHeight={48}
                  style={{ position: 'absolute', left: 0, top: 452, width: 1080, textAlign: 'center', opacity: pl, transform: `translateY(${(1 - pl) * 18}px)` }}
                >
                  {p.dlabel}
                </Txt>
                <div
                  style={{
                    position: 'absolute',
                    top: 530,
                    width: 1080,
                    display: 'flex',
                    justifyContent: 'center',
                    opacity: outExpo(seg(t, 3.04, 3.3)),
                    transform: `scale(${numScale.toFixed(4)})`,
                    filter: `drop-shadow(0 8px ${18 + 46 * glow}px ${rgba(goldRgb, 0.18 + 0.4 * glow)})${numBlur > 0.15 ? ` blur(${numBlur.toFixed(2)}px)` : ''}`,
                  }}
                >
                  <NumRoll
                    theme={T}
                    target={p.premium}
                    t={t}
                    start={2.98}
                    dur={1.18}
                    size={300}
                    lineHeight={330}
                    unit="万元"
                    unitSize={56}
                    unitColor={rgba(T.soft, 0.92)}
                  />
                </div>
                {/* 扩散光环 ×2 */}
                {[0, 0.14].map((d) => {
                  const rp = outExpo(seg(t, LAND + d, LAND + 0.8 + d));
                  if (rp <= 0 || rp >= 1) return null;
                  return (
                    <div
                      key={d}
                      style={{
                        position: 'absolute',
                        left: 540,
                        top: 700,
                        width: 80,
                        height: 80,
                        marginLeft: -40,
                        marginTop: -40,
                        borderRadius: '50%',
                        border: `2px solid ${rgba(goldRgb, 0.55 * (1 - rp))}`,
                        transform: `scale(${lerp(0.8, 8.5, rp).toFixed(3)})`,
                      }}
                    />
                  );
                })}
                <div
                  style={{
                    position: 'absolute',
                    left: 40,
                    top: 892,
                    width: 1000,
                    height: 1,
                    background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(T.pale, 0.6)},${rgba(T.pale, 0)})`,
                    transform: `scaleX(${beamP})`,
                    opacity: outExpo(seg(t, 3.0, 3.3)),
                  }}
                />
                <Txt
                  size={28}
                  color={rgba(T.soft, 0.85)}
                  weight={400}
                  letterSpacing={4}
                  lineHeight={39}
                  style={{ position: 'absolute', left: 0, top: 930, width: 1080, textAlign: 'center', opacity: pd, transform: `translateY(${(1 - pd) * 18}px)` }}
                >
                  {p.delta}
                </Txt>
                {[400, 680].map((left) => (
                  <div key={left} style={{ position: 'absolute', left, top: 1112, width: 1, height: 190, background: rgba(T.pale, 0.32) }} />
                ))}
                <div
                  style={{
                    position: 'absolute',
                    left: 120,
                    top: 1080,
                    width: 840,
                    height: 260,
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}
                >
                  {p.stats.slice(0, 3).map((st, i) => {
                    const pp = outExpo(seg(t, 3.34 + i * 0.1, 3.66 + i * 0.1));
                    return (
                      <div key={i} style={{ width: 240, textAlign: 'center', opacity: pp, transform: `translateY(${(1 - pp) * 44}px)` }}>
                        <div
                          style={{
                            fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
                            fontWeight: 700,
                            fontStretch: '87.5%',
                            fontSize: 76,
                            lineHeight: '86px',
                            letterSpacing: -1,
                            color: st.hl ? T.bright : '#fff',
                            filter: st.hl ? `drop-shadow(0 0 14px ${rgba(goldRgb, 0.4)})` : undefined,
                          }}
                        >
                          {st.v}
                        </div>
                        <Txt size={30} color={rgba(T.mist, 0.88)} weight={300} letterSpacing={4} lineHeight={42} style={{ marginTop: 14 }}>
                          {st.k}
                        </Txt>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </Chapter>

        {/* 04 拱门人像：Ken-Burns + 轮廓光 */}
        <Chapter t={t} in={[4.4, 4.7]} out={[6.06, 6.36]}>
          {(() => {
            const pst = outExpo(seg(t, 4.44, 4.72));
            const archP = outExpo(seg(t, 4.5, 5.24));
            const pn4 = outExpo(seg(t, 5.18, 5.48));
            const pr4 = outExpo(seg(t, 5.34, 5.62));
            const pq = outExpo(seg(t, 5.5, 5.78));
            return (
              <>
                <Txt
                  size={28}
                  color={rgba(T.pale, 0.85)}
                  weight={300}
                  letterSpacing={8}
                  lineHeight={39}
                  style={{ position: 'absolute', left: 0, top: 200, width: 1080, textAlign: 'center', opacity: pst, transform: `translateY(${(1 - pst) * 18}px)` }}
                >
                  {p.starLabel ?? '2026 · 10　月 度 之 星'}
                </Txt>
                {/* 背后金色轮廓光 */}
                <div
                  style={{
                    position: 'absolute',
                    left: 240,
                    top: 420,
                    width: 600,
                    height: 760,
                    borderRadius: '50%',
                    background: `radial-gradient(ellipse at center, ${rgba(goldRgb, 0.22)} 0%, ${rgba(goldRgb, 0)} 68%)`,
                    filter: 'blur(6px)',
                    opacity: archP * (0.75 + 0.25 * Math.sin(t * 1.6)),
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 140,
                    top: 270,
                    width: 800,
                    height: 1000,
                    border: `1px solid ${rgba(T.line, 0.28)}`,
                    borderRadius: '400px 400px 0 0',
                    opacity: outExpo(seg(t, 4.48, 4.86)),
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 160,
                    top: 290,
                    width: 760,
                    height: 980,
                    overflow: 'hidden',
                    border: `2px solid ${rgba(T.soft, 0.9)}`,
                    borderRadius: '380px 380px 0 0',
                    background: T.archbg,
                    clipPath: `inset(${((1 - archP) * 100).toFixed(2)}% 0 0 0 round 380px 380px 0 0)`,
                    transform: `translateY(${(1 - archP) * 40}px)`,
                  }}
                >
                  <Img
                    src={p.photo || staticFile('assets/portrait.png')}
                    style={{
                      position: 'absolute',
                      left: -30,
                      top: 0,
                      width: 820,
                      height: 1050,
                      objectFit: 'cover',
                      objectPosition: '50% 20%',
                      transform: `scale(${lerp(1.07, 1, kb).toFixed(4)})`,
                      transformOrigin: '50% 18%',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      width: 760,
                      height: 340,
                      background: `linear-gradient(180deg,${rgba(T.mask, 0)} 0%,${rgba(T.mask, 0.95)} 100%)`,
                    }}
                  />
                </div>
                <Txt
                  size={88}
                  color="#fff"
                  weight={600}
                  font="serif"
                  letterSpacing={14}
                  lineHeight={110}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 1318,
                    width: 1080,
                    textAlign: 'center',
                    opacity: pn4,
                    transform: `translateY(${(1 - pn4) * 30}px)`,
                    filter: 'drop-shadow(0 10px 26px rgba(0,0,0,0.35))',
                  }}
                >
                  {p.name}
                </Txt>
                <Txt
                  size={32}
                  color={rgba(T.soft, 0.88)}
                  weight={300}
                  letterSpacing={6}
                  lineHeight={45}
                  style={{ position: 'absolute', left: 0, top: 1436, width: 1080, textAlign: 'center', opacity: pr4, transform: `translateY(${(1 - pr4) * 22}px)` }}
                >
                  {p.role}
                </Txt>
                <Txt
                  size={34}
                  color={T.cream2}
                  weight={300}
                  font="serif"
                  letterSpacing={4}
                  lineHeight={48}
                  style={{ position: 'absolute', left: 0, top: 1540, width: 1080, textAlign: 'center', opacity: pq, transform: `translateY(${(1 - pq) * 22}px)` }}
                >
                  {p.quote ?? '专业赢得信赖 · 坚持成就卓越'}
                </Txt>
              </>
            );
          })()}
        </Chapter>

        {/* 05 定版 */}
        <Chapter t={t} in={[6.22, 6.56]}>
        <Sfx name="sfx_pop" at={3.68} vol={0.28} />
          <CeremonyEnd
            theme={T}
            t={t}
            p={p}
            L={6.26}
            logo={{ left: 490, top: 286, size: 100, fontSize: 46 }}
            companyTop={414}
            title={{ top: 520, size: 128, lineHeight: 170, letterSpacing: 24 }}
            titleSizes={[128, 100, 84]}
            titleTrack
            sub={{ top: 752, size: 38 }}
            line={{ top: 846, width: 120 }}
            qr={{ top: 930, size: 220 }}
            capTop={1196}
            dateTop={1560}
            noteTop={1616}
          />
        </Chapter>

        {/* 全屏彩带雨：30 条波浪丝带（SVG 贝塞尔），波形沿带身流动，持续 2.6s */}
        {(() => {
          const span = t - LAND;
          if (span < -0.05 || span > 2.6) return null;
          const global = clamp01(1 - seg(t, LAND + 2.0, LAND + 2.6));
          const N = 26;
          return (
            <svg
              width={1080}
              height={1920}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: global }}
            >
              <defs>
                {RIBBON_COLORS.map(([main, light], k) => (
                  <linearGradient key={k} id={`rg${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={main} />
                    <stop offset="42%" stopColor={light} />
                    <stop offset="100%" stopColor={main} />
                  </linearGradient>
                ))}
              </defs>
              {RIBBONS.map((c, i) => {
                const age = span - c.delay;
                if (age <= 0) return null;
                const y = -c.len - 40 + c.vy * age;
                if (y > 2000) return null;
                const x = c.x0 + Math.sin(age * c.swayW + c.ph) * c.swayA;
                /* 波形沿带身向下流动（拧转下落的观感） */
                const phase = age * c.curl + c.ph;
                let d = 'M 0 0';
                for (let k = 1; k <= N; k++) {
                  const u = k / N;
                  const xx =
                    Math.sin(u * Math.PI * 2 * c.waves + phase) * c.amp +
                    Math.sin(u * Math.PI * 2 * c.waves * 0.5 - phase * 0.7) * c.amp * 0.22;
                  d += ` L ${xx.toFixed(1)} ${(u * c.len).toFixed(1)}`;
                }
                const stroke = `url(#rg${c.hue})`;
                return (
                  <path
                    key={i}
                    d={d}
                    stroke={stroke}
                    strokeWidth={c.sw}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={clamp01(age * 5)}
                    transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(c.tilt + Math.sin(age * c.swayW * 0.8 + c.ph) * 14 + age * c.spin).toFixed(1)})`}
                  />
                );
              })}
            </svg>
          );
        })()}

        {/* 定版体积光束：标题背后缓旋的放射光，广播包装质感 */}
        {seg(t, 6.3, 7.0) > 0 && seg(t, 6.3, 7.0) < 1 && (
          <div
            style={{
              position: 'absolute',
              left: 140,
              top: 160,
              width: 800,
              height: 800,
              borderRadius: '50%',
              background: `conic-gradient(from ${((frame * 0.9) % 360).toFixed(1)}deg, ${rgba(goldRgb, 0.28)} 0deg, transparent 24deg, ${rgba(goldRgb, 0.22)} 51deg, transparent 78deg, ${rgba(goldRgb, 0.28)} 102deg, transparent 130deg, ${rgba(goldRgb, 0.2)} 154deg, transparent 180deg, ${rgba(goldRgb, 0.28)} 205deg, transparent 232deg, ${rgba(goldRgb, 0.22)} 257deg, transparent 285deg, ${rgba(goldRgb, 0.26)} 308deg, transparent 336deg, ${rgba(goldRgb, 0.28)} 360deg)`,
              WebkitMaskImage: 'radial-gradient(closest-side, rgba(0,0,0,0.9) 12%, rgba(0,0,0,0.4) 46%, transparent 72%)',
              maskImage: 'radial-gradient(closest-side, rgba(0,0,0,0.9) 12%, rgba(0,0,0,0.4) 46%, transparent 72%)',
              mixBlendMode: 'screen',
              filter: 'blur(6px)',
              opacity: 0.55 * seg(t, 6.3, 7.0),
              pointerEvents: 'none',
            }}
          />
        )}

        {/* 扫光 ×2：恭贺砸落 / 定版标题 */}
        <Sweep t={t} at={2.02} dur={0.72} op={0.5} />
        <Sweep t={t} at={6.92} dur={0.95} op={0.4} />
      </div>

    </Stage>
  );
};
