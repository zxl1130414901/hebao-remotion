import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 51 · 成绩放榜版
 * 叙事：成绩单卡片落桌 → 四科逐行翻牌揭晓（红章随行盖下）
 *      → 评语 + 主管签阅 → 特优大章压榜 → 人物 + 二维码
 */

const GRADES = ['优', '特优', '前三', '满分'];

export const Score: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const rows = [
    { k: '承保件数', v: `${p.stats[0]?.v ?? '42'} 件` },
    { k: '目标达成率', v: p.stats[1]?.v ?? '218%' },
    { k: '全省排名', v: p.stats[2]?.v ?? 'No.3', b: true },
    { k: '承保保费', v: `${fmtNum(p.premium, hasDec)} 万` },
  ];

  const cd = outBack(seg(t, 0.3, 0.95), 1.3);
  const sp = seg(t, 4.55, 4.85);
  const en = outExpo(seg(t, 5.7, 6.15));
  const pq = outBack(seg(t, 6.2, 6.6), 1.5);

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 桌面 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'brightness(.85)',
          background: `radial-gradient(ellipse at 50% 30%,${T.bg[1]} 0%,${T.bg[0]} 70%)`,
        }}
      />

      {/* 成绩单卡片 */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 250,
          width: 860,
          height: 1010,
          background: `linear-gradient(170deg,${T.cream} 0%,${T.cream2} 100%)`,
          borderRadius: 6,
          boxShadow: '0 40px 90px rgba(0,0,0,.5), inset 0 0 0 1px rgba(192,126,28,.35)',
          opacity: clamp01(seg(t, 0.3, 0.6)),
          transform: `rotate(-1.2deg) translateY(${((1 - cd) * -500).toFixed(1)}px)`,
        }}
      >
        <div style={{ position: 'absolute', inset: 22, border: '2px solid rgba(192,126,28,.45)' }} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 70,
            width: '100%',
            textAlign: 'center',
            fontSize: 58,
            letterSpacing: 16,
            color: '#221D18',
            fontWeight: 700,
            fontFamily: '"Noto Serif SC","Songti SC",serif',
          }}
        >
          成绩单
        </div>
        <Txt
          size={24}
          color="rgba(34,29,24,.6)"
          weight={400}
          letterSpacing={6}
          lineHeight={34}
          style={{ position: 'absolute', left: 0, top: 178, width: '100%', textAlign: 'center' }}
        >
          泰康养老 · 2026 年 10 月 · 号 HK2026-10
        </Txt>
        <div
          style={{
            position: 'absolute',
            right: 64,
            top: 64,
            width: 130,
            height: 130,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid rgba(192,126,28,.6)',
          }}
        >
          <Img
            src={p.photo || staticFile('assets/portrait.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* 成绩表 */}
        <div style={{ position: 'absolute', left: 80, right: 80, top: 250 }}>
          {rows.map((r, i) => {
            const st = 1.15 + i * 0.55;
            const gp = seg(t, st + 0.3, st + 0.55);
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 130,
                  borderBottom: '2px solid rgba(34,29,24,.16)',
                  borderTop: i === 0 ? '2px solid rgba(34,29,24,.28)' : undefined,
                  transformOrigin: '50% 100%',
                  opacity: clamp01(seg(t, st, st + 0.3)),
                  transform: `rotateX(${((1 - outExpo(seg(t, st, st + 0.45))) * -80).toFixed(1)}deg)`,
                }}
              >
                <div style={{ flex: '1.1', fontSize: 32, letterSpacing: 4, color: 'rgba(34,29,24,.85)' }}>
                  {r.k}
                </div>
                <div
                  style={{
                    flex: '1.3',
                    fontSize: 52,
                    color: '#221D18',
                    fontWeight: 700,
                    fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
                  }}
                >
                  {r.v}
                </div>
                <div
                  style={{
                    width: 110,
                    height: 56,
                    borderRadius: 6,
                    marginLeft: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    fontWeight: 600,
                    color: '#fff',
                    background: r.b ? '#8A6634' : '#A63232',
                    opacity: clamp01(gp),
                    transform: `scale(${lerp(0.5, 1, outBack(gp, 2)).toFixed(3)})`,
                  }}
                >
                  {GRADES[i]}
                </div>
              </div>
            );
          })}
        </div>

        {/* 评语 + 签阅 */}
        <Txt
          size={27}
          color="rgba(34,29,24,.78)"
          weight={400}
          lineHeight={44}
          style={{
            position: 'absolute',
            left: 80,
            right: 80,
            top: 810,
            fontStyle: 'italic',
            opacity: outExpo(seg(t, 3.55, 4.05)),
          }}
        >
          评语：全月零缺席，节奏稳、打法狠，是团队的榜样，期待十一月再创佳绩。
        </Txt>
        <Txt
          size={30}
          color="rgba(34,29,24,.75)"
          weight={400}
          letterSpacing={4}
          lineHeight={42}
          style={{
            position: 'absolute',
            right: 100,
            top: 940,
            opacity: outExpo(seg(t, 3.85, 4.3)),
          }}
        >
          —— 主管签阅
        </Txt>
      </div>

      {/* 特优大章 */}
      <div
        style={{
          position: 'absolute',
          left: 892,
          top: 1150,
          width: 180,
          height: 180,
          borderRadius: '50%',
          border: '8px solid rgba(166,50,50,.92)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 16px 40px rgba(166,50,50,.3)',
          opacity: clamp01(seg(t, 4.55, 4.7)),
          transform: `rotate(${(-14 + 8 * (1 - sp)).toFixed(2)}deg) scale(${lerp(
            2.4,
            1,
            1 - Math.pow(1 - sp, 3)
          ).toFixed(3)})`,
        }}
      >
        <span style={{ fontSize: 72, color: 'rgba(166,50,50,.95)', fontWeight: 700, letterSpacing: 4 }}>
          特 优
        </span>
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
        <Sfx name="sfx_gong" at={0.80} vol={0.42} />
    </Stage>
  );
};
