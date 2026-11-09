import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Txt } from '../components/GoldText';
import { VText } from '../components/VerticalText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, outBack, outExpo, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 46 · 水墨丹青版
 * 叙事：宣纸铺底 → 墨滴晕染 + 远山浮现 → 笔书大字逐字写出
 *      → 落款横线 + 钤印 → 竖排小字 → 淡墨大数 → 定版
 * 整版覆宣纸底色（压住主题背景与光晕），墨色固定为深墨而不是主题金。
 */

const INK = '34,29,24';
const BRUSH_ST: [number, number][] = [
  [0.3, 1.3],
  [0.55, 1.55],
  [0.8, 1.9],
];

export const Ink: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const chars = Array.from((p.slogan || '捷报频传').slice(0, 4));
  const sealName = Array.from(((p.name || '李静怡') + '印').slice(0, 4));
  const vstats = `承保 ${p.stats[0]?.v ?? '42'} 件 · 达成 ${p.stats[1]?.v ?? '218%'} · 全省 ${
    p.stats[2]?.v ?? 'No.3'
  }`;

  const pq = outBack(seg(t, 6.2, 6.65), 1.5);

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 宣纸底 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(175deg,${T.cream} 0%,${T.cream2} 58%,${T.cream} 100%)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 30% 20%,rgba(120,100,80,.08),transparent 55%),radial-gradient(ellipse at 78% 78%,rgba(120,100,80,.09),transparent 50%)',
          }}
        />
      </div>

      {/* 墨滴晕染 */}
      {[
        { left: 120, top: 260, w: 420, h: 420 },
        { left: 600, top: 480, w: 340, h: 340 },
        { left: 260, top: 1180, w: 520, h: 420 },
      ].map((d, i) => {
        const e = outExpo(seg(t, BRUSH_ST[i][0], BRUSH_ST[i][1]));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: d.left,
              top: d.top,
              width: d.w,
              height: d.h,
              borderRadius: '50%',
              filter: 'blur(18px)',
              opacity: e * 0.8,
              transform: `scale(${lerp(0.3, 1, e).toFixed(3)})`,
              background: `radial-gradient(circle at 46% 44%,rgba(${INK},.55) 0%,rgba(${INK},.22) 55%,rgba(${INK},0) 74%)`,
            }}
          />
        );
      })}

      {/* 远山 */}
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: 'absolute', inset: 0, opacity: clamp01(seg(t, 0.9, 2.0)) * 0.9 }}
      >
        <path d="M0 1560 Q 200 1320 360 1430 T 680 1400 T 1080 1470 V 1920 H 0 Z" fill={`rgba(${INK},.10)`} />
        <path d="M0 1650 Q 260 1480 460 1560 T 820 1540 T 1080 1600 V 1920 H 0 Z" fill={`rgba(${INK},.14)`} />
      </svg>

      {/* 笔书大字 */}
      <div style={{ position: 'absolute', left: 0, top: 470, width: 1080, textAlign: 'center' }}>
        {chars.map((c, i) => {
          const e = outExpo(seg(t, 1.15 + i * 0.38, 1.61 + i * 0.38));
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                fontSize: 202,
                lineHeight: '260px',
                fontWeight: 700,
                color: `rgb(${INK})`,
                fontFamily: '"Noto Serif SC","Songti SC",serif',
                verticalAlign: 'top',
                marginLeft: i === 0 ? 0 : 26,
                clipPath: `inset(0 ${(100 - e * 100).toFixed(2)}% 0 0)`,
              }}
            >
              {c}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 440,
          top: 900,
          width: 200,
          height: 5,
          borderRadius: 3,
          background: `rgb(${INK})`,
          opacity: outExpo(seg(t, 2.75, 3.05)),
          transform: `rotate(-1deg) scaleX(${outExpo(seg(t, 2.75, 3.05)).toFixed(3)})`,
        }}
      />
      <Txt
        size={30}
        color={`rgba(${INK},.72)`}
        weight={400}
        letterSpacing={12}
        lineHeight={42}
        style={{
          position: 'absolute',
          top: 940,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 2.95, 3.3)),
        }}
      >
        十月战报 · 笔笔皆是功夫
      </Txt>

      {/* 朱砂钤印 */}
      <div
        style={{
          position: 'absolute',
          left: 168,
          top: 978,
          width: 150,
          height: 150,
          background: '#A63232',
          borderRadius: 10,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          placeItems: 'center',
          padding: 14,
          boxShadow: '0 10px 26px rgba(166,50,50,.35)',
          opacity: clamp01(seg(t, 3.45, 3.58)),
          transform: `rotate(${(-7 + 5 * (1 - seg(t, 3.45, 3.7))).toFixed(2)}deg) scale(${lerp(
            1.8,
            1,
            1 - Math.pow(1 - seg(t, 3.45, 3.7), 3)
          ).toFixed(3)})`,
        }}
      >
        {sealName.map((c, i) => (
          <span
            key={i}
            style={{
              fontSize: 44,
              lineHeight: '50px',
              color: 'rgba(255,243,217,.95)',
              fontWeight: 600,
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {/* 竖排小字 */}
      <div style={{ position: 'absolute', right: 74, top: 980 }}>
        <VText
          theme={T}
          text={vstats}
          size={26}
          weight={400}
          letterSpacing={10}
          color={`rgba(${INK},.66)`}
          opacity={outExpo(seg(t, 3.75, 4.2))}
        />
      </div>

      {/* 淡墨大数 */}
      <div
        style={{
          position: 'absolute',
          top: 1120,
          width: 1080,
          textAlign: 'center',
          opacity: clamp01(seg(t, 4.45, 4.85)),
        }}
      >
        <span
          style={{
            fontSize: 150,
            lineHeight: '180px',
            letterSpacing: -2,
            color: `rgba(${INK},.88)`,
            fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
            fontWeight: 700,
          }}
        >
          {fmtNum(p.premium * outExpo(seg(t, 4.5, 5.6)), hasDec)}
        </span>
      </div>
      <Txt
        size={28}
        color={`rgba(${INK},.6)`}
        weight={400}
        letterSpacing={10}
        lineHeight={40}
        style={{
          position: 'absolute',
          top: 1316,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 4.95, 5.35)),
        }}
      >
        {p.dlabel}
      </Txt>

      {/* 定版 */}
      <QrBlock
        theme={T}
        left={448}
        top={1420}
        size={170}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.2, 6.45)),
          transform: `scale(${lerp(0.85, 1, pq).toFixed(3)})`,
        }}
      />
      <Txt
        size={24}
        color={`rgba(${INK},.75)`}
        weight={300}
        letterSpacing={4}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 1630,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.55, 6.9)),
        }}
      >
        {p.qrCap}
      </Txt>
      <Txt
        size={24}
        color={`rgba(${INK},.42)`}
        weight={300}
        letterSpacing={4}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 1700,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.75, 7.05)),
        }}
      >
        {p.note}
      </Txt>
        <Sfx name="sfx_chime" at={6.52} vol={0.3} />
    </Stage>
  );
};
