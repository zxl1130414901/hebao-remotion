import React from 'react';
import type { Skin } from '../skins';
import type { UniversalProps } from '../types';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Lead, Quote, Tag, Title } from '../kit/Type';
import { ChapterRail, EndCard, Rule, Sfx } from '../kit/Bits';
import { EASE, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';

/** 历程叙事 · 横向三节点 + 金句落版 */
export const Story: React.FC<{ p: UniversalProps; s: Skin; accent: number; arr: number }> = ({
  p,
  s,
  accent,
  arr,
}) => {
  const t = useT();
  /* 历程版标题区统一居中 */
  const left = false;
  void arr;
  const axisW = 904;
  /* 三节点关于中轴对称（540±302），节点框宽 280：
     中心取 238 / 540 / 842，框恰好落在 88–992 版心内，
     既不会压到右侧装饰条（acid/ink/cinema 都有），也不会让首尾说明贴到画布边缘。 */
  const marks = [238, 88 + axisW / 2, 842];
  const boxW = 280;

  return (
    <Page
      s={s}
      accent={accent}
      brand={p.brand}
      dateText={p.dateText}
      footnote={p.footnote}
      bgm="assets/bed_ceremony.wav"
    >
      <Scene t={t} inAt={0.02} outAt={1.32} y={12}>
        <Kicker
          s={s}
          t={t}
          text={p.kicker}
          x={88}
          y={300}
          align={left ? 'left' : 'center'}
          w={904}
          start={0.05}
          size={26}
        />
        <Title
          s={s}
          t={t}
          text={p.title}
          x={88}
          y={360}
          w={904}
          size={126}
          start={0.14}
          each={0.07}
          align={left ? 'left' : 'center'}
          glow={s.titleGlow}
        />
        <Lead
          s={s}
          t={t}
          text={p.subtitle}
          x={88}
          y={548}
          w={904}
          size={36}
          start={0.6}
          align={left ? 'left' : 'center'}
          lines={2}
        />
        <Tag s={s} t={t} text={p.award} x={88} y={704} align={left ? 'left' : 'center'} w={904} start={0.8} />
        <Sfx name="whoosh" at={0.12} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={1.24} outAt={6.4} y={14}>
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 292,
            width: 1000,
            textAlign: 'center',
            fontFamily: '"Oswald","Noto Sans SC",sans-serif',
            fontWeight: 700,
            fontSize: 300,
            lineHeight: '300px',
            letterSpacing: 6,
            color: 'transparent',
            WebkitTextStroke: `1px ${rgba(
              s.mode === 'dark' ? '#FFFFFF' : '#12110F',
              s.mode === 'dark' ? 0.15 : 0.19,
            )}`,
            opacity: Math.min(1, Math.max(0, (t - 1.4) / 0.9)),
            pointerEvents: 'none',
          }}
        >
          {p.dateText.slice(0, 4)}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 636,
            width: 904,
            fontSize: 24,
            letterSpacing: 6,
            color: s.faint,
            fontFamily: '"Oswald","Noto Sans SC",sans-serif',
            opacity: Math.min(1, Math.max(0, (t - 1.35) / 0.5)),
          }}
        >
          MILESTONES · 关键节点
        </div>

        {/* 横轴 */}
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 900,
            width: axisW * EASE.move(seg(t, 1.45, 2.5)),
            height: 1,
            background: `linear-gradient(90deg, ${rgba(s.a1, 0.7)}, ${rgba(s.a1, 0.18)})`,
          }}
        />

        {p.milestones.slice(0, 3).map((m, i) => {
          const st = 1.5 + i * 0.34;
          const pi = EASE.pop(seg(t, st, st + 0.45));
          const ptx = EASE.enter(seg(t, st + 0.05, st + 0.65));
          const cx = marks[i];
          return (
            <div key={i} style={{ position: 'absolute', left: cx - boxW / 2, top: 730, width: boxW }}>
              <div
                style={{
                  textAlign: 'center',
                  fontFamily: '"Oswald","Noto Sans SC",sans-serif',
                  fontSize: 58,
                  fontWeight: 600,
                  letterSpacing: 2,
                  lineHeight: '66px',
                  color: rgba(s.a1, 0.95),
                  opacity: ptx,
                  transform: `translateY(${(1 - ptx) * 16}px)`,
                }}
              >
                {m.t}
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: boxW / 2 - 8,
                  top: 162,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: s.pg,
                  border: `1.5px solid ${rgba(s.a1, 0.95)}`,
                  boxShadow: `0 0 22px ${rgba(s.a1, 0.55)}`,
                  transform: `scale(${pi})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: boxW / 2 - 3,
                  top: 167,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: s.a1,
                  transform: `scale(${pi})`,
                }}
              />
              <div
                style={{
                  marginTop: 34,
                  textAlign: 'center',
                  fontSize: 38,
                  lineHeight: '46px',
                  height: 46,
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: s.ink,
                  opacity: ptx,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  /* 让开横轴：轴在 y=900，说明文字必须整体落在轴下方 */
                  marginTop: 60,
                  textAlign: 'center',
                  fontSize: 25,
                  lineHeight: '34px',
                  color: s.dim,
                  opacity: ptx,
                  /* 说明允许换行：原来 nowrap + ellipsis 会把长句截断成省略号 */
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  maxWidth: boxW,
                }}
              >
                {m.note}
              </div>
            </div>
          );
        })}

        <Rule s={s} t={t} x={88} y={1080} w={120} start={2.9} color={rgba(s.a1, 0.8)} />
        <Quote s={s} t={t} text={p.quote} x={88} y={1116} w={904} size={40} start={2.95} lines={2} />
        <div
          style={{
            position: 'absolute',
            left: 88,
            top: 1330,
            width: 904,
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            opacity: Math.min(1, Math.max(0, (t - 3.55) / 0.7)),
          }}
        >
          <div style={{ width: 40, height: 1, background: s.a1 }} />
          <div style={{ fontSize: 32, letterSpacing: 2, color: s.ink }}>{p.honoree}</div>
          <div style={{ fontSize: 26, letterSpacing: 2, color: s.faint }}>· {p.role}</div>
        </div>
        <ChapterRail
          s={s}
          t={t}
          labels={[p.title, p.metric.label, '谨此祝贺']}
          y={1476}
          active={2}
          start={3.6}
        />
        <Sfx name="pop" at={1.55} vol={0.2} />
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
