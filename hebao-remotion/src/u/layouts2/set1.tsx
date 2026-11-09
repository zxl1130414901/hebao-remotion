import React from 'react';
import type { LP } from './base';
import { MX, MW, CX } from './base';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Lead, Kicker, Metric, Tag, Title } from '../kit/Type';
import { EndCard, FactRow, Rule, Sfx } from '../kit/Bits';
import { EASE, fitSize, outBack, outQuint, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';

/* ============ 01 · 勋章 MEDAL ============ 中央圆章 + 缎带，名字压进章面 */
export const Medal: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const R = 232;
  const cy = 690;
  const spin = arr ? 1 : -1;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={20}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={168} align="center" w={MW} start={0.05} />
        {/* 缎带 */}
        {[
          { x: CX - 150, rot: -26, c: s.a2 },
          { x: CX + 150, rot: 26, c: s.a1 },
        ].map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: r.x - 46, top: 250, width: 92, height: 240, background: r.c, clipPath: 'polygon(0 0,100% 0,100% 78%,50% 100%,0 78%)', opacity: 0.9, transform: `rotate(${r.rot * spin}deg)`, transformOrigin: 'top center' }} />
        ))}
        {/* 章体 */}
        <div style={{ position: 'absolute', left: CX - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: '50%', border: `3px solid ${rgba(s.a1, 0.85)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 70px ${rgba(s.a1, 0.25)}`, transform: `scale(${0.7 + outBack(seg(t, 0.3, 1.1)) * 0.3})` }}>
          <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', border: `1px dashed ${rgba(s.ink, 0.35)}` }} />
          <div style={{ position: 'absolute', inset: 34, borderRadius: '50%', background: s.panel, border: `1px solid ${s.panelLine}` }} />
          <div style={{ position: 'relative', textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 22, letterSpacing: 8, color: s.faint, fontFamily: 'Oswald,sans-serif' }}>MEDAL</div>
            <div style={{ fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif', fontWeight: 800, fontSize: fitSize(p.award, R * 1.5, 92, 4, 40), lineHeight: 1.3, color: s.ink, marginTop: 10 }}>{p.award}</div>
            <div style={{ fontSize: 20, letterSpacing: 6, color: rgba(s.a1, 0.9), marginTop: 12 }}>★ ★ ★</div>
          </div>
        </div>
        <Title s={s} t={t} text={p.title} x={MX} y={cy + R + 66} w={MW} size={110} start={0.7} align="center" lines={1} glow={s.titleGlow} />
        <Lead s={s} t={t} text={p.subtitle} x={MX} y={cy + R + 232} w={MW} size={34} start={1.0} align="center" lines={2} />
        <Sfx name="impact" at={0.95} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={24}>
        <Kicker s={s} t={t} text="THE HONOUR GOES TO" x={MX} y={330} align="center" w={MW} start={3.6} size={26} />
        <div style={{ position: 'absolute', left: MX, top: 396, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 108, 3, 40), whiteSpace: 'nowrap', color: s.ink, opacity: EASE.enter(seg(t, 3.64, 4.14)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 540, width: MW, textAlign: 'center', fontSize: 30, letterSpacing: 3, color: s.dim, opacity: EASE.enter(seg(t, 3.9, 4.4)) }}>{p.role}</div>
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={650} w={MW} size={200} start={4.0} align="center" />
        <Rule s={s} t={t} x={CX - 110} y={1120} w={220} start={4.7} color={rgba(s.a1, 0.6)} />
        {p.facts.slice(0, 3).map((f, i) => (
          <FactRow key={i} s={s} t={t} k={f.k} v={f.v} x={MX + (MW / 3) * i} y={1170} w={MW / 3 - 30} start={4.9 + i * 0.14} align="col" big />
        ))}
        <Sfx name="chime" at={4.0} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 02 · 证书 CERTIFICATE ============ 双线框文书 + 衬线 + 火漆印 */
export const Certificate: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const px = MX, py = 300, pw = MW, ph = 1330;
  const serif = '"Noto Serif SC",serif';
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={18}>
        <div style={{ position: 'absolute', left: px, top: py, width: pw, height: ph, border: `3px solid ${rgba(s.a1, 0.8)}`, borderRadius: 6 }}>
          <div style={{ position: 'absolute', inset: 16, border: `1px solid ${rgba(s.ink, 0.28)}`, borderRadius: 3 }} />
          {/* 四角花饰 */}
          {[[10, 10], [pw - 46, 10], [10, ph - 46], [pw - 46, ph - 46]].map(([x, y], i) => (
            <div key={i} style={{ position: 'absolute', left: x, top: y, width: 36, height: 36, color: rgba(s.a1, 0.9), fontSize: 30, textAlign: 'center', lineHeight: '36px' }}>❖</div>
          ))}
          <div style={{ position: 'absolute', left: 60, top: 110, width: pw - 120, textAlign: 'center', fontFamily: 'Oswald,serif', fontSize: 24, letterSpacing: 10, color: s.faint }}>CERTIFICATE OF HONOUR</div>
          <div style={{ position: 'absolute', left: 60, top: 190, width: pw - 120, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: fitSize(p.award, pw - 200, 88, 4, 34), color: s.ink }}>{p.award}</div>
          <Rule s={s} t={t} x={CX - 90} y={340} w={180} start={0.6} color={rgba(s.a1, 0.7)} thick={2} />
          <div style={{ position: 'absolute', left: 60, top: 420, width: pw - 120, textAlign: 'center', fontSize: 28, letterSpacing: 4, color: s.dim }}>兹授予</div>
          <div style={{ position: 'absolute', left: 60, top: 500, width: pw - 120, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: fitSize(p.honoree, pw - 240, 120, 6, 40), whiteSpace: 'nowrap', color: s.ink, opacity: EASE.enter(seg(t, 0.9, 1.5)) }}>{p.honoree}</div>
          <div style={{ position: 'absolute', left: 60, top: 690, width: pw - 120, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>{p.role}</div>
          <div style={{ position: 'absolute', left: 140, top: 800, width: pw - 280, fontFamily: serif, fontSize: 32, lineHeight: 1.9, color: s.dim, opacity: EASE.enter(seg(t, 1.5, 2.1)) }}>{p.quote}</div>
          {/* 火漆印 */}
          <div style={{ position: 'absolute', right: arr ? 110 : 70, bottom: 150, width: 128, height: 128, borderRadius: '50%', background: rgba(s.a2, 0.92), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${arr ? 8 : -8}deg)`, boxShadow: '0 4px 24px rgba(0,0,0,.25)', opacity: outBack(seg(t, 2.2, 2.8)) }}>
            <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '2px solid rgba(255,255,255,.55)' }} />
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 52 }}>贺</span>
          </div>
          <div style={{ position: 'absolute', left: 70, bottom: 120, fontSize: 26, color: s.faint, letterSpacing: 2, opacity: EASE.enter(seg(t, 2.4, 2.9)) }}>{p.brand} · {p.dateText}</div>
        </div>
        <Sfx name="whoosh" at={0.25} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={540} w={MW} size={210} start={3.9} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 1010, width: MW, display: 'flex', justifyContent: 'center', gap: 48 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: EASE.enter(seg(t, 4.6 + i * 0.14, 5.1 + i * 0.14)) }}>
              <div style={{ fontSize: 44, fontWeight: 700, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 22, color: s.faint, marginTop: 8, letterSpacing: 2 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <Tag s={s} t={t} text={p.subtitle} x={MX} y={1250} align="center" w={MW} start={5.1} />
        <Sfx name="chime" at={3.9} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 03 · 竖轴 VAXIS ============ 全竖排：右起题字 + 红印 */
export const Vaxis: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const serif = '"Noto Serif SC",serif';
  const rtl = arr === 0; // 题字从右起
  const colTitle = rtl ? 750 : 210;
  const colSub = rtl ? 560 : 400;
  const vtext = (text: string, x: number, y: number, size: number, color: string, start: number, weight = 700) => {
    const lh = Math.round(size * 1.24);
    return (
      <div style={{ position: 'absolute', left: x, top: y, writingMode: 'vertical-rl', fontFamily: serif, fontWeight: weight, fontSize: size, lineHeight: `${lh}px`, letterSpacing: 10, color, height: 1300 }}>
        {text.split('').map((ch, i) => {
          const pr = EASE.enter(seg(t, start + i * 0.14, start + i * 0.14 + 0.55));
          return <span key={i} style={{ opacity: pr, transform: `translateY(${(1 - pr) * 14}px)`, display: 'inline-block' }}>{ch}</span>;
        })}
      </div>
    );
  };
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        {vtext(p.title, colTitle, 250, 148, s.ink, 0.15)}
        {vtext(p.subtitle, colSub, 250, 40, s.dim, 1.0, 400)}
        <div style={{ position: 'absolute', left: rtl ? 360 : 640, top: 260, width: 44, height: 4, background: rgba(s.a1, 0.8), transform: 'rotate(90deg)', transformOrigin: 'center', opacity: EASE.enter(seg(t, 0.9, 1.3)) }} />
        {/* 朱印 */}
        <div style={{ position: 'absolute', left: rtl ? 250 : 740, top: 880, width: 120, height: 120, border: `4px solid ${rgba('#C33A2E', 0.9)}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${arr ? -6 : 6}deg)`, opacity: outBack(seg(t, 1.9, 2.5)) }}>
          <span style={{ fontFamily: serif, fontWeight: 900, fontSize: 62, color: rgba('#C33A2E', 0.95) }}>贺</span>
        </div>
        {vtext(p.brand.replace(/ · /g, '·'), rtl ? 120 : 900, 250, 26, s.faint, 1.6, 500)}
        <Sfx name="chime" at={0.3} vol={0.18} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <div style={{ position: 'absolute', left: MX, top: 360, width: MW, textAlign: 'center', fontSize: 26, letterSpacing: 8, color: s.faint, opacity: EASE.enter(seg(t, 3.6, 4.1)) }}>THE HONOUR GOES TO</div>
        <div style={{ position: 'absolute', left: MX, top: 430, width: MW, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: fitSize(p.honoree, 872, 112, 6, 40), whiteSpace: 'nowrap', color: s.ink, opacity: EASE.enter(seg(t, 3.7, 4.2)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 590, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 4.0, 4.4)) }}>{p.role}</div>
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={700} w={MW} size={190} start={4.2} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 1180, width: MW, textAlign: 'center', fontFamily: serif, fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Sfx name="impact" at={4.2} vol={0.22} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} vertical />
      </Scene>
    </Page>
  );
};

/* ============ 04 · 倒计巨数 COUNTDOWN ============ 数字乱序翻滚后定格为核心数字 */
export const Countdown: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const LOCK = 1.7;
  const str = p.metric.value.toFixed(p.metric.decimals ?? 0);
  const glyphs = str.split('');
  const nSize = Math.min(330, Math.floor(904 / Math.max(1, glyphs.length)) * 1.6);
  const scramble = (i: number) => {
    const seed = Math.floor(t * 9) * 31 + i * 17;
    const pool = '0123456789';
    return pool[(seed * 7 + Math.floor(t * 12)) % 10];
  };
  const locked = t >= LOCK;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={18}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={330} align="center" w={MW} start={0.05} />
        <div style={{ position: 'absolute', left: MX, top: 470, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.title, 880, 96, 4, 40), whiteSpace: 'nowrap', color: s.ink, opacity: EASE.enter(seg(t, 0.2, 0.7)) }}>{p.title}</div>
        <div style={{ position: 'absolute', left: MX, top: 700, width: MW, textAlign: 'center', fontFamily: s.numFamily, fontWeight: s.numWeight, fontSize: nSize, lineHeight: 1.05, color: s.ink, textShadow: s.titleGlow, letterSpacing: 2 }}>
          {glyphs.map((g, i) => {
            const set = locked || t > LOCK - 0.12 * (glyphs.length - i);
            return (
              <span key={i} style={{ opacity: set ? 1 : 0.55, color: set ? s.ink : rgba(s.a1, 0.7) }}>{set ? g : scramble(i)}</span>
            );
          })}
          <span style={{ fontSize: nSize * 0.32, color: s.dim, marginLeft: 10 }}>{p.metric.unit}</span>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1150, width: MW, textAlign: 'center', fontSize: 34, letterSpacing: 6, color: s.dim, opacity: EASE.enter(seg(t, LOCK + 0.15, LOCK + 0.6)) }}>{p.metric.label}</div>
        <Rule s={s} t={t} x={CX - 120} y={1260} w={240} start={LOCK + 0.2} color={rgba(s.a1, 0.65)} thick={2} />
        <div style={{ position: 'absolute', left: MX, top: 1320, width: MW, textAlign: 'center', fontSize: 28, color: s.faint, opacity: EASE.enter(seg(t, LOCK + 0.4, LOCK + 0.9)) }}>{p.honoree} · {p.role}</div>
        <Sfx name="impact" at={LOCK} vol={0.3} />
        <Sfx name="whoosh" at={0.2} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={24}>
        <Kicker s={s} t={t} text={p.award} x={MX} y={420} align="center" w={MW} start={3.6} />
        <Lead s={s} t={t} text={p.quote} x={MX} y={520} w={MW} size={44} start={3.8} align="center" lines={2} />
        <div style={{ position: 'absolute', left: MX, top: 800, width: MW, display: 'flex', justifyContent: 'center', gap: 20 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 280, padding: '34px 0', textAlign: 'center', background: s.panel, border: `1px solid ${s.panelLine}`, borderRadius: s.radius, opacity: EASE.enter(seg(t, 4.3 + i * 0.16, 4.8 + i * 0.16)) }}>
              <div style={{ fontSize: 52, fontWeight: 800, color: s.a1, fontFamily: s.numFamily }}>{f.v}</div>
              <div style={{ fontSize: 24, color: s.dim, marginTop: 10 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1160, width: MW, textAlign: 'center', fontWeight: 700, fontSize: fitSize(p.honoree, 872, 66, 3, 34), whiteSpace: 'nowrap', color: s.ink, opacity: EASE.enter(seg(t, 4.9, 5.4)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 1250, width: MW, textAlign: 'center', fontSize: 26, color: s.faint, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.role}</div>
        <Sfx name="chime" at={4.3} vol={0.18} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 05 · 金句主视觉 QUOTE ============ 巨型引号 + 金句当主角 */
export const QuotePoster: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const qLines = p.quote.length > 18 ? 3 : 2;
  const serif = '"Noto Serif SC",serif';
  const mark = arr ? '”' : '“';
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={20}>
        <div style={{ position: 'absolute', left: arr ? MX + 40 : MX + 60, top: 250, fontFamily: serif, fontWeight: 900, fontSize: 300, lineHeight: 1, color: rgba(s.a1, 0.55), opacity: outQuint(seg(t, 0.15, 0.8)) }}>{mark}</div>
        <div style={{ position: 'absolute', left: MX, top: 500, width: MW, textAlign: 'center', fontFamily: serif, fontWeight: 900, lineHeight: 1.55, color: s.ink, letterSpacing: 4 }}>
          {(() => {
            const per = Math.ceil(p.quote.length / qLines);
            const lines: string[] = [];
            for (let i = 0; i < qLines; i++) lines.push(p.quote.slice(i * per, (i + 1) * per));
            const fs = Math.min(96, ...lines.map((l) => fitSize(l, 840, 96, 4, 34)));
            return lines.map((l, i) => (
              <div key={i} style={{ fontSize: fs, opacity: EASE.enter(seg(t, 0.35 + i * 0.22, 0.95 + i * 0.22)), transform: `translateY(${(1 - EASE.enter(seg(t, 0.35 + i * 0.22, 0.95 + i * 0.22))) * 22}px)` }}>{l}</div>
            ));
          })()}
        </div>
        <Rule s={s} t={t} x={CX - 70} y={960} w={140} start={1.1} color={rgba(s.a1, 0.7)} thick={2} />
        <div style={{ position: 'absolute', left: MX, top: 1010, width: MW, textAlign: 'center', fontSize: 34, color: s.ink, fontWeight: 700, opacity: EASE.enter(seg(t, 1.15, 1.6)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 1070, width: MW, textAlign: 'center', fontSize: 24, color: s.faint, opacity: EASE.enter(seg(t, 1.3, 1.7)) }}>{p.role}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1200} align="center" w={MW} start={1.5} />
        <Sfx name="chime" at={0.4} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={24}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={400} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={520} w={MW} size={205} start={3.9} align="center" />
        <Lead s={s} t={t} text={p.title} x={MX} y={1000} w={MW} size={52} start={4.4} align="center" lines={1} />
        <div style={{ position: 'absolute', left: MX, top: 1120, width: MW, display: 'flex', justifyContent: 'center', gap: 44 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: EASE.enter(seg(t, 4.7 + i * 0.13, 5.2 + i * 0.13)) }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1300, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 5.2, 5.7)) }}>{p.subtitle}</div>
        <Sfx name="impact" at={3.9} vol={0.24} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
