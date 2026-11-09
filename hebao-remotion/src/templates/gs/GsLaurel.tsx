import React from 'react';
import { Img, staticFile } from 'remotion';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { PhotoCard } from '../../components/PhotoCard';
import { EndCard } from '../../components/EndCard';
import {
  GsStage, gsBeats, SplitReveal, HookCap,
  EASE, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 11 · 加冕时刻版（红金）
 * 叙事：桂冠加冕——鎏金桂冠花环（生成素材）庄重落定，
 *       人物相片在花环中心亮起，王冠压顶，「王」气十足。
 * 版式：环形对称构图——花环居中为绝对主角，人物嵌于环心；
 *       数据以 delta + pill 一行带过，重心全在加冕仪式上。
 * 结构：3 章（花环落定 / 人物亮相+加冕 / 定版）。
 */
export const GsLaurel: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const B = gsBeats({ num: 2.3, rows: 4.9, end: 6.72 });

  /* 花环素材（桂冠 + 王冠，真透明 PNG） */
  const W = 560;                       // 显示宽
  const H = W * 932 / 829;             // 按素材比例
  const WX = 540 - W / 2;              // 水平居中
  const WY = 420;                      // 环顶
  /* 环心（素材中花环圆环中心约在 55% 高度处） */
  const RCX = 540;
  const RCY = WY + H * 0.55;
  /* 花环入场 */
  const wreathP = EASE.glam(seg(t, B.hook + 0.12, B.hook + 0.62));
  const wreathGlow = 0.5 + 0.5 * Math.sin((t - B.hook) * 2.2);

  return (
    <GsStage theme={T} p={p} bottomtag="CORONATION">
      {/* 章 1 · 桂冠花环落定（贯穿全片底层） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 环底光晕 */}
        <div style={{
          position: 'absolute', left: RCX - 360, top: RCY - 360, width: 720, height: 720,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${rgba(T.glow1, 0.28 + 0.1 * wreathGlow)} 0%, transparent 62%)`,
          opacity: wreathP,
        }} />
        {/* 鎏金桂冠花环（生成素材） */}
        <Img
          src={staticFile('assets/gs/laurel.png')}
          style={{
            position: 'absolute', left: WX, top: WY, width: W, height: H,
            opacity: wreathP,
            transform: `scale(${lerp(0.82, 1, wreathP)}) rotate(${lerp(-5, 0, wreathP)}deg)`,
            transformOrigin: '50% 40%',
            filter: `drop-shadow(0 10px 34px rgba(0,0,0,.45)) brightness(${1 + 0.08 * wreathGlow})`,
          }}
        />
        {/* 标题：钩子期点题 */}
        <HookCap theme={T} t={t} text="CORONATION · 加冕时刻" top={210} start={B.hook + 0.55} />
        <Sfx name="sfx_whoosh" at={B.hook + 0.12} vol={0.26} />
        <Sfx name="sfx_chime" at={B.hook + 0.7} vol={0.26} />
      </Chapter>

      {/* 章 2 · 人物嵌于环心 + 加冕 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 人物照（嵌在花环环心） */}
        <div
          style={{
            position: 'absolute',
            left: RCX - 172,
            top: RCY - 172,
            width: 344,
            height: 344,
            borderRadius: '50%',
            border: `3px solid ${rgba(T.line, 0.8)}`,
            boxShadow: `0 0 70px ${rgba(T.glow1, 0.32)}`,
            opacity: clamp01(seg(t, B.num + 0.86, B.num + 1.12)),
          }}
        />
        <PhotoCard
          theme={T}
          src={p.photo}
          left={RCX - 158}
          top={RCY - 158}
          width={316}
          height={316}
          round
          objectPosition="50% 18%"
          style={{
            opacity: clamp01(seg(t, B.num + 0.86, B.num + 1.08)),
            transform: `scale(${lerp(0.66, 1, EASE.glam(seg(t, B.num + 0.86, B.num + 1.28)))})`,
          }}
        />
        <Sfx name="sfx_gong" at={B.num + 0.92} vol={0.36} />
        <Sfx name="sfx_whoosh" at={B.num + 0.86} vol={0.26} />
        <SplitReveal theme={T} t={t} text={p.name} size={96} top={1090} start={B.num + 1.06}
          mode="drop" staggerEach={0.09} dur={0.4} lineHeight={120} />
        <Txt size={46} color={T.cream} weight={500} letterSpacing={5} lineHeight={46}
          style={{ position: 'absolute', left: 0, top: 1244, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 1.4, B.num + 1.7)) }}>
          {p.role}
        </Txt>
        {/* 荣誉标签 */}
        <div style={{ position: 'absolute', left: 0, top: 1330, width: 1080, textAlign: 'center',
          opacity: clamp01(seg(t, B.num + 1.56, B.num + 1.86)) }}>
          <span style={{ display: 'inline-block', padding: '12px 36px', borderRadius: 999,
            border: `1px solid ${rgba(T.goldC, 0.8)}`, fontSize: 44, fontWeight: 500,
            letterSpacing: 4, color: T.goldB, background: `rgba(${T.mask}, 0.4)` }}>
            {p.pill}
          </span>
        </div>
      </Chapter>

      {/* 章 3 · 数据一行带 + 金句 */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        <Txt size={48} color={T.cream2} weight={400} letterSpacing={4} lineHeight={50}
          style={{ position: 'absolute', left: 0, top: 1440, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.05, B.rows + 0.35)) }}>
          {p.dlabel} · {p.premium.toFixed(1)} 万元
        </Txt>
        <Txt size={44} color={rgba(T.pale, 0.85)} weight={400} letterSpacing={3} lineHeight={44}
          style={{ position: 'absolute', left: 0, top: 1510, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.3, B.rows + 0.6)) }}>
          {p.delta}
        </Txt>
        <Txt size={46} color={T.goldB} weight={500} letterSpacing={12} lineHeight={46}
          style={{ position: 'absolute', left: 0, top: 1590, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.55, B.rows + 0.85)) }}>
          实至名归 · 当之无愧
        </Txt>
        <Sfx name="sfx_shimmer" at={B.rows + 0.55} vol={0.26} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={142} titleText="加冕时刻"
          subText="桂冠为证 · 荣耀加身" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
