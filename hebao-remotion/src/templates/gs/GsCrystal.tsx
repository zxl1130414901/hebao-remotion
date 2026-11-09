import React from 'react';
import { Img, staticFile } from 'remotion';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { NumRoll } from '../../components/NumRoll';
import { EndCard } from '../../components/EndCard';
import {
  GsStage, gsBeats, SplitReveal, HookCap,
  EASE, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 13 · 水晶之夜版（蓝金）
 * 叙事：一座鎏金镶边水晶奖杯（生成素材）在光柱中缓缓升起，
 *       光斑扫过杯身折射万华镜光，星尘环绕，装置本身就是主角。
 * 版式：全屏艺术装置构图——水晶杯占据上半屏（顶到底部 60%），
 *       标题与数字沉到下半屏。
 * 结构：3 章（水晶升起 / 光斑折射+标题 / 数字沉底+定版）。
 */
export const GsCrystal: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.lanjin;
  const B = gsBeats({ num: 2.6, rows: 4.9, end: 6.72 });

  /* 水晶奖杯素材（真透明 PNG） */
  const TW = 590;
  const TH = TW * 962 / 813;
  const TX = 540 - TW / 2;
  const TY = 318;
  const TB = TY + TH;                 /* 杯底 */

  /* 光斑扫过（两道斜光） */
  const sweep = seg(t, B.num + 1.2, B.num + 2.4);
  const rise = EASE.glam(seg(t, B.hook + 0.15, B.hook + 0.85));
  const twinks = [0, 1, 2, 3, 4, 5].map((i) => ({
    x: 540 + Math.round(Math.sin(i * 2.4) * (250 + (i % 3) * 70)),
    y: 420 + ((i * 137) % 560),
    ph: i * 0.53,
  }));

  return (
    <GsStage theme={T} p={p} bottomtag="CRYSTAL　NIGHT">
      {/* 章 1 · 水晶升起（贯穿） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        <HookCap theme={T} t={t} text="CRYSTAL NIGHT" top={210} start={B.hook + 0.06} />
        {/* 杯后光柱 */}
        <div style={{
          position: 'absolute', left: 540 - 190, top: 240, width: 380, height: TB - 240 + 60,
          background: `linear-gradient(180deg, ${rgba(T.pale, 0.16)}, ${rgba(T.glow1, 0.05)} 70%, transparent)`,
          clipPath: 'polygon(18% 0, 82% 0, 100% 100%, 0 100%)',
          opacity: rise,
        }} />
        {/* 杯底光环 + 台座 */}
        <div style={{
          position: 'absolute', left: 540 - 300, top: TB - 54, width: 600, height: 108,
          borderRadius: '50%',
          border: `1.5px solid ${rgba(T.goldC, 0.55)}`,
          boxShadow: `0 0 46px ${rgba(T.glow1, 0.3)}, inset 0 0 30px ${rgba(T.glow1, 0.16)}`,
          opacity: rise * 0.9,
          transform: `scaleX(${lerp(0.6, 1, rise)})`,
        }} />
        {/* 水晶奖杯（生成素材） */}
        <Img
          src={staticFile('assets/gs/crystal.png')}
          style={{
            position: 'absolute', left: TX, top: TY, width: TW, height: TH,
            opacity: rise,
            transform: `translateY(${lerp(120, 0, rise)}px) scale(${lerp(0.9, 1, rise)})`,
            filter: `drop-shadow(0 22px 44px rgba(0,0,0,.5)) brightness(${1.04 + 0.22 * Math.max(0, sweep - 0.4)})`,
          }}
        />
        {/* 光斑扫过杯身（斜光带，随杯身容器裁剪） */}
        <div style={{
          position: 'absolute', left: TX, top: TY, width: TW, height: TH,
          overflow: 'hidden',
          opacity: clamp01(seg(t, B.num + 1.25, B.num + 1.5)) * (1 - seg(t, B.num + 2.1, B.num + 2.4)),
        }}>
          <div style={{
            position: 'absolute', left: -180 + sweep * 900, top: -80, width: 150, height: TH + 160,
            background: `linear-gradient(90deg, transparent, ${rgba(T.pale, 0.34)}, transparent)`,
            transform: 'rotate(18deg)',
          }} />
        </div>
        {/* 星尘微光 */}
        {twinks.map((k, i) => {
          const tw = 0.5 + 0.5 * Math.sin((t - B.hook) * 3.1 + k.ph);
          return (
            <div key={i} style={{
              position: 'absolute', left: k.x, top: k.y, width: 5, height: 5,
              borderRadius: '50%', background: T.pale,
              boxShadow: `0 0 12px ${rgba(T.pale, 0.9)}`,
              opacity: rise * 0.5 * tw,
            }} />
          );
        })}
        <Sfx name="sfx_whoosh" at={B.hook + 0.22} vol={0.26} />
        <Sfx name="sfx_chime" at={B.hook + 0.9} vol={0.26} />
        <Sfx name="sfx_shimmer" at={B.num + 1.3} vol={0.28} />
      </Chapter>

      {/* 章 2 · 标题（水晶下方） */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        <SplitReveal theme={T} t={t} text="水晶之夜" size={110} top={1210} start={B.num + 0.1}
          mode="mask" staggerEach={0.09} dur={0.42} lineHeight={136} />
        <Txt size={46} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={8} lineHeight={46}
          style={{ position: 'absolute', left: 0, top: 1380, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 0.6, B.num + 0.9)) }}>
          璀璨如你 · 闪耀如初
        </Txt>
        <Sfx name="sfx_chime" at={B.num + 0.4} vol={0.24} />
      </Chapter>

      {/* 章 3 · 数字沉底 */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        <Txt size={44} color={rgba(T.pale, 0.92)} weight={500} letterSpacing={8} lineHeight={44}
          style={{ position: 'absolute', left: 0, top: 1448, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.05, B.rows + 0.3)) }}>
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 1502,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: clamp01(seg(t, B.rows + 0.1, B.rows + 0.36)),
          }}
        >
          <NumRoll theme={T} target={p.premium} t={t} start={B.rows + 0.2} dur={0.95} size={148}
            lineHeight={163} unit="万" unitSize={36} unitColor={rgba(T.soft, 0.95)} />
        </div>
        <Sfx name="sfx_pop" at={B.rows + 0.2 + 0.95 * 0.78} vol={0.24} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={138} titleText="璀璨如你"
          subText="水晶之夜 · 光芒有主" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
