import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { SloganChapter } from '../components/Chapters';
import { NumRoll } from '../components/NumRoll';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 27 · 司龄荣光版
 * 叙事：标语 → 年数大滚数（周年）→ 三个里程碑年份 → 人物+格言 → 定版
 * 定版文案与全局不同：感恩有你 / 下一个十年 · 继续同行。
 */

const MILES = [
  { y: '2014', tt: '初入泰康', ds: '怀揣热忱 · 一张保单一颗心' },
  { y: '2020', tt: '脱颖而出', ds: '连续季度标兵 · 客户转介绍过半' },
  { y: '2026', tt: '司龄荣光', ds: '十二年坚守 · 服务家庭 800+' },
];

export const Tenure: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 标语 */}
      <SloganChapter theme={T} t={t} slogan={p.slogan} eyebrow="YEARS　OF　DEDICATION" in={[0.1, 0.44]} out={[2.0, 2.3]} />

      {/* 02 年数滚动 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[3.64, 3.94]}>
        {(() => {
          const pl = outExpo(seg(t, 2.2, 2.44));
          return (
            <>
              <Txt
                size={34}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={6}
                lineHeight={48}
                style={{
                  position: 'absolute',
                  top: 560,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pl,
                  transform: `translateY(${(1 - pl) * 18}px)`,
                }}
              >
                与服务岁月同行
              </Txt>
              <div
                style={{
                  position: 'absolute',
                  top: 648,
                  width: 1080,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'baseline',
                  gap: 18,
                  opacity: outExpo(seg(t, 2.32, 2.58)),
                }}
              >
                <NumRoll theme={T} target={12} t={t} start={2.26} dur={1.08} size={340} lineHeight={380} unit="周年" unitSize={64} />
              </div>
              <Txt
                size={31}
                color={rgba(T.soft, 0.85)}
                weight={400}
                letterSpacing={5}
                lineHeight={43}
                style={{
                  position: 'absolute',
                  top: 1120,
                  width: 1080,
                  textAlign: 'center',
                  opacity: outExpo(seg(t, 3.24, 3.54)),
                  transform: `translateY(${(1 - outExpo(seg(t, 3.24, 3.54))) * 18}px)`,
                }}
              >
                从第一天起 · 就没想过停下
              </Txt>
            </>
          );
        })()}
      </Chapter>

      {/* 03 三里程碑 */}
      <Chapter t={t} in={[3.78, 4.1]} out={[5.24, 5.54]}>
        <div style={{ position: 'absolute', top: 560, width: 1080, display: 'flex', justifyContent: 'center' }}>
          {MILES.map((m, i) => {
            const st = 3.9 + i * 0.22;
            const pr = outExpo(seg(t, st, st + 0.34));
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div
                    style={{
                      width: 1,
                      height: 230,
                      marginTop: 14,
                      background: `linear-gradient(180deg,${rgba(T.line, 0)},${rgba(
                        T.line,
                        0.55
                      )},${rgba(T.line, 0)})`,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 340,
                    textAlign: 'center',
                    padding: '0 30px',
                    opacity: pr,
                    transform: `translateY(${(1 - pr) * 38}px)`,
                  }}
                >
                  <GoldText theme={T} size={64} font="num" weight={700} lineHeight={88}>
                    {m.y}
                  </GoldText>
                  <Txt size={34} color="#fff" weight={500} letterSpacing={5} lineHeight={48} style={{ marginTop: 26 }}>
                    {m.tt}
                  </Txt>
                  <Txt
                    size={26}
                    color={rgba(T.soft, 0.85)}
                    weight={300}
                    letterSpacing={3}
                    lineHeight={44}
                    style={{ marginTop: 16 }}
                  >
                    {m.ds}
                  </Txt>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Chapter>

      {/* 04 人物 + 格言 */}
      <PersonChapter theme={T} t={t} p={p} in={[5.38, 5.7]} out={[6.54, 6.84]} photoTop={200} nameTop={580} roleTop={780} hidePill>
        <Txt
          size={33}
          color={T.cream2}
          weight={300}
          font="serif"
          letterSpacing={4}
          lineHeight={46}
          style={{
            position: 'absolute',
            top: 868,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 5.82, 6.1)),
          }}
        >
          {p.quote || '时间是最好的信任状'}
        </Txt>
      </PersonChapter>

      {/* 05 定版（专属文案） */}
      <Chapter t={t} in={[6.68, 7.02]}>
        <Sfx name="sfx_pop" at={3.10} vol={0.28} />
        <EndCard theme={T} t={t} start={6.76} p={p} titleText="感恩有你" subText="下一个十年 · 继续同行" />
      </Chapter>
    </Stage>
  );
};
