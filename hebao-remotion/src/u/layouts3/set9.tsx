import React from 'react';
import type { LP } from './base';
import { Motif } from './motif';
import { MX, MW, CX, MONO, SERIF, onColor } from './base';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Lead, Metric, Tag, Title } from '../kit/Type';
import { EndCard, Rule, Sfx } from '../kit/Bits';
import { EASE, fitSize, outBack, outQuint, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';

/* ============ 46 · 翻牌 FLIP ============ 同一张牌正反翻转三次，每次换一层信息 */
export const Flip: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const cw = 700, ch = 820, cx0 = CX - cw / 2, cy0 = 640;
  const faces = [
    { at: 0.2, out: 1.55, kind: 'title' },
    { at: 1.62, out: 3.44, kind: 'honoree' },
  ];
  const rot = (start: number) => {
    const inP = outQuint(seg(t, start, start + 0.5));
    return (1 - inP) * (arr ? 90 : -90);
  };
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={200} align="center" w={MW} start={0.05} />
        {faces.map((f, i) => {
          const vis = t >= f.at - 0.02 && t < f.out;
          if (!vis) return null;
          return (
            <div key={i} style={{ position: 'absolute', left: cx0, top: cy0, width: cw, height: ch, background: s.panel, border: `3px solid ${rgba(s.a1, 0.7)}`, borderRadius: 20, boxShadow: `0 30px 90px ${rgba(s.ink, 0.2)}`, transform: `perspective(1400px) rotateY(${rot(f.at)}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
              <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 10, color: rgba(s.a1, 0.9) }}>{i === 0 ? 'SIDE A' : 'SIDE B'}</div>
              {f.kind === 'title' ? (
                <>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, cw - 160, 150, 4, 56), color: s.ink, marginTop: 26, textAlign: 'center', lineHeight: 1.2 }}>{p.title}</div>
                  <div style={{ fontSize: 30, color: s.dim, marginTop: 26, textAlign: 'center' }}>{p.subtitle}</div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, cw - 180, 92, 3, 40), color: s.ink, marginTop: 26, whiteSpace: 'nowrap' }}>{p.honoree}</div>
                  <div style={{ fontSize: 28, color: s.dim, marginTop: 14 }}>{p.role}</div>
                  <div style={{ width: 90, height: 2, background: rgba(s.a1, 0.8), margin: '34px 0' }} />
                  <div style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, textAlign: 'center' }}>{p.quote}</div>
                </>
              )}
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1500, width: MW, textAlign: 'center', fontFamily: MONO, fontSize: 22, letterSpacing: 6, color: s.faint, opacity: EASE.enter(seg(t, 1.7, 2.1)) }}>{p.award} · {p.dateText}</div>
        <Sfx name="whoosh" at={0.25} vol={0.24} />
        <Sfx name="whoosh" at={1.66} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="flip" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text="THE NUMBER" x={MX} y={400} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={470} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 960, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 700, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        {p.rows.slice(0, 2).map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: MX, top: 1120 + i * 62, width: MW, display: 'flex', justifyContent: 'space-between', fontSize: 26, color: s.dim, opacity: EASE.enter(seg(t, 5.0 + i * 0.12, 5.4 + i * 0.12)) }}>
            <span>{r.name} · {r.role}</span><span style={{ fontFamily: MONO, color: s.ink }}>{r.value}</span>
          </div>
        ))}
        <Tag s={s} t={t} text={p.award} x={MX} y={1330} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 47 · 小票 DOCKET ============ 细长小票从下往上滚出，虚线分项，底部条码 */
export const Docket: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const roll = outQuint(seg(t, 0.25, 1.9));
  const rw = 620, rx = CX - rw / 2, ry = 360, rh = 1180;
  const paper = s.mode === 'dark' ? rgba('#F2EDE3', 0.94) : rgba('#FFFDF6', 0.98);
  const ink = '#241F1A';
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.012} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={12}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={86} start={0.18} align="center" lines={1} />
        <div style={{ position: 'absolute', left: rx, top: ry, width: rw, height: rh * roll, overflow: 'hidden', boxShadow: `0 26px 80px ${rgba('#000000', 0.35)}`, transform: `translateY(${(1 - roll) * 300}px)` }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: rw, height: rh, background: paper }}>
            <div style={{ position: 'absolute', left: 0, top: 46, width: rw, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: ink }}>HONOUR RECEIPT</div>
            <div style={{ position: 'absolute', left: 0, top: 92, width: rw, textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: rgba(ink, 0.6) }}>{p.brand} / {p.dateText}</div>
            <div style={{ position: 'absolute', left: 40, top: 140, width: rw - 80, borderTop: `2px dashed ${rgba(ink, 0.45)}` }} />
            {[
              ['HONOREE', p.honoree],
              ['ROLE', p.role],
              ['AWARD', p.award],
            ].map(([k, v], i) => (
              <div key={i} style={{ position: 'absolute', left: 44, top: 168 + i * 96, width: rw - 88 }}>
                <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: rgba(ink, 0.55) }}>{k}</div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: fitSize(v, rw - 100, 38, 2, 22), color: ink, marginTop: 6, whiteSpace: 'nowrap' }}>{v}</div>
              </div>
            ))}
            <div style={{ position: 'absolute', left: 40, top: 470, width: rw - 80, borderTop: `2px dashed ${rgba(ink, 0.45)}` }} />
            {p.rows.slice(0, 4).map((r, i) => (
              <div key={i} style={{ position: 'absolute', left: 44, top: 494 + i * 66, width: rw - 88, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 24, color: ink }}>
                <span>{r.name}</span><span>{r.value}</span>
              </div>
            ))}
            <div style={{ position: 'absolute', left: 40, top: 772, width: rw - 80, borderTop: `2px dashed ${rgba(ink, 0.45)}` }} />
            <div style={{ position: 'absolute', left: 44, top: 796, width: rw - 88, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: MONO, fontSize: 26, color: ink }}>TOTAL {p.metric.unit}</span>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 66, color: ink }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)}</span>
            </div>
            <div style={{ position: 'absolute', left: 44, top: 890, width: rw - 88, textAlign: 'right', fontFamily: MONO, fontSize: 18, color: rgba(ink, 0.6) }}>{p.metric.label}</div>
            <div style={{ position: 'absolute', left: 40, top: 950, width: rw - 80, borderTop: `2px dashed ${rgba(ink, 0.45)}` }} />
            <div style={{ position: 'absolute', left: 44, top: 974, width: rw - 88, fontFamily: MONO, fontSize: 22, lineHeight: 1.7, color: rgba(ink, 0.78) }}>{p.quote}</div>
            {/* 条码 */}
            <div style={{ position: 'absolute', left: 60, bottom: 66, width: rw - 120, height: 54, display: 'flex', gap: 3, alignItems: 'flex-end' }}>
              {Array.from({ length: 46 }).map((_, i) => (
                <div key={i} style={{ flex: i % 5 === 0 ? 2 : 1, height: 32 + ((i * 13) % 22), background: ink, opacity: 0.85 }} />
              ))}
            </div>
            <div style={{ position: 'absolute', left: 0, bottom: 26, width: rw, textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: rgba(ink, 0.6) }}>NO. 2026-0001</div>
          </div>
          {/* 锯齿底 */}
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: rw, height: 16, background: paper, clipPath: 'polygon(0 0,100% 0,100% 0,95% 100%,90% 0,85% 100%,80% 0,75% 100%,70% 0,65% 100%,60% 0,55% 100%,50% 0,45% 100%,40% 0,35% 100%,30% 0,25% 100%,20% 0,15% 100%,10% 0,5% 100%,0 0)' }} />
        </div>
        <Sfx name="whoosh" at={0.3} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="docket" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={502} w={MW} size={200} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 1000, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, paddingTop: 18, borderTop: `2px solid ${rgba(s.a1, 0.6)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1170, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.subtitle}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1360} align="center" w={MW} start={5.4} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 48 · 信封 ENVELOPE ============ 信封打开，信纸从里面抽出来 */
export const Envelope: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const ex = 128, ew = 824, ey = 900, eh = 520;
  const open = outQuint(seg(t, 0.35, 1.2));
  const rise = outQuint(seg(t, 0.9, 2.0));
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        {/* 信纸 */}
        <div style={{ position: 'absolute', left: ex + 62, top: ey - 480 * rise + 40, width: ew - 124, height: 760, background: s.panel, border: `1px solid ${rgba(s.a1, 0.4)}`, boxShadow: `0 24px 70px ${rgba(s.ink, 0.18)}`, opacity: Math.min(1, rise * 2) }}>
          <div style={{ position: 'absolute', left: 44, top: 56, width: ew - 212, fontFamily: MONO, fontSize: 18, letterSpacing: 8, color: rgba(s.a1, 0.9) }}>LETTER OF HONOUR</div>
          <div style={{ position: 'absolute', left: 44, top: 96, width: ew - 212, fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, ew - 240, 96, 3, 40), color: s.ink, lineHeight: 1.25 }}>{p.title}</div>
          <div style={{ position: 'absolute', left: 44, top: 300, width: ew - 230, fontFamily: SERIF, fontSize: 30, lineHeight: 1.85, color: s.dim }}>{p.quote}</div>
          <div style={{ position: 'absolute', left: 44, bottom: 120, width: ew - 212, fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: s.ink }}>{p.honoree}</div>
          <div style={{ position: 'absolute', left: 44, bottom: 74, width: ew - 212, fontSize: 22, color: s.faint }}>{p.role} · {p.dateText}</div>
        </div>
        {/* 信封后片 */}
        <div style={{ position: 'absolute', left: ex, top: ey, width: ew, height: eh, background: s.mode === 'dark' ? rgba(s.a1, 0.16) : rgba(s.a1, 0.1), border: `2px solid ${rgba(s.a1, 0.55)}`, borderRadius: 6 }} />
        {/* 前袋 */}
        <div style={{ position: 'absolute', left: ex, top: ey + 90, width: ew, height: eh - 90, background: s.panel, border: `2px solid ${rgba(s.a1, 0.55)}`, clipPath: 'polygon(0 12%,50% 58%,100% 12%,100% 100%,0 100%)', zIndex: 3 }} />
        {/* 封盖 */}
        <div style={{ position: 'absolute', left: ex, top: ey, width: ew, height: 300, background: s.mode === 'dark' ? rgba(s.a1, 0.24) : rgba(s.a1, 0.16), border: `2px solid ${rgba(s.a1, 0.55)}`, clipPath: 'polygon(0 0,50% 100%,100% 0)', transformOrigin: 'top center', transform: `rotateX(${open * 168}deg)`, opacity: 1 - open * 0.25, zIndex: 4 }} />
        {/* 火漆 */}
        <div style={{ position: 'absolute', left: CX - 46, top: ey + 236, width: 92, height: 92, borderRadius: '50%', background: rgba(s.a2, 0.95), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 22px rgba(0,0,0,.3)', zIndex: 5, transform: `scale(${1 - open}) rotate(${open * 40}deg)`, opacity: 1 - open }}>
          <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 42, color: '#fff' }}>贺</span>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1470, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.6, 2.1)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1550, width: MW, textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: rgba(s.a1, 0.9), opacity: EASE.enter(seg(t, 1.8, 2.2)) }}>{p.award}</div>
        <Sfx name="whoosh" at={0.4} vol={0.26} />
        <Sfx name="chime" at={1.0} vol={0.18} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="envelope" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.award} x={MX} y={420} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={490} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 980, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1140, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.subtitle}</div>
        <Tag s={s} t={t} text={p.title} x={MX} y={1340} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 49 · 旗帜 FLAG ============ 旗杆 + 飘动旗面，字被风吹得微微起伏 */
export const Flag: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const fTop = 440, fBot = 1220;
  const wave = (x: number) => Math.sin(x / 74 + t * 2.3) * 26 * ((x - 200) / 740);
  const fg = onColor(s.a1);
  const path = (() => {
    const pts: string[] = [];
    for (let x = 200; x <= 940; x += 20) pts.push(`${x},${fTop + wave(x)}`);
    for (let x = 940; x >= 200; x -= 20) pts.push(`${x},${fBot + wave(x)}`);
    return `M ${pts.join(' L ')} Z`;
  })();
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={200} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={256} w={MW} size={96} start={0.15} align="center" lines={1} />
        {/* 旗面 */}
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d={path} fill={rgba(s.a1, 0.92)} style={{ opacity: EASE.enter(seg(t, 0.3, 0.9)) }} />
          <path d={path} fill="none" stroke={rgba('#FFFFFF', 0.22)} strokeWidth={3} />
          <path d={`M 200 ${fTop + 46} L 940 ${fTop + 46}`} stroke={rgba('#FFFFFF', 0.12)} strokeWidth={2} />
        </svg>
        {/* 旗杆 */}
        <div style={{ position: 'absolute', left: 168, top: 380, width: 16, height: 1020, borderRadius: 8, background: `linear-gradient(90deg, ${rgba(s.a1, 0.95)}, ${rgba(s.a1, 0.5)}, ${rgba(s.a1, 0.95)})`, boxShadow: `0 0 30px ${rgba(s.a1, 0.25)}` }} />
        <div style={{ position: 'absolute', left: 158, top: 356, width: 36, height: 36, borderRadius: '50%', background: s.a2, boxShadow: `0 0 24px ${rgba(s.a2, 0.6)}` }} />
        <div style={{ position: 'absolute', left: 250, top: 678, width: 640, textAlign: 'center', opacity: EASE.enter(seg(t, 0.6, 1.1)) }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 8, color: rgba(fg, 0.78) }}>VICTORY BANNER</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 600, 96, 3, 40), color: fg, marginTop: 16, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 28, color: rgba(fg, 0.85), marginTop: 14 }}>{p.role}</div>
          <div style={{ width: 96, height: 3, background: rgba(fg, 0.6), margin: '26px auto 0' }} />
          <div style={{ fontFamily: SERIF, fontSize: 34, color: rgba(fg, 0.92), marginTop: 26, lineHeight: 1.7 }}>{p.award}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1300, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.4, 1.9)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1402, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.faint, opacity: EASE.enter(seg(t, 1.7, 2.2)) }}>{p.quote}</div>
        <Sfx name="whoosh" at={0.35} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="flag" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={420} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={490} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 980, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', paddingTop: 20, borderTop: `3px solid ${i === 0 ? s.a1 : rgba(s.ink, 0.2)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.ink }}>{f.v}</div>
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

/* ============ 50 · 拱门 ARCH ============ 罗马拱门，门楣刻字，柱上刻数据 */
export const Arch: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const lx = 150, pil = 104, aw = 780, r = aw / 2, springY = 940, archTop = springY - r;
  const colTop = springY - 20, colBot = 1420;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.018} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        {/* 门楣 */}
        <div style={{ position: 'absolute', left: MX - 20, top: 358, width: MW + 40, height: 124, background: s.panel, border: `2px solid ${rgba(s.a1, 0.65)}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: EASE.enter(seg(t, 0.2, 0.7)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, MW - 80, 82, 3, 36), color: s.ink, letterSpacing: 8, opacity: EASE.enter(seg(t, 0.3, 0.9)) }}>{p.title}</div>
        </div>
        {/* 拱 + 柱（SVG 画，避免 border-radius 竖向半径被截断） */}
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, opacity: EASE.enter(seg(t, 0.4, 1.0)) }}>
          <path d={`M ${lx} ${springY} L ${lx} ${springY - r} A ${r} ${r} 0 0 1 ${lx + aw} ${springY - r} L ${lx + aw} ${springY}`} fill="none" stroke={rgba(s.a1, 0.6)} strokeWidth={3} />
          <path d={`M ${lx + 22} ${springY} L ${lx + 22} ${springY - r + 22} A ${r - 22} ${r - 22} 0 0 1 ${lx + aw - 22} ${springY - r + 22} L ${lx + aw - 22} ${springY}`} fill="none" stroke={rgba(s.a1, 0.3)} strokeWidth={1.5} />
        </svg>
        {/* 柱 */}
        {[lx - pil, lx + aw].map((x, i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: colTop, width: pil, height: colBot - colTop, background: `linear-gradient(90deg, ${rgba(s.ink, 0.02)}, ${rgba(s.ink, 0.09)}, ${rgba(s.ink, 0.02)})`, border: `1px solid ${rgba(s.a1, 0.4)}`, borderTop: 'none', borderBottom: 'none' }}>
            {Array.from({ length: 6 }).map((_, k) => (
              <div key={k} style={{ position: 'absolute', left: 16, top: 40 + k * 78, width: pil - 32, height: 1, background: rgba(s.a1, 0.2) }} />
            ))}
          </div>
        ))}
        {/* 柱顶/柱础 */}
        {[lx - pil, lx + aw].map((x, i) => (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: x - 12, top: colTop - 26, width: pil + 24, height: 24, background: rgba(s.a1, 0.55) }} />
            <div style={{ position: 'absolute', left: x - 14, top: colBot - 24, width: pil + 28, height: 24, background: rgba(s.a1, 0.55) }} />
          </React.Fragment>
        ))}
        {/* 拱内 */}
        <div style={{ position: 'absolute', left: lx + 60, top: archTop + 62, width: aw - 120, textAlign: 'center', opacity: EASE.enter(seg(t, 0.8, 1.3)) }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 10, color: rgba(s.a1, 0.9) }}>HONOURED</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, aw - 180, 92, 3, 40), color: s.ink, marginTop: 18, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 12 }}>{p.role}</div>
        </div>
        <div style={{ position: 'absolute', left: lx + 60, top: 836, width: aw - 120, textAlign: 'center', fontFamily: SERIF, fontSize: 32, lineHeight: 1.6, color: s.dim, opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>{p.award}</div>
        <div style={{ position: 'absolute', left: MX, top: 1500, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.7, 2.2)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1592, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 30, lineHeight: 1.8, color: s.faint, opacity: EASE.enter(seg(t, 1.9, 2.4)) }}>{p.quote}</div>
        <Sfx name="whoosh" at={0.4} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="arch" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={420} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={490} w={MW} size={198} start={3.8} align="center" />
        {p.facts.slice(0, 3).map((f, i) => (
          <div key={i} style={{ position: 'absolute', left: MX, top: 960 + i * 96, width: MW, display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${rgba(s.ink, 0.14)}`, paddingBottom: 14, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
            <span style={{ fontSize: 27, color: s.dim }}>{f.k}</span>
            <span style={{ fontFamily: MONO, fontSize: 40, fontWeight: 700, color: s.ink }}>{f.v}</span>
          </div>
        ))}
        <div style={{ position: 'absolute', left: MX, top: 1270, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1450} align="center" w={MW} start={5.4} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
