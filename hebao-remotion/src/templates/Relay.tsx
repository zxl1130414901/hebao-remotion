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
 * 66 · 薪火接力版
 * 叙事：一条接力轨道 → 每位战士依次点亮并留下一句 → 全队合计 → 定版
 * 与旧模板差异：主角是「一群人」，不是一个人；信息是纵向接龙而非居中大字。
 */
export const Relay: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const team = (p.roster ?? []).slice(0, 4);
  const words = ['开局第一枪，我打了头阵。', '接下这一棒，绝不掉链子。', '月中最难的时候，我扛住了。', '最后一程，交给我收尾。'];
  const trackP = outExpo(seg(t, 0.24, 1.86));
  const totalP = outExpo(seg(t, 2.62, 3.0));

  return (
    <Stage theme={T} brand={p.brand} bottomtag="RELAY　·　ONE　TEAM">
      {/* 01 接力轨道 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[3.02, 3.3]}>
        <Txt
          size={58}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={13}
          lineHeight={80}
          style={{
            position: 'absolute',
            left: 0,
            top: 240,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          {p.slogan || '薪火相传'}
        </Txt>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={9}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 330,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.18, 0.48)),
          }}
        >
          一 棒 接 一 棒　·　没 有 空 档
        </Txt>

        {/* 轨道 */}
        <div
          style={{
            position: 'absolute',
            left: 216,
            top: 436,
            width: 2,
            height: 984 * trackP,
            background: `linear-gradient(180deg, ${rgba(gold, 0.8)}, ${rgba(gold, 0.06)})`,
          }}
        />

        {team.map((m, i) => {
          const s0 = 0.42 + i * 0.44;
          const e = outExpo(seg(t, s0, s0 + 0.36));
          const lit = seg(t, s0, s0 + 0.3);
          const top = 420 + i * 300;
          return (
            <div key={m.name + i} style={{ position: 'absolute', left: 0, top, width: 1080 }}>
              {/* 节点 */}
              <div
                style={{
                  position: 'absolute',
                  left: 168,
                  top: 6,
                  width: 98,
                  height: 98,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 34% 28%, ${rgba(gold, 0.95)}, ${rgba(hexRgb(T.goldD), 0.9)})`,
                  border: `2px solid ${rgba(T.goldA, 0.75)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 ${34 * lit}px ${rgba(gold, 0.6 * lit)}, inset 0 2px 0 rgba(255,255,255,0.4)`,
                  transform: `scale(${lerp(0.5, 1, outBack(seg(t, s0, s0 + 0.36), 2.1))})`,
                  opacity: e,
                }}
              >
                <Txt
                  size={40}
                  color={rgba(T.archbg, 0.92)}
                  weight={700}
                  font="serif"
                  lineHeight={50}
                >
                  {m.name.slice(0, 1)}
                </Txt>
              </div>

              {/* 名牌 */}
              <div
                style={{
                  position: 'absolute',
                  left: 296,
                  top: 0,
                  width: 620,
                  opacity: e,
                  transform: `translateX(${(1 - e) * 34}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <Txt size={42} color={T.cream} weight={600} font="serif" letterSpacing={3} lineHeight={56}>
                    {m.name}
                  </Txt>
                  <Txt size={22} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={3} lineHeight={32}>
                    {m.org}
                  </Txt>
                  <GoldText
                    theme={T}
                    size={40}
                    weight={700}
                    font="num"
                    lineHeight={52}
                    style={{ marginLeft: 'auto' }}
                  >
                    {m.value}
                  </GoldText>
                </div>
                <Txt
                  size={26}
                  color={rgba(T.mist, 0.85)}
                  weight={300}
                  letterSpacing={2}
                  lineHeight={38}
                  style={{ marginTop: 12 }}
                >
                  「{words[i]}」
                </Txt>
              </div>
            </div>
          );
        })}
      </Chapter>

      {/* 02 全队合计 */}
      <Chapter t={t} in={[3.14, 3.44]} out={[5.28, 5.56]}>
        <Sfx name="sfx_gong" at={3.3} vol={0.42} />
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={13}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 470,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.22, 3.52)),
          }}
        >
          全 队 合 计
        </Txt>
        <div style={{ position: 'absolute', left: 0, top: 516, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={210}
            weight={700}
            font="num"
            lineHeight={244}
            style={{
              opacity: totalP,
              transform: `scale(${lerp(1.14, 1, outBack(seg(t, 3.14, 3.56), 1.9))})`,
              filter: `drop-shadow(0 12px 38px ${rgba(gold, 0.3)})`,
            }}
          >
            {p.hero || '1,286'}
          </GoldText>
          <Txt
            size={58}
            color={rgba(cream, 0.9)}
            weight={500}
            font="serif"
            letterSpacing={8}
            lineHeight={76}
            style={{ marginTop: -18, opacity: outExpo(seg(t, 3.3, 3.6)) }}
          >
            万元
          </Txt>
        </div>
        <Txt
          size={33}
          color={rgba(cream, 0.82)}
          font="serif"
          letterSpacing={6}
          lineHeight={46}
          style={{
            position: 'absolute',
            left: 0,
            top: 872,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.46, 3.78)),
          }}
        >
          {p.subValue || '四个人，四种打法，一个结果'}
        </Txt>

        {[
          { k: '团队达成率', v: p.stats?.[1]?.v || '186%' },
          { k: '人均件数', v: p.stats?.[0]?.v || '31 件' },
          { k: '连续达标月数', v: p.stats?.[2]?.v || '9 个月' },
        ].map((f, i) => {
          const s0 = 3.62 + i * 0.2;
          const e = outExpo(seg(t, s0, s0 + 0.36));
          return (
            <div
              key={f.k}
              style={{
                position: 'absolute',
                left: 180,
                top: 1036 + i * 134,
                width: 720,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: `1px solid ${rgba(T.line, 0.18)}`,
                paddingBottom: 18,
                opacity: e,
                transform: `translateY(${(1 - e) * 22}px)`,
              }}
            >
              <Txt size={29} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={6} lineHeight={40}>
                {f.k}
              </Txt>
              <Txt size={40} color={T.bright} weight={700} font="num" lineHeight={52}>
                {f.v}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.5, 5.86]}>
        <EndCard theme={T} t={t} start={5.56} p={p} />
      </Chapter>
    </Stage>
  );
};
