import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { SloganChapter } from '../components/Chapters';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 22 · 九宫战绩版
 * 叙事：标语 → 九宫逐格点亮（中心「贺」字压轴）→ 人物 → 定版
 * g1-g3 由 stats 驱动，其余六格沿用原版固定战绩。
 */

export const Grid: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const cells: { id: string; v: string; k?: string; center?: boolean }[] = [
    { id: 'g1', v: p.stats[0]?.v ?? '42', k: p.stats[0]?.k ?? '承保件数' },
    { id: 'g2', v: p.stats[1]?.v ?? '218%', k: p.stats[1]?.k ?? '目标达成率' },
    { id: 'g3', v: p.stats[2]?.v ?? 'No.3', k: p.stats[2]?.k ?? '全省排名' },
    { id: 'g4', v: '100%', k: '晨会出勤' },
    { id: 'g5', v: '贺', center: true },
    { id: 'g6', v: '36人', k: '新增客户' },
    { id: 'g7', v: '98.6%', k: '13月继续率' },
    { id: 'g8', v: '+2', k: '团队增员' },
    { id: 'g9', v: '16天', k: '当月出单' },
  ];
  /* 点亮顺序：8 个外格 → 中心压轴 */
  const order = ['g1', 'g2', 'g3', 'g4', 'g6', 'g7', 'g8', 'g9', 'g5'];

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 标语 */}
      <SloganChapter
        theme={T}
        t={t}
        slogan={p.slogan}
        eyebrow="FULL　SPECTRUM　ACHIEVEMENT"
        in={[0.1, 0.44]}
        out={[2.0, 2.3]}
      />

      {/* 02 九宫逐格点亮 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[4.7, 5.0]}>
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 430,
            width: 780,
            height: 780,
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gridTemplateRows: 'repeat(3,1fr)',
            gap: 18,
          }}
        >
          {cells.map((c) => {
            const idx = order.indexOf(c.id);
            const st = 2.3 + idx * 0.2;
            const pr = outBack(seg(t, st, st + 0.32), 1.9);
            return (
              <div
                key={c.id}
                style={{
                  border: c.center
                    ? `2px solid ${rgba(T.pale, 0.85)}`
                    : `1px solid ${rgba(T.line, 0.3)}`,
                  borderRadius: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: c.center
                    ? `linear-gradient(160deg,${rgba(T.goldC, 0.4)},${rgba(T.goldD, 0.1)})`
                    : undefined,
                  boxShadow: c.center ? `0 0 30px ${rgba(T.line, 0.35)}` : undefined,
                  opacity: clamp01(seg(t, st, st + 0.16)),
                  transform: `scale(${lerp(0.6, 1, pr)})`,
                }}
              >
                {c.center ? (
                  <GoldText theme={T} size={96} font="serif" weight={700} lineHeight={130}>
                    {c.v}
                  </GoldText>
                ) : (
                  <>
                    <GoldText theme={T} size={52} font="num" weight={600} lineHeight={70}>
                      {c.v}
                    </GoldText>
                    <Txt
                      size={23}
                      color={rgba(T.soft, 0.85)}
                      weight={300}
                      letterSpacing={3}
                      lineHeight={32}
                      style={{ marginTop: 10 }}
                    >
                      {c.k}
                    </Txt>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Chapter>

      {/* 03 人物（无照片） */}
      <PersonChapter theme={T} t={t} p={p} in={[4.56, 4.88]} out={[6.0, 6.3]} hidePhoto />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.44, 6.78]}>
        <EndCard theme={T} t={t} start={6.52} p={p} />
      </Chapter>
    </Stage>
  );
};
