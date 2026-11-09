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

const PANELS = [
  { no: '01', k: '客户拜访', v: '1,284', u: '次', d: '平均每天 4.3 次' },
  { no: '02', k: '保单检视', v: '326', u: '份', d: '帮客户找出 61 处缺口' },
  { no: '03', k: '理赔协助', v: '47', u: '件', d: '最快 1 天到账' },
  { no: '04', k: '回访满意度', v: '99.2', u: '%', d: '年度零投诉' },
];

const TIME_MIX = [
  { k: '客户拜访', v: 42 },
  { k: '售后服务', v: 28 },
  { k: '学习充电', v: 18 },
  { k: '团队带教', v: 12 },
];

/**
 * 74 · 服务年报版
 * 叙事：四宫格服务数据 → 时间分配条 → 定版
 * 与旧模板差异：不出现「保费」二字，全是过程指标；版面是仪表盘而非礼仪式竖排。
 */
export const Service: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  return (
    <Stage theme={T} brand={p.brand} bottomtag="SERVICE　REPORT">
      {/* 01 四宫格 */}
      <Chapter t={t} in={[0.04, 0.32]} out={[3.16, 3.44]}>
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 330,
            width: 888,
            display: 'flex',
            alignItems: 'flex-end',
            paddingBottom: 20,
            borderBottom: `1px solid ${rgba(T.line, 0.28)}`,
            opacity: outExpo(seg(t, 0.06, 0.36)),
          }}
        >
          <div>
            <Txt size={22} color={rgba(T.mist, 0.85)} letterSpacing={8} lineHeight={30}>
              ANNUAL　SERVICE　REPORT
            </Txt>
            <Txt
              size={50}
              color="#fff"
              weight={600}
              font="serif"
              letterSpacing={8}
              lineHeight={68}
              style={{ marginTop: 4 }}
            >
              {p.slogan || '我的服务年报'}
            </Txt>
          </div>
          <Txt
            size={30}
            color={rgba(gold, 0.85)}
            font="num"
            letterSpacing={2}
            lineHeight={40}
            style={{ marginLeft: 'auto' }}
          >
            {p.dateText}
          </Txt>
        </div>

        {PANELS.map((c, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const s0 = 0.24 + i * 0.16;
          const e = outExpo(seg(t, s0, s0 + 0.38));
          return (
            <div
              key={c.no}
              style={{
                position: 'absolute',
                left: 96 + col * 456,
                top: 490 + row * 352,
                width: 432,
                height: 316,
                borderRadius: 16,
                background: `linear-gradient(158deg, ${rgba(T.pale, 0.09)} 0%, ${rgba(T.mask, 0.48)} 100%)`,
                border: `1px solid ${rgba(T.line, 0.2)}`,
                padding: '28px 30px',
                opacity: e,
                transform: `translateY(${(1 - e) * 30}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Txt size={22} color={rgba(gold, 0.85)} weight={700} font="num" letterSpacing={2} lineHeight={28}>
                  {c.no}
                </Txt>
                <Txt
                  size={26}
                  color={rgba(T.mist, 0.85)}
                  weight={300}
                  letterSpacing={4}
                  lineHeight={36}
                  style={{ marginLeft: 'auto' }}
                >
                  {c.k}
                </Txt>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 34, gap: 8 }}>
                <GoldText theme={T} size={86} weight={700} font="num" lineHeight={102}>
                  {c.v}
                </GoldText>
                <Txt size={30} color={rgba(cream, 0.85)} weight={400} lineHeight={40}>
                  {c.u}
                </Txt>
              </div>
              <Txt
                size={22}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={1}
                lineHeight={32}
                style={{ marginTop: 26 }}
              >
                {c.d}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 02 时间花在哪 */}
      <Chapter t={t} in={[3.26, 3.56]} out={[5.34, 5.62]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 500,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.34, 3.64)),
          }}
        >
          时 间 都 花 在 哪 了
        </Txt>

        {TIME_MIX.map((m, i) => {
          const s0 = 3.44 + i * 0.2;
          const e = outExpo(seg(t, s0, s0 + 0.42));
          return (
            <div
              key={m.k}
              style={{
                position: 'absolute',
                left: 146,
                top: 620 + i * 168,
                width: 788,
                opacity: Math.max(e, 0.001),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 12 }}>
                <Txt size={29} color={rgba(cream, 0.86)} weight={400} letterSpacing={5} lineHeight={40}>
                  {m.k}
                </Txt>
                <Txt
                  size={32}
                  color={T.bright}
                  weight={700}
                  font="num"
                  lineHeight={42}
                  style={{ marginLeft: 'auto' }}
                >
                  {m.v}%
                </Txt>
              </div>
              <div
                style={{
                  width: 788,
                  height: 22,
                  borderRadius: 11,
                  background: rgba(T.mask, 0.6),
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${m.v * e}%`,
                    height: '100%',
                    borderRadius: 11,
                    background: `linear-gradient(90deg, ${rgba(hexRgb(T.goldD), 0.8)}, ${rgba(gold, 0.95)}, ${T.goldA})`,
                    boxShadow: `0 0 16px ${rgba(gold, 0.4)}`,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: 146,
            top: 1330,
            width: 788,
            paddingTop: 28,
            borderTop: `1px solid ${rgba(T.line, 0.22)}`,
            opacity: outExpo(seg(t, 4.3, 4.64)),
          }}
        >
          <Txt size={30} color={rgba(cream, 0.82)} font="serif" letterSpacing={5} lineHeight={48}>
            {p.subValue || '70% 的时间在客户身边 —— 这就是我的方法'}
          </Txt>
        </div>
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.56, 5.92]}>
        <Sfx name="sfx_chime" at={3.56} vol={0.3} />
        <EndCard theme={T} t={t} start={5.62} p={p} />
      </Chapter>
    </Stage>
  );
};
