import React from 'react';
import type { LP } from './base';
import { Motif } from './motif';
import { MX, MW, CX, MONO, SERIF } from './base';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Lead, Metric, Tag, Title } from '../kit/Type';
import { EndCard, Rule, Sfx } from '../kit/Bits';
import { EASE, fitSize, outQuint, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';

/* ============ 36 · 日历 CALENDAR ============ 月历格阵，某一天被红圈单独圈住 */
export const Calendar: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const cw = 129, ch = 148, gx = MX, gy = 520;
  const pick = arr ? 17 : 6; // 被圈住的日子
  const cells = Array.from({ length: 35 }, (_, i) => i + 1);
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920 }}>
          <Kicker s={s} t={t} text={p.kicker} x={MX} y={190} start={0.05} w={640} />
          <div style={{ position: 'absolute', left: MX + MW - 220, top: 190, width: 220, textAlign: 'right', fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: rgba(s.a1, 0.9), opacity: EASE.enter(seg(t, 0.2, 0.6)) }}>{p.dateText}</div>
        </div>
        <Title s={s} t={t} text={p.title} x={MX} y={236} w={MW} size={94} start={0.15} align="left" lines={1} />
        {/* 星期行 */}
        <div style={{ position: 'absolute', left: gx, top: gy - 44, width: cw * 7, display: 'flex' }}>
          {['一', '二', '三', '四', '五', '六', '日'].map((d, i) => (
            <div key={i} style={{ width: cw, textAlign: 'center', fontSize: 20, letterSpacing: 2, color: i > 4 ? rgba(s.a1, 0.85) : s.faint }}>{d}</div>
          ))}
        </div>
        {/* 格子 */}
        {cells.map((n, i) => {
          const col = i % 7, row = Math.floor(i / 7);
          const on = n === pick;
          return (
            <div key={i} style={{ position: 'absolute', left: gx + col * cw, top: gy + row * ch, width: cw, height: ch, borderTop: `1px solid ${rgba(s.ink, 0.1)}`, borderLeft: `1px solid ${rgba(s.ink, 0.1)}`, opacity: n <= 31 ? 1 : 0.25 }}>
              <div style={{ position: 'absolute', left: 0, top: 18, width: cw, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: on ? s.a1 : s.faint, fontWeight: on ? 700 : 400 }}>{n <= 31 ? n : ''}</div>
              {on ? (
                <div style={{ position: 'absolute', left: cw / 2 - 30, top: 2, width: 60, height: 60, borderRadius: '50%', border: `3px solid ${rgba('#C0483C', 0.9)}`, transform: `scale(${0.4 + outQuint(seg(t, 1.1, 1.7)) * 0.6}) rotate(-7deg)`, opacity: EASE.enter(seg(t, 1.1, 1.5)) }} />
              ) : null}
            </div>
          );
        })}
        {/* 被圈住那天的注释 */}
        <div style={{ position: 'absolute', left: MX, top: 1288, width: MW, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', opacity: EASE.enter(seg(t, 1.4, 1.9)) }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ height: 2, width: 64, background: rgba('#C0483C', 0.9), marginBottom: 16 }} />
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.award, 600, 54, 2, 30), color: s.ink, lineHeight: 1.25, whiteSpace: 'nowrap' }}>{p.award}</div>
            <div style={{ fontSize: 24, color: s.dim, marginTop: 12 }}>{p.honoree} · {p.role}</div>
          </div>
          <div style={{ flex: 'none', textAlign: 'right', paddingRight: 8 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 116, lineHeight: 1, color: rgba('#C0483C', 0.92) }}>{pick}</div>
            <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: 4, color: s.faint, marginTop: 4 }}>KEY DATE</div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1478, width: MW, fontFamily: SERIF, fontSize: 30, lineHeight: 1.7, color: s.dim, opacity: EASE.enter(seg(t, 1.9, 2.4)) }}>{p.subtitle}</div>
        <Sfx name="chime" at={1.15} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="calendar" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text="MONTHLY RECORD" x={MX} y={400} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={470} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 960, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, paddingTop: 20, borderTop: `2px solid ${rgba(s.a1, 0.55)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 42, fontWeight: 700, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1150, width: MW, fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1370} align="center" w={MW} start={5.4} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 37 · 横轴 TIMELINE ============ 一条水平刻度轴，游标走到底 */
export const Timeline: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const ax = 120, aw = 840, ay = 1010;
  const run = outQuint(seg(t, 0.5, 2.6));
  const ms = p.milestones.slice(0, 3);
  const pos = [0.16, 0.5, 0.84];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={18}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={200} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={258} w={MW} size={110} start={0.15} align="center" lines={1} glow={s.titleGlow} />
        <div style={{ position: 'absolute', left: MX, top: 430, width: MW, textAlign: 'center', fontSize: 32, color: s.dim, opacity: EASE.enter(seg(t, 0.5, 1.0)) }}>{p.subtitle}</div>
        {/* 刻度 */}
        {Array.from({ length: 29 }).map((_, i) => {
          const x = ax + (aw / 28) * i;
          const major = i % 7 === 0;
          return <div key={i} style={{ position: 'absolute', left: x, top: ay - (major ? 34 : 16), width: 2, height: major ? 34 : 16, background: rgba(s.ink, major ? 0.45 : 0.2), opacity: EASE.enter(seg(t, 0.35 + i * 0.02, 0.6 + i * 0.02)) }} />;
        })}
        {/* 轴 */}
        <div style={{ position: 'absolute', left: ax, top: ay, width: aw, height: 3, background: rgba(s.ink, 0.5), transform: `scaleX(${run})`, transformOrigin: arr ? 'right center' : 'left center' }} />
        {/* 游标 */}
        <div style={{ position: 'absolute', left: ax + aw * run - 2, top: ay - 52, width: 4, height: 108, background: s.a1, boxShadow: `0 0 24px ${rgba(s.a1, 0.6)}` }} />
        <div style={{ position: 'absolute', left: ax + aw * run - 14, top: ay - 76, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `20px solid ${s.a1}` }} />
        {/* 三节点 */}
        {ms.map((m, i) => {
          const x = ax + aw * pos[i];
          return (
            <div key={i} style={{ position: 'absolute', left: x - 150, top: ay - 300, width: 300, textAlign: 'center', opacity: EASE.enter(seg(t, 0.9 + i * 0.2, 1.4 + i * 0.2)) }}>
              <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: rgba(s.a1, 0.9) }}>{m.t}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: s.ink, marginTop: 6 }}>{m.label}</div>
              <div style={{ fontSize: 22, color: s.dim, marginTop: 8, lineHeight: 1.5 }}>{m.note}</div>
              <div style={{ width: 2, height: 108, background: rgba(s.ink, 0.25), margin: '18px auto 0' }} />
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: s.pg, border: `3px solid ${s.a1}`, margin: '-9px auto 0' }} />
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1400, width: MW, display: 'flex', justifyContent: 'space-between', fontSize: 20, letterSpacing: 3, color: s.faint, fontFamily: MONO }}>
          <span>START</span><span>{p.honoree} · {p.award}</span><span>NOW</span>
        </div>
        <Sfx name="whoosh" at={0.5} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <Motif kind="timeline" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={404} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={478} w={MW} size={190} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 950, width: MW, display: 'flex', justifyContent: 'center', gap: 20 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', padding: '32px 0', background: s.panel, border: `1px solid ${s.panelLine}`, borderRadius: s.radius, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.dim, marginTop: 8 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <Lead s={s} t={t} text={p.quote} x={MX} y={1130} w={MW} size={40} start={4.9} align="center" lines={2} />
        <Tag s={s} t={t} text={p.award} x={MX} y={1340} align="center" w={MW} start={5.4} />
        <Sfx name="chime" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 38 · 轨道 ORBIT ============ 中心主体 + 卫星绕行，标签挂在卫星上 */
export const Orbit: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const cy = 960, rx = 372, ry = 168;
  const items = p.facts.slice(0, 3);
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={96} start={0.15} align="center" lines={1} />
        {/* 轨道 */}
        {[1, 0.72, 0.46].map((k, i) => (
          <div key={i} style={{ position: 'absolute', left: CX - rx * k, top: cy - ry * k, width: rx * 2 * k, height: ry * 2 * k, borderRadius: '50%', border: `1px ${i === 0 ? 'solid' : 'dashed'} ${rgba(s.ink, i === 0 ? 0.2 : 0.12)}`, transform: `rotate(${arr ? -8 : 8}deg)` }} />
        ))}
        {/* 中心 */}
        <div style={{ position: 'absolute', left: CX - 132, top: cy - 132, width: 264, height: 264, borderRadius: '50%', background: `radial-gradient(circle at 34% 30%, ${rgba(s.a1, 0.55)}, ${rgba(s.a1, 0.08)} 62%, transparent 72%)`, border: `2px solid ${rgba(s.a1, 0.65)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 90px ${rgba(s.a1, 0.25)}`, opacity: EASE.enter(seg(t, 0.3, 0.9)), transform: `scale(${0.82 + outQuint(seg(t, 0.3, 1.0)) * 0.18})` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 210, 46, 2, 22), color: s.ink, textAlign: 'center', whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 20, color: s.dim, marginTop: 8, textAlign: 'center', padding: '0 18px' }}>{p.role}</div>
        </div>
        {/* 卫星 */}
        {items.map((f, i) => {
          const base = (i / items.length) * Math.PI * 2 + (arr ? 0.6 : 0);
          const a = base + t * 0.42;
          const x = CX + Math.cos(a) * rx;
          const y = cy + Math.sin(a) * ry;
          return (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: '50%', background: i === 0 ? s.a1 : s.a2, boxShadow: `0 0 20px ${rgba(i === 0 ? s.a1 : s.a2, 0.7)}` }} />
              <div style={{ position: 'absolute', left: x - 108, top: y - 118, width: 216, textAlign: 'center', opacity: EASE.enter(seg(t, 1.0 + i * 0.2, 1.5 + i * 0.2)) }}>
                <div style={{ fontFamily: MONO, fontSize: 34, fontWeight: 700, color: s.ink }}>{f.v}</div>
                <div style={{ fontSize: 19, letterSpacing: 2, color: s.faint, marginTop: 2 }}>{f.k}</div>
              </div>
            </React.Fragment>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1290, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 32, lineHeight: 1.75, color: s.dim, opacity: EASE.enter(seg(t, 1.8, 2.3)) }}>{p.quote}</div>
        <div style={{ position: 'absolute', left: MX, top: 1440, width: MW, textAlign: 'center', fontSize: 26, color: s.faint, opacity: EASE.enter(seg(t, 2.1, 2.5)) }}>{p.subtitle}</div>
        <Sfx name="whoosh" at={0.5} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="orbit" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.award} x={MX} y={470} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={540} w={MW} size={200} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 1030, width: MW, height: 2, background: rgba(s.a1, 0.35) }} />
        {p.rows.slice(0, 3).map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: MX, top: 1062 + i * 72, width: MW, display: 'flex', justifyContent: 'space-between', fontSize: 26, color: s.dim, opacity: EASE.enter(seg(t, 4.6 + i * 0.12, 5.0 + i * 0.12)) }}>
            <span>{r.name} · {r.role}</span><span style={{ fontFamily: MONO, color: s.ink }}>{r.value}</span>
          </div>
        ))}
        <Tag s={s} t={t} text={p.title} x={MX} y={1330} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 39 · 绶带 RIBBON ============ 一条斜跨全屏的绶带，字在带上滚动 */
export const Ribbon: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const rot = arr ? 16 : -16;
  const bandW = 1900;
  const shift = ((t * 90) % 620) * (arr ? 1 : -1);
  const strip = `${p.honoree}  ★  ${p.award}  ★  `;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={200} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={256} w={MW} size={104} start={0.15} align="center" lines={1} glow={s.titleGlow} />
        {/* 绶带 */}
        <div style={{ position: 'absolute', left: CX - bandW / 2, top: 830, width: bandW, height: 232, background: `linear-gradient(180deg, ${s.a1}, ${rgba(s.a2, 0.95)})`, transform: `rotate(${rot}deg)`, boxShadow: `0 24px 70px ${rgba(s.a1, 0.3)}`, overflow: 'hidden', opacity: EASE.enter(seg(t, 0.4, 1.0)) }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: bandW * 2, height: 232, display: 'flex', alignItems: 'center', transform: `translateX(${shift}px)`, whiteSpace: 'nowrap' }}>
            {[0, 1, 2, 3, 4].map((k) => (
              <span key={k} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, color: s.mode === 'dark' ? '#0B0B0D' : '#FFFFFF', letterSpacing: 6, paddingRight: 40 }}>{strip}</span>
            ))}
          </div>
          {/* 上下压边 */}
          <div style={{ position: 'absolute', left: 0, top: 12, width: bandW, height: 2, background: rgba('#FFFFFF', 0.35) }} />
          <div style={{ position: 'absolute', left: 0, bottom: 12, width: bandW, height: 2, background: rgba('#FFFFFF', 0.35) }} />
        </div>
        {/* 绶带下主名 */}
        <div style={{ position: 'absolute', left: MX, top: 1060, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 880, 120, 4, 44), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 30, color: s.dim, marginTop: 14, letterSpacing: 2 }}>{p.role}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1330, width: MW, textAlign: 'center', fontSize: 32, color: s.dim, opacity: EASE.enter(seg(t, 1.7, 2.2)) }}>{p.subtitle}</div>
        <Sfx name="whoosh" at={0.45} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="ribbon" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={400} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={470} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 980, width: MW, display: 'flex', justifyContent: 'center', gap: 20 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 700, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1130, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1350} align="center" w={MW} start={5.4} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 40 · 卷轴 BANNER ============ 上下木轴，纸面从中展开 */
export const Banner: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const open = outQuint(seg(t, 0.35, 1.5));
  const py = 560, ph = 760;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={220} align="center" w={MW} start={0.05} />
        {/* 上轴 */}
        <div style={{ position: 'absolute', left: MX - 24, top: py - 26, width: MW + 48, height: 40, borderRadius: 20, background: `linear-gradient(180deg, ${rgba(s.a1, 0.95)}, ${rgba(s.a1, 0.55)})`, boxShadow: `0 8px 26px ${rgba(s.ink, 0.25)}`, opacity: EASE.enter(seg(t, 0.2, 0.7)) }} />
        <div style={{ position: 'absolute', left: MX - 44, top: py - 34, width: 26, height: 56, borderRadius: 8, background: rgba(s.a2, 0.95) }} />
        <div style={{ position: 'absolute', left: MX + MW + 18, top: py - 34, width: 26, height: 56, borderRadius: 8, background: rgba(s.a2, 0.95) }} />
        {/* 纸面 */}
        <div style={{ position: 'absolute', left: MX, top: py, width: MW, height: ph * open, background: s.mode === 'dark' ? rgba(s.ink, 0.09) : rgba(s.ink, 0.035), borderLeft: `1px solid ${rgba(s.a1, 0.3)}`, borderRight: `1px solid ${rgba(s.a1, 0.3)}`, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: MW, height: ph, opacity: open > 0.55 ? 1 : 0 }}>
            <div style={{ position: 'absolute', left: 50, top: 64, width: MW - 100, textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 12, color: rgba(s.a1, 0.9) }}>PROCLAMATION</div>
            <div style={{ position: 'absolute', left: 60, top: 120, width: MW - 120, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, MW - 140, 132, 4, 48), lineHeight: 1.26, color: s.ink }}>{p.title}</div>
            <div style={{ position: 'absolute', left: 60, top: 400, width: MW - 120, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim }}>{p.subtitle}</div>
            <div style={{ position: 'absolute', left: 60, top: 560, width: MW - 120, textAlign: 'center', fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, MW - 160, 76, 3, 34), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
            <div style={{ position: 'absolute', left: 60, top: 660, width: MW - 120, textAlign: 'center', fontSize: 26, color: s.faint }}>{p.role} · {p.award}</div>
          </div>
        </div>
        {/* 下轴 */}
        <div style={{ position: 'absolute', left: MX - 24, top: py + ph * open - 14, width: MW + 48, height: 40, borderRadius: 20, background: `linear-gradient(180deg, ${rgba(s.a1, 0.95)}, ${rgba(s.a1, 0.55)})`, boxShadow: `0 10px 30px ${rgba(s.ink, 0.28)}` }} />
        <div style={{ position: 'absolute', left: MX - 44, top: py + ph * open - 22, width: 26, height: 56, borderRadius: 8, background: rgba(s.a2, 0.95) }} />
        <div style={{ position: 'absolute', left: MX + MW + 18, top: py + ph * open - 22, width: 26, height: 56, borderRadius: 8, background: rgba(s.a2, 0.95) }} />
        <div style={{ position: 'absolute', left: MX, top: 1430, width: MW, textAlign: 'center', fontFamily: MONO, fontSize: 22, letterSpacing: 6, color: s.faint, opacity: EASE.enter(seg(t, 1.7, 2.1)) }}>{p.brand} · {p.dateText}</div>
        <Sfx name="whoosh" at={0.4} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="banner" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.award} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={500} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 1000, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, paddingTop: 18, borderTop: `2px solid ${rgba(s.a1, 0.6)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 44, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1170, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.title} x={MX} y={1360} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
