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
 * 典藏 14 · 登峰造极版（翡翠）
 * 叙事：一条对角山脊从左下贯穿到右上，四个里程碑钉在坡上，
 *       最后登顶插旗——「山高人为峰」。
 * 版式：全屏对角线构图——数据不居中，而是沿对角山脊分布，
 *       标题贴左上，视线随山势爬升。
 * 结构：3 章（山脊描画 / 里程碑爬升 / 峰顶插旗+定版）。
 */
export const GsAscent: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.feicui;
  const B = gsBeats({ num: 2.4, rows: 4.8, end: 6.72 });

  /* 山脊折线：从左下到右上 */
  const ridge = `M -20 1560 L 160 1420 L 340 1290 L 520 1080 L 700 880 L 880 660 L 1100 430`;
  /* 里程碑（nodes 前 4）钉在坡上 */
  const nodes = (p.nodes ?? []).slice(0, 4);
  const pegs: { x: number; y: number }[] = [
    { x: 160, y: 1420 },
    { x: 400, y: 1210 },
    { x: 640, y: 950 },
    { x: 880, y: 660 },
  ];
  /* 标签手工锚定：全部沉入山体填充区（脊线下侧）或左上空白，
     逐点与脊线做过穿越核算——斜脊线 y(x)：段2 (400,1210)→(640,950) 斜率 -1.08，
     段3 (640,950)→(880,660) 斜率 -1.2，段4 (880,660)→(1100,430) 斜率 -1.045。
     n0/n1/n2 放节点右下 45°（脊线在标签上方通过），n3 放节点左下 600 高（脊线 722-1091 全在下方） */
  const labelPos: { x: number; y: number }[] = [
    { x: 210, y: 1460 },
    { x: 450, y: 1250 },
    { x: 690, y: 990 },
    { x: 510, y: 600 },
  ];
  /* 旗帜在峰顶飘动 */
  const flagWave = Math.sin(t * 5) * 6;

  return (
    <GsStage theme={T} p={p} bottomtag="SUMMIT">
      {/* 章 1 · 山脊描画（贯穿） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        <SplitReveal theme={T} t={t} text="登峰造极" size={100} top={286} start={B.hook + 0.1}
          mode="drop" staggerEach={0.08} dur={0.42} lineHeight={126} />
        <Txt size={42} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={8} lineHeight={42}
          style={{ position: 'absolute', left: 0, top: 432, width: 1080, textAlign: 'center',
            opacity: EASE.enter(seg(t, B.hook + 0.6, B.hook + 0.9)) }}>
          山高人为峰 · 一步一重天
        </Txt>
        {/* 山脊主线 */}
        <DrawPath d={ridge} t={t} start={B.hook + 0.3} dur={1.5} color={rgba(T.goldC, 0.9)}
          strokeWidth={4} opacity={0.9} width={1080} height={1920} />
        {/* 山体填充（山脊下的暗面） */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            clipPath: 'polygon(-20px 1560px, 160px 1420px, 340px 1290px, 520px 1080px, 700px 880px, 880px 660px, 1100px 430px, 1100px 1920px, -20px 1920px)',
            background: `linear-gradient(200deg, ${rgba(T.line, 0.14)} 0%, ${rgba(T.mask, 0.05)} 60%)`,
            opacity: clamp01(seg(t, B.hook + 0.9, B.hook + 1.6)),
          }}
        />
        <Sfx name="sfx_whoosh" at={B.hook + 0.32} vol={0.26} />
      </Chapter>

      {/* 章 2 · 里程碑爬升 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {nodes.map((nd, i) => {
          const st = B.num + 0.15 + i * 0.32;
          const e = EASE.glam(seg(t, st, st + 0.44));
          const peg = pegs[i];
          return (
            <div key={i}>
              {/* 节点钉 */}
              <div
                style={{
                  position: 'absolute',
                  left: peg.x - 16,
                  top: peg.y - 16,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 34% 30%, ${T.goldA}, ${T.goldD})`,
                  boxShadow: `0 0 22px ${rgba(T.goldC, 0.6)}`,
                  transform: `scale(${e})`,
                  opacity: clamp01(seg(t, st, st + 0.2)),
                }}
              />
              {/* 标签：手工锚定坐标，紧邻节点（右下 45° / n3 左下），脱离脊线穿越区 */}
              <div
                style={{
                  position: 'absolute',
                  left: labelPos[i].x,
                  top: labelPos[i].y,
                  width: 340,
                  textAlign: 'left',
                  opacity: clamp01(seg(t, st + 0.1, st + 0.34)),
                  transform: `translateY(${(1 - e) * 22}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%',
                    background: `radial-gradient(circle at 34% 30%, ${T.goldA}, ${T.goldD})`,
                    boxShadow: `0 0 10px ${rgba(T.goldC, 0.6)}`, flexShrink: 0 }} />
                  <Txt size={36} color={rgba(T.pale, 0.88)} weight={400} letterSpacing={1} lineHeight={40}
                    style={{ whiteSpace: 'nowrap' }}>
                    {nd.label} · {nd.note ?? ''}
                  </Txt>
                </div>
                <Txt size={54} color={T.cream} weight={600} font="num" letterSpacing={0} lineHeight={56}
                  style={{ marginTop: 6, marginLeft: 22, whiteSpace: 'nowrap' }}>
                  {nd.value}
                </Txt>
              </div>
              <Sfx name="sfx_stamp" at={st + 0.3} vol={0.24} />
            </div>
          );
        })}
      </Chapter>

      {/* 章 3 · 峰顶插旗 */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 旗杆 */}
        <div
          style={{
            position: 'absolute',
            left: 878,
            top: 470,
            width: 5,
            height: 190,
            background: `linear-gradient(180deg, ${T.goldA}, ${T.goldD})`,
            transform: `scaleY(${EASE.enter(seg(t, B.rows + 0.1, B.rows + 0.4))})`,
            transformOrigin: 'bottom',
          }}
        />
        {/* 三角旗 */}
        <div
          style={{
            position: 'absolute',
            left: 883,
            top: 470,
            width: 120,
            height: 62,
            clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
            background: `linear-gradient(135deg, ${T.goldB}, ${T.goldD})`,
            transform: `skewY(${flagWave * 0.14}deg)`,
            transformOrigin: 'left',
            opacity: clamp01(seg(t, B.rows + 0.34, B.rows + 0.5)),
          }}
        />
        <Sfx name="sfx_gong" at={B.rows + 0.4} vol={0.36} />
        {/* 登顶宣言：下移到 830 山体区（已核算：脊线在 x130-530 段 y1443-1080 全在下方，
            且与标签4 (510,600) 空间分离——章2标签与宣言共存时不再叠压） */}
        <SplitReveal theme={T} t={t} text="山高人为峰" size={72} top={830} start={B.rows + 0.6}
          mode="mask" staggerEach={0.08} dur={0.4} width={420} left={130} align="left"
          lineHeight={92} />
        {/* delta 长串按全角空格/分隔符拆两行靠左，收窄不碰「七月」标签（690,990）与脊线 */}
        {(p.delta ?? '').split(/[　\s]*[｜|/][　\s]*/).map((seg2, k) => (
          seg2.trim() ? (
            <Txt key={k} size={42} color={rgba(T.pale, 0.88)} weight={400} letterSpacing={4} lineHeight={42}
              style={{ position: 'absolute', left: 134, top: 950 + k * 58, textAlign: 'left', whiteSpace: 'nowrap',
                opacity: clamp01(seg(t, B.rows + 1.2 + k * 0.12, B.rows + 1.5 + k * 0.12)) }}>
              {seg2.trim()}
            </Txt>
          ) : null
        ))}
        <Sfx name="sfx_shimmer" at={B.rows + 0.62} vol={0.26} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={140} titleText="登峰造极"
          subText="山高人为峰 · 下一段更高" splitTitle drawLine titleLetterSpacing={20} />
      </Chapter>
    </GsStage>
  );
};
