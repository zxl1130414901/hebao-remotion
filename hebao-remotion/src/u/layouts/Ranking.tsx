import React from 'react';
import type { Skin } from '../skins';
import type { UniversalProps } from '../types';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Lead, Tag, Title } from '../kit/Type';
import { EndCard, RankRow, Rule, Sfx } from '../kit/Bits';
import { fitSize, rgba } from '../lib/anim';
import { useT } from '../lib/useT';

/** 荣耀榜单 · 名单即主角，条形长度做视觉排序 */
export const Ranking: React.FC<{ p: UniversalProps; s: Skin; accent: number; arr: number }> = ({
  p,
  s,
  accent,
  arr,
}) => {
  const t = useT();
  const rows = p.rows.slice(0, 5);
  const nums = rows.map((r) => parseFloat(String(r.value ?? '0').replace(/[^\d.]/g, '')) || 0);
  // 奖项名做 value 时（如「一等奖」）不显示合计，改成席位数，避免出现 0
  const numericTotal = rows.every((r) => /^\s*[\d.,]+\s*$/.test(String(r.value ?? '')));
  const max = Math.max(...nums, 1);
  // 右侧留白：皮肤若有右边缘装饰（如酸性皮肤的蓝色竖条），榜单右对齐的数字要避让
  const rw = 904 - (s.safeRight ?? 0);
  /* 榜单标题区统一居中 */
  const left = false;
  void arr;

  return (
    <Page
      s={s}
      accent={accent}
      brand={p.brand}
      dateText={p.dateText}
      footnote={p.footnote}
      bgm="assets/bed_data.wav"
    >
      <Scene t={t} inAt={0.02} outAt={1.62} y={14}>
        <Kicker
          s={s}
          t={t}
          text={p.kicker}
          x={88}
          y={300}
          align={left ? 'left' : 'center'}
          w={904}
          start={0.06}
          size={26}
        />
        <Title
          s={s}
          t={t}
          text={p.title}
          x={88}
          y={368}
          w={904}
          size={132}
          start={0.16}
          each={0.07}
          align={left ? 'left' : 'center'}
          glow={s.titleGlow}
        />
        <Lead
          s={s}
          t={t}
          text={p.subtitle}
          x={88}
          y={560}
          w={904}
          size={38}
          start={0.7}
          align={left ? 'left' : 'center'}
          lines={2}
        />
        <Tag s={s} t={t} text={p.award} x={88} y={700} align={left ? 'left' : 'center'} w={904} start={0.95} />
        <Sfx name="whoosh" at={0.14} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={1.55} outAt={6.4} y={18}>
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 300,
            width: 904,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            opacity: Math.min(1, Math.max(0, (t - 1.65) / 0.5)),
          }}
        >
          <div
            style={{
              fontFamily: '"Oswald","Noto Sans SC",sans-serif',
              fontSize: 30,
              letterSpacing: 8,
              color: s.dim,
            }}
          >
            TOP PERFORMERS · {p.dateText.slice(0, 4)}
          </div>
          <div style={{ fontSize: 26, letterSpacing: 3, color: s.faint }}>{p.metric.label}</div>
        </div>
        <Rule s={s} t={t} x={88} y={360} w={904} start={1.7} color={rgba(s.a1, 0.34)} />

        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: 88,
                top: 430 + i * 168,
                width: (rw * (nums[i] / max)) * Math.min(1, Math.max(0, (t - 1.8 - i * 0.20) / 0.9)),
                height: 118,
                background:
                  i === 0
                    ? `linear-gradient(90deg, ${rgba(s.a2, 0.16)}, ${rgba(s.a1, 0.05)})`
                    : `linear-gradient(90deg, ${rgba(s.a1, 0.09)}, rgba(0,0,0,0))`,
                borderLeft: `3px solid ${rgba(i === 0 ? s.a2 : s.a1, 0.75)}`,
              }}
            />
            <RankRow
              s={s}
              t={t}
              i={i}
              name={r.name}
              role={r.role}
              value={r.value}
              hl={i === 0}
              x={88}
              y={430 + i * 168}
              w={rw}
              start={1.78 + i * 0.20}
            />
          </React.Fragment>
        ))}

        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 1258,
            width: 904,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            opacity: Math.min(1, Math.max(0, (t - 3.1) / 0.7)),
          }}
        >
          <div style={{ width: 3, height: 72, background: s.a1 }} />
          <div>
            <div style={{ fontSize: 30, letterSpacing: 2, color: s.dim, whiteSpace: 'nowrap' }}>
              {p.award}
            </div>
            <div
              style={{
                fontSize: Math.floor(fitSize(p.honoree, 830, 40, 1, 24)),
                letterSpacing: 1,
                color: s.ink,
                marginTop: 6,
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {p.honoree}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 1508,
            width: rw,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            opacity: Math.min(1, Math.max(0, (t - 3.3) / 0.7)),
            borderTop: `1px solid ${rgba(s.a1, 0.28)}`,
            paddingTop: 26,
          }}
        >
          <div>
            <div style={{ fontSize: 24, letterSpacing: 5, color: s.faint, fontFamily: '"Oswald","Noto Sans SC",sans-serif' }}>
              {numericTotal ? `TOP ${rows.length} · TOTAL` : `TOP ${rows.length} · HONOURS`}
            </div>
            <div style={{ fontSize: 28, letterSpacing: 2, color: s.dim, marginTop: 8 }}>
              {numericTotal ? `${rows.length} 位上榜者合计` : `共 ${rows.length} 席 · 全部上榜`}
            </div>
          </div>
          <div
            style={{
              fontFamily: s.numFamily,
              fontSize: 88,
              lineHeight: '88px',
              color: s.ink,
              letterSpacing: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {numericTotal
              ? nums.reduce((a, b) => a + b, 0).toFixed(nums.some((n) => !Number.isInteger(n)) ? 1 : 0)
              : `${rows.length} 席`}
          </div>
        </div>
        <Sfx name="pop" at={1.8} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={6.42} y={18}>
        <EndCard
          s={s}
          t={t}
          p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }}
          start={6.5}
        />
      </Scene>
    </Page>
  );
};
