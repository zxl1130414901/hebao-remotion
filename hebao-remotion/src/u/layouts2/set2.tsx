import React from 'react';
import type { LP } from './base';
import { MX, MW, CX } from './base';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Lead, Metric, Tag, Title } from '../kit/Type';
import { EndCard, FactRow, Rule, Sfx } from '../kit/Bits';
import { EASE, fitSize, outBack, outQuint, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';

/* ============ 06 · 拼贴 COLLAGE ============ 斜贴卡片 + 胶带，海报拼贴感 */
export const Collage: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const tape = (x: number, y: number, rot: number) => (
    <div style={{ position: 'absolute', left: x, top: y, width: 120, height: 34, background: rgba(s.a1, 0.35), transform: `rotate(${rot}deg)`, borderRadius: 2 }} />
  );
  const cards = [
    { x: 130, y: 400, w: 760, rot: arr ? -3 : 3, el: (<><div style={{ fontSize: 24, letterSpacing: 6, color: s.faint }}>{p.brand}</div><div style={{ fontSize: 40, fontWeight: 800, color: s.ink, marginTop: 14 }}>{p.kicker}</div></>) },
    { x: 90, y: 620, w: 840, rot: arr ? 2 : -2, el: (<div style={{ fontWeight: 900, fontSize: fitSize(p.title, 760, 120, 4, 44), whiteSpace: 'nowrap', color: s.ink, textAlign: 'center' }}>{p.title}</div>) },
    { x: 200, y: 880, w: 620, rot: arr ? -2 : 2, el: (<div style={{ fontSize: 30, color: s.dim, textAlign: 'center', lineHeight: 1.6 }}>{p.subtitle}</div>) },
  ];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.03} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={22}>
        {cards.map((c, i) => (
          <div key={i} style={{ position: 'absolute', left: c.x, top: c.y, width: c.w, padding: '44px 48px', background: s.panel, border: `1px solid ${s.panelLine}`, borderRadius: 10, boxShadow: '0 14px 40px rgba(0,0,0,.22)', transform: `rotate(${c.rot}deg) scale(${0.85 + outBack(seg(t, 0.15 + i * 0.25, 0.85 + i * 0.25)) * 0.15})`, opacity: EASE.enter(seg(t, 0.15 + i * 0.25, 0.75 + i * 0.25)) }}>
            {c.el}
            {tape(30, -14, -8 + i * 7)}
            {tape(c.w - 150, -14, 9 - i * 6)}
          </div>
        ))}
        <div style={{ position: 'absolute', left: MX, top: 1140, width: MW, textAlign: 'center' }}>
          <Tag s={s} t={t} text={p.award} x={MX} y={1140} align="center" w={MW} start={1.2} solid />
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1240, width: MW, textAlign: 'center', fontSize: 26, color: s.faint, letterSpacing: 4, opacity: EASE.enter(seg(t, 1.5, 2.0)) }}>{p.honoree} · {p.role}</div>
        <Sfx name="pop" at={0.3} vol={0.2} />
        <Sfx name="pop" at={0.55} vol={0.18} />
        <Sfx name="pop" at={0.8} vol={0.18} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={24}>
        <Kicker s={s} t={t} text="榜单 · 拼贴墙" x={MX} y={340} align="center" w={MW} start={3.6} size={26} />
        {p.rows.slice(0, 5).map((r, i) => {
          const yy = 430 + i * 122;
          const rot = (i % 2 === 0 ? -1 : 1) * (1.2 + (i % 3) * 0.8) * (arr ? -1 : 1);
          const pop = outBack(seg(t, 3.7 + i * 0.14, 4.25 + i * 0.14));
          return (
            <div key={i} style={{ position: 'absolute', left: 110 + (i % 2) * 24, top: yy, width: 780, padding: '20px 34px', background: i === 0 ? rgba(s.a1, 0.16) : s.panel, border: `1px solid ${i === 0 ? rgba(s.a1, 0.6) : s.panelLine}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 22, transform: `rotate(${rot}deg) scale(${0.8 + pop * 0.2})`, opacity: Math.min(1, pop * 1.4), boxShadow: '0 10px 26px rgba(0,0,0,.2)' }}>
              <span style={{ fontFamily: s.numFamily, fontWeight: 700, fontSize: 40, color: i === 0 ? s.a1 : s.faint, width: 56 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 34, fontWeight: 700, color: s.ink, whiteSpace: 'nowrap' }}>{r.name}</span>
              <span style={{ fontSize: 22, color: s.faint, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{r.role}</span>
              <span style={{ fontFamily: s.numFamily, fontSize: 36, fontWeight: 700, color: i === 0 ? s.a1 : s.dim }}>{r.value}</span>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1120, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 4.6, 5.1)) }}>{p.metric.label} · 冠军 {p.rows[0]?.value ?? ''} {p.metric.unit}</div>
        <div style={{ position: 'absolute', left: MX, top: 1190, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.quote, 872, 44, 2, 26), color: s.ink, opacity: EASE.enter(seg(t, 4.9, 5.4)) }}>{p.quote}</div>
        <Sfx name="impact" at={3.75} vol={0.22} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 07 · 斜切 DIAG ============ 画面斜向劈成两半，徽章骑在缝上 */
export const Diag: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const k = arr ? -1 : 1;
  const sweep = EASE.move(seg(t, 0.1, 1.0));
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      {/* 斜切背景 */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${150 * k}deg, ${rgba(s.a1, 0.14)} 0%, ${rgba(s.a2, 0.08)} 100%)`, clipPath: `polygon(0 0,100% 0,100% ${28 * k > 0 ? 32 : 68}%,0 ${28 * k > 0 ? 68 : 32}%)` }} />
      <div style={{ position: 'absolute', left: -100, top: 1030, width: 1280, height: 5, background: `linear-gradient(90deg,${rgba(s.a1, 0)},${s.a1},${rgba(s.a1, 0)})`, transform: `rotate(${10 * k}deg) scaleX(${sweep})`, transformOrigin: arr ? 'right' : 'left' }} />
      <Scene t={t} inAt={0.02} outAt={3.4} y={18}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={300} align="center" w={MW} start={0.08} />
        <Title s={s} t={t} text={p.title} x={MX} y={400} w={MW} size={150} start={0.25} align="center" lines={1} glow={s.titleGlow} />
        <Lead s={s} t={t} text={p.subtitle} x={MX} y={640} w={MW} size={36} start={0.7} align="center" lines={2} />
        {/* 骑缝徽章 */}
        <div style={{ position: 'absolute', left: CX - 130, top: 950, width: 260, height: 260, borderRadius: '50%', background: s.pg, border: `3px solid ${s.a1}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `rotate(${12 * k}deg) scale(${0.6 + outBack(seg(t, 1.0, 1.7)) * 0.4})`, boxShadow: '0 20px 60px rgba(0,0,0,.35)' }}>
          <div style={{ fontSize: 20, letterSpacing: 5, color: s.faint }}>AWARD</div>
          <div style={{ fontWeight: 900, fontSize: fitSize(p.award, 176, 42, 2, 20), color: s.ink, textAlign: 'center', marginTop: 8, whiteSpace: 'nowrap' }}>{p.award}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1330, width: MW, textAlign: 'center', fontSize: 24, letterSpacing: 8, color: s.faint, opacity: EASE.enter(seg(t, 1.5, 2.0)) }}>THE HONOUR GOES TO</div>
        <div style={{ position: 'absolute', left: MX, top: 1390, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 76, 3, 34), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 1.6, 2.1)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 1480, width: MW, textAlign: 'center', fontSize: 24, color: s.dim, opacity: EASE.enter(seg(t, 1.8, 2.3)) }}>{p.role}</div>
        <Sfx name="whoosh" at={0.2} vol={0.24} />
        <Sfx name="impact" at={1.35} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <div style={{ position: 'absolute', left: MX, top: 380, width: MW, textAlign: 'center', fontSize: 26, letterSpacing: 8, color: s.faint, opacity: EASE.enter(seg(t, 3.6, 4.1)) }}>THE HONOUR GOES TO</div>
        <div style={{ position: 'absolute', left: MX, top: 450, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 104, 3, 40), whiteSpace: 'nowrap', color: s.ink, opacity: EASE.enter(seg(t, 3.7, 4.2)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 590, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 4.0, 4.4)) }}>{p.role}</div>
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={700} w={MW} size={195} start={4.1} align="center" />
        {p.facts.slice(0, 3).map((f, i) => (
          <FactRow key={i} s={s} t={t} k={f.k} v={f.v} x={MX + (MW / 3) * i} y={1180} w={MW / 3 - 30} start={4.9 + i * 0.13} align="col" big />
        ))}
        <div style={{ position: 'absolute', left: MX, top: 1380, width: MW, textAlign: 'center', fontSize: 26, color: s.faint, opacity: EASE.enter(seg(t, 5.3, 5.8)) }}>{p.quote}</div>
        <Sfx name="chime" at={4.1} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 08 · 胶片 FILM ============ 竖向胶片带，帧内容向上滚动 */
export const Film: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const SX = 230, SW = 620, SY = 170, SH = 1580;
  const holes = Array.from({ length: 18 });
  const frame = (y: number, h: number, node: React.ReactNode) => (
    <div style={{ position: 'absolute', left: 74, top: y, width: SW - 148, height: h, background: s.panel, border: `1px solid ${s.panelLine}`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>{node}</div>
  );
  const act2 = t >= 3.5;
  const scroll = act2 ? 0 : (t * 46) % 1;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_creative.wav">
      <Kicker s={s} t={t} text={p.kicker} x={MX} y={92} align="center" w={MW} start={0.05} size={26} />
      {/* 胶片带 */}
      <div style={{ position: 'absolute', left: SX, top: SY, width: SW, height: SH, background: s.mode === 'dark' ? 'rgba(0,0,0,.45)' : 'rgba(20,18,14,.08)', borderRadius: 14, overflow: 'hidden' }}>
        {holes.map((_, i) => (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: 18, top: 22 + i * 88, width: 38, height: 54, borderRadius: 8, background: s.mode === 'dark' ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.14)' }} />
            <div style={{ position: 'absolute', right: 18, top: 22 + i * 88, width: 38, height: 54, borderRadius: 8, background: s.mode === 'dark' ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.14)' }} />
          </React.Fragment>
        ))}
        {/* 帧内容（滚动列） */}
        <div style={{ position: 'absolute', left: 0, top: act2 ? 0 : -scroll * 400, width: SW, transition: 'none' }}>
          {act2 ? (
            <>
              {frame(70, 400, (<><div style={{ fontSize: 22, letterSpacing: 6, color: s.faint }}>HONOREE</div><div style={{ fontWeight: 900, fontSize: fitSize(p.honoree, 400, 74, 2, 32), color: s.ink, textAlign: 'center' }}>{p.honoree}</div><div style={{ fontSize: 22, color: s.dim }}>{p.role}</div></>))}
              {frame(520, 420, (<><div style={{ fontFamily: s.numFamily, fontWeight: s.numWeight, fontSize: 120, color: s.a1 }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)}<span style={{ fontSize: 40, color: s.dim }}>{p.metric.unit}</span></div><div style={{ fontSize: 24, color: s.dim, letterSpacing: 3 }}>{p.metric.label}</div></>))}
              {frame(990, 400, (<>{p.facts.slice(0, 3).map((f, i) => (<div key={i} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}><span style={{ fontSize: 30, fontWeight: 700, color: s.ink }}>{f.v}</span><span style={{ fontSize: 20, color: s.faint }}>{f.k}</span></div>))}</>))}
            </>
          ) : (
            <>
              {frame(60, 380, (<><div style={{ fontSize: 22, letterSpacing: 6, color: s.faint }}>SCENE 01</div><div style={{ fontWeight: 900, fontSize: fitSize(p.title, 400, 84, 3, 34), color: s.ink, textAlign: 'center' }}>{p.title}</div></>))}
              {frame(490, 380, (<><div style={{ fontSize: 30, color: s.dim, textAlign: 'center', lineHeight: 1.7 }}>{p.subtitle}</div></>))}
              {frame(920, 380, (<><div style={{ fontSize: 22, letterSpacing: 4, color: s.faint }}>AWARD</div><div style={{ fontWeight: 800, fontSize: fitSize(p.award, 400, 52, 2, 26), color: s.ink }}>{p.award}</div><div style={{ fontSize: 20, color: s.faint, marginTop: 6 }}>{p.dateText}</div></>))}
            </>
          )}
        </div>
      </div>
      <Sfx name={act2 ? 'chime' : 'whoosh'} at={act2 ? 3.55 : 0.2} vol={0.2} />
      {/* 侧边竖排注 */}
      <div style={{ position: 'absolute', left: arr ? 96 : 952, top: 620, writingMode: 'vertical-rl', fontSize: 24, letterSpacing: 14, color: s.faint, opacity: EASE.enter(seg(t, 1.0, 1.6)) }}>HONOUR · FILM REEL · {p.dateText}</div>
    </Page>
  );
};

/* ============ 09 · 字幕条 BCAST ============ 新闻式全宽色条自左推入 */
export const Bcast: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const bar = (y: number, h: number, fill: string, start: number, node: React.ReactNode) => {
    const w = EASE.move(seg(t, start, start + 0.55));
    return (
      <div style={{ position: 'absolute', left: 0, top: y, width: 1080, height: h }}>
        <div style={{ position: 'absolute', inset: 0, background: fill, transform: `translateX(${(1 - w) * -1080}px)` }} />
        <div style={{ position: 'absolute', left: 88, top: 0, height: h, display: 'flex', alignItems: 'center', opacity: EASE.enter(seg(t, start + 0.25, start + 0.75)) }}>{node}</div>
      </div>
    );
  };
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        {bar(140, 92, rgba(s.a1, 0.92), 0.1, (<span style={{ fontSize: 28, letterSpacing: 6, color: s.mode === 'dark' ? '#0A0C12' : '#fff', fontWeight: 800 }}>{p.brand}</span>))}
        <div style={{ position: 'absolute', left: MX, top: 420, width: MW, fontSize: 30, letterSpacing: 4, color: s.dim, opacity: EASE.enter(seg(t, 0.5, 1.0)) }}>{p.kicker}</div>
        <Title s={s} t={t} text={p.title} x={MX} y={520} w={MW} size={168} start={0.6} align="center" lines={1} glow={s.titleGlow} />
        {bar(1440, 110, s.mode === 'dark' ? 'rgba(255,255,255,.92)' : 'rgba(10,12,18,.88)', 0.9, (<span style={{ fontSize: 56, fontWeight: 900, color: s.a1, letterSpacing: 4 }}>{p.title}</span>))}
        {bar(1550, 78, rgba(s.a2, 0.85), 1.1, (<span style={{ fontSize: 30, color: '#fff', letterSpacing: 2 }}>{p.subtitle}</span>))}
        <Sfx name="whoosh" at={0.12} vol={0.24} />
        <Sfx name="whoosh" at={0.92} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={18}>
        <div style={{ position: 'absolute', left: MX, top: 200, fontSize: 26, letterSpacing: 6, color: s.faint, opacity: EASE.enter(seg(t, 3.6, 4.0)) }}>BREAKING · {p.award}</div>
        {p.rows.slice(0, 5).map((r, i) => {
          const y = 300 + i * 128;
          const inn = EASE.move(seg(t, 3.65 + i * 0.13, 4.15 + i * 0.13));
          return (
            <div key={i} style={{ position: 'absolute', left: 0, top: y, width: 1080, opacity: inn, transform: `translateX(${(1 - inn) * -80}px)` }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 14, height: 96, background: i === 0 ? s.a1 : rgba(s.a1, 0.4) }} />
              <div style={{ position: 'absolute', left: 14, top: 0, width: 1066 - 88, height: 96, background: i === 0 ? rgba(s.a1, 0.14) : s.panel, display: 'flex', alignItems: 'center', gap: 24, paddingLeft: 30 }}>
                <span style={{ fontFamily: s.numFamily, fontSize: 30, color: i === 0 ? s.a1 : s.faint, width: 44 }}>{i + 1}</span>
                <span style={{ fontSize: 34, fontWeight: 700, color: s.ink }}>{r.name}</span>
                <span style={{ fontSize: 22, color: s.faint, flex: 1 }}>{r.role}</span>
                <span style={{ fontFamily: s.numFamily, fontSize: 38, fontWeight: 700, color: i === 0 ? s.a1 : s.dim, paddingRight: 26 }}>{r.value}</span>
              </div>
            </div>
          );
        })}
        {bar(1100, 104, rgba(s.a2, 0.9), 4.4, (<span style={{ fontSize: 44, fontWeight: 800, color: '#fff' }}>{p.metric.label} · {p.metric.value.toFixed(p.metric.decimals ?? 0)}{p.metric.unit}</span>))}
        <div style={{ position: 'absolute', left: MX, top: 1290, width: MW, fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 4.9, 5.4)) }}>{p.honoree} · {p.role}</div>
        <Sfx name="impact" at={3.7} vol={0.24} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 10 · 图表 CHART ============ 环形进度 + 三条数据横杆 */
export const Chart: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const R = 190, CIRC = 2 * Math.PI * R;
  const pct = 0.82;
  const fr = [0.86, 0.62, 0.44];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={230} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={320} w={MW} size={104} start={0.2} align="center" lines={1} />
        <svg width={R * 2 + 60} height={R * 2 + 60} style={{ position: 'absolute', left: CX - R - 30, top: 560 }}>
          <circle cx={R + 30} cy={R + 30} r={R} fill="none" stroke={rgba(s.ink, 0.1)} strokeWidth={30} />
          <circle cx={R + 30} cy={R + 30} r={R} fill="none" stroke={s.a1} strokeWidth={30} strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct * EASE.move(seg(t, 0.5, 1.9)))} transform={`rotate(-90 ${R + 30} ${R + 30})`} />
          <circle cx={R + 30} cy={R + 30} r={R - 52} fill="none" stroke={rgba(s.a2, 0.7)} strokeWidth={8} strokeDasharray={`6 14`} />
        </svg>
        <div style={{ position: 'absolute', left: MX, top: 800, width: MW, textAlign: 'center', fontFamily: s.numFamily, fontWeight: s.numWeight, fontSize: 120, color: s.ink }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)}<span style={{ fontSize: 40, color: s.dim }}>{p.metric.unit}</span></div>
        <div style={{ position: 'absolute', left: MX, top: 950, width: MW, textAlign: 'center', fontSize: 28, letterSpacing: 4, color: s.dim }}>{p.metric.label}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1120} align="center" w={MW} start={1.6} />
        <Sfx name="whoosh" at={0.5} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <div style={{ position: 'absolute', left: MX, top: 300, width: MW, fontSize: 26, letterSpacing: 6, color: s.faint, opacity: EASE.enter(seg(t, 3.6, 4.0)) }}>关键指标 · {p.honoree}</div>
        {p.facts.slice(0, 3).map((f, i) => {
          const w = outQuint(seg(t, 3.8 + i * 0.2, 4.9 + i * 0.2));
          return (
            <div key={i} style={{ position: 'absolute', left: MX, top: 400 + i * 220, width: MW }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <span style={{ fontSize: 30, color: s.dim }}>{f.k}</span>
                <span style={{ fontFamily: s.numFamily, fontSize: 56, fontWeight: 700, color: i === 0 ? s.a1 : s.ink, opacity: EASE.enter(seg(t, 4.2 + i * 0.2, 4.7 + i * 0.2)) }}>{f.v}</span>
              </div>
              <div style={{ height: 22, borderRadius: 11, background: rgba(s.ink, 0.08), overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${fr[i] * 100}%`, borderRadius: 11, background: `linear-gradient(90deg,${s.a1},${rgba(s.a2, 0.8)})`, transform: `scaleX(${w})`, transformOrigin: 'left' }} />
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1140, width: MW, textAlign: 'center', fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif', fontSize: 32, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Rule s={s} t={t} x={MX} y={1260} w={MW} start={5.1} color={rgba(s.a1, 0.35)} />
        <div style={{ position: 'absolute', left: MX, top: 1300, width: MW, textAlign: 'center', fontSize: 26, color: s.faint, opacity: EASE.enter(seg(t, 5.2, 5.7)) }}>{p.role} · {p.subtitle}</div>
        <Sfx name="chime" at={3.85} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
