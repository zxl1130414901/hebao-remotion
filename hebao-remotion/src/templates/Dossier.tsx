import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 24 · 荣誉档案版
 * 叙事：档案袋升起（贴标签 + 盖章）→ 档案条目逐行滑入 → 人物 → 定版
 */

export const Dossier: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  /* 条目：stats 前三项 + 保费压轴 */
  const rows = [
    { no: '01', k: p.stats[0]?.k ?? '承保件数', v: p.stats[0]?.v ?? '42' },
    { no: '02', k: p.stats[1]?.k ?? '目标达成率', v: p.stats[1]?.v ?? '218%' },
    { no: '03', k: p.stats[2]?.k ?? '全省排名', v: p.stats[2]?.v ?? 'No.3' },
    { no: '04', k: p.dlabel, v: `${p.premium.toFixed(hasDec ? 1 : 0)} 万` },
  ];

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 档案袋 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        <Txt
          size={28}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={14}
          lineHeight={39}
          style={{
            position: 'absolute',
            top: 280,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.14, 0.44)),
          }}
        >
          HONOR DOSSIER · 已归档
        </Txt>
        {(() => {
          const bp = outExpo(seg(t, 0.2, 0.94));
          const sp = outBack(seg(t, 1.14, 1.56), 1.8);
          return (
            <div
              style={{
                position: 'absolute',
                left: 170,
                top: 420,
                width: 740,
                height: 1000,
                background: `linear-gradient(170deg,${rgba(T.cream, 0.13)},${rgba(
                  T.warm,
                  0.07
                )} 55%,${rgba(T.line, 0.05)})`,
                border: `1px solid ${rgba(T.line, 0.5)}`,
                boxShadow: '0 30px 70px rgba(0,0,0,.42)',
                opacity: clamp01(seg(t, 0.2, 0.5)),
                transform: `translateY(${(1 - bp) * 140}px) rotate(${lerp(
                  2.4,
                  0,
                  outExpo(seg(t, 0.2, 1.0))
                )}deg)`,
              }}
            >
              {/* 封口盖 */}
              <div
                style={{
                  position: 'absolute',
                  left: -1,
                  top: -1,
                  width: 742,
                  height: 330,
                  background: rgba(T.line, 0.1),
                  borderBottom: `1px solid ${rgba(T.line, 0.35)}`,
                  clipPath: 'polygon(0 0,100% 0,100% 62%,50% 100%,0 62%)',
                }}
              />
              <Txt
                size={22}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={4}
                lineHeight={31}
                style={{ position: 'absolute', left: 56, top: 406 }}
              >
                档案编号 NO. 2026-1028
              </Txt>
              {/* 米色标签 */}
              <div
                style={{
                  position: 'absolute',
                  left: 210,
                  top: 180,
                  width: 320,
                  height: 210,
                  transform: `rotate(-2deg) translateY(${
                    (1 - outExpo(seg(t, 0.62, 0.96))) * 24
                  }px)`,
                  background: rgba(T.cream, 0.85),
                  boxShadow: '0 8px 24px rgba(0,0,0,.3)',
                  opacity: outExpo(seg(t, 0.62, 0.92)),
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 7,
                    border: '1px solid rgba(90,50,20,.4)',
                  }}
                />
                {[
                  { top: 26, size: 16, ls: 4, w: 600, txt: 'HONOR DOSSIER' },
                  { top: 58, size: 52, ls: 10, w: 700, txt: '荣誉档案' },
                  { top: 132, size: 19, ls: 3, w: 500, txt: 'NO. 2026-1028' },
                  { top: 166, size: 15, ls: 2, w: 400, txt: p.brand },
                ].map((b, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: b.top,
                      width: 320,
                      textAlign: 'center',
                      fontSize: b.size,
                      letterSpacing: b.ls,
                      fontWeight: b.w,
                      lineHeight: `${Math.round(b.size * 1.4)}px`,
                      color: 'rgba(70,42,18,.92)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {b.txt}
                  </div>
                ))}
              </div>
              {/* 浅金归档章 */}
              <div
                style={{
                  position: 'absolute',
                  left: 470,
                  top: 790,
                  width: 170,
                  height: 170,
                  borderRadius: '50%',
                  border: `3px solid ${rgba(T.pale, 0.5)}`,
                  opacity: clamp01(seg(t, 1.14, 1.32)),
                  transform: `rotate(-8deg) scale(${lerp(1.7, 1, sp)})`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 8,
                    borderRadius: '50%',
                    border: `1.5px solid ${rgba(T.pale, 0.4)}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 34,
                    width: 170,
                    textAlign: 'center',
                    fontSize: 36,
                    color: rgba(T.pale, 0.55),
                  }}
                >
                  ★
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: 92,
                    width: 170,
                    textAlign: 'center',
                    fontSize: 24,
                    letterSpacing: 6,
                    color: rgba(T.pale, 0.55),
                    fontWeight: 600,
                  }}
                >
                  已归档
                </div>
              </div>
            </div>
          );
        })()}
      </Chapter>

      {/* 02 档案条目 */}
      <Chapter t={t} in={[2.46, 2.78]} out={[3.86, 4.16]}>
        {(() => {
          const pt = outExpo(seg(t, 2.5, 2.8));
          return (
            <>
              <Txt
                size={56}
                color="#fff"
                weight={600}
                font="serif"
                letterSpacing={10}
                lineHeight={78}
                style={{
                  position: 'absolute',
                  left: 120,
                  top: 300,
                  opacity: pt,
                  transform: `translateY(${(1 - pt) * 22}px)`,
                }}
              >
                档案摘录
              </Txt>
              <Txt
                size={24}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={8}
                lineHeight={34}
                style={{
                  position: 'absolute',
                  left: 122,
                  top: 382,
                  opacity: outExpo(seg(t, 2.62, 2.9)),
                }}
              >
                DOSSIER RECORD
              </Txt>
            </>
          );
        })()}
        {rows.map((r, i) => {
          const st = 2.74 + i * 0.24;
          const pr = outExpo(seg(t, st, st + 0.34));
          const fs = r.v.length <= 4 ? 38 : r.v.length === 5 ? 33 : 28;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 120,
                top: 470 + i * 130,
                width: 840,
                height: 130,
                display: 'flex',
                alignItems: 'center',
                opacity: pr,
                transform: `translateX(${(1 - pr) * 44}px)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  height: 1,
                  background: `linear-gradient(90deg,${rgba(T.line, 0.24)},${rgba(T.line, 0.04)})`,
                }}
              />
              <GoldText theme={T} size={26} font="num" weight={700} lineHeight={36} letterSpacing={2} style={{ width: 110 }}>
                {r.no}
              </GoldText>
              <Txt size={34} color={rgba(T.cream, 0.9)} weight={400} letterSpacing={4} lineHeight={48}>
                {r.k}
              </Txt>
              <Txt
                size={fs}
                color={T.bright}
                font="num"
                weight={700}
                lineHeight={Math.round(fs * 1.3)}
                style={{ marginLeft: 'auto' }}
              >
                {r.v}
              </Txt>
            </div>
          );
        })}
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 120,
            top: 1030,
            width: 840,
            textAlign: 'right',
            opacity: outExpo(seg(t, 3.62, 3.84)),
          }}
        >
          以上记录永久保存 · 荣誉可查
        </Txt>
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.3, 4.62]} out={[5.86, 6.16]} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <Sfx name="sfx_chime" at={1.44} vol={0.3} />
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
