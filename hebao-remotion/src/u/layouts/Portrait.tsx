import React from 'react';
import type { Skin } from '../skins';
import type { UniversalProps } from '../types';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Metric, Quote, Tag } from '../kit/Type';
import { ChapterRail, EndCard, FactRow, Monogram, Rule, Sfx } from '../kit/Bits';
import { fitSize, rgba, splitLines } from '../lib/anim';
import { useT } from '../lib/useT';

/** 人物致敬 · 徽记 / 头像位当主角 */
export const Portrait: React.FC<{ p: UniversalProps; s: Skin; accent: number; arr: number }> = ({
  p,
  s,
  accent,
  arr,
}) => {
  const t = useT();
  /* 人物版统一居中构图 */
  const centered = true;
  void arr;
  const cx = centered ? 540 : 300;
  const r = centered ? 216 : 178;

  /* 姓名/职务按实际字宽自适应：
     竖排窄栏（472）里长名字会折成两行，进而把奖项标签顶穿 —— 所以名字强制单行，
     职务最多两行，标签位置由文本块真实高度推出来。 */
  const nameW = centered ? 904 : 472;
  const nameSize = Math.floor(fitSize(p.honoree, nameW - 6, centered ? 96 : 80, 2, 40));
  const nameLh = Math.round(nameSize * 1.2);
  const roleLines = splitLines(p.role, nameW > 700 ? 1 : 2);
  const roleSize = Math.min(
    30,
    ...roleLines.map((l) => Math.floor(fitSize(l, nameW - 6, 30, 2, 20))),
  );
  const blockTop = centered ? 1020 : 720;
  const blockEnd = blockTop + nameLh + 12 + roleLines.length * 46;
  const tagY = centered ? Math.max(1224, blockEnd + 30) : Math.max(1024, blockEnd + 30);

  return (
    <Page
      s={s}
      accent={accent}
      brand={p.brand}
      dateText={p.dateText}
      footnote={p.footnote}
      bgm="assets/bed_creative.wav"
    >
      <Scene t={t} inAt={0.02} outAt={3.45} y={16}>
        <Kicker
          s={s}
          t={t}
          text={p.kicker}
          x={88}
          y={306}
          align={centered ? 'center' : 'left'}
          w={904}
          start={0.06}
        />
        <div
          style={{
            position: 'absolute',
            left: centered ? 240 : 88,
            top: centered ? 370 : 366,
            width: centered ? 600 : 420,
            textAlign: centered ? 'center' : 'left',
            fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif',
            fontSize: 54,
            letterSpacing: 8,
            color: s.dim,
            opacity: Math.min(1, Math.max(0, (t - 0.2) / 0.6)),
          }}
        >
          {p.title}
        </div>

        <Monogram s={s} t={t} text={p.honoree} cx={cx} cy={centered ? 760 : 800} r={r} start={0.3} accent={accent} />

        <div
          style={{
            position: 'absolute',
            left: centered ? 88 : 520,
            top: blockTop,
            width: nameW,
            textAlign: centered ? 'center' : 'left',
            opacity: Math.min(1, Math.max(0, (t - 0.82) / 0.55)),
            transform: `translateY(${Math.max(0, 1 - (t - 0.82) / 0.55) * 24}px)`,
          }}
        >
          <div
            style={{
              fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif',
              fontSize: nameSize,
              fontWeight: 700,
              letterSpacing: 2,
              lineHeight: `${nameLh}px`,
              whiteSpace: 'nowrap',
              color: s.ink,
              textShadow: s.titleGlow,
            }}
          >
            {p.honoree}
          </div>
          <div
            style={{
              fontSize: roleSize,
              letterSpacing: 2,
              color: s.dim,
              marginTop: 12,
              lineHeight: '46px',
            }}
          >
            {roleLines.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>

        <Tag
          s={s}
          t={t}
          text={p.award}
          x={88}
          y={tagY}
          align={centered ? 'center' : 'left'}
          w={centered ? 904 : 472}
          start={1.5}
          solid
        />

        <div style={{ position: 'absolute', left: 88, top: 1370, width: 904 }}>
          <Rule s={s} t={t} x={0} y={0} w={904} start={1.7} color={rgba(s.a1, 0.26)} />
          {p.facts.slice(0, 3).map((f, i) => (
            <FactRow
              key={i}
              s={s}
              t={t}
              k={f.k}
              v={f.v}
              x={(904 / 3) * i}
              y={38}
              w={904 / 3 - 28}
              start={1.85 + i * 0.12}
              align="col"
            />
          ))}
        </div>
        <Sfx name="shimmer" at={0.35} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={24}>
        <Kicker
          s={s}
          t={t}
          text={p.award}
          x={88}
          y={330}
          align="center"
          w={904}
          start={3.6}
          size={28}
        />
        <Metric
          s={s}
          t={t}
          value={p.metric.value}
          decimals={p.metric.decimals}
          prefix={p.metric.prefix}
          suffix={p.metric.suffix}
          unit={p.metric.unit}
          label={p.metric.label}
          x={88}
          y={470}
          w={904}
          size={centered ? 250 : 210}
          start={3.6}
          align="center"
        />
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 900,
            width: 780,
            height: 1,
            background: rgba(s.a1, 0.3),
            transform: `scaleX(${Math.min(1, Math.max(0, (t - 4.4) / 0.8))})`,
          }}
        />
        <Quote
          s={s}
          t={t}
          text={p.quote}
          x={150}
          y={930}
          w={780}
          size={34}
          start={4.55}
          align="center"
          lines={2}
        />
        <div style={{ position: 'absolute', left: 150, top: 1180, width: 780 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <React.Fragment key={i}>
              <FactRow
                s={s}
                t={t}
                k={f.k}
                v={f.v}
                x={0}
                y={i * 110}
                w={780}
                start={4.3 + i * 0.12}
                align="row"
              />
              {i < 2 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: i * 110 + 86,
                    width: 780,
                    height: 1,
                    background: rgba(s.a1, 0.18),
                  }}
                />
              ) : null}
            </React.Fragment>
          ))}
        </div>
        <ChapterRail
          s={s}
          t={t}
          labels={[p.title, p.metric.label, '谨此祝贺']}
          y={1500}
          active={1}
          start={4.5}
        />
        <Sfx name="impact" at={4.2} vol={0.26} />
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
