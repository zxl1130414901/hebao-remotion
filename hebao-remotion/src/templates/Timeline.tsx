import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { Txt } from '../components/GoldText';
import { SloganChapter, NumChapter } from '../components/Chapters';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 25 · 足迹时间轴版
 * 叙事：标语 → 大数字 → 竖向时间轴居中交替（末节点金色高亮）→ 人物+格言 → 定版
 */

const NODE_TOPS = [604, 764, 924, 1084]; // 页面坐标（tl top560 + 44/204/364/524）

export const Timeline: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const steps = (p.steps ?? []).slice(0, 4);

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 标语 */}
      <SloganChapter theme={T} t={t} slogan={p.slogan} eyebrow="MY　JOURNEY　OF　GLORY" in={[0.1, 0.44]} out={[2.0, 2.3]} />

      {/* 02 大数字 */}
      <NumChapter theme={T} t={t} p={p} in={[2.14, 2.46]} out={[3.54, 3.84]} numSize={276} />

      {/* 03 时间轴 */}
      <Chapter t={t} in={[3.68, 4.0]} out={[5.16, 5.46]}>
        {/* 主轴（从上向下生长） */}
        <div
          style={{
            position: 'absolute',
            left: 539,
            top: 576,
            width: 1,
            height: 580,
            background: `linear-gradient(180deg,${rgba(T.line, 0)},${rgba(T.line, 0.5)} 18%,${rgba(
              T.line,
              0.5
            )} 82%,${rgba(T.line, 0)})`,
            transform: `scaleY(${outExpo(seg(t, 3.76, 4.72))})`,
            transformOrigin: '50% 0%',
          }}
        />
        {steps.map((s, i) => {
          const [tt, ts] = s.split('｜');
          const st = 3.88 + i * 0.26;
          const pr = outExpo(seg(t, st, st + 0.32));
          const dp = outBack(seg(t, st - 0.04, st + 0.24), 2.0);
          const cp = outExpo(seg(t, st + 0.06, st + 0.3));
          const np = outExpo(seg(t, st + 0.14, st + 0.4));
          const odd = i % 2 === 0;
          const end = i === 3;
          return (
            <div key={i}>
              {/* 连接线 */}
              <div
                style={{
                  position: 'absolute',
                  top: NODE_TOPS[i],
                  left: odd ? 482 : 554,
                  width: 44,
                  height: 1,
                  background: end ? rgba(T.pale, 0.7) : rgba(T.line, 0.45),
                  transform: `scaleX(${cp})`,
                  transformOrigin: odd ? '100% 50%' : '0% 50%',
                }}
              />
              {/* 节点圆 */}
              <div
                style={{
                  position: 'absolute',
                  left: 526,
                  top: NODE_TOPS[i] - 13,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  border: `2px solid ${end ? rgba(T.pale, 0.9) : rgba(T.line, 0.75)}`,
                  background: end
                    ? `radial-gradient(circle at 40% 32%,${T.goldB},${T.goldD})`
                    : rgba(T.line, 0.14),
                  boxShadow: `0 0 ${end ? 22 : 14}px ${rgba(T.line, end ? 0.65 : 0.4)}`,
                  transform: `scale(${lerp(0.2, 1, dp)})`,
                }}
              />
              {/* 文字块 */}
              <div
                style={{
                  position: 'absolute',
                  top: NODE_TOPS[i] - 56,
                  left: odd ? undefined : 612,
                  right: odd ? 612 : undefined,
                  textAlign: odd ? 'right' : 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  opacity: pr,
                  transform: `translateX(${(1 - pr) * (odd ? -46 : 46)}px)`,
                }}
              >
                <Txt
                  size={34}
                  color={end ? T.bright : '#fff'}
                  weight={500}
                  letterSpacing={4}
                  lineHeight={48}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {tt}
                </Txt>
                <Txt
                  size={25}
                  color={end ? rgba(T.pale, 0.85) : rgba(T.soft, 0.7)}
                  weight={300}
                  letterSpacing={3}
                  lineHeight={35}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {ts}
                </Txt>
              </div>
              {/* 序号水印 */}
              <Txt
                size={46}
                color={rgba(T.line, 0.85)}
                weight={300}
                font="num"
                letterSpacing={2}
                lineHeight={58}
                style={{
                  position: 'absolute',
                  top: NODE_TOPS[i] - 26,
                  ...(odd ? { left: 604 } : { right: 604 }),
                  opacity: np,
                  transform: `translateY(${(1 - np) * 10}px)`,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 04 人物 + 格言 */}
      <PersonChapter theme={T} t={t} p={p} in={[5.46, 5.78]} out={[6.42, 6.7]} photoTop={220} nameTop={600} roleTop={800} hidePill>
        <Txt
          size={33}
          color={T.cream2}
          weight={300}
          font="serif"
          letterSpacing={4}
          lineHeight={46}
          style={{
            position: 'absolute',
            top: 888,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 5.84, 6.1)),
            transform: `translateY(${(1 - outExpo(seg(t, 5.84, 6.1))) * 20}px)`,
          }}
        >
          {p.quote || '专业赢得信赖 · 坚持成就卓越'}
        </Txt>
      </PersonChapter>

      {/* 05 定版 */}
      <Chapter t={t} in={[6.68, 7.02]}>
        <EndCard theme={T} t={t} start={6.76} p={p} />
      </Chapter>
    </Stage>
  );
};
