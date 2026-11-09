import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { NumRoll } from '../../components/NumRoll';
import { PhotoCard } from '../../components/PhotoCard';
import { EndCard } from '../../components/EndCard';
import {
  GsStage, gsBeats, ChapLab, SplitReveal,
  EASE, stagger, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 03 · 领航灯塔版（蓝金）
 * 叙事：灯塔计划领航者——一道天光从屏幕顶垂直洒下贯穿到底，人物在光柱底端被照亮。
 * 版式：纵轴一镜到底——标题贴顶、数字居中、里程碑沿光柱两侧交错、人物收尾。
 * 结构：2 章（一镜到底主体 / 定版），全程同一构图靠节拍推进，不打断。
 */
export const GsBeacon: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.lanjin;
  const B = gsBeats({ hook: 0.12, num: 1.6, rows: 3.4, person: 4.9, end: 6.72 });

  /* 光柱亮度呼吸 */
  const beam = clamp01(seg(t, B.hook, B.hook + 0.8));
  const glow = 0.16 + Math.sin(t * 1.8) * 0.05;

  /* 里程碑沿光柱两侧交错（大数字区 600-832 之下取三枚，避让照片区） */
  const nodes = (p.nodes ?? []).slice(0, 3);
  const nodeY = [880, 1044, 1208];

  return (
    <GsStage theme={T} p={p} bottomtag="LIGHTHOUSE　PLAN">
      {/* 一镜到底主体 */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 天光光柱：从顶到底 */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 190,
            top: 0,
            width: 380,
            height: 1920,
            background: `linear-gradient(180deg, ${rgba(T.glow1, 0.3)} 0%, ${rgba(T.glow1, 0.1)} 46%, ${rgba(T.glow1, 0)} 100%)`,
            clipPath: 'polygon(24% 0, 76% 0, 100% 100%, 0 100%)',
            opacity: beam,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 540 - 8,
            top: 0,
            width: 16,
            height: 1920,
            background: `linear-gradient(180deg, ${rgba(T.pale, 0.75)}, ${rgba(T.pale, 0.06)})`,
            opacity: beam * 0.9,
            filter: 'blur(3px)',
          }}
        />
        {/* 标题贴顶 */}
        <ChapLab theme={T} t={t} text="领航之光" top={300} start={B.hook + 0.14} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 380,
            width: 1080,
            textAlign: 'center',
            opacity: EASE.enter(seg(t, B.hook + 0.3, B.hook + 0.6)),
          }}
        >
          <span style={{ fontSize: 44, fontWeight: 400, letterSpacing: 9, color: rgba(T.pale, 0.9) }}>
            灯塔计划 · {p.slogan2 ?? '照亮航程'}
          </span>
        </div>

        {/* 大数字 */}
        <Txt
          size={48}
          color={rgba(T.pale, 0.92)}
          weight={500}
          letterSpacing={9}
          lineHeight={48}
          style={{
            position: 'absolute',
            left: 0,
            top: 520,
            width: 1080,
            textAlign: 'center',
            opacity: clamp01(seg(t, B.num, B.num + 0.3)),
          }}
        >
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 600,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: clamp01(seg(t, B.num + 0.04, B.num + 0.3)),
          }}
        >
          <NumRoll theme={T} target={p.premium} t={t} start={B.num + 0.14} dur={1.05} size={212}
            lineHeight={234} unit="万元" unitSize={46} unitColor={rgba(T.soft, 0.95)} />
        </div>
        <Sfx name="sfx_pop" at={B.num + 0.14 + 1.05 * 0.78} vol={0.26} />

        {/* 里程碑沿光柱两侧交错 */}
        {nodes.map((nd, i) => {
          const st = B.rows + i * 0.22;
          const e = EASE.glam(seg(t, st, st + 0.44));
          const sideL = i % 2 === 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: sideL ? 96 : 590,
                top: nodeY[i],
                width: 394,
                textAlign: sideL ? 'right' : 'left',
                opacity: clamp01(seg(t, st, st + 0.22)),
                transform: `translateX(${(1 - e) * (sideL ? -70 : 70)}px)`,
              }}
            >
              <Txt size={44} color={rgba(T.pale, 0.88)} weight={400} letterSpacing={6} lineHeight={42}>
                {nd.label} · {nd.note ?? ''}
              </Txt>
              <Txt size={62} color={T.cream} weight={600} font="num" letterSpacing={0} lineHeight={64}>
                {nd.value}
              </Txt>
              {/* 指向光柱的连线 */}
              <div
                style={{
                  position: 'absolute',
                  top: 58,
                  [sideL ? 'right' : 'left']: -46,
                  width: 40,
                  height: 1.5,
                  background: rgba(T.line, 0.6 * e),
                }}
              />
            </div>
          );
        })}
        <Sfx name="sfx_stamp" at={B.rows + 0.22} vol={0.26} />

        {/* 人物在光柱底端被照亮 */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 130,
            top: 1360,
            width: 260,
            height: 260,
            borderRadius: '50%',
            border: `2px solid ${rgba(T.line, 0.7)}`,
            boxShadow: `0 0 60px ${rgba(T.glow1, 0.35)}`,
            opacity: clamp01(seg(t, B.person + 0.1, B.person + 0.4)),
          }}
        />
        <PhotoCard
          theme={T}
          src={p.photo}
          left={540 - 122}
          top={1368}
          width={244}
          height={244}
          round
          objectPosition="50% 18%"
          style={{
            opacity: clamp01(seg(t, B.person + 0.1, B.person + 0.34)),
            transform: `scale(${lerp(0.7, 1, EASE.glam(seg(t, B.person + 0.1, B.person + 0.5)))})`,
          }}
        />
        <SplitReveal
          theme={T}
          t={t}
          text={p.name}
          size={62}
          top={1660}
          start={B.person + 0.36}
          mode="mask"
          staggerEach={0.08}
          dur={0.4}
          gold={false}
          color="#fff"
          weight={600}
          letterSpacing={10}
          lineHeight={82}
        />
        <Txt size={44} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={5} lineHeight={44}
          style={{ position: 'absolute', left: 0, top: 1756, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.person + 0.62, B.person + 0.9)) }}>
          {p.role}
        </Txt>
        <Sfx name="sfx_chime" at={B.person + 0.4} vol={0.26} />
        <Sfx name="sfx_shimmer" at={B.end - 0.5} vol={0.24} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={138} titleText="照亮下一段航程"
          subText="灯塔计划 · 领航者说" splitTitle drawLine titleLetterSpacing={8} />
      </Chapter>
    </GsStage>
  );
};
