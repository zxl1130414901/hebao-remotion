import React from 'react';
import type { LP } from './base';
import { MX, MW, CX } from './base';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Lead, Metric, Tag, Title } from '../kit/Type';
import { EndCard, FactRow, Rule, Sfx } from '../kit/Bits';
import { EASE, fitSize, makeRng, outBack, outQuint, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';

/* ============ 21 · 揭幕 TEAR ============ 封页沿锯齿缝撕开，露出贺报 */
export const Tear: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const rng = makeRng(4242);
  const teeth = Array.from({ length: 15 }, (_, i) => 0.5 + (rng() - 0.5) * 0.16);
  const zig = (sign: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 14; i++) pts.push(`${(i / 14) * 100}% ${(sign > 0 ? teeth[i] : 1 - teeth[14 - i]) * 100}%`);
    return sign > 0 ? `polygon(0 0,100% 0,${pts.reverse().join(',')})` : `polygon(${pts.join(',')},100% 100%,0 100%)`;
  };
  const open = outQuint(seg(t, 0.9, 2.0));
  const coverStyle = (half: 0 | 1): React.CSSProperties => ({
    position: 'absolute', left: 0, width: '100%', height: '55%',
    background: `linear-gradient(${half === 0 ? 180 : 0}deg, ${rgba(s.ink, s.mode === 'dark' ? 0.14 : 0.1)}, ${rgba(s.a1, 0.05)})`,
    clipPath: zig(half === 0 ? 1 : -1),
    top: half === 0 ? 0 : '45%',
    transform: half === 0 ? `translateY(${-open * 1100}px) rotate(${open * (arr ? 2.5 : -2.5)}deg)` : `translateY(${open * 1100}px) rotate(${open * (arr ? -2.5 : 2.5)}deg)`,
    transformOrigin: half === 0 ? 'top left' : 'bottom right',
    zIndex: 30,
  });
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={18}>
        <div style={{ position: 'absolute', left: MX, top: 500, width: MW, textAlign: 'center' }}>
          <Kicker s={s} t={t} text={p.kicker} x={MX} y={500} align="center" w={MW} start={1.0} />
          <Title s={s} t={t} text={p.title} x={MX} y={600} w={MW} size={150} start={1.1} align="center" lines={1} glow={s.titleGlow} />
          <Lead s={s} t={t} text={p.subtitle} x={MX} y={840} w={MW} size={34} start={1.45} align="center" lines={2} />
        </div>
        <Sfx name="whoosh" at={0.95} vol={0.3} />
        <Sfx name="impact" at={1.95} vol={0.24} />
      </Scene>
      {/* 撕开的封页（始终存在，掀开后就离场） */}
      {open < 1 && (
        <>
          <div style={coverStyle(0)}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 60, textAlign: 'center', fontSize: 30, letterSpacing: 12, color: s.faint, opacity: 1 - open }}>{p.brand}</div>
          </div>
          <div style={coverStyle(1)}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontSize: 22, letterSpacing: 8, color: s.faint, opacity: 1 - open }}>{p.dateText}</div>
          </div>
        </>
      )}

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <div style={{ position: 'absolute', left: MX, top: 360, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 104, 3, 40), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 3.6, 4.1)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 500, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 3.9, 4.3)) }}>{p.role}</div>
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={620} w={MW} size={195} start={4.0} align="center" />
        {p.facts.slice(0, 3).map((f, i) => (
          <FactRow key={i} s={s} t={t} k={f.k} v={f.v} x={MX + (MW / 3) * i} y={1120} w={MW / 3 - 30} start={4.8 + i * 0.13} align="col" big />
        ))}
        <div style={{ position: 'absolute', left: MX, top: 1330, width: MW, textAlign: 'center', fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 5.2, 5.7)) }}>{p.quote}</div>
        <Sfx name="impact" at={4.05} vol={0.24} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 22 · 点灯 LIGHTS ============ 万家灯火逐格点亮，贺词浮在灯海上 */
export const Lights: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const rng = makeRng(9001);
  const COLS = 13, ROWS = 15, CELL = 40, GAP = 26;
  const gw = COLS * CELL + (COLS - 1) * GAP;
  const gx = (1080 - gw) / 2, gy = 430;
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({ lit: rng() > 0.32, hot: rng() > 0.93, col: i % COLS, row: Math.floor(i / COLS) }));
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      {cells.map((c, i) => {
        const when = 0.35 + c.row * 0.075 + (c.col % 4) * 0.045;
        const on = t > when ? 1 : 0;
        const glow = 0.75 + 0.25 * Math.sin(t * 2.4 + i * 0.7);
        const base = rgba(c.hot ? s.a2 : s.a1, (c.lit ? 0.55 : 0.12) * glow * on + 0.06);
        return <div key={i} style={{ position: 'absolute', left: gx + c.col * (CELL + GAP), top: gy + c.row * (CELL + GAP), width: CELL, height: CELL, borderRadius: 9, background: base, boxShadow: c.lit && on ? `0 0 18px ${rgba(c.hot ? s.a2 : s.a1, 0.5)}` : undefined }} />;
      })}
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <div style={{ position: 'absolute', left: CX - 330, top: 760, width: 660, textAlign: 'center', padding: '66px 40px', background: s.pg, border: `1px solid ${rgba(s.a1, 0.5)}`, borderRadius: s.radius, boxShadow: '0 30px 90px rgba(0,0,0,.45)', opacity: outBack(seg(t, 1.1, 1.9)) }}>
          <Kicker s={s} t={t} text={p.kicker} x={CX - 330} y={840} align="center" w={660} start={1.3} size={24} />
          <div style={{ marginTop: 96, fontWeight: 900, fontSize: fitSize(p.title, 560, 96, 4, 36), color: s.ink, whiteSpace: 'nowrap' }}>{p.title}</div>
          <div style={{ marginTop: 26, fontSize: 26, color: s.dim }}>{p.subtitle}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1330, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 2.2, 2.7)) }}>{p.honoree} · {p.role}</div>
        <Sfx name="shimmer" at={1.2} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <div style={{ position: 'absolute', left: CX - 360, top: 620, width: 720, textAlign: 'center', padding: '56px 40px', background: s.pg, border: `1px solid ${rgba(s.a1, 0.5)}`, borderRadius: s.radius, boxShadow: '0 30px 90px rgba(0,0,0,.45)' }}>
          <div style={{ fontSize: 22, letterSpacing: 8, color: s.faint }}>THE HONOUR GOES TO</div>
          <div style={{ marginTop: 20, fontWeight: 900, fontSize: fitSize(p.honoree, 640, 84, 3, 30), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ marginTop: 12, fontSize: 24, color: s.dim }}>{p.role}</div>
          <div style={{ marginTop: 30, fontFamily: s.numFamily, fontWeight: s.numWeight, fontSize: 100, color: s.a1 }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)}<span style={{ fontSize: 36, color: s.dim }}>{p.metric.unit}</span></div>
          <div style={{ fontSize: 24, color: s.faint, marginTop: 8 }}>{p.metric.label}</div>
        </div>
        {p.facts.slice(0, 3).map((f, i) => (
          <FactRow key={i} s={s} t={t} k={f.k} v={f.v} x={MX + (MW / 3) * i} y={1210} w={MW / 3 - 30} start={4.8 + i * 0.13} align="col" big />
        ))}
        <div style={{ position: 'absolute', left: MX, top: 1400, width: MW, textAlign: 'center', fontSize: 26, color: s.faint, opacity: EASE.enter(seg(t, 5.2, 5.7)) }}>{p.award} · {p.quote}</div>
        <Sfx name="impact" at={3.85} vol={0.24} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 23 · 星图 STARS ============ 星点连线织成网，三颗主星是里程碑 */
export const Stars: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const rng = makeRng(arr ? 777 : 778);
  const nodes = Array.from({ length: 10 }, () => ({ x: 130 + rng() * 820, y: 480 + rng() * 760 }));
  const big = arr ? [1, 4, 7] : [2, 5, 8];
  const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [1, 5], [3, 7]];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={250} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={340} w={MW} size={116} start={0.2} align="center" lines={1} glow={s.titleGlow} />
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {links.map(([a, b], i) => {
            const draw = EASE.move(seg(t, 0.4 + i * 0.11, 1.0 + i * 0.11));
            const A = nodes[a], B = nodes[b];
            const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy);
            return <line key={i} x1={A.x} y1={A.y} x2={A.x + dx * draw} y2={A.y + dy * draw} stroke={rgba(s.a1, 0.5)} strokeWidth={2} strokeDasharray={len} />;
          })}
          {nodes.map((n, i) => {
            const isBig = big.includes(i);
            const born = outBack(seg(t, 0.35 + (i % 5) * 0.12, 0.9 + (i % 5) * 0.12));
            const tw = 0.7 + 0.3 * Math.sin(t * 2.2 + i * 1.3);
            return (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={(isBig ? 14 : 6) * born} fill={isBig ? s.a1 : rgba(s.ink, 0.7 * tw)} />
                {isBig && <circle cx={n.x} cy={n.y} r={30 * born} fill="none" stroke={rgba(s.a1, 0.6)} strokeWidth={2} />}
              </g>
            );
          })}
        </svg>
        {p.milestones.slice(0, 3).map((m, i) => {
          const n = nodes[big[i]];
          return (
            <div key={i} style={{ position: 'absolute', left: Math.min(n.x - 60, 830), top: n.y + (i % 2 ? 40 : -96), width: 220, textAlign: 'center', opacity: EASE.enter(seg(t, 1.4 + i * 0.25, 1.9 + i * 0.25)) }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: s.a1 }}>{m.t}</div>
              <div style={{ fontSize: 21, color: s.dim, marginTop: 4 }}>{m.label}</div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1400, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 2.3, 2.8)) }}>{p.subtitle}</div>
        <Sfx name="shimmer" at={0.5} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <div style={{ position: 'absolute', left: MX, top: 380, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 100, 3, 40), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 3.6, 4.1)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 520, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 3.9, 4.3)) }}>{p.role}</div>
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={640} w={MW} size={190} start={4.0} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 1120, width: MW, textAlign: 'center', fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif', fontSize: 32, color: s.dim, opacity: EASE.enter(seg(t, 4.7, 5.2)) }}>{p.quote}</div>
        {p.facts.slice(0, 3).map((f, i) => (
          <FactRow key={i} s={s} t={t} k={f.k} v={f.v} x={MX + (MW / 3) * i} y={1260} w={MW / 3 - 30} start={4.9 + i * 0.13} align="col" big />
        ))}
        <Sfx name="impact" at={4.05} vol={0.22} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 24 · 门格 BENTO ============ 六张圆角卡片大小错落拼成版面 */
export const Bento: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const card = (x: number, y: number, w: number, h: number, i: number, node: React.ReactNode, hl = false) => {
    const pop = outBack(seg(t, 0.15 + i * 0.16, 0.8 + i * 0.16));
    return (
      <div key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: hl ? rgba(s.a1, 0.14) : s.panel, border: `1px solid ${hl ? rgba(s.a1, 0.55) : s.panelLine}`, borderRadius: 26, padding: 34, opacity: Math.min(1, pop * 1.4), transform: `scale(${0.8 + pop * 0.2})`, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        {node}
      </div>
    );
  };
  const flip = arr ? 1 : -1;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        {card(MX, 300, 540, 330, 0, (<><div style={{ fontSize: 22, letterSpacing: 6, color: s.faint }}>{p.brand}</div><div style={{ marginTop: 20, fontWeight: 900, fontSize: fitSize(p.title, 460, 96, 3, 34), color: s.ink, whiteSpace: 'nowrap' }}>{p.title}</div><div style={{ marginTop: 16, fontSize: 24, color: s.dim }}>{p.kicker}</div></>))}
        {card(652, 300, 340, 330, 1, (<><div style={{ fontSize: 20, letterSpacing: 4, color: s.faint }}>AWARD</div><div style={{ marginTop: 18, fontWeight: 800, fontSize: fitSize(p.award, 270, 44, 2, 20), color: s.a1 }}>{p.award}</div><div style={{ marginTop: 14, fontSize: 21, color: s.faint }}>{p.dateText}</div></>), arr === 0)}
        {card(MX, 660, 904, 380, 2, (<><div style={{ fontSize: 22, letterSpacing: 5, color: s.faint }}>{p.metric.label}</div><div style={{ fontFamily: s.numFamily, fontWeight: s.numWeight, fontSize: 170, color: s.ink, lineHeight: 1.05, marginTop: 10, textShadow: s.titleGlow }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)}<span style={{ fontSize: 56, color: s.dim }}>{p.metric.unit}</span></div></>), arr === 1)}
        {card(MX, 1070, 440, 330, 3, (<><div style={{ fontSize: 20, letterSpacing: 4, color: s.faint }}>HONOREE</div><div style={{ marginTop: 16, fontWeight: 800, fontSize: fitSize(p.honoree, 370, 56, 2, 24), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div><div style={{ marginTop: 10, fontSize: 22, color: s.dim }}>{p.role}</div></>))}
        {card(552, 1070, 440, 330, 4, (<><div style={{ fontSize: 20, letterSpacing: 4, color: s.faint }}>QUOTE</div><div style={{ marginTop: 16, fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif', fontSize: 26, lineHeight: 1.8, color: s.dim }}>{p.quote}</div></>))}
        <div style={{ position: 'absolute', left: MX, top: 1470, width: MW, textAlign: 'center', fontSize: 25, color: s.faint, opacity: EASE.enter(seg(t, 1.4, 1.9)) }}>{p.subtitle}</div>
        <Sfx name="pop" at={0.25} vol={0.18} />
        <Sfx name="pop" at={0.6} vol={0.16} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={18}>
        {/* 左：冠军长卡（独立一列，不再与数据卡抢位置） */}
        <div style={{ position: 'absolute', left: MX, top: 380, width: 430, height: 1250, background: rgba(s.a1, 0.12), border: `1px solid ${rgba(s.a1, 0.5)}`, borderRadius: 26, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', opacity: outBack(seg(t, 3.55, 4.2)) }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: s.faint }}>TOP 1</div>
          <div style={{ marginTop: 24, fontWeight: 900, fontSize: fitSize(p.honoree, 350, 68, 2, 26), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ marginTop: 12, fontSize: 22, color: s.dim }}>{p.role}</div>
          <div style={{ width: 120, height: 2, background: rgba(s.a1, 0.7), margin: '34px auto' }} />
          <div style={{ fontSize: 26, color: s.dim, lineHeight: 1.9 }}>{p.quote}</div>
          <div style={{ marginTop: 40, fontSize: 22, color: s.faint }}>{p.milestones[0]?.t} · {p.milestones[0]?.label}</div>
          <div style={{ marginTop: 8, fontSize: 22, color: s.dim }}>{p.milestones[0]?.note}</div>
        </div>
        {/* 右：三格数据 + 奖项目 */}
        {p.facts.slice(0, 3).map((f, i) => (
          <div key={i} style={{ position: 'absolute', left: 552, top: 380 + i * 300, width: 440, height: 280, background: s.panel, border: `1px solid ${s.panelLine}`, borderRadius: 26, padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: outBack(seg(t, 3.6 + i * 0.16, 4.2 + i * 0.16)) }}>
            <div style={{ fontSize: 22, color: s.dim }}>{f.k}</div>
            <div style={{ marginTop: 18, fontFamily: s.numFamily, fontWeight: 700, fontSize: fitSize(f.v, 360, 78, 1, 30), color: i === 0 ? s.a1 : s.ink, whiteSpace: 'nowrap' }}>{f.v}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', left: 552, top: 1280, width: 440, height: 350, background: s.panel, border: `1px solid ${s.panelLine}`, borderRadius: 26, padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: outBack(seg(t, 4.7, 5.3)) }}>
          <div style={{ fontSize: 21, color: s.faint, letterSpacing: 2 }}>{p.award}</div>
          <div style={{ marginTop: 16, fontSize: 25, color: s.ink, lineHeight: 1.8 }}>{p.subtitle}</div>
        </div>
        <Sfx name="impact" at={3.6} vol={0.22} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 25 · 声浪 WAVE ============ 底部律动声浪柱，中央主数字站上最高柱 */
export const Wave: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const N = 42, BW = 14, GAP = 8;
  const total = N * BW + (N - 1) * GAP;
  const x0 = (1080 - total) / 2;
  const peak = Math.floor(N / 2);
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={280} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={370} w={MW} size={130} start={0.2} align="center" lines={1} glow={s.titleGlow} />
        <div style={{ position: 'absolute', left: MX, top: 640, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 72, 3, 30), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 0.7, 1.2)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 760, width: MW, textAlign: 'center', fontSize: 26, color: s.dim, opacity: EASE.enter(seg(t, 0.9, 1.4)) }}>{p.role}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={880} align="center" w={MW} start={1.2} />
        {Array.from({ length: N }).map((_, i) => {
          const d = Math.abs(i - peak);
          const h = (14 + 300 * Math.max(0, 1 - d / (N / 2)) * (0.5 + 0.5 * Math.sin(t * 5 + i * 0.55)) * (i === peak ? 1.15 : 1)) * outQuint(seg(t, 0.2 + i * 0.02, 0.8 + i * 0.02));
          return <div key={i} style={{ position: 'absolute', left: x0 + i * (BW + GAP), top: 1470 - h, width: BW, height: h, borderRadius: 7, background: i === peak ? `linear-gradient(180deg,${s.a2},${s.a1})` : `linear-gradient(180deg,${rgba(s.a1, 0.85)},${rgba(s.a1, 0.2)})` }} />;
        })}
        <Sfx name="impact" at={0.3} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={18}>
        <div style={{ position: 'absolute', left: MX, top: 420, width: MW, textAlign: 'center', fontSize: 24, letterSpacing: 6, color: s.faint, opacity: EASE.enter(seg(t, 3.6, 4.0)) }}>{p.metric.label}</div>
        <div style={{ position: 'absolute', left: MX, top: 500, width: MW, textAlign: 'center', fontFamily: s.numFamily, fontWeight: s.numWeight, fontSize: 175, color: s.ink, textShadow: s.titleGlow }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)}<span style={{ fontSize: 58, color: s.dim }}>{p.metric.unit}</span></div>
        <div style={{ position: 'absolute', left: MX, top: 800, width: MW, textAlign: 'center', fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif', fontSize: 32, color: s.dim, opacity: EASE.enter(seg(t, 4.4, 4.9)) }}>{p.quote}</div>
        {p.facts.slice(0, 3).map((f, i) => (
          <FactRow key={i} s={s} t={t} k={f.k} v={f.v} x={MX + (MW / 3) * i} y={960} w={MW / 3 - 30} start={4.8 + i * 0.13} align="col" big />
        ))}
        {Array.from({ length: N }).map((_, i) => {
          const d = Math.abs(i - peak);
          const h = (12 + 240 * Math.max(0, 1 - d / (N / 2)) * (0.45 + 0.55 * Math.sin(t * 4.4 + i * 0.5)) * (i === peak ? 1.2 : 1));
          return <div key={i} style={{ position: 'absolute', left: x0 + i * (BW + GAP), top: 1470 - h, width: BW, height: h, borderRadius: 7, background: i === peak ? `linear-gradient(180deg,${s.a2},${s.a1})` : `linear-gradient(180deg,${rgba(s.a2, 0.8)},${rgba(s.a2, 0.15)})` }} />;
        })}
        <div style={{ position: 'absolute', left: MX, top: 1130, width: MW, textAlign: 'center', fontSize: 26, color: s.faint, opacity: EASE.enter(seg(t, 5.2, 5.7)) }}>{p.subtitle}</div>
        <Sfx name="chime" at={4.0} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
