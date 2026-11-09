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

/* ============ 71 · 沙漏 HOURGLASS ============ 上下玻璃球，沙自上落下 */
export const Hourglass: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const top = 460, bot = 1330, mid = (top + bot) / 2, halfH = (bot - top) / 2;
  const run = outQuint(seg(t, 0.4, 2.6));
  const glassW = 300;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={190} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={244} w={MW} size={90} start={0.15} align="center" lines={1} />
        {/* 上下木盘 */}
        {[top - 26, bot].map((y, i) => (
          <div key={i} style={{ position: 'absolute', left: CX - glassW / 2 - 30, top: y, width: glassW + 60, height: 26, borderRadius: 8, background: `linear-gradient(180deg, ${rgba(s.a1, 0.9)}, ${rgba(s.a2, 0.75)})`, boxShadow: `0 6px 20px ${rgba(s.ink, 0.2)}` }} />
        ))}
        <div style={{ position: 'absolute', left: CX - glassW / 2 - 14, top: top, width: 2, height: halfH - 10, background: rgba(s.a1, 0.55) }} />
        <div style={{ position: 'absolute', left: CX + glassW / 2 + 12, top: top, width: 2, height: halfH - 10, background: rgba(s.a1, 0.55) }} />
        <div style={{ position: 'absolute', left: CX - glassW / 2 - 14, top: mid + 10, width: 2, height: halfH - 10, background: rgba(s.a1, 0.55) }} />
        <div style={{ position: 'absolute', left: CX + glassW / 2 + 12, top: mid + 10, width: 2, height: halfH - 10, background: rgba(s.a1, 0.55) }} />
        {/* 玻璃体 */}
        <div style={{ position: 'absolute', left: CX - glassW / 2, top, width: glassW, height: halfH, background: rgba(s.a1, 0.06), border: `2px solid ${rgba(s.a1, 0.45)}`, clipPath: 'polygon(0 0,100% 0,58% 100%,42% 100%)' }} />
        <div style={{ position: 'absolute', left: CX - glassW / 2, top: mid, width: glassW, height: halfH, background: rgba(s.a1, 0.06), border: `2px solid ${rgba(s.a1, 0.45)}`, clipPath: 'polygon(42% 0,58% 0,100% 100%,0 100%)' }} />
        {/* 沙 */}
        <div style={{ position: 'absolute', left: CX - glassW / 2, top: top + 6, width: glassW, height: (halfH - 6) * (1 - run * 0.92), background: rgba(s.a2, 0.85), clipPath: 'polygon(0 0,100% 0,58% 100%,42% 100%)', opacity: 0.9 }} />
        <div style={{ position: 'absolute', left: CX - glassW / 2, top: mid + (halfH - 6) * (1 - run * 0.92), width: glassW, height: (halfH - 6) * (1 - (1 - run * 0.92)), background: rgba(s.a2, 0.9), clipPath: 'polygon(42% 0,58% 0,100% 100%,0 100%)' }} />
        {/* 沙流 */}
        <div style={{ position: 'absolute', left: CX - 2, top: mid - 40, width: 4, height: 80, background: rgba(s.a2, 0.85), opacity: run > 0.02 && run < 0.98 ? 1 : 0 }} />
        <div style={{ position: 'absolute', left: CX - 34, top: mid, width: 68, height: 3, background: rgba(s.a2, 0.7) }} />
        <div style={{ position: 'absolute', left: MX, top: 1480, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 1.0, 1.5)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 840, 78, 3, 32), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 8 }}>{p.role} · {p.award}</div>
        </div>
        <Sfx name="whoosh" at={0.4} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="hourglass" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', paddingTop: 18, borderTop: `2px solid ${rgba(s.a1, 0.5)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
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

/* ============ 72 · 罗盘 COMPASS ============ 刻度环 + 磁针 + 四方位，指针扫到方位 */
export const Compass: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const ccx = CX, ccy = 880, R = 286;
  const ang = -90 + (arr ? 132 : 48) * outQuint(seg(t, 0.4, 2.2));
  const dirs = [
    { t: 'N', a: -90 }, { t: 'E', a: 0 }, { t: 'S', a: 90 }, { t: 'W', a: 180 },
  ];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.018} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={190} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={244} w={MW} size={90} start={0.15} align="center" lines={1} />
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          <circle cx={ccx} cy={ccy} r={R} fill="none" stroke={rgba(s.a1, 0.7)} strokeWidth={3} />
          <circle cx={ccx} cy={ccy} r={R - 16} fill="none" stroke={rgba(s.ink, 0.16)} strokeWidth={1} />
          {Array.from({ length: 36 }).map((_, i) => {
            const a = (Math.PI / 18) * i - Math.PI / 2;
            const major = i % 9 === 0;
            return <line key={i} x1={ccx + Math.cos(a) * (R - 16)} y1={ccy + Math.sin(a) * (R - 16)} x2={ccx + Math.cos(a) * (R - (major ? 46 : 26))} y2={ccy + Math.sin(a) * (R - (major ? 46 : 26))} stroke={rgba(s.ink, major ? 0.5 : 0.2)} strokeWidth={major ? 3 : 1.2} />;
          })}
          {/* 磁针 */}
          <g transform={`rotate(${ang + 90} ${ccx} ${ccy})`}>
            <polygon points={`${ccx},${ccy - R * 0.72} ${ccx - 26},${ccy} ${ccx + 26},${ccy}`} fill={s.a1} />
            <polygon points={`${ccx},${ccy + R * 0.6} ${ccx - 22},${ccy} ${ccx + 22},${ccy}`} fill={rgba(s.ink, 0.35)} />
          </g>
          <circle cx={ccx} cy={ccy} r={16} fill={s.a2} stroke={s.pg} strokeWidth={3} />
        </svg>
        {dirs.map((d) => {
          const a = (d.a * Math.PI) / 180;
          return (
            <div key={d.t} style={{ position: 'absolute', left: ccx + Math.cos(a) * (R + 34) - 30, top: ccy + Math.sin(a) * (R + 34) - 22, width: 60, textAlign: 'center', fontFamily: MONO, fontSize: 30, fontWeight: 700, letterSpacing: 2, color: d.t === 'N' ? s.a1 : s.dim }}>{d.t}</div>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1210, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 0.9, 1.4)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 840, 80, 3, 34), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 10 }}>{p.role}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1390, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.2, 1.6)) }}>{p.award} · {p.dateText}</div>
        <Sfx name="whoosh" at={0.4} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="compass" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1150, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1360} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 73 · 路线 MAP ============ 抽象地图 + 虚线路径 + 起终点图钉 */
export const MapRoute: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const draw = outQuint(seg(t, 0.35, 2.2));
  const stops = [
    { x: 200, y: 1320, m: p.milestones[0] },
    { x: 470, y: 1000, m: p.milestones[1] },
    { x: 830, y: 720, m: p.milestones[2] },
  ];
  const d = `M ${stops[0].x} ${stops[0].y} C ${stops[0].x + 120} ${stops[0].y - 60}, ${stops[1].x - 120} ${stops[1].y + 80}, ${stops[1].x} ${stops[1].y} S ${stops[2].x - 100} ${stops[2].y + 60}, ${stops[2].x} ${stops[2].y}`;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.018} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={186} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={240} w={MW} size={88} start={0.15} align="center" lines={1} />
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          {/* 底图路网 */}
          {[
            'M 0 1500 L 1080 1380', 'M 0 1150 L 1080 1240', 'M 180 1920 L 320 420', 'M 620 1920 L 700 380', 'M 900 1920 L 960 500',
          ].map((dd, i) => (
            <path key={i} d={dd} stroke={rgba(s.ink, 0.08)} strokeWidth={i % 2 ? 10 : 18} fill="none" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={60 + i * 132} y1={420} x2={60 + i * 132} y2={1500} stroke={rgba(s.ink, 0.05)} strokeWidth={1} />
          ))}
          {/* 路径 */}
          <path d={d} fill="none" stroke={s.a1} strokeWidth={7} strokeLinecap="round" strokeDasharray="18 16" strokeDashoffset={1200 * (1 - draw)} style={{ filter: `drop-shadow(0 0 12px ${rgba(s.a1, 0.6)})` }} />
        </svg>
        {stops.map((st, i) => {
          const on = EASE.enter(seg(t, 0.7 + i * 0.42, 1.2 + i * 0.42));
          return (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', left: st.x - 20, top: st.y - 40, width: 40, height: 40, borderRadius: '50% 50% 50% 0', background: i === 2 ? s.a1 : s.panel, border: `3px solid ${s.a1}`, transform: `rotate(-45deg) scale(${on})`, boxShadow: `0 8px 20px ${rgba(s.ink, 0.25)}` }}>
                <div style={{ position: 'absolute', left: 11, top: 11, width: 12, height: 12, borderRadius: '50%', background: i === 2 ? s.pg : s.a1 }} />
              </div>
              <div style={{ position: 'absolute', left: st.x - 150, top: st.y + 22, width: 300, textAlign: 'center', opacity: on, transform: `translateY(${(1 - on) * 12}px)` }}>
                <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: rgba(s.a1, 0.9) }}>{st.m.t}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 36, color: s.ink, marginTop: 2 }}>{st.m.label}</div>
                <div style={{ fontSize: 21, color: s.dim, marginTop: 4, lineHeight: 1.5 }}>{st.m.note}</div>
              </div>
            </React.Fragment>
          );
        })}
        <div style={{ position: 'absolute', left: MX, top: 1520, width: MW, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 20, letterSpacing: 4, color: s.faint, opacity: EASE.enter(seg(t, 1.9, 2.3)) }}>
          <span>START · {p.brand}</span><span>DESTINATION · {p.award}</span>
        </div>
        <Sfx name="whoosh" at={0.4} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="map" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 980, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', paddingTop: 18, borderTop: `2px solid ${rgba(s.a1, 0.55)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1140, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1350} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
