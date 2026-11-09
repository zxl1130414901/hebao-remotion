import React from 'react';
import type { Skin } from '../skins';
import type { UniversalProps } from '../types';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Metric, Quote, Tag } from '../kit/Type';
import { EndCard, FactRow, Rule, Sfx, ChapterRail } from '../kit/Bits';
import { fitSize, rgba, splitLines } from '../lib/anim';
import { useT } from '../lib/useT';

/** 数字主视觉 · 一个数字压住全屏 */
export const MetricHero: React.FC<{ p: UniversalProps; s: Skin; accent: number; arr: number }> = ({
  p,
  s,
  accent,
  arr,
}) => {
  const t = useT();
  /* 主视觉统一居中；arr 只保留给数字字号做细微区分 */
  const left = false;
  const align = left ? 'left' : 'center';
  const px = left ? 88 : 88;
  const pageW = 904;

  return (
    <Page
      s={s}
      accent={accent}
      brand={p.brand}
      dateText={p.dateText}
      footnote={p.footnote}
      bgm="assets/bed_data.wav"
    >
      {/* 数字背后的刻度环 */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
        <circle
          cx={left ? 300 : 540}
          cy={790}
          r={330}
          fill="none"
          stroke={rgba(s.a1, 0.22)}
          strokeWidth={1}
          strokeDasharray="2 10"
          transform={`rotate(${t * 12} ${left ? 300 : 540} 790)`}
        />
        <circle
          cx={left ? 300 : 540}
          cy={790}
          r={410}
          fill="none"
          stroke={rgba(s.a1, 0.1)}
          strokeWidth={1}
        />
      </svg>

      <Scene t={t} inAt={0.02} outAt={3.5} y={14}>
        <Kicker
          s={s}
          t={t}
          text={p.kicker}
          x={px}
          y={300}
          align={align}
          w={pageW}
          start={0.06}
          size={26}
        />
        <div
          style={{
            position: 'absolute',
            left: px,
            top: 360,
            width: pageW,
            textAlign: align,
            fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif',
            fontSize: Math.floor(fitSize(p.title, pageW - 8, 76, 8, 44)),
            letterSpacing: 8,
            whiteSpace: 'nowrap',
            fontWeight: 700,
            color: s.ink,
            opacity: Math.min(1, Math.max(0, (t - 0.16) / 0.6)),
          }}
        >
          {p.title}
        </div>

        <Metric
          s={s}
          t={t}
          value={p.metric.value}
          decimals={p.metric.decimals}
          prefix={p.metric.prefix}
          suffix={p.metric.suffix}
          unit={p.metric.unit}
          label={p.metric.label}
          x={px}
          y={510}
          w={pageW}
          size={arr % 2 === 0 ? 300 : 258}
          start={0.34}
          align={align}
        />

        <Rule
          s={s}
          t={t}
          x={left ? 88 : 340}
          y={1150}
          w={left ? 300 : 400}
          start={1.5}
          color={rgba(s.a1, 0.7)}
        />
        <Tag s={s} t={t} text={p.award} x={px} y={1200} align={align} w={pageW} start={1.65} />
        <div
          style={{
            position: 'absolute',
            left: px,
            top: 1326,
            width: pageW,
            textAlign: align,
            fontSize: Math.min(
              32,
              ...splitLines(p.subtitle, 2).map((l) => Math.floor(fitSize(l, pageW - 8, 32, 3, 22))),
            ),
            letterSpacing: 3,
            lineHeight: '52px',
            color: s.dim,
            opacity: Math.min(1, Math.max(0, (t - 1.9) / 0.7)),
          }}
        >
          {splitLines(p.subtitle, 2).map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
        <ChapterRail
          s={s}
          t={t}
          labels={[p.title, p.metric.label, '谨此祝贺']}
          y={1476}
          active={0}
          start={1.7}
        />
        <Sfx name="pop" at={0.34} vol={0.26} />
        <Sfx name="impact" at={1.45} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.55} outAt={6.4} y={24}>
        <Kicker
          s={s}
          t={t}
          text="THE HONOUR GOES TO"
          x={88}
          y={330}
          align="center"
          w={904}
          start={3.65}
          size={26}
        />
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 396,
            width: 904,
            textAlign: 'center',
            fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif',
            fontSize: Math.floor(fitSize(p.honoree, 880, 108, 3, 56)),
            fontWeight: 700,
            letterSpacing: 3,
            lineHeight: '128px',
            whiteSpace: 'nowrap',
            color: s.ink,
            opacity: Math.min(1, Math.max(0, (t - 3.7) / 0.5)),
            textShadow: s.titleGlow,
          }}
        >
          {p.honoree}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 548,
            width: 904,
            textAlign: 'center',
            fontSize: 30,
            letterSpacing: 3,
            color: s.dim,
            opacity: Math.min(1, Math.max(0, (t - 3.9) / 0.6)),
          }}
        >
          {p.role}
        </div>

        <div style={{ position: 'absolute', left: 88, top: 700, width: 904 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <React.Fragment key={i}>
              <FactRow
                s={s}
                t={t}
                k={f.k}
                v={f.v}
                x={0}
                y={i * 150}
                w={904}
                start={3.95 + i * 0.16}
                align="row"
                big
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: i * 150 + 108,
                  width: 904,
                  height: 1,
                  background: rgba(s.a1, 0.2),
                }}
              />
            </React.Fragment>
          ))}
        </div>

        <Quote
          s={s}
          t={t}
          text={p.quote}
          x={88}
          y={1160}
          w={904}
          size={34}
          start={4.7}
          align="center"
          lines={2}
        />
        <ChapterRail
          s={s}
          t={t}
          labels={[p.title, p.metric.label, '谨此祝贺']}
          y={1420}
          active={1}
          start={4.9}
        />
        <Sfx name="chime" at={4.1} vol={0.22} />
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
