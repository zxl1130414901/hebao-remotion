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

/* ============ 56 · 霓虹管 NEON ============ 灯管边框 + 发光字，弯管连到主体 */
export const Neon: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const flick = t < 1.2 ? (Math.sin(t * 40) > 0 ? 1 : 0.55) : 1;
  const glow = (c: string, k = 1) => `0 0 ${10 * k}px ${rgba(c, 0.9)}, 0 0 ${34 * k}px ${rgba(c, 0.55)}, 0 0 ${70 * k}px ${rgba(c, 0.3)}`;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.015} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={200} align="center" w={MW} start={0.05} />
        {/* 灯管边框 */}
        <div style={{ position: 'absolute', left: MX, top: 300, width: MW, height: 900, border: `5px solid ${rgba(s.a1, 0.9 * flick)}`, borderRadius: 28, boxShadow: glow(s.a1), opacity: EASE.enter(seg(t, 0.15, 0.6)) }} />
        <div style={{ position: 'absolute', left: MX + 18, top: 318, width: MW - 36, height: 864, border: `2px solid ${rgba(s.a2, 0.65 * flick)}`, borderRadius: 20, boxShadow: glow(s.a2, 0.6), opacity: EASE.enter(seg(t, 0.3, 0.8)) }} />
        {/* 弯管 */}
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, opacity: 0.9 }}>
          <path d={`M ${MX} 380 L ${MX - 46} 380 Q ${MX - 72} 380 ${MX - 72} 406 L ${MX - 72} 486`} fill="none" stroke={rgba(s.a1, 0.85)} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${rgba(s.a1, 0.8)})` }} />
          <path d={`M ${MX + MW - 250} 1200 L ${MX + MW - 66} 1200 Q ${MX + MW - 40} 1200 ${MX + MW - 40} 1174 L ${MX + MW - 40} 1130`} fill="none" stroke={rgba(s.a2, 0.85)} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${rgba(s.a2, 0.7)})` }} />
        </svg>
        <div style={{ position: 'absolute', left: MX + 40, top: 400, width: MW - 80, textAlign: 'center', opacity: flick }}>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 14, color: rgba(s.a2, 0.95), textShadow: glow(s.a2, 0.5) }}>ON AIR</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, MW - 140, 176, 6, 64), color: s.mode === 'dark' ? '#FFFFFF' : s.a1, letterSpacing: 8, marginTop: 26, lineHeight: 1.2, textShadow: glow(s.a1, 1.1) }}>{p.title}</div>
          <div style={{ fontSize: 30, color: s.dim, marginTop: 30 }}>{p.subtitle}</div>
        </div>
        <div style={{ position: 'absolute', left: MX + 40, top: 900, width: MW - 80, textAlign: 'center', opacity: EASE.enter(seg(t, 0.9, 1.4)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 800, 74, 3, 32), color: s.ink, whiteSpace: 'nowrap', textShadow: glow(s.a2, 0.35) }}>{p.honoree}</div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 10 }}>{p.role}</div>
          <div style={{ display: 'inline-block', marginTop: 22, padding: '10px 30px', border: `2px solid ${rgba(s.a2, 0.8)}`, borderRadius: 999, fontSize: 24, color: rgba(s.a2, 0.95), boxShadow: glow(s.a2, 0.4) }}>{p.award}</div>
        </div>
        {/* 声浪条：把灯箱以下的空处做成信号谱，与霓虹灯箱同源 */}
        <div style={{ position: 'absolute', left: MX, top: 1272, width: MW, height: 150, display: 'flex', alignItems: 'flex-end', gap: 6, opacity: EASE.enter(seg(t, 1.1, 1.6)) }}>
          {Array.from({ length: 44 }).map((_, i) => {
            const k = 0.22 + 0.78 * Math.abs(Math.sin(i * 0.72 + t * 3.1 + accent));
            return <div key={i} style={{ flex: 1, height: 150 * k, borderRadius: 3, background: `linear-gradient(180deg, ${rgba(s.a1, 0.92)}, ${rgba(s.a2, 0.3)})`, boxShadow: `0 0 12px ${rgba(s.a1, 0.3)}` }} />;
          })}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1462, width: MW, textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 10, color: rgba(s.a2, 0.8), opacity: EASE.enter(seg(t, 1.3, 1.8)) }}>ON AIR · LIVE SESSION</div>
        <Sfx name="impact" at={0.2} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="neon" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={200} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.a1, textShadow: glow(s.a1, 0.45) }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1160, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1360} align="center" w={MW} start={5.3} />
        <Sfx name="chime" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 57 · 追光 SPOTLIGHT ============ 斜锥光束落到地面光斑，主体站在光里 */
export const Spotlight: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const sweep = outQuint(seg(t, 0.2, 1.6));
  const topX = 700 - sweep * 200 + (arr ? 120 : 0);
  const floorY = 1420;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <linearGradient id={`spot-${accent}-${arr}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={rgba(s.a1, 0.42)} />
              <stop offset="0.65" stopColor={rgba(s.a1, 0.16)} />
              <stop offset="1" stopColor={rgba(s.a1, 0.04)} />
            </linearGradient>
          </defs>
          <path d={`M ${topX - 40} 60 L ${topX + 40} 60 L ${CX + 470} ${floorY} L ${CX - 470} ${floorY} Z`} fill={`url(#spot-${accent}-${arr})`} style={{ opacity: EASE.enter(seg(t, 0.2, 0.9)) }} />
          <ellipse cx={CX} cy={floorY} rx={470} ry={86} fill={rgba(s.a1, 0.16)} />
          <ellipse cx={CX} cy={floorY} rx={330} ry={58} fill={rgba(s.a1, 0.13)} />
        </svg>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={200} align="center" w={MW} start={0.05} />
        <div style={{ position: 'absolute', left: MX, top: 680, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 0.55, 1.1)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, 860, 116, 3, 46), color: s.ink, textShadow: `0 6px 40px ${rgba(s.a1, 0.35)}`, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 30, color: s.dim, marginTop: 18, letterSpacing: 3 }}>{p.role}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 900, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 0.9, 1.4)) }}>
          <div style={{ display: 'inline-block', padding: '14px 40px', background: rgba(s.a1, 0.14), border: `1px solid ${rgba(s.a1, 0.55)}`, borderRadius: 4, fontFamily: SERIF, fontSize: 38, color: s.ink, letterSpacing: 4 }}>{p.award}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1080, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1520, width: MW, textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 8, color: s.faint, opacity: EASE.enter(seg(t, 1.5, 1.9)) }}>ON STAGE · {p.dateText}</div>
        <Sfx name="whoosh" at={0.25} vol={0.28} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="spotlight" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={430} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={500} w={MW} size={200} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', paddingTop: 20, borderTop: `2px solid ${rgba(s.a1, 0.5)}`, opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <Lead s={s} t={t} text={p.quote} x={MX} y={1160} w={MW} size={38} start={5.0} align="center" lines={2} />
        <Tag s={s} t={t} text={p.award} x={MX} y={1360} align="center" w={MW} start={5.4} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 58 · 幕布 CURTAIN ============ 左右幕布向两侧拉开，露出舞台 */
export const Curtain: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const open = outQuint(seg(t, 0.35, 1.8));
  const folds = (w: number) => `repeating-linear-gradient(90deg, ${rgba(s.a2, 0.95)} 0 26px, ${rgba(s.a1, 0.9)} 26px 62px, ${rgba(s.a2, 0.85)} 62px 96px)`;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.018} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        {/* 舞台内容 */}
        <div style={{ position: 'absolute', left: MX, top: 336, width: MW, textAlign: 'center' }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 12, color: rgba(s.a1, 0.9), opacity: EASE.enter(seg(t, 0.9, 1.4)) }}>CURTAIN UP</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, 860, 158, 5, 58), color: s.ink, marginTop: 26, lineHeight: 1.2, opacity: EASE.enter(seg(t, 1.0, 1.5)) }}>{p.title}</div>
          <div style={{ fontSize: 32, color: s.dim, marginTop: 26, opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>{p.subtitle}</div>
          <div style={{ width: 120, height: 3, background: rgba(s.a1, 0.8), margin: '40px auto', opacity: EASE.enter(seg(t, 1.3, 1.8)) }} />
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 840, 88, 3, 38), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 1.4, 1.9)) }}>{p.honoree}</div>
          <div style={{ fontSize: 28, color: s.dim, marginTop: 12, opacity: EASE.enter(seg(t, 1.5, 2.0)) }}>{p.role}</div>
        </div>
        {/* 舞台地面 + 光池 */}
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, opacity: EASE.enter(seg(t, 0.6, 1.3)) }}>
          <ellipse cx={CX} cy={1132} rx={430} ry={78} fill={rgba(s.a1, 0.12)} />
          <ellipse cx={CX} cy={1132} rx={250} ry={44} fill={rgba(s.a1, 0.14)} />
          <path d={`M 30 1700 L ${CX} 1132 L 1050 1700`} fill="none" stroke={rgba(s.a1, 0.18)} strokeWidth={2} />
          <path d={`M 140 1700 L ${CX} 1132 L 940 1700`} fill="none" stroke={rgba(s.a1, 0.12)} strokeWidth={1.5} />
          <path d={`M ${MX} 1132 L ${MX + MW} 1132`} stroke={rgba(s.a1, 0.55)} strokeWidth={2} />
        </svg>
        {/* 奖项牌 */}
        <div style={{ position: 'absolute', left: MX + 130, top: 1182, width: MW - 260, textAlign: 'center', padding: '22px 0', border: `2px solid ${rgba(s.a1, 0.6)}`, borderRadius: 4, background: rgba(s.a1, 0.06), fontFamily: SERIF, fontSize: fitSize(p.award, MW - 320, 46, 2, 26), color: s.ink, letterSpacing: 4, opacity: EASE.enter(seg(t, 1.7, 2.2)) }}>{p.award}</div>
        <div style={{ position: 'absolute', left: MX, top: 1420, width: MW, textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 9, color: s.faint, opacity: EASE.enter(seg(t, 1.9, 2.3)) }}>ON STAGE · {p.dateText}</div>
        {/* 幕布 */}
        <div style={{ position: 'absolute', left: 0, top: 150, width: 540, height: 1570, background: folds(540), transform: `translateX(${-open * 540}px)`, boxShadow: `20px 0 60px ${rgba('#000', 0.25)}` }} />
        <div style={{ position: 'absolute', left: 540, top: 150, width: 540, height: 1570, background: folds(540), transform: `translateX(${open * 540}px)`, boxShadow: `-20px 0 60px ${rgba('#000', 0.25)}` }} />
        {/* 帷幔顶：随拉开一起上收，留一根帘杆 */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 64, background: `repeating-linear-gradient(90deg, ${rgba(s.a1, 0.9)} 0 30px, ${rgba(s.a2, 0.85)} 30px 60px)`, transform: `translateY(${-64 * open}px)` }} />
        <div style={{ position: 'absolute', left: 0, top: 62, width: 1080, height: 3, background: `linear-gradient(90deg, ${rgba(s.a1, 0.1)}, ${rgba(s.a1, 0.85)}, ${rgba(s.a1, 0.1)})` }} />
        <Sfx name="whoosh" at={0.4} vol={0.3} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="curtain" s={s} t={t} arr={arr} />
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
        <div style={{ position: 'absolute', left: MX, top: 1150, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1350} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 59 · 分屏 SPLIT ============ 上下硬切：上半身份，下半数据 */
export const Split: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const mid = 900;
  const inTop = outQuint(seg(t, 0.15, 1.1));
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.015} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={0}>
        {/* 上半块 */}
        <div style={{ position: 'absolute', left: 0, top: 150, width: 1080, height: mid - 150, background: arr ? rgba(s.a1, 0.16) : rgba(s.a1, 0.1), transform: `translateX(${(arr ? 1 : -1) * (1 - inTop) * 1080}px)` }}>
          <Kicker s={s} t={t} text={p.kicker} x={MX} y={210} start={0.4} w={MW} align="center" />
          <div style={{ position: 'absolute', left: MX, top: 300, width: MW, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, 860, 150, 4, 56), color: s.ink, lineHeight: 1.2, opacity: EASE.enter(seg(t, 0.5, 1.1)) }}>{p.title}</div>
          <div style={{ position: 'absolute', left: MX, top: 620, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 0.8, 1.3)) }}>{p.subtitle}</div>
        </div>
        {/* 下半块 */}
        <div style={{ position: 'absolute', left: 0, top: mid, width: 1080, height: 1920 - mid - 120, background: rgba(s.ink, 0.05), borderTop: `4px solid ${rgba(s.a1, 0.9)}`, transform: `translateY(${(1 - outQuint(seg(t, 0.3, 1.2))) * 900}px)` }}>
          <div style={{ position: 'absolute', left: MX, top: 80, width: MW, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 6, color: rgba(s.a1, 0.9) }}>HONOREE</div>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 620, 78, 3, 34), color: s.ink, marginTop: 10, whiteSpace: 'nowrap' }}>{p.honoree}</div>
              <div style={{ fontSize: 26, color: s.dim, marginTop: 8 }}>{p.role}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 6, color: rgba(s.a1, 0.9) }}>AWARD</div>
              <div style={{ fontFamily: SERIF, fontSize: 32, color: s.ink, marginTop: 10 }}>{p.award}</div>
              <div style={{ fontFamily: MONO, fontSize: 20, color: s.faint, marginTop: 8 }}>{p.dateText}</div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: MX, top: 300, width: MW, fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 1.0, 1.5)) }}>{p.quote}</div>
        </div>
        <Sfx name="whoosh" at={0.25} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={0}>
        <Motif kind="split" s={s} t={t} arr={arr} />
        <div style={{ position: 'absolute', left: 0, top: 150, width: 1080, height: 620, background: rgba(s.ink, 0.05), borderBottom: `4px solid ${rgba(s.a1, 0.9)}` }}>
          <div style={{ position: 'absolute', left: MX, top: 70, width: MW, fontFamily: MONO, fontSize: 21, letterSpacing: 8, color: rgba(s.a1, 0.9) }}>{p.metric.label}</div>
          <div style={{ position: 'absolute', left: MX, top: 120, width: MW, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 210, color: s.ink, lineHeight: 1.2 }}>
            {p.metric.value.toFixed(p.metric.decimals ?? 0)}<span style={{ fontSize: 64, color: s.dim, marginLeft: 10 }}>{p.metric.unit}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 774, width: 1080, height: 1020 }}>
          <div style={{ position: 'absolute', left: MX, top: 60, width: MW, display: 'flex', justifyContent: 'space-between' }}>
            {p.facts.slice(0, 3).map((f, i) => (
              <div key={i} style={{ width: 282, paddingTop: 18, borderTop: `2px solid ${rgba(s.a1, 0.55)}`, opacity: EASE.enter(seg(t, 3.9 + i * 0.14, 4.4 + i * 0.14)) }}>
                <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.a1 }}>{f.v}</div>
                <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
              </div>
            ))}
          </div>
          {p.rows.slice(0, 4).map((r, i) => (
            <div key={i} style={{ position: 'absolute', left: MX, top: 260 + i * 70, width: MW, display: 'flex', justifyContent: 'space-between', fontSize: 26, color: s.dim, borderBottom: `1px solid ${rgba(s.ink, 0.1)}`, paddingBottom: 14, opacity: EASE.enter(seg(t, 4.4 + i * 0.1, 4.8 + i * 0.1)) }}>
              <span>{r.name} · {r.role}</span><span style={{ fontFamily: MONO, color: s.ink }}>{r.value}</span>
            </div>
          ))}
          <Tag s={s} t={t} text={p.title} x={MX} y={620} align="center" w={MW} start={5.2} />
        </div>
        <Sfx name="impact" at={3.7} vol={0.22} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 60 · 镜像 MIRROR ============ 中轴对称，下半是上半的倒影 */
export const Mirror: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const axis = 900;
  const fade = 'linear-gradient(to bottom, rgba(0,0,0,.9), rgba(0,0,0,0) 82%)';
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        {/* 中轴：一小段垂线 + 菱形，给上半幅一个"对称基准"的提示 */}
        <div style={{ position: 'absolute', left: CX - 1, top: 252, width: 2, height: 150, background: `linear-gradient(180deg, transparent, ${rgba(s.a1, 0.5)})`, opacity: EASE.enter(seg(t, 0.2, 0.7)) }} />
        <div style={{ position: 'absolute', left: CX - 9, top: 240, width: 18, height: 18, background: s.a1, transform: 'rotate(45deg)', opacity: EASE.enter(seg(t, 0.2, 0.7)) }} />
        <div style={{ position: 'absolute', left: MX, top: 440, width: MW, textAlign: 'center', transform: `scaleY(${outQuint(seg(t, 0.3, 1.2))})`, transformOrigin: 'center bottom' }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 12, color: rgba(s.a1, 0.9) }}>REFLECTION</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, 860, 168, 5, 62), color: s.ink, marginTop: 22, lineHeight: 1.2, textShadow: `0 0 60px ${rgba(s.a1, 0.2)}` }}>{p.title}</div>
          <div style={{ fontSize: 32, color: s.dim, marginTop: 22 }}>{p.subtitle}</div>
        </div>
        {/* 倒影：裁到镜面下方的窄条里，向下淡出，不压到主名 */}
        <div style={{ position: 'absolute', left: MX, top: axis + 8, width: MW, height: 214, overflow: 'hidden', textAlign: 'center', opacity: 0.24, maskImage: fade, WebkitMaskImage: fade }}>
          <div style={{ transform: 'scaleY(-1)' }}>
            <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 12, color: rgba(s.a1, 0.9) }}>REFLECTION</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, 860, 168, 5, 62), color: s.ink, marginTop: 22, lineHeight: 1.2 }}>{p.title}</div>
            <div style={{ fontSize: 32, color: s.dim, marginTop: 22 }}>{p.subtitle}</div>
          </div>
        </div>
        {/* 镜面线 */}
        <div style={{ position: 'absolute', left: MX, top: axis, width: MW, height: 2, background: `linear-gradient(90deg, transparent, ${rgba(s.a1, 0.7)}, transparent)` }} />
        <div style={{ position: 'absolute', left: MX, top: 1148, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(p.honoree, 840, 92, 3, 40), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
          <div style={{ fontSize: 28, color: s.dim, marginTop: 12 }}>{p.role}</div>
          <div style={{ display: 'inline-block', marginTop: 20, padding: '10px 30px', border: `1px solid ${rgba(s.a1, 0.5)}`, borderRadius: 999, fontSize: 24, color: s.dim }}>{p.award}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1420, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.faint, opacity: EASE.enter(seg(t, 1.6, 2.1)) }}>{p.quote}</div>
        <Sfx name="chime" at={0.5} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="mirror" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text={p.metric.label} x={MX} y={420} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.title} x={MX} y={490} w={MW} size={198} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 1000, width: MW, height: 1, background: `linear-gradient(90deg, transparent, ${rgba(s.a1, 0.6)}, transparent)` }} />
        <div style={{ position: 'absolute', left: MX, top: 1024, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, textAlign: 'center', opacity: EASE.enter(seg(t, 4.5 + i * 0.14, 5.0 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.ink }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 6 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1190, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1390} align="center" w={MW} start={5.3} />
        <Sfx name="impact" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
