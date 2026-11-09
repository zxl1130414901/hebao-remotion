import React from 'react';
import type { LP } from './base';
import { MX, MW, CX } from './base';
import { Page } from '../kit/Page';
import { Scene } from '../kit/Scene';
import { Kicker, Metric, Tag, Title } from '../kit/Type';
import { EndCard, FactRow, Rule, Sfx } from '../kit/Bits';
import { EASE, fitSize, outBack, outQuint, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';

/* ============ 11 · 票根 TICKET ============ 大票券 + 撕票线，副券翻出受贺人 */
export const Ticket: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const TX = 96, TY = 560, TW = 888, TH = 800;
  const STUB = 240;
  /* arr=0 副券在右，arr=1 副券在左；主券宽度 = 票宽 - 副券宽，两者永不重叠 */
  const stubIn = arr ? 0 : TW - STUB;
  const mainIn = arr ? STUB : 0;
  const perfIn = arr ? STUB : TW - STUB;
  const act2 = t >= 3.5;
  const tilt = arr ? 1.6 : -1.6;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={280} align="center" w={MW} start={0.05} />
        <div style={{ position: 'absolute', left: TX, top: TY, width: TW, height: TH, background: s.panel, border: `2px solid ${s.panelLine}`, borderRadius: 26, transform: `rotate(${tilt}deg) scale(${0.9 + outBack(seg(t, 0.2, 1.0)) * 0.1})`, boxShadow: '0 30px 80px rgba(0,0,0,.3)', overflow: 'hidden' }}>
          {/* 打孔缺口 */}
          {[{ y: 0 }, { y: TH }].map((n, i) => (
            <div key={i} style={{ position: 'absolute', left: perfIn - 26, top: n.y - 26, width: 52, height: 52, borderRadius: '50%', background: s.pg, border: `2px solid ${s.panelLine}` }} />
          ))}
          {/* 撕票线 */}
          <div style={{ position: 'absolute', left: perfIn, top: 30, bottom: 30, width: 0, borderLeft: `3px dashed ${rgba(s.ink, 0.35)}` }} />
          {/* 主券 */}
          <div style={{ position: 'absolute', left: mainIn, top: 0, bottom: 0, width: TW - STUB, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: arr ? 44 : 56, paddingRight: arr ? 56 : 44, alignItems: arr ? 'flex-end' : 'flex-start' }}>
            {act2 ? (
              <>
                <div style={{ fontSize: 22, letterSpacing: 6, color: s.faint }}>GUEST OF HONOUR</div>
                <div style={{ fontWeight: 900, fontSize: fitSize(p.honoree, 560, 76, 2, 30), color: s.ink, marginTop: 14, whiteSpace: 'nowrap' }}>{p.honoree}</div>
                <div style={{ fontSize: 24, color: s.dim, marginTop: 12 }}>{p.role}</div>
                <div style={{ marginTop: 36, fontFamily: s.numFamily, fontSize: 84, fontWeight: 700, color: s.a1 }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)}<span style={{ fontSize: 32, color: s.dim }}>{p.metric.unit}</span></div>
                <div style={{ fontSize: 22, color: s.faint, marginTop: 6 }}>{p.metric.label}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 22, letterSpacing: 8, color: s.faint }}>ADMIT ONE</div>
                <div style={{ fontWeight: 900, fontSize: fitSize(p.award, 560, 64, 3, 26), color: s.ink, marginTop: 16, whiteSpace: 'nowrap' }}>{p.award}</div>
                <div style={{ fontSize: 24, color: s.dim, marginTop: 18, lineHeight: 1.7 }}>{p.brand}<br />{p.dateText}</div>
                <div style={{ marginTop: 40, display: 'flex', gap: 10 }}>{Array.from({ length: 12 }).map((_, i) => (<div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i % 3 === 0 ? rgba(s.a1, 0.8) : rgba(s.ink, 0.15) }} />))}</div>
              </>
            )}
          </div>
          {/* 副券 */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: stubIn, width: STUB, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ writingMode: 'vertical-rl', fontSize: 30, letterSpacing: 12, fontWeight: 800, color: rgba(s.a1, 0.95) }}>HONOUR · {p.title}</div>
            <div style={{ writingMode: 'vertical-rl', fontSize: 18, letterSpacing: 6, color: s.faint, marginTop: 26 }}>NO.{String(Math.abs(Math.round(p.metric.value * 100)) % 9000 + 1000)}</div>
          </div>
        </div>
        <Sfx name={act2 ? 'chime' : 'pop'} at={act2 ? 3.6 : 0.3} vol={0.2} />
      </Scene>

      <div style={{ position: 'absolute', left: MX, top: TY + TH + 80, width: MW, textAlign: 'center', opacity: EASE.enter(seg(t, 4.8, 5.4)) }}>
        <div style={{ fontSize: 28, color: s.dim, letterSpacing: 2 }}>{p.subtitle}</div>
        <div style={{ marginTop: 18, fontSize: 22, color: s.faint }}>{p.quote}</div>
      </div>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 12 · 灯箱 MARQUEE ============ 灯泡跑马边框 + 霓虹招牌闪烁 */
export const Marquee: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const bulbs: { x: number; y: number }[] = [];
  const L = 70, R = 1010, T = 130, B = 1790, STEP = 72;
  for (let x = L; x <= R; x += STEP) { bulbs.push({ x, y: T }); bulbs.push({ x, y: B }); }
  for (let y = T + STEP; y < B; y += STEP) { bulbs.push({ x: L, y }); bulbs.push({ x: R, y }); }
  const flick = (i: number) => (Math.sin(t * 7 + i * 1.7) > -0.55 ? 1 : 0.25) * (0.75 + 0.25 * Math.sin(t * 3 + i));
  const flicker = t < 1.3 ? (Math.sin(t * 31) > -0.2 ? 1 : 0.35) : Math.sin(t * 9) > -0.75 ? 1 : 0.6;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_creative.wav">
      {bulbs.map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: b.x - 7, top: b.y - 7, width: 14, height: 14, borderRadius: '50%', background: rgba(s.a1, 0.95 * flick(i)), boxShadow: `0 0 18px ${rgba(s.a1, 0.8 * flick(i))}` }} />
      ))}
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={430} align="center" w={MW} start={0.4} color={s.dim} />
        <div style={{ position: 'absolute', left: MX, top: 560, width: MW, textAlign: 'center', fontWeight: 900, fontSize: fitSize(p.title, 860, 150, 6, 44), color: s.a1, textShadow: `0 0 30px ${rgba(s.a1, 0.9)},0 0 80px ${rgba(s.a1, 0.5)}`, opacity: flicker, whiteSpace: 'nowrap' }}>{p.title}</div>
        <Rule s={s} t={t} x={CX - 130} y={820} w={260} start={0.8} color={rgba(s.a2, 0.8)} thick={3} />
        <div style={{ position: 'absolute', left: MX, top: 880, width: MW, textAlign: 'center', fontSize: 34, color: s.dim, letterSpacing: 4, opacity: EASE.enter(seg(t, 1.0, 1.5)) }}>{p.subtitle}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1030} align="center" w={MW} start={1.3} solid />
        <Sfx name="chime" at={0.9} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={16}>
        <div style={{ position: 'absolute', left: MX, top: 420, width: MW, textAlign: 'center', fontSize: 24, letterSpacing: 8, color: s.faint, opacity: EASE.enter(seg(t, 3.6, 4.1)) }}>THE HONOUR GOES TO</div>
        <div style={{ position: 'absolute', left: MX, top: 500, width: MW, textAlign: 'center', fontWeight: 900, fontSize: fitSize(p.honoree, 872, 110, 4, 40), color: s.ink, textShadow: `0 0 40px ${rgba(s.a2, 0.6)}`, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 3.7, 4.2)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 660, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 4.0, 4.4)) }}>{p.role}</div>
        <div style={{ position: 'absolute', left: CX - 260, top: 800, width: 520, height: 340, border: `2px solid ${rgba(s.a1, 0.6)}`, borderRadius: 20, background: rgba(s.a1, 0.06), boxShadow: `0 0 50px ${rgba(s.a1, 0.2)} inset`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: s.numFamily, fontWeight: s.numWeight, fontSize: 130, color: s.a1, textShadow: `0 0 26px ${rgba(s.a1, 0.8)}` }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)}<span style={{ fontSize: 44, color: s.dim }}>{p.metric.unit}</span></div>
          <div style={{ fontSize: 26, color: s.dim, marginTop: 14, letterSpacing: 4 }}>{p.metric.label}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1260, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 4.9, 5.4)) }}>{p.quote}</div>
        <Sfx name="impact" at={3.8} vol={0.22} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 13 · 头版 PRESS ============ 报纸头版：报头 + 分栏正文 + 标题大字 */
export const Press: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const serif = '"Noto Serif SC",serif';
  const colX = [MX, MX + 312, MX + 624];
  const colW = 268;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.015} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        {/* 报头 */}
        <div style={{ position: 'absolute', left: MX, top: 180, width: MW, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: 58, letterSpacing: 10, color: s.ink, opacity: EASE.enter(seg(t, 0.1, 0.6)) }}>{p.brand}</div>
        <Rule s={s} t={t} x={MX} y={286} w={MW} start={0.3} color={rgba(s.ink, 0.7)} thick={3} />
        <div style={{ position: 'absolute', left: MX, top: 306, width: MW, display: 'flex', justifyContent: 'space-between', fontSize: 20, color: s.faint, letterSpacing: 2, opacity: EASE.enter(seg(t, 0.45, 0.9)) }}>
          <span>{p.dateText} · 星期刊</span><span>HONOUR EDITION</span>
        </div>
        <Rule s={s} t={t} x={MX} y={348} w={MW} start={0.5} color={rgba(s.ink, 0.4)} thick={1} />
        {/* 头版标题 */}
        <div style={{ position: 'absolute', left: MX, top: 420, width: MW, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: fitSize(p.title, 860, 118, 4, 44), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 0.55, 1.1)) }}>{p.title}</div>
        <div style={{ position: 'absolute', left: MX, top: 590, width: MW, textAlign: 'center', fontFamily: serif, fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 0.9, 1.3)) }}>{p.subtitle}</div>
        {/* 三栏正文 */}
        {[0, 1, 2].map((c) => (
          <React.Fragment key={c}>
            {c > 0 && <Rule s={s} t={t} x={colX[c] - 22} y={700} w={430} vertical start={1.1 + c * 0.1} color={rgba(s.ink, 0.25)} />}
            <div style={{ position: 'absolute', left: colX[c], top: 700, width: colW, opacity: EASE.enter(seg(t, 1.0 + c * 0.14, 1.5 + c * 0.14)) }}>
              {c === 0 ? (
                <>
                  <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 34, color: s.ink, marginBottom: 14 }}>本刊特稿</div>
                  <div style={{ fontFamily: serif, fontSize: 24, lineHeight: 1.9, color: s.dim }}>{p.quote}</div>
                </>
              ) : c === 1 ? (
                <>
                  <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 34, color: s.ink, marginBottom: 14 }}>人物</div>
                  <div style={{ fontFamily: serif, fontSize: 24, lineHeight: 1.9, color: s.dim }}>{p.honoree}，{p.role}。{p.facts[0]?.k ?? ''}{p.facts[0]?.v ?? ''}，{p.facts[1]?.k ?? ''}{p.facts[1]?.v ?? ''}。</div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 34, color: s.ink, marginBottom: 14 }}>{p.award}</div>
                  <div style={{ fontFamily: serif, fontSize: 24, lineHeight: 1.9, color: s.dim }}>{p.facts[2]?.k ?? ''}{p.facts[2]?.v ?? ''}。{p.kicker}。</div>
                  <div style={{ marginTop: 20, fontFamily: serif, fontWeight: 900, fontSize: 40, color: s.a1 }}>{arr ? '特刊' : '号外'}</div>
                </>
              )}
            </div>
          </React.Fragment>
        ))}
        {/* 下半版：引文 + 数据栏 + 版次，避免报纸下半页空着 */}
        <Rule s={s} t={t} x={MX} y={1010} w={MW} start={1.5} color={rgba(s.ink, 0.45)} thick={2} />
        <div style={{ position: 'absolute', left: MX + 40, top: 1050, width: MW - 80, textAlign: 'center', fontFamily: serif, fontSize: fitSize(p.quote, 800, 46, 2, 24), lineHeight: 1.7, color: s.ink, opacity: EASE.enter(seg(t, 1.6, 2.1)) }}>「{p.quote}」</div>
        {p.facts.slice(0, 3).map((f, i) => (
          <div key={i} style={{ position: 'absolute', left: MX + i * 312, top: 1210, width: 268, textAlign: 'center', opacity: EASE.enter(seg(t, 1.9 + i * 0.14, 2.4 + i * 0.14)) }}>
            <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 900, color: i === 0 ? s.a1 : s.ink }}>{f.v}</div>
            <div style={{ fontFamily: serif, fontSize: 22, color: s.faint, marginTop: 8 }}>{f.k}</div>
          </div>
        ))}
        <Rule s={s} t={t} x={MX} y={1400} w={MW} start={2.1} color={rgba(s.ink, 0.3)} thick={1} />
        <div style={{ position: 'absolute', left: MX, top: 1420, width: MW, display: 'flex', justifyContent: 'space-between', fontFamily: serif, fontSize: 20, color: s.faint, letterSpacing: 2, opacity: EASE.enter(seg(t, 2.2, 2.7)) }}>
          <span>本版编辑 · {p.honoree}</span><span>第 01 版</span><span>{p.dateText}</span>
        </div>
        <Sfx name="whoosh" at={0.15} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <div style={{ position: 'absolute', left: MX, top: 330, width: MW, textAlign: 'center', fontSize: 24, letterSpacing: 6, color: s.faint, opacity: EASE.enter(seg(t, 3.6, 4.0)) }}>THE HONOUR GOES TO</div>
        <div style={{ position: 'absolute', left: MX, top: 400, width: MW, textAlign: 'center', fontFamily: serif, fontWeight: 900, fontSize: fitSize(p.honoree, 872, 110, 5, 40), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 3.7, 4.2)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 550, width: MW, textAlign: 'center', fontFamily: serif, fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 4.0, 4.4)) }}>{p.role}</div>
        <Rule s={s} t={t} x={CX - 90} y={660} w={180} start={4.2} color={rgba(s.a1, 0.7)} thick={2} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={740} w={MW} size={185} start={4.3} align="center" />
        {p.facts.slice(0, 3).map((f, i) => (
          <FactRow key={i} s={s} t={t} k={f.k} v={f.v} x={MX + (MW / 3) * i} y={1210} w={MW / 3 - 30} start={4.9 + i * 0.13} align="col" big />
        ))}
        <Sfx name="impact" at={4.3} vol={0.24} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 14 · 追光 LIGHT ============ 舞台追光锥从顶打下，主角立在光里 */
export const Light: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const tilt = arr ? 8 : -8;
  const coneIn = EASE.move(seg(t, 0.1, 0.9));
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      {/* 光锥 */}
      <div style={{ position: 'absolute', left: CX - 90, top: -20, width: 180, height: 1560, background: `linear-gradient(180deg,${rgba(s.a1, 0.5)} 0%,${rgba(s.a1, 0.12)} 55%,${rgba(s.a1, 0)} 100%)`, clipPath: 'polygon(38% 0,62% 0,100% 100%,0 100%)', transform: `rotate(${tilt}deg)`, transformOrigin: 'top center', opacity: coneIn, filter: 'blur(6px)' }} />
      {/* 地面光斑 */}
      <div style={{ position: 'absolute', left: CX - 330, top: 1370, width: 660, height: 130, background: `radial-gradient(50% 50% at 50% 50%,${rgba(s.a1, 0.4)},${rgba(s.a1, 0)})`, opacity: coneIn, filter: 'blur(4px)' }} />
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={300} align="center" w={MW} start={0.3} />
        <Title s={s} t={t} text={p.title} x={MX} y={390} w={MW} size={120} start={0.5} align="center" lines={1} glow={s.titleGlow} />
        <div style={{ position: 'absolute', left: MX, top: 900, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 96, 3, 38), color: s.ink, textShadow: `0 0 50px ${rgba(s.a1, 0.45)}`, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 1.0, 1.6)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 1040, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>{p.role}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1170} align="center" w={MW} start={1.4} />
        {/* 光尘 */}
        {Array.from({ length: 14 }).map((_, i) => {
          const yy = 240 + ((t * (26 + i * 5) + i * 137) % 1200);
          const xx = CX - 240 + ((i * 173) % 480);
          return <div key={i} style={{ position: 'absolute', left: xx, top: yy, width: 4, height: 4, borderRadius: '50%', background: rgba(s.a1, 0.7), opacity: 0.5 + 0.5 * Math.sin(t * 2 + i) }} />;
        })}
        <Sfx name="shimmer" at={0.6} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={520} w={MW} size={200} start={3.8} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 990, width: MW, textAlign: 'center', fontSize: 30, color: s.ink, fontWeight: 700, opacity: EASE.enter(seg(t, 4.5, 5.0)) }}>{p.honoree} · {p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1070, width: MW, textAlign: 'center', fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 4.8, 5.3)) }}>{p.quote}</div>
        {p.facts.slice(0, 3).map((f, i) => (
          <FactRow key={i} s={s} t={t} k={f.k} v={f.v} x={MX + (MW / 3) * i} y={1200} w={MW / 3 - 30} start={5.0 + i * 0.13} align="col" big />
        ))}
        <Sfx name="impact" at={3.85} vol={0.24} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 15 · 登顶 ASCENT ============ 上升轨迹线 + 三面里程碑旗 */
export const Ascent: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const pts = arr
    ? [[130, 1450], [380, 1180], [620, 880], [900, 470]]
    : [[180, 1450], [430, 1150], [680, 860], [930, 470]];
  const path = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt[0]},${pt[1]}`).join(' ');
  const draw = EASE.move(seg(t, 0.4, 2.2));
  const flags = pts.slice(1);
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={200} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={290} w={MW} size={112} start={0.2} align="center" lines={1} />
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <path d={path} fill="none" stroke={rgba(s.ink, 0.18)} strokeWidth={5} strokeDasharray="2 14" strokeLinecap="round" />
          <path d={path} fill="none" stroke={s.a1} strokeWidth={6} strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - draw)} />
          {flags.map((pt, i) => {
            const on = draw > (i + 1) / 4;
            return (
              <g key={i} opacity={on ? 1 : 0}>
                <circle cx={pt[0]} cy={pt[1]} r={13} fill={s.pg} stroke={s.a1} strokeWidth={4} />
                <line x1={pt[0]} y1={pt[1] - 13} x2={pt[0]} y2={pt[1] - 78} stroke={rgba(s.ink, 0.5)} strokeWidth={2.5} />
                <rect x={pt[0]} y={pt[1] - 128} width={120} height={50} rx={8} fill={i === 2 ? s.a1 : s.panel} stroke={i === 2 ? s.a1 : s.panelLine} />
                <text x={pt[0] + 60} y={pt[1] - 96} textAnchor="middle" fill={i === 2 ? (s.mode === 'dark' ? '#0A0C12' : '#fff') : s.ink} fontSize={26} fontWeight={700}>{p.milestones[i]?.t ?? ''}</text>
              </g>
            );
          })}
          {/* 顶端箭头 */}
          <g opacity={draw > 0.95 ? 1 : 0} transform={`translate(${pts[3][0]},${pts[3][1]}) rotate(${arr ? -52 : -50})`}>
            <polygon points="0,-30 20,14 -20,14" fill={s.a1} />
          </g>
        </svg>
        {p.milestones.slice(0, 3).map((m, i) => (
          <div key={i} style={{ position: 'absolute', left: flags[i][0] - 90, top: flags[i][1] + 26, width: 200, fontSize: 20, color: s.dim, opacity: EASE.enter(seg(t, 0.9 + i * 0.4, 1.4 + i * 0.4)) }}>{m.label} · {m.note}</div>
        ))}
        <div style={{ position: 'absolute', left: MX, top: 1560, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 2.4, 2.9)) }}>{p.subtitle}</div>
        <Sfx name="whoosh" at={0.5} vol={0.24} />
        <Sfx name="pop" at={2.1} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <div style={{ position: 'absolute', left: MX, top: 400, width: MW, textAlign: 'center', fontWeight: 800, fontSize: fitSize(p.honoree, 872, 100, 3, 40), color: s.ink, whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 3.6, 4.1)) }}>{p.honoree}</div>
        <div style={{ position: 'absolute', left: MX, top: 540, width: MW, textAlign: 'center', fontSize: 28, color: s.dim, opacity: EASE.enter(seg(t, 3.9, 4.3)) }}>{p.role}</div>
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={650} w={MW} size={195} start={4.0} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 1140, width: MW, textAlign: 'center', fontFamily: s.serif ? '"Noto Serif SC",serif' : '"Noto Sans SC",sans-serif', fontSize: 32, color: s.dim, opacity: EASE.enter(seg(t, 4.8, 5.3)) }}>{p.quote}</div>
        {p.facts.slice(0, 3).map((f, i) => (
          <FactRow key={i} s={s} t={t} k={f.k} v={f.v} x={MX + (MW / 3) * i} y={1260} w={MW / 3 - 30} start={5.0 + i * 0.13} align="col" big />
        ))}
        <Sfx name="impact" at={4.05} vol={0.24} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
