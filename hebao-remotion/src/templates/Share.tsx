import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { SloganChapter } from '../components/Chapters';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 16 · 占比称雄版
 * 叙事：标语 → 占比大环充能（No.1 环心）→ 图例三行 → 定版
 */
const R = 290;
const CIRC = 2 * Math.PI * R;

export const Share: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const pct = p.pct ?? 38;

  const rp = outExpo(seg(t, 2.26, 3.5));
  const rc = outBack(seg(t, 2.4, 2.86), 1.7);

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 标语 */}
      <SloganChapter theme={T} t={t} slogan={p.slogan} eyebrow="MARKET　LEADER" in={[0.1, 0.44]} out={[2.0, 2.3]} eyebrowTop={520} sloganTop={600} />

      {/* 02 占比环 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[4.1, 4.4]}>
        <div style={{ position: 'absolute', left: 205, top: 450, width: 670, height: 670 }}>
          <svg viewBox="0 0 670 670" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="share-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={T.goldB} />
                <stop offset=".6" stopColor={T.goldC} />
                <stop offset="1" stopColor={T.goldD} />
              </linearGradient>
            </defs>
            <circle cx={335} cy={335} r={R} fill="none" stroke={rgba(T.line, 0.14)} strokeWidth={30} />
            <circle
              cx={335}
              cy={335}
              r={R}
              fill="none"
              stroke="url(#share-grad)"
              strokeWidth={30}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - rp * (pct / 100))}
              style={{ filter: `drop-shadow(0 0 16px ${rgba(T.line, 0.45)})` }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: clamp01(seg(t, 2.4, 2.62)),
              transform: `scale(${lerp(0.8, 1, rc)})`,
            }}
          >
            <GoldText theme={T} size={150} font="num" weight={700} lineHeight={180}>
              No.1
            </GoldText>
            <Txt
              size={40}
              color={rgba(T.soft, 0.9)}
              weight={300}
              letterSpacing={6}
              lineHeight={56}
              style={{ marginTop: 6 }}
            >
              {p.shareLab || '组内占比 38%'}
            </Txt>
          </div>
        </div>
        <Txt
          size={31}
          color={rgba(T.soft, 0.8)}
          weight={300}
          letterSpacing={5}
          lineHeight={43}
          style={{
            position: 'absolute',
            top: 1150,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.5, 3.86)),
            transform: `translateY(${(1 - outExpo(seg(t, 3.5, 3.86))) * 18}px)`,
          }}
        >
          {p.dlabel} · 全组第一
        </Txt>
      </Chapter>

      {/* 03 图例 */}
      <Chapter t={t} in={[4.24, 4.56]} out={[5.6, 5.9]}>
        <div style={{ position: 'absolute', left: 250, top: 600, width: 580 }}>
          {p.stats.slice(0, 3).map((st, i) => {
            const st0 = 4.36 + i * 0.22;
            const e = outExpo(seg(t, st0, st0 + 0.34));
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  padding: '30px 0',
                  borderBottom: `1px solid ${rgba(T.line, 0.2)}`,
                  opacity: e,
                  transform: `translateX(${(1 - e) * 40}px)`,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    transform: 'rotate(45deg)',
                    background: `linear-gradient(135deg,${T.goldB},${T.goldD})`,
                  }}
                />
                <Txt
                  size={34}
                  color={rgba(T.mist, 1)}
                  weight={300}
                  letterSpacing={4}
                  lineHeight={48}
                  style={{ flex: 1 }}
                >
                  {st.k}
                </Txt>
                <GoldText theme={T} size={56} font="num" weight={600} lineHeight={70}>
                  {st.v}
                </GoldText>
              </div>
            );
          })}
        </div>
      </Chapter>

      {/* 04 定版 */}
      <Chapter t={t} in={[6.24, 6.58]}>
        <EndCard theme={T} t={t} start={6.32} p={p} />
      </Chapter>
    </Stage>
  );
};
