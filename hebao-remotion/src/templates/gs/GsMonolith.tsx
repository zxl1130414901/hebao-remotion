import React from 'react';
import { useT } from '../../lib/useT';
import { THEMES } from '../../theme';
import type { HebaoProps } from '../../data/types';
import { Chapter } from '../../components/Chapter';
import { Sfx } from '../../components/Sfx';
import { GoldText, Txt } from '../../components/GoldText';
import { NumRoll } from '../../components/NumRoll';
import { EndCard } from '../../components/EndCard';
import { DrawRect } from '../../components/DrawLine';
import {
  GsStage, HookCap, gsBeats,
  EASE, stagger, clamp01, lerp, rgba, seg,
} from './fx';

/**
 * 典藏 10 · 丰碑铭刻版（深墨）
 * 叙事：把这一笔刻进丰碑——右侧整面竖碑，slogan 以竖排书法铭刻于碑面。
 * 版式：左右分割构图——左 55% 放横排数据（标题/数字/条目），
 *       右 45% 是通高石碑 + 竖排大字（writing-mode vertical），版式语言完全不同。
 * 结构：3 章（碑起 / 左侧数据 / 刻字落成+定版）。
 */
export const GsMonolith: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.shenmo;
  const B = gsBeats({ num: 1.8, rows: 3.8, person: 5.4, end: 6.72 });

  /* 碑体升起 */
  const rise = EASE.enter(seg(t, B.hook + 0.1, B.hook + 0.9));
  /* 錾刻音落点 */
  const carve = EASE.enter(seg(t, B.rows + 0.35, B.rows + 1.15));
  const items = (p.items ?? []).slice(0, 3);
  const steleText = p.slogan2 ?? '再攀高峰';

  return (
    <GsStage theme={T} p={p} bottomtag="MONUMENT">
      {/* 章 1 · 碑体升起 + 錾刻 */}
      <Chapter t={t} in={[B.hook, B.hook + 0.3]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 通高石碑（右侧） */}
        <div
          style={{
            position: 'absolute',
            left: 610,
            top: 280 - (1 - rise) * 900,
            width: 380,
            height: 1420,
            borderRadius: '14px 14px 8px 8px',
            background: `linear-gradient(100deg, ${T.bg[2]} 0%, ${T.archbg} 46%, ${T.bg[0]} 100%)`,
            border: `1px solid ${rgba(T.line, 0.4)}`,
            boxShadow: `-26px 0 70px rgba(0,0,0,.5), inset 0 0 60px rgba(0,0,0,.4)`,
          }}
        >
          {/* 碑帽 */}
          <div
            style={{
              position: 'absolute',
              left: -14,
              top: -26,
              width: 408,
              height: 46,
              borderRadius: 10,
              background: `linear-gradient(180deg, ${T.goldC}, ${T.goldD})`,
              boxShadow: '0 8px 22px rgba(0,0,0,.5)',
            }}
          />
          {/* 碑座 */}
          <div
            style={{
              position: 'absolute',
              left: -22,
              bottom: -30,
              width: 424,
              height: 52,
              borderRadius: 8,
              background: `linear-gradient(180deg, ${T.bg[1]}, ${T.archbg})`,
              border: `1px solid ${rgba(T.line, 0.3)}`,
            }}
          />
          {/* 竖排铭文：石刻本白 + 微金晕（不用主题金，避免与碑面石材撞色） */}
          <div
            style={{
              position: 'absolute',
              right: 44,
              top: 90,
              writingMode: 'vertical-rl',
              fontFamily: "'Noto Serif SC', 'SimSun', serif",
              fontSize: 118,
              fontWeight: 700,
              letterSpacing: 26,
              color: rgba(T.cream, carve * 0.98),
              textShadow: `0 0 1px ${rgba(T.goldD, carve * 0.55)}, 0 3px 6px ${rgba(T.mask, carve * 0.45)}, 0 0 30px ${rgba(T.goldC, carve * 0.2)}`,
              lineHeight: 1.15,
            }}
          >
            {steleText}
          </div>
          {/* 落款小竖排 */}
          <div
            style={{
              position: 'absolute',
              left: 46,
              top: 110,
              writingMode: 'vertical-rl',
              fontSize: 40,
              fontWeight: 400,
              letterSpacing: 10,
              color: rgba(T.pale, carve * 0.85),
              lineHeight: 1.3,
            }}
          >
            {p.dateText} · 铭记
          </div>
        </div>
        <Sfx name="sfx_whoosh" at={B.hook + 0.12} vol={0.26} />
      </Chapter>

      {/* 章 2 · 左侧横排数据（标题提前入画补空窗，且左对齐不压碑） */}
      <Chapter t={t} in={[B.hook + 0.45, B.hook + 0.75]} out={[B.end - 0.26, B.end - 0.02]}>
        <HookCap theme={T} t={t} text="MONUMENT · 丰碑" top={288} start={B.hook + 0.55}
          align="left" left={96} width={460} />
        <Txt size={46} color={rgba(T.pale, 1)} weight={500} letterSpacing={2} lineHeight={52}
          style={{ position: 'absolute', left: 96, top: 470, width: 460, textAlign: 'left',
            opacity: clamp01(seg(t, B.num + 0.1, B.num + 0.36)) }}>
          {p.dlabel}
        </Txt>
        <div
          style={{
            position: 'absolute',
            left: 92,
            top: 550,
            opacity: clamp01(seg(t, B.num + 0.14, B.num + 0.4)),
          }}
        >
          <NumRoll theme={T} target={p.premium} t={t} start={B.num + 0.24} dur={1.05} size={128}
            lineHeight={148} unit="万" unitSize={34} unitColor={rgba(T.soft, 0.95)} />
        </div>
        <Sfx name="sfx_pop" at={B.num + 0.24 + 1.05 * 0.78} vol={0.26} />
        {/* 左侧条目列表（左对齐） */}
        {items.map((it, i) => {
          const st = B.rows + 0.1 + i * 0.18;
          const e = EASE.enter(seg(t, st, st + 0.44));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 96,
                top: 860 + i * 200,
                width: 460,
                opacity: clamp01(seg(t, st, st + 0.22)),
                transform: `translateX(${(1 - e) * -70}px)`,
              }}
            >
              <div style={{ position: 'absolute', left: 0, top: 8, width: 4, height: 120,
                background: `linear-gradient(180deg, ${T.goldC}, ${rgba(T.goldC, 0.08)})`, borderRadius: 2 }} />
              <Txt size={44} color={rgba(T.pale, 0.9)} weight={400} letterSpacing={5} lineHeight={42}
                style={{ position: 'absolute', left: 28, top: 0 }}>
                {it.k}
              </Txt>
              {/* 数值 + 说明同行 flex 排布，绝不互相压字 */}
              <div style={{ position: 'absolute', left: 28, top: 46, display: 'flex',
                alignItems: 'baseline', gap: 14, maxWidth: 432 }}>
                <Txt size={68} color={T.cream} weight={600} font="num" letterSpacing={-1}
                  lineHeight={66} style={{ flexShrink: 0 }}>
                  {it.v}
                </Txt>
                <Txt size={40} color={rgba(T.pale, 0.85)} weight={400} letterSpacing={1} lineHeight={40}>
                  {it.d ?? ''}
                </Txt>
              </div>
            </div>
          );
        })}
        <Sfx name="sfx_stamp" at={B.rows + 0.3} vol={0.24} />
      </Chapter>

      {/* 章 3 · 錾刻完成 + 金尘 */}
      <Chapter t={t} in={[B.person - 0.06, B.person + 0.26]} out={[B.end - 0.26, B.end - 0.02]}>
        {/* 錾刻火花（三簇小金点沿碑面） */}
        {[0, 1, 2].map((i) => {
          const st = B.person + 0.2 + i * 0.18;
          const sp = seg(t, st, st + 0.5);
          if (sp <= 0 || sp >= 1) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 700 + i * 90,
                top: 500 + i * 300 - sp * 90,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: T.goldA,
                boxShadow: `0 0 16px ${T.goldC}`,
                opacity: (1 - sp) * 0.9,
              }}
            />
          );
        })}
        <Sfx name="sfx_stamp" at={B.person + 0.2} vol={0.3} />
        <Sfx name="sfx_stamp" at={B.person + 0.38} vol={0.26} />
        <Sfx name="sfx_stamp" at={B.person + 0.56} vol={0.22} />
        <Sfx name="sfx_gong" at={B.person + 0.85} vol={0.34} />
        {/* 左下金句 */}
        <Txt size={48} color={T.cream} weight={500} letterSpacing={8} lineHeight={50}
          style={{ position: 'absolute', left: 96, top: 1548, width: 460, textAlign: 'left',
            opacity: clamp01(seg(t, B.person + 0.95, B.person + 1.25)) }}>
          一笔铭刻 · 载入史册
        </Txt>
        <Txt size={40} color={rgba(T.pale, 0.85)} weight={400} letterSpacing={3} lineHeight={40}
          style={{ position: 'absolute', left: 96, top: 1648, width: 460, textAlign: 'left',
            opacity: clamp01(seg(t, B.person + 1.2, B.person + 1.5)) }}>
          {p.delta}
        </Txt>
        {/* 碑面高光扫过 */}
        <div
          style={{
            position: 'absolute',
            left: 610,
            top: 280,
            width: 380,
            height: 1420,
            borderRadius: 14,
            overflow: 'hidden',
            opacity: 0.9,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -80 + carve * 560,
              top: 0,
              width: 70,
              height: '100%',
              background: `linear-gradient(90deg, ${rgba(T.pale, 0)}, ${rgba(T.pale, 0.16)}, ${rgba(T.pale, 0)})`,
              transform: 'skewX(-12deg)',
            }}
          />
        </div>
      </Chapter>

      {/* 定版 */}
      <Chapter t={t} in={[B.end - 0.06, B.end + 0.2]}>
        <EndCard theme={T} t={t} start={B.end} p={p} titleSize={134} titleText="载入史册"
          subText="丰碑为记 · 步履不停" splitTitle drawLine titleLetterSpacing={22} />
      </Chapter>
    </GsStage>
  );
};
