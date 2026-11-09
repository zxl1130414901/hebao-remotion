import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { NumRoll } from '../../components/NumRoll';
import { EndCard } from '../../components/EndCard';
import { GoldBurst } from '../../components/textures';
import {
  GsStage, HookCap, Scrim, gsBeats, SplitReveal,
  EASE, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 01 · 十月首爆版（红金）
 * 叙事：首战告捷的「爆点」——巨字砸落 → 全屏爆点数字 → 底部三列战况带。
 * 版式：全出血居中构图，数据章改为「横向三列」而非竖排三行。
 * 结构：3 章（钩子 / 数据带 / 定版），无人物章——首爆讲的是战况不是个人。
 */
export const GsImpact: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const B = gsBeats({ num: 2.16, rows: 4.3, end: 6.72 });

  const t0 = B.hook + 0.44;
  const wave = (delay: number) => {
    const wp = seg(t, t0 + delay, t0 + delay + 0.62);
    if (wp <= 0 || wp >= 1) return null;
    return { r: lerp(90, 640, EASE.settle(wp)), op: (1 - wp) * 0.55 };
  };
  const w1 = wave(0);
  const w2 = wave(0.12);
  const shake = Math.max(0, 1 - (t - t0) / 0.3);
  const sx = shake > 0 ? Math.sin(t * 137) * 6 * shake : 0;
  const sy = shake > 0 ? Math.cos(t * 111) * 4 * shake : 0;

  /* 数据带三列：中线数字（hl 金字），两侧白字 */
  const cols = p.stats.slice(0, 3);
  const colStart = (i: number) => B.rows + 0.1 + i * 0.14;

  return (
    <GsStage
      theme={T}
      p={p}
      bgLayer={
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 380,
            width: 900,
            height: 900,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(T.glow1, 0.24)} 0%, ${rgba(T.glow1, 0)} 66%)`,
            opacity: clamp01(seg(t, t0 - 0.1, t0 + 0.2)),
          }}
        />
      }
    >
      {/* 章 1 · 巨字首爆 */}
      <Chapter t={t} in={[B.hook, B.hook + 0.26]} out={[B.num - 0.26, B.num - 0.02]}>
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${sx.toFixed(2)}px, ${sy.toFixed(2)}px)` }}>
          <HookCap theme={T} t={t} text="FIRST BURST · 十月首战" top={520} start={B.hook + 0.12} />
          <SplitReveal
            theme={T}
            t={t}
            text="首爆"
            size={300}
            top={640}
            start={B.hook + 0.24}
            mode="drop"
            staggerEach={0.12}
            dur={0.42}
            lineHeight={340}
          />
          {w1 && (
            <div
              style={{
                position: 'absolute',
                left: 540 - w1.r,
                top: 800 - w1.r,
                width: w1.r * 2,
                height: w1.r * 2,
                borderRadius: '50%',
                border: `2px solid ${rgba(T.line, 0.8)}`,
                opacity: w1.op,
              }}
            />
          )}
          {w2 && (
            <div
              style={{
                position: 'absolute',
                left: 540 - w2.r,
                top: 800 - w2.r,
                width: w2.r * 2,
                height: w2.r * 2,
                borderRadius: '50%',
                border: `1px solid ${rgba(T.pale, 0.7)}`,
                opacity: w2.op,
              }}
            />
          )}
          <GoldBurst theme={T} t={t} t0={t0} cx={540} cy={800} count={32} spread={360} />
          <Txt
            size={54}
            color={T.cream}
            weight={500}
            letterSpacing={14}
            lineHeight={56}
            style={{
              position: 'absolute',
              left: 0,
              top: 1120,
              width: 1080,
              textAlign: 'center',
              opacity: clamp01(seg(t, t0 + 0.24, t0 + 0.5)),
              transform: `translateY(${(1 - EASE.enter(seg(t, t0 + 0.24, t0 + 0.5))) * 20}px)`,
            }}
          >
            一击即中 · 开门首胜
          </Txt>
          <Sfx name="sfx_gong" at={t0} vol={0.4} />
        </div>
      </Chapter>

      {/* 章 2 · 全屏爆点数字 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.rows - 0.26, B.rows - 0.02]}>
        <Txt
          size={52}
          color={rgba(T.pale, 0.95)}
          weight={500}
          letterSpacing={10}
          lineHeight={54}
          style={{
            position: 'absolute',
            left: 0,
            top: 600,
            width: 1080,
            textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 0.06, B.num + 0.32)),
          }}
        >
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 700,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: clamp01(seg(t, B.num + 0.1, B.num + 0.36)),
          }}
        >
          <NumRoll
            theme={T}
            target={p.premium}
            t={t}
            start={B.num + 0.18}
            dur={1.05}
            size={310}
            lineHeight={341}
            unit="万元"
            unitSize={58}
            unitColor={rgba(T.soft, 0.95)}
          />
        </div>
        <Sfx name="sfx_pop" at={B.num + 0.18 + 1.05 * 0.78} vol={0.26} />
        <Txt
          size={50}
          color={T.cream2}
          weight={400}
          letterSpacing={6}
          lineHeight={52}
          style={{
            position: 'absolute',
            left: 0,
            top: 1120,
            width: 1080,
            textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 1.0, B.num + 1.28)),
            transform: `translateY(${(1 - EASE.enter(seg(t, B.num + 1.0, B.num + 1.28))) * 18}px)`,
          }}
        >
          {p.delta}
        </Txt>
        <Scrim theme={T} top={560} height={660} strength={0.34} />
      </Chapter>

      {/* 章 3 · 三行竖排战报（纵向铺开，行距充裕不拥挤） */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {cols.map((s, i) => {
          const st = colStart(i);
          const e = EASE.glam(seg(t, st, st + 0.42));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 150,
                top: 660 + i * 286,
                width: 780,
                opacity: clamp01(seg(t, st, st + 0.22)),
                transform: `translateX(${(1 - e) * -90}px)`,
              }}
            >
              {/* 行首金色刻度条 */}
              <div style={{ position: 'absolute', left: 0, top: 6, width: 5, height: 150,
                borderRadius: 3,
                background: `linear-gradient(180deg, ${T.goldB}, ${rgba(T.goldD, 0.15)})` }} />
              <Txt size={48} color={rgba(T.pale, 0.94)} weight={400} letterSpacing={9} lineHeight={48}
                style={{ position: 'absolute', left: 42, top: 0 }}>
                {s.k}
              </Txt>
              {s.hl ? (
                <GoldText theme={T} size={102} weight={700} font="num" lineHeight={118} letterSpacing={-2}
                  style={{ position: 'absolute', right: 44, top: 52 }}>
                  {s.v}
                </GoldText>
              ) : (
                <Txt size={102} color={T.cream} weight={600} font="num" letterSpacing={-2} lineHeight={118}
                  style={{ position: 'absolute', right: 44, top: 52 }}>
                  {s.v}
                </Txt>
              )}
              {/* 行尾淡金徽记点 */}
              <div style={{ position: 'absolute', right: 6, top: 64, width: 14, height: 14,
                borderRadius: '50%', background: rgba(T.goldC, s.hl ? 0.9 : 0.35),
                boxShadow: s.hl ? `0 0 18px ${rgba(T.goldC, 0.7)}` : 'none' }} />
            </div>
          );
        })}
        {/* 行间渐隐分隔线 */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 150,
              top: 908 + i * 286,
              width: 780,
              height: 1.5,
              background: `linear-gradient(90deg, ${rgba(T.goldC, 0.4)}, ${rgba(T.line, 0.06)})`,
              opacity: clamp01(seg(t, B.rows + 0.3 + i * 0.14, B.rows + 0.56 + i * 0.14)),
            }}
          />
        ))}
        <Sfx name="sfx_stamp" at={B.rows + 0.24} vol={0.3} />
      </Chapter>

      {/* 章 4 · 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard
          theme={T}
          t={t}
          start={B.end}
          p={p}
          titleSize={150}
          titleText="再创新高"
          subText="十月首战 · 全年可期"
          splitTitle
          drawLine
          titleLetterSpacing={22}
        />
      </Chapter>
    </GsStage>
  );
};
