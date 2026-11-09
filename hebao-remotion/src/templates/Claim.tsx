import { PAPER_URL, StampInk } from '../components/textures';
import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

const STEPS = [
  { k: '报案受理', d: '10.08', note: '当天立案' },
  { k: '资料审核', d: '10.10', note: '一次通过' },
  { k: '赔款到账', d: '10.11', note: '短信通知' },
];

/**
 * 71 · 理赔送达版
 * 叙事：理赔结案书 → 赔付金额 → 三天三节点 → 客户一句话 → 定版
 * 与旧模板差异：不是业绩喜报，而是服务通报 —— 讲「赔了多少、多快到」，用于客户经营。
 */
export const Claim: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const paperIn = outExpo(seg(t, 0.1, 0.52));
  const stampP = outBack(seg(t, 1.5, 1.84), 2.4);

  return (
    <Stage theme={T} brand={p.brand} bottomtag="CLAIM　SETTLED">
      {/* 01 结案书 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[2.94, 3.22]}>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={11}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 330,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          CLAIM　NO.　2026-1008-0357
        </Txt>
        <Txt
          size={54}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={12}
          lineHeight={74}
          style={{
            position: 'absolute',
            left: 0,
            top: 380,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.14, 0.44)),
          }}
        >
          {p.slogan || '我们已经赔付'}
        </Txt>

        <div
          style={{
            position: 'absolute',
            left: 112,
            top: 500,
            width: 856,
            height: 620,
            borderRadius: 8,
            background: `linear-gradient(166deg, ${rgba(T.pale, 0.98)} 0%, ${rgba(hexRgb(T.cream), 0.94)} 60%, ${rgba(T.warm, 0.9)} 100%)`,
            boxShadow: `0 30px 72px rgba(0,0,0,0.38), inset 0 0 0 1px ${rgba(T.line, 0.5)}`,
            opacity: paperIn,
            transform: `translateY(${(1 - paperIn) * 42}px)`,
          }}
        >
          {/* 纸张纤维纹理 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 8,
              backgroundImage: PAPER_URL,
              opacity: 0.42,
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{ position: 'absolute', inset: 18, border: `1px solid ${rgba(hexRgb(T.goldD), 0.4)}` }}
          />
          <Txt
            size={34}
            color={rgba(T.archbg, 0.9)}
            weight={700}
            font="serif"
            letterSpacing={10}
            lineHeight={46}
            style={{ position: 'absolute', left: 0, top: 44, width: 856, textAlign: 'center' }}
          >
            理赔结案通知书
          </Txt>
          <div
            style={{
              position: 'absolute',
              left: 60,
              right: 60,
              top: 112,
              height: 1,
              background: rgba(T.archbg, 0.22),
            }}
          />

          {[
            ['被保险人', '张 建 国'],
            ['事故类型', '意外住院医疗'],
            ['险　　种', '泰康健康无忧 · 百万医疗'],
          ].map(([k, v], i) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: 62,
                top: 138 + i * 62,
                width: 720,
                display: 'flex',
                alignItems: 'baseline',
                opacity: outExpo(seg(t, 0.24 + i * 0.1, 0.54 + i * 0.1)),
              }}
            >
              <Txt size={24} color={rgba(T.archbg, 0.85)} letterSpacing={5} lineHeight={34}>
                {k}
              </Txt>
              <Txt
                size={27}
                color={rgba(T.archbg, 0.9)}
                weight={600}
                letterSpacing={2}
                lineHeight={38}
                style={{ marginLeft: 26 }}
              >
                {v}
              </Txt>
            </div>
          ))}

          {/* 赔付金额 */}
          <div
            style={{
              position: 'absolute',
              left: 62,
              top: 348,
              opacity: outExpo(seg(t, 0.78, 1.12)),
              transform: `translateY(${(1 - outExpo(seg(t, 0.78, 1.16))) * 22}px)`,
            }}
          >
            <Txt size={24} color={rgba(T.archbg, 0.85)} letterSpacing={6} lineHeight={34}>
              赔 付 金 额
            </Txt>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <Txt size={46} color={rgba(hexRgb(T.bg[1]), 0.85)} weight={700} font="num" lineHeight={60}>
                ¥
              </Txt>
              <Txt
                size={104}
                color={rgba(hexRgb(T.bg[1]), 0.95)}
                weight={700}
                font="num"
                letterSpacing={-2}
                lineHeight={124}
              >
                286,000
              </Txt>
            </div>
          </div>

          {/* 结案章 */}
          <div
            style={{
              position: 'absolute',
              right: 44,
              bottom: 42,
              width: 190,
              height: 190,
              borderRadius: '50%',
              border: `5px solid ${rgba(hexRgb(T.bg[1]), 0.7)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(-14deg) scale(${stampP})`,
              opacity: Math.min(1, stampP * 1.5),
              boxShadow: `0 0 0 3px ${rgba(T.bg[1], 0.16)}`,
            }}
          >
            {/* 印油斑驳 + 纸面凹痕 */}
            <StampInk color="rgba(140,20,20,0.9)" opacity={0.55} />
            <div style={{ textAlign: 'center' }}>
              <Txt
                size={40}
                color={rgba(hexRgb(T.bg[1]), 0.9)}
                weight={700}
                font="serif"
                letterSpacing={2}
                lineHeight={52}
              >
                已结案
              </Txt>
              <Txt
                size={17}
                color={rgba(hexRgb(T.bg[1]), 0.72)}
                letterSpacing={2}
                lineHeight={22}
                style={{ marginTop: 4 }}
              >
                SETTLED
              </Txt>
            </div>
          </div>
        </div>
      </Chapter>

      {/* 02 三天结案 */}
      <Chapter t={t} in={[3.04, 3.34]} out={[5.1, 5.38]}>
        <Sfx name="sfx_stamp" at={3.33} vol={0.45} />
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={13}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 372,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.12, 3.42)),
          }}
        >
          从 报 案 到 到 账
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 418,
            width: 1080,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <GoldText
            theme={T}
            size={218}
            weight={700}
            font="num"
            lineHeight={252}
            style={{
              opacity: outExpo(seg(t, 3.04, 3.36)),
              transform: `scale(${lerp(1.16, 1, outBack(seg(t, 3.04, 3.46), 1.9))})`,
            }}
          >
            3
          </GoldText>
          <Txt size={62} color={rgba(cream, 0.9)} weight={500} font="serif" letterSpacing={6} lineHeight={82}>
            天到账
          </Txt>
        </div>

        {/* 三节点 */}
        {STEPS.map((s, i) => {
          const s0 = 3.4 + i * 0.26;
          const e = outExpo(seg(t, s0, s0 + 0.38));
          return (
            <div
              key={s.k}
              style={{
                position: 'absolute',
                left: 118 + i * 292,
                top: 760,
                width: 260,
                opacity: e,
                transform: `translateY(${(1 - e) * 28}px)`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: `1.5px solid ${rgba(gold, 0.8)}`,
                  background: rgba(gold, 0.16),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width={26} height={26} viewBox="0 0 26 26">
                  <path
                    d="M5 14 L11 20 L21 6"
                    fill="none"
                    stroke={T.goldB}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <Txt
                size={30}
                color={rgba(cream, 0.9)}
                weight={600}
                font="serif"
                letterSpacing={3}
                lineHeight={42}
                style={{ marginTop: 18 }}
              >
                {s.k}
              </Txt>
              <Txt size={24} color={rgba(gold, 0.8)} font="num" letterSpacing={2} lineHeight={34}>
                {s.d}
              </Txt>
              <Txt size={22} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={2} lineHeight={32}>
                {s.note}
              </Txt>
              {i < 2 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 68,
                    top: 27,
                    width: 212,
                    height: 1,
                    background: `linear-gradient(90deg, ${rgba(gold, 0.55)}, ${rgba(gold, 0.1)})`,
                  }}
                />
              )}
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: 118,
            top: 1080,
            width: 844,
            padding: '30px 36px',
            borderRadius: 14,
            background: rgba(T.mask, 0.5),
            border: `1px solid ${rgba(T.line, 0.26)}`,
            opacity: outExpo(seg(t, 4.1, 4.44)),
          }}
        >
          <Txt size={26} color={rgba(cream, 0.86)} weight={300} letterSpacing={3} lineHeight={42}>
            「本来以为要跑好几趟，结果一次就办完了。
            <br />
            　 钱到账那天，我给我爱人说：还好当初买了。」
          </Txt>
          <Txt
            size={22}
            color={rgba(T.mist, 0.85)}
            letterSpacing={3}
            lineHeight={32}
            style={{ marginTop: 16 }}
          >
            —— 张建国 家属 · 客户 4 年
          </Txt>
        </div>
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.32, 5.68]}>
        <EndCard theme={T} t={t} start={5.38} p={p} />
      </Chapter>
    </Stage>
  );
};
