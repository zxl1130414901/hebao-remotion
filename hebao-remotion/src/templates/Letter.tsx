import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 28 · 感谢信版
 * 叙事：信笺浮现（常驻框架）→ 标题 → 称呼 → 三段正文逐段浮现 → 落款 → 信笺退场 → 定版
 * 定版整体比通用 EndCard 下移 40px。
 */

export const Letter: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const company = p.company ?? '泰康养老保险股份有限公司';
  const rate = p.stats[1]?.v ?? '218%';
  const body1 = `十月，您以 ${p.premium} 万元的承保保费、${rate} 的目标达成率，为公司交出了一份漂亮的答卷。`;
  const body2 = '数字背后，是 60 次拜访的坚持、12 天连续出单的专注，更是客户一句句「我信你」。';
  const body3 = '专业赢得信赖，坚持成就卓越。愿这份荣誉，成为您下一段征程的起点。';

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 信笺（独立控制浮现与退场，不走 Chapter） */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 300,
          width: 800,
          height: 1180,
          border: `1px solid ${rgba(T.line, 0.4)}`,
          opacity: clamp01(seg(t, 0.1, 0.44)) * (1 - seg(t, 4.8, 5.2)),
          transform: `translateY(${(1 - outExpo(seg(t, 0.1, 0.8))) * 70}px)`,
        }}
      >
        <div style={{ position: 'absolute', inset: 12, border: `1px solid ${rgba(T.line, 0.22)}` }} />
        <GoldText
          theme={T}
          size={84}
          font="serif"
          weight={700}
          lineHeight={118}
          letterSpacing={24}
          style={{
            position: 'absolute',
            top: 80,
            left: 0,
            width: 800,
            textAlign: 'center',
            textIndent: 24,
            opacity: clamp01(seg(t, 0.36, 0.66)),
          }}
        >
          感 谢 信
        </GoldText>
        <div
          style={{
            position: 'absolute',
            left: 220,
            top: 250,
            width: 360,
            height: 1,
            background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(T.pale, 0.55)},${rgba(
              T.pale,
              0
            )})`,
            transform: `scaleX(${outExpo(seg(t, 0.66, 1.0))})`,
          }}
        />
        {(() => {
          const pd = outExpo(seg(t, 1.0, 1.44));
          return (
            <Txt
              size={44}
              color="#fff"
              weight={500}
              letterSpacing={4}
              lineHeight={62}
              style={{
                position: 'absolute',
                left: 100,
                top: 330,
                width: 600,
                textAlign: 'left',
                opacity: pd,
                transform: `translateY(${(1 - pd) * 24}px)`,
              }}
            >
              尊敬的{p.name}经理：
            </Txt>
          );
        })()}
        {[
          { txt: body1, top: 460, st: 1.42 },
          { txt: body2, top: 640, st: 1.98 },
          { txt: body3, top: 820, st: 2.54 },
        ].map((b, i) => {
          const pb = outExpo(seg(t, b.st, b.st + 0.44));
          return (
            <Txt
              key={i}
              size={33}
              color={T.cream2}
              weight={300}
              letterSpacing={3}
              lineHeight={63}
              style={{
                position: 'absolute',
                left: 100,
                top: b.top,
                width: 600,
                textAlign: 'left',
                opacity: pb,
                transform: `translateY(${(1 - pb) * 24}px)`,
              }}
            >
              {b.txt}
            </Txt>
          );
        })}
        <div
          style={{
            position: 'absolute',
            right: 100,
            bottom: 70,
            textAlign: 'right',
            opacity: outExpo(seg(t, 3.1, 3.5)),
          }}
        >
          <Txt size={34} color={T.bright} weight={500} font="serif" letterSpacing={4} lineHeight={48}>
            {company}
          </Txt>
          <Txt
            size={27}
            color={rgba(T.soft, 0.85)}
            weight={300}
            letterSpacing={3}
            lineHeight={38}
            style={{ marginTop: 14 }}
          >
            {p.dateText}
          </Txt>
        </div>
      </div>

      {/* 定版（信笺退场后，整体下移 40px） */}
      <Chapter t={t} in={[5.6, 5.94]}>
        <Sfx name="sfx_pop" at={0.60} vol={0.3} />
        <EndCard theme={T} t={t} start={5.68} p={p} titleTop={560} qrTop={1010} dateTop={1568} noteTop={1624} />
      </Chapter>
    </Stage>
  );
};
