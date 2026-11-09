import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { Txt } from '../components/GoldText';
import { NumChapter } from '../components/Chapters';
import { StatsRow } from '../components/StatsRow';
import { EndCard } from '../components/EndCard';
import { PhotoCard } from '../components/PhotoCard';
import { THEMES } from '../theme';
import { FONT_SERIF } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 23 · 荣誉奖状版
 * 叙事：奖状斜插升起 + 朱砂圆章 + 圆角小照 → 大数字 → 三项 → 定版
 * 朱砂印章色固定 #C42C2C（不随主题变化，与原版一致）。
 */

const STAMP = '196,44,44';

export const Cert: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const company = p.company ?? '泰康养老保险股份有限公司';

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 奖状升起 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        {(() => {
          const pc = outExpo(seg(t, 0.14, 0.9));
          const stp = outBack(seg(t, 1.58, 1.96), 2.0);
          const pho = outBack(seg(t, 0.96, 1.36), 1.5);
          return (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 120,
                  top: 330,
                  width: 840,
                  height: 1120,
                  background: `linear-gradient(165deg,${rgba(T.cream, 0.16)},${rgba(
                    T.line,
                    0.05
                  )} 60%,${rgba(T.cream, 0.12)})`,
                  border: `2px solid ${rgba(T.line, 0.55)}`,
                  opacity: clamp01(seg(t, 0.14, 0.5)),
                  transform: `rotate(${lerp(-7, -1.2, outBack(pc, 1.3))}deg) translateY(${
                    (1 - pc) * 220
                  }px)`,
                }}
              >
                {/* 双层内衬线（::before / ::after） */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 14,
                    border: `1px solid ${rgba(T.pale, 0.35)}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 22,
                    border: `1px solid ${rgba(T.line, 0.18)}`,
                  }}
                />
                <Txt
                  size={22}
                  color={rgba(T.mist, 0.85)}
                  weight={300}
                  letterSpacing={9}
                  lineHeight={28}
                  style={{
                    position: 'absolute',
                    top: 84,
                    width: 840,
                    textAlign: 'center',
                    opacity: outExpo(seg(t, 0.6, 0.86)),
                  }}
                >
                  CERTIFICATE OF HONOR
                </Txt>
                {(() => {
                  const pm = outExpo(seg(t, 0.7, 1.02));
                  return (
                    <div
                      style={{
                        position: 'absolute',
                        top: 132,
                        width: 840,
                        textAlign: 'center',
                        fontSize: 88,
                        letterSpacing: 30,
                        fontWeight: 700,
                        fontFamily: FONT_SERIF,
                        backgroundImage: `linear-gradient(180deg,${T.goldA},${T.goldC} 60%,${T.goldD})`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        opacity: pm,
                        transform: `translateY(${(1 - pm) * 20}px)`,
                      }}
                    >
                      荣誉证书
                    </div>
                  );
                })()}
                <div
                  style={{
                    position: 'absolute',
                    left: 170,
                    top: 280,
                    width: 500,
                    height: 1,
                    background: `linear-gradient(90deg,${rgba(T.line, 0)},${rgba(
                      T.line,
                      0.55
                    )},${rgba(T.line, 0)})`,
                    transform: `scaleX(${outExpo(seg(t, 0.88, 1.24))})`,
                  }}
                />
                {[
                  { top: 344, txt: '兹授予', bold: p.name, post: '同志', boldSize: 40, o: [1.0, 1.26] },
                  {
                    top: 432,
                    txt: '2026 年 10 月个人承保保费',
                    bold: '286.5 万元',
                    post: '',
                    boldColor: T.bright,
                    o: [1.12, 1.38],
                  },
                  { top: 520, txt: '特发此状，以资鼓励。', o: [1.24, 1.5] },
                ].map((l, i) => (
                  <Txt
                    key={i}
                    size={33}
                    color={rgba(T.cream, 0.92)}
                    weight={300}
                    letterSpacing={5}
                    lineHeight={46}
                    style={{
                      position: 'absolute',
                      top: l.top,
                      width: 840,
                      textAlign: 'center',
                      opacity: outExpo(seg(t, l.o[0], l.o[1])),
                    }}
                  >
                    {l.txt}
                    {l.bold && (
                      <span
                        style={{
                          fontSize: l.boldSize ?? 33,
                          fontWeight: l.boldSize ? 600 : 500,
                          letterSpacing: l.boldSize ? 8 : 5,
                          color: l.boldColor ?? '#fff',
                        }}
                      >
                        {`　${l.bold}　`}
                      </span>
                    )}
                    {l.post}
                  </Txt>
                ))}
                <Txt
                  size={28}
                  color={rgba(T.cream, 0.85)}
                  weight={400}
                  letterSpacing={3}
                  lineHeight={39}
                  style={{
                    position: 'absolute',
                    right: 96,
                    top: 924,
                    textAlign: 'right',
                    opacity: outExpo(seg(t, 1.4, 1.66)),
                  }}
                >
                  {company}
                </Txt>
                <Txt
                  size={24}
                  color={rgba(T.mist, 0.85)}
                  weight={300}
                  letterSpacing={4}
                  lineHeight={34}
                  style={{
                    position: 'absolute',
                    right: 96,
                    top: 972,
                    textAlign: 'right',
                    opacity: outExpo(seg(t, 1.48, 1.74)),
                  }}
                >
                  二〇二六年十月
                </Txt>
                {/* 朱砂圆章 */}
                <div
                  style={{
                    position: 'absolute',
                    left: 560,
                    top: 806,
                    width: 190,
                    height: 190,
                    borderRadius: '50%',
                    border: `4px solid ${rgba(STAMP, 0.85)}`,
                    opacity: clamp01(seg(t, 1.58, 1.74)),
                    transform: `rotate(9deg) scale(${lerp(1.7, 1, stp)})`,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 7,
                      borderRadius: '50%',
                      border: `1.5px solid ${rgba(STAMP, 0.7)}`,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 44,
                      width: 190,
                      textAlign: 'center',
                      fontSize: 32,
                      color: rgba(STAMP, 0.8),
                    }}
                  >
                    ★
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: 98,
                      width: 190,
                      textAlign: 'center',
                      fontSize: 22,
                      letterSpacing: 5,
                      color: rgba(STAMP, 0.82),
                      fontWeight: 600,
                    }}
                  >
                    泰康养老
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: 130,
                      width: 190,
                      textAlign: 'center',
                      fontSize: 18,
                      letterSpacing: 3,
                      color: rgba(STAMP, 0.68),
                    }}
                  >
                    2026
                  </div>
                </div>
              </div>
              {/* 圆角小照 */}
              <PhotoCard
                theme={T}
                src={p.photo}
                left={780}
                top={268}
                width={180}
                height={180}
                round
                style={{
                  opacity: clamp01(seg(t, 0.96, 1.12)),
                  transform: `scale(${lerp(0.6, 1, pho)})`,
                }}
              />
            </>
          );
        })()}
      </Chapter>

      {/* 02 大数字 */}
      <NumChapter theme={T} t={t} p={p} in={[2.46, 2.78]} out={[3.86, 4.16]} numSize={276} />

      {/* 03 三项 */}
      <Chapter t={t} in={[4.3, 4.62]} out={[5.86, 6.16]}>
        <StatsRow theme={T} t={t} stats={p.stats} start={4.38} />
      </Chapter>

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
