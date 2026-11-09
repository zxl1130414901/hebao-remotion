import { Sfx } from '../components/Sfx';
import { PAPER_URL } from '../components/textures';
import React from 'react';
import { Stage } from '../components/Stage';
import { Chapter } from '../components/Chapter';
import { GoldText, Txt } from '../components/GoldText';
import { EndCard } from '../components/EndCard';
import { THEMES } from '../theme';
import { hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

const CLIENTS = [
  '张女士', '王先生', '刘女士', '陈先生',
  '李女士', '赵先生', '周女士', '吴先生',
  '郑女士', '孙先生', '何女士', '林先生',
];

/**
 * 73 · 答谢客户版
 * 叙事：一封手写信 → 落款签名 → 一面客户名字墙 → 服务总数 → 定版
 * 与旧模板差异：主角是「客户」不是自己；情绪是感谢而非炫耀，适合年末/司庆群发。
 */
export const Thanks: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const cream = hexRgb(T.cream);
  const gold = hexRgb(T.goldB);

  const paperIn = outExpo(seg(t, 0.1, 0.56));
  const signIn = outExpo(seg(t, 2.02, 2.4));
  const sign = outExpo(seg(t, 2.14, 2.66));

  const lines = [
    '这一年，我签下的每一份保单，',
    '背后都是一个家庭把未来交到我手上。',
    '',
    '谢谢你们在没听懂的时候，',
    '愿意再给我十分钟。',
    '',
    '也谢谢那些拒绝过我的人，',
    '让我知道，哪句话还没说到位。',
  ];

  return (
    <Stage theme={T} brand={p.brand} bottomtag="THANK　YOU">
      {/* 01 手写信 */}
      <Chapter t={t} in={[0.04, 0.34]} out={[2.9, 3.18]}>
        <Txt
          size={24}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={34}
          style={{
            position: 'absolute',
            left: 0,
            top: 330,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.08, 0.38)),
          }}
        >
          A　LETTER　TO　MY　CLIENTS
        </Txt>
        <Txt
          size={50}
          color="#fff"
          weight={600}
          font="serif"
          letterSpacing={16}
          lineHeight={70}
          style={{
            position: 'absolute',
            left: 0,
            top: 380,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 0.14, 0.44)),
          }}
        >
          {p.slogan || '致 谢'}
        </Txt>

        <div
          style={{
            position: 'absolute',
            left: 108,
            top: 492,
            width: 864,
            height: 806,
            borderRadius: 6,
            background: `linear-gradient(168deg, ${rgba(T.pale, 0.97)} 0%, ${rgba(hexRgb(T.cream), 0.93)} 62%, ${rgba(T.warm, 0.88)} 100%)`,
            boxShadow: `0 28px 68px rgba(0,0,0,0.36), inset 0 0 0 1px ${rgba(T.line, 0.45)}`,
            opacity: paperIn,
            transform: `translateY(${(1 - paperIn) * 38}px) rotate(${(1 - paperIn) * 1.4}deg)`,
          }}
        >
          {/* 纸张纤维纹理 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              backgroundImage: PAPER_URL,
              opacity: 0.4,
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{ position: 'absolute', inset: 16, border: `1px solid ${rgba(hexRgb(T.goldD), 0.3)}` }}
          />
          {/* 横线纸质感 */}
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 46,
                right: 46,
                top: 148 + i * 56,
                height: 1,
                background: rgba(T.archbg, 0.07),
              }}
            />
          ))}

          <div style={{ position: 'absolute', left: 52, top: 52 }}>
            {lines.map((ln, i) =>
              ln === '' ? null : (
                <Txt
                  key={i}
                  size={29}
                  color={rgba(T.archbg, 0.86)}
                  weight={300}
                  font="serif"
                  letterSpacing={3}
                  lineHeight={56}
                  style={{
                    position: 'absolute',
                    top: i * 56,
                    whiteSpace: 'nowrap',
                    opacity: outExpo(seg(t, 0.4 + i * 0.16, 0.68 + i * 0.16)),
                  }}
                >
                  {ln}
                </Txt>
              )
            )}
          </div>

          {/* 落款 */}
          <div
            style={{
              position: 'absolute',
              right: 60,
              bottom: 54,
              textAlign: 'right',
              opacity: signIn,
            }}
          >
            <Txt size={24} color={rgba(T.archbg, 0.85)} letterSpacing={4} lineHeight={34}>
              {p.dateText}
            </Txt>
            {/* 手写签名 */}
            <svg width={230} height={90} viewBox="0 0 230 90" style={{ marginTop: 4 }}>
              <path
                d="M10 66 C 32 22, 48 14, 56 44 C 62 68, 74 66, 82 38 C 90 10, 104 18, 108 48 C 112 76, 126 66, 136 40 C 146 14, 160 20, 164 52 C 168 80, 186 66, 196 40 C 204 20, 214 26, 222 46"
                fill="none"
                stroke={rgba(T.archbg, 0.82)}
                strokeWidth={3.4}
                strokeLinecap="round"
                strokeDasharray={1}
                pathLength={1}
                strokeDashoffset={1 - sign}
              />
            </svg>
            <Txt size={26} color={rgba(T.archbg, 0.85)} letterSpacing={5} lineHeight={36}>
              {p.name}
            </Txt>
          </div>
        </div>
      </Chapter>

      {/* 02 客户名字墙 */}
      <Chapter t={t} in={[3.02, 3.32]} out={[5.06, 5.34]}>
        <Txt
          size={26}
          color={rgba(T.mist, 0.85)}
          letterSpacing={12}
          lineHeight={36}
          style={{
            position: 'absolute',
            left: 0,
            top: 470,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.1, 3.4)),
          }}
        >
          我 记 得 每 一 位
        </Txt>

        <div style={{ position: 'absolute', left: 106, top: 540, width: 868 }}>
          {CLIENTS.map((c, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const s0 = 3.24 + i * 0.055;
            const e = outExpo(seg(t, s0, s0 + 0.3));
            return (
              <div
                key={c}
                style={{
                  position: 'absolute',
                  left: col * 220,
                  top: row * 78,
                  width: 200,
                  height: 62,
                  borderRadius: 8,
                  border: `1px solid ${rgba(T.line, 0.22)}`,
                  background: rgba(T.pale, 0.06),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: e * 0.94,
                  transform: `translateY(${(1 - e) * 16}px)`,
                }}
              >
                <Txt size={26} color={rgba(cream, 0.8)} weight={300} letterSpacing={3} lineHeight={36}>
                  {c}
                </Txt>
              </div>
            );
          })}
        </div>

        <Txt
          size={22}
          color={rgba(T.mist, 0.85)}
          weight={300}
          letterSpacing={3}
          lineHeight={32}
          style={{
            position: 'absolute',
            left: 0,
            top: 840,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 3.9, 4.22)),
          }}
        >
          为保护隐私，仅列姓氏
        </Txt>

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 950,
            width: 1080,
            textAlign: 'center',
            opacity: outExpo(seg(t, 4.0, 4.34)),
          }}
        >
          <Txt size={30} color={rgba(cream, 0.85)} font="serif" letterSpacing={7} lineHeight={44}>
            这一年，一共服务了
          </Txt>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12, marginTop: 8 }}>
            <GoldText
              theme={T}
              size={168}
              weight={700}
              font="num"
              lineHeight={196}
              style={{
                transform: `scale(${lerp(1.14, 1, outBack(seg(t, 4.06, 4.48), 1.9))})`,
              }}
            >
              {p.hero || '126'}
            </GoldText>
            <Txt size={52} color={rgba(cream, 0.86)} weight={500} font="serif" letterSpacing={6} lineHeight={70}>
              位客户
            </Txt>
          </div>
        </div>
      </Chapter>

      {/* 03 定版 */}
      <Chapter t={t} in={[5.28, 5.64]}>
        <Sfx name="sfx_chime" at={4.35} vol={0.3} />
        <EndCard theme={T} t={t} start={5.34} p={p} />
      </Chapter>
    </Stage>
  );
};
