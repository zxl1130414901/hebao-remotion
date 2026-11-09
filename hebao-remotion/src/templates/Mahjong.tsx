import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 53 · 天胡开局版
 * 叙事：牌桌弧线 → 四张麻将牌依次滑入立起（微转角）→ 最后一张拍牌小跳
 *      →「胡」大印砸落 → 金光定局语 → 人物 + 二维码
 */

const TILES = [
  { left: 76, top: 820, rot: -12, gold: false },
  { left: 322, top: 780, rot: -4, gold: false },
  { left: 568, top: 780, rot: 4, gold: false },
  { left: 814, top: 820, rot: 12, gold: true },
];

export const Mahjong: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const vals = [
    p.stats[0]?.v ?? '42',
    p.stats[1]?.v ?? '218%',
    p.stats[2]?.v ?? 'No.3',
    `${fmtNum(p.premium, hasDec)}万`,
  ];
  const keys = ['承保件数', '目标达成率', '全省排名', '承保保费'];

  const hu = seg(t, 3.3, 3.58);
  const th = seg(t, 2.55, 2.75);
  const hop = Math.sin(clamp01(th) * Math.PI) * -14;
  const en = outExpo(seg(t, 5.7, 6.15));
  const pq = outBack(seg(t, 6.2, 6.6), 1.5);

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 牌桌绒面 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'brightness(.85)',
          background: `radial-gradient(ellipse at 50% 34%,${T.bg[1]} 0%,${T.bg[0]} 72%)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(45deg,rgba(0,0,0,.05) 0 3px,transparent 3px 6px)',
          }}
        />
      </div>

      {/* 牌桌弧线 */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 1272,
          width: 800,
          height: 300,
          borderRadius: '50%',
          borderTop: `3px solid ${rgba(T.line, 0.4)}`,
          opacity: clamp01(seg(t, 0.35, 0.8)),
        }}
      />

      {/* 麻将牌 */}
      {TILES.map((tl, i) => {
        const st = 0.85 + i * 0.5;
        const pin = outBack(seg(t, st, st + 0.48), 1.5);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: tl.left,
              top: tl.top,
              width: 216,
              height: 290,
              opacity: clamp01(seg(t, st, st + 0.2)),
              transform: `translateY(${i === 3 ? hop.toFixed(1) : 0}px) perspective(900px) rotateY(${(
                (1 - pin) * 70
              ).toFixed(1)}deg) translateX(${((1 - pin) * 160).toFixed(1)}px) rotate(${tl.rot}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 18,
                background: tl.gold
                  ? `linear-gradient(165deg,${T.goldA} 0%,${T.goldC} 60%,${T.goldD} 100%)`
                  : `linear-gradient(165deg,${T.cream} 0%,${T.cream2} 80%)`,
                border: '1px solid rgba(192,126,28,.45)',
                boxShadow: '0 20px 44px rgba(0,0,0,.4), inset 0 -14px 22px rgba(192,126,28,.14)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 46,
                  lineHeight: '60px',
                  color: tl.gold ? rgba(hexRgb(T.goldA), 0.97) : '#221D18',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
                }}
              >
                {vals[i]}
              </div>
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: 2,
                  color: tl.gold ? rgba(hexRgb(T.goldA), 0.9) : 'rgba(34,29,24,.62)',
                }}
              >
                {keys[i]}
              </div>
              <div
                style={{
                  width: 16,
                  height: 16,
                  transform: 'rotate(45deg)',
                  background: '#A63232',
                  marginTop: 8,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* 胡！大印 */}
      <div
        style={{
          position: 'absolute',
          left: 380,
          top: 320,
          width: 320,
          height: 320,
          borderRadius: '50%',
          border: '12px solid rgba(176,48,48,.94)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 60px rgba(176,48,48,.4)',
          opacity: clamp01(seg(t, 3.3, 3.44)),
          transform: `rotate(${(-12 + 7 * (1 - hu)).toFixed(2)}deg) scale(${lerp(
            2.6,
            1,
            1 - Math.pow(1 - hu, 3)
          ).toFixed(3)})`,
        }}
      >
        <span
          style={{
            fontSize: 150,
            lineHeight: '210px',
            color: 'rgba(176,48,48,.96)',
            fontWeight: 700,
            fontFamily: '"Noto Serif SC","Songti SC",serif',
          }}
        >
          胡
        </span>
      </div>

      {/* 定局语 */}
      <div
        style={{
          position: 'absolute',
          top: 1168,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 3.75, 4.15)),
          transform: `translateY(${((1 - outExpo(seg(t, 3.75, 4.1))) * 24).toFixed(1)}px)`,
        }}
      >
        <GoldText theme={T} size={38} weight={600} letterSpacing={10} lineHeight={54}>
          天胡开局 · 十月大捷
        </GoldText>
      </div>

      {/* 收尾 */}
      <Txt
        size={50}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={10}
        lineHeight={68}
        style={{
          position: 'absolute',
          top: 1330,
          width: 1080,
          textAlign: 'center',
          opacity: en,
          transform: `translateY(${((1 - en) * 22).toFixed(1)}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={25}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={36}
        style={{
          position: 'absolute',
          top: 1408,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 5.95, 6.35)),
        }}
      >
        {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={448}
        top={1480}
        size={170}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.2, 6.4)),
          transform: `scale(${lerp(0.85, 1, pq).toFixed(3)})`,
        }}
      />
      <Txt
        size={24}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 1688,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.5, 6.85)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={6.48} vol={0.3} />
    </Stage>
  );
};
