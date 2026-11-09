import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 63 · 成就解锁版
 * 叙事：一面成就墙逐格亮起 → 已解锁 4 / 待解锁 2 → 人物 → 定版
 * 与旧模板差异：允许「没达成」的部分在场（灰锁），比一律高光更真实。
 */
export const Achieve: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const badges = (p.badges ?? []).slice(0, 6);
  const unlocked = badges.filter((b) => b.unlocked).length;
  const total = badges.length || 6;

  return (
    <Stage theme={T} brand={p.brand} bottomtag="ACHIEVEMENT　WALL">
      {/* 01 成就墙 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[2.38, 2.6]}>
        <Txt
          size={60}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={14}
          lineHeight={82}
          style={{
            position: 'absolute',
            left: 0,
            top: 320,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.1, 0.42)),
          }}
        >
          {p.slogan || '成就墙'}
        </Txt>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={10}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 408,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.22, 0.52)),
          }}
        >
          UNLOCKED　{String(unlocked).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </Txt>

        {badges.map((b, i) => {
          const row = Math.floor(i / 2);
          const col = i % 2;
          const s0 = 0.36 + i * 0.16;
          const e = outExpo(seg(t, s0, s0 + 0.3));
          const on = b.unlocked;
          return (
            <div
              key={b.name}
              style={{
                position: 'absolute',
                left: 104 + col * 452,
                top: 468 + row * 222,
                width: 420,
                height: 200,
                borderRadius: 18,
                background: on
                  ? `linear-gradient(150deg, ${rgba(gold, 0.16)} 0%, ${rgba(T.mask, 0.5)} 100%)`
                  : rgba(T.mask, 0.42),
                border: `1px solid ${on ? rgba(T.line, 0.5) : rgba(T.line, 0.14)}`,
                boxShadow: on ? `0 12px 34px rgba(0,0,0,0.32), inset 0 1px 0 ${rgba(T.goldA, 0.24)}` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '0 24px',
                opacity: e * (on ? 1 : 0.82),
                transform: `translateY(${(1 - e) * 30}px) scale(${lerp(0.94, 1, outBack(seg(t, s0, s0 + 0.34), 1.8))})`,
              }}
            >
              {/* 徽章 */}
              <svg width={86} height={96} viewBox="0 0 86 96" style={{ flex: 'none' }}>
                <defs>
                  <linearGradient id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.goldA} />
                    <stop offset="50%" stopColor={T.goldC} />
                    <stop offset="100%" stopColor={T.goldD} />
                  </linearGradient>
                </defs>
                <path
                  d="M43 2 L79 22 L79 62 L43 82 L7 62 L7 22 Z"
                  fill={on ? `url(#bg${i})` : rgba(T.line, 0.1)}
                  stroke={on ? rgba(T.goldA, 0.9) : rgba(T.line, 0.26)}
                  strokeWidth={2}
                />
                {on ? (
                  <path
                    d="M28 42 L38 53 L59 30"
                    fill="none"
                    stroke={rgba(T.archbg, 0.86)}
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <g stroke={rgba(T.mist, 0.42)} strokeWidth={4} fill="none" strokeLinecap="round">
                    <rect x={31} y={42} width={24} height={20} rx={4} />
                    <path d="M36 42 v-6 a7 7 0 0 1 14 0 v6" />
                  </g>
                )}
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Txt
                  size={32}
                  color={on ? T.bright : rgba(T.mist, 0.5)}
                  weight={700}
                  font="serif"
                  letterSpacing={2}
                  lineHeight={44}
                >
                  {b.name}
                </Txt>
                <Txt
                  size={22}
                  color={rgba(T.mist, on ? 0.62 : 0.34)}
                  weight={300}
                  letterSpacing={1}
                  lineHeight={32}
                  style={{ marginTop: 4 }}
                >
                  {b.desc}
                </Txt>
              </div>
            </div>
          );
        })}
      </Chapter>

      {/* 02 解锁进度 */}
      <Chapter t={t} in={[2.64, 2.94]} out={[4.42, 4.7]}>
        <Sfx name="sfx_chime" at={2.86} vol={0.4} />
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={13}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 560,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.66, 2.96)),
          }}
        >
          本 年 度 解 锁
        </Txt>
        <div style={{ position: 'absolute', left: 0, top: 606, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={212}
            weight={700}
            font="num"
            lineHeight={246}
            style={{
              opacity: outExpo(seg(t, 2.6, 2.9)),
              transform: `scale(${lerp(1.16, 1, outBack(seg(t, 2.6, 3.02), 1.9))})`,
            }}
          >
            {String(unlocked).padStart(2, '0')}
          </GoldText>
          <span
            style={{
              fontSize: 84,
              fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
              color: rgba(T.mist, 0.4),
              marginLeft: 6,
              letterSpacing: 2,
            }}
          >
            / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* 进度条：从 0 长到解锁比例 */}
        <div
          style={{
            position: 'absolute',
            left: 190,
            top: 956,
            width: 700,
            height: 14,
            borderRadius: 7,
            background: rgba(T.mask, 0.62),
            overflow: 'hidden',
            border: `1px solid ${rgba(T.line, 0.2)}`,
            opacity: outExpo(seg(t, 3.0, 3.28)),
          }}
        >
          <div
            style={{
              width: `${(unlocked / total) * 100 * outExpo(seg(t, 3.06, 3.7))}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${rgba(hexRgb(T.goldD), 0.9)}, ${rgba(gold, 1)}, ${T.goldA})`,
              boxShadow: `0 0 18px ${rgba(gold, 0.6)}`,
            }}
          />
        </div>
        <Txt
          size={30}
          color={rgba(cream, 0.82)}
          font="serif"
          letterSpacing={6}
          lineHeight={44}
          style={{
            position: 'absolute',
            left: 0,
            top: 1016,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.2, 3.54)),
          }}
        >
          {p.subValue || '再解锁 2 项，就是满墙'}
        </Txt>

        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 1216,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.5, 3.84)),
          }}
        >
          每一项都来自一次真实的坚持
        </Txt>
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.56, 4.86]} out={[5.98, 6.26]} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.28, 6.62]}>
        <EndCard theme={T} t={t} start={6.34} p={p} />
      </Chapter>
    </Stage>
  );
};
