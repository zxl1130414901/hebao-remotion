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

const OLD = [
  { name: '张女士', x: 260 },
  { name: '王先生', x: 540 },
  { name: '刘女士', x: 820 },
];
const NEW = [
  { name: '周女士', x: 180, by: 260 },
  { name: '吴先生', x: 324, by: 260 },
  { name: '郑女士', x: 468, by: 540 },
  { name: '孙先生', x: 612, by: 540 },
  { name: '何女士', x: 756, by: 820 },
  { name: '林先生', x: 900, by: 820 },
];
const ME = { x: 540, y: 424 };
const OLD_Y = 726;
const NEW_Y = 1012;

/**
 * 75 · 转介绍图谱版
 * 叙事：我 → 三位老客户 → 六位新客户，两层分叉生长 → 转介绍占比 → 定版
 * 与旧模板差异：讲「客户带客户」的传播链，图形是三层分叉树，不是环形或榜单。
 */
export const Referral: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const THEME = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(THEME.cream);
  const gold = hexRgb(THEME.goldB);

  return (
    <Stage theme={THEME} brand={p.brand} bottomtag="REFERRAL　NETWORK">
      {/* 01 传播链 */}
      <Chapter t={t} in={[0.04, 0.32]} out={[3.14, 3.42]}>
        <Txt
          size={24}
          color={rgba(THEME.mist, 0.85)}
          letterSpacing={10}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 172,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.06, 0.36)),
          }}
        >
          WORD　OF　MOUTH　CHAIN
        </Txt>
        <Txt
          size={50}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={12}
          lineHeight={70}
          style={{
            position: 'absolute',
            left: 0,
            top: 214,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.12, 0.42)),
          }}
        >
          {p.slogan || '客户带客户'}
        </Txt>

        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
          {/* 一层：我 → 老客户 */}
          {OLD.map((o, i) => {
            const s0 = 0.3 + i * 0.12;
            const g = outExpo(seg(t, s0, s0 + 0.42));
            return (
              <line
                key={`o${i}`}
                x1={ME.x}
                y1={ME.y + 78}
                x2={o.x}
                y2={OLD_Y - 58}
                stroke={rgba(gold, 0.55)}
                strokeWidth={2.2}
                strokeDasharray={1}
                pathLength={1}
                strokeDashoffset={1 - g}
              />
            );
          })}
          {/* 二层：老客户 → 新客户 */}
          {NEW.map((n, i) => {
            const s0 = 1.3 + i * 0.1;
            const g = outExpo(seg(t, s0, s0 + 0.4));
            return (
              <line
                key={`n${i}`}
                x1={n.by}
                y1={OLD_Y + 58}
                x2={n.x}
                y2={NEW_Y - 46}
                stroke={rgba(gold, 0.34)}
                strokeWidth={1.6}
                strokeDasharray={1}
                pathLength={1}
                strokeDashoffset={1 - g}
              />
            );
          })}
        </svg>

        {/* 我 */}
        <div
          style={{
            position: 'absolute',
            left: ME.x - 78,
            top: ME.y - 78,
            width: 156,
            height: 156,
            borderRadius: '50%',
            background: `radial-gradient(circle at 34% 28%, ${rgba(gold, 1)}, ${rgba(hexRgb(THEME.goldD), 0.95)})`,
            border: `3px solid ${rgba(THEME.goldA, 0.8)}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 16px 44px rgba(0,0,0,0.4), 0 0 40px ${rgba(gold, 0.42)}`,
            transform: `scale(${lerp(0.5, 1, outBack(seg(t, 0.14, 0.5), 2.1))})`,
            opacity: outExpo(seg(t, 0.14, 0.44)),
          }}
        >
          <Txt size={44} color={rgba(THEME.archbg, 0.94)} weight={700} font="serif" lineHeight={56}>
            {p.name.slice(0, 1)}
          </Txt>
          <Txt size={20} color={rgba(THEME.archbg, 0.85)} letterSpacing={1} lineHeight={24}>
            {p.name}
          </Txt>
        </div>

        {/* 老客户 */}
        {OLD.map((o, i) => {
          const s0 = 0.46 + i * 0.12;
          const e = outExpo(seg(t, s0, s0 + 0.32));
          return (
            <div
              key={o.name}
              style={{
                position: 'absolute',
                left: o.x - 58,
                top: OLD_Y - 58,
                width: 116,
                height: 116,
                borderRadius: '50%',
                background: `radial-gradient(circle at 36% 30%, ${rgba(THEME.pale, 0.96)}, ${rgba(THEME.warm, 0.9)})`,
                border: `2px solid ${rgba(gold, 0.55)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: e,
                transform: `scale(${lerp(0.4, 1, outBack(seg(t, s0, s0 + 0.36), 2.2))})`,
                boxShadow: `0 10px 26px rgba(0,0,0,0.28)`,
              }}
            >
              <Txt size={30} color={rgba(THEME.archbg, 0.9)} weight={700} font="serif" lineHeight={40}>
                {o.name.slice(0, 1)}
              </Txt>
              <Txt size={18} color={rgba(THEME.archbg, 0.85)} letterSpacing={1} lineHeight={22}>
                {o.name}
              </Txt>
            </div>
          );
        })}

        {/* 新客户 */}
        {NEW.map((n, i) => {
          const s0 = 1.5 + i * 0.1;
          const e = outExpo(seg(t, s0, s0 + 0.3));
          return (
            <div
              key={n.name}
              style={{
                position: 'absolute',
                left: n.x - 46,
                top: NEW_Y - 46,
                width: 92,
                height: 92,
                borderRadius: '50%',
                background: rgba(THEME.mask, 0.82),
                border: `1.5px solid ${rgba(gold, 0.42)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: e,
                transform: `scale(${lerp(0.3, 1, outBack(seg(t, s0, s0 + 0.34), 2.3))})`,
              }}
            >
              <Txt size={24} color={rgba(cream, 0.86)} weight={600} font="serif" lineHeight={32}>
                {n.name.slice(0, 1)}
              </Txt>
              <Txt size={18} color={rgba(THEME.mist, 0.85)} letterSpacing={1} lineHeight={20}>
                {n.name}
              </Txt>
            </div>
          );
        })}

        <Txt
          size={23}
          color={rgba(THEME.mist, 0.85)}
          weight={300}
          letterSpacing={3}
          lineHeight={33}
          style={{
            position: 'absolute',
            left: 0,
            top: 1120,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.3, 2.64)),
          }}
        >
          一个人被信任，会被介绍给更多人
        </Txt>
      </Chapter>

      {/* 02 转介绍占比 */}
      <Chapter t={t} in={[3.24, 3.54]} out={[5.3, 5.58]}>
        <Txt
          size={26}
          color={rgba(THEME.mist, 0.85)}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 356,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.32, 3.62)),
          }}
        >
          新 客 来 源 占 比
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 400,
            width: 1080,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <GoldText
            theme={THEME}
            size={226}
            weight={700}
            font="num"
            lineHeight={260}
            style={{
              opacity: outExpo(seg(t, 3.24, 3.56)),
              transform: `scale(${lerp(1.16, 1, outBack(seg(t, 3.24, 3.66), 1.9))})`,
            }}
          >
            {p.hero || '42'}
          </GoldText>
          <Txt size={82} color={rgba(cream, 0.9)} weight={500} font="num" lineHeight={100}>
            %
          </Txt>
        </div>
        <Txt
          size={31}
          color={rgba(cream, 0.82)}
          font="serif"
          letterSpacing={6}
          lineHeight={44}
          style={{
            position: 'absolute',
            left: 0,
            top: 736,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.5, 3.82)),
          }}
        >
          {p.subValue || '每 10 个新客户，4 个是老客户带来的'}
        </Txt>

        {[
          { k: '转介绍客户', v: '9 位' },
          { k: '平均每人带来', v: '2.4 位' },
          { k: '转介绍成交率', v: '68%' },
        ].map((f, i) => {
          const s0 = 3.66 + i * 0.2;
          const e = outExpo(seg(t, s0, s0 + 0.36));
          return (
            <div
              key={f.k}
              style={{
                position: 'absolute',
                left: 180,
                top: 860 + i * 148,
                width: 720,
                opacity: e,
                transform: `translateY(${(1 - e) * 22}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Txt size={30} color={rgba(THEME.mist, 0.85)} weight={300} letterSpacing={6} lineHeight={42}>
                  {f.k}
                </Txt>
                <Txt size={44} color={THEME.bright} weight={700} font="num" lineHeight={56}>
                  {f.v}
                </Txt>
              </div>
              <div
                style={{
                  marginTop: 16,
                  height: 1,
                  background: `linear-gradient(90deg, ${rgba(THEME.line, 0.28)}, ${rgba(THEME.line, 0.02)})`,
                }}
              />
            </div>
          );
        })}
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.52, 5.88]}>
        <Sfx name="sfx_gong" at={0.44} vol={0.45} />
        <EndCard theme={THEME} t={t} start={5.58} p={p} />
      </Chapter>
    </Stage>
  );
};
