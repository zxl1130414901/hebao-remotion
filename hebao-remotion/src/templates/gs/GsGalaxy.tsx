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
  GsStage, gsBeats, SplitReveal, FootStrip,
  EASE, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 18 · 星耀银河版（蓝金）
 * 叙事：三条椭圆轨道环绕中心，四个里程碑像行星一样沿轨道滑入点亮。
 * 版式：轨道宇宙构图——中心主数字，轨道倾斜贯穿全屏，
 *       行星带小标签牌，宇宙级秩序感。
 * 结构：3 章（轨道生长 / 行星点亮 / 中心数字+定版）。
 */
export const GsGalaxy: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.lanjin;
  const B = gsBeats({ num: 2.2, rows: 4.6, end: 6.72 });

  const CX = 540;
  const CY = 985;
  const orbits = [
    { rx: 300, ry: 108, tilt: -12 },
    { rx: 430, ry: 155, tilt: -12 },
    { rx: 560, ry: 202, tilt: -12 },
  ];
  /* 四颗行星：手工锚定四角布局，标签统一在行星下方——
     坐标已核算：避开标题区(160-510)、中央暗盘(260-820 × 770-1150)、底部信息带(1560+) */
  const nodes = (p.nodes ?? []).slice(0, 4);
  const anchors = [
    { x: 196, y: 1090 },  /* 左下 */
    { x: 300, y: 560 },   /* 左上 */
    { x: 840, y: 560 },   /* 右上 */
    { x: 892, y: 1258 },  /* 右下 */
  ];

  return (
    <GsStage theme={T} p={p} bottomtag="GALAXY">
      {/* 章 1 · 轨道生长（贯穿） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        <SplitReveal theme={T} t={t} text="星耀银河" size={104} top={300} start={B.hook + 0.08}
          mode="mask" staggerEach={0.09} dur={0.42} lineHeight={130} />
        <Txt size={44} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={9} lineHeight={44}
          style={{ position: 'absolute', left: 0, top: 462, width: 1080, textAlign: 'center',
            opacity: EASE.enter(seg(t, B.hook + 0.55, B.hook + 0.85)) }}>
          每一步 · 都在轨道上发光
        </Txt>
        {/* 三条轨道（椭圆 SVG 描画感：用边框椭圆 + 旋转） */}
        {orbits.map((o, i) => {
          const e = EASE.enter(seg(t, B.hook + 0.3 + i * 0.18, B.hook + 0.9 + i * 0.18));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: CX - o.rx,
                top: CY - o.ry,
                width: o.rx * 2,
                height: o.ry * 2,
                borderRadius: '50%',
                border: `1.5px solid ${rgba(T.line, 0.5)}`,
                transform: `rotate(${o.tilt}deg) scale(${e})`,
                opacity: 0.75 * e,
              }}
            />
          );
        })}
        <Sfx name="sfx_whoosh" at={B.hook + 0.3} vol={0.26} />
        <Sfx name="sfx_chime" at={B.hook + 0.9} vol={0.26} />
      </Chapter>

      {/* 章 2 · 行星点亮（四角锚定，标签在行星下方） */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {nodes.map((nd, i) => {
          const an = anchors[i];
          const st = B.num + 0.1 + i * 0.3;
          const e = EASE.glam(seg(t, st, st + 0.5));
          const isLast = i === nodes.length - 1;
          const size = isLast ? 116 : 82;
          /* 入场：从中心方向滑向锚点 + 缓动放大 */
          const dx = (CX - an.x) * (1 - e) * 0.35;
          const dy = (CY - an.y) * (1 - e) * 0.35;
          const float = Math.sin(t * 1.2 + i * 1.7) * 6;
          return (
            <div key={i}>
              {/* 行星体（生成素材小行星） */}
              <Img
                src={staticFile('assets/gs/planet.png')}
                style={{
                  position: 'absolute',
                  left: an.x - size / 2 + dx,
                  top: an.y - size / 2 + dy + float,
                  width: size,
                  height: size,
                  objectFit: 'contain',
                  filter: `drop-shadow(0 0 ${isLast ? 30 : 18}px ${rgba(T.glow1, isLast ? 0.5 : 0.28)}) brightness(${isLast ? 1.1 : 0.98})`,
                  opacity: clamp01(seg(t, st, st + 0.2)),
                  transform: `scale(${lerp(0.4, 1, e)})`,
                }}
              />
              {/* 标签牌（行星正下方，带衬底保证红底可读） */}
              <div
                style={{
                  position: 'absolute',
                  left: an.x - 120,
                  top: an.y + size / 2 + 14 + dy,
                  width: 240,
                  textAlign: 'center',
                  opacity: clamp01(seg(t, st + 0.12, st + 0.36)),
                  transform: `translateY(${(1 - e) * 18}px)`,
                }}
              >
                <Txt size={36} color={rgba(T.pale, 0.94)} weight={400} letterSpacing={1} lineHeight={40}
                  style={{ whiteSpace: 'nowrap', textShadow: '0 2px 10px rgba(0,0,0,.55)' }}>
                  {nd.label} · {nd.note ?? ''}
                </Txt>
                <Txt size={58} color={isLast ? T.goldB : T.cream} weight={600} font="num"
                  letterSpacing={0} lineHeight={62}
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,.55)' }}>
                  {nd.value}
                </Txt>
              </div>
              <Sfx name="sfx_chime" at={st + 0.2} vol={0.2} />
            </div>
          );
        })}
        <Sfx name="sfx_shimmer" at={B.num + 1.1} vol={0.26} />
      </Chapter>

      {/* 章 3 · 中心数字（主行星压底，文字全部收进暗盘） */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 主行星（生成素材）作背景装置：缩小下沉，避开标签锚点 */}
        <Img
          src={staticFile('assets/gs/planet.png')}
          style={{
            position: 'absolute', left: CX - 280, top: 720, width: 560, height: 524,
            objectFit: 'contain', opacity: 0.95,
            filter: `drop-shadow(0 0 60px ${rgba(T.goldC, 0.5)}) brightness(1.18) saturate(1.05)`,
            transform: `scale(${clamp01(seg(t, B.rows - 0.04, B.rows + 0.4)) * 0.04 + 0.96})`,
            transformOrigin: '50% 50%',
          }}
        />
        {/* 数字衬底暗盘：核心近实色，保证金字在亮行星上可读 */}
        <div
          style={{
            position: 'absolute',
            left: CX - 280,
            top: 770,
            width: 560,
            height: 380,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(${T.mask}, 0.85) 34%, rgba(${T.mask}, 0.55) 62%, rgba(${T.mask}, 0.12) 80%, transparent 90%)`,
            opacity: clamp01(seg(t, B.rows, B.rows + 0.4)),
          }}
        />
        <Txt size={42} color={rgba(T.pale, 0.96)} weight={500} letterSpacing={6} lineHeight={42}
          style={{ position: 'absolute', left: 0, top: 830, width: 1080, textAlign: 'center',
            textShadow: '0 2px 12px rgba(0,0,0,.6)',
            opacity: clamp01(seg(t, B.rows + 0.08, B.rows + 0.34)) }}>
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 900,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: clamp01(seg(t, B.rows + 0.12, B.rows + 0.38)),
          }}
        >
          <NumRoll theme={T} target={p.premium} t={t} start={B.rows + 0.22} dur={0.95} size={140}
            lineHeight={154} unit="万" unitSize={36} unitColor={rgba(T.soft, 0.95)} />
        </div>
        <Sfx name="sfx_pop" at={B.rows + 0.22 + 0.95 * 0.78} vol={0.26} />
        <Txt size={42} color={T.cream2} weight={400} letterSpacing={3} lineHeight={42}
          style={{ position: 'absolute', left: 0, top: 1078, width: 1080, textAlign: 'center',
            textShadow: '0 2px 12px rgba(0,0,0,.6)',
            opacity: clamp01(seg(t, B.rows + 0.95, B.rows + 1.25)) }}>
          {p.delta}
        </Txt>
        {/* 底部信息带：填补下半屏 */}
        <FootStrip theme={T} t={t} text={p.dateText ?? '2026 年 10 月'} top={1560} start={B.rows + 1.1} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={140} titleText="每颗星都闪耀"
          subText="星耀银河 · 各自有光" splitTitle drawLine titleLetterSpacing={6} />
      </Chapter>
    </GsStage>
  );
};
