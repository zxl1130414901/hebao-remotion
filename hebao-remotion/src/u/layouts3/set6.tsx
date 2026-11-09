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

/* ============ 31 · 证件页 PASSPORT ============ 双页证件本：左照片位 + 右信息栏 + 底部机读码 */
export const Passport: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const bx = MX, by = 372, bw = MW, bh = 1150;
  const spine = arr ? bx + bw - 300 : bx + 300;
  const photoX = arr ? bx + bw - 296 : bx + 76;
  const infoX = arr ? bx + 76 : bx + 356;
  const mrz = `P<CNMYOU<<MYOU<<<<<<<<<<<<<<<<<<<<<<<<<<`;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_ceremony.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={252} w={MW} size={88} start={0.18} align="center" lines={1} glow={s.titleGlow} />
        {/* 证件本 */}
        <div style={{ position: 'absolute', left: bx, top: by, width: bw, height: bh, background: s.panel, border: `3px solid ${rgba(s.a1, 0.75)}`, borderRadius: 10, boxShadow: `0 24px 80px ${rgba(s.ink, 0.12)}` }}>
          {/* 书脊 */}
          <div style={{ position: 'absolute', left: spine - bx - 2, top: 0, width: 4, height: bh, background: `repeating-linear-gradient(180deg, ${rgba(s.a1, 0.7)} 0 14px, transparent 14px 26px)` }} />
          {/* 国徽位：同心圆 + 星 */}
          <div style={{ position: 'absolute', left: photoX + 40, top: by + 54 - by, width: 220, textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: 6, color: s.faint }}>HONOUR PASS</div>
          {/* 照片框 */}
          <div style={{ position: 'absolute', left: photoX, top: 100, width: 220, height: 296, background: rgba(s.ink, 0.05), border: `1px solid ${rgba(s.ink, 0.25)}`, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 74, top: 74, width: 72, height: 72, borderRadius: '50%', background: rgba(s.ink, 0.28) }} />
            <div style={{ position: 'absolute', left: 40, top: 158, width: 140, height: 120, borderRadius: '70px 70px 0 0', background: rgba(s.ink, 0.22) }} />
            <div style={{ position: 'absolute', left: 0, bottom: 12, width: 220, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: rgba(s.ink, 0.5) }}>某某</div>
          </div>
          <div style={{ position: 'absolute', left: photoX, top: 412, width: 220, textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 4, color: s.faint }}>PHOTO / 4×5</div>
          {/* 信息栏 */}
          {[
            ['NAME / 姓名', p.honoree],
            ['ROLE / 职务', p.role],
            ['AWARD / 事由', p.award],
            ['ISSUED / 签发', p.dateText],
          ].map(([k, v], i) => (
            <div key={i} style={{ position: 'absolute', left: infoX, top: 96 + i * 214, width: bw - 440, opacity: EASE.enter(seg(t, 0.5 + i * 0.16, 1.0 + i * 0.16)) }}>
              <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: 4, color: rgba(s.a1, 0.9) }}>{k}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fitSize(v, bw - 460, 52, 2, 26), color: s.ink, marginTop: 8, whiteSpace: 'nowrap' }}>{v}</div>
              <div style={{ marginTop: 14, height: 1, background: rgba(s.ink, 0.14) }} />
            </div>
          ))}
          {/* 机读码 */}
          <div style={{ position: 'absolute', left: 40, bottom: 42, width: bw - 80, borderTop: `2px solid ${rgba(s.ink, 0.35)}`, paddingTop: 14, fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: rgba(s.ink, 0.62), whiteSpace: 'nowrap', opacity: EASE.enter(seg(t, 1.5, 2.1)) }}>{mrz}</div>
        </div>
        <Sfx name="whoosh" at={0.3} vol={0.24} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="passport" s={s} t={t} arr={arr} />
        <Kicker s={s} t={t} text="RECORD OF HONOUR" x={MX} y={372} align="center" w={MW} start={3.6} />
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={452} w={MW} size={196} start={3.85} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 900, width: MW, textAlign: 'center', fontFamily: SERIF, fontSize: 34, lineHeight: 1.75, color: s.dim, opacity: EASE.enter(seg(t, 4.5, 5.0)) }}>{p.quote}</div>
        <div style={{ position: 'absolute', left: MX, top: 1080, width: MW, display: 'flex', justifyContent: 'center', gap: 18 }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 282, padding: '30px 0', textAlign: 'center', border: `1px solid ${rgba(s.ink, 0.16)}`, borderRadius: 4, background: rgba(s.ink, 0.03), opacity: EASE.enter(seg(t, 4.7 + i * 0.13, 5.2 + i * 0.13)) }}>
              <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 700, color: s.a1 }}>{f.v}</div>
              <div style={{ fontSize: 21, color: s.faint, marginTop: 8, letterSpacing: 1 }}>{f.k}</div>
            </div>
          ))}
        </div>
        <Tag s={s} t={t} text={p.subtitle} x={MX} y={1330} align="center" w={MW} start={5.2} />
        <Sfx name="impact" at={3.85} vol={0.22} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 32 · 蓝图 BLUEPRINT ============ 网格底 + 标注线/尺寸箭头围住主体 */
export const Blueprint: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const gid = `bp-${accent}-${arr}`;
  const bx = 168, by = 430, bw = 744, bh = 770;
  const draw = outQuint(seg(t, 0.35, 1.7));
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.015} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={14}>
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, opacity: 0.9 }}>
          <defs>
            <pattern id={`${gid}-s`} width={40} height={40} patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke={rgba(s.ink, 0.07)} strokeWidth={1} />
            </pattern>
            <pattern id={`${gid}-l`} width={200} height={200} patternUnits="userSpaceOnUse">
              <rect width={200} height={200} fill={`url(#${gid}-s)`} />
              <path d="M200 0H0V200" fill="none" stroke={rgba(s.ink, 0.14)} strokeWidth={1.5} />
            </pattern>
          </defs>
          <rect x={0} y={0} width={1080} height={1920} fill={`url(#${gid}-l)`} />
        </svg>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        {/* 主体框：虚线 */}
        <div style={{ position: 'absolute', left: bx, top: by, width: bw, height: bh, border: `2px dashed ${rgba(s.a1, 0.55)}`, borderRadius: 2 }} />
        {/* 四角括号 */}
        {[[bx - 6, by - 6, 1, 1], [bx + bw - 46, by - 6, -1, 1], [bx - 6, by + bh - 46, 1, -1], [bx + bw - 46, by + bh - 46, -1, -1]].map(([x, y, sx, sy], i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: 52, height: 52, borderTop: `3px solid ${s.a1}`, borderLeft: `3px solid ${s.a1}`, transform: `scale(${sx},${sy})` }} />
        ))}
        <div style={{ position: 'absolute', left: bx, top: by + 132, width: bw, textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 12, color: rgba(s.a1, 0.85), opacity: draw }}>FIG. 01 — SUBJECT</div>
        <div style={{ position: 'absolute', left: bx + 40, top: by + 208, width: bw - 80, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.title, bw - 120, 132, 4, 48), lineHeight: 1.24, color: s.ink, opacity: EASE.enter(seg(t, 0.5, 1.1)) }}>{p.title}</div>
        <div style={{ position: 'absolute', left: bx + 60, top: by + 470, width: bw - 120, textAlign: 'center', fontSize: 28, lineHeight: 1.7, color: s.dim, opacity: EASE.enter(seg(t, 1.0, 1.5)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: bx + 60, top: by + 592, width: bw - 120, textAlign: 'center', fontFamily: MONO, fontSize: 22, letterSpacing: 6, color: s.faint, opacity: EASE.enter(seg(t, 1.4, 1.9)) }}>{p.honoree} / {p.award}</div>
        {/* 框内底部基准线 + 三处刻度（补足框内下半的图面感） */}
        <div style={{ position: 'absolute', left: bx + 60, top: by + 668, width: bw - 120, height: 1, background: rgba(s.ink, 0.16), opacity: draw }} />
        {[0, 0.5, 1].map((k, i) => (
          <div key={i} style={{ position: 'absolute', left: bx + 60 + (bw - 120) * k - 1, top: by + 656, width: 2, height: 24, background: rgba(s.a1, 0.6), opacity: draw }} />
        ))}
        <div style={{ position: 'absolute', left: bx + 60, top: by + 700, width: bw - 120, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 17, letterSpacing: 2, color: s.faint, opacity: draw }}>
          <span>0</span><span>W / 904</span><span>1:1</span>
        </div>
        {/* 水平尺寸线 */}
        <div style={{ position: 'absolute', left: bx, top: by + bh + 56, width: bw, height: 2, background: rgba(s.a1, 0.75), transform: `scaleX(${draw})`, transformOrigin: arr ? 'right center' : 'left center' }} />
        {[bx, bx + bw].map((x, i) => (
          <div key={i} style={{ position: 'absolute', left: x - 1, top: by + bh + 36, width: 2, height: 42, background: rgba(s.a1, 0.75) }} />
        ))}
        <div style={{ position: 'absolute', left: bx, top: by + bh + 68, width: bw, textAlign: 'center', fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: rgba(s.a1, 0.9), opacity: draw }}>904 × 770 / SAFE AREA</div>
        {/* 竖向尺寸线 */}
        <div style={{ position: 'absolute', left: arr ? bx - 56 : bx + bw + 46, top: by, width: 2, height: bh, background: rgba(s.a1, 0.55), transform: `scaleY(${draw})`, transformOrigin: 'top center' }} />
        <div style={{ position: 'absolute', left: arr ? bx - 108 : bx + bw + 8, top: by + bh / 2 - 40, width: 124, textAlign: 'center', fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: s.faint, writingMode: 'vertical-rl', height: 80 }}>770 PX</div>
        {/* 图注：用引语补足尺寸线以下的版面 */}
        <div style={{ position: 'absolute', left: MX, top: 1348, width: MW, display: 'flex', gap: 24, opacity: EASE.enter(seg(t, 1.7, 2.2)) }}>
          <div style={{ width: 3, background: rgba(s.a1, 0.6), flex: 'none' }} />
          <div style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1.75, color: s.dim }}>{p.quote}</div>
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1520, width: MW, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: s.faint, opacity: EASE.enter(seg(t, 1.9, 2.3)) }}>
          <span>SCALE 1:1</span><span>REV. B</span><span>SHEET 01 / 01</span>
        </div>
        <Sfx name="whoosh" at={0.3} vol={0.2} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={20}>
        <Motif kind="blueprint" s={s} t={t} arr={arr} />
        <div style={{ position: 'absolute', left: MX, top: 356, width: MW, fontFamily: MONO, fontSize: 22, letterSpacing: 8, color: rgba(s.a1, 0.9), opacity: EASE.enter(seg(t, 3.6, 4.0)) }}>SPECIFICATION</div>
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={404} w={MW} size={172} start={3.8} align="left" />
        <div style={{ position: 'absolute', left: MX, top: 800, width: MW, height: 1, background: rgba(s.ink, 0.22) }} />
        {p.facts.slice(0, 3).map((f, i) => (
          <div key={i} style={{ position: 'absolute', left: MX, top: 828 + i * 118, width: MW, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${rgba(s.ink, 0.1)}`, paddingBottom: 18, opacity: EASE.enter(seg(t, 4.4 + i * 0.15, 4.9 + i * 0.15)) }}>
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: s.faint }}>{String(i + 1).padStart(2, '0')} / {f.k}</div>
            <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 700, color: s.ink }}>{f.v}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', left: MX, top: 1200, width: MW, fontFamily: SERIF, fontSize: 32, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.subtitle} x={MX} y={1370} align="center" w={MW} start={5.4} />
        <Sfx name="chime" at={3.8} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 33 · 账本 LEDGER ============ 横格账页 + 红竖线 + 合计双下划线 */
export const Ledger: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const ly = 470, lh = 86;
  const rows = p.rows.slice(0, 5);
  const valX = arr ? 168 : 700;
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_data.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={16}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={190} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={244} w={MW} size={92} start={0.15} align="center" lines={1} />
        {/* 账页 */}
        <div style={{ position: 'absolute', left: MX, top: 400, width: MW, height: 1150, background: rgba(s.ink, 0.025), border: `1px solid ${rgba(s.ink, 0.18)}`, borderRadius: 3 }} />
        {/* 红竖线 */}
        <div style={{ position: 'absolute', left: valX - 24, top: 440, width: 2, height: 1070, background: rgba('#B4453C', 0.45) }} />
        {/* 表头 */}
        <div style={{ position: 'absolute', left: MX + 28, top: 432, width: 640, display: 'flex', gap: 40, fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: s.faint }}>
          <span style={{ width: 96 }}>NO.</span><span>摘要 / ENTRY</span>
        </div>
        {/* 横格 + 行 */}
        {rows.map((r, i) => {
          const y = ly + i * lh;
          return (
            <div key={i} style={{ position: 'absolute', left: MX, top: y, width: MW, height: lh, borderTop: `1px solid ${rgba(s.ink, 0.12)}`, opacity: EASE.enter(seg(t, 0.45 + i * 0.13, 0.95 + i * 0.13)) }}>
              <div style={{ position: 'absolute', left: 28, top: 26, width: 90, fontFamily: MONO, fontSize: 26, color: s.faint }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ position: 'absolute', left: 128, top: 14, width: arr ? 480 : 520, fontFamily: SERIF, fontWeight: 700, fontSize: 32, lineHeight: 1.1, color: s.ink, whiteSpace: 'nowrap' }}>{r.name}</div>
              <div style={{ position: 'absolute', left: 128, top: 56, width: 480, fontSize: 20, color: s.faint }}>{r.role}</div>
              <div style={{ position: 'absolute', left: valX + 12, top: 20, width: 250, textAlign: 'right', fontFamily: MONO, fontSize: 40, fontWeight: 700, color: i === 0 ? s.a1 : s.ink }}>{r.value}</div>
            </div>
          );
        })}
        {/* 合计 */}
        <div style={{ position: 'absolute', left: MX + 28, top: ly + 5 * lh + 34, width: MW - 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', opacity: EASE.enter(seg(t, 1.3, 1.8)) }}>
          <div style={{ fontFamily: SERIF, fontSize: 30, color: s.dim, letterSpacing: 4 }}>合 计</div>
          <div style={{ fontFamily: MONO, fontSize: 54, fontWeight: 700, color: s.a1 }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)} <span style={{ fontSize: 28, color: s.dim }}>{p.metric.unit}</span></div>
        </div>
        <div style={{ position: 'absolute', left: MX + 28, top: ly + 5 * lh + 108, width: MW - 56, height: 3, background: rgba(s.ink, 0.55), opacity: EASE.enter(seg(t, 1.5, 1.9)) }} />
        <div style={{ position: 'absolute', left: MX + 28, top: ly + 5 * lh + 116, width: MW - 56, height: 1, background: rgba(s.ink, 0.35), opacity: EASE.enter(seg(t, 1.55, 1.95)) }} />
        <div style={{ position: 'absolute', left: MX + 28, top: ly + 5 * lh + 140, width: MW - 56, fontFamily: SERIF, fontSize: 26, color: s.faint, opacity: EASE.enter(seg(t, 1.7, 2.1)) }}>计 {p.metric.label} · {p.honoree} · {p.dateText}</div>
        {/* 合计以下的空白横格 —— 账页本来就该有留白格 */}
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ position: 'absolute', left: MX, top: 1148 + k * 84, width: MW, height: 1, background: rgba(s.ink, 0.09) }} />
        ))}
        {/* 骑缝章 */}
        <div style={{ position: 'absolute', left: 706, top: 1168, width: 200, height: 200, border: `5px solid ${rgba('#B4453C', 0.72)}`, borderRadius: 8, transform: `rotate(-9deg) scale(${0.7 + outBack(seg(t, 1.9, 2.5)) * 0.3})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: EASE.enter(seg(t, 1.9, 2.4)) * 0.9 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: rgba('#B4453C', 0.85), letterSpacing: 2 }}>已 核</div>
          <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: rgba('#B4453C', 0.7), marginTop: 6 }}>AUDITED</div>
        </div>
        <Sfx name="chime" at={1.35} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="ledger" s={s} t={t} arr={arr} />
        <div style={{ position: 'absolute', left: MX, top: 372, width: MW, fontFamily: MONO, fontSize: 20, letterSpacing: 8, color: rgba(s.a1, 0.9), opacity: EASE.enter(seg(t, 3.6, 4.0)) }}>STATEMENT / 分项</div>
        {p.facts.slice(0, 3).map((f, i) => (
          <div key={i} style={{ position: 'absolute', left: MX, top: 430 + i * 96, width: MW, display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${rgba(s.ink, 0.14)}`, paddingBottom: 16, opacity: EASE.enter(seg(t, 3.9 + i * 0.14, 4.4 + i * 0.14)) }}>
            <div style={{ fontSize: 28, color: s.dim }}>{f.k}</div>
            <div style={{ fontFamily: MONO, fontSize: 40, fontWeight: 700, color: s.ink }}>{f.v}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', left: MX, top: 790, width: MW, fontFamily: SERIF, fontSize: 36, lineHeight: 1.8, color: s.ink, opacity: EASE.enter(seg(t, 4.6, 5.1)) }}>{p.quote}</div>
        <div style={{ position: 'absolute', left: MX, top: 1010, width: MW, textAlign: 'right', fontFamily: SERIF, fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.4)) }}>—— {p.role}</div>
        <Lead s={s} t={t} text={p.subtitle} x={MX} y={1180} w={MW} size={38} start={5.2} align="center" lines={2} />
        <Tag s={s} t={t} text={p.award} x={MX} y={1360} align="center" w={MW} start={5.5} />
        <Sfx name="impact" at={4.6} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 34 · 磁带 CASSETTE ============ 磁带盒 + 双卷轴 + 标签纸 + 曲目单 */
export const Cassette: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const spin = Math.floor(t * 3) * 8 * (arr ? -1 : 1);
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.02} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={18}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={200} align="center" w={MW} start={0.05} />
        {/* 磁带壳 */}
        <div style={{ position: 'absolute', left: MX, top: 300, width: MW, height: 600, background: s.panel, border: `3px solid ${rgba(s.a1, 0.7)}`, borderRadius: 20, boxShadow: `0 30px 90px ${rgba(s.ink, 0.16)}` }}>
          {/* 标签纸 */}
          <div style={{ position: 'absolute', left: 40, top: 34, width: MW - 80, height: 250, background: rgba(s.a1, 0.1), border: `1px solid ${rgba(s.a1, 0.45)}`, borderRadius: 8 }}>
            <div style={{ position: 'absolute', left: 28, top: 18, fontFamily: MONO, fontSize: 18, letterSpacing: 6, color: rgba(s.a1, 0.95) }}>SIDE A · 2026</div>
            <div style={{ position: 'absolute', left: 28, top: 58, width: MW - 136, fontFamily: SERIF, fontWeight: 900, fontSize: fitSize(p.honoree, MW - 160, 92, 3, 40), color: s.ink, whiteSpace: 'nowrap' }}>{p.honoree}</div>
            <div style={{ position: 'absolute', left: 28, top: 168, width: MW - 136, fontSize: 26, color: s.dim, whiteSpace: 'nowrap', overflow: 'hidden' }}>{p.award} · {p.role}</div>
            <div style={{ position: 'absolute', right: 24, bottom: 16, fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: s.faint }}>{p.dateText}</div>
          </div>
          {/* 双卷轴 */}
          {[{ x: 236, r: 92 }, { x: 700, r: 62 }].map((reel, i) => (
            <div key={i} style={{ position: 'absolute', left: reel.x, top: 400, width: reel.r * 2, height: reel.r * 2, marginLeft: -reel.r, borderRadius: '50%', border: `3px solid ${rgba(s.ink, 0.3)}`, background: rgba(s.ink, 0.06), transform: `rotate(${spin}deg)` }}>
              {[0, 60, 120].map((a) => (
                <div key={a} style={{ position: 'absolute', left: '50%', top: 8, width: 4, height: reel.r * 2 - 16, marginLeft: -2, background: rgba(s.ink, 0.22), transform: `rotate(${a}deg)`, transformOrigin: 'center' }} />
              ))}
              <div style={{ position: 'absolute', left: '50%', top: '50%', width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: '50%', background: s.pg }} />
            </div>
          ))}
          {/* 走带 */}
          <div style={{ position: 'absolute', left: 236, top: 582, width: 464, height: 3, background: rgba(s.ink, 0.35) }} />
        </div>
        <Title s={s} t={t} text={p.title} x={MX} y={960} w={MW} size={112} start={0.5} align="center" lines={1} glow={s.titleGlow} />
        <div style={{ position: 'absolute', left: MX, top: 1108, width: MW, textAlign: 'center', fontSize: 30, color: s.dim, opacity: EASE.enter(seg(t, 0.9, 1.4)) }}>{p.subtitle}</div>
        <div style={{ position: 'absolute', left: MX, top: 1210, width: MW, display: 'flex', justifyContent: 'center', gap: 12, opacity: EASE.enter(seg(t, 1.2, 1.7)) }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ padding: '10px 22px', border: `1px solid ${rgba(s.ink, 0.2)}`, borderRadius: 999, fontFamily: MONO, fontSize: 22, color: s.dim }}>{f.k} {f.v}</div>
          ))}
        </div>
        <Sfx name="whoosh" at={0.3} vol={0.22} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="cassette" s={s} t={t} arr={arr} />
        <div style={{ position: 'absolute', left: MX, top: 352, width: MW, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `2px solid ${rgba(s.a1, 0.75)}`, paddingBottom: 14 }}>
          <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 8, color: rgba(s.a1, 0.95) }}>TRACK LIST</div>
          <div style={{ fontFamily: MONO, fontSize: 20, color: s.faint }}>{p.metric.value.toFixed(p.metric.decimals ?? 0)} {p.metric.unit} / {p.metric.label}</div>
        </div>
        {p.rows.slice(0, 5).map((r, i) => (
          <div key={i} style={{ position: 'absolute', left: MX, top: 410 + i * 104, width: MW, display: 'flex', alignItems: 'baseline', opacity: EASE.enter(seg(t, 3.7 + i * 0.13, 4.2 + i * 0.13)) }}>
            <div style={{ width: 72, fontFamily: MONO, fontSize: 24, color: s.faint }}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{ width: 340, fontFamily: SERIF, fontWeight: 700, fontSize: 34, color: s.ink, whiteSpace: 'nowrap' }}>{r.name}</div>
            <div style={{ flex: 1, borderBottom: `1px dotted ${rgba(s.ink, 0.28)}`, marginBottom: 8 }} />
            <div style={{ width: 200, textAlign: 'right', fontSize: 22, color: s.faint }}>{r.role}</div>
            <div style={{ width: 120, textAlign: 'right', fontFamily: MONO, fontSize: 30, fontWeight: 700, color: i === 0 ? s.a1 : s.ink }}>{r.value}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', left: MX, top: 1010, width: MW, fontFamily: SERIF, fontSize: 34, lineHeight: 1.8, color: s.dim, opacity: EASE.enter(seg(t, 4.6, 5.1)) }}>{p.quote}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1240} align="center" w={MW} start={5.2} />
        <Sfx name="chime" at={4.0} vol={0.18} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};

/* ============ 35 · 电报 TELEGRAM ============ 窄长纸条横向滑入，等宽字，上下齿孔 */
export const Telegram: React.FC<LP> = ({ p, s, accent, arr }) => {
  const t = useT();
  const sx = 150, sy = 420, sw = 780, sh = 900;
  const slide = 1 - outQuint(seg(t, 0.15, 1.0));
  return (
    <Page s={s} accent={accent} brand={p.brand} dateText={p.dateText} footnote={p.footnote} cam={0.012} bgm="assets/bed_creative.wav">
      <Scene t={t} inAt={0.02} outAt={3.4} y={12}>
        <Kicker s={s} t={t} text={p.kicker} x={MX} y={196} align="center" w={MW} start={0.05} />
        <Title s={s} t={t} text={p.title} x={MX} y={250} w={MW} size={86} start={0.2} align="center" lines={1} />
        {/* 纸条 */}
        <div style={{ position: 'absolute', left: sx, top: sy, width: sw, height: sh, background: s.mode === 'dark' ? rgba(s.ink, 0.1) : rgba(s.ink, 0.045), border: `2px solid ${rgba(s.a1, 0.55)}`, transform: `translateX(${(arr ? 1 : -1) * slide * 420}px)`, opacity: 1 - slide * 0.6 }}>
          {/* 齿孔 */}
          {Array.from({ length: 19 }).map((_, i) => (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', left: 22 + i * 40, top: -7, width: 14, height: 14, borderRadius: '50%', background: s.pg }} />
              <div style={{ position: 'absolute', left: 22 + i * 40, top: sh - 7, width: 14, height: 14, borderRadius: '50%', background: s.pg }} />
            </React.Fragment>
          ))}
          <div style={{ position: 'absolute', left: 40, top: 42, width: sw - 80, fontFamily: MONO, fontSize: 18, letterSpacing: 10, color: rgba(s.a1, 0.9) }}>INCOMING MESSAGE · 加急</div>
          <div style={{ position: 'absolute', left: 40, top: 74, width: sw - 80, height: 1, background: rgba(s.ink, 0.22) }} />
          {[
            ['TO', p.honoree],
            ['RE', p.award],
            ['ROLE', p.role],
          ].map(([k, v], i) => (
            <div key={i} style={{ position: 'absolute', left: 40, top: 104 + i * 92, width: sw - 80, display: 'flex', alignItems: 'baseline', gap: 18, opacity: EASE.enter(seg(t, 0.35 + i * 0.12, 0.85 + i * 0.12)) }}>
              <div style={{ width: 78, fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: s.faint }}>{k}</div>
              <div style={{ fontFamily: MONO, fontSize: fitSize(v, sw - 220, 40, 2, 22), color: s.ink, whiteSpace: 'nowrap' }}>{v}</div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: 40, top: 388, width: sw - 80, height: 1, background: rgba(s.ink, 0.18) }} />
          <div style={{ position: 'absolute', left: 40, top: 412, width: sw - 80, fontFamily: MONO, fontSize: 34, lineHeight: 1.85, letterSpacing: 4, color: s.ink, opacity: EASE.enter(seg(t, 0.8, 1.4)) }}>{p.quote}</div>
          <div style={{ position: 'absolute', left: 40, bottom: 96, width: sw - 80, fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: s.dim, opacity: EASE.enter(seg(t, 1.4, 1.8)) }}>{p.subtitle}</div>
          <div style={{ position: 'absolute', left: 40, bottom: 40, width: sw - 80, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 19, letterSpacing: 3, color: s.faint, opacity: EASE.enter(seg(t, 1.55, 1.95)) }}>
            <span>{p.brand}</span><span>{p.dateText}</span>
          </div>
        </div>
        <Sfx name="whoosh" at={0.2} vol={0.26} />
      </Scene>

      <Scene t={t} inAt={3.5} outAt={6.4} y={22}>
        <Motif kind="telegram" s={s} t={t} arr={arr} />
        <div style={{ position: 'absolute', left: MX, top: 404, width: MW, fontFamily: MONO, fontSize: 20, letterSpacing: 8, color: rgba(s.a1, 0.9) }}>DECODED / 数值</div>
        <Metric s={s} t={t} value={p.metric.value} decimals={p.metric.decimals} prefix={p.metric.prefix} suffix={p.metric.suffix} unit={p.metric.unit} label={p.metric.label} x={MX} y={450} w={MW} size={188} start={3.75} align="center" />
        <div style={{ position: 'absolute', left: MX, top: 900, width: MW, height: 2, background: `repeating-linear-gradient(90deg, ${rgba(s.ink, 0.35)} 0 18px, transparent 18px 30px)` }} />
        <div style={{ position: 'absolute', left: MX, top: 936, width: MW, display: 'flex', justifyContent: 'space-between' }}>
          {p.facts.slice(0, 3).map((f, i) => (
            <div key={i} style={{ width: 280, opacity: EASE.enter(seg(t, 4.4 + i * 0.14, 4.9 + i * 0.14)) }}>
              <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: s.faint }}>{f.k}</div>
              <div style={{ fontFamily: MONO, fontSize: 50, fontWeight: 700, color: i === 0 ? s.a1 : s.ink, marginTop: 8 }}>{f.v}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: MX, top: 1120, width: MW, fontFamily: MONO, fontSize: 28, letterSpacing: 2, color: s.dim, opacity: EASE.enter(seg(t, 5.0, 5.5)) }}>{p.honoree} · {p.role}</div>
        <Tag s={s} t={t} text={p.award} x={MX} y={1240} align="center" w={MW} start={5.3} />
        <Sfx name="chime" at={3.75} vol={0.2} />
      </Scene>
      <Scene t={t} inAt={6.42}>
        <EndCard s={s} t={t} p={{ honoree: p.honoree, award: p.award, brand: p.brand, dateText: p.dateText }} start={6.5} />
      </Scene>
    </Page>
  );
};
