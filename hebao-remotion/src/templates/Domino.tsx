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
 * 40 · 多米诺战报版
 * 叙事：标题 → 五张骨牌连锁倒下（1.05 起每 0.42s 一张），倒一张亮一项战报
 *      → 整体清场 → 金印砸落 → 压轴大数字 → 人物 + 二维码
 */

const POS = [0, 1, 2, 3, 4].map((i) => 40 + i * 190);
const CN = ['壹', '贰', '叁', '肆', '伍'];
const outCubic = (x: number) => 1 - Math.pow(1 - x, 3);

export const Domino: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const chips = [
    p.stats[0] ?? { v: '42', k: '承保件数' },
    p.stats[1] ?? { v: '218%', k: '目标达成率' },
    p.stats[2] ?? { v: 'No.3', k: '全省排名' },
    { v: '全勤', k: '31 天无缺席' },
    { v: '100%', k: '团队协作达成' },
  ];

  const clear = 1 - outExpo(seg(t, 4.3, 4.66));
  const sp = seg(t, 4.72, 4.95);
  const sealOp = clamp01(seg(t, 4.72, 4.85)) * (1 - seg(t, 5.9, 6.2));
  const en = outExpo(seg(t, 6.25, 6.65));
  const pq = outBack(seg(t, 6.6, 7.0), 1.5);

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 01 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 250,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 0.15, 0.5)),
        }}
      >
        <GoldText theme={T} size={70} weight={600} letterSpacing={16} lineHeight={96}>
          多米诺战报
        </GoldText>
      </div>
      <Txt
        size={24}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={10}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 360,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 0.32, 0.6)),
        }}
      >
        ONE PUSH · ALL GLORY
      </Txt>

      {/* 02 骨牌 + 战报浮标 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: clear,
          transform: `translateY(${((1 - clear) * 46).toFixed(1)}px)`,
        }}
      >
        {POS.map((x, i) => {
          const st = 1.05 + i * 0.42;
          const p2 = outCubic(seg(t, st, st + 0.42));
          const isLast = i === 4;
          return (
            <div key={i}>
              {/* 地面投影 */}
              <div
                style={{
                  position: 'absolute',
                  left: x - 6,
                  top: 1120 + 180 - 12,
                  width: 142,
                  height: 20,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,.32)',
                  filter: 'blur(5px)',
                }}
              />
              {/* 牌体 */}
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: 1120,
                  width: 130,
                  height: 180,
                  borderRadius: 12,
                  transformOrigin: '12% 96%',
                  transform: `rotate(${(p2 * 72).toFixed(2)}deg)`,
                  background: isLast
                    ? `linear-gradient(160deg,${T.goldA} 0%,${T.goldC} 55%,${T.goldD} 100%)`
                    : `linear-gradient(160deg,${rgba(hexRgb(T.cream), 0.97)} 0%,${rgba(
                        hexRgb(T.cream2),
                        0.92
                      )} 100%)`,
                  border: `1px solid ${rgba(hexRgb(T.goldD), 0.55)}`,
                  boxShadow: `inset 0 0 0 5px ${rgba(hexRgb(T.goldD), 0.16)}, 0 5px 14px rgba(0,0,0,.3)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* 中缝 */}
                <div
                  style={{
                    position: 'absolute',
                    left: 10,
                    right: 10,
                    top: '50%',
                    height: 2,
                    background: rgba(hexRgb(T.goldD), 0.4),
                  }}
                />
                <span
                  style={{
                    fontSize: 52,
                    lineHeight: '60px',
                    fontFamily: '"Noto Serif SC","Songti SC",serif',
                    color: isLast ? rgba(hexRgb(T.goldA), 0.95) : rgba(hexRgb(T.goldD), 0.78),
                  }}
                >
                  {CN[i]}
                </span>
              </div>
              {/* 浮标 */}
              {(() => {
                const cst = st + 0.34;
                const e = outBack(seg(t, cst, cst + 0.4), 1.8);
                return (
                  <div
                    style={{
                      position: 'absolute',
                      left: x + 65 - 95,
                      top: 800,
                      width: 190,
                      textAlign: 'center',
                      opacity: clamp01(seg(t, cst, cst + 0.18)),
                      transform: `translateY(${((1 - e) * 30).toFixed(1)}px)`,
                    }}
                  >
                    <GoldText theme={T} size={50} font="num" lineHeight={62}>
                      {chips[i].v}
                    </GoldText>
                    <Txt
                      size={22}
                      color={rgba(T.soft, 0.85)}
                      weight={300}
                      letterSpacing={2}
                      lineHeight={28}
                      style={{ marginTop: 2, whiteSpace: 'nowrap' }}
                    >
                      {chips[i].k}
                    </Txt>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* 03 金印砸落 */}
      <div
        style={{
          position: 'absolute',
          left: 390,
          top: 560,
          width: 300,
          height: 300,
          borderRadius: '50%',
          opacity: sealOp,
          border: `8px solid ${rgba(hexRgb(T.goldC), 0.92)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 40px ${rgba(hexRgb(T.goldB), 0.45)}, inset 0 0 30px ${rgba(
            hexRgb(T.goldB),
            0.2
          )}`,
          transform: `rotate(${(-10 + 8 * (1 - sp)).toFixed(2)}deg) scale(${lerp(
            2,
            1,
            outCubic(sp)
          ).toFixed(3)})`,
        }}
      >
        <div
          style={{
            width: 246,
            height: 246,
            borderRadius: '50%',
            border: `2px solid ${rgba(hexRgb(T.goldC), 0.7)}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 110,
              lineHeight: '120px',
              color: T.bright,
              fontWeight: 700,
              fontFamily: '"Noto Serif SC","Songti SC",serif',
              textShadow: `0 0 26px ${rgba(hexRgb(T.goldB), 0.8)}`,
            }}
          >
            {p.sealChar && p.sealChar !== '泰' ? p.sealChar : '捷'}
          </span>
          <span
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: rgba(hexRgb(T.goldB), 0.95),
              fontWeight: 500,
            }}
          >
            十月大捷
          </span>
        </div>
      </div>

      {/* 04 压轴数字 */}
      <div
        style={{
          position: 'absolute',
          top: 940,
          width: 1080,
          textAlign: 'center',
          opacity: clamp01(seg(t, 5.35, 5.6)),
        }}
      >
        <GoldText theme={T} size={170} font="num" lineHeight={190}>
          {fmtNum(p.premium * outExpo(seg(t, 5.4, 6.05)), hasDec)}
        </GoldText>
      </div>
      <Txt
        size={30}
        color={rgba(T.soft, 0.9)}
        weight={300}
        letterSpacing={8}
        lineHeight={42}
        style={{
          position: 'absolute',
          top: 1150,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 5.75, 6.1)),
        }}
      >
        {p.dlabel}
      </Txt>

      {/* 05 收尾 */}
      <Txt
        size={52}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={10}
        lineHeight={72}
        style={{
          position: 'absolute',
          top: 1268,
          width: 1080,
          textAlign: 'center',
          opacity: en,
          transform: `translateY(${((1 - en) * 24).toFixed(1)}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={26}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={36}
        style={{
          position: 'absolute',
          top: 1350,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.45, 6.8)),
        }}
      >
        {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={455}
        top={1430}
        size={170}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.6, 6.8)),
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
          top: 1636,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.9, 7.2)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={6.88} vol={0.3} />
    </Stage>
  );
};
