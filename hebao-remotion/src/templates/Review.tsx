import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 79 · 季度复盘版
 * 叙事：三段式复盘（做对了 / 待改进 / 下一步）逐条亮出 → 一句总结 → 定版
 * 与旧模板差异：全库第一个「不是喜报」的模板 —— 允许说不足，用于团队复盘会。
 */
export const Review: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const r = p.retro ?? { good: [], bad: [], next: [] };
  const groups = [
    { icon: '✓', title: '做对了', color: gold, items: r.good.slice(0, 2) },
    { icon: '△', title: '待改进', color: hexRgb(T.mist), items: r.bad.slice(0, 2) },
    { icon: '→', title: '下一步', color: hexRgb(T.cream2), items: r.next.slice(0, 2) },
  ];

  return (
    <Stage theme={T} brand={p.brand} bottomtag="QUARTERLY　REVIEW">
      {/* 01 三段复盘 */}
      <Chapter t={t} in={[0.04, 0.32]} out={[4.6, 4.88]}>
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 168,
            width: 888,
            display: 'flex',
            alignItems: 'flex-end',
            paddingBottom: 20,
            borderBottom: `1px solid ${rgba(T.line, 0.28)}`,
            opacity: outExpo(seg(t, 0.06, 0.36)),
          }}
        >
          <div>
            <Txt size={22} color={rgba(T.mist, 0.85)} letterSpacing={8} lineHeight={30}>
              QUARTER　FOUR　REVIEW
            </Txt>
            <Txt
              size={50}
              color="#fff"
              weight={600}
              font="serif"
              letterSpacing={8}
              lineHeight={68}
              style={{ marginTop: 4 }}
            >
              {p.slogan || '季度复盘'}
            </Txt>
          </div>
          <Txt
            size={30}
            color={rgba(gold, 0.85)}
            font="num"
            letterSpacing={2}
            lineHeight={40}
            style={{ marginLeft: 'auto' }}
          >
            {p.dateText}
          </Txt>
        </div>

        {groups.map((g, gi) => {
          const gs = 0.26 + gi * 0.9;
          return (
            <div key={g.title} style={{ position: 'absolute', left: 0, top: 380 + gi * 400, width: 1080 }}>
              {/* 段标题 */}
              <div
                style={{
                  position: 'absolute',
                  left: 118,
                  top: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  opacity: outExpo(seg(t, gs, gs + 0.34)),
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 13,
                    border: `1.5px solid ${rgba(g.color, 0.6)}`,
                    background: rgba(g.color, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Txt size={30} color={rgba(g.color, 0.92)} weight={700} lineHeight={40}>
                    {g.icon}
                  </Txt>
                </div>
                <Txt size={40} color={rgba(cream, 0.92)} weight={600} font="serif" letterSpacing={7} lineHeight={54}>
                  {g.title}
                </Txt>
              </div>

              {/* 条目 */}
              {g.items.map((it, ii) => {
                const s0 = gs + 0.2 + ii * 0.2;
                const e = outExpo(seg(t, s0, s0 + 0.36));
                return (
                  <div
                    key={it}
                    style={{
                      position: 'absolute',
                      left: 190,
                      top: 96 + ii * 104,
                      width: 750,
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 16,
                      opacity: e,
                      transform: `translateX(${(1 - e) * 30}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: rgba(g.color, 0.75),
                        alignSelf: 'center',
                        flex: 'none',
                      }}
                    />
                    <Txt size={33} color={rgba(cream, 0.84)} weight={300} letterSpacing={3} lineHeight={48}>
                      {it}
                    </Txt>
                  </div>
                );
              })}
            </div>
          );
        })}
      </Chapter>

      {/* 02 一句总结 */}
      <Chapter t={t} in={[4.72, 5.02]} out={[6.4, 6.68]}>
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 480,
            width: 820,
            padding: '44px 52px',
            borderRadius: 18,
            background: rgba(T.mask, 0.52),
            border: `1px solid ${rgba(T.line, 0.3)}`,
            opacity: outExpo(seg(t, 4.8, 5.14)),
            transform: `translateY(${(1 - outExpo(seg(t, 4.8, 5.18))) * 26}px)`,
          }}
        >
          <Txt size={23} color={rgba(T.mist, 0.85)} letterSpacing={8} lineHeight={33}>
            复 盘 结 论
          </Txt>
          <Txt
            size={40}
            color={T.cream}
            weight={500}
            font="serif"
            letterSpacing={4}
            lineHeight={62}
            style={{ marginTop: 18 }}
          >
            {p.quote || '赢在坚持，输在节奏'}
          </Txt>
          <Txt
            size={25}
            color={rgba(T.mist, 0.85)}
            weight={300}
            letterSpacing={3}
            lineHeight={38}
            style={{ marginTop: 20 }}
          >
            {p.subValue || '下一季度，把「待改进」搬进「做对了」'}
          </Txt>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 880, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={140}
            weight={700}
            font="num"
            lineHeight={164}
            style={{
              opacity: outExpo(seg(t, 5.2, 5.52)),
              transform: `scale(${lerp(1.12, 1, outBack(seg(t, 5.2, 5.6), 1.9))})`,
            }}
          >
            {p.hero || '90'}
          </GoldText>
          <Txt
            size={46}
            color={rgba(cream, 0.88)}
            weight={500}
            font="serif"
            letterSpacing={8}
            lineHeight={62}
            style={{ marginTop: -8 }}
          >
            天后，复盘下一个季度
          </Txt>
        </div>
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[6.5, 6.84]}>
        <Sfx name="sfx_gong" at={5.48} vol={0.42} />
        <EndCard theme={T} t={t} start={6.56} p={p} />
      </Chapter>
    </Stage>
  );
};
