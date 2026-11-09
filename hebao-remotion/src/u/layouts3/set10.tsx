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

/* ============ 51 · 灯笼 LANTERN ============ 三盏竖排灯笼垂落，灯面题字 */
export const Lantern: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const lamps = [
    { x: 268, y: 470, r: 84, txt: p.award.slice(0, 4), d: 0.35 },
    { x: 540, y: 360, r: 104, txt: p.honoree.slice(0, 4), d: 0.55 },
    { x: 812, y: 470, r: 84, txt: p.title.slice(0, 4), d: 0.75 },
  ];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={200} align="center" w={MW} start={0.05} />
        {lamps.map((L, i) => {
          const drop = outBack(seg(t, L.d, L.d + 0.75));
          const sway = Math.sin(t * 1.2 + i) * 2.4;
          return (
            <div key={i} style={{ position: 'absolute', left: L.x - L.r, top: L.y - 210, width: L.r * 2, transform: `translateY(${(1 - drop) * -260}px) rotate(${sway}deg)`, transformOrigin: 'top center', opacity: Math.min(1, drop * 1.6) }}>
              <div style={{ width: 2, height: 150, margin: '0 auto', background: rgba(s.a1, 0.5) }} />
              <div style={{ position: 'relative', width: L.r * 2, height: L.r * 1.7 }}>
                <div style={{ position: 'absolute', left: L.r - 34, top: 0, width: 68, height: 12, borderRadius: 3, background: rgba(s.a2, 0.9) }} />
                <div style={{ position: 'absolute', left: 0, top: 10, width: L.r * 2, height: L.r * 1.5, borderRadius: '50%', background: `radial-gradient(circle at 50% 40%, ${rgba(s.a1, 0.95)}, ${rgba(s.a2, 0.85)})`, boxShadow: `0 0 70px ${rgba(s.a1, 0.45)}` }}>
                  {[0.22, 0.42, 0.62, 0.82].map((k, j) => (
                    <div key={j} style={{ position: 'absolute', left: 8, top: `${k * 100}%`, width: L.r * 2 - 16, height: 1, background: rgba('#FFFFFF', 0.22) }} />
                  ))}
                  <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', background: rgba('#FFFFFF', 0.18) }} />
                </div>
                <div style={{ position: 'absolute', left: 0, top: 10, width: L.r * 2, height: L.r * 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ writingMode: 'vertical-rl', fontFamily: SERIF, fontWeight: 900, fontSize: L.r * 0.62, letterSpacing: 4, color: s.mode === 'dark' ? '#0B0B0D' : '#FFF8EC', textAlign: 'center' }}>{L.txt}</div>
                </div>
                <div style={{ position: 'absolute', left: L.r - 26, top: L.r * 1.5 + 10, width: 52, height: 10, borderRadius: 3, background: rgba(s.a2, 0.9) }} />
                {[0, 1, 2].map((j) => (
                  <div key={j} style={{ position: 'absolute', left: L.r - 14 + j * 10, top: L.r * 1.5 + 18, width: 3, height: 54, background: rgba(s.a1, 0.7) }} />
                ))}
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1010, width: MW, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 880, 86, 3, 38), color: s.ink, opacity: EASE.enter(seg(t, 1.1, 1.6)), whiteSpace: 'nowrap' }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 1120, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 1.3, 1.8)) }}>{p.role}</div>
        <div style={{ position: 'absolute', left: MX, top: 1230, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 1.6, 2.1)) }}>{p.subtitle}</div>
        <Sfx name="whoosh" at={0.5} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="lantern" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 980, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1140, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1350} align="center" w={MW} start={5.4} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 52 · 折扇 FAN ============ 扇形展开，扇骨分割，字落在扇面 */
export const Fan: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const open = outQuint(seg(t, 0.3, 1.7));
  const cx = CX, cy = 1560, R = 1080;
  const half = (66 * Math.PI) / 180 * (0.25 + 0.75 * open);
  const ribs = 9;
  const pt = (a: number, k = 1) => [cx + Math.cos(a) * R * k, cy + Math.sin(a) * R * k];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.015} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={12}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={190} align="center" w={MW} start={0.05} />
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          {Array.from({ length: ribs }).map((_, i) => {
            const a0 = -Math.PI / 2 - half + ((2 * half) / ribs) * i;
            const a1 = a0 + (2 * half) / ribs;
            const p0 = pt(a0), p1 = pt(a1);
            const d = `M ${cx} ${cy} L ${p0[0]} ${p0[1]} A ${R} ${R} 0 0 1 ${p1[0]} ${p1[1]} Z`;
            return <path key={i} d={d} fill={rgba(i % 2 === 0 ? s.a1 : s.a2, i % 2 === 0 ? 0.16 : 0.1)} stroke={rgba(s.a1, 0.45)} strokeWidth={1.5} />;
          })}
          <circle cx={cx} cy={cy} r={34} fill={rgba(s.a1, 0.85)} />
        </svg>
        <div style={{ position: 'absolute', left: MX, top: 340, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 0.6, 1.1)) }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 12, color: rgba(s.a1, 0.9) }}>FOLDING FAN</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, 860, 128, 4, 52), color: s.ink, marginTop: 20, lineHeight: 1.25 }}>{p.title}</div>
          <div style={{ fontSize: 30, color: s.dim, marginTop: 22 }}>{p.subtitle}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 790, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 1.0, 1.5)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 840, 78, 3, 34), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 10 }}>{p.role}</div>
          <div style={{ display: 'inline-block', marginTop: 22, padding: '10px 28px', border: `1px solid ${rgba(s.a1, 0.6)}`, borderRadius: 999, fontSize: 24, color: s.dim }}>{p.award}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1060, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.5, 2.0)) }}>{p.dateText}</div>
        <Sfx name="whoosh" at={0.35} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="fan" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 980, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', paddingTop: 18, borderTop: `2px solid ${rgba(s.a1, 0.55)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <Lead s={s} t={t} text={p.quote} x={MX} y={1150} w={MW} size={38} start={5.0} align="center" lines={2} />
        <Tag s={s} t={t} text={p.award} x={MX} y={1360} align="center" w={MW} start={5.4} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 53 · 一笔墨 INK ============ 一道横向笔触压住标题，笔锋有枯湿 */
export const InkStroke: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const draw = outQuint(seg(t, 0.25, 1.5));
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <linearGradient id={`inkgrad-${accent}-${arr}`} x1="0" x2="1">
              <stop offset="0" stopColor={rgba(s.a1, 0.08)} />
              <stop offset="0.16" stopColor={rgba(s.a1, 0.95)} />
              <stop offset="0.78" stopColor={rgba(s.a1, 0.92)} />
              <stop offset="1" stopColor={rgba(s.a1, 0.1)} />
            </linearGradient>
          </defs>
          {[
            { y: 862, h: 58, o: 0.95, grad: true },
            { y: 936, h: 22, o: 0.4, grad: false },
            { y: 984, h: 9, o: 0.26, grad: false },
          ].map((b, i) => (
            <path
              key={i}
              d={`M ${-40 + (arr ? 1120 : 0)} ${b.y} C 240 ${b.y - 14}, 520 ${b.y + 16}, 720 ${b.y + 2} C 870 ${b.y - 8}, 1000 ${b.y + 10}, ${1120 - (arr ? 1120 : 0)} ${b.y} L ${1120 - (arr ? 1120 : 0)} ${b.y + b.h} C 1000 ${b.y + b.h + 10}, 870 ${b.y + b.h - 8}, 720 ${b.y + b.h - 2} C 520 ${b.y + b.h + 16}, 240 ${b.y + b.h - 14}, ${-40 + (arr ? 1120 : 0)} ${b.y + b.h} Z`}
              fill={b.grad ? `url(#inkgrad-${accent}-${arr})` : rgba(s.a1, 1)}
              style={{ opacity: draw * b.o, transform: `scaleX(${0.15 + draw * 0.85})`, transformOrigin: arr ? 'right center' : 'left center' }}
            />
          ))}
          {/* 飞白 / 墨点 */}
          {[[214, 832, 13], [318, 986, 7], [806, 906, 10], [920, 1010, 6]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={rgba(s.a1, 0.45)} style={{ opacity: draw * 0.7 }} />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: MX + 40, top: 762, width: MW - 80, opacity: EASE.enter(seg(t, 0.7, 1.2)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, MW - 120, 150, 5, 56), color: s.ink, letterSpacing: 6, lineHeight: 1.2 }}>{p.title}</div>
        </div>
        <div style={{ position: 'absolute', left: MX + 46, top: 1030, width: MW - 92, fontFamily: SERIF, fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.1, 1.6)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX + 46, top: 420, width: MW - 92, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', opacity: EASE.enter(seg(t, 0.9, 1.4)) }}>
          <div>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 520, 72, 3, 32), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
            <div style={{ fontSize: 24, color: s.dim, marginTop: 8 }}>{p.role}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 5, color: rgba(s.a1, 0.9) }}>AWARD</div>
            <div style={{ fontFamily: SERIF, fontSize: 30, color: s.ink, marginTop: 6 }}>{p.award}</div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: MX + 46, top: 1160, width: MW - 92, fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 1.5, 2.0)) }}>{p.quote}</div>
        <Sfx name="whoosh" at={0.3} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="ink" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={200} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1150, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.subtitle}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1350} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 54 · 马赛克 MOSAIC ============ 像素块由外向内点亮，拼出画面 */
export const Mosaic: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const cols = 7, rows = 6, cell = 128, gap = 4;
  const gx = CX - (cols * (cell + gap) - gap) / 2, gy = 560;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={92} start={0.15} align="center" lines={1} />
        {Array.from({ length: cols * rows }).map((_, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          const dx = Math.abs(c - (cols - 1) / 2) / ((cols - 1) / 2);
          const dy = Math.abs(r - (rows - 1) / 2) / ((rows - 1) / 2);
          const d = 0.28 + Math.max(dx, dy) * 0.9 + (arr ? (1 - dx) * 0.5 : 0);
          const on = EASE.enter(seg(t, d, d + 0.42));
          const hot = (i * 7) % 11 === 0;
          return (
            <div key={i} style={{ position: 'absolute', left: gx + c * (cell + gap), top: gy + r * (cell + gap), width: cell, height: cell, background: hot ? rgba(s.a1, 0.55) : rgba(s.ink, 0.07 * on), border: `1px solid ${rgba(s.ink, 0.12 * on)}`, borderRadius: 2, opacity: 0.35 + on * 0.65, transform: `scale(${0.86 + on * 0.14})` }} />
          );
        })}
        <div style={{ position: 'absolute', left: gx, top: gy + rows * (cell + gap) + 44, width: cols * (cell + gap) - gap, textAlign: 'center', opacity: EASE.enter(seg(t, 1.3, 1.8)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 840, 82, 3, 36), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 10 }}>{p.role} · {p.award}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1500, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.7, 2.1)) }}>{p.subtitle}</div>
        <Sfx name="chime" at={0.4} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="mosaic" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ padding: '30px 12px', background: rgba(s.ink, 0.05), border: `1px solid ${rgba(s.ink, 0.12)}`, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 42, fontWeight: 700, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 20, color: s.faint, marginTop: 8 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1170, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1370} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 55 · 故障 GLITCH ============ 三色错位切片，画面横向撕裂 */
export const Glitch: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const amp = t < 1.4 ? 1 : t < 2.0 ? 0.5 : 0.18;
  const bands = [0, 1, 2, 3, 4];
  const shift = (i: number) => Math.sin(t * 9 + i * 2.1) * 26 * amp;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.012} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={12}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <div style={{ position: 'absolute', left: MX, top: 320, width: MW, height: 620 }}>
          {bands.map((i) => {
            const top = 320 + i * 124;
            return (
              <div key={i} style={{ position: 'absolute', left: MX, top: top - 320, width: MW, height: 124, overflow: 'hidden', transform: `translateX(${shift(i)}px)` }}>
                <div style={{ position: 'absolute', left: 0, top: -(i * 124), width: MW, fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, MW - 30, 150, 3, 56), lineHeight: '620px', color: rgba('#FF3B3B', 0.55), transform: `translateX(${shift(i) * 1.6}px)` }}>{p.title}</div>
                <div style={{ position: 'absolute', left: 0, top: -(i * 124), width: MW, fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, MW - 30, 150, 3, 56), lineHeight: '620px', color: rgba('#20E3D2', 0.5), transform: `translateX(${-shift(i) * 1.6}px)` }}>{p.title}</div>
                <div style={{ position: 'absolute', left: 0, top: -(i * 124), width: MW, fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, MW - 30, 150, 3, 56), lineHeight: '620px', color: s.ink }}>{p.title}</div>
              </div>
            );
          })}
          {/* 噪点线 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: MX, top: 40 + ((i * 137 + Math.floor(t * 40) * 11) % 600), width: MW, height: 2, background: rgba(s.a1, 0.35) }} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1000, width: MW, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', opacity: EASE.enter(seg(t, 0.9, 1.4)) }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 6, color: rgba(s.a1, 0.9) }}>SUBJECT</div>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 560, 68, 3, 30), color: s.ink, marginTop: 8, whiteSpace: 'nowrap' }}>{p.honoree}</div>
            <div style={{ fontSize: 24, color: s.dim, marginTop: 6 }}>{p.role}</div>
          </div>
          <div style={{ textAlign: 'right', fontFamily: MONO, fontSize: 20, color: s.faint, letterSpacing: 3 }}>
            <div>{p.award}</div><div style={{ marginTop: 8 }}>{p.dateText}</div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1220, width: MW, fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 1.3, 1.8)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1400, width: MW, fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: s.faint, opacity: EASE.enter(seg(t, 1.6, 2.0)) }}>SIGNAL OK / CH.115 / {p.brand}</div>
        <Sfx name="impact" at={0.25} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="glitch" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, paddingTop: 16, borderTop: `3px solid ${rgba(s.a1, 0.7)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1170, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1360} align="center" w={MW} start={5.3} />
        <Sfx name="chime" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
