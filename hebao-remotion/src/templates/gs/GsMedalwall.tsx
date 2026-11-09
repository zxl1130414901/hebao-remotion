import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { EndCard } from '../../components/EndCard';
import { DrawCircle } from '../../components/DrawLine';
import {
  GsStage, HookCap, gsBeats, SplitReveal,
  EASE, stagger, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 05 · 荣誉勋章墙版（深墨）
 * 叙事：六枚勋章，一路生花——badges 数据铺满全屏 3×2 勋章墙。
 * 版式：满铺网格构图（96 边距），无人物章、无大数字章——勋章本身就是内容。
 * 结构：3 章（标题 / 勋章墙逐枚盖章 / 定版）。
 */
export const GsMedalwall: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.shenmo;
  const B = gsBeats({ hook: 0.12, num: 1.7, rows: 5.4, end: 6.72 });

  const badges = (p.badges ?? []).slice(0, 6);
  const GX = [96, 390, 684];
  const GY = [560, 1010];

  return (
    <GsStage theme={T} p={p} bottomtag="WALL　OF　HONOR">
      {/* 章 1 · 标题 */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.num - 0.26, B.num - 0.02]}>
        <HookCap theme={T} t={t} text="WALL OF HONOR" top={430} start={B.hook + 0.1} />
        <SplitReveal theme={T} t={t} text="荣誉勋章墙" size={128} top={540} start={B.hook + 0.2}
          mode="drop" staggerEach={0.08} dur={0.42} lineHeight={160} />
        <Txt size={48} color={T.cream} weight={500} letterSpacing={14} lineHeight={50}
          style={{ position: 'absolute', left: 0, top: 780, width: 1080, textAlign: 'center',
            opacity: EASE.enter(seg(t, B.hook + 0.6, B.hook + 0.9)) }}>
          一枚勋章 · 一段征程
        </Txt>
        <Sfx name="sfx_gong" at={B.hook + 0.42} vol={0.34} />
      </Chapter>

      {/* 章 2 · 勋章墙逐枚盖章 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {badges.map((b, i) => {
          const d = stagger(i, 6, { mode: 'start', each: 0.28 });
          const st = B.num + 0.1 + d;
          const hit = st + 0.34; /* 盖章落点 */
          const e = EASE.hook(seg(t, st, st + 0.4));
          const wobble = Math.sin((t - hit) * 26) * Math.max(0, 1 - (t - hit) / 0.4);
          const unlocked = b.unlocked;
          const cellX = GX[i % 3];
          const cellY = GY[Math.floor(i / 3)];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: cellX,
                top: cellY,
                width: 288,
                height: 400,
                borderRadius: 22,
                border: `1px solid ${rgba(T.line, unlocked ? 0.6 : 0.28)}`,
                background: unlocked
                  ? `linear-gradient(180deg, ${rgba(T.line, 0.16)}, ${rgba(T.line, 0.04)})`
                  : `linear-gradient(180deg, rgba(0,0,0,.14), rgba(0,0,0,.05))`,
                boxShadow: unlocked ? '0 16px 40px rgba(0,0,0,.4)' : '0 8px 20px rgba(0,0,0,.2)',
                opacity: clamp01(seg(t, st, st + 0.18)),
                transform: `scale(${lerp(1.5, 1, e)}) rotate(${wobble}deg)`,
              }}
            >
              {/* 章体圆 */}
              <div
                style={{
                  position: 'absolute',
                  left: 94,
                  top: 66,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  border: `3px solid ${unlocked ? T.goldC : rgba(T.line, 0.3)}`,
                  background: unlocked
                    ? `radial-gradient(circle at 34% 30%, ${rgba(T.goldB, 0.5)}, ${rgba(T.goldD, 0.22)} 70%)`
                    : 'rgba(0,0,0,.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 58, fontWeight: 700, color: unlocked ? T.goldA : rgba(T.line, 0.55),
                  fontFamily: "'Noto Serif SC', 'SimSun', serif" }}>
                  {b.name.charAt(0)}
                </span>
              </div>
              {/* 描环（未解锁不描） */}
              {unlocked && (
                <DrawCircle
                  cx={144}
                  cy={116}
                  r={56}
                  t={t}
                  start={st + 0.08}
                  dur={0.34}
                  color={rgba(T.goldB, 0.85)}
                  strokeWidth={2}
                  opacity={0.85}
                  box={288}
                  left={0}
                  top={0}
                />
              )}
              <Txt size={46} color={unlocked ? T.cream : rgba(T.pale, 0.62)} weight={600}
                letterSpacing={3} lineHeight={46}
                style={{ position: 'absolute', top: 186, width: '100%', textAlign: 'center' }}>
                {b.name}
              </Txt>
              <Txt size={34} color={unlocked ? rgba(T.pale, 0.85) : rgba(T.pale, 0.5)} weight={400}
                letterSpacing={1} lineHeight={46}
                style={{ position: 'absolute', top: 244, width: '100%', textAlign: 'center', padding: '0 14px' }}>
                {b.desc}
              </Txt>
              {/* 徽标：已达成 / 待解锁 */}
              {unlocked ? (
                <div
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: 14,
                    padding: '3px 12px',
                    borderRadius: 999,
                    background: `linear-gradient(135deg, ${T.goldC}, ${T.goldD})`,
                    fontSize: 30,
                    fontWeight: 600,
                    letterSpacing: 3,
                    color: '#3A2506',
                  }}
                >
                  已达成
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: 14,
                    padding: '3px 12px',
                    borderRadius: 999,
                    border: `1px solid ${rgba(T.line, 0.5)}`,
                    fontSize: 30,
                    fontWeight: 500,
                    letterSpacing: 3,
                    color: rgba(T.pale, 0.6),
                  }}
                >
                  待解锁
                </div>
              )}
              {unlocked && <Sfx name="sfx_stamp" at={hit} vol={0.24} />}
            </div>
          );
        })}
        <Sfx name="sfx_shimmer" at={B.num + 0.1 + 5 * 0.28 + 0.6} vol={0.28} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={134} titleText="一路生花"
          subText="六枚勋章 · 见证征程" splitTitle drawLine titleLetterSpacing={20} />
      </Chapter>
    </GsStage>
  );
};
