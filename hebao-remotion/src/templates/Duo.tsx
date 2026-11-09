import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { Pill } from '../components/EndCard';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 33 · 双星联贺版
 * 叙事：中央「贺」印 + 标语 → 双列对称入场（圆章头像 + 姓名 + 数值）→ 共同荣誉 → 定版
 */

export const Duo: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const names = (p.name || '').split(/[·/／、,，]/).map((s) => s.trim()).filter(Boolean);
  const nA = names[0] || '李静怡';
  const nB = names[1] || '王志远';
  /* 双人保费口径：左列用全局 premium，右列沿用原版 CFG 的第二人数据 */
  const hasDec = p.premium % 1 !== 0;
  const cols = [
    { ch: nA.charAt(0), name: nA, v: `${p.premium.toFixed(hasDec ? 1 : 0)}万`, k: '个人承保保费', dir: -1, st: 2.34 },
    { ch: nB.charAt(0), name: nB, v: '248.2万', k: '个人承保保费', dir: 1, st: 2.54 },
  ];

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 中央印 + 标语 */}
      <Chapter t={t} in={[0.1, 0.44]} out={[2.0, 2.3]}>
        {(() => {
          const pse = outBack(seg(t, 0.14, 0.52), 1.8);
          return (
            <div
              style={{
                position: 'absolute',
                left: 462,
                top: 440,
                width: 156,
                height: 156,
                borderRadius: '50%',
                border: `2.5px solid ${rgba(T.line, 0.7)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: clamp01(seg(t, 0.14, 0.34)),
                transform: `scale(${lerp(0.5, 1, pse)})`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 9,
                  borderRadius: '50%',
                  border: `1px solid ${rgba(T.line, 0.35)}`,
                }}
              />
              <GoldText theme={T} size={86} font="serif" weight={700} lineHeight={100}>
                贺
              </GoldText>
            </div>
          );
        })()}
        {(() => {
          const psg = outBack(seg(t, 0.4, 0.82), 1.8);
          return (
            <GoldText
              theme={T}
              size={110}
              font="serif"
              weight={700}
              lineHeight={160}
              letterSpacing={20}
              style={{
                position: 'absolute',
                top: 690,
                left: 0,
                width: 1080,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: clamp01(seg(t, 0.4, 0.64)),
                transform: `scale(${lerp(1.3, 1, psg)})`,
              }}
            >
              {p.slogan}
            </GoldText>
          );
        })()}
        <Txt
          size={27}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={10}
          lineHeight={38}
          style={{
            position: 'absolute',
            top: 900,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.7, 1.0)),
          }}
        >
          DOUBLE　STARS　OF　THE　MONTH
        </Txt>
      </Chapter>

      {/* 02 双列对称入场 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[4.44, 4.74]}>
        {/* 中缝竖线 */}
        <div
          style={{
            position: 'absolute',
            left: 539,
            top: 490,
            width: 1,
            height: 560,
            background: `linear-gradient(180deg,${rgba(T.line, 0)},${rgba(T.line, 0.5)} 15%,${rgba(
              T.line,
              0.5
            )} 85%,${rgba(T.line, 0)})`,
            transform: `scaleY(${outExpo(seg(t, 2.22, 2.86))})`,
            transformOrigin: '50% 0%',
          }}
        />
        {cols.map((c, i) => {
          const pr = outExpo(seg(t, c.st, c.st + 0.38));
          const cp = outBack(seg(t, c.st, c.st + 0.36), 1.9);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: i === 0 ? 110 : 540,
                top: 470,
                width: 430,
                textAlign: 'center',
                opacity: pr,
                transform: `translateX(${(1 - pr) * c.dir * 90}px)`,
              }}
            >
              <div
                style={{
                  width: 190,
                  height: 190,
                  borderRadius: '50%',
                  margin: '0 auto',
                  border: `2px solid ${rgba(T.line, 0.7)}`,
                  background: rgba(T.line, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${lerp(0.4, 1, cp)})`,
                }}
              >
                <Txt size={92} color={T.bright} weight={600} font="serif" lineHeight={110}>
                  {c.ch}
                </Txt>
              </div>
              <Txt
                size={64}
                color="#fff"
                weight={600}
                font="serif"
                letterSpacing={8}
                lineHeight={90}
                style={{ marginTop: 44 }}
              >
                {c.name}
              </Txt>
              <div style={{ marginTop: 22 }}>
                <GoldText theme={T} size={104} font="num" weight={700} lineHeight={140}>
                  {c.v}
                </GoldText>
              </div>
              <Txt
                size={28}
                color={rgba(T.mist, 1)}
                weight={300}
                letterSpacing={5}
                lineHeight={39}
                style={{ marginTop: 12 }}
              >
                {c.k}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 03 共同荣誉 */}
      <Chapter t={t} in={[4.58, 4.9]} out={[6.0, 6.3]}>
        <Pill theme={T} text={p.pill} top={560} p={outBack(seg(t, 4.64, 5.0), 1.5)} />
        {(() => {
          const pq4 = outExpo(seg(t, 4.84, 5.14));
          return (
            <>
              <Txt
                size={46}
                color={T.cream2}
                weight={300}
                font="serif"
                letterSpacing={6}
                lineHeight={64}
                style={{
                  position: 'absolute',
                  top: 720,
                  width: 1080,
                  textAlign: 'center',
                  opacity: pq4,
                  transform: `translateY(${(1 - pq4) * 22}px)`,
                }}
              >
                {p.quote || '并肩作战 · 载誉同行'}
              </Txt>
              <Txt
                size={30}
                color={rgba(T.soft, 0.85)}
                weight={300}
                letterSpacing={6}
                lineHeight={42}
                style={{
                  position: 'absolute',
                  top: 860,
                  width: 1080,
                  textAlign: 'center',
                  opacity: outExpo(seg(t, 5.02, 5.3)),
                }}
              >
                {p.role}
              </Txt>
            </>
          );
        })()}
      </Chapter>

      {/* 04 定版 */}
      <Chapter t={t} in={[6.44, 6.78]}>
        <Sfx name="sfx_gong" at={0.42} vol={0.45} />
        <EndCard theme={T} t={t} start={6.52} p={p} />
      </Chapter>
    </Stage>
  );
};
