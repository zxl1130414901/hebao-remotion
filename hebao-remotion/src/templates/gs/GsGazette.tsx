import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { EndCard } from '../../components/EndCard';
import {
  GsStage, gsBeats, SplitReveal,
  EASE, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 16 · 十月号外版（深墨）· 纵向单栏大字报重构
 * 版式：放弃双栏报纸——纵向单栏通栏排版：
 *       报头「号外」居中大字 + 期号 + 日期双线 →
 *       头条超大数字居中 → 支撑数据行式清单（通栏 940）→
 *       右上角朱砂审阅印 + 底部发刊词。每层通栏铺满，留白均匀。
 * 结构：4 章（报头落下 / 头条揭幕 / 数据清单 / 盖印发刊+定版）。
 */
export const GsGazette: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.shenmo;
  const B = gsBeats({ num: 2.0, rows: 4.5, end: 6.72 });

  const items = (p.items ?? []).slice(0, 4);

  return (
    <GsStage theme={T} p={p} bottomtag="SPECIAL　EDITION">
      {/* 章 1 · 报头（贯穿） */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 报头大字：居中 172px */}
        <SplitReveal theme={T} t={t} text="号外" size={172} top={286} start={B.hook + 0.2}
          mode="drop" staggerEach={0.16} dur={0.44} lineHeight={214} />
        <Sfx name="sfx_gong" at={B.hook + 0.5} vol={0.36} />
        {/* 期号行（报头正下方，居中，不再挤右上角） */}
        <Txt size={32} color={rgba(T.pale, 0.8)} weight={400} letterSpacing={4} lineHeight={32}
          style={{ position: 'absolute', left: 0, top: 524, width: 1080, textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: clamp01(seg(t, B.hook + 0.75, B.hook + 1.05)) }}>
          第 38 期 · 内部特刊 · TAIKANG GAZETTE
        </Txt>
        {/* 日期线：双细线夹日期 */}
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 592,
            width: 820,
            height: 1.5,
            background: rgba(T.line, 0.55),
            transform: `scaleX(${EASE.enter(seg(t, B.hook + 0.85, B.hook + 1.15))})`,
          }}
        />
        <Txt size={40} color={rgba(T.pale, 0.88)} weight={400} letterSpacing={3} lineHeight={40}
          style={{ position: 'absolute', left: 0, top: 608, width: 1080, textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: clamp01(seg(t, B.hook + 0.95, B.hook + 1.25)) }}>
          {p.dateText} · 个险渠道特刊　·　EXTRA
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 664,
            width: 820,
            height: 3,
            background: rgba(T.line, 0.7),
            transform: `scaleX(${EASE.enter(seg(t, B.hook + 1.05, B.hook + 1.35))})`,
          }}
        />
      </Chapter>

      {/* 章 2 · 头条揭幕：眉线 + 超大数字 + 口径 + 增幅胶囊，全部居中 */}
      <Chapter t={t} in={[B.num - 0.06, B.num + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 眉线 + 眉题 */}
        <div
          style={{
            position: 'absolute',
            left: 440,
            top: 716,
            width: 200,
            height: 2,
            background: `linear-gradient(90deg, ${rgba(T.goldC, 0)}, ${T.goldC}, ${rgba(T.goldC, 0)})`,
            opacity: clamp01(seg(t, B.num + 0.08, B.num + 0.3)),
          }}
        />
        <Txt size={38} color={rgba(T.pale, 0.9)} weight={500} letterSpacing={10} lineHeight={38}
          style={{ position: 'absolute', left: 0, top: 736, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 0.14, B.num + 0.38)) }}>
          本期头条
        </Txt>
        {/* 超大数字 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 796,
            width: 1080,
            textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 0.28, B.num + 0.52)),
            transform: `scale(${lerp(0.82, 1, EASE.glam(seg(t, B.num + 0.28, B.num + 0.72)))})`,
          }}
        >
          <GoldText theme={T} size={176} weight={700} font="num" lineHeight={200} letterSpacing={-4}
            style={{ display: 'inline-block' }}>
            {p.premium.toFixed(1)}
          </GoldText>
          <Txt size={50} color={rgba(T.soft, 0.95)} weight={500} letterSpacing={2} lineHeight={50}
            style={{ display: 'inline-block', marginLeft: 14 }}>
            万元
          </Txt>
        </div>
        {/* 口径小注 */}
        <Txt size={38} color={rgba(T.pale, 0.8)} weight={400} letterSpacing={3} lineHeight={38}
          style={{ position: 'absolute', left: 0, top: 1024, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.num + 0.55, B.num + 0.8)) }}>
          {p.dlabel}
        </Txt>
        {/* 增幅胶囊 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 1090,
            transform: 'translateX(-50%)',
            padding: '12px 34px',
            borderRadius: 999,
            border: `1.5px solid ${rgba(T.goldC, 0.75)}`,
            background: rgba(T.goldC, 0.1),
            opacity: clamp01(seg(t, B.num + 0.7, B.num + 0.95)),
          }}
        >
          <Txt size={44} color={T.goldB} weight={600} letterSpacing={3} lineHeight={44}>
            {p.delta.split('　')[0]}
          </Txt>
        </div>
        <Sfx name="sfx_pop" at={B.num + 0.45} vol={0.24} />
      </Chapter>

      {/* 章 3 · 支撑数据行式清单：通栏 940，k 左 v 右，行间细线 */}
      <Chapter t={t} in={[B.rows - 0.5, B.rows - 0.2]} out={[B.end - 0.26, B.end - 0.02]}>
        {items.map((it, i) => {
          const st = B.rows - 0.42 + i * 0.17;
          const e = EASE.enter(seg(t, st, st + 0.44));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 70,
                top: 1206 + i * 92,
                width: 940,
                height: 88,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: i < items.length - 1 ? `1px solid ${rgba(T.line, 0.24)}` : 'none',
                opacity: clamp01(seg(t, st, st + 0.24)),
                transform: `translateY(${(1 - e) * 26}px)`,
              }}
            >
              <Txt size={40} color={rgba(T.pale, 0.86)} weight={400} letterSpacing={3} lineHeight={44}>
                {it.k}
              </Txt>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                {it.d ? (
                  <Txt size={34} color={rgba(T.pale, 0.72)} weight={400} letterSpacing={1} lineHeight={36}>
                    {it.d}
                  </Txt>
                ) : null}
                <Txt size={58} color={T.cream} weight={600} font="num" letterSpacing={-1} lineHeight={60}>
                  {it.v}
                </Txt>
              </div>
            </div>
          );
        })}
        {/* 印刷辊筒：自上而下滚过，像刚印出来 */}
        {(() => {
          const rp = seg(t, B.rows - 0.42, B.rows + 0.6);
          if (rp <= 0 || rp >= 1) return null;
          return (
            <div
              style={{
                position: 'absolute',
                left: 70,
                top: 1190 + rp * 400 - 44,
                width: 940,
                height: 88,
                background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(T.mask, 0.3)} 28%, ${rgba(T.mask, 0.3)} 72%, rgba(0,0,0,0) 100%)`,
                borderBottom: `2px solid ${rgba(T.goldC, 0.5)}`,
                opacity: 0.85,
                pointerEvents: 'none',
              }}
            />
          );
        })()}
      </Chapter>

      {/* 章 4 · 盖印发刊：右上角朱砂审阅印 + 底部发刊词 */}
      <Chapter t={t} in={[B.rows - 0.06, B.rows + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 朱砂印（右上角 880,690 空白区，盖在头条右上像审阅批示） */}
        <div
          style={{
            position: 'absolute',
            left: 884,
            top: 692,
            width: 132,
            height: 132,
            border: `5px solid rgba(178, 34, 38, ${0.92})`,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(-12deg) scale(${lerp(2.1, 1, EASE.hook(seg(t, B.rows + 0.12, B.rows + 0.5)))})`,
            opacity: clamp01(seg(t, B.rows + 0.12, B.rows + 0.26)),
            background: `rgba(178, 34, 38, 0.1)`,
            boxShadow: '0 8px 24px rgba(120,10,12,.3)',
          }}
        >
          <div style={{ position: 'absolute', inset: 8, border: '1.5px solid rgba(178, 34, 38, 0.8)', borderRadius: 5 }} />
          <span style={{ fontSize: 62, fontWeight: 700, color: `rgba(200, 44, 48, 0.95)`,
            fontFamily: "'Noto Serif SC', 'SimSun', serif", letterSpacing: 4,
            textShadow: '0 0 2px rgba(178,34,38,.35)' }}>
            {p.sealChar ?? '泰'}
          </span>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 10, pointerEvents: 'none',
            background: 'radial-gradient(circle at 30% 26%, rgba(120,10,12,.28) 0%, rgba(120,10,12,0) 46%), radial-gradient(circle at 74% 78%, rgba(120,10,12,.22) 0%, rgba(120,10,12,0) 40%)' }} />
        </div>
        <Sfx name="sfx_stamp" at={B.rows + 0.48} vol={0.36} />
        {/* 盖章瞬间：朱砂波纹两圈 */}
        {[0, 1].map((k) => {
          const rp = seg(t, B.rows + 0.48 + k * 0.1, B.rows + 0.48 + k * 0.1 + 0.55);
          if (rp <= 0 || rp >= 1) return null;
          const r = lerp(60, 170 + k * 70, EASE.settle(rp));
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: 950 - r,
                top: 758 - r,
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                border: `2px solid rgba(178,34,38,${(1 - rp) * 0.5})`,
                pointerEvents: 'none',
              }}
            />
          );
        })}
        {/* 发刊词 */}
        <Txt size={44} color={T.cream} weight={500} letterSpacing={8} lineHeight={46}
          style={{ position: 'absolute', left: 0, top: 1692, width: 1080, textAlign: 'center',
            opacity: clamp01(seg(t, B.rows + 0.75, B.rows + 1.05)) }}>
          本期号外 · 印发至各营业区
        </Txt>
        <Sfx name="sfx_shimmer" at={B.rows + 0.75} vol={0.24} />
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={138} titleText="载入战报"
          subText="号外已发 · 全员传阅" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
