import React from 'react';
import type { LP } from './base';
import { Motif } from './motif';
import { MX, MW, CX, MONO, SERIF, mixHex } from './base';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Lead, Metric, Tag, Title } from '../kit/Type';
import { EndCard, Rule, Sfx } from '../kit/Bits';
import { EASE, fitSize, outBack, outQuint, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';

/* ============ 66 · 奖杯 TROPHY ============ 杯体 + 双耳 + 底座，底座刻名 */
export const Trophy: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const rise = outBack(seg(t, 0.25, 1.15));
  /* 金属色固定往金黄上拉，避免浅色皮肤下奖杯灰掉看不见 */
  const mHi = mixHex('#FCEFCC', s.a1, 0.3);
  const mMid = mixHex('#C99B45', s.a2, 0.35);
  const mDeep = mixHex('#7E571B', s.ink, 0.25);
  const gold = `linear-gradient(${arr ? 200 : 160}deg, ${mHi} 0%, ${mMid} 42%, ${mDeep} 52%, ${mixHex('#E7BF74', s.a1, 0.35)} 74%, ${mMid} 100%)`;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={92} start={0.15} align="center" lines={1} />
        <div style={{ position: 'absolute', left: 0, top: 400, width: 1080, transform: `translateY(${(1 - rise) * 120}px)`, opacity: Math.min(1, rise * 1.2) }}>
          {/* 双耳 */}
          {[{ x: 340 }, { x: 740 }].map((h, i) => (
            <div key={i} style={{ position: 'absolute', left: h.x - 56, top: 30, width: 112, height: 150, borderRadius: '56px 56px 0 0', border: `14px solid ${mMid}`, borderBottom: 'none', transform: i === 0 ? 'rotate(-10deg)' : 'rotate(10deg)', boxShadow: `inset 0 0 0 2px ${rgba(mDeep, 0.45)}` }} />
          ))}
          {/* 杯体 */}
          <div style={{ position: 'absolute', left: CX - 190, top: 10, width: 380, height: 300, background: gold, borderRadius: '14px 14px 190px 190px / 14px 14px 220px 220px', border: `2px solid ${rgba(mDeep, 0.5)}`, boxShadow: `0 16px 50px ${rgba(mDeep, 0.3)}, inset 0 -20px 40px ${rgba(mDeep, 0.22)}` }}>
            <div style={{ position: 'absolute', left: 44, top: 22, width: 60, height: 200, borderRadius: 30, background: rgba('#FFFFFF', 0.3), transform: 'rotate(6deg)' }} />
          </div>
          {/* 杯口 */}
          <div style={{ position: 'absolute', left: CX - 196, top: 0, width: 392, height: 34, borderRadius: '50%', background: mHi, border: `2px solid ${rgba(mDeep, 0.35)}` }} />
          {/* 柱 */}
          <div style={{ position: 'absolute', left: CX - 34, top: 306, width: 68, height: 110, background: gold }} />
          <div style={{ position: 'absolute', left: CX - 60, top: 404, width: 120, height: 26, borderRadius: 6, background: mMid }} />
          {/* 底座 */}
          <div style={{ position: 'absolute', left: CX - 230, top: 430, width: 460, height: 150, background: `linear-gradient(180deg, ${rgba(s.ink, 0.12)}, ${rgba(s.ink, 0.2)})`, border: `2px solid ${rgba(mMid, 0.9)}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 400, 48, 2, 24), color: s.ink, textAlign: 'center' }}>{p.honoree}</div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1060, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: fitSize(p.award, 860, 56, 3, 28), color: s.ink, opacity: EASE.enter(seg(t, 0.9, 1.4)), whiteSpace: 'nowrap' }}>{p.award}</div>
        <div style={{ position: 'absolute', left: MX, top: 1150, width: MW, textAlign: 'center', fontSize: 26, color: s.dim, opacity: EASE.enter(seg(t, 1.1, 1.5)) }}>{p.role} · {p.dateText}</div>
        <div style={{ position: 'absolute', left: MX, top: 1260, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.3, 1.7)) }}>{p.subtitle}</div>
        <Sfx name="impact" at={0.5} vol={0.28} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="trophy" s={s} t={t} arr={arr} />
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
        <Sfx name="chime" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 67 · 桂冠 LAUREL ============ 月桂枝叶环，开口向上，叶子逐片长出 */
export const Laurel: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const ccx = CX, ccy = 880, R = 292;
  const leaves = Array.from({ length: 11 }).map((_, i) => i);
  const arc = (side: number, i: number) => {
    const a = (Math.PI * 0.62) + (i / 10) * (Math.PI * 0.78);
    const ang = side > 0 ? a : Math.PI * 2 - a;
    return { x: ccx + Math.cos(ang) * R, y: ccy + Math.sin(ang) * R, rot: (ang * 180) / Math.PI + 90 };
  };
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={92} start={0.15} align="center" lines={1} />
        {[1, -1].map((side) =>
          leaves.map((i) => {
            const L = arc(side, i);
            const grow = outBack(seg(t, 0.35 + i * 0.06, 0.8 + i * 0.06));
            return (
              <div key={`${side}-${i}`} style={{ position: 'absolute', left: L.x - 12, top: L.y - 30, width: 24, height: 60, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: rgba(s.a1, 0.72), transform: `rotate(${L.rot}deg) scale(${grow})`, boxShadow: `0 0 18px ${rgba(s.a1, 0.2)}` }} />
            );
          }),
        )}
        <div style={{ position: 'absolute', left: MX, top: 640, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 0.5, 1.0)) }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 12, color: rgba(s.a1, 0.9) }}>LAUREL</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 620, 96, 3, 40), color: s.ink, marginTop: 16, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 12 }}>{p.role}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 880, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 0.9, 1.4)) }}>
          <div style={{ display: 'inline-block', padding: '10px 30px', border: `1px solid ${rgba(s.a1, 0.55)}`, borderRadius: 999, fontFamily: SERIF, fontSize: 30, color: s.ink }}>{p.award}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1290, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1420, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.5, 1.9)) }}>{p.quote}</div>
        <Sfx name="chime" at={0.4} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="laurel" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', paddingTop: 18, borderTop: `2px solid ${rgba(s.a1, 0.55)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: s.a1 }}>{f.v}</div>
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

/* ============ 68 · 水晶 CRYSTAL ============ 多面切割晶体，棱线折射，缓慢旋转 */
export const Crystal: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const cx = CX, cyc = 800, R = 330;
  const ring = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [cx + Math.cos(a) * R, cyc + Math.sin(a) * R * 0.78];
  });
  const top = [cx, cyc - R * 1.24];
  const bot = [cx, cyc + R * 1.05];
  const rot = Math.sin(t * 0.4) * 3;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={92} start={0.15} align="center" lines={1} />
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, transform: `rotate(${rot}deg)`, transformOrigin: `${cx}px ${cyc}px` }}>
          {ring.map((a, i) => {
            const b = ring[(i + 1) % 6];
            return (
              <g key={i}>
                <polygon points={`${cx},${cyc} ${a[0]},${a[1]} ${b[0]},${b[1]}`} fill={rgba(i % 2 ? s.a1 : s.a2, 0.2 + (i % 3) * 0.05)} stroke={rgba(s.a1, 0.5)} strokeWidth={1.5} style={{ opacity: EASE.enter(seg(t, 0.3 + i * 0.08, 0.9 + i * 0.08)) }} />
                <polygon points={`${top[0]},${top[1]} ${a[0]},${a[1]} ${b[0]},${b[1]}`} fill={rgba(i % 2 ? s.a2 : s.a1, 0.16)} stroke={rgba(s.a1, 0.42)} strokeWidth={1.5} style={{ opacity: EASE.enter(seg(t, 0.5 + i * 0.08, 1.1 + i * 0.08)) }} />
                <polygon points={`${bot[0]},${bot[1]} ${a[0]},${a[1]} ${b[0]},${b[1]}`} fill={rgba(s.a1, 0.1)} stroke={rgba(s.a1, 0.35)} strokeWidth={1} style={{ opacity: EASE.enter(seg(t, 0.7 + i * 0.08, 1.3 + i * 0.08)) }} />
              </g>
            );
          })}
        </svg>
        <div style={{ position: 'absolute', left: MX, top: 700, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 0.6, 1.1)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.award, 620, 74, 3, 32), color: s.ink, textShadow: `0 0 30px ${rgba(s.a1, 0.4)}` }}>{p.award}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1180, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 1.1, 1.6)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 840, 68, 3, 30), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 10 }}>{p.role} · {p.dateText}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1400, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.4, 1.8)) }}>{p.subtitle}</div>
        <Sfx name="chime" at={0.45} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="crystal" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={204} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.a1 }}>{f.v}</div>
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

/* ============ 69 · 棱镜 PRISM ============ 一束白光过棱镜，散成光谱带 */
export const Prism: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const beam = outQuint(seg(t, 0.25, 1.3));
  const fan = outQuint(seg(t, 0.9, 2.0));
  const spec = ['#E8503A', '#E8A33A', '#D8D24A', '#4FB477', '#3F7FD8', '#7B5BD6'];
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.015} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={190} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={244} w={MW} size={90} start={0.15} align="center" lines={1} />
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          {/* 入射光 */}
          <line x1={120} y1={760} x2={420} y2={830} stroke={rgba('#FFFFFF', 0.85)} strokeWidth={6} strokeDasharray={400} strokeDashoffset={400 * (1 - beam)} style={s.mode === 'dark' ? undefined : { stroke: rgba(s.ink, 0.55) }} />
          {/* 棱镜 */}
          <polygon points={`470,900 650,760 650,1040`} fill={rgba(s.a1, 0.12)} stroke={rgba(s.a1, 0.8)} strokeWidth={2.5} style={{ opacity: EASE.enter(seg(t, 0.4, 0.9)) }} />
          <polygon points={`490,880 620,790 620,1000`} fill={rgba('#FFFFFF', 0.1)} />
          {/* 光谱 */}
          {spec.map((c, i) => (
            <line key={i} x1={650} y1={900 + i * 6} x2={650 + 340 * fan} y2={700 + i * 62} stroke={c} strokeWidth={16} opacity={0.78} strokeLinecap="round" />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: 120, top: 660, fontFamily: MONO, fontSize: 18, letterSpacing: 6, color: s.faint }}>WHITE</div>
        <div style={{ position: 'absolute', left: 700, top: 480, fontFamily: MONO, fontSize: 18, letterSpacing: 6, color: s.faint, opacity: EASE.enter(seg(t, 1.2, 1.6)) }}>SPECTRUM</div>
        <div style={{ position: 'absolute', left: MX, top: 1120, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 840, 88, 3, 36), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 28, color: s.dim, marginTop: 12 }}>{p.role} · {p.award}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1330, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 30, lineHeight: 1.7, color: s.dim, opacity: EASE.enter(seg(t, 1.5, 1.9)) }}>{p.subtitle}</div>
        <Sfx name="whoosh" at={0.3} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="prism" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={200} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 980, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', paddingTop: 18, borderTop: `3px solid ${rgba(spec[i * 2], 0.85)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.ink }}>{f.v}</div>
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

/* ============ 70 · 表盘 CLOCK ============ 圆表盘 + 12 刻度 + 双指针定格 */
export const Clock: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const cyk = 880, R = 300;
  const sweep = outQuint(seg(t, 0.4, 2.4));
  const hAng = -90 + 300 * sweep;
  const mAng = -90 + 720 * sweep;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.018} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={190} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={244} w={MW} size={90} start={0.15} align="center" lines={1} />
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          <circle cx={CX} cy={cyk} r={R} fill="none" stroke={rgba(s.a1, 0.65)} strokeWidth={3} />
          <circle cx={CX} cy={cyk} r={R - 22} fill="none" stroke={rgba(s.ink, 0.14)} strokeWidth={1} />
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (Math.PI / 30) * i - Math.PI / 2;
            const major = i % 5 === 0;
            const r1 = R - (major ? 34 : 20);
            return <line key={i} x1={CX + Math.cos(a) * r1} y1={cyk + Math.sin(a) * r1} x2={CX + Math.cos(a) * (R - 8)} y2={cyk + Math.sin(a) * (R - 8)} stroke={rgba(s.ink, major ? 0.45 : 0.18)} strokeWidth={major ? 3 : 1.2} />;
          })}
          <line x1={CX} y1={cyk} x2={CX + Math.cos((hAng * Math.PI) / 180) * (R * 0.48)} y2={cyk + Math.sin((hAng * Math.PI) / 180) * (R * 0.48)} stroke={s.ink} strokeWidth={12} strokeLinecap="round" />
          <line x1={CX} y1={cyk} x2={CX + Math.cos((mAng * Math.PI) / 180) * (R * 0.74)} y2={cyk + Math.sin((mAng * Math.PI) / 180) * (R * 0.74)} stroke={s.a1} strokeWidth={6} strokeLinecap="round" />
          <circle cx={CX} cy={cyk} r={12} fill={s.a2} />
        </svg>
        <div style={{ position: 'absolute', left: MX, top: 1220, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 0.8, 1.3)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 840, 82, 3, 34), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 10 }}>{p.role}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1400, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 1.1, 1.5)) }}>{p.award} · {p.dateText}</div>
        <Sfx name="chime" at={0.45} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="clock" s={s} t={t} arr={arr} />
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
