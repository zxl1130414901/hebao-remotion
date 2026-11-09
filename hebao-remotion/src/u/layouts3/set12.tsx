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

/* ============ 61 · 斜叠卡 STACK ============ 四张卡片斜向堆叠，进场后散成一行 */
export const Stack: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const spread = outQuint(seg(t, 1.4, 2.6));
  const cards = p.facts.slice(0, 3);
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={92} start={0.15} align="center" lines={1} />
        {/* 底层卡 */}
        {[3, 2, 1].map((k) => (
          <div key={k} style={{ position: 'absolute', left: MX + 140 + k * 34, top: 420 - k * 30, width: 620, height: 620, background: s.panel, border: `1px solid ${rgba(s.a1, 0.45)}`, borderRadius: 18, transform: `rotate(${(arr ? 1 : -1) * k * 2 + spread * (arr ? -7 : 7) * k}deg) translateX(${spread * (arr ? -1 : 1) * k * 46}px)`, opacity: 0.92 - k * 0.1, boxShadow: `0 18px 46px ${rgba(s.ink, 0.12)}, 0 2px 0 ${rgba(s.a1, 0.25)}` }} />
        ))}
        {/* 顶层卡 */}
        <div style={{ position: 'absolute', left: MX + 140, top: 420, width: 620, height: 620, background: s.panel, border: `3px solid ${rgba(s.a1, 0.7)}`, borderRadius: 18, boxShadow: `0 30px 80px ${rgba(s.ink, 0.22)}`, transform: `rotate(${(arr ? 1 : -1) * 2 - spread * 4}deg)`, padding: 54 }}>
          <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 8, color: rgba(s.a1, 0.9) }}>CARD 01 / 04</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 500, 76, 3, 32), color: s.ink, marginTop: 24, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 10 }}>{p.role}</div>
          <div style={{ width: 70, height: 2, background: rgba(s.a1, 0.8), margin: '28px 0' }} />
          <div style={{ fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.dim }}>{p.quote}</div>
          <div style={{ position: 'absolute', left: 54, bottom: 40, fontFamily: MONO, fontSize: 20, letterSpacing: 4, color: s.faint }}>{p.award} · {p.dateText}</div>
        </div>
        {/* 散开后的事实卡 */}
        {cards.map((f, i) => (
          <div key={i} style={{ position: 'absolute', left: 118 + i * 292, top: 1120, width: 268, height: 240, background: s.panel, border: `1px solid ${rgba(s.a1, 0.55)}`, borderRadius: 14, boxShadow: `0 14px 34px ${rgba(s.ink, 0.1)}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: EASE.enter(seg(t, 1.7 + i * 0.12, 2.2 + i * 0.12)), transform: `translateY(${(1 - spread) * 120}px)` }}>
            <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 700, color: s.a1 }}>{f.v}</div>
            <div style={{ fontSize: 20, color: s.faint, marginTop: 8 }}>{f.k}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', left: MX, top: 1420, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.9, 2.3)) }}>{p.subtitle}</div>
        <Sfx name="whoosh" at={0.35} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="stack" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={198} start={3.8} align="center" />
        {p.rows.slice(0, 4).map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: MX, top: 960 + i * 92, width: MW, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: i === 0 ? rgba(s.a1, 0.1) : rgba(s.ink, 0.03), border: `1px solid ${rgba(s.ink, 0.1)}`, borderRadius: 10, padding: '16px 24px', opacity: EASE.enter(seg(t, 4.4 + i * 0.13, 4.8 + i * 0.13)) }}>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: s.ink }}>{r.name}</span>
            <span style={{ fontSize: 21, color: s.faint }}>{r.role}</span>
            <span style={{ fontFamily: MONO, fontSize: 34, fontWeight: 700, color: i === 0 ? s.a1 : s.ink }}>{r.value}</span>
          </div>
        ))}
        <Tag s={s} t={t} text={p.award} x={MX} y={1420} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 62 · 横排卡 CAROUSEL ============ 一列横卡缓缓左移，当前卡放大居中 */
export const Carousel: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const items = p.rows.slice(0, 5);
  const cw = 460, ch = 700, gap = 40;
  const travel = outQuint(seg(t, 0.5, 2.6));
  const offset = arr ? 2 : 1;
  const x0 = CX - cw / 2 - offset * (cw + gap) + travel * 0;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={186} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={240} w={MW} size={88} start={0.15} align="center" lines={1} />
        <div style={{ position: 'absolute', left: 0, top: 430, width: 1080, height: ch + 80, overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, rgba(0,0,0,1) 7%, rgba(0,0,0,1) 93%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, rgba(0,0,0,1) 7%, rgba(0,0,0,1) 93%, transparent)' }}>
          {items.map((r, i) => {
            const d = i - offset;
            const x = CX + d * (cw + gap) - cw / 2 - (1 - travel) * (arr ? -1 : 1) * 160;
            const cur = i === offset;
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: cur ? 0 : 46, width: cw, height: cur ? ch : ch - 92, background: s.panel, border: `${cur ? 3 : 1}px solid ${cur ? rgba(s.a1, 0.8) : rgba(s.ink, 0.14)}`, borderRadius: 16, padding: 40, opacity: cur ? 1 : 0.62, boxShadow: cur ? `0 30px 80px ${rgba(s.ink, 0.2)}` : 'none' }}>
                <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 6, color: cur ? rgba(s.a1, 0.95) : s.faint }}>NO. {String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(r.name, cw - 100, 56, 2, 26), color: s.ink, marginTop: 22, whiteSpace: 'nowrap' }}>{r.name}</div>
                <div style={{ fontSize: 22, color: s.faint, marginTop: 8 }}>{r.role}</div>
                <div style={{ position: 'absolute', left: 40, bottom: 44, fontFamily: MONO, fontWeight: 700, fontSize: cur ? 96 : 66, color: cur ? s.a1 : s.ink }}>{r.value}</div>
                {cur ? <div style={{ position: 'absolute', right: 40, bottom: 48, fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: s.faint }}>CURRENT</div> : null}
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1240, width: MW, display: 'flex', justifyContent: 'center', gap: 10 }}>
          {items.map((_, i) => (
            <div key={i} style={{ width: i === offset ? 42 : 14, height: 6, borderRadius: 3, background: i === offset ? s.a1 : rgba(s.ink, 0.2) }} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1310, width: MW, textAlign: 'center', fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 860, 66, 3, 30), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 1.4, 1.9)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 1400, width: MW, textAlign: 'center', fontSize: 26, color: s.dim, opacity: EASE.enter(seg(t, 1.6, 2.0)) }}>{p.role} · {p.award}</div>
        <Sfx name="whoosh" at={0.5} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="carousel" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.a1 }}>{f.v}</div>
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

/* ============ 63 · 放大镜 MAGNIFIER ============ 圆形镜片把一行字局部放大 */
export const Magnifier: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const R = 168;
  const lensX = CX + (arr ? -140 : 140), lensY = 780;
  const zoom = 1 + 0.55 * outQuint(seg(t, 0.6, 1.8));
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={94} start={0.15} align="center" lines={1} />
        <div style={{ position: 'absolute', left: MX, top: 520, width: MW, textAlign: 'center' }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 860, 120, 3, 46), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 30, color: s.dim, marginTop: 16 }}>{p.role}</div>
        </div>
        {/* 被放大的目标行 */}
        <div style={{ position: 'absolute', left: MX, top: 820, width: MW, textAlign: 'center', fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: s.ink, opacity: 0.55 }}>{p.award}</div>
        {/* 镜片 */}
        <div style={{ position: 'absolute', left: lensX - R, top: lensY - R, width: R * 2, height: R * 2, borderRadius: '50%', overflow: 'hidden', border: `6px solid ${rgba(s.a1, 0.85)}`, boxShadow: `0 20px 60px ${rgba(s.ink, 0.25)}, inset 0 0 40px ${rgba(s.a1, 0.2)}`, transform: `scale(${0.4 + 0.6 * outQuint(seg(t, 0.5, 1.4))})` }}>
          <div style={{ position: 'absolute', inset: 0, background: s.panel }} />
          <div style={{ position: 'absolute', left: 0, top: 0, width: R * 2, height: R * 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: s.ink, transform: `scale(${zoom})`, whiteSpace: 'nowrap', lineHeight: 1 }}>{p.award.slice(0, 2)}</div>
          </div>
          <div style={{ position: 'absolute', left: 26, top: 20, width: 70, height: 40, borderRadius: '50%', background: rgba('#FFFFFF', 0.18), transform: 'rotate(-24deg)' }} />
        </div>
        {/* 镜柄 */}
        <div style={{ position: 'absolute', left: lensX + R * 0.62, top: lensY + R * 0.62, width: 24, height: 210, borderRadius: 12, background: `linear-gradient(180deg, ${rgba(s.a1, 0.9)}, ${rgba(s.a2, 0.85)})`, transform: `rotate(${arr ? 42 : -42}deg)`, transformOrigin: 'top center', opacity: EASE.enter(seg(t, 0.6, 1.1)) }} />
        <div style={{ position: 'absolute', left: MX, top: 1100, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1200, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 1.5, 2.0)) }}>{p.quote}</div>
        <div style={{ position: 'absolute', left: MX, top: 1420, width: MW, textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: s.faint, opacity: EASE.enter(seg(t, 1.8, 2.2)) }}>ZOOM {Math.round(zoom * 100)}% · {p.brand}</div>
        <Sfx name="whoosh" at={0.5} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="magnifier" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', paddingTop: 18, borderTop: `2px solid ${rgba(s.a1, 0.5)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1160, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1360} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 64 · 照片墙 WALL ============ 九宫相框墙，中央最大，逐个挂上 */
export const Wall: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const frames = [
    { x: 118, y: 470, w: 240, h: 300 }, { x: 118, y: 800, w: 240, h: 300 }, { x: 118, y: 1130, w: 240, h: 300 },
    { x: 386, y: 430, w: 308, h: 380 }, { x: 386, y: 840, w: 308, h: 380 }, { x: 386, y: 1250, w: 308, h: 300 },
    { x: 722, y: 470, w: 240, h: 300 }, { x: 722, y: 800, w: 240, h: 300 }, { x: 722, y: 1130, w: 240, h: 300 },
  ];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={182} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={236} w={MW} size={84} start={0.15} align="center" lines={1} />
        {frames.map((f, i) => {
          const hang = outBack(seg(t, 0.3 + i * 0.09, 0.95 + i * 0.09));
          const main = i === 4;
          return (
            <div key={i} style={{ position: 'absolute', left: f.x, top: f.y, width: f.w, height: f.h, transform: `translateY(${(1 - hang) * -40}px)`, opacity: Math.min(1, hang * 1.4) }}>
              <div style={{ position: 'absolute', left: f.w / 2 - 1, top: -34, width: 2, height: 34, background: rgba(s.ink, 0.28) }} />
              <div style={{ position: 'absolute', left: f.w / 2 - 4, top: -40, width: 8, height: 8, borderRadius: '50%', background: rgba(s.ink, 0.45) }} />
              <div style={{ position: 'absolute', inset: 0, background: s.panel, border: `${main ? 5 : 2}px solid ${main ? s.a1 : rgba(s.ink, 0.25)}`, boxShadow: main ? `0 18px 44px ${rgba(s.ink, 0.24)}, 0 0 0 1px ${rgba(s.a1, 0.4)}` : `0 14px 34px ${rgba(s.ink, 0.18)}`, padding: main ? 14 : 10 }}>
                <div style={{ position: 'absolute', inset: main ? 14 : 10, background: main ? `linear-gradient(165deg, ${rgba(s.a1, 0.18)}, ${rgba(s.a1, 0.05)})` : `linear-gradient(165deg, ${rgba(s.ink, 0.1)}, ${rgba(s.ink, 0.03)})`, overflow: 'hidden' }}>
                  {main ? (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
                      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, f.w - 50, 40, 2, 18), color: s.ink, textAlign: 'center', lineHeight: 1.3 }}>{p.honoree}</div>
                      <div style={{ fontSize: 18, color: s.dim, marginTop: 8, textAlign: 'center' }}>{p.role}</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ position: 'absolute', left: '50%', top: '22%', width: f.w * 0.2, height: f.w * 0.2, marginLeft: -f.w * 0.1, borderRadius: '50%', background: rgba(s.ink, 0.1) }} />
                      <div style={{ position: 'absolute', left: '50%', top: '44%', width: f.w * 0.4, height: f.h * 0.24, marginLeft: -f.w * 0.2, borderRadius: `${f.w * 0.2}px ${f.w * 0.2}px 0 0`, background: rgba(s.ink, 0.08) }} />
                    </>
                  )}
                </div>
              </div>
              {!main ? <div style={{ position: 'absolute', left: main ? 0 : 8, top: 6, fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: rgba(s.ink, 0.35) }}>{String(i + 1).padStart(2, '0')}</div> : null}
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1560, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 1.4, 1.8)) }}>{p.subtitle}</div>
        <Sfx name="chime" at={0.4} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="wall" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={420} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={490} w={MW} size={196} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 980, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <Lead s={s} t={t} text={p.quote} x={MX} y={1140} w={MW} size={38} start={5.0} align="center" lines={2} />
        <Tag s={s} t={t} text={p.award} x={MX} y={1350} align="center" w={MW} start={5.4} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 65 · 铭牌 PLAQUE ============ 金属铭牌 + 四角螺丝，刻字内凹 */
export const Plaque: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const px = 118, py = 470, pw = 844, ph = 640;
  const metal = `linear-gradient(${arr ? 135 : 45}deg, ${rgba(s.a1, 0.22)}, ${rgba(s.ink, 0.06)} 30%, ${rgba(s.a1, 0.16)} 52%, ${rgba(s.ink, 0.05)} 74%, ${rgba(s.a1, 0.2)})`;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={92} start={0.15} align="center" lines={1} />
        {/* 铭牌 */}
        <div style={{ position: 'absolute', left: px, top: py, width: pw, height: ph, background: metal, border: `4px solid ${rgba(s.a1, 0.6)}`, borderRadius: 8, boxShadow: `0 26px 70px ${rgba(s.ink, 0.24)}, inset 0 2px 0 ${rgba('#FFFFFF', 0.25)}`, opacity: EASE.enter(seg(t, 0.3, 0.9)) }}>
          <div style={{ position: 'absolute', inset: 16, border: `1px solid ${rgba(s.ink, 0.25)}`, borderRadius: 4 }} />
          {[[22, 22], [pw - 54, 22], [22, ph - 54], [pw - 54, ph - 54]].map(([x, y], i) => (
            <div key={i} style={{ position: 'absolute', left: x, top: y, width: 32, height: 32, borderRadius: '50%', background: `radial-gradient(circle at 34% 30%, ${rgba('#FFFFFF', 0.5)}, ${rgba(s.ink, 0.3)} 62%, ${rgba(s.ink, 0.45)})`, boxShadow: 'inset 0 1px 2px rgba(255,255,255,.4), 0 2px 4px rgba(0,0,0,.3)' }}>
              <div style={{ position: 'absolute', left: 14, top: 6, width: 4, height: 20, background: rgba('#000', 0.35), transform: 'rotate(28deg)' }} />
            </div>
          ))}
          <div style={{ position: 'absolute', left: 60, top: 66, width: pw - 120, textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 10, color: rgba(s.ink, 0.55) }}>IN COMMEMORATION</div>
          <div style={{ position: 'absolute', left: 60, top: 130, width: pw - 120, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.award, pw - 170, 92, 3, 40), color: s.ink, textShadow: `0 1px 0 ${rgba('#FFFFFF', 0.55)}, 0 -1px 1px ${rgba('#000', 0.4)}`, lineHeight: 1.25 }}>{p.award}</div>
          <div style={{ position: 'absolute', left: 60, top: 340, width: pw - 120, height: 1, background: rgba(s.ink, 0.25) }} />
          <div style={{ position: 'absolute', left: 60, top: 376, width: pw - 120, textAlign: 'center', fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, pw - 200, 70, 3, 30), color: s.ink, textShadow: `0 1px 0 ${rgba('#FFFFFF', 0.5)}`, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ position: 'absolute', left: 60, top: 470, width: pw - 120, textAlign: 'center', fontSize: 26, color: rgba(s.ink, 0.7) }}>{p.role}</div>
          <div style={{ position: 'absolute', left: 60, top: 528, width: pw - 120, textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 4, color: rgba(s.ink, 0.55) }}>{p.brand} · {p.dateText}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1180, width: MW, textAlign: 'center', fontSize: 32, color: s.dim, opacity: EASE.enter(seg(t, 1.0, 1.5)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1280, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 1.3, 1.8)) }}>{p.quote}</div>
        <Sfx name="impact" at={0.4} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="plaque" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', paddingTop: 18, borderTop: `2px solid ${rgba(s.a1, 0.55)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1160, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.subtitle}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1360} align="center" w={MW} start={5.3} />
        <Sfx name="chime" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
