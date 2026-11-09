import React from 'react';
import type { CSSProperties } from 'react';
import { makeRng, rgba, pulse } from '../lib/anim';

/* 12 套视觉皮肤 —— 每套都有自己的底、字、装饰与气质。
   皮肤只负责「长什么样」，叙事结构交给 layouts。 */

export type Skin = {
  id: string;
  cn: string;
  en: string;
  mode: 'dark' | 'light';
  pg: string;
  ink: string;
  dim: string;
  faint: string;
  a1: string;
  a2: string;
  alt1?: string;
  alt2?: string;
  line: string;
  panel: string;
  panelLine: string;
  radius: number;
  serif: boolean;
  weight: number;
  /** 标题字距（px） */
  track: number;
  numFamily: string;
  numWeight: number;
  grain: number;
  bg: (t: number, accent: number) => React.ReactNode;
  decor?: (t: number, accent: number) => React.ReactNode;
  titleFill?: (accent: number) => string;
  titleGlow?: string;
  kickerStyle?: CSSProperties;
  numeral?: (accent: number) => CSSProperties;
  /** 右侧装饰占位：布局在右侧留出这么多 px，避免文字压到装饰条 */
  safeRight?: number;
  /** 脚注距底距离：默认 62；有底部遮幅/框线的皮肤需要把它抬上来 */
  footnoteBottom?: number;
};

const FONT_SANS = '"Noto Sans SC","Microsoft YaHei",sans-serif';
const FONT_SERIF = '"Noto Serif SC","Songti SC",serif';
const FONT_NUM = '"Oswald","Noto Sans SC",sans-serif';

/* ── 预生成的确定性粒子表 ─────────────────────────────── */
const starRng = makeRng(77123);
const STARS = Array.from({ length: 120 }, () => ({
  x: starRng() * 1080,
  y: starRng() * 1920,
  r: 0.6 + starRng() * 1.7,
  ph: starRng() * 6.28,
  sp: 0.4 + starRng() * 1.2,
}));

const dustRng = makeRng(5150);
const DUST = Array.from({ length: 70 }, () => ({
  x: dustRng() * 1080,
  y: dustRng() * 1920,
  r: 1 + dustRng() * 2.4,
  ph: dustRng() * 6.28,
  sp: 6 + dustRng() * 22,
}));

/* ── 通用层 ───────────────────────────────────────────── */
const Layer: React.FC<{ style: CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: 'absolute', inset: 0, ...style }}>{children}</div>
);

/* =========================================================
   01 · AURORA 极光玻璃
   ========================================================= */
const aurora: Skin = {
  id: 'aurora',
  cn: '极光玻璃',
  en: 'AURORA GLASS',
  mode: 'dark',
  pg: '#05060F',
  ink: '#F4F7FF',
  dim: 'rgba(226,234,255,.84)',
  faint: 'rgba(200,214,255,.58)',
  a1: '#6EE7F9',
  a2: '#A78BFA',
  alt1: '#FFC978',
  alt2: '#FF7A9C',
  line: 'rgba(180,205,255,.22)',
  panel: 'rgba(255,255,255,.06)',
  panelLine: 'rgba(255,255,255,.16)',
  radius: 28,
  serif: false,
  weight: 900,
  track: 2,
  numFamily: FONT_NUM,
  numWeight: 600,
  grain: 0.05,
  titleFill: () =>
    'linear-gradient(178deg,#FFFFFF 0%,#EAF2FF 42%,#A9C4FF 74%,#7E9BFF 100%)',
  titleGlow: '0 0 60px rgba(120,170,255,.35)',
  bg: (t, ac) => {
    const c1 = ac === 2 ? '255,201,120' : '110,231,249';
    const c2 = ac === 2 ? '255,122,156' : '167,139,250';
    return (
      <>
        <Layer style={{ background: 'linear-gradient(168deg,#0C0F20 0%,#151634 45%,#1D1242 100%)' }} />
        <Layer
          style={{
            background: `radial-gradient(58% 38% at ${18 + Math.sin(t * 0.5) * 8}% ${
              26 + Math.cos(t * 0.42) * 6
            }%, ${rgba(c1, 0.34)} 0%, ${rgba(c1, 0)} 62%)`,
            filter: 'blur(18px)',
          }}
        />
        <Layer
          style={{
            background: `radial-gradient(52% 34% at ${78 + Math.cos(t * 0.36) * 7}% ${
              52 + Math.sin(t * 0.47) * 8
            }%, ${rgba(c2, 0.36)} 0%, ${rgba(c2, 0)} 64%)`,
            filter: 'blur(24px)',
          }}
        />
        <Layer
          style={{
            background: `radial-gradient(70% 30% at 50% 104%, ${rgba(c1, 0.2)} 0%, ${rgba(
              c1,
              0,
            )} 70%)`,
          }}
        />
        {STARS.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              width: s.r,
              height: s.r,
              borderRadius: 99,
              background: '#fff',
              opacity: 0.2 + 0.6 * pulse(t * s.sp, 3, s.ph),
            }}
          />
        ))}
        {/* 极光带 */}
        <Layer
          style={{
            background: `linear-gradient(102deg, ${rgba(c2, 0)} 8%, ${rgba(c2, 0.2)} 32%, ${rgba(
              c1,
              0.26,
            )} 52%, ${rgba(c2, 0)} 84%)`,
            filter: 'blur(42px)',
            transform: `translateY(${Math.sin(t * 0.6) * 40}px) rotate(-9deg)`,
          }}
        />
        <Layer
          style={{
            background: `linear-gradient(84deg, ${rgba(c1, 0)} 20%, ${rgba(c1, 0.14)} 48%, ${rgba(
              c2,
              0.18,
            )} 70%, ${rgba(c1, 0)} 92%)`,
            filter: 'blur(54px)',
            transform: `translateY(${Math.cos(t * 0.5) * 60}px) rotate(6deg)`,
          }}
        />
      </>
    );
  },
  decor: (t) => (
    <>
      <div
        style={{
          position: 'absolute',
          left: -160,
          top: 1320,
          width: 1400,
          height: 420,
          border: '1px solid rgba(160,200,255,.14)',
          borderRadius: '50%',
          transform: `rotate(${-14 + Math.sin(t * 0.4) * 2}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -60,
          top: 1420,
          width: 1200,
          height: 320,
          border: '1px solid rgba(160,200,255,.1)',
          borderRadius: '50%',
          transform: 'rotate(-14deg)',
        }}
      />
    </>
  ),
};

/* =========================================================
   02 · CHROME 液态铬
   ========================================================= */
const chrome: Skin = {
  id: 'chrome',
  cn: '液态铬',
  en: 'LIQUID CHROME',
  mode: 'dark',
  pg: '#060608',
  ink: '#F2F4F7',
  dim: 'rgba(226,232,240,.84)',
  faint: 'rgba(200,210,225,.58)',
  a1: '#CFD8E3',
  a2: '#8A94A6',
  alt1: '#FFD9A0',
  alt2: '#C89B5A',
  line: 'rgba(220,230,245,.2)',
  panel: 'rgba(255,255,255,.045)',
  panelLine: 'rgba(255,255,255,.14)',
  radius: 6,
  serif: false,
  weight: 900,
  track: 1,
  numFamily: FONT_NUM,
  numWeight: 600,
  grain: 0.06,
  titleFill: (ac) =>
    ac === 2
      ? 'linear-gradient(176deg,#FFFDF6 0%,#FFE6BC 28%,#C99B52 50%,#FFF3D6 66%,#8A5F22 100%)'
      : 'linear-gradient(176deg,#FFFFFF 0%,#DCE3EC 22%,#7C8794 46%,#F6F9FC 58%,#5B6572 78%,#E8EEF6 100%)',
  titleGlow: '0 2px 0 rgba(0,0,0,.55), 0 26px 60px rgba(160,190,230,.18)',
  bg: (t) => (
    <>
      <Layer style={{ background: 'linear-gradient(180deg,#181B23 0%,#20242E 46%,#15171D 100%)' }} />
      {/* 液态铬池 */}
      <div
        style={{
          position: 'absolute',
          left: -280,
          top: 560,
          width: 1640,
          height: 1080,
          borderRadius: '50%',
          background:
            'conic-gradient(from 20deg at 50% 50%, #0A0C10 0deg, #8E99A8 46deg, #F7FAFF 74deg, #5A6472 108deg, #12141A 150deg, #C9D3E0 210deg, #FFFFFF 236deg, #4C5563 280deg, #0A0C10 330deg, #0A0C10 360deg)',
          filter: 'blur(2px)',
          transform: `rotate(${t * 5}deg) scale(${1 + Math.sin(t * 0.6) * 0.02})`,
          opacity: 0.5,
          maskImage: 'radial-gradient(closest-side, #000 42%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(closest-side, #000 42%, transparent 78%)',
        }}
      />
      <Layer
        style={{
          background:
            'linear-gradient(180deg, rgba(5,5,7,.96) 0%, rgba(5,5,7,.72) 26%, rgba(5,5,7,.2) 44%, rgba(5,5,7,.86) 76%, #050507 100%)',
        }}
      />
      {/* 水平镜面高光 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 760 + Math.sin(t * 0.7) * 24,
          width: 1080,
          height: 2,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.85) 46%, rgba(255,255,255,0) 100%)',
          opacity: 0.55,
        }}
      />
      <Layer
        style={{
          background:
            'repeating-linear-gradient(90deg, rgba(255,255,255,.028) 0px, rgba(255,255,255,.028) 1px, transparent 1px, transparent 4px)',
          opacity: 0.6,
        }}
      />
    </>
  ),
  decor: (t) => (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 186,
        height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(230,240,255,.42),transparent)',
        transform: `scaleX(${0.4 + 0.6 * Math.min(1, t / 2)})`,
      }}
    />
  ),
};

/* =========================================================
   03 · NEON 霓虹赛博
   ========================================================= */
const neon: Skin = {
  id: 'neon',
  cn: '霓虹赛博',
  en: 'NEON CIRCUIT',
  mode: 'dark',
  pg: '#05020A',
  ink: '#FFFFFF',
  dim: 'rgba(240,220,255,.84)',
  faint: 'rgba(220,190,255,.58)',
  a1: '#FF2E93',
  a2: '#22E7FF',
  alt1: '#B6FF3B',
  alt2: '#FF8A00',
  line: 'rgba(255,90,190,.28)',
  panel: 'rgba(255,60,180,.07)',
  panelLine: 'rgba(255,90,200,.34)',
  radius: 2,
  serif: false,
  weight: 900,
  track: 3,
  numFamily: FONT_NUM,
  numWeight: 600,
  grain: 0.09,
  titleFill: (ac) =>
    ac === 2
      ? 'linear-gradient(180deg,#FFFFFF 0%,#E8FFA6 48%,#B6FF3B 100%)'
      : 'linear-gradient(180deg,#FFFFFF 0%,#FFD9F0 46%,#FF7AC8 100%)',
  titleGlow:
    '0 0 12px rgba(255,46,147,.9), 0 0 40px rgba(255,46,147,.6), 0 0 90px rgba(255,46,147,.35)',
  bg: (t, ac) => {
    const n1 = ac === 2 ? '182,255,59' : '255,46,147';
    const n2 = ac === 2 ? '255,138,0' : '34,231,255';
    return (
      <>
        <Layer style={{ background: 'linear-gradient(180deg,#160E26 0%,#211338 55%,#130B20 100%)' }} />
        <Layer
          style={{
            background: `radial-gradient(45% 30% at 12% 18%, ${rgba(n1, 0.28)} 0%, ${rgba(n1, 0)} 70%)`,
            filter: 'blur(30px)',
          }}
        />
        <Layer
          style={{
            background: `radial-gradient(45% 32% at 88% 66%, ${rgba(n2, 0.24)} 0%, ${rgba(n2, 0)} 70%)`,
            filter: 'blur(34px)',
          }}
        />
        {/* 透视网格地面 */}
        <div
          style={{
            position: 'absolute',
            left: -420,
            top: 1220,
            width: 1920,
            height: 1200,
            transform: 'perspective(620px) rotateX(72deg)',
            transformOrigin: 'top center',
            backgroundImage: `linear-gradient(${rgba(n1, 0.5)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(
              n2,
              0.42,
            )} 1px, transparent 1px)`,
            backgroundSize: '90px 90px',
            backgroundPosition: `0px ${(t * 40) % 90}px`,
            maskImage: 'linear-gradient(180deg, transparent 0%, #000 46%, #000 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 46%, #000 100%)',
            opacity: 0.55,
          }}
        />
        {/* 扫描线 */}
        <Layer
          style={{
            background:
              'repeating-linear-gradient(180deg, rgba(0,0,0,.34) 0px, rgba(0,0,0,.34) 1px, transparent 1px, transparent 4px)',
            opacity: 0.55,
          }}
        />
        <Layer
          style={{
            background: `linear-gradient(180deg, ${rgba(n1, 0.06)} 0%, transparent 22%, transparent 78%, ${rgba(
              n2,
              0.08,
            )} 100%)`,
            mixBlendMode: 'screen',
          }}
        />
      </>
    );
  },
  decor: () => (
    <>
      {[
        { l: 44, t: 66, r: 0 },
        { l: 44, t: 1780, r: 0 },
        { l: 950, t: 66, r: 1 },
        { l: 950, t: 1780, r: 1 },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c.l,
            top: c.t,
            width: 86,
            height: 86,
            borderLeft: c.r ? 'none' : '2px solid rgba(255,90,190,.6)',
            borderRight: c.r ? '2px solid rgba(34,231,255,.6)' : 'none',
            borderTop: i < 2 ? '2px solid rgba(255,90,190,.6)' : 'none',
            borderBottom: i < 2 ? 'none' : '2px solid rgba(34,231,255,.6)',
          }}
        />
      ))}
    </>
  ),
};

/* =========================================================
   04 · NOIR 高定黑白
   ========================================================= */
const noir: Skin = {
  id: 'noir',
  cn: '高定黑白',
  en: 'HAUTE NOIR',
  mode: 'light',
  pg: '#F2EDE4',
  ink: '#12110F',
  dim: 'rgba(24,22,19,.66)',
  faint: 'rgba(24,22,19,.5)',
  a1: '#B42318',
  a2: '#8A7A63',
  alt1: '#1F3A5F',
  alt2: '#B08D57',
  line: 'rgba(20,18,15,.18)',
  panel: 'rgba(255,255,255,.5)',
  panelLine: 'rgba(20,18,15,.16)',
  radius: 0,
  serif: true,
  weight: 700,
  track: 6,
  numFamily: FONT_SERIF,
  numWeight: 700,
  grain: 0.07,
  titleFill: () => 'none',
  bg: (t) => (
    <>
      <Layer style={{ background: 'linear-gradient(180deg,#F6F1E8 0%,#EFE8DD 52%,#E9E1D4 100%)' }} />
      <Layer
        style={{
          background:
            'radial-gradient(60% 40% at 50% 0%, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      {/* 纸张纤维 */}
      <Layer
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/><feColorMatrix type='saturate' values='0'/></filter><rect width='220' height='220' filter='url(%23f)' opacity='.5'/></svg>\")",
          opacity: 0.16,
          mixBlendMode: 'multiply',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 150,
          height: 1,
          background: 'rgba(18,17,15,.28)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1748,
          height: 1,
          background: 'rgba(18,17,15,.28)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 150,
          width: 1,
          height: 1598,
          background: 'rgba(18,17,15,.1)',
        }}
      />
      <div style={{
        position: 'absolute', right: 96, top: 150, width: 1, height: 1598, background: 'rgba(18,17,15,.1)',
      }} />
      <div
        style={{
          position: 'absolute',
          right: 96,
          top: 1180,
          width: 8,
          height: 8,
          borderRadius: 99,
          background: '#B42318',
          opacity: 0.85 * pulse(t, 2.4),
        }}
      />
    </>
  ),
  decor: () => (
    <div
      style={{
        position: 'absolute',
        left: 96,
        top: 196,
        fontSize: 22,
        letterSpacing: 8,
        color: 'rgba(18,17,15,.55)',
        fontFamily: FONT_NUM,
      }}
    >
      N° 2026 — EST. HONOUR
    </div>
  ),
};

/* =========================================================
   05 · ACID 酸性粗野
   ========================================================= */
const acid: Skin = {
  id: 'acid',
  safeRight: 64,
  cn: '酸性粗野',
  en: 'ACID BRUTAL',
  mode: 'light',
  pg: '#DFFF00',
  ink: '#0A0A0A',
  dim: 'rgba(10,10,10,.72)',
  faint: 'rgba(10,10,10,.5)',
  a1: '#2B2BFF',
  a2: '#FF3B00',
  alt1: '#FF00A8',
  alt2: '#00C2FF',
  line: 'rgba(10,10,10,.24)',
  panel: 'rgba(255,255,255,.62)',
  panelLine: 'rgba(10,10,10,.9)',
  radius: 0,
  serif: false,
  weight: 900,
  track: -2,
  numFamily: FONT_NUM,
  numWeight: 700,
  grain: 0.1,
  titleFill: () => 'none',
  bg: (t, ac) => (
    <>
      <Layer style={{ background: ac === 2 ? '#FF5A1F' : '#DFFF00' }} />
      <div
        style={{
          position: 'absolute',
          right: -26,
          top: 0,
          width: 72,
          height: 880,
          background: ac === 2 ? '#2B2BFF' : '#0A0A0A',
          clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)',
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -520,
          bottom: -660,
          width: 660,
          height: 660,
          borderRadius: '50%',
          border: `64px solid ${ac === 2 ? '#DFFF00' : '#2B2BFF'}`,
          opacity: 0.9,
        }}
      />
      <Layer
        style={{
          backgroundImage:
            'radial-gradient(rgba(10,10,10,.5) 1px, transparent 1.4px)',
          backgroundSize: '14px 14px',
          opacity: 0.16,
          maskImage: 'linear-gradient(180deg,#000 0%, transparent 46%, #000 100%)',
          WebkitMaskImage: 'linear-gradient(180deg,#000 0%, transparent 46%, #000 100%)',
        }}
      />
    </>
  ),
  decor: (t) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 1756,
        width: 1080,
        height: 54,
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 28,
          whiteSpace: 'nowrap',
          transform: `translateX(${-(t * 130) % 900}px)`,
          fontSize: 28,
          letterSpacing: 4,
          color: '#DFFF00',
          fontFamily: FONT_NUM,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i}>CONGRATULATIONS ✳ 贺 · 实力加冕</span>
        ))}
      </div>
    </div>
  ),
};

/* =========================================================
   06 · DECO 装饰艺术
   ========================================================= */
const deco: Skin = {
  id: 'deco',
  cn: '装饰艺术',
  en: 'ART DECO',
  mode: 'dark',
  pg: '#090806',
  ink: '#F7EFDD',
  dim: 'rgba(240,226,198,.84)',
  faint: 'rgba(230,212,175,.58)',
  a1: '#E3C387',
  a2: '#A67C36',
  alt1: '#DCE6F2',
  alt2: '#7E93AB',
  line: 'rgba(227,195,135,.32)',
  panel: 'rgba(227,195,135,.05)',
  panelLine: 'rgba(227,195,135,.34)',
  radius: 0,
  serif: true,
  weight: 700,
  track: 10,
  numFamily: FONT_SERIF,
  numWeight: 700,
  grain: 0.06,
  titleFill: (ac) =>
    ac === 2
      ? 'linear-gradient(180deg,#FFFFFF 0%,#DCE6F2 44%,#8FA5BD 76%,#E9F1FA 100%)'
      : 'linear-gradient(180deg,#FFF6DD 0%,#F0D79E 40%,#C09A54 68%,#FFF3D2 100%)',
  titleGlow: '0 0 50px rgba(227,195,135,.28)',
  bg: (t, ac) => {
    const g = ac === 2 ? '220,230,242' : '227,195,135';
    return (
      <>
        <Layer style={{ background: 'linear-gradient(180deg,#15120D 0%,#1D1913 48%,#100E0A 100%)' }} />
        {/* 放射日冕 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 1420,
            width: 1600,
            height: 1600,
            marginLeft: -800,
            background: `repeating-conic-gradient(from 0deg at 50% 50%, ${rgba(
              g,
              0.2,
            )} 0deg 1.1deg, transparent 1.1deg 7deg)`,
            transform: `rotate(${t * 2.4}deg)`,
            maskImage: 'radial-gradient(circle at 50% 50%, #000 0%, #000 42%, transparent 68%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 0%, #000 42%, transparent 68%)',
            opacity: 0.8,
          }}
        />
        <Layer
          style={{
            background: `radial-gradient(50% 32% at 50% 34%, ${rgba(g, 0.18)} 0%, ${rgba(g, 0)} 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 40,
            width: 1000,
            height: 1840,
            border: `1px solid ${rgba(g, 0.5)}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 54,
            top: 54,
            width: 972,
            height: 1812,
            border: `1px solid ${rgba(g, 0.22)}`,
          }}
        />
      </>
    );
  },
  decor: (t, ac) => {
    const g = ac === 2 ? '220,230,242' : '227,195,135';
    return (
      <>
        {/* 顶部折扇 */}
        <svg width={1080} height={260} style={{ position: 'absolute', left: 0, top: 0 }}>
          {Array.from({ length: 21 }).map((_, i) => {
            const a = -90 + (i - 10) * 4.2;
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={540}
                y1={10}
                x2={540 + Math.sin(rad) * 300}
                y2={10 + Math.cos(rad) * 300}
                stroke={rgba(g, 0.18 + 0.1 * Math.sin(t + i))}
                strokeWidth={1}
              />
            );
          })}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 892,
            top: 1792,
            width: 72,
            height: 72,
            border: `1px solid ${rgba(g, 0.45)}`,
            transform: 'rotate(45deg)',
          }}
        />
      </>
    );
  },
};

/* =========================================================
   07 · KINETIC 动能大字
   ========================================================= */
const kinetic: Skin = {
  id: 'kinetic',
  cn: '动能大字',
  en: 'KINETIC TYPE',
  mode: 'dark',
  pg: '#0C0C0E',
  ink: '#F7F7F4',
  dim: 'rgba(240,240,236,.84)',
  faint: 'rgba(230,230,224,.58)',
  a1: '#FF4B12',
  a2: '#FFD400',
  alt1: '#00E0A4',
  alt2: '#00A3FF',
  line: 'rgba(255,255,255,.16)',
  panel: 'rgba(255,255,255,.04)',
  panelLine: 'rgba(255,255,255,.16)',
  radius: 0,
  serif: false,
  weight: 900,
  track: -3,
  numFamily: FONT_NUM,
  numWeight: 700,
  grain: 0.08,
  titleFill: (ac) =>
    ac === 2
      ? 'linear-gradient(180deg,#FFFFFF 0%,#9AF7E4 40%,#00E0A4 100%)'
      : 'linear-gradient(180deg,#FFFFFF 0%,#FFD9C9 40%,#FF4B12 100%)',
  titleGlow: '0 0 40px rgba(255,75,18,.3)',
  bg: (t, ac) => {
    const c = ac === 2 ? '0,224,164' : '255,75,18';
    return (
      <>
        <Layer style={{ background: 'linear-gradient(180deg,#15151B 0%,#1B1B22 60%,#101014 100%)' }} />
        {/* 速度线 */}
        {Array.from({ length: 18 }).map((_, i) => {
          const y = 120 + i * 98;
          const w = 240 + ((i * 137) % 700);
          const sp = 240 + (i % 5) * 90;
          const x = ((t * sp + i * 211) % 1500) - 300;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: w,
                height: i % 4 === 0 ? 3 : 1,
                background: `linear-gradient(90deg, transparent, ${rgba(c, i % 4 === 0 ? 0.5 : 0.22)}, transparent)`,
              }}
            />
          );
        })}
        {/* 背景幽灵字 */}
        <div
          style={{
            position: 'absolute',
            left: -60,
            top: 520,
            fontSize: 420,
            lineHeight: '420px',
            fontFamily: FONT_NUM,
            fontWeight: 700,
            color: 'transparent',
            WebkitTextStroke: `1px ${rgba(c, 0.16)}`,
            whiteSpace: 'nowrap',
            transform: `translateX(${-((t * 120) % 600)}px)`,
          }}
        >
          WIN WIN WIN
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            background: `radial-gradient(60% 40% at 50% 40%, ${rgba(c, 0.16)} 0%, transparent 70%)`,
          }}
        />
      </>
    );
  },
  decor: () => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 26,
        height: 1920,
        background:
          'repeating-linear-gradient(180deg,#FF4B12 0px,#FF4B12 40px,#0C0C0E 40px,#0C0C0E 80px)',
        opacity: 0.8,
      }}
    />
  ),
};

/* =========================================================
   08 · STADIUM 转播竞技
   ========================================================= */
const stadium: Skin = {
  id: 'stadium',
  cn: '转播竞技',
  en: 'STADIUM LIVE',
  mode: 'dark',
  pg: '#04101F',
  ink: '#FFFFFF',
  dim: 'rgba(214,230,250,.84)',
  faint: 'rgba(190,212,240,.58)',
  a1: '#E11D2E',
  a2: '#FFC53D',
  alt1: '#00C2FF',
  alt2: '#7CFF6B',
  line: 'rgba(180,210,245,.24)',
  panel: 'rgba(255,255,255,.05)',
  panelLine: 'rgba(190,215,250,.2)',
  radius: 4,
  serif: false,
  weight: 900,
  track: 1,
  numFamily: FONT_NUM,
  numWeight: 700,
  grain: 0.07,
  titleFill: () => 'linear-gradient(180deg,#FFFFFF 0%,#E8F1FF 55%,#B9CDE8 100%)',
  titleGlow: '0 10px 50px rgba(0,90,180,.4)',
  bg: (t, ac) => {
    const c = ac === 2 ? '0,194,255' : '225,29,46';
    return (
      <>
        <Layer style={{ background: 'linear-gradient(180deg,#0A1B2C 0%,#112946 46%,#081726 100%)' }} />
        {/* 场馆灯柱 */}
        {[120, 540, 960].map((x, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - 130,
              top: -280,
              width: 260,
              height: 1500,
              background: `linear-gradient(180deg, ${rgba('200,225,255', 0.3)} 0%, ${rgba(
                '140,190,255',
                0.08,
              )} 30%, transparent 82%)`,
              filter: 'blur(18px)',
              transform: `rotate(${(i - 1) * 9 + Math.sin(t * 0.4 + i) * 1.5}deg)`,
              transformOrigin: 'top center',
            }}
          />
        ))}
        {/* 草皮弧线 */}
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.32 }}>
          {[0, 1, 2].map((i) => (
            <ellipse
              key={i}
              cx={540}
              cy={1560}
              rx={720 - i * 170}
              ry={190 - i * 44}
              fill="none"
              stroke="rgba(160,205,255,.45)"
              strokeWidth={1.5}
            />
          ))}
          <line x1={0} y1={1560} x2={1080} y2={1560} stroke="rgba(160,205,255,.28)" />
        </svg>
        <Layer
          style={{
            background: `radial-gradient(58% 36% at 50% 62%, ${rgba(c, 0.22)} 0%, transparent 72%)`,
          }}
        />
        {DUST.map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: d.x,
              top: (d.y + t * d.sp) % 1920,
              width: d.r,
              height: d.r,
              borderRadius: 99,
              background: 'rgba(220,235,255,.5)',
              opacity: 0.25 + 0.35 * pulse(t, 3, d.ph),
            }}
          />
        ))}
      </>
    );
  },
  decor: (t) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 1642,
        width: 1080,
        height: 6,
        background: 'linear-gradient(90deg,#E11D2E 0%,#E11D2E 62%,#FFC53D 62%,#FFC53D 100%)',
        transform: `scaleX(${Math.min(1, t / 0.8)})`,
        transformOrigin: 'left',
      }}
    />
  ),
};

/* =========================================================
   09 · HOLO 全息镭射
   ========================================================= */
const holo: Skin = {
  id: 'holo',
  safeRight: 50,
  cn: '全息镭射',
  en: 'HOLO FOIL',
  mode: 'dark',
  pg: '#0B0718',
  ink: '#FFFFFF',
  dim: 'rgba(240,232,255,.84)',
  faint: 'rgba(226,214,255,.58)',
  a1: '#FF9AD5',
  a2: '#7DE8FF',
  alt1: '#D6FF7A',
  alt2: '#A98CFF',
  line: 'rgba(214,190,255,.3)',
  panel: 'rgba(255,255,255,.07)',
  panelLine: 'rgba(255,255,255,.22)',
  radius: 20,
  serif: false,
  weight: 900,
  track: 1,
  numFamily: FONT_NUM,
  numWeight: 600,
  grain: 0.05,
  titleFill: (ac) =>
    ac === 2
      ? 'linear-gradient(100deg,#F3FFD6 0%,#D6FF7A 26%,#7DE8FF 52%,#A98CFF 74%,#FFF0C9 100%)'
      : 'linear-gradient(100deg,#FFE8F6 0%,#FF9AD5 24%,#C9B8FF 48%,#7DE8FF 72%,#FFE9C9 100%)',
  titleGlow: '0 0 60px rgba(200,160,255,.4)',
  bg: (t, ac) => {
    const c1 = ac === 2 ? '214,255,122' : '255,154,213';
    const c2 = ac === 2 ? '169,140,255' : '125,232,255';
    return (
      <>
        <Layer style={{ background: 'linear-gradient(165deg,#120C26 0%,#1F1542 42%,#120D26 100%)' }} />
        <Layer
          style={{
            background: `radial-gradient(46% 32% at ${24 + Math.sin(t * 0.5) * 10}% 22%, ${rgba(
              c1,
              0.4,
            )} 0%, transparent 68%)`,
            filter: 'blur(30px)',
          }}
        />
        <Layer
          style={{
            background: `radial-gradient(50% 34% at ${74 + Math.cos(t * 0.4) * 8}% 58%, ${rgba(
              c2,
              0.38,
            )} 0%, transparent 70%)`,
            filter: 'blur(34px)',
          }}
        />
        {/* 地平线网格 */}
        <div
          style={{
            position: 'absolute',
            left: -500,
            top: 1320,
            width: 2080,
            height: 1100,
            transform: 'perspective(700px) rotateX(76deg)',
            transformOrigin: 'top center',
            backgroundImage: `linear-gradient(${rgba(c2, 0.4)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(
              c1,
              0.34,
            )} 1px, transparent 1px)`,
            backgroundSize: '110px 110px',
            backgroundPosition: `0px ${(t * 26) % 110}px`,
            maskImage: 'linear-gradient(180deg, transparent 0%, #000 54%)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 54%)',
            opacity: 0.45,
          }}
        />
        {/* 悬浮球 */}
        {[
          { x: 70, y: 1550, r: 110, ph: 0 },
          { x: 1012, y: 1706, r: 76, ph: 2.2 },
          { x: 1004, y: 296, r: 48, ph: 4.1 },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x - s.r / 2,
              top: s.y - s.r / 2 + Math.sin(t * 0.9 + s.ph) * 14,
              width: s.r,
              height: s.r,
              borderRadius: '50%',
              background: `conic-gradient(from ${t * 40 + i * 60}deg, ${rgba(c1, 0.9)}, ${rgba(
                c2,
                0.85,
              )}, #FFFFFF, ${rgba(c1, 0.9)})`,
              filter: 'blur(1px)',
              opacity: 0.32,
              boxShadow: `0 0 60px ${rgba(c2, 0.35)}`,
            }}
          />
        ))}
      </>
    );
  },
  decor: () => (
    <div
      style={{
        position: 'absolute',
        left: 70,
        top: 120,
        width: 940,
        height: 1680,
        border: '1px solid rgba(255,255,255,.12)',
        borderRadius: 999,
        transform: 'scaleY(1)',
      }}
    />
  ),
};

/* =========================================================
   10 · INK 新中式水墨
   ========================================================= */
const ink: Skin = {
  id: 'ink',
  safeRight: 60,
  cn: '新中式水墨',
  en: 'MODERN INK',
  mode: 'light',
  pg: '#EDE5D3',
  ink: '#16130E',
  dim: 'rgba(30,26,20,.68)',
  faint: 'rgba(30,26,20,.5)',
  a1: '#B7332A',
  a2: '#1B1B1B',
  alt1: '#2F4B3A',
  alt2: '#8A6A2F',
  line: 'rgba(26,22,16,.22)',
  panel: 'rgba(255,255,255,.4)',
  panelLine: 'rgba(26,22,16,.22)',
  radius: 0,
  serif: true,
  weight: 700,
  track: 8,
  numFamily: FONT_SERIF,
  numWeight: 700,
  grain: 0.08,
  titleFill: () => 'none',
  bg: (t) => (
    <>
      <Layer style={{ background: 'linear-gradient(165deg,#F2EBDB 0%,#E9DFC9 55%,#E3D7BE 100%)' }} />
      {/* 墨晕 */}
      <div
        style={{
          position: 'absolute',
          left: -220,
          top: 300,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background:
            'radial-gradient(closest-side, rgba(30,26,20,.3) 0%, rgba(30,26,20,.18) 42%, rgba(30,26,20,0) 72%)',
          filter: 'blur(26px)',
          transform: `scale(${1 + Math.sin(t * 0.4) * 0.03})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -260,
          bottom: 40,
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          background:
            'radial-gradient(closest-side, rgba(40,34,26,.26) 0%, rgba(40,34,26,.14) 44%, rgba(40,34,26,0) 74%)',
          filter: 'blur(34px)',
        }}
      />
      <Layer
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.62' numOctaves='4'/><feColorMatrix type='saturate' values='0'/></filter><rect width='260' height='260' filter='url(%23f)' opacity='.55'/></svg>\")",
          opacity: 0.2,
          mixBlendMode: 'multiply',
        }}
      />
      {/* 远山 */}
      <svg
        width={1080}
        height={420}
        style={{ position: 'absolute', left: 0, bottom: 150, opacity: 0.13 }}
        viewBox="0 0 1080 420"
      >
        <path d="M0,330 C120,250 200,300 300,232 C400,164 470,250 560,206 C660,156 720,236 820,196 C910,160 1000,236 1080,208 L1080,420 L0,420 Z" fill="#2A2620" />
        <path d="M0,380 C150,320 240,360 360,306 C470,256 540,330 660,296 C770,266 880,330 1080,300 L1080,420 L0,420 Z" fill="#1A1712" opacity="0.7" />
      </svg>
    </>
  ),
  decor: () => (
    <>
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 52,
          right: 52,
          bottom: 52,
          border: '1px solid rgba(26,22,16,.28)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 92,
          top: 184,
          right: 92,
          bottom: 248,
          border: '1px solid rgba(26,22,16,.12)',
        }}
      />
    </>
  ),
};

/* =========================================================
   11 · RISO 复古孔版
   ========================================================= */
const riso: Skin = {
  id: 'riso',
  cn: '复古孔版',
  en: 'RISO PRINT',
  mode: 'light',
  pg: '#F3EADA',
  ink: '#1A1714',
  dim: 'rgba(26,23,20,.7)',
  faint: 'rgba(26,23,20,.5)',
  a1: '#FF4A3D',
  a2: '#2E4BFF',
  alt1: '#00A88E',
  alt2: '#FF8A00',
  line: 'rgba(26,23,20,.26)',
  panel: 'rgba(255,255,255,.55)',
  panelLine: 'rgba(26,23,20,.7)',
  radius: 2,
  serif: false,
  weight: 900,
  track: 0,
  numFamily: FONT_NUM,
  numWeight: 700,
  grain: 0.11,
  titleFill: () => 'none',
  bg: (t, ac) => {
    const r = ac === 2 ? '0,168,142' : '255,74,61';
    const b = ac === 2 ? '255,138,0' : '46,75,255';
    return (
      <>
        <Layer style={{ background: '#F5EDDD' }} />
        {/* 半调网点 */}
        <Layer
          style={{
            backgroundImage: `radial-gradient(${rgba(b, 0.16)} 1.3px, transparent 1.5px)`,
            backgroundSize: '9px 9px',
            opacity: 0.7,
          }}
        />
        {/* 套色错位块 */}
        <div
          style={{
            position: 'absolute',
            left: 620,
            top: -260,
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: rgba(r, 0.55),
            mixBlendMode: 'multiply',
            transform: `translate(${Math.sin(t * 0.5) * 4}px, ${Math.cos(t * 0.6) * 4}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 700,
            top: -190,
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: rgba(b, 0.4),
            mixBlendMode: 'multiply',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: 1080,
            height: 460,
            background: rgba(r, 0.16),
            mixBlendMode: 'multiply',
            clipPath: 'polygon(0 58%, 100% 26%, 100% 100%, 0 100%)',
          }}
        />
      </>
    );
  },
  decor: () => (
    <>
      {[
        [56, 56],
        [1024, 56],
        [56, 1864],
        [1024, 1864],
      ].map(([l, top], i) => (
        <div key={i} style={{ position: 'absolute', left: l - 18, top: top - 18, width: 36, height: 36 }}>
          <div style={{ position: 'absolute', left: 17, top: 0, width: 2, height: 36, background: 'rgba(26,23,20,.55)' }} />
          <div style={{ position: 'absolute', left: 0, top: 17, width: 36, height: 2, background: 'rgba(26,23,20,.55)' }} />
          <div style={{ position: 'absolute', left: 9, top: 9, width: 18, height: 18, border: '1.5px solid rgba(26,23,20,.55)', borderRadius: 99 }} />
        </div>
      ))}
    </>
  ),
};

/* =========================================================
   12 · CINEMA 电影片头
   ========================================================= */
const cinema: Skin = {
  id: 'cinema',
  footnoteBottom: 124,
  cn: '电影片头',
  en: 'CINEMA TITLE',
  mode: 'dark',
  pg: '#050505',
  ink: '#F6EFE2',
  dim: 'rgba(240,228,208,.84)',
  faint: 'rgba(230,214,190,.58)',
  a1: '#E7C88E',
  a2: '#9A7B44',
  alt1: '#9EC5E8',
  alt2: '#5A7C9E',
  line: 'rgba(231,200,142,.28)',
  panel: 'rgba(255,255,255,.04)',
  panelLine: 'rgba(231,200,142,.26)',
  radius: 0,
  serif: true,
  weight: 700,
  track: 12,
  numFamily: FONT_SERIF,
  numWeight: 700,
  grain: 0.12,
  titleFill: () => 'linear-gradient(180deg,#FFF8EA 0%,#F0DDBB 52%,#C7A46D 100%)',
  titleGlow: '0 0 44px rgba(255,226,170,.28)',
  bg: (t) => (
    <>
      <Layer style={{ background: '#16171D' }} />
      {/* 放映光束 */}
      <div
        style={{
          position: 'absolute',
          left: 340,
          top: -420,
          width: 400,
          height: 2500,
          background:
            'linear-gradient(180deg, rgba(255,240,205,.22) 0%, rgba(255,240,205,.07) 32%, rgba(255,240,205,0) 78%)',
          clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
          filter: 'blur(24px)',
          opacity: 0.9,
        }}
      />
      <Layer
        style={{
          background: 'radial-gradient(50% 34% at 50% 26%, rgba(255,232,190,.16) 0%, transparent 70%)',
        }}
      />
      {DUST.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: d.x,
            top: (d.y + t * d.sp * 0.6) % 1920,
            width: d.r,
            height: d.r,
            borderRadius: 99,
            background: 'rgba(255,238,205,.55)',
            opacity: 0.12 + 0.34 * pulse(t, 4, d.ph),
          }}
        />
      ))}
      {/* 胶片齿孔 */}
      <Layer
        style={{
          background:
            'repeating-linear-gradient(180deg, rgba(255,255,255,.06) 0px, rgba(255,255,255,.06) 22px, transparent 22px, transparent 60px)',
          width: 26,
          right: 'auto',
          opacity: 0.5,
        }}
      />
    </>
  ),
  decor: () => (
    <>
      {/* 遮幅黑边：高度必须让开顶部品牌行（y=104）与底部数据小字（bottom:62），
          否则硬边会横着切过文字 */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 96, background: '#0B0C11' }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 1080, height: 96, background: '#0B0C11' }} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 96,
          width: 1080,
          height: 1,
          background: 'rgba(231,200,142,.24)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 96,
          width: 1080,
          height: 1,
          background: 'rgba(231,200,142,.24)',
        }}
      />
    </>
  ),
};

/* =========================================================
   13 · GLASS 玻璃拟态
   ========================================================= */
const glass: Skin = {
  id: 'glass',
  cn: '玻璃拟态',
  en: 'FROSTED GLASS',
  mode: 'light',
  pg: '#EEF3FB',
  ink: '#16203A',
  dim: 'rgba(28,38,66,.68)',
  faint: 'rgba(28,38,66,.5)',
  a1: '#3D7BFF',
  a2: '#8B5CF6',
  alt1: '#0FA7A0',
  alt2: '#F26D9B',
  line: 'rgba(52,72,120,.2)',
  panel: 'rgba(255,255,255,.58)',
  panelLine: 'rgba(255,255,255,.85)',
  radius: 32,
  serif: false,
  weight: 800,
  track: 2,
  numFamily: FONT_NUM,
  numWeight: 600,
  grain: 0.04,
  titleFill: () => 'linear-gradient(180deg,#101A32 0%,#2B3B66 78%,#4C5F97 100%)',
  bg: (t, ac) => {
    const c1 = ac === 2 ? '15,167,160' : '61,123,255';
    const c2 = ac === 2 ? '242,109,155' : '139,92,246';
    const c3 = ac === 2 ? '61,123,255' : '64,196,255';
    return (
      <>
        {/* 通透底色：晨雾蓝 → 薰衣草 → 淡粉 */}
        <Layer style={{ background: 'linear-gradient(172deg,#E9F1FC 0%,#EDF0FB 46%,#F4EFF8 100%)' }} />
        {/* 悬浮光斑：三颗大圆缓慢漂移，形成玻璃后面的彩色景深 */}
        <Layer
          style={{
            background: `radial-gradient(42% 30% at ${22 + Math.sin(t * 0.42) * 6}% ${
              20 + Math.cos(t * 0.38) * 5
            }%, ${rgba(c1, 0.4)} 0%, ${rgba(c1, 0)} 66%)`,
            filter: 'blur(10px)',
          }}
        />
        <Layer
          style={{
            background: `radial-gradient(46% 32% at ${80 + Math.cos(t * 0.33) * 6}% ${
              42 + Math.sin(t * 0.44) * 6
            }%, ${rgba(c2, 0.34)} 0%, ${rgba(c2, 0)} 68%)`,
            filter: 'blur(14px)',
          }}
        />
        <Layer
          style={{
            background: `radial-gradient(40% 28% at ${40 + Math.sin(t * 0.29) * 9}% ${
              88 + Math.cos(t * 0.36) * 5
            }%, ${rgba(c3, 0.3)} 0%, ${rgba(c3, 0)} 66%)`,
            filter: 'blur(12px)',
          }}
        />
        {/* 斜向光带：模拟玻璃的镜面高光 */}
        <Layer
          style={{
            background:
              'linear-gradient(118deg, rgba(255,255,255,0) 34%, rgba(255,255,255,.5) 46%, rgba(255,255,255,.1) 52%, rgba(255,255,255,0) 62%)',
          }}
        />
        {/* 细网格：玻璃的「结构线」 */}
        <Layer
          style={{
            backgroundImage:
              'linear-gradient(rgba(84,110,170,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(84,110,170,.06) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </>
    );
  },
  decor: (t, ac) => {
    const c1 = ac === 2 ? '15,167,160' : '61,123,255';
    const c2 = ac === 2 ? '242,109,155' : '139,92,246';
    return (
      <>
        {/* 右上角：磨砂玻璃方片（真正的 frosted 卡片装饰） */}
        <div
          style={{
            position: 'absolute',
            right: -70,
            top: 168,
            width: 300,
            height: 300,
            borderRadius: 60,
            background: 'rgba(255,255,255,.42)',
            border: '1.5px solid rgba(255,255,255,.9)',
            boxShadow: '0 24px 70px rgba(60,90,160,.16)',
            transform: `rotate(12deg) translateY(${Math.sin(t * 0.6) * 10}px)`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(128deg, ${rgba(c1, 0.24)} 0%, rgba(255,255,255,0) 46%, ${rgba(
                c2,
                0.24,
              )} 100%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 30,
              width: 150,
              height: 8,
              borderRadius: 9,
              background: 'rgba(255,255,255,.9)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 52,
              width: 96,
              height: 8,
              borderRadius: 9,
              background: 'rgba(255,255,255,.62)',
            }}
          />
        </div>
        {/* 左下角：小号磨砂片，与右上呼应 */}
        <div
          style={{
            position: 'absolute',
            left: -120,
            bottom: 190,
            width: 220,
            height: 220,
            borderRadius: 48,
            background: 'rgba(255,255,255,.36)',
            border: '1.5px solid rgba(255,255,255,.85)',
            boxShadow: '0 20px 60px rgba(60,90,160,.14)',
            transform: `rotate(-9deg) translateY(${Math.cos(t * 0.5) * 8}px)`,
          }}
        />
        {/* 悬浮玻璃珠 */}
        {[
          { x: 912, y: 560, r: 14, ph: 0 },
          { x: 118, y: 880, r: 9, ph: 2.1 },
          { x: 966, y: 1240, r: 11, ph: 4.2 },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y + Math.sin(t * 0.8 + b.ph) * 16,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 32% 28%, rgba(255,255,255,.98) 0%, rgba(255,255,255,.5) 38%, rgba(190,208,240,.28) 100%)',
              border: '1px solid rgba(255,255,255,.85)',
              boxShadow: '0 10px 26px rgba(70,100,170,.18)',
            }}
          />
        ))}
      </>
    );
  },
};

export const SKINS: Record<string, Skin> = {
  aurora,
  chrome,
  neon,
  noir,
  acid,
  deco,
  kinetic,
  stadium,
  holo,
  ink,
  riso,
  cinema,
  glass,
};

export const SKIN_LIST = Object.values(SKINS);

export const skinFor = (id: string, accent: number): Skin => {
  const s = SKINS[id] ?? aurora;
  if (accent === 2 && s.alt1 && s.alt2) {
    return {
      ...s,
      a1: s.alt1,
      a2: s.alt2,
      titleFill: s.titleFill ? () => s.titleFill!(2) : undefined,
    };
  }
  return s;
};
