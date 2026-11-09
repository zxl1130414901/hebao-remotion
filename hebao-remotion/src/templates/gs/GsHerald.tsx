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
  GsStage, gsBeats, SplitReveal,
  EASE, stagger, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 19 · 荣耀号角版（红金）
 * 叙事：为胜利者吹响号角——鎏金号角（生成素材）居中亮相，
 *       放射金线齐鸣，巨字宣示，人物压轴。
 * 版式：纵向三段式——号角装置占上 1/3，巨字宣示居中，人物数据沉底。
 * 结构：3 章（号角亮相+巨字 / 数据带 / 人物+定版）。
 */
export const GsHerald: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const B = gsBeats({ num: 2.4, rows: 4.9, end: 6.72 });

  const CX = 540;
  /* 号角素材（真透明 PNG） */
  const HW = 620;
  const HH = HW * 934 / 913;
  const HX = CX - HW / 2;
  const HY = 248;
  /* 号角入场 + 悬浮微动 */
  const hornP = EASE.enter(seg(t, B.hook + 0.15, B.hook + 0.9));
  const floatY = Math.sin(t * 1.7) * 7;

  return (
    <GsStage theme={T} p={p} bottomtag="HERALD">
      {/* 章 1 · 号角亮相 + 巨字宣示（贯穿） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 号角背后光晕 */}
        <div style={{
          position: 'absolute', left: CX - 380, top: HY + HH / 2 - 380, width: 760, height: 760,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${rgba(T.goldC, 0.2)} 0%, transparent 60%)`,
          opacity: hornP,
        }} />
        {/* 放射细线（8 根，齐鸣式弹出，围绕号角） */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45 + 22) * (Math.PI / 180);
          const st = B.hook + 0.7 + i * 0.045;
          const e = EASE.enter(seg(t, st, st + 0.3));
          const r1 = 330;
          const r2 = 330 + 95 * e;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: CX + Math.cos(a) * r1,
                top: HY + HH / 2 + Math.sin(a) * r1,
                width: r2 - r1,
                height: 2,
                background: rgba(T.line, 0.62 * e),
                transform: `rotate(${(i * 45 + 22)}deg)`,
                transformOrigin: '0 50%',
              }}
            />
          );
        })}
        {/* 鎏金号角（生成素材） */}
        <Img
          src={staticFile('assets/gs/horn.png')}
          style={{
            position: 'absolute', left: HX, top: HY, width: HW, height: HH,
            opacity: hornP,
            transform: `translateY(${lerp(70, 0, hornP) + floatY}px) rotate(${lerp(-4, 0, hornP)}deg)`,
            filter: `drop-shadow(0 18px 42px rgba(0,0,0,.48)) brightness(${1 + 0.05 * Math.sin(t * 2.4)})`,
          }}
        />
        <Sfx name="sfx_gong" at={B.hook + 0.92} vol={0.38} />
        {/* 巨字宣示 */}
        <SplitReveal theme={T} t={t} text="荣耀号角" size={104} top={956} start={B.hook + 1.0}
          mode="drop" staggerEach={0.08} dur={0.4} lineHeight={128} />
        <Txt size={48} color={T.cream} weight={500} letterSpacing={12} lineHeight={48}
          style={{ position: 'absolute', left: 0, top: 1120, width: 1080, textAlign: 'center',
            opacity: EASE.enter(seg(t, B.hook + 1.4, B.hook + 1.7)) }}>
          为奋斗者而鸣
        </Txt>
        <Sfx name="sfx_chime" at={B.hook + 1.4} vol={0.26} />
      </Chapter>

      {/* 章 2 · 数据带（人物亮相前退场，避让人物区） */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.rows - 0.26, B.rows - 0.02]}>
        <Sfx name="sfx_stamp" at={B.num + 0.1} vol={0.26} />
        {/* 数据横带 */}
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 1180,
            width: 900,
            padding: '34px 0',
            borderRadius: 20,
            border: `1px solid ${rgba(T.line, 0.55)}`,
            background: `linear-gradient(180deg, ${rgba(T.mask, 0.55)}, ${rgba(T.mask, 0.3)})`,
            textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 0.2, B.num + 0.46)),
            transform: `translateY(${(1 - EASE.enter(seg(t, B.num + 0.2, B.num + 0.54))) * 50}px)`,
          }}
        >
          <Txt size={44} color={rgba(T.pale, 0.92)} weight={500} letterSpacing={7} lineHeight={44}>
            {p.dlabel}
          </Txt>
          <div style={{ marginTop: 10 }}>
            <GoldText theme={T} size={120} weight={700} font="num" lineHeight={136} letterSpacing={-3}>
              {p.premium.toFixed(1)}
              <span style={{ fontSize: 56, letterSpacing: 3, marginLeft: 8 }}>万元</span>
            </GoldText>
          </div>
          <Txt size={42} color={T.cream2} weight={400} letterSpacing={3} lineHeight={42}
            style={{ marginTop: 6, display: 'block' }}>
            {p.delta}
          </Txt>
        </div>
        <Sfx name="sfx_pop" at={B.num + 0.44} vol={0.26} />
      </Chapter>

      {/* 章 3 · 人物亮相 + 宣言 */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        <div
          style={{
            position: 'absolute',
            left: CX - 156,
            top: 1180,
            width: 312,
            height: 312,
            borderRadius: '50%',
            border: `3px solid ${rgba(T.line, 0.8)}`,
            boxShadow: `0 0 60px ${rgba(T.glow1, 0.3)}`,
            opacity: clamp01(seg(t, B.rows + 0.1, B.rows + 0.36)),
          }}
        />
        <PhotoCard
          theme={T}
          src={p.photo}
          left={CX - 144}
          top={1192}
          width={288}
          height={288}
          round
          objectPosition="50% 18%"
          style={{
            opacity: clamp01(seg(t, B.rows + 0.1, B.rows + 0.32)),
            transform: `scale(${lerp(0.66, 1, EASE.glam(seg(t, B.rows + 0.1, B.rows + 0.5)))})`,
          }}
        />
        <Sfx name="sfx_whoosh" at={B.rows + 0.1} vol={0.26} />
        <SplitReveal theme={T} t={t} text={p.name} size={76} top={1530} start={B.rows + 0.34}
          mode="mask" staggerEach={0.08} dur={0.4} gold={false} color="#fff" weight={600}
          letterSpacing={10} lineHeight={98} />
        <Txt size={42} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={4} lineHeight={42}
          style={{ position: 'absolute', left: 0, top: 1640, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.64, B.rows + 0.92)) }}>
          {p.role}
        </Txt>
        <Sfx name="sfx_chime" at={B.rows + 0.6} vol={0.24} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={144} titleText="为你而鸣"
          subText="荣耀号角 · 声动全城" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
