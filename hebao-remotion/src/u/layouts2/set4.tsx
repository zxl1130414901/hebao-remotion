import React from 'react';
import type { LP } from './base';
import { MX, MW, CX } from './base';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Lead, Metric, Tag, Title } from '../kit/Type';
import { EndCard, FactRow, Rule, Sfx } from '../kit/Bits';
import { EASE, fitSize, outBack, outQuint, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';

/* ============ 16 · 数字塔 TOWER ============ 核心数字逐位落成一座塔 */
export const Tower: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const str = (p.metric.value.toFixed(p.metric.decimals ?? 0)).slice(0, 5).split('');
  const size = Math.min(430, Math.floor(1350 / str.length) - 24);
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={18}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={150} align="center" w={MW} start={0.05} />
        <div style={{ position: 'absolute', left: MX, top: 230, width: MW, textAlign: 'center', fontSize: 32, letterSpacing: 4, color: s.dim, opacity: EASE.enter(seg(t, 0.2, 0.6)) }}>{p.title}</div>
        <div style={{ position: 'absolute', left: 0, top: 330, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {str.map((g, i) => {
            const drop = outBack(seg(t, 0.3 + i * 0.16, 0.95 + i * 0.16));
            return (
              <div key={i} style={{ fontFamily: s.numFamily, fontWeight: s.numWeight, fontSize: size, lineHeight: 1.02, color: i === str.length - 1 && arr ? s.a1 : s.ink, textShadow: s.titleGlow, opacity: Math.min(1, drop * 1.3), transform: `translateY(${(1 - drop) * -260}px)` }}>{g}</div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1420, width: MW, textAlign: 'center', fontSize: 34, letterSpacing: 6, color: s.a1, opacity: EASE.enter(seg(t, 0.4 + str.length * 0.16, 0.9 + str.length * 0.16)) }}>{p.metric.label} · 单位 {p.metric.unit}</div>
        <Sfx name="impact" at={0.4 + str.length * 0.16} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <div style={{ position: 'absolute', left: MX, top: 360, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 104, 3, 40), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 3.6, 4.1)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 500, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 3.9, 4.3)) }}>{p.role}</div>
        <div style={{ position: 'absolute', left: MX, top: 610, width: MW, textAlign: 'center', fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif', fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 4.1, 4.6)) }}>{p.quote}</div>
        <div style={{ position: 'absolute', left: MX, top: 830, width: MW, display: 'flex', justifyContent: 'center', gap: 22 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 276, textAlign: 'center', padding: '36px 0', background: s.panel, border: `1px solid ${s.panelLine}`, borderRadius: s.radius, opacity: EASE.enter(seg(t, 4.4 + i * 0.15, 4.9 + i * 0.15)) }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: s.a1, fontFamily: s.numFamily }}>{f.v}</div>
              <div style={{ fontSize: 23, color: s.dim, marginTop: 10 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <Rule s={s} t={t} x={MX} y={1140} w={MW} start={4.9} color={rgba(s.a1, 0.35)} />
        <div style={{ position: 'absolute', left: MX, top: 1180, width: MW, textAlign: 'center', fontSize: 27, color: s.faint, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.subtitle}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1290} align="center" w={MW} start={5.2} />
        <Sfx name="chime" at={4.45} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 17 · 双环 RINGS ============ 双层进度环包裹核心数字 */
export const Rings: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const R1 = 300, R2 = 232;
  const sweep1 = outQuint(seg(t, 0.5, 2.3));
  const sweep2 = outQuint(seg(t, 0.9, 2.7));
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={190} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={280} w={MW} size={100} start={0.2} align="center" lines={1} />
        <svg width={1080} height={1180} style={{ position: 'absolute', left: 0, top: 460 }}>
          <circle cx={540} cy={470} r={R1} fill="none" stroke={rgba(s.ink, 0.08)} strokeWidth={24} />
          <circle cx={540} cy={470} r={R1} fill="none" stroke={s.a1} strokeWidth={24} strokeLinecap="round" strokeDasharray={2 * Math.PI * R1} strokeDashoffset={2 * Math.PI * R1 * (1 - sweep1)} transform={`rotate(${arr ? -90 : -210} 540 470)`} />
          <circle cx={540} cy={470} r={R2} fill="none" stroke={rgba(s.ink, 0.08)} strokeWidth={10} />
          <circle cx={540} cy={470} r={R2} fill="none" stroke={rgba(s.a2, 0.95)} strokeWidth={10} strokeLinecap="round" strokeDasharray={2 * Math.PI * R2} strokeDashoffset={2 * Math.PI * R2 * (1 - sweep2)} transform={`rotate(${arr ? -210 : -90} 540 470)`} />
        </svg>
        <div style={{ position: 'absolute', left: MX, top: 790, width: MW, textAlign: 'center', fontFamily: s.numFamily, fontWeight: s.numWeight, fontSize: 150, color: s.ink, textShadow: s.titleGlow }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)}<span style={{ fontSize: 48, color: s.dim }}>{p.metric.unit}</span></div>
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, textAlign: 'center', fontSize: 30, letterSpacing: 5, color: s.dim }}>{p.metric.label}</div>
        {/* 环上四个刻度标签 */}
        {p.facts.slice(0, 2).map((f, i) => (
          <div key={i} style={{ position: 'absolute', left: i === 0 ? 96 : 704, top: i === 0 ? 560 : 1080, width: 280, textAlign: 'center', opacity: EASE.enter(seg(t, 1.8 + i * 0.2, 2.3 + i * 0.2)) }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: i === 0 ? s.a1 : s.a2 }}>{f.v}</div>
            <div style={{ fontSize: 21, color: s.faint, marginTop: 4 }}>{f.k}</div>
          </div>
        ))}
        <Sfx name="whoosh" at={0.55} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <div style={{ position: 'absolute', left: MX, top: 400, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 102, 3, 40), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 3.6, 4.1)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 540, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 3.9, 4.3)) }}>{p.role}</div>
        <Rule s={s} t={t} x={CX - 90} y={660} w={180} start={4.1} color={rgba(s.a1, 0.65)} thick={2} />
        <div style={{ position: 'absolute', left: MX, top: 720, width: MW, textAlign: 'center', fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif', fontSize: 36, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 4.2, 4.7)) }}>{p.quote}</div>
        <div style={{ position: 'absolute', left: MX, top: 960, width: MW, display: 'flex', justifyContent: 'center', gap: 22 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 276, textAlign: 'center', padding: '36px 0', background: s.panel, border: `1px solid ${s.panelLine}`, borderRadius: s.radius, opacity: EASE.enter(seg(t, 4.6 + i * 0.14, 5.1 + i * 0.14)) }}>
              <div style={{ fontSize: 46, fontWeight: 800, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 22, color: s.dim, marginTop: 10 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1300} align="center" w={MW} start={5.2} />
        <Sfx name="impact" at={4.2} vol={0.22} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 18 · 弹幕流 TICKER ============ 五条横向信息流穿屏，主角定在中央 */
export const Ticker: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const items = p.rows.slice(0, 5);
  const rowY = [430, 590, 750, 910, 1070];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={220} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={310} w={MW} size={130} start={0.2} align="center" lines={1} glow={s.titleGlow} />
        {items.map((r, i) => {
          const dir = (i + (arr ? 1 : 0)) % 2 === 0 ? 1 : -1;
          const speed = 90 + i * 26;
          const off = ((t * speed * dir) % 1400 + 1400) % 1400 - 200;
          return (
            <div key={i} style={{ position: 'absolute', left: 0, top: rowY[i] + 70, width: 1080, height: 74, background: i === 0 ? rgba(s.a1, 0.12) : s.panel, borderTop: `1px solid ${s.panelLine}`, borderBottom: `1px solid ${s.panelLine}`, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: off, top: 0, height: 74, display: 'flex', alignItems: 'center', gap: 28, whiteSpace: 'nowrap', fontSize: 28 }}>
                <span style={{ color: i === 0 ? s.a1 : s.faint, fontFamily: s.numFamily }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ color: s.ink, fontWeight: 700 }}>{r.name}</span>
                <span style={{ color: s.faint }}>{r.role}</span>
                <span style={{ color: s.a1, fontFamily: s.numFamily, fontWeight: 700 }}>{r.value}</span>
                <span style={{ color: s.faint, opacity: 0.6 }}>·</span>
                <span style={{ color: s.dim }}>{p.metric.label}</span>
                <span style={{ color: s.faint, opacity: 0.6 }}>·</span>
                <span style={{ color: s.dim }}>{p.subtitle}</span>
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: CX - 240, top: 640, width: 480, textAlign: 'center', padding: '40px 0', background: s.pg, border: `2px solid ${rgba(s.a1, 0.7)}`, borderRadius: s.radius, boxShadow: '0 20px 60px rgba(0,0,0,.35)', opacity: outBack(seg(t, 0.9, 1.6)) }}>
          <div style={{ fontSize: 20, letterSpacing: 6, color: s.faint }}>TOP</div>
          <div style={{ fontWeight: 900, fontSize: fitSize(items[0]?.name ?? '', 380, 64, 2, 30), color: s.a1, marginTop: 8, whiteSpace: 'nowrap' }}>{items[0]?.name ?? ''}</div>
          <div style={{ fontSize: 22, color: s.dim, marginTop: 8 }}>{items[0]?.role ?? ''}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1290, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 1.8, 2.3)) }}>{p.award} · {p.dateText}</div>
        <Sfx name="whoosh" at={0.2} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={18}>
        {/* 第二幕：条带只走上下两端，中央留实底信息带，主数字不被穿屏文字压住 */}
        {[0, 1, 3, 4].map((i) => {
          const r = items[i] ?? { name: '', role: '', value: '' };
          const stripY = i < 2 ? 190 + i * 84 : 1300 + (i - 2) * 84;
          const dir = (i + (arr ? 1 : 0)) % 2 === 0 ? 1 : -1;
          const off = ((t * (70 + i * 18) * dir) % 1400 + 1400) % 1400 - 200;
          return (
            <div key={i} style={{ position: 'absolute', left: 0, top: stripY, width: 1080, height: 64, background: i === 0 ? rgba(s.a1, 0.14) : s.panel, borderTop: `1px solid ${s.panelLine}`, borderBottom: `1px solid ${s.panelLine}`, overflow: 'hidden', opacity: EASE.enter(seg(t, 3.6 + i * 0.08, 4.0 + i * 0.08)) }}>
              <div style={{ position: 'absolute', left: off, top: 0, height: 64, display: 'flex', alignItems: 'center', gap: 24, whiteSpace: 'nowrap', fontSize: 24 }}>
                {Array.from({ length: 4 }).map((_, k) => (
                  <span key={k} style={{ display: 'inline-flex', gap: 20, alignItems: 'baseline' }}>
                    <span style={{ color: s.ink, fontWeight: 700 }}>{r.name}</span>
                    <span style={{ color: s.faint }}>{r.role}</span>
                    <span style={{ color: s.a1, fontFamily: s.numFamily }}>{r.value}</span>
                    <span style={{ color: s.faint, opacity: 0.5 }}>／</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 0, top: 460, width: 1080, height: 580, background: s.pg }} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={505} w={MW} size={170} start={4.2} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 850, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 54, 3, 30), color: s.ink, opacity: EASE.enter(seg(t, 4.8, 5.3)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 940, width: MW, textAlign: 'center', fontSize: 26, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Sfx name="impact" at={4.25} vol={0.24} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 19 · 领奖台 PODIUM ============ 三级台阶升起，前三名站上去 */
export const Podium: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const rows = p.rows.slice(0, 3);
  const base = 1420;
  const steps = arr
    ? [{ x: 140, h: 300, n: 2 }, { x: 400, h: 430, n: 1 }, { x: 660, h: 220, n: 3 }]
    : [{ x: 160, h: 320, n: 2 }, { x: 420, h: 440, n: 1 }, { x: 680, h: 230, n: 3 }];
  const order = [1, 0, 2]; // 视觉顺序：冠军先出
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={250} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={340} w={MW} size={120} start={0.2} align="center" lines={1} glow={s.titleGlow} />
        <Lead s={s} t={t} text={p.subtitle} x={MX} y={560} w={MW} size={34} start={0.6} align="center" lines={2} />
        <Sfx name="whoosh" at={0.2} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <div style={{ position: 'absolute', left: MX, top: 240, width: MW, textAlign: 'center', fontSize: 26, letterSpacing: 8, color: s.faint, opacity: EASE.enter(seg(t, 3.6, 4.0)) }}>{p.award} · 前三名</div>
        {steps.map((st, vi) => {
          const ri = order[vi];
          const r = rows[ri];
          const up = outQuint(seg(t, 3.65 + vi * 0.22, 4.45 + vi * 0.22));
          return (
            <React.Fragment key={vi}>
              <div style={{ position: 'absolute', left: st.x, top: base - st.h * up, width: 260, height: st.h, background: st.n === 1 ? rgba(s.a1, 0.85) : s.panel, border: `1px solid ${st.n === 1 ? rgba(s.a1, 0.9) : s.panelLine}`, borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: s.numFamily, fontWeight: 800, fontSize: 96, color: st.n === 1 ? (s.mode === 'dark' ? '#0A0C12' : '#fff') : rgba(s.ink, 0.4) }}>{st.n}</span>
              </div>
              <div style={{ position: 'absolute', left: st.x, top: base - st.h * up - 110, width: 260, textAlign: 'center', opacity: up }}>
                <div style={{ fontWeight: 800, fontSize: fitSize(r?.name ?? '', 240, 42, 1, 20), whiteSpace: 'nowrap', color: s.ink }}>{r?.name ?? ''}</div>
                <div style={{ fontSize: 20, color: s.faint, marginTop: 4 }}>{r?.role ?? ''}</div>
                <div style={{ fontFamily: s.numFamily, fontSize: 34, fontWeight: 700, color: st.n === 1 ? s.a1 : s.dim, marginTop: 4 }}>{r?.value ?? ''}</div>
              </div>
            </React.Fragment>
          );
        })}
        <Rule s={s} t={t} x={MX} y={base + 2} w={MW} start={3.7} color={rgba(s.a1, 0.6)} thick={3} />
        {/* 4-5 名 */}
        {p.rows.slice(3, 5).map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: MX + 40, top: 1480 + i * 74, width: MW - 80, display: 'flex', justifyContent: 'space-between', fontSize: 26, color: s.dim, opacity: EASE.enter(seg(t, 4.7 + i * 0.15, 5.1 + i * 0.15)) }}>
            <span><b style={{ color: s.faint, marginRight: 14 }}>{i + 4}</b>{r.name} · {r.role}</span>
            <span style={{ fontFamily: s.numFamily, color: s.dim }}>{r.value}</span>
          </div>
        ))}
        <Sfx name="impact" at={3.7} vol={0.26} />
        <Sfx name="pop" at={3.95} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 20 · 盖章 STAMP ============ 文书铺底，巨印从天砸下 */
export const Stamp: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const SLAM = 4.1;
  const hit = seg(t, SLAM, SLAM + 0.16);
  const sealScale = hit > 0 ? 1.9 - outQuint(hit) * 0.9 : t > 3.5 ? 1.9 : 0;
  const shake = hit > 0 ? (1 - hit) * 10 * Math.sin(hit * 40) : 0;
  const sealRot = arr ? -10 : 8;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        {/* 文书 */}
        <div style={{ position: 'absolute', left: 108, top: 330, width: 864, height: 1180, background: s.mode === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.6)', border: `1px solid ${s.panelLine}`, borderRadius: 8, padding: '70px 64px', boxShadow: '0 20px 60px rgba(0,0,0,.2)', transform: `translateY(${(1 - EASE.enter(seg(t, 0.15, 0.8))) * 30}px)` }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: s.faint, textAlign: 'center' }}>{p.brand} · {p.dateText}</div>
          <Rule s={s} t={t} x={64} y={130} w={736} start={0.5} color={rgba(s.ink, 0.3)} />
          <div style={{ marginTop: 60, textAlign: 'center', fontWeight: 900, fontSize: fitSize(p.award, 700, 72, 4, 28), color: s.ink, whiteSpace: 'nowrap' }}>{p.award}</div>
          <div style={{ marginTop: 46, fontSize: 26, color: s.dim, lineHeight: 2.1 }}>
            兹有 <b style={{ color: s.ink }}>{p.honoree}</b>（{p.role}），于 {p.kicker} 期间表现卓越：{p.metric.label} {p.metric.value.toFixed(p.metric.decimals ?? 0)}{p.metric.unit}，{p.facts[0]?.k ?? ''}{p.facts[0]?.v ?? ''}，{p.facts[1]?.k ?? ''}{p.facts[1]?.v ?? ''}。特此表彰。
          </div>
          <div style={{ position: 'absolute', right: 80, bottom: 90, fontSize: 24, color: s.faint }}>批准 · {p.title}</div>
        </div>
        <Sfx name="whoosh" at={0.2} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} y={0}>
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${shake}px,${shake * 0.6}px)` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.25)', opacity: Math.min(1, seg(t, 3.5, 4.1) * 0.8) }} />
          {/* 巨印 */}
          <div style={{ position: 'absolute', left: CX - 270, top: 640, width: 540, height: 540, borderRadius: '50%', border: `14px solid rgba(196,44,34,${0.85 + 0.15 * (1 - hit)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${sealScale}) rotate(${sealRot}deg)`, boxShadow: `0 0 90px rgba(196,44,34,.35)` }}>
            <div style={{ position: 'absolute', inset: 26, borderRadius: '50%', border: `3px solid rgba(196,44,34,.7)` }} />
            <span style={{ fontWeight: 900, fontSize: 200, color: 'rgba(196,44,34,.95)', lineHeight: 1 }}>贺</span>
            <span style={{ fontSize: 26, letterSpacing: 8, color: 'rgba(196,44,34,.9)', marginTop: 12 }}>{p.dateText}</span>
          </div>
          <div style={{ position: 'absolute', left: MX, top: 1330, width: MW, textAlign: 'center', fontWeight: 900, fontSize: fitSize(p.honoree, 872, 72, 3, 30), color: s.ink, opacity: EASE.enter(seg(t, SLAM + 0.2, SLAM + 0.7)), whiteSpace: 'nowrap' }}>{p.honoree} · {p.title}</div>
          <div style={{ position: 'absolute', left: MX, top: 1450, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, SLAM + 0.4, SLAM + 0.9)) }}>{p.quote}</div>
        </div>
        <Sfx name="stamp" at={SLAM} vol={0.4} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
