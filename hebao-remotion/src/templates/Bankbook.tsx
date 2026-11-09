import { Sfx } from '../components/Sfx';
import { PAPER_URL } from '../components/textures';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 52 · 存折入账版
 * 叙事：存折翻开落定 → 右页四行明细逐行「打印」（打印头扫过显行）
 *      → 合计行烫金 + 左页已核验章 → 人物 + 二维码
 */

const ENTRIES = [
  { d: '10.03', k: '开门红首单', v: '+6 件' },
  { d: '10.12', k: '月中冲刺周', v: '+18 件' },
  { d: '10.21', k: '全勤连击 · 单日 6 件', v: '+12 件' },
  { d: '10.31', k: '月末收官冲刺', v: '+6 件' },
];

export const Bankbook: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const bo = outBack(seg(t, 0.35, 1.05), 1.2);
  const sm = outExpo(seg(t, 3.9, 4.4));
  const ps = seg(t, 4.55, 4.85);
  const en = outExpo(seg(t, 5.65, 6.1));
  const pq = outBack(seg(t, 6.15, 6.55), 1.5);

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 存折 */}
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 270,
          width: 880,
          height: 1060,
          display: 'flex',
          borderRadius: 8,
          boxShadow: '0 40px 100px rgba(0,0,0,.5)',
          opacity: clamp01(seg(t, 0.35, 0.7)),
          transform: `translateY(${((1 - bo) * -420).toFixed(1)}px)`,
        }}
      >
        {/* 左页 */}
        <div
          style={{
            flex: 1,
            background: `linear-gradient(170deg,${T.cream} 0%,${T.cream2} 100%)`,
            position: 'relative',
            borderRadius: '8px 0 0 8px',
            borderRight: '1px solid rgba(192,126,28,.35)',
          }}
        >
          {/* 纸张纤维纹理 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '8px 0 0 8px',
              backgroundImage: PAPER_URL,
              opacity: 0.35,
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'absolute', left: 56, top: 70, width: 340 }}>
            <div
              style={{
                fontSize: 34,
                letterSpacing: 8,
                color: '#221D18',
                fontWeight: 700,
                fontFamily: '"Noto Serif SC","Songti SC",serif',
              }}
            >
              荣誉存折
            </div>
            <Txt
              size={20}
              color="rgba(34,29,24,.55)"
              weight={400}
              letterSpacing={3}
              lineHeight={27}
              style={{ marginTop: 8 }}
            >
              TAIKANG HONOR PASSBOOK
            </Txt>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 56,
              top: 180,
              width: 200,
              height: 260,
              overflow: 'hidden',
              border: '1px solid rgba(192,126,28,.5)',
            }}
          >
            <Img
              src={p.photo || staticFile('assets/portrait.png')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {[
            ['户　名', p.name],
            ['职　务', p.role.split(' · ')[0] ?? p.role],
            ['网　点', p.role.split(' · ')[1] ?? '—'],
            ['账　期', p.dateText],
          ].map(([k, v], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 56,
                top: 480 + i * 60,
                width: 340,
                fontSize: 25,
                letterSpacing: 3,
                color: 'rgba(34,29,24,.85)',
              }}
            >
              {k}：<b style={{ color: '#221D18', fontWeight: 600 }}>{v}</b>
            </div>
          ))}
          {/* 已核验章 */}
          <div
            style={{
              position: 'absolute',
              left: 230,
              top: 760,
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: '4px solid rgba(176,48,48,.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              color: 'rgba(176,48,48,.9)',
              fontWeight: 700,
              opacity: clamp01(seg(t, 4.55, 4.7)),
              transform: `rotate(${(-12 + 7 * (1 - ps)).toFixed(2)}deg) scale(${lerp(
                1.8,
                1,
                1 - Math.pow(1 - ps, 3)
              ).toFixed(3)})`,
            }}
          >
            已核验
          </div>
        </div>

        {/* 右页 */}
        <div
          style={{
            flex: 1,
            background: `linear-gradient(170deg,${T.cream} 0%,${T.cream2} 100%)`,
            position: 'relative',
            borderRadius: '0 8px 8px 0',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 50,
              right: 50,
              top: 64,
              fontSize: 30,
              letterSpacing: 5,
              color: '#221D18',
              fontWeight: 700,
              borderBottom: '2px solid rgba(34,29,24,.4)',
              paddingBottom: 14,
            }}
          >
            入账明细
            <div style={{ fontSize: 20, letterSpacing: 2, color: 'rgba(34,29,24,.55)', marginTop: 6 }}>
              NO. HK202610-00386
            </div>
          </div>

          <div style={{ position: 'absolute', left: 50, right: 50, top: 180 }}>
            {ENTRIES.map((e, i) => {
              const st = 1.3 + i * 0.62;
              const pin = outExpo(seg(t, st, st + 0.4));
              const head = seg(t, st, st + 0.44);
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    height: 92,
                    alignItems: 'center',
                    borderBottom: '1px dashed rgba(34,29,24,.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: clamp01(seg(t, st, st + 0.16)),
                    background: `linear-gradient(90deg, rgba(245,190,85,${(
                      0.3 * Math.max(0, 1 - head * 2)
                    ).toFixed(3)}) ${(head * 100).toFixed(1)}%, transparent ${(head * 100).toFixed(1)}%)`,
                  }}
                >
                  <div
                    style={{
                      width: 104,
                      fontSize: 22,
                      color: 'rgba(34,29,24,.65)',
                      flex: 'none',
                      opacity: pin,
                    }}
                  >
                    {e.d}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontSize: 22,
                      color: '#221D18',
                      letterSpacing: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      opacity: pin,
                    }}
                  >
                    {e.k}
                  </div>
                  <div
                    style={{
                      fontSize: 30,
                      color: '#221D18',
                      fontWeight: 700,
                      flex: 'none',
                      fontFamily: '"Oswald","Bahnschrift","Arial Narrow",sans-serif',
                    }}
                  >
                    {e.v}
                  </div>
                </div>
              );
            })}
            {/* 合计行 */}
            <div
              style={{
                display: 'flex',
                height: 110,
                alignItems: 'center',
                borderTop: '2px solid rgba(34,29,24,.5)',
                opacity: clamp01(sm),
                transform: `scale(${lerp(0.96, 1, outBack(sm, 1.4)).toFixed(3)})`,
                transformOrigin: '50% 100%',
              }}
            >
              <div style={{ width: 56, fontSize: 22, color: 'rgba(34,29,24,.65)', flex: 'none' }}>合计</div>
              <div style={{ flex: 1, fontSize: 22, color: '#221D18', fontWeight: 700, letterSpacing: 1 }}>
                十月承保保费
              </div>
              <GoldText theme={T} size={38} font="num" weight={700} lineHeight={48}>
                {fmtNum(p.premium, hasDec)} 万
              </GoldText>
            </div>
          </div>
        </div>

        {/* 书脊 */}
        <div
          style={{
            position: 'absolute',
            left: 430,
            top: 0,
            width: 20,
            height: '100%',
            background:
              'linear-gradient(90deg,rgba(192,126,28,.12),rgba(0,0,0,.22),rgba(192,126,28,.12))',
          }}
        />
      </div>

      {/* 收尾 */}
      <Txt
        size={46}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={8}
        lineHeight={62}
        style={{
          position: 'absolute',
          top: 1400,
          width: 1080,
          textAlign: 'center',
          opacity: en,
          transform: `translateY(${((1 - en) * 22).toFixed(1)}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={24}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 1472,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 5.9, 6.3)),
        }}
      >
        {p.role} · 存折由团队荣誉银行签发
      </Txt>
      <QrBlock
        theme={T}
        left={465}
        top={1536}
        size={150}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.15, 6.35)),
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
          top: 1700,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.45, 6.8)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={1.00} vol={0.3} />
    </Stage>
  );
};
