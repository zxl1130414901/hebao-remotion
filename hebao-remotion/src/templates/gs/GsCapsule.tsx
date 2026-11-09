import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { EndCard } from '../../components/EndCard';
import { DrawPath } from '../../components/DrawLine';
import {
  GsStage, gsBeats, SplitReveal,
  EASE, stagger, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 20 · 时光胶囊版（翡翠）
 * 叙事：一枚时光胶囊开启——中轴时间线从顶贯穿到底，四个里程碑
 *       交错左右满铺全高，讲述「从起步到登顶」的完整一年。
 * 版式：竖向时间轴构图（中轴 + 左右交错节点）——
 *       内容铺满 380-1650 全高，彻底告别「内容挤在中间」。
 * 结构：3 章（中轴生长 / 节点交错点入 / 封缄+定版）。
 */
export const GsCapsule: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.feicui;
  const B = gsBeats({ num: 1.9, rows: 4.7, end: 6.72 });

  const nodes = (p.nodes ?? []).slice(0, 4);
  const NODE_Y = [700, 960, 1220, 1480];
  const CX = 540;

  return (
    <GsStage theme={T} p={p} bottomtag="TIME　CAPSULE">
      {/* 章 1 · 中轴生长 + 标题（贯穿） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        <SplitReveal theme={T} t={t} text="时光胶囊" size={108} top={330} start={B.hook + 0.08}
          mode="mask" staggerEach={0.09} dur={0.42} lineHeight={134} />
        <Txt size={44} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={9} lineHeight={44}
          style={{ position: 'absolute', left: 0, top: 500, width: 1080, textAlign: 'center',
            opacity: EASE.enter(seg(t, B.hook + 0.55, B.hook + 0.85)) }}>
          开启这一年 · 时光见证成长
        </Txt>
        {/* 中轴（顶到底描画） */}
        <div
          style={{
            position: 'absolute',
            left: CX - 1.5,
            top: 620,
            width: 3,
            height: 900,
            background: `linear-gradient(180deg, ${T.goldA}, ${T.goldC}, ${rgba(T.goldC, 0.1)})`,
            transform: `scaleY(${EASE.enter(seg(t, B.hook + 0.4, B.hook + 1.4))})`,
            transformOrigin: 'top',
            boxShadow: `0 0 14px ${rgba(T.goldC, 0.4)}`,
          }}
        />
        <Sfx name="sfx_whoosh" at={B.hook + 0.42} vol={0.26} />
        <Sfx name="sfx_chime" at={B.hook + 0.9} vol={0.24} />
      </Chapter>

      {/* 章 2 · 节点交错点入 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {nodes.map((nd, i) => {
          const st = B.num + 0.1 + i * 0.3;
          const e = EASE.glam(seg(t, st, st + 0.46));
          const left = i % 2 === 0;
          const ny = NODE_Y[i];
          const isLast = i === nodes.length - 1;
          return (
            <div key={i}>
              {/* 节点圆 */}
              <div
                style={{
                  position: 'absolute',
                  left: CX - (isLast ? 30 : 22),
                  top: ny - (isLast ? 30 : 22),
                  width: isLast ? 60 : 44,
                  height: isLast ? 60 : 44,
                  borderRadius: '50%',
                  border: `3px solid ${isLast ? T.goldA : rgba(T.line, 0.7)}`,
                  background: isLast
                    ? `radial-gradient(circle at 34% 30%, ${T.goldA}, ${T.goldD})`
                    : `radial-gradient(circle at 34% 30%, ${rgba(T.pale, 0.9)}, ${rgba(T.line, 0.4)})`,
                  boxShadow: `0 0 ${isLast ? 34 : 18}px ${rgba(T.goldC, isLast ? 0.6 : 0.28)}`,
                  transform: `scale(${e})`,
                  opacity: clamp01(seg(t, st, st + 0.2)),
                }}
              />
              {/* 内容卡（左右交错） */}
              <div
                style={{
                  position: 'absolute',
                  left: left ? 90 : 590,
                  top: ny - 66,
                  width: 400,
                  textAlign: left ? 'right' : 'left',
                  opacity: clamp01(seg(t, st + 0.08, st + 0.3)),
                  transform: `translateX(${(1 - e) * (left ? -60 : 60)}px)`,
                }}
              >
                <Txt size={40} color={rgba(T.pale, 0.88)} weight={400} letterSpacing={5} lineHeight={40}>
                  {nd.label} · {nd.note ?? ''}
                </Txt>
                <Txt size={isLast ? 58 : 48} color={isLast ? T.goldB : T.cream} weight={600}
                  font="num" letterSpacing={-1} lineHeight={isLast ? 74 : 64}>
                  {nd.value}
                </Txt>
              </div>
              {/* 连线 */}
              <div
                style={{
                  position: 'absolute',
                  top: ny - 1,
                  [left ? 'right' : 'left']: CX + 26,
                  width: 400 - 130,
                  height: 2,
                  background: `linear-gradient(${left ? '270deg' : '90deg'}, ${rgba(T.line, 0.5)}, ${rgba(T.line, 0)})`,
                  opacity: clamp01(seg(t, st + 0.06, st + 0.28)),
                }}
              />
              <Sfx name="sfx_chime" at={st + 0.16} vol={0.18} />
            </div>
          );
        })}
        <Sfx name="sfx_shimmer" at={B.num + 1.1} vol={0.26} />
      </Chapter>

      {/* 章 3 · 封缄（胶囊合上） */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 底部封缄牌 */}
        <div
          style={{
            position: 'absolute',
            left: 170,
            top: 1560,
            width: 740,
            height: 130,
            borderRadius: 16,
            border: `1px solid ${rgba(T.goldC, 0.7)}`,
            background: `linear-gradient(180deg, ${rgba(T.mask, 0.6)}, ${rgba(T.mask, 0.35)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            opacity: clamp01(seg(t, B.rows + 0.1, B.rows + 0.36)),
            transform: `translateY(${(1 - EASE.enter(seg(t, B.rows + 0.1, B.rows + 0.46))) * 50}px)`,
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: 8, color: T.goldB,
            fontFamily: "'Noto Serif SC', 'SimSun', serif" }}>
            封缄 · 待来年开启
          </span>
        </div>
        <Sfx name="sfx_stamp" at={B.rows + 0.42} vol={0.3} />
        {/* 数据一行 */}
        <Txt size={44} color={T.cream2} weight={400} letterSpacing={4} lineHeight={44}
          style={{ position: 'absolute', left: 0, top: 1720, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.6, B.rows + 0.9)) }}>
          {p.dlabel} {p.premium.toFixed(1)} 万 · {p.delta.split('　')[0]}
        </Txt>
        <Sfx name="sfx_shimmer" at={B.rows + 0.6} vol={0.24} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={136} titleText="时光见证"
          subText="这一年 · 每一步都算数" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
