import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { Rule } from '../components/Rule';
import { PersonChapter } from '../components/PersonChapter';
import { StatsRow } from '../components/StatsRow';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { clamp01, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 05 · 数字快闪版
 * 叙事：三连数字快闪（两跳实数 + 保费滚数压轴）→ 三项数据 → 人物 → 定版
 * 全库节奏最快的一套。
 */
export const Flash: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;

  const S = p.stats;
  const seq: { a: number; raw: string | null; k: string }[] = [
    { a: 0.34, raw: S[0]?.v ?? '42', k: S[0]?.k ?? '承保件数' },
    { a: 1.02, raw: S[1]?.v ?? '218%', k: S[1]?.k ?? '目标达成率' },
    { a: 1.7, raw: null, k: p.dlabel || '个人承保保费（万元）' },
  ];
  let showIdx = -1;
  seq.forEach((it, i) => {
    if (t >= it.a) showIdx = i;
  });
  let flash = 0;
  seq.forEach((it) => {
    flash = Math.max(flash, Math.exp(-Math.max(0, t - it.a) * 7));
  });

  const ftitleP = outExpo(seg(t, 0.1, 0.38));

  const it = showIdx >= 0 ? seq[showIdx] : null;
  const last = it !== null && showIdx === 2;
  const pin = it ? seg(t, it.a, it.a + 0.13) : 0;
  const op = it
    ? last
      ? seg(t, it.a, it.a + 0.14)
      : seg(t, it.a, it.a + 0.13) * (1 - seg(t, it.a + 0.52, it.a + 0.66))
    : 0;
  const sc = lerp(1.45, 1, outBack(pin, 2.2));

  const rawText = it?.raw ?? '';
  const hasDec = p.premium % 1 !== 0;
  const digits = String(p.premium.toFixed(hasDec ? 1 : 0)).replace('.', '').length;
  const numSize = (last ? digits : rawText.length) <= 3 ? 300 : (last ? digits : rawText.length) === 4 ? 258 : 220;

  return (
    <Stage theme={T} brand={p.brand} bottomtag={p.bottomtag}>
      {/* 01 三连快闪 */}
      <Chapter t={t} in={[0.1, 0.4]} out={[2.32, 2.62]}>
        <Txt
          size={40}
          color={rgba(T.soft, 0.85)}
          weight={300}
          letterSpacing={18}
          lineHeight={56}
          style={{ position: 'absolute', top: 420, width: 1080, textAlign: 'center', opacity: ftitleP }}
        >
          {p.slogan || '十月战绩'}
        </Txt>

        <div
          style={{
            position: 'absolute',
            top: 640,
            width: 1080,
            textAlign: 'center',
            opacity: it ? op : 0,
            transform: `scale(${sc})`,
          }}
        >
          <GoldText
            theme={T}
            size={numSize}
            font="num"
            weight={700}
            lineHeight={Math.round(numSize * 1.1)}
            letterSpacing={-6}
          >
            {last
              ? // 保费滚数
                (() => {
                  const pv = p.premium * outExpo(seg(t, 1.78, 2.3));
                  return pv % 1 !== 0 || p.premium % 1 !== 0
                    ? pv.toFixed(p.premium % 1 !== 0 ? 1 : 0)
                    : Math.round(pv).toLocaleString('en-US');
                })()
              : rawText}
          </GoldText>
        </div>

        <Txt
          size={38}
          color={rgba(T.soft, 0.9)}
          weight={300}
          letterSpacing={10}
          lineHeight={53}
          style={{
            position: 'absolute',
            top: 1040,
            width: 1080,
            textAlign: 'center',
            opacity: it ? op * 0.95 : 0,
          }}
        >
          {it?.k ?? ''}
        </Txt>

        <Rule theme={T} t={t} start={2.02} dur={0.28} left={440} top={1150} width={200} color={T.line} />
        <Txt
          size={28}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={6}
          lineHeight={39}
          style={{
            position: 'absolute',
            top: 1200,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 2.1, 2.34)),
          }}
        >
          {p.quote || '数字会说话 · 每一秒都是冲刺'}
        </Txt>

        {/* 快闪白光 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: Math.min(0.5, flash * 0.5),
            background: `radial-gradient(circle at 50% 52%, ${rgba(hexRgb(T.cream), 0.85)} 0%, ${rgba(
              hexRgb(T.cream),
              0.25
            )} 34%, ${rgba(hexRgb(T.cream), 0)} 62%)`,
            pointerEvents: 'none',
          }}
        />
      </Chapter>

      {/* 02 三项 */}
      <Chapter t={t} in={[2.46, 2.78]} out={[3.86, 4.16]}>
        <StatsRow theme={T} t={t} stats={S} start={2.54} />
      </Chapter>

      {/* 03 人物 */}
      <PersonChapter theme={T} t={t} p={p} in={[4.3, 4.62]} out={[5.86, 6.16]} photoTop={200} />

      {/* 04 定版 */}
      <Chapter t={t} in={[6.3, 6.64]}>
        <Sfx name="sfx_chime" at={2.20} vol={0.3} />
        <EndCard theme={T} t={t} start={6.38} p={p} />
      </Chapter>
    </Stage>
  );
};
