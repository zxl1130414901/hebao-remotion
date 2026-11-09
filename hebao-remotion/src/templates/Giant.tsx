import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { PhotoCard } from '../components/PhotoCard';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import {
  clamp01,
  fmtNum,
  lerp,
  outBack,
  outExpo,
  rgba,
  seg,
} from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 01 · 巨字宣言版
 * 叙事：四字宣言砸落 → 核心保费大数字 → 三项数据 → 人物 → 定版
 * 时间轴与 HTML 版逐帧对齐（可直接对照 template-giant.html 的 render）
 */
export const Giant: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const chars = Array.from(p.slogan || '捷报频传');
  const twoLine = chars.length <= 4;
  const line1 = chars.slice(0, 2);
  const line2 = chars.slice(2, 4);
  const oneLineSize = chars.length <= 6 ? 170 : 120;

  const hasDec = p.premium % 1 !== 0;
  const digits = String(p.premium.toFixed(hasDec ? 1 : 0)).replace('.', '').length;
  const numSize = digits <= 4 ? 280 : digits === 5 ? 242 : 206;

  /* 首屏逐字入场：行列交错的节奏 */
  const charStyle = (i: number): React.CSSProperties => {
    const st = 0.18 + (i % 2) * 0.22 + Math.floor(i / 2) * 0.3;
    const prog = seg(t, st, st + 0.34);
    const e = outBack(prog, 2.2);
    return {
      opacity: clamp01(prog * 2.4),
      transform: `scale(${lerp(1.5, 1, e)}) translateY(${(1 - outExpo(prog)) * 60}px)`,
    };
  };

  const dlabelP = outExpo(seg(t, 2.2, 2.44));
  const deltaP = outExpo(seg(t, 3.14, 3.4));
  const nameP = outExpo(seg(t, 5.28, 5.6));
  const roleP = outExpo(seg(t, 5.48, 5.76));
  const pillP = outBack(seg(t, 5.7, 6.02), 1.5);
  const endTitleP = outExpo(seg(t, 6.76, 7.24));
  const endSubP = outExpo(seg(t, 7.1, 7.38));
  const endLineP = outExpo(seg(t, 7.22, 7.5));
  const qrP = outBack(seg(t, 7.3, 7.64), 1.5);
  const qrCapP = outExpo(seg(t, 7.44, 7.7));
  const dateP = outExpo(seg(t, 7.58, 7.84));
  const noteP = outExpo(seg(t, 7.7, 7.96));

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 巨字宣言 */}
      <Chapter t={t} in={[0.1, 0.44]} out={[2.0, 2.3]}>
        <Txt
          size={26}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={14}
          style={{ position: 'absolute', top: 430, width: 1080, textAlign: 'center' }}
        >
          GOOD　NEWS　EXPRESS
        </Txt>

        <div
          style={{
            position: 'absolute',
            top: twoLine ? 510 : 640,
            width: 1080,
            textAlign: 'center',
          }}
        >
          {twoLine ? (
            <>
              <div style={{ lineHeight: '290px', whiteSpace: 'nowrap' }}>
                {line1.map((c, i) => (
                  <GoldText
                    key={i}
                    theme={T}
                    size={250}
                    lineHeight={290}
                    style={{ width: 420, ...charStyle(i) }}
                  >
                    {c}
                  </GoldText>
                ))}
              </div>
              <div style={{ lineHeight: '290px', whiteSpace: 'nowrap', marginTop: -30 }}>
                {line2.map((c, i) => (
                  <GoldText
                    key={i}
                    theme={T}
                    size={250}
                    lineHeight={290}
                    style={{ width: 420, ...charStyle(i + 2) }}
                  >
                    {c}
                  </GoldText>
                ))}
              </div>
            </>
          ) : (
            <div style={{ lineHeight: '300px', whiteSpace: 'nowrap' }}>
              {chars.map((c, i) => (
                <GoldText
                  key={i}
                  theme={T}
                  size={oneLineSize}
                  lineHeight={300}
                  style={{ padding: '0 18px', ...charStyle(i) }}
                >
                  {c}
                </GoldText>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 290,
            top: 1190,
            width: 500,
            height: 1,
            background: `linear-gradient(90deg,${rgba(T.pale, 0)},${rgba(T.pale, 0.6)},${rgba(
              T.pale,
              0
            )})`,
            transform: `scaleX(${outExpo(seg(t, 1.3, 1.66))})`,
            transformOrigin: '50% 50%',
          }}
        />
      </Chapter>

      {/* 02 核心大数字 */}
      <Chapter t={t} in={[2.14, 2.46]} out={[3.54, 3.84]}>
        <Txt
          size={34}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={6}
          style={{
            position: 'absolute',
            top: 560,
            width: 1080,
            textAlign: 'center',
            opacity: dlabelP,
            transform: `translateY(${(1 - dlabelP) * 18}px)`,
          }}
        >
          {p.dlabel}
        </Txt>

        <div
          style={{
            position: 'absolute',
            top: 648,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            gap: 18,
            opacity: outExpo(seg(t, 2.32, 2.58)),
          }}
        >
          <GoldText
            theme={T}
            size={numSize}
            font="num"
            weight={700}
            lineHeight={Math.round(numSize * 1.1)}
            letterSpacing={-4}
          >
            {fmtNum(p.premium * outExpo(seg(t, 2.26, 3.34)), hasDec)}
          </GoldText>
          <Txt size={54} color={rgba(T.soft, 0.92)} weight={300} letterSpacing={2} lineHeight={76}>
            万元
          </Txt>
        </div>

        <Txt
          size={29}
          color={rgba(T.soft, 0.85)}
          letterSpacing={4}
          style={{
            position: 'absolute',
            top: 1040,
            width: 1080,
            textAlign: 'center',
            opacity: deltaP,
            transform: `translateY(${(1 - deltaP) * 18}px)`,
          }}
        >
          {p.delta}
        </Txt>
      </Chapter>

      {/* 03 三项数据 */}
      <Chapter t={t} in={[3.68, 4.0]} out={[5.06, 5.36]}>
        <div
          style={{
            position: 'absolute',
            top: 600,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {p.stats.slice(0, 3).map((st, i) => {
            const t0 = 3.8 + i * 0.18;
            const e = outExpo(seg(t, t0, t0 + 0.32));
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div
                    style={{
                      width: 1,
                      height: 190,
                      marginTop: 10,
                      background: `linear-gradient(180deg,${rgba(T.line, 0)},${rgba(
                        T.line,
                        0.55
                      )},${rgba(T.line, 0)})`,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 300,
                    textAlign: 'center',
                    opacity: e,
                    transform: `translateY(${(1 - e) * 36}px)`,
                  }}
                >
                  <GoldText theme={T} size={88} font="num" weight={700} lineHeight={126}>
                    {st.v}
                  </GoldText>
                  <Txt
                    size={29}
                    color={rgba(T.mist, 1)}
                    weight={300}
                    letterSpacing={5}
                    lineHeight={41}
                    style={{ marginTop: 16 }}
                  >
                    {st.k}
                  </Txt>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Chapter>

      {/* 04 人物 */}
      <Chapter t={t} in={[5.2, 5.52]} out={[6.54, 6.84]}>
        <PhotoCard theme={T} src={p.photo} left={400} top={180} width={280} height={360} />
        <Txt
          size={110}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={16}
          lineHeight={150}
          style={{
            position: 'absolute',
            top: 560,
            width: 1080,
            textAlign: 'center',
            opacity: nameP,
            transform: `translateY(${(1 - nameP) * 32}px)`,
          }}
        >
          {p.name}
        </Txt>
        <Txt
          size={32}
          color={rgba(T.soft, 0.88)}
          weight={300}
          letterSpacing={6}
          lineHeight={45}
          style={{
            position: 'absolute',
            top: 760,
            width: 1080,
            textAlign: 'center',
            opacity: roleP,
            transform: `translateY(${(1 - roleP) * 20}px)`,
          }}
        >
          {p.role}
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: 872,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            opacity: clamp01(seg(t, 5.7, 5.88)),
          }}
        >
          <div
            style={{
              minWidth: 400,
              height: 74,
              borderRadius: 37,
              padding: '0 44px',
              border: `1px solid ${rgba(T.line, 0.5)}`,
              background: rgba(T.line, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              transform: `scale(${lerp(0.9, 1, pillP)})`,
            }}
          >
            <Txt size={27} color={T.bright} weight={500} letterSpacing={3} lineHeight={38}>
              {p.pill}
            </Txt>
          </div>
        </div>
      </Chapter>

      {/* 05 定版 */}
      <Chapter t={t} in={[6.68, 7.02]}>
        <GoldText
          theme={T}
          size={150}
          weight={700}
          letterSpacing={30}
          lineHeight={200}
          style={{
            position: 'absolute',
            top: 520,
            width: 1080,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: endTitleP,
            transform: `translateY(${(1 - endTitleP) * 40}px)`,
          }}
        >
          {p.slogan2}
        </GoldText>

        <Txt
          size={38}
          color={T.cream2}
          weight={300}
          font="serif"
          letterSpacing={6}
          lineHeight={53}
          style={{
            position: 'absolute',
            top: 790,
            width: 1080,
            textAlign: 'center',
            opacity: endSubP,
            transform: `translateY(${(1 - endSubP) * 22}px)`,
          }}
        >
          {p.endsub}
        </Txt>

        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 890,
            width: 120,
            height: 1,
            background: rgba(T.line, 0.6),
            transform: `translateX(-60px) scaleX(${endLineP})`,
          }}
        />

        <QrBlock
          theme={T}
          left={430}
          top={970}
          src={p.qr}
          style={{
            opacity: clamp01(seg(t, 7.3, 7.46)),
            transform: `scale(${lerp(0.86, 1, qrP)})`,
          }}
        />

        <Txt
          size={32}
          color={rgba(T.soft, 0.9)}
          weight={500}
          letterSpacing={6}
          lineHeight={45}
          style={{
            position: 'absolute',
            top: 1234,
            width: 1080,
            textAlign: 'center',
            opacity: qrCapP,
            transform: `translateY(${(1 - qrCapP) * 18}px)`,
          }}
        >
          {p.qrCap}
        </Txt>

        <Txt
          size={30}
          color={rgba(T.mist, 1)}
          weight={300}
          letterSpacing={8}
          lineHeight={42}
          style={{ position: 'absolute', top: 1568, width: 1080, textAlign: 'center', opacity: dateP }}
        >
          {p.dateText}
        </Txt>

        <Txt
          size={28}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={39}
          style={{ position: 'absolute', top: 1624, width: 1080, textAlign: 'center', opacity: noteP }}
        >
          {p.note}
        </Txt>
      </Chapter>
        <Sfx name="sfx_gong" at={5.90} vol={0.45} />
    </Stage>
  );
};
