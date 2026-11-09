import React, { useMemo } from 'react';
import { Audio, Sequence, staticFile, getInputProps, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Theme } from '../theme';
import { FONT_SANS } from '../theme';
import { rgba, inOut, makeRng } from '../lib/anim';
import { bedForCategory, useCategory } from '../lib/category';
import type { HebaoProps } from '../data/types';
import { Sfx } from './Sfx';

/**
 * 舞台底座：背景渐变 / 双光晕呼吸 / 金色粒子 / 胶片颗粒 / 内金框 / 竖排品牌 / 底部英文标
 * 完全对应 HTML 版 template-base.css 的 #stage 结构。
 * 所有动态量都是 frame 的纯函数 —— 同一帧号在任何机器上结果一致。
 */

type Particle = { x: number; sz: number; y0: number; spd: number; ph: number };

const buildParticles = (seed: number, n: number): Particle[] => {
  const rnd = makeRng(seed);
  const out: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const sz = 1.5 + rnd() * 3;
    const x = rnd() * 1080;
    const y0 = rnd() * 1920;
    const spd = 16 + rnd() * 46;
    const ph = rnd() * 6.28;
    out.push({ x, sz, y0, spd, ph });
  }
  return out;
};

export const GRAIN_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.7'/></svg>\")";

export const Stage: React.FC<{
  theme: Theme;
  children: React.ReactNode;
  brand?: string;
  bottomtag?: string;
  showBottomTag?: boolean;
  /** 整页缓推（1 → 1.022）。文字层的锐度敏感模板可关掉 */
  zoom?: boolean;
  particleSeed?: number;
  particleCount?: number;
  /**
   * 品牌栏版式。绝大多数模板是「右侧竖排」，但 honor / battle / scroll / silk
   * 等在原版里把它覆写成「顶部居中横排」—— 这两者不能共用一套 CSS。
   */
  brandLayout?: 'vertical' | 'top';
  brandTop?: number;
  brandSize?: number;
  /** 商业调色层：整体对比/饱和微调 + 暖金高光/酒红暗部 + 轻暗角。默认开 */
  grade?: boolean;
  /** 分类底乐（Stage 自动按 category 选曲）。模板自带精修音轨时传 false 关掉 */
  bgm?: boolean;
  /** 胶片颗粒层（逐帧跳动） */
  grain?: boolean;
  /** 定版扫光：结尾一道斜向提亮，广播包装的收束动作 */
  sweep?: boolean;
  /** 手持微动：1~2px 的呼吸式漂移，去掉「死板三脚架」感 */
  drift?: boolean;
}> = ({
  theme,
  children,
  brand = '泰康养老 · 个险渠道',
  bottomtag = 'GOOD　NEWS',
  showBottomTag = true,
  zoom = true,
  particleSeed = 20261028,
  particleCount = 46,
  brandLayout = 'vertical',
  brandTop = 112,
  brandSize = 30,
  grade = true,
  bgm = true,
  grain = true,
  sweep = true,
  drift = true,
}) => {
  const frame = useCurrentFrame();
  const cat = useCategory();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const dur = durationInFrames / fps;

  /* 可选语音播报：props.voice 指向 public/ 下的音频文件（如 assets/voices/a.wav）。
   * 由外部 TTS 工具（如本机 VoxCPM）预生成后填入 props —— 没配则完全静默，
   * 有语音时底乐自动闪避到 0.18，给人声让位。 */
  const voiceProps = useMemo(() => getInputProps<Partial<HebaoProps>>(), []);
  const voice = voiceProps?.voice;
  const voiceStart = voiceProps?.voiceStart ?? 0.6;

  const particles = useMemo(() => buildParticles(particleSeed, particleCount), [
    particleSeed,
    particleCount,
  ]);

  const zoomScale = zoom ? 1 + 0.022 * inOut(Math.min(1, t / dur)) : 1;
  const glow1Op = 0.86 + 0.14 * Math.sin((t / 4) * Math.PI * 2 - 1.2);
  const glow2Op = 0.75 + 0.25 * Math.sin((t / 4) * Math.PI * 2);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: 'relative',
        overflow: 'hidden',
        background: theme.bg[0],
        fontFamily: FONT_SANS,
        filter: grade ? 'contrast(1.05) saturate(1.06) brightness(1.01)' : undefined,
        /* 手持微动：两个不同周期的低频正弦叠加，幅度 1.6px 内，像稳定器呼吸 */
        transform: drift
          ? `translate(${(Math.sin(t * 0.83) * 0.9 + Math.sin(t * 1.37 + 1.1) * 0.55).toFixed(2)}px, ${(
              Math.sin(t * 0.61 + 0.7) * 1.5 +
              Math.sin(t * 1.09) * 0.6
            ).toFixed(2)}px) scale(1.004)`
          : undefined,
      }}
    >
      {/* 分类底乐（与画面同长 8.03s，纯代码合成）；有语音时自动闪避 */}
      {bgm && <Audio src={staticFile(bedForCategory(cat))} volume={voice ? 0.18 : 0.5} />}

      {/* 可选语音播报（外部 TTS 预生成，路径见 props.voice 注释） */}
      {voice && (
        <Sequence from={Math.round(voiceStart * fps)} name="voice">
          <Audio src={staticFile(voice)} volume={1} />
        </Sequence>
      )}

      {/* 定版扫光收束音（与 EndCard 入场 whoosh 分别落在扫光起点，不同频段不叠） */}
      {sweep && <Sfx name="sfx_shimmer" at={6.86} vol={0.32} />}

      {/* 背景层：只有这一层做缓推，文字层始终 1:1 像素渲染 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '50% 45%',
          transform: `scale(${zoomScale})`,
        }}
      >
        {/* 背景三段渐变 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg,${theme.bg[0]} 0%,${theme.bg[1]} 50%,${theme.bg[2]} 100%)`,
          }}
        />
        {/* 光晕 1：中上部暖金 */}
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 380,
            width: 900,
            height: 900,
            borderRadius: '50%',
            opacity: glow1Op,
            background: `radial-gradient(circle at 50% 50%, ${rgba(
              theme.glow1,
              0.36
            )} 0%, ${rgba(theme.glow1, 0)} 68%)`,
          }}
        />
        {/* 光晕 2：底部 */}
        <div
          style={{
            position: 'absolute',
            left: -60,
            top: 1400,
            width: 1200,
            height: 700,
            borderRadius: '50%',
            opacity: glow2Op,
            background: `radial-gradient(circle at 50% 50%, ${rgba(
              theme.glow2,
              0.26
            )} 0%, ${rgba(theme.glow2, 0)} 70%)`,
          }}
        />
        {/* 金色粒子 */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {particles.map((p, i) => {
            const y = (((p.y0 - t * p.spd) % 1920) + 1920) % 1920;
            const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + p.ph);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: p.x,
                  width: p.sz,
                  height: p.sz,
                  borderRadius: '50%',
                  background: theme.pt,
                  filter: 'blur(0.3px)',
                  transform: `translate3d(0,${y - 1920}px,0)`,
                  opacity: 0.12 + 0.4 * Math.abs(tw),
                }}
              />
            );
          })}
        </div>
        {/* 胶片颗粒 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            mixBlendMode: 'overlay',
            backgroundImage: GRAIN_URL,
          }}
        />
      </div>

      {/* —— 以下不参与缓推，文字与装饰始终按整数像素落位 —— */}
      {/* 内金框 */}
      <div
        style={{
          position: 'absolute',
          left: 56,
          top: 56,
          width: 968,
          height: 1808,
          border: `1px solid ${rgba(theme.line, 0.3)}`,
          borderRadius: 2,
        }}
      />
        {/* 品牌栏：默认右侧竖排；仪式类模板走顶部居中横排 */}
        {brandLayout === 'vertical' ? (
          <div
            style={{
              position: 'absolute',
              right: 42,
              top: 104,
              width: 40,
              fontSize: 28,
              lineHeight: '44px',
              letterSpacing: 6,
              color: rgba(theme.mist, 1),
              fontWeight: 500,
              writingMode: 'vertical-rl',
              textAlign: 'center',
            }}
          >
            {brand}
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: brandTop,
              width: 1080,
              textAlign: 'center',
              fontSize: brandSize,
              letterSpacing: 8,
              color: rgba(theme.mist, 1),
              fontWeight: 300,
            }}
          >
            {brand}
          </div>
        )}

        {/* 模板章节 */}
        {children}

        {/* 底部英文标 */}
        {showBottomTag && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 1822,
              width: 1080,
              textAlign: 'center',
              fontSize: 28,
              letterSpacing: 10,
              color: rgba(theme.soft, 0.78),
              fontWeight: 400,
            }}
          >
            {bottomtag}
          </div>
        )}

        {/* —— 商业调色层：暖金高光 + 酒红暗部 + 轻暗角（broadcast 质感的底味） —— */}
        {grade && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                mixBlendMode: 'soft-light',
                background:
                  'linear-gradient(180deg, rgba(255,206,120,0.32) 0%, rgba(255,206,120,0) 34%, rgba(64,6,6,0.34) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background:
                  'radial-gradient(ellipse 135% 108% at 50% 42%, rgba(0,0,0,0) 60%, rgba(24,2,2,0.22) 100%)',
              }}
            />
          </>
        )}

        {/* —— 胶片颗粒：逐帧换位置，模拟胶片/CMOS 噪点跳动 —— */}
        {grain && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.05,
              mixBlendMode: 'overlay',
              backgroundImage: GRAIN_URL,
              backgroundPosition: `${(frame * 37) % 160}px ${(frame * 53) % 160}px`,
            }}
          />
        )}

        {/* —— 定版扫光：结尾一道斜向提亮，广播包装的标准收束 —— */}
        {sweep &&
          (() => {
            const p = Math.max(0, Math.min(1, (t - 6.86) / 0.78));
            if (p <= 0 || p >= 1) return null;
            return (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  mixBlendMode: 'screen',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -400,
                    bottom: -400,
                    width: 420,
                    left: 0,
                    transform: `translateX(${(-760 + p * 2400).toFixed(1)}px) rotate(13deg)`,
                    background:
                      'linear-gradient(90deg, rgba(255,246,220,0) 0%, rgba(255,246,220,0.42) 50%, rgba(255,246,220,0) 100%)',
                  }}
                />
              </div>
            );
          })()}
    </div>
  );
};
