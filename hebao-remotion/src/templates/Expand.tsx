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

const CX = 540;
const CY = 706;
const R = 300;

/**
 * 68 · 增员裂变版
 * 叙事：中心「我」→ 六条金线向外生长 → 六个新人节点弹出 → 团队规模 → 定版
 * 与旧模板差异：讲组织生长（1→N），不是业绩数字；版面是放射状而非居中纵排。
 */
export const Expand: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const mates = (p.roster ?? []).slice(1, 7);
  const slots = Array.from({ length: 6 }, (_, i) => mates[i] ?? null);

  return (
    <Stage theme={T} brand={p.brand} bottomtag="TEAM　EXPANSION">
      {/* 01 裂变图 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[3.04, 3.32]}>
        <Txt
          size={56}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={13}
          lineHeight={78}
          style={{
            position: 'absolute',
            left: 0,
            top: 172,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          {p.slogan || '组织裂变'}
        </Txt>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={9}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 254,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.18, 0.48)),
          }}
        >
          一 个 人　·　带 出 一 支 队 伍
        </Txt>

        {/* 连线 */}
        <svg
          width={1080}
          height={1920}
          viewBox="0 0 1080 1920"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={rgba(gold, 0.85)} />
              <stop offset="100%" stopColor={rgba(gold, 0.2)} />
            </linearGradient>
          </defs>
          {slots.map((m, i) => {
            const ang = (-90 + i * 60) * (Math.PI / 180);
            const x = CX + R * Math.cos(ang);
            const y = CY + R * Math.sin(ang);
            const s0 = 0.42 + i * 0.2;
            const g = outExpo(seg(t, s0, s0 + 0.5));
            return (
              <line
                key={`l${i}`}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke="url(#lineG)"
                strokeWidth={m ? 2.6 : 1.6}
                strokeDasharray={1}
                pathLength={1}
                strokeDashoffset={1 - g}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* 中心：我 */}
        <div
          style={{
            position: 'absolute',
            left: CX - 96,
            top: CY - 96,
            width: 192,
            height: 192,
            borderRadius: '50%',
            background: `radial-gradient(circle at 34% 26%, ${rgba(gold, 1)}, ${rgba(hexRgb(T.goldD), 0.96)})`,
            border: `3px solid ${rgba(T.goldA, 0.85)}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 20px 56px rgba(0,0,0,0.42), 0 0 46px ${rgba(gold, 0.5)}, inset 0 3px 0 rgba(255,255,255,0.45)`,
            transform: `scale(${lerp(0.4, 1, outBack(seg(t, 0.16, 0.56), 2.2))})`,
            opacity: outExpo(seg(t, 0.16, 0.46)),
          }}
        >
          <Txt size={52} color={rgba(T.archbg, 0.95)} weight={700} font="serif" lineHeight={64}>
            {p.name.slice(0, 1)}
          </Txt>
          <Txt size={20} color={rgba(T.archbg, 0.85)} letterSpacing={2} lineHeight={26}>
            {p.name}
          </Txt>
        </div>

        {/* 外围节点 */}
        {slots.map((m, i) => {
          const ang = (-90 + i * 60) * (Math.PI / 180);
          const x = CX + R * Math.cos(ang);
          const y = CY + R * Math.sin(ang);
          const s0 = 0.56 + i * 0.2;
          const e = outExpo(seg(t, s0, s0 + 0.34));
          return (
            <div
              key={`n${i}`}
              style={{
                position: 'absolute',
                left: x - 62,
                top: y - 62,
                width: 124,
                height: 124,
                borderRadius: '50%',
                background: m
                  ? `radial-gradient(circle at 36% 30%, ${rgba(T.pale, 0.98)}, ${rgba(T.warm, 0.9)})`
                  : rgba(T.mask, 0.7),
                border: `2px solid ${m ? rgba(gold, 0.7) : rgba(T.line, 0.24)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: e,
                transform: `scale(${lerp(0.3, 1, outBack(seg(t, s0, s0 + 0.38), 2.3))})`,
                boxShadow: m ? `0 12px 30px rgba(0,0,0,0.3)` : 'none',
              }}
            >
              <Txt
                size={36}
                color={m ? rgba(T.archbg, 0.9) : rgba(T.mist, 0.4)}
                weight={700}
                font="serif"
                lineHeight={46}
              >
                {m ? m.name.slice(0, 1) : '＋'}
              </Txt>
              <Txt
                size={20}
                color={m ? rgba(T.archbg, 0.6) : rgba(T.mist, 0.34)}
                letterSpacing={1}
                lineHeight={24}
              >
                {m ? m.name : '待增员'}
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
            left: 0,
            top: 1110,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.2, 2.54)),
          }}
        >
          每一条线，都是一次「跟我干」的信任
        </Txt>
      </Chapter>

      {/* 02 团队规模 */}
      <Chapter t={t} in={[3.16, 3.46]} out={[5.28, 5.56]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={13}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 356,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.24, 3.54)),
          }}
        >
          团 队 规 模
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 402,
            width: 1080,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <GoldText
            theme={T}
            size={126}
            weight={700}
            font="num"
            lineHeight={156}
            style={{ opacity: outExpo(seg(t, 3.16, 3.46)) }}
          >
            1
          </GoldText>
          <Txt size={72} color={rgba(gold, 0.8)} weight={300} lineHeight={92} style={{ margin: '0 10px' }}>
            →
          </Txt>
          <GoldText
            theme={T}
            size={228}
            weight={700}
            font="num"
            lineHeight={264}
            style={{
              opacity: outExpo(seg(t, 3.24, 3.56)),
              transform: `scale(${lerp(1.2, 1, outBack(seg(t, 3.24, 3.66), 1.9))})`,
            }}
          >
            {p.hero || '7'}
          </GoldText>
        </div>
        <Txt
          size={32}
          color={rgba(cream, 0.84)}
          font="serif"
          letterSpacing={7}
          lineHeight={46}
          style={{
            position: 'absolute',
            left: 0,
            top: 740,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.4, 3.72)),
          }}
        >
          {p.subValue || '三个月，从一个人到一支队'}
        </Txt>

        {[
          { k: '本期增员', v: `${mates.filter(Boolean).length} 人` },
          { k: '新人首单率', v: '100%' },
          { k: '团队平均年龄', v: '32 岁' },
        ].map((f, i) => {
          const s0 = 3.56 + i * 0.2;
          const e = outExpo(seg(t, s0, s0 + 0.36));
          return (
            <div
              key={f.k}
              style={{
                position: 'absolute',
                left: 170,
                top: 900 + i * 132,
                width: 740,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: `1px solid ${rgba(T.line, 0.18)}`,
                paddingBottom: 20,
                opacity: e,
                transform: `translateY(${(1 - e) * 22}px)`,
              }}
            >
              <Txt size={30} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={6} lineHeight={42}>
                {f.k}
              </Txt>
              <Txt size={42} color={T.bright} weight={700} font="num" lineHeight={54}>
                {f.v}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.5, 5.86]}>
        <Sfx name="sfx_gong" at={0.44} vol={0.45} />
        <EndCard theme={T} t={t} start={5.56} p={p} />
      </Chapter>
    </Stage>
  );
};
