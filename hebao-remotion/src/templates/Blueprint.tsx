import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 50 · 工程蓝图版
 * 叙事：图纸底 + 网格 → 五层塔自下而上描边绘制，每层挂尺寸标注
 *      → 图签栏滑入 → 竣工红章砸落 → 设计人落款 + 二维码
 */

const FH = 150;
const BASE_Y = 1350;
const CX = 470;

export const Blueprint: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const s0 = p.stats[0]?.v ?? '42';
  const s1 = p.stats[1]?.v ?? '218%';
  const s2 = p.stats[2]?.v ?? 'No.3';
  const pv = fmtNum(p.premium, hasDec);

  const FLOORS = [
    { w: 430, label: `承保 ${s0} 件`, k: '地基 · POLICIES' },
    { w: 360, label: '全勤 31 天', k: '结构 · ATTENDANCE' },
    { w: 296, label: `达成 ${s1}`, k: '框架 · TARGET' },
    { w: 236, label: `全省 ${s2}`, k: '立面 · RANKING' },
    { w: 180, label: `保费 ${pv}万`, k: '塔冠 · PREMIUM' },
  ];

  const sp = seg(t, 5.35, 5.62);
  const en = outExpo(seg(t, 5.95, 6.4));
  const pq = outBack(seg(t, 6.4, 6.85), 1.5);

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 图纸底 + 网格 */}
      <div style={{ position: 'absolute', inset: 0, background: T.archbg }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(0deg,${rgba(T.line, 0.07)} 0 1px,transparent 1px 48px),repeating-linear-gradient(90deg,${rgba(
              T.line,
              0.07
            )} 0 1px,transparent 1px 48px)`,
          }}
        />
      </div>

      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 0.15, 0.55)),
        }}
      >
        <GoldText theme={T} size={56} weight={600} letterSpacing={12} lineHeight={78}>
          十月 · 业绩工程图
        </GoldText>
      </div>
      <Txt
        size={23}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={8}
        lineHeight={32}
        style={{
          position: 'absolute',
          top: 306,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 0.35, 0.7)),
        }}
      >
        PERFORMANCE BLUEPRINT · DWG NO. HK-2026-10
      </Txt>

      {/* 塔体 SVG */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        {FLOORS.map((f, i) => {
          const y = BASE_Y - (i + 1) * FH;
          const st = 0.7 + i * 0.72;
          const drawP = outExpo(seg(t, st, st + 0.55));
          const len = 2 * (f.w + FH - 10);
          const labP = outExpo(seg(t, 0.95 + i * 0.72, 1.35 + i * 0.72));
          return (
            <g key={i}>
              <rect
                x={CX - f.w / 2}
                y={y}
                width={f.w}
                height={FH - 10}
                fill="none"
                stroke={rgba(T.pale, 0.9)}
                strokeWidth={3}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - drawP)}
                opacity={drawP > 0 ? 1 : 0}
              />
              <line
                x1={CX + f.w / 2 + 16}
                y1={y + 14}
                x2={CX + f.w / 2 + 120}
                y2={y + 14}
                stroke={rgba(T.line, 0.8)}
                strokeWidth={2}
                opacity={labP}
              />
              <text
                x={CX + f.w / 2 + 130}
                y={y + 24}
                fontSize={24}
                fill={T.bright}
                fontWeight={700}
                fontFamily='"Oswald","Bahnschrift","Arial Narrow",sans-serif'
                opacity={labP}
              >
                {f.label}
              </text>
              <text x={CX + f.w / 2 + 130} y={y + 54} fontSize={18} fill={rgba(T.soft, 0.85)} letterSpacing={2} opacity={labP}>
                {f.k}
              </text>
            </g>
          );
        })}
        {/* 塔顶尖 */}
        {(() => {
          const st = 0.7 + 5 * 0.72;
          const drawP = outExpo(seg(t, st, st + 0.55));
          const len = 2 * 120 + Math.hypot(120, 110) * 2;
          return (
            <polygon
              points={`${CX - 60},${BASE_Y - 5 * FH} ${CX + 60},${BASE_Y - 5 * FH} ${CX},${
                BASE_Y - 5 * FH - 110
              }`}
              fill="none"
              stroke={rgba(T.pale, 0.9)}
              strokeWidth={3}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - drawP)}
              opacity={drawP > 0 ? 1 : 0}
            />
          );
        })()}
      </svg>

      {/* 图签栏 */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 1400,
          width: 400,
          height: 190,
          border: `2px solid ${rgba(T.line, 0.55)}`,
          fontSize: 22,
          lineHeight: '44px',
          color: rgba(T.pale, 0.9),
          padding: '14px 22px',
          letterSpacing: 2,
          opacity: outExpo(seg(t, 4.55, 5.1)),
          transform: `translateX(${((1 - outExpo(seg(t, 4.55, 5.05))) * -40).toFixed(1)}px)`,
        }}
      >
        图别：<b style={{ color: T.bright, fontWeight: 600 }}>竣工图</b>　图号：HK-2026-10
        <br />
        设计人：<b style={{ color: T.bright, fontWeight: 600 }}>{p.name}</b>　职务：高级业务经理
        <br />
        审定：<b style={{ color: T.bright, fontWeight: 600 }}>达成 {s1}</b>　日期：2026.10
      </div>

      {/* 竣工章 */}
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 1260,
          width: 190,
          height: 190,
          borderRadius: '50%',
          border: '6px solid rgba(176,48,48,.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: clamp01(seg(t, 5.35, 5.48)),
          transform: `rotate(${(14 - 8 * (1 - sp)).toFixed(2)}deg) scale(${lerp(
            2.2,
            1,
            1 - Math.pow(1 - sp, 3)
          ).toFixed(3)})`,
        }}
      >
        <span style={{ fontSize: 64, color: 'rgba(176,48,48,.95)', fontWeight: 700, letterSpacing: 6 }}>
          竣 工
        </span>
      </div>

      {/* 收尾 */}
      <Txt
        size={44}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={8}
        lineHeight={60}
        style={{
          position: 'absolute',
          left: 560,
          top: 1430,
          width: 440,
          opacity: en,
          transform: `translateY(${((1 - en) * 20).toFixed(1)}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={23}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={3}
        lineHeight={32}
        style={{
          position: 'absolute',
          left: 560,
          top: 1500,
          width: 440,
          opacity: outExpo(seg(t, 6.15, 6.55)),
        }}
      >
        {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={180}
        top={1640}
        size={150}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.4, 6.6)),
          transform: `scale(${lerp(0.85, 1, pq).toFixed(3)})`,
        }}
      />
      <Txt
        size={22}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={3}
        lineHeight={30}
        style={{
          position: 'absolute',
          left: 60,
          top: 1764,
          width: 420,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.7, 7.05)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={6.68} vol={0.3} />
    </Stage>
  );
};
