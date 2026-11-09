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

/** 堆叠条四段的配色（从金到暗金，主题内自洽） */
const segColor = (T: (typeof THEMES)['hongjin'], i: number) =>
  [T.goldA, T.goldB, T.goldC, T.goldD][i];

/**
 * 76 · 产品结构版
 * 叙事：本月总保费 → 一条 100% 堆叠条按四类产品分段生长 → 明细注解 → 定版
 * 与旧模板差异：回答「钱从哪来」——讲结构不讲总量，适合经营分析场景。
 */
export const Portfolio: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const mix = (p.mix ?? []).slice(0, 4);
  const total = mix.reduce((a, b) => a + b.v, 0) || 100;

  // 堆叠条：各段依次生长
  let acc = 0;
  const segs = mix.map((m) => {
    const from = acc;
    acc += m.v;
    return { ...m, from };
  });

  return (
    <Stage theme={T} brand={p.brand} bottomtag="PORTFOLIO　MIX">
      {/* 01 总量 */}
      <Chapter t={t} in={[0.04, 0.32]} out={[2.4, 2.68]}>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={11}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 210,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          WHERE　THE　MONEY　CAME　FROM
        </Txt>
        <div style={{ position: 'absolute', left: 0, top: 262, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={216}
            weight={700}
            font="num"
            lineHeight={250}
            style={{
              opacity: outExpo(seg(t, 0.04, 0.36)),
              transform: `scale(${lerp(1.14, 1, outBack(seg(t, 0.04, 0.46), 1.9))})`,
            }}
          >
            {p.premium.toFixed(p.premium % 1 !== 0 ? 1 : 0)}
          </GoldText>
          <Txt
            size={54}
            color={rgba(cream, 0.9)}
            weight={500}
            font="serif"
            letterSpacing={8}
            lineHeight={72}
            style={{ marginTop: -14 }}
          >
            万 · 本月标保
          </Txt>
        </div>
        <Txt
          size={30}
          color={rgba(cream, 0.8)}
          font="serif"
          letterSpacing={6}
          lineHeight={44}
          style={{
            position: 'absolute',
            left: 0,
            top: 560,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.4, 0.72)),
          }}
        >
          {p.subValue || '结构比总量更值得看'}
        </Txt>
      </Chapter>

      {/* 02 堆叠条 + 明细 */}
      <Chapter t={t} in={[2.5, 2.8]} out={[4.9, 5.18]}>
        {/* 堆叠条 */}
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 396,
            width: 888,
            height: 96,
            borderRadius: 14,
            overflow: 'hidden',
            display: 'flex',
            border: `1px solid ${rgba(T.line, 0.28)}`,
            opacity: outExpo(seg(t, 2.58, 2.88)),
          }}
        >
          {segs.map((m, i) => {
            const s0 = 2.66 + i * 0.24;
            const g = outExpo(seg(t, s0, s0 + 0.44));
            return (
              <div
                key={m.label}
                style={{
                  width: `${(m.v / total) * 100 * g}%`,
                  background: `linear-gradient(180deg, ${segColor(T, i)} 0%, ${segColor(T, Math.min(3, i + 1))} 130%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: i < 3 ? `1px solid ${rgba(T.archbg, 0.35)}` : 'none',
                }}
              >
                {g > 0.7 && (
                  <Txt
                    size={34}
                    color={i < 2 ? rgba(T.archbg, 0.9) : rgba(T.goldA, 0.95)}
                    weight={700}
                    font="num"
                    lineHeight={44}
                  >
                    {m.v}%
                  </Txt>
                )}
              </div>
            );
          })}
        </div>

        {/* 明细行 */}
        {segs.map((m, i) => {
          const s0 = 3.0 + i * 0.22;
          const e = outExpo(seg(t, s0, s0 + 0.36));
          return (
            <div
              key={m.label}
              style={{
                position: 'absolute',
                left: 110,
                top: 590 + i * 158,
                width: 860,
                opacity: e,
                transform: `translateX(${(1 - e) * 36}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                {/* 色块 */}
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: segColor(T, i),
                    alignSelf: 'center',
                    boxShadow: `0 0 14px ${rgba(hexRgb(T.goldC), 0.5)}`,
                  }}
                />
                <Txt size={35} color={rgba(cream, 0.9)} weight={500} font="serif" letterSpacing={4} lineHeight={48}>
                  {m.label}
                </Txt>
                <Txt
                  size={24}
                  color={rgba(T.mist, 0.85)}
                  weight={300}
                  letterSpacing={2}
                  lineHeight={34}
                  style={{ marginLeft: 8 }}
                >
                  {m.note}
                </Txt>
                <GoldText
                  theme={T}
                  size={62}
                  weight={700}
                  font="num"
                  lineHeight={76}
                  style={{ marginLeft: 'auto' }}
                >
                  {m.v}%
                </GoldText>
              </div>
              <div
                style={{
                  marginTop: 18,
                  height: 1,
                  background: `linear-gradient(90deg, ${rgba(T.line, 0.3)}, ${rgba(T.line, 0.02)})`,
                }}
              />
            </div>
          );
        })}

        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={3}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 1250,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 4.0, 4.34)),
          }}
        >
          年金打底 · 重疾增值 · 医疗获客 · 意外补位
        </Txt>
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.12, 5.48]}>
        <Sfx name="sfx_gong" at={0.40} vol={0.45} />
        <EndCard theme={T} t={t} start={5.18} p={p} />
      </Chapter>
    </Stage>
  );
};
