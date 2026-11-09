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
 * 37 · 业绩电梯版
 * 叙事：楼层显示屏亮起 → 梯厢内楼层牌连续上行（底部循环填充不露空）
 *      → 轻微过冲回落 →「叮」+ 白光闪 → 抵达荣耀层 → 人物 + 二维码
 */

const PLATE_H = 230;

export const Elevator: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const s0 = p.stats[0]?.v ?? '42';
  const s1 = p.stats[1]?.v ?? '218%';
  const s2 = p.stats[2]?.v ?? 'No.3';

  const FLOORS = [
    { f: '1F', n: '首单达成', s: '开门红 · 当月 3 号出单' },
    { f: '18F', n: '百件俱乐部', s: `承保 ${s0} 件 · 稳步爬升` },
    { f: '42F', n: '全勤战神', s: '连续出勤 · 无一日缺席' },
    { f: '88F', n: '目标超越', s: `达成 ${s1} · 全省 ${s2}` },
    { f: 'TOP', n: 'MDRT之夜', s: `保费 ${fmtNum(p.premium, hasDec)} 万 · 登顶` },
  ];
  const n = FLOORS.length;
  const lastTop = (n - 1) * PLATE_H;

  const ride = seg(t, 1.0, 5.4);
  const over = Math.sin(Math.min(1, seg(t, 5.0, 5.4)) * Math.PI) * 14;
  const ty = lerp(0, -(lastTop - 460), ride) - over * (1 - seg(t, 5.0, 5.3));

  const floorNo = Math.min(88, Math.round(1 + ride * 87 + over * 0.04));

  const ding = seg(t, 5.55, 5.75);
  const dingFlash = Math.exp(-Math.max(0, t - 5.55) * 4) * (seg(t, 5.55, 5.62) > 0 ? 0.9 : 0);

  const pe = outExpo(seg(t, 6.35, 6.8));
  const pq = outBack(seg(t, 6.75, 7.1), 1.5);

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 楼层显示屏 */}
      <div
        style={{
          position: 'absolute',
          left: 230,
          top: 214,
          width: 620,
          height: 88,
          border: `2px solid ${rgba(T.line, 0.55)}`,
          borderRadius: 10,
          background: 'rgba(0,0,0,.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26,
        }}
      >
        <Txt size={22} color={rgba(T.soft, 0.85)} weight={300} letterSpacing={6} lineHeight={30}>
          FLOOR
        </Txt>
        <div style={{ minWidth: 150, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={60}
            font="num"
            lineHeight={64}
            style={{ textShadow: `0 0 18px ${rgba(hexRgb(T.goldB), 0.65)}` }}
          >
            {String(floorNo).padStart(2, '0')}
          </GoldText>
        </div>
        <div
          style={{
            fontSize: 34,
            color: rgba(hexRgb(T.goldB), 0.9),
            opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 6)),
          }}
        >
          ▲
        </div>
      </div>

      {/* 梯厢 */}
      <div
        style={{
          position: 'absolute',
          left: 230,
          top: 330,
          width: 620,
          height: 1050,
          border: `2px solid ${rgba(T.line, 0.55)}`,
          borderRadius: 10,
          background: 'rgba(0,0,0,.34)',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,.4)',
        }}
      >
        {/* 玻璃横档 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(180deg,transparent 0 178px,${rgba(
              T.line,
              0.22
            )} 178px 180px)`,
          }}
        />
        {/* 楼层牌 */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', transform: `translateY(${ty.toFixed(1)}px)` }}>
          {[0, 1, 2].map((rep) =>
            FLOORS.map((fl, i) => {
              const isLast = i === n - 1;
              return (
                <div
                  key={`${rep}-${i}`}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: i * PLATE_H + rep * n * PLATE_H,
                    width: '100%',
                    height: PLATE_H,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  <Txt size={22} color={rgba(T.soft, 0.85)} weight={300} letterSpacing={6} lineHeight={28}>
                    {fl.f}
                  </Txt>
                  {isLast ? (
                    <GoldText theme={T} size={56} weight={600} letterSpacing={6} lineHeight={68}>
                      {fl.n}
                    </GoldText>
                  ) : (
                    <Txt
                      size={56}
                      color={rgba(T.pale, 0.92)}
                      weight={600}
                      font="serif"
                      letterSpacing={6}
                      lineHeight={68}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {fl.n}
                    </Txt>
                  )}
                  <Txt
                    size={26}
                    color={rgba(T.soft, 0.8)}
                    weight={300}
                    letterSpacing={4}
                    lineHeight={36}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {fl.s}
                  </Txt>
                </div>
              );
            })
          )}
        </div>
        {/* 到站白光 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: dingFlash,
            background: `radial-gradient(circle at 50% 50%,${rgba(hexRgb(T.cream), 0.35)},${rgba(
              hexRgb(T.cream),
              0
            )} 70%)`,
          }}
        />
      </div>

      {/* 四角铆钉 */}
      {[
        [225, 325],
        [845, 325],
        [225, 1375],
        [845, 1375],
      ].map(([l, tp], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: l,
            top: tp,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: rgba(hexRgb(T.goldC), 0.85),
            boxShadow: `0 0 8px ${rgba(hexRgb(T.goldB), 0.6)}`,
          }}
        />
      ))}

      {/* 叮 */}
      <Txt
        size={40}
        color={T.bright}
        weight={500}
        letterSpacing={10}
        lineHeight={56}
        style={{
          position: 'absolute',
          top: 1580,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(ding) * (1 - seg(t, 6.4, 6.8)),
        }}
      >
        叮 —— 荣耀层已抵达
      </Txt>

      {/* 人物 + 二维码 */}
      <Txt
        size={56}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={10}
        lineHeight={76}
        style={{
          position: 'absolute',
          top: 1448,
          width: 1080,
          textAlign: 'center',
          opacity: pe,
          transform: `translateY(${((1 - pe) * 26).toFixed(1)}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={27}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={38}
        style={{
          position: 'absolute',
          top: 1532,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.55, 6.95)),
        }}
      >
        {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={465}
        top={1556}
        size={150}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.75, 6.92)),
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
          top: 1726,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.95, 7.25)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={6.98} vol={0.3} />
    </Stage>
  );
};
