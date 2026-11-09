import React from 'react';
import type { LP } from './base';
import { Motif } from './motif';
import { MX, MW, CX, MONO, SERIF } from './base';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Lead, Metric, Tag, Title } from '../kit/Type';
import { EndCard, Rule, Sfx } from '../kit/Bits';
import { EASE, fitSize, outBack, outQuint, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';

const num = (v?: string) => {
  const n = parseFloat(String(v ?? '').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/* ============ 41 · 柱阵 BARS ============ 纵向柱状图，柱顶挂数值 */
export const Bars: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const rows = p.rows.slice(0, 5);
  const max = Math.max(...rows.map((r) => num(r.value)), 1);
  const baseY = 1240, maxH = 620;
  const bw = 118, gap = 62;
  const totalW = rows.length * bw + (rows.length - 1) * gap;
  const x0 = CX - totalW / 2;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={198} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={254} w={MW} size={96} start={0.15} align="center" lines={1} />
        <div style={{ position: 'absolute', left: MX, top: 412, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 0.4, 0.9)) }}>{p.subtitle}</div>
        {/* 基线 + 横向参考线 */}
        {[0.25, 0.5, 0.75, 1].map((k) => (
          <div key={k} style={{ position: 'absolute', left: x0 - 40, top: baseY - maxH * k, width: totalW + 80, height: 1, background: rgba(s.ink, 0.08), opacity: EASE.enter(seg(t, 0.3 + k * 0.2, 0.6 + k * 0.2)) }} />
        ))}
        <div style={{ position: 'absolute', left: x0 - 40, top: baseY, width: totalW + 80, height: 3, background: rgba(s.ink, 0.55) }} />
        {rows.map((r, i) => {
          const h = Math.max(28, (num(r.value) / max) * maxH);
          const grow = outQuint(seg(t, 0.55 + i * 0.14, 1.5 + i * 0.14));
          const x = x0 + i * (bw + gap);
          const hot = i === 0;
          return (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', left: x, top: baseY - h, width: bw, height: h, background: hot ? s.a1 : rgba(s.ink, 0.14), border: `1px solid ${hot ? rgba(s.a1, 0.9) : rgba(s.ink, 0.18)}`, borderRadius: `${s.radius}px ${s.radius}px 0 0`, transform: `scaleY(${grow})`, transformOrigin: 'bottom center' }} />
              <div style={{ position: 'absolute', left: x - 6, top: baseY - h - 56, width: bw + 12, textAlign: 'center', fontFamily: MONO, fontSize: hot ? 40 : 30, fontWeight: 700, color: hot ? s.a1 : s.ink, opacity: EASE.enter(seg(t, 0.9 + i * 0.14, 1.35 + i * 0.14)) }}>{r.value}</div>
              <div style={{ position: 'absolute', left: x - 12, top: baseY + 26, width: bw + 24, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 26, color: s.ink, opacity: EASE.enter(seg(t, 1.1 + i * 0.12, 1.5 + i * 0.12)), whiteSpace: 'nowrap' }}>{r.name}</div>
              <div style={{ position: 'absolute', left: x - 12, top: baseY + 62, width: bw + 24, textAlign: 'center', fontSize: 19, color: s.faint, opacity: EASE.enter(seg(t, 1.15 + i * 0.12, 1.55 + i * 0.12)) }}>{r.role}</div>
            </React.Fragment>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1440, width: MW, textAlign: 'center', fontSize: 26, color: s.faint, opacity: EASE.enter(seg(t, 1.9, 2.3)) }}>{p.metric.label} · {p.honoree}</div>
        <Sfx name="whoosh" at={0.55} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="bars" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.award} x={MX} y={420} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={490} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 980, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 700, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <Lead s={s} t={t} text={p.quote} x={MX} y={1130} w={MW} size={38} start={5.0} align="center" lines={2} />
        <Tag s={s} t={t} text={p.title} x={MX} y={1350} align="center" w={MW} start={5.4} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 42 · 雷达 RADAR ============ 六边形雷达网，三个轴向外凸出数据点 */
export const Radar: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const cy = 940, R = 300;
  const pt = (ang: number, k: number) => [CX + Math.cos(ang) * R * k, cy + Math.sin(ang) * R * k];
  const hex = (k: number) =>
    Array.from({ length: 6 }, (_, i) => pt((-Math.PI / 2) + (i * Math.PI) / 3, k).join(',')).join(' ');
  const facts = p.facts.slice(0, 3);
  const radii = [0.88, 0.66, 0.48];
  const axes = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
  const poly = axes.map((a, i) => pt(a, radii[i] * outQuint(seg(t, 0.9, 2.0)))).map((q) => q.join(',')).join(' ');
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={94} start={0.15} align="center" lines={1} />
        <svg width={1080} height={1500} style={{ position: 'absolute', left: 0, top: 300 }}>
          {[0.35, 0.65, 1].map((k, i) => (
            <polygon key={i} points={hex(k)} fill="none" stroke={rgba(s.ink, i === 2 ? 0.28 : 0.12)} strokeWidth={i === 2 ? 2 : 1} />
          ))}
          {axes.map((a, i) => {
            const [x, y] = pt(a, 1);
            return <line key={i} x1={CX} y1={cy} x2={x} y2={y} stroke={rgba(s.ink, 0.14)} strokeWidth={1} />;
          })}
          <polygon points={poly} fill={rgba(s.a1, 0.22)} stroke={s.a1} strokeWidth={3} strokeLinejoin="round" style={{ opacity: EASE.enter(seg(t, 0.9, 1.3)) }} />
          {axes.map((a, i) => {
            const [x, y] = pt(a, radii[i] * outQuint(seg(t, 0.9, 2.0)));
            return <circle key={i} cx={x} cy={y} r={9} fill={i === 0 ? s.a1 : s.a2} />;
          })}
        </svg>
        {facts.map((f, i) => {
          const a = axes[i];
          const [x, y] = pt(a, 1.16);
          return (
            <div key={i} style={{ position: 'absolute', left: x - 130, top: y - 46, width: 260, textAlign: 'center', opacity: EASE.enter(seg(t, 1.3 + i * 0.16, 1.8 + i * 0.16)) }}>
              <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 700, color: i === 0 ? s.a1 : s.ink }}>{f.v}</div>
              <div style={{ fontSize: 20, color: s.faint, letterSpacing: 2, marginTop: 2 }}>{f.k}</div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1390, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 30, lineHeight: 1.7, color: s.dim, opacity: EASE.enter(seg(t, 2.0, 2.4)) }}>{p.subtitle}</div>
        <Sfx name="whoosh" at={0.9} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="radar" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={420} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.award} x={MX} y={492} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, fontFamily: SERIF, fontSize: 36, lineHeight: 1.85, color: s.ink, opacity: EASE.enter(seg(t, 4.5, 5.0)) }}>{p.quote}</div>
        <div style={{ position: 'absolute', left: MX, top: 1200, width: MW, display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${rgba(s.ink, 0.2)}`, paddingTop: 20 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 34, color: s.ink, opacity: EASE.enter(seg(t, 4.9, 5.3)) }}>{p.honoree}</div>
          <div style={{ fontSize: 24, color: s.faint, paddingTop: 8, opacity: EASE.enter(seg(t, 5.0, 5.4)) }}>{p.role}</div>
        </div>
        <Tag s={s} t={t} text={p.title} x={MX} y={1340} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 43 · 仪表盘 GAUGE ============ 半圆表盘，指针扫到定格位置 */
export const Gauge: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const cy = 1120, r = 344;
  const sweep = outQuint(seg(t, 0.6, 2.2));
  const startA = Math.PI, endA = 0;
  const ang = startA + (arr ? 0.1 : 0.86) * (endA - startA) * sweep;
  const px = CX + Math.cos(ang) * (r - 40);
  const py = cy + Math.sin(ang) * (r - 40);
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={96} start={0.15} align="center" lines={1} />
        <svg width={1080} height={1400} style={{ position: 'absolute', left: 0, top: 260 }}>
          <path d={`M ${CX - r} ${cy} A ${r} ${r} 0 0 1 ${CX + r} ${cy}`} fill="none" stroke={rgba(s.ink, 0.1)} strokeWidth={30} strokeLinecap="round" />
          <path d={`M ${CX - r} ${cy} A ${r} ${r} 0 0 1 ${CX + r} ${cy}`} fill="none" stroke={s.a1} strokeWidth={30} strokeLinecap="round" strokeDasharray={Math.PI * r} strokeDashoffset={Math.PI * r * (1 - sweep * 0.88)} />
          {Array.from({ length: 25 }).map((_, i) => {
            const a = Math.PI + (i / 24) * Math.PI;
            const major = i % 6 === 0;
            const x1 = CX + Math.cos(a) * (r - 26);
            const y1 = cy + Math.sin(a) * (r - 26);
            const x2 = CX + Math.cos(a) * (r - (major ? 62 : 44));
            const y2 = cy + Math.sin(a) * (r - (major ? 62 : 44));
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={rgba(s.ink, major ? 0.4 : 0.16)} strokeWidth={major ? 3 : 1.5} />;
          })}
          <line x1={CX} y1={cy} x2={px} y2={py} stroke={s.a2} strokeWidth={7} strokeLinecap="round" />
          <circle cx={CX} cy={cy} r={18} fill={s.a2} />
        </svg>
        <div style={{ position: 'absolute', left: MX, top: 780, width: MW, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 128, color: s.ink, lineHeight: 1.1 }}>
          {p.metric.value.toFixed(p.metric.decimals ?? 0)}<span style={{ fontSize: 44, color: s.dim, marginLeft: 8 }}>{p.metric.unit}</span>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 928, width: MW, textAlign: 'center', fontSize: 28, letterSpacing: 4, color: s.dim }}>{p.metric.label}</div>
        <div style={{ position: 'absolute', left: MX + 40, top: 1172, width: 240, fontSize: 20, letterSpacing: 2, color: s.faint }}>MIN · 0</div>
        <div style={{ position: 'absolute', left: MX + MW - 280, top: 1172, width: 240, textAlign: 'right', fontSize: 20, letterSpacing: 2, color: s.faint }}>MAX · 100</div>
        <div style={{ position: 'absolute', left: MX, top: 1290, width: MW, textAlign: 'center', fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 880, 62, 3, 32), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 1.6, 2.1)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 1380, width: MW, textAlign: 'center', fontSize: 25, color: s.dim, opacity: EASE.enter(seg(t, 1.8, 2.2)) }}>{p.role}</div>
        <Sfx name="whoosh" at={0.6} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="gauge" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.award} x={MX} y={410} align="center" w={MW} start={3.6} />
        <div style={{ position: 'absolute', left: MX, top: 470, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, paddingTop: 22, borderTop: `3px solid ${i === 0 ? s.a1 : rgba(s.ink, 0.18)}`, opacity: EASE.enter(seg(t, 4.0 + i * 0.15, 4.5 + i * 0.15)) }}>
              <div style={{ fontFamily: MONO, fontSize: 52, fontWeight: 700, color: i === 0 ? s.a1 : s.ink }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 8 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 700, width: MW, height: 1, background: rgba(s.ink, 0.15) }} />
        <Lead s={s} t={t} text={p.quote} x={MX} y={760} w={MW} size={42} start={4.6} align="center" lines={2} />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.4)) }}>{p.subtitle}</div>
        {p.rows.slice(0, 3).map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: MX, top: 1100 + i * 68, width: MW, display: 'flex', justifyContent: 'space-between', fontSize: 25, color: s.dim, opacity: EASE.enter(seg(t, 5.1 + i * 0.1, 5.5 + i * 0.1)) }}>
            <span>{r.name} · {r.role}</span><span style={{ fontFamily: MONO, color: s.ink }}>{r.value}</span>
          </div>
        ))}
        <Tag s={s} t={t} text={p.title} x={MX} y={1340} align="center" w={MW} start={5.4} />
        <Sfx name="chime" at={4.0} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 44 · 进度阶梯 STEPS ============ 四条进度条依次填满，末段最亮 */
export const Steps: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const items = p.facts.slice(0, 3);
  const fills = [0.94, 0.76, 0.58];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={200} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={254} w={MW} size={96} start={0.15} align="center" lines={1} glow={s.titleGlow} />
        <div style={{ position: 'absolute', left: MX, top: 420, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 0.4, 0.9)) }}>{p.subtitle}</div>
        {[...items, { k: p.metric.label, v: `${p.metric.value.toFixed(p.metric.decimals ?? 0)}${p.metric.unit}` }].map((f, i) => {
          const y = 610 + i * 190;
          const k = i < 3 ? fills[i] : 1;
          const grow = outQuint(seg(t, 0.6 + i * 0.2, 1.6 + i * 0.2));
          return (
            <div key={i} style={{ position: 'absolute', left: MX, top: y, width: MW }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
                <div style={{ fontSize: 28, letterSpacing: 2, color: i === 3 ? s.ink : s.dim, fontWeight: i === 3 ? 700 : 400 }}>{f.k}</div>
                <div style={{ fontFamily: MONO, fontSize: i === 3 ? 48 : 38, fontWeight: 700, color: i === 3 ? s.a1 : s.ink }}>{f.v}</div>
              </div>
              <div style={{ position: 'relative', width: MW, height: i === 3 ? 22 : 14, background: rgba(s.ink, 0.1), borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${k * 100}%`, background: i === 3 ? `linear-gradient(90deg, ${s.a2}, ${s.a1})` : rgba(s.a1, 0.62 - i * 0.12), borderRadius: 999, transform: `scaleX(${grow})`, transformOrigin: arr ? 'right center' : 'left center' }} />
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1420, width: MW, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: s.faint }}>
          <span>{p.honoree}</span><span>{p.award}</span>
        </div>
        <Sfx name="whoosh" at={0.6} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="steps" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text="FINAL SCORE" x={MX} y={410} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={480} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 960, width: MW, fontFamily: SERIF, fontSize: 36, lineHeight: 1.85, color: s.ink, opacity: EASE.enter(seg(t, 4.6, 5.1)) }}>{p.quote}</div>
        <div style={{ position: 'absolute', left: MX, top: 1180, width: MW, display: 'flex', justifyContent: 'center', gap: 14 }}>
          {p.rows.slice(0, 3).map((r, i) => (
            <div key={i} style={{ padding: '12px 24px', border: `1px solid ${rgba(s.ink, 0.2)}`, borderRadius: 999, fontSize: 22, color: s.dim, opacity: EASE.enter(seg(t, 5.0 + i * 0.1, 5.4 + i * 0.1)) }}>{r.name} {r.value}</div>
          ))}
        </div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1330} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 45 · 记分牌 SCOREBOARD ============ 翻转数字格阵列，像场馆大屏 */
export const Scoreboard: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const str = p.metric.value.toFixed(p.metric.decimals ?? 0);
  const glyphs = str.split('');
  const cellW = Math.min(120, Math.floor((MW - 40) / Math.max(glyphs.length, 1)) - 12);
  const totalW = glyphs.length * cellW + (glyphs.length - 1) * 12;
  const x0 = CX - totalW / 2;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.015} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={192} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={246} w={MW} size={88} start={0.15} align="center" lines={1} />
        {/* 大屏 */}
        <div style={{ position: 'absolute', left: MX, top: 400, width: MW, height: 620, background: s.mode === 'dark' ? rgba('#000000', 0.34) : rgba(s.ink, 0.07), border: `3px solid ${rgba(s.a1, 0.7)}`, borderRadius: 14, boxShadow: `inset 0 0 90px ${rgba(s.a1, 0.12)}, 0 26px 80px ${rgba(s.ink, 0.18)}` }}>
          <div style={{ position: 'absolute', left: 0, top: 54, width: MW, textAlign: 'center', fontFamily: MONO, fontSize: 22, letterSpacing: 12, color: rgba(s.a1, 0.9) }}>OFFICIAL SCORE</div>
          <div style={{ position: 'absolute', left: 0, top: 120, width: MW, height: 300, display: 'flex', justifyContent: 'center', gap: 12 }}>
            {glyphs.map((g, i) => {
              const flip = outBack(seg(t, 0.55 + i * 0.18, 1.25 + i * 0.18));
              return (
                <div key={i} style={{ width: cellW, height: 300, background: rgba('#000000', s.mode === 'dark' ? 0.42 : 0.72), border: `1px solid ${rgba(s.a1, 0.35)}`, borderRadius: 8, position: 'relative', overflow: 'hidden', opacity: Math.min(1, flip * 1.4) }}>
                  <div style={{ position: 'absolute', left: 0, top: '50%', width: cellW, height: 1, background: rgba('#FFFFFF', 0.14) }} />
                  <div style={{ position: 'absolute', left: 0, top: 0, width: cellW, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: cellW * 0.92, color: '#F4F0E6', transform: `rotateX(${(1 - flip) * -88}deg)`, transformOrigin: 'center center' }}>{g}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 0, top: 440, width: MW, textAlign: 'center', fontSize: 28, letterSpacing: 6, color: s.dim }}>{p.metric.label} / {p.metric.unit}</div>
          <div style={{ position: 'absolute', left: 0, top: 500, width: MW, textAlign: 'center', fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 860, 48, 3, 28), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 1.5, 2.0)) }}>{p.honoree}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1064, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.7, 2.2)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1140, width: MW, display: 'flex', justifyContent: 'center', gap: 16 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ padding: '14px 26px', background: rgba(s.ink, 0.04), border: `1px solid ${rgba(s.ink, 0.16)}`, borderRadius: 8, opacity: EASE.enter(seg(t, 1.8 + i * 0.14, 2.2 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 34, fontWeight: 700, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 19, color: s.faint, marginTop: 4 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <Sfx name="impact" at={0.7} vol={0.3} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="scoreboard" s={s} t={t} arr={arr} />
        <div style={{ position: 'absolute', left: MX, top: 372, width: MW, display: 'flex', justifyContent: 'space-between', borderBottom: `3px solid ${rgba(s.a1, 0.75)}`, paddingBottom: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 6, color: rgba(s.a1, 0.95) }}>STANDINGS</div>
          <div style={{ fontFamily: SERIF, fontSize: 26, color: s.dim }}>{p.award}</div>
        </div>
        {p.rows.slice(0, 5).map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: MX, top: 410 + i * 112, width: MW, display: 'flex', alignItems: 'center', background: i === 0 ? rgba(s.a1, 0.1) : 'transparent', borderRadius: 8, opacity: EASE.enter(seg(t, 3.7 + i * 0.12, 4.2 + i * 0.12)) }}>
            <div style={{ width: 78, textAlign: 'center', fontFamily: MONO, fontSize: 32, fontWeight: 700, color: i === 0 ? s.a1 : s.faint }}>{i + 1}</div>
            <div style={{ width: 380, fontFamily: SERIF, fontWeight: 700, fontSize: 34, color: s.ink, whiteSpace: 'nowrap' }}>{r.name}</div>
            <div style={{ flex: 1, fontSize: 22, color: s.faint }}>{r.role}</div>
            <div style={{ width: 190, textAlign: 'right', fontFamily: MONO, fontSize: 42, fontWeight: 700, color: i === 0 ? s.a1 : s.ink }}>{r.value}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', left: MX, top: 1010, width: MW, fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 4.8, 5.3)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.title} x={MX} y={1240} align="center" w={MW} start={5.3} />
        <Sfx name="chime" at={4.0} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
