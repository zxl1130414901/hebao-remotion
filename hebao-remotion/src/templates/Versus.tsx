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
 * 67 · 红蓝对战版
 * 叙事：左右两个阵营并列 → 中间 VS 撞入 → 两条对比条向外生长 → 胜负揭晓 → 定版
 * 与旧模板差异：双主角、有输赢结构，适合团队 PK / 区域对抗。
 */
export const Versus: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const A = p.versusA ?? { name: '杭州三区', value: '486.2 万', pct: 62, sub: '达成 186%' };
  const B = p.versusB ?? { name: '宁波一支', value: '298.4 万', pct: 46, sub: '达成 142%' };
  const aWin = A.pct >= B.pct;

  const barA = outExpo(seg(t, 2.3, 3.0));
  const barB = outExpo(seg(t, 2.44, 3.14));
  const vsP = outBack(seg(t, 1.02, 1.34), 2.6);

  return (
    <Stage theme={T} brand={p.brand} bottomtag="HEAD　TO　HEAD">
      {/* 01 对阵 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[2.34, 2.62]}>
        <Sfx name="sfx_gong" at={1.24} vol={0.5} />
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={11}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 420,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          OCTOBER　·　TEAM　BATTLE
        </Txt>
        <Txt
          size={54}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={12}
          lineHeight={74}
          style={{
            position: 'absolute',
            left: 0,
            top: 468,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.14, 0.44)),
          }}
        >
          {p.slogan || '巅峰对决'}
        </Txt>

        {/* 左右分栏 */}
        {[
          { c: A, left: 0, win: aWin, tint: gold },
          { c: B, left: 540, win: !aWin, tint: hexRgb(T.mist) },
        ].map((side, i) => {
          const s0 = 0.3 + i * 0.16;
          const e = outExpo(seg(t, s0, s0 + 0.4));
          return (
            <div
              key={side.c.name}
              style={{
                position: 'absolute',
                left: side.left,
                top: 640,
                width: 540,
                textAlign: 'center',
                opacity: e,
                transform: `translateY(${(1 - e) * 34}px)`,
              }}
            >
              <Txt
                size={30}
                color={rgba(side.tint, 0.86)}
                weight={600}
                font="serif"
                letterSpacing={6}
                lineHeight={42}
              >
                {i === 0 ? 'A 队' : 'B 队'}
              </Txt>
              <Txt
                size={40}
                color={rgba(cream, 0.92)}
                weight={600}
                font="serif"
                letterSpacing={3}
                lineHeight={56}
                style={{ marginTop: 10 }}
              >
                {side.c.name}
              </Txt>
              <div style={{ marginTop: 26 }}>
                <GoldText theme={T} size={94} weight={700} font="num" lineHeight={112}>
                  {side.c.value}
                </GoldText>
              </div>
              <Txt
                size={25}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={3}
                lineHeight={36}
                style={{ marginTop: 8 }}
              >
                {side.c.sub}
              </Txt>
              {side.win && (
                <div
                  style={{
                    marginTop: 18,
                    display: 'inline-block',
                    padding: '8px 26px',
                    borderRadius: 30,
                    border: `1.5px solid ${rgba(gold, 0.75)}`,
                    background: rgba(gold, 0.14),
                    opacity: outExpo(seg(t, 1.36, 1.7)),
                    transform: `scale(${lerp(0.7, 1, outBack(seg(t, 1.36, 1.72), 2))})`,
                  }}
                >
                  <Txt size={26} color={T.bright} weight={700} letterSpacing={4} lineHeight={36}>
                    领　先
                  </Txt>
                </div>
              )}
            </div>
          );
        })}

        {/* VS */}
        <div
          style={{
            position: 'absolute',
            left: 452,
            top: 712,
            width: 176,
            height: 176,
            borderRadius: '50%',
            background: `radial-gradient(circle at 36% 28%, ${rgba(gold, 0.95)}, ${rgba(hexRgb(T.goldD), 0.94)})`,
            border: `3px solid ${rgba(T.goldA, 0.8)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${vsP}) rotate(${(1 - vsP) * -90}deg)`,
            opacity: Math.min(1, vsP * 1.6),
            boxShadow: `0 18px 50px rgba(0,0,0,0.4), inset 0 3px 0 rgba(255,255,255,0.45)`,
          }}
        >
          <Txt
            size={68}
            color={rgba(T.archbg, 0.94)}
            weight={700}
            font="num"
            letterSpacing={-2}
            lineHeight={84}
          >
            VS
          </Txt>
        </div>
      </Chapter>

      {/* 02 战力对比条 */}
      <Chapter t={t} in={[2.46, 2.76]} out={[4.68, 4.96]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 330,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.54, 2.84)),
          }}
        >
          战 力 对 比
        </Txt>

        {[
          { c: A, tint: gold, top: 480, p: barA, label: 'A 队' },
          { c: B, tint: hexRgb(T.mist), top: 700, p: barB, label: 'B 队' },
        ].map((row) => (
          <div key={row.label} style={{ position: 'absolute', left: 100, top: row.top, width: 880 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 16 }}>
              <Txt size={28} color={rgba(row.tint, 0.8)} weight={600} letterSpacing={4} lineHeight={38}>
                {row.label}　{row.c.name}
              </Txt>
              <Txt
                size={34}
                color={T.bright}
                weight={700}
                font="num"
                lineHeight={44}
                style={{ marginLeft: 'auto' }}
              >
                {row.c.pct}%
              </Txt>
            </div>
            <div
              style={{
                width: 880,
                height: 44,
                borderRadius: 22,
                background: rgba(T.mask, 0.6),
                border: `1px solid ${rgba(T.line, 0.16)}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${row.c.pct * row.p}%`,
                  height: '100%',
                  borderRadius: 22,
                  background: `linear-gradient(90deg, ${rgba(hexRgb(T.goldD), 0.85)}, ${rgba(row.tint, 1)}, ${T.goldA})`,
                  boxShadow: `0 0 22px ${rgba(row.tint, 0.55)}`,
                }}
              />
            </div>
          </div>
        ))}

        {/* 差距结论 */}
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 900,
            width: 880,
            padding: '30px 40px',
            borderRadius: 16,
            background: rgba(T.mask, 0.5),
            border: `1px solid ${rgba(T.line, 0.3)}`,
            opacity: outExpo(seg(t, 3.3, 3.64)),
            transform: `translateY(${(1 - outExpo(seg(t, 3.3, 3.66))) * 24}px)`,
          }}
        >
          <Txt size={24} color={rgba(T.mist, 0.85)} letterSpacing={7} lineHeight={34}>
            本 轮 结 果
          </Txt>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 12, gap: 18 }}>
            <Txt size={48} color={T.bright} weight={700} font="serif" letterSpacing={4} lineHeight={64}>
              {aWin ? A.name : B.name}
            </Txt>
            <Txt size={32} color={rgba(cream, 0.8)} weight={400} letterSpacing={3} lineHeight={44}>
              领先
            </Txt>
            <GoldText theme={T} size={58} weight={700} font="num" lineHeight={72}>
              {Math.abs(
                Number(String(A.value).replace(/[^\d.]/g, '') || 0) -
                  Number(String(B.value).replace(/[^\d.]/g, '') || 0)
              ).toFixed(1)}{' '}
              万
            </GoldText>
          </div>
        </div>

        <Txt
          size={30}
          color={rgba(cream, 0.85)}
          font="serif"
          letterSpacing={6}
          lineHeight={44}
          style={{
            position: 'absolute',
            left: 0,
            top: 1108,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.7, 4.04)),
          }}
        >
          {p.subValue || '下个月，换我们追'}
        </Txt>
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[4.9, 5.26]}>
        <EndCard theme={T} t={t} start={4.96} p={p} />
      </Chapter>
    </Stage>
  );
};
