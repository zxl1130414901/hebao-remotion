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

/** 气泡纵向预排（绝对定位，避免流式布局在逐帧渲染里抖动） */
const TOPS = [368, 508, 648, 788, 928, 1068];

/**
 * 72 · 客户见证版
 * 叙事：手机里六条真实对话依次弹出 → 这些对话换来了什么 → 定版
 * 与旧模板差异：主体是「客户说的话」（微信长截图语感），不是自己的战报。
 */
export const ClientVoice: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const bubbles = (p.bubbles ?? []).slice(0, 6);

  return (
    <Stage theme={T} brand={p.brand} bottomtag="CUSTOMER　VOICES">
      {/* 01 对话 */}
      <Chapter t={t} in={[0.04, 0.32]} out={[2.72, 3.0]}>
        <Txt
          size={52}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={14}
          lineHeight={72}
          style={{
            position: 'absolute',
            left: 0,
            top: 168,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          {p.slogan || '客户说'}
        </Txt>
        <Txt
          size={23}
          color={rgba(T.mist, 0.85)}
          letterSpacing={9}
          lineHeight={33}
          style={{
            position: 'absolute',
            left: 0,
            top: 244,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.18, 0.48)),
          }}
        >
          这 些 话　我 一 条 都 没 删
        </Txt>

        {/* 聊天面板 */}
        <div
          style={{
            position: 'absolute',
            left: 76,
            top: 300,
            width: 928,
            height: 940,
            borderRadius: 34,
            background: rgba(T.mask, 0.5),
            border: `1px solid ${rgba(T.line, 0.24)}`,
            boxShadow: `0 24px 60px rgba(0,0,0,0.32)`,
            overflow: 'hidden',
            opacity: outExpo(seg(t, 0.2, 0.5)),
          }}
        >
          <div
            style={{
              height: 84,
              borderBottom: `1px solid ${rgba(T.line, 0.14)}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 30px',
            }}
          >
            <Txt size={26} color={rgba(cream, 0.82)} weight={600} letterSpacing={3} lineHeight={36}>
              客户消息
            </Txt>
            <Txt
              size={22}
              color={rgba(T.mist, 0.85)}
              letterSpacing={3}
              lineHeight={28}
              style={{ marginLeft: 'auto' }}
            >
              共 6 条
            </Txt>
          </div>

          {bubbles.map((b, i) => {
            const s0 = 0.34 + i * 0.31;
            const e = outExpo(seg(t, s0, s0 + 0.34));
            const mine = b.side === 'r';
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: TOPS[i] - 300,
                  width: 928,
                  display: 'flex',
                  justifyContent: mine ? 'flex-end' : 'flex-start',
                  padding: '0 28px',
                  opacity: e,
                  transform: `translateY(${(1 - e) * 26}px) scale(${lerp(0.96, 1, e)})`,
                }}
              >
                <div style={{ width: 632, display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                  {b.name && (
                    <Txt
                      size={20}
                      color={rgba(T.mist, 0.85)}
                      letterSpacing={2}
                      lineHeight={26}
                      style={{ marginBottom: 8, marginLeft: mine ? 0 : 6 }}
                    >
                      {b.name}
                    </Txt>
                  )}
                  <div
                    style={{
                      maxWidth: 632,
                      padding: '20px 26px',
                      borderRadius: mine ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                      background: mine
                        ? `linear-gradient(150deg, ${rgba(gold, 0.92)}, ${rgba(hexRgb(T.goldC), 0.92)})`
                        : rgba(T.pale, 0.14),
                      border: mine ? 'none' : `1px solid ${rgba(T.line, 0.2)}`,
                    }}
                  >
                    <Txt
                      size={27}
                      color={mine ? rgba(T.archbg, 0.94) : rgba(cream, 0.9)}
                      weight={mine ? 500 : 400}
                      letterSpacing={2}
                      lineHeight={40}
                    >
                      {b.text}
                    </Txt>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Chapter>

      {/* 02 这些对话换来了什么 */}
      <Chapter t={t} in={[2.84, 3.14]} out={[4.9, 5.18]}>
        <Sfx name="sfx_pop" at={2.98} vol={0.42} />
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 356,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.92, 3.22)),
          }}
        >
          这 些 对 话　换 来 了
        </Txt>
        <div style={{ position: 'absolute', left: 0, top: 400, width: 1080, textAlign: 'center' }}>
          <GoldText
            theme={T}
            size={208}
            weight={700}
            font="num"
            lineHeight={242}
            style={{
              opacity: outExpo(seg(t, 2.84, 3.16)),
              transform: `scale(${lerp(1.16, 1, outBack(seg(t, 2.84, 3.26), 1.9))})`,
            }}
          >
            {p.hero || '128'}
          </GoldText>
          <Txt
            size={52}
            color={rgba(cream, 0.9)}
            weight={500}
            font="serif"
            letterSpacing={8}
            lineHeight={70}
            style={{ marginTop: -14 }}
          >
            条真实消息
          </Txt>
        </div>
        <Txt
          size={32}
          color={rgba(cream, 0.8)}
          font="serif"
          letterSpacing={6}
          lineHeight={46}
          style={{
            position: 'absolute',
            left: 0,
            top: 726,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.18, 3.5)),
          }}
        >
          {p.subValue || '比任何奖状都值钱'}
        </Txt>

        {[
          { k: '客户转介绍', v: '9 位', d: '全部来自满意度回访' },
          { k: '老客户加保', v: '4 单', d: '平均 3.2 年信任积累' },
          { k: '服务满意度', v: '100%', d: '年度回访零差评' },
        ].map((f, i) => {
          const s0 = 3.32 + i * 0.22;
          const e = outExpo(seg(t, s0, s0 + 0.38));
          return (
            <div
              key={f.k}
              style={{
                position: 'absolute',
                left: 140,
                top: 860 + i * 168,
                width: 800,
                opacity: e,
                transform: `translateY(${(1 - e) * 24}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Txt size={31} color={rgba(cream, 0.88)} weight={400} letterSpacing={5} lineHeight={44}>
                  {f.k}
                </Txt>
                <Txt size={44} color={T.bright} weight={700} font="num" lineHeight={58}>
                  {f.v}
                </Txt>
              </div>
              <Txt
                size={23}
                color={rgba(T.mist, 0.85)}
                weight={300}
                letterSpacing={2}
                lineHeight={34}
                style={{ marginTop: 8 }}
              >
                {f.d}
              </Txt>
            </div>
          );
        })}
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.12, 5.48]}>
        <EndCard theme={T} t={t} start={5.18} p={p} />
      </Chapter>
    </Stage>
  );
};
