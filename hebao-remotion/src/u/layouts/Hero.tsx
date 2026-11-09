import React from 'react';
import type { Skin } from '../skins';
import type { UniversalProps } from '../types';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Lead, Kicker, Metric, Tag, Title } from '../kit/Type';
import { EndCard, FactRow, Rule, Sfx, ChapterRail } from '../kit/Bits';
import { rgba } from '../lib/anim';
import { useT } from '../lib/useT';

/** 巨字宣言 · 让标题本身成为主视觉 */
export const Hero: React.FC<{ p: UniversalProps; s: Skin; accent: number; arr: number }> = ({
  p,
  s,
  accent,
  arr,
}) => {
  const t = useT();
  /* 构图统一居中：贺报是庄重场合，左右交替会让半数模板看起来「歪向一边」 */
  const center = true;
  void arr;
  const outline = s.mode === 'dark' ? '#FFFFFF' : '#12110F';
  const twoLine = p.title.length > 6;

  return (
    <Page
      s={s}
      accent={accent}
      brand={p.brand}
      dateText={p.dateText}
      footnote={p.footnote}
      bgm="assets/bed_ceremony.wav"
    >
      {/* 背景巨字：竖排描边 */}
      <div
        style={{
          position: 'absolute',
          right: -66,
          top: 250,
          writingMode: 'vertical-rl',
          fontFamily: '"Oswald","Noto Sans SC",sans-serif',
          fontWeight: 700,
          fontSize: 230,
          lineHeight: '212px',
          letterSpacing: 8,
          color: 'transparent',
          WebkitTextStroke: `1px ${rgba(outline, s.mode === 'dark' ? 0.1 : 0.08)}`,
          transform: `translateY(${Math.sin(t * 0.4) * 10}px)`,
        }}
      >
        HONOUR
      </div>

      <Scene t={t} inAt={0.02} outAt={3.5} y={18}>
        <Kicker
          s={s}
          t={t}
          text={p.kicker}
          x={88}
          y={center ? 456 : 440}
          align={center ? 'center' : 'left'}
          start={0.08}
          w={904}
        />
        <Title
          s={s}
          t={t}
          text={p.title}
          x={88}
          y={center ? 532 : 516}
          w={904}
          size={center ? 196 : 178}
          start={0.24}
          each={0.08}
          align={center ? 'center' : 'left'}
          glow={s.titleGlow}
          lines={twoLine ? 2 : 1}
        />
        <Lead
          s={s}
          t={t}
          text={p.subtitle}
          x={88}
          y={twoLine ? 986 : 810}
          w={904}
          size={40}
          start={0.82}
          align={center ? 'center' : 'left'}
          lines={2}
        />
        <Tag
          s={s}
          t={t}
          text={p.award}
          x={88}
          y={twoLine ? 1140 : 968}
          start={1.15}
          align={center ? 'center' : 'left'}
          w={904}
        />
        <Rule
          s={s}
          t={t}
          x={center ? 440 : 88}
          y={1238}
          w={center ? 200 : 260}
          start={0.95}
          color={rgba(s.a1, 0.7)}
        />
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 1280,
            width: 904,
            display: 'flex',
            justifyContent: center ? 'center' : 'flex-start',
            gap: 16,
            fontSize: 24,
            letterSpacing: 6,
            color: s.faint,
            fontFamily: '"Oswald","Noto Sans SC",sans-serif',
            opacity: Math.min(1, Math.max(0, (t - 1.55) / 0.6)),
          }}
        >
          <span>{p.dateText}</span>
          <span style={{ color: rgba(s.a1, 0.9) }}>／</span>
          <span>{p.brand}</span>
        </div>
        <ChapterRail
          s={s}
          t={t}
          labels={[p.title, p.metric.label, '谨此祝贺']}
          y={1420}
          active={0}
          start={0.95}
        />
        <Sfx name="whoosh" at={0.2} vol={0.26} />
        <Sfx name="chime" at={0.95} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={26}>
        <Kicker
          s={s}
          t={t}
          text="THE HONOUR GOES TO"
          x={88}
          y={326}
          align="center"
          w={904}
          start={3.6}
          size={26}
        />
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 392,
            width: 904,
            textAlign: 'center',
            fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif',
            // 按字数自适应，保证再长的名字也只占一行（不出现孤字换行）
            fontSize: Math.min(
              114,
              Math.floor((904 - 14) / Math.max(1, p.honoree.length)) - 3,
            ),
            fontWeight: 700,
            letterSpacing: 3,
            lineHeight: '132px',
            whiteSpace: 'nowrap',
            color: s.ink,
            opacity: Math.min(1, Math.max(0, (t - 3.64) / 0.5)),
            transform: `translateY(${Math.max(0, 1 - (t - 3.64) / 0.5) * 20}px)`,
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
            fontSize: 32,
            letterSpacing: 3,
            color: s.dim,
            opacity: Math.min(1, Math.max(0, (t - 3.9) / 0.6)),
          }}
        >
          {p.role}
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
          x={88}
          y={676}
          w={904}
          size={center ? 226 : 196}
          start={4.0}
          align="center"
        />

        <Rule s={s} t={t} x={88} y={1160} w={904} start={4.86} color={rgba(s.a1, 0.3)} />
        {p.facts.slice(0, 3).map((f, i) => (
          <FactRow
            key={i}
            s={s}
            t={t}
            k={f.k}
            v={f.v}
            x={88 + (904 / 3) * i}
            y={1200}
            w={904 / 3 - 30}
            start={5.0 + i * 0.14}
            align="col"
            big
          />
        ))}
        <Sfx name="impact" at={4.95} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={6.42} y={20}>
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
