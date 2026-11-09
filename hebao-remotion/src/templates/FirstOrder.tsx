import { PAPER_URL, StampInk, GoldBurst } from '../components/textures';
import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { PersonChapter } from '../components/PersonChapter';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 61 · 首单破冰版
 * 叙事：空白保单 → 笔迹签下 → 破冰红章 → 「第 1 单」 → 新人 → 定版
 * 与旧模板的根本差异：主角不是金额，而是「从 0 到 1」这件事本身。
 */
export const FirstOrder: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const sign = outExpo(seg(t, 0.86, 1.62));
  const stamp = outBack(seg(t, 1.56, 1.86), 2.1);
  const paperIn = outExpo(seg(t, 0.1, 0.52));

  const facts = [
    { k: '首位客户', v: '张女士' },
    { k: '首次拜访到成交', v: '9 天' },
    { k: '面谈次数', v: '3 次' },
  ];

  return (
    <Stage theme={T} brand={p.brand} bottomtag="MY FIRST　·　DAY ONE">
      {/* 01 空白保单 → 签名 → 破冰章 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[2.02, 2.3]}>
        <Sfx name="sfx_stamp" at={1.78} vol={0.5} />
        {/* 盖章定音金花（章心约在纸面右下 840,1032） */}
        <GoldBurst theme={T} t={t} t0={1.56} cx={840} cy={1032} spread={150} count={16} />
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={11}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 440,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.1, 0.4)),
          }}
        >
          POLICY　NO.　0001
        </Txt>

        {/* 保单纸面 */}
        <div
          style={{
            position: 'absolute',
            left: 118,
            top: 520,
            width: 844,
            height: 640,
            borderRadius: 6,
            background: `linear-gradient(168deg, ${rgba(T.pale, 0.97)} 0%, ${rgba(hexRgb(T.cream), 0.9)} 58%, ${rgba(T.warm, 0.86)} 100%)`,
            boxShadow: `0 30px 70px rgba(0,0,0,0.36), inset 0 0 0 1px ${rgba(T.line, 0.5)}`,
            opacity: paperIn,
            transform: `translateY(${(1 - paperIn) * 40}px) rotate(${(1 - paperIn) * -3}deg)`,
          }}
        >
          {/* 纸张纤维纹理 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              backgroundImage: PAPER_URL,
              opacity: 0.42,
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }}
          />
          {/* 内框 */}
          <div
            style={{
              position: 'absolute',
              inset: 18,
              border: `1px solid ${rgba(hexRgb(T.goldD), 0.42)}`,
            }}
          />
          {/* 抬头 */}
          <Txt
            size={30}
            color={rgba(T.archbg, 0.86)}
            weight={600}
            font="serif"
            letterSpacing={8}
            lineHeight={42}
            style={{ position: 'absolute', left: 46, top: 42 }}
          >
            人身保险合同 · 首期保费收讫
          </Txt>
          {/* 字段行 */}
          {[
            ['投保人', '张 女 士'],
            ['险　　种', '年金保险（分红型）'],
            ['首期保费', '¥ 12,800.00'],
            ['生效日期', p.dateText || '2026 年 10 月 08 日'],
          ].map(([k, v], i) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: 46,
                top: 132 + i * 72,
                width: 620,
                display: 'flex',
                alignItems: 'baseline',
                opacity: outExpo(seg(t, 0.24 + i * 0.11, 0.54 + i * 0.11)),
              }}
            >
              <Txt size={25} color={rgba(T.archbg, 0.85)} letterSpacing={4} lineHeight={36}>
                {k}
              </Txt>
              <div
                style={{
                  flex: 1,
                  marginLeft: 22,
                  borderBottom: `1px solid ${rgba(T.archbg, 0.3)}`,
                  paddingBottom: 4,
                }}
              >
                <Txt size={27} color={rgba(T.archbg, 0.92)} weight={600} letterSpacing={2} lineHeight={38}>
                  {v}
                </Txt>
              </div>
            </div>
          ))}

          {/* 签名：一笔写成的弧线，从 0 写到 1 */}
          <svg
            width={420}
            height={160}
            viewBox="0 0 420 160"
            style={{ position: 'absolute', left: 52, bottom: 44, overflow: 'visible' }}
          >
            <path
              d="M8 122 C 46 42, 70 34, 88 78 C 102 116, 116 118, 132 82 C 148 44, 168 40, 178 84 C 188 124, 206 120, 222 74 C 236 36, 258 44, 262 96 C 264 128, 286 118, 300 84 C 316 46, 340 44, 352 88 C 362 122, 382 116, 404 66"
              fill="none"
              stroke={rgba(T.archbg, 0.9)}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={1}
              pathLength={1}
              strokeDashoffset={1 - sign}
              style={{ filter: `drop-shadow(0 1px 0 ${rgba(gold, 0.35)})` }}
            />
            {sign > 0.05 && (
              <circle cx={404} cy={66} r={3.4} fill={rgba(T.archbg, sign)} />
            )}
          </svg>
          <Txt
            size={22}
            color={rgba(T.archbg, 0.85)}
            letterSpacing={6}
            lineHeight={28}
            style={{
              position: 'absolute',
              left: 54,
              bottom: 22,
              opacity: sign > 0.9 ? 1 : 0,
            }}
          >
            投保人亲笔签署
          </Txt>

          {/* 破冰红章 */}
          <div
            style={{
              position: 'absolute',
              right: 34,
              bottom: 40,
              width: 176,
              height: 176,
              borderRadius: '50%',
              border: `5px solid ${rgba(hexRgb(T.bg[1]), 0.72)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(-13deg) scale(${stamp})`,
              opacity: clamp01(stamp * 1.6),
              boxShadow: `0 0 0 3px ${rgba(T.bg[1], 0.18)}`,
            }}
          >
            {/* 印油斑驳 + 纸面凹痕 */}
            <StampInk color="rgba(140,20,20,0.9)" opacity={0.55} />
            <div style={{ textAlign: 'center' }}>
              <Txt
                size={44}
                color={rgba(hexRgb(T.bg[1]), 0.9)}
                weight={700}
                font="serif"
                letterSpacing={3}
                lineHeight={54}
              >
                破冰
              </Txt>
              <Txt
                size={18}
                color={rgba(hexRgb(T.bg[1]), 0.72)}
                letterSpacing={3}
                lineHeight={24}
                style={{ marginTop: 2 }}
              >
                FIRST　DEAL
              </Txt>
            </div>
          </div>
        </div>
      </Chapter>

      {/* 02 「第 1 单」 */}
      <Chapter t={t} in={[2.14, 2.44]} out={[4.02, 4.3]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={14}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 480,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.2, 2.5)),
          }}
        >
          {p.ribbon || '第 1 单'}
        </Txt>
        <div style={{ position: 'absolute', left: 0, top: 530, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={300}
            weight={700}
            font="num"
            lineHeight={330}
            letterSpacing={-6}
            style={{
              opacity: outExpo(seg(t, 2.16, 2.46)),
              transform: `scale(${lerp(1.22, 1, outBack(seg(t, 2.16, 2.62), 1.7))})`,
              filter: `drop-shadow(0 14px 40px ${rgba(gold, 0.28)})`,
            }}
          >
            {p.hero || '01'}
          </GoldText>
        </div>
        <Txt
          size={34}
          color={rgba(cream, 0.86)}
          font="serif"
          letterSpacing={9}
          lineHeight={48}
          style={{
            position: 'absolute',
            left: 0,
            top: 890,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.34, 2.66)),
          }}
        >
          {p.subValue || '从 0 到 1 · 迈出第一步'}
        </Txt>

        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 1010,
            width: 820,
            height: 1,
            background: `linear-gradient(90deg,${rgba(T.line, 0)},${rgba(T.line, 0.55)},${rgba(T.line, 0)})`,
            opacity: outExpo(seg(t, 2.5, 2.9)),
          }}
        />

        {facts.map((f, i) => {
          const s0 = 2.58 + i * 0.2;
          const e = outExpo(seg(t, s0, s0 + 0.36));
          return (
            <div
              key={f.k}
              style={{
                position: 'absolute',
                left: 130,
                top: 1080 + i * 130,
                width: 820,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                opacity: e,
                transform: `translateY(${(1 - e) * 26}px)`,
              }}
            >
              <Txt size={31} color={rgba(T.mist, 0.85)} weight={300} letterSpacing={6} lineHeight={44}>
                {f.k}
              </Txt>
              <Txt size={44} color={T.bright} weight={600} font="serif" letterSpacing={3} lineHeight={58}>
                {f.v}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.16, 4.46]} out={[5.86, 6.14]} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.16, 6.5]}>
        <EndCard theme={T} t={t} start={6.22} p={p} />
      </Chapter>
    </Stage>
  );
};
