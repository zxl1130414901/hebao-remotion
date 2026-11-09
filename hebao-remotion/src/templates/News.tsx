import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { NumRoll } from '../components/NumRoll';
import { Rule } from '../components/Rule';
import { PhotoCard } from '../components/PhotoCard';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 03 · 号外头条版
 * 叙事：报头压落（常驻）→ 头条大标题 → 核心数字 → 报纸条目×照片 → 报社落款
 * 特点：报头从头挂到尾，报纸排版语言。
 */
export const News: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const headline = p.headline || `${p.name}勇夺月冠`;
  const headsub = p.headsub || p.endsub;

  /* 头条标题自适应：单行限宽 880px（两侧各留 100px 呼吸）；更长则拆行，
     偶数长标题优先「前长后短」断句（如 10 字 → 6+4），避免两行完全等分拗口 */
  const hlLen = headline.length;
  const nLines = Math.max(1, Math.ceil(hlLen / 7));
  const hlLines: string[] = (() => {
    if (nLines === 1) return [headline];
    let first = Math.ceil(hlLen / nLines);
    if (hlLen >= 10 && hlLen % 2 === 0) first = hlLen / 2 + 1;
    const out: string[] = [];
    for (let i = 0; i < hlLen; i += first) out.push(headline.slice(i, i + first));
    return out;
  })();
  const hlSize =
    nLines === 1
      ? Math.min(132, Math.floor((880 - 20 * (hlLen - 1)) / hlLen))
      : nLines === 2
        ? 100
        : 76;
  const hlLH = Math.round(hlSize * (nLines === 1 ? 1.36 : 1.4));
  /* 标题块垂直中心恒定在 630px，行数变化时上下元素自动让位 */
  const hlTop = Math.round(630 - (nLines * hlLH) / 2);
  const subTop = Math.round(630 + (nLines * hlLH) / 2 + 44);
  const ruleTop = subTop + 112;

  const mastP = outExpo(seg(t, 0.06, 0.7));
  const heP = outExpo(seg(t, 0.76, 1.02));
  const hlP = outBack(seg(t, 0.9, 1.32), 1.7);
  const hsP = outExpo(seg(t, 1.24, 1.54));

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 报头（常驻，压落入场） */}
      <div
        style={{
          position: 'absolute',
          left: 170,
          top: 150,
          width: 740,
          height: 210,
          borderTop: `3px solid ${rgba(T.line, 0.75)}`,
          borderBottom: `3px solid ${rgba(T.line, 0.75)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 46,
          opacity: clamp01(seg(t, 0.06, 0.28)),
          transform: `translateY(${-360 * (1 - mastP)}px)`,
        }}
      >
        {/* 内衬细线 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 8,
            height: 1,
            background: rgba(T.line, 0.35),
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 8,
            height: 1,
            background: rgba(T.line, 0.35),
          }}
        />
        <GoldText theme={T} size={120} weight={700} letterSpacing={30} style={{ textIndent: 30 }}>
          号外
        </GoldText>
        <Txt
          size={24}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={34}
          style={{ position: 'absolute', left: 26, bottom: -44 }}
        >
          {p.dateText}
        </Txt>
        <Txt
          size={24}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={8}
          lineHeight={34}
          style={{ position: 'absolute', right: 26, bottom: -44 }}
        >
          EXTRA　·　GOOD　NEWS
        </Txt>
      </div>

      {/* 01 头条 */}
      <Chapter t={t} in={[0.72, 1.06]} out={[2.16, 2.46]}>
        <Txt
          size={26}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={16}
          lineHeight={36}
          style={{ position: 'absolute', top: 470, width: 1080, textAlign: 'center', opacity: heP }}
        >
          本 月 头 条 · TOP　STORY
        </Txt>
        <div
          style={{
            position: 'absolute',
            top: hlTop,
            width: 1080,
            textAlign: 'center',
            opacity: clamp01(seg(t, 0.9, 1.14)),
            transform: `scale(${lerp(1.24, 1, hlP)})`,
          }}
        >
          {hlLines.map((ln, i) => (
            <GoldText
              key={i}
              theme={T}
              size={hlSize}
              weight={700}
              letterSpacing={20}
              lineHeight={hlLH}
              font="serif"
            >
              {ln}
            </GoldText>
          ))}
        </div>
        <Txt
          size={35}
          color={T.cream2}
          weight={300}
          font="serif"
          letterSpacing={6}
          lineHeight={49}
          style={{
            position: 'absolute',
            top: subTop,
            left: 90,
            width: 900,
            textAlign: 'center',
            opacity: hsP,
            transform: `translateY(${(1 - hsP) * 20}px)`,
          }}
        >
          {headsub}
        </Txt>
        <Rule theme={T} t={t} start={1.46} dur={0.34} left={190} top={ruleTop} width={700} />
      </Chapter>

      {/* 02 正文数字 */}
      <Chapter t={t} in={[2.3, 2.62]} out={[3.7, 4.0]}>
        <Txt
          size={34}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={6}
          lineHeight={48}
          style={{
            position: 'absolute',
            top: 560,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.36, 2.6)),
            transform: `translateY(${(1 - outExpo(seg(t, 2.36, 2.6))) * 18}px)`,
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
            opacity: outExpo(seg(t, 2.48, 2.74)),
          }}
        >
          <NumRoll
            theme={T}
            target={p.premium}
            t={t}
            start={2.42}
            dur={1.08}
            size={272}
            lineHeight={302}
            unit="万元"
            unitSize={54}
            unitColor={rgba(T.soft, 0.92)}
          />
        </div>
        <Txt
          size={29}
          color={rgba(T.soft, 0.85)}
          letterSpacing={4}
          lineHeight={41}
          style={{
            position: 'absolute',
            top: 1026,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.3, 3.56)),
            transform: `translateY(${(1 - outExpo(seg(t, 3.3, 3.56))) * 18}px)`,
          }}
        >
          {p.delta}
        </Txt>
      </Chapter>

      {/* 03 人物肖像 + 报纸条目：照片居中置顶（配图注），数据行全宽铺在下方 */}
      <Chapter t={t} in={[3.84, 4.16]} out={[5.22, 5.52]}>
        <div style={{ position: 'absolute', left: 0, top: 440, width: 1080 }}>
          {/* 照片：居中大图 + 双层金框 + 顶部高光角标，报纸人物特写 */}
          {(() => {
            const ph = outExpo(seg(t, 3.9, 4.26));
            return (
              <div
                style={{
                  position: 'absolute',
                  left: 390,
                  top: 20 + (1 - ph) * 34,
                  width: 300,
                  height: 372,
                  opacity: ph,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: -14,
                    border: `1px solid ${rgba(T.line, 0.55)}`,
                    borderRadius: 12,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: -22,
                    border: `1px solid ${rgba(T.line, 0.28)}`,
                    borderRadius: 16,
                  }}
                />
                <PhotoCard theme={T} src={p.photo} left={0} top={0} width={300} height={372} />
              </div>
            );
          })()}
          {/* 图注：报纸照片下的说明行 */}
          <Txt
            size={27}
            color={rgba(T.soft, 0.85)}
            weight={300}
            letterSpacing={7}
            lineHeight={38}
            style={{
              position: 'absolute',
              top: 424,
              width: 1080,
              textAlign: 'center',
              opacity: outExpo(seg(t, 4.04, 4.34)),
              transform: `translateY(${(1 - outExpo(seg(t, 4.04, 4.34))) * 14}px)`,
            }}
          >
            {p.role ? `${p.name} · ${p.role}` : p.name}
          </Txt>
          {/* 数据行：全宽 820px，行距 150，与照片区完全分离 */}
          {p.stats.slice(0, 3).map((st, i) => {
            const st0 = 4.34 + i * 0.28;
            const e = outExpo(seg(t, st0, st0 + 0.36));
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 130,
                  top: 524 + i * 150,
                  width: 820,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderBottom: `1px solid ${rgba(T.line, 0.28)}`,
                  paddingBottom: 22,
                  opacity: e,
                  transform: `translateY(${(1 - e) * 30}px)`,
                }}
              >
                <Txt
                  size={33}
                  color={rgba(T.mist, 1)}
                  weight={300}
                  letterSpacing={8}
                  lineHeight={48}
                >
                  {st.k}
                </Txt>
                <GoldText theme={T} size={66} font="num" weight={700} lineHeight={80}>
                  {st.v}
                </GoldText>
              </div>
            );
          })}
        </div>
      </Chapter>

      {/* 04 报社落款 */}
      <Chapter t={t} in={[5.9, 6.24]}>
        <div
          style={{
            position: 'absolute',
            top: 640,
            width: 1080,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 18,
            opacity: clamp01(seg(t, 5.96, 6.16)),
            transform: `translateY(${(1 - outBack(seg(t, 5.96, 6.3), 1.6)) * -14}px)`,
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              border: `1.5px solid ${rgba(T.line, 0.75)}`,
              background: rgba(T.line, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Txt size={30} color={T.bright} weight={600} font="serif">
              {p.sealChar || '泰'}
            </Txt>
          </div>
          <Txt size={31} color={rgba(T.mist, 1)} weight={300} letterSpacing={6} lineHeight={43}>
            {p.company || '泰康养老保险股份有限公司'}
          </Txt>
        </div>
        <Txt
          size={30}
          color={rgba(T.soft, 0.85)}
          weight={300}
          font="serif"
          letterSpacing={5}
          lineHeight={42}
          style={{
            position: 'absolute',
            top: 770,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 6.14, 6.44)),
            transform: `translateY(${(1 - outExpo(seg(t, 6.14, 6.44))) * 20}px)`,
          }}
        >
          {p.quote || '见证每一步 · 记录每一分'}
        </Txt>
        <QrBlock
          theme={T}
          left={430}
          top={900}
          src={p.qr}
          style={{
            opacity: clamp01(seg(t, 6.4, 6.56)),
            transform: `scale(${lerp(0.86, 1, outBack(seg(t, 6.4, 6.74), 1.5))})`,
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
            top: 1160,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 6.54, 6.8)),
            transform: `translateY(${(1 - outExpo(seg(t, 6.54, 6.8))) * 18}px)`,
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
          style={{ position: 'absolute', top: 1568, width: 1080, textAlign: 'center', opacity: outExpo(seg(t, 6.7, 6.98)) }}
        >
          {p.dateText}
        </Txt>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={4}
          lineHeight={36}
          style={{ position: 'absolute', top: 1624, width: 1080, textAlign: 'center', opacity: outExpo(seg(t, 6.84, 7.1)) }}
        >
          {p.note}
        </Txt>
      </Chapter>
        <Sfx name="sfx_pop" at={3.12} vol={0.28} />
    </Stage>
  );
};
