import { Sfx } from '../components/Sfx';
import React from 'react';
import { Img, staticFile } from 'remotion';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 41 · 捷报弹屏版
 * 叙事：手机界面 + 群聊气泡逐条弹出（对方两条 → 我的捷报 → 成绩 → 夸奖 → 红包）
 *      → 红包盖翻开 → 全屏爆出保费 → 定版语 + 人物 + 二维码
 */

/** 每行高度（按气泡实际行数预排，绝对定位避免流式布局抖动） */
const H = [80, 80, 80, 120, 80, 150];
const GAP = 26;
const MSG_TOP = 122;
const TOPS = H.reduce<number[]>((acc, h, i) => {
  acc.push(i === 0 ? MSG_TOP : acc[i - 1] + H[i - 1] + GAP);
  return acc;
}, []);

const TIMES = [0.85, 1.55, 2.3, 3.1, 3.9, 4.7];

export const Chat: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const s0 = p.stats[0]?.v ?? '42';
  const s1 = p.stats[1]?.v ?? '218%';
  const s2 = p.stats[2]?.v ?? 'No.3';

  const leave = 1 - outExpo(seg(t, 5.7, 6.1));
  const fp = seg(t, 5.45, 5.75);
  const bo = seg(t, 5.7, 6.0);
  const bc = outExpo(seg(t, 6.3, 6.7));
  const pq = outBack(seg(t, 6.75, 7.1), 1.5);

  const bub = (me: boolean): React.CSSProperties => ({
    maxWidth: 400,
    padding: '20px 26px',
    borderRadius: me ? '20px 6px 20px 20px' : '6px 20px 20px 20px',
    background: me ? rgba(hexRgb(T.goldC), 0.16) : rgba(T.line, 0.14),
    border: `1px solid ${me ? rgba(hexRgb(T.goldC), 0.45) : rgba(T.line, 0.28)}`,
    fontSize: 27,
    lineHeight: '40px',
    color: rgba(T.pale, 0.95),
    wordBreak: 'break-all',
  });

  const ava: React.CSSProperties = {
    width: 64,
    height: 64,
    borderRadius: 12,
    flex: 'none',
    overflow: 'hidden',
    background: rgba(T.line, 0.2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    color: T.bright,
    fontWeight: 600,
  };

  const rowStyle = (i: number, me: boolean): React.CSSProperties => {
    const st = TIMES[i];
    const e = outBack(seg(t, st, st + 0.42), 1.7);
    const rise = outExpo(seg(t, st, st + 0.38));
    return {
      position: 'absolute',
      left: 26,
      right: 26,
      top: TOPS[i],
      display: 'flex',
      flexDirection: me ? 'row-reverse' : 'row',
      gap: 16,
      opacity: clamp01(seg(t, st, st + 0.16)) * leave,
      transform: `translateY(${((1 - rise) * 24 - (1 - leave) * 90).toFixed(1)}px) scale(${lerp(
        0.94,
        1,
        e
      ).toFixed(3)})`,
    };
  };

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* 手机 */}
      <div
        style={{
          position: 'absolute',
          left: 210,
          top: 190,
          width: 660,
          height: 1140,
          borderRadius: 38,
          border: `2px solid ${rgba(T.line, 0.6)}`,
          background: rgba(hexRgb(T.archbg), 0.82),
          boxShadow: '0 30px 80px rgba(0,0,0,.45), inset 0 0 40px rgba(0,0,0,.3)',
          overflow: 'hidden',
        }}
      >
        {/* 群名栏 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: 96,
            borderBottom: `1px solid ${rgba(T.line, 0.3)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: rgba(hexRgb(T.goldC), 0.9),
            }}
          />
          <Txt size={30} color={T.bright} weight={500} letterSpacing={3} lineHeight={42}>
            十月冲刺 · 战报群（3）
          </Txt>
        </div>

        {/* 消息流 */}
        <div style={rowStyle(0, false)}>
          <div style={ava}>王</div>
          <div style={bub(false)}>十月最后一天，大家冲！</div>
        </div>

        <div style={rowStyle(1, false)}>
          <div style={ava}>王</div>
          <div style={bub(false)}>今天谁有捷报？</div>
        </div>

        <div style={rowStyle(2, true)}>
          <div style={ava}>
            <Img
              src={p.photo || staticFile('assets/portrait.png')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={bub(true)}>
            捷报！保费 <b style={{ color: T.bright }}>{fmtNum(p.premium, hasDec)} 万</b> ✅
          </div>
        </div>

        <div style={rowStyle(3, true)}>
          <div style={ava}>怡</div>
          <div style={bub(true)}>
            承保 <b style={{ color: T.bright }}>{s0}</b> 件 · 达成{' '}
            <b style={{ color: T.bright }}>{s1}</b> · 全省{' '}
            <b style={{ color: T.bright }}>{s2}</b>
          </div>
        </div>

        <div style={rowStyle(4, false)}>
          <div style={ava}>王</div>
          <div style={bub(false)}>为你骄傲！这就是泰康速度 🔥</div>
        </div>

        {/* 红包 */}
        <div style={rowStyle(5, true)}>
          <div style={ava}>怡</div>
          <div
            style={{
              position: 'relative',
              width: 340,
              height: 150,
              padding: '26px 28px',
              borderRadius: 16,
              background: 'linear-gradient(160deg,#C23A2E,#8E1B14)',
              border: '1px solid rgba(255,210,140,.5)',
              boxShadow: '0 12px 30px rgba(0,0,0,.4)',
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: 30, color: '#FFE9BC', fontWeight: 600, letterSpacing: 2 }}>
              恭喜发财 · 大吉大利
            </div>
            <div style={{ fontSize: 22, color: 'rgba(255,233,188,.75)', marginTop: 8, letterSpacing: 2 }}>
              十月战功红包
            </div>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '50%',
                borderRadius: '16px 16px 0 0',
                background: 'linear-gradient(180deg,#D8483A,#A82419)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 56,
                color: '#FFE9BC',
                fontWeight: 700,
                transformOrigin: '50% 0%',
                transform: `rotateX(${(-170 * fp).toFixed(1)}deg)`,
                opacity: fp > 0.96 ? 0 : 1,
              }}
            >
              領
            </div>
          </div>
        </div>

        {/* 拆开爆数 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: clamp01(bo),
            background: `radial-gradient(circle at 50% 46%,${rgba(hexRgb(T.goldC), 0.34)},${rgba(
              hexRgb(T.archbg),
              0.82
            )} 72%)`,
          }}
        >
          <div style={{ transform: `scale(${lerp(1.6, 1, outBack(bo, 1.6)).toFixed(3)})` }}>
            <GoldText theme={T} size={130} font="num" lineHeight={150}>
              {fmtNum(p.premium * outExpo(seg(t, 5.72, 6.3)), hasDec)}
            </GoldText>
          </div>
          <Txt
            size={30}
            color={rgba(T.soft, 0.9)}
            weight={300}
            letterSpacing={6}
            lineHeight={42}
            style={{ marginTop: 10 }}
          >
            {p.dlabel}
          </Txt>
        </div>
      </div>

      {/* 定版语 */}
      <div
        style={{
          position: 'absolute',
          top: 1390,
          width: 1080,
          textAlign: 'center',
          opacity: bc,
          transform: `translateY(${((1 - bc) * 22).toFixed(1)}px)`,
        }}
      >
        <GoldText theme={T} size={44} weight={600} letterSpacing={8} lineHeight={60}>
          {p.slogan2}
        </GoldText>
      </div>
      <Txt
        size={34}
        color={rgba(T.pale, 0.9)}
        weight={400}
        letterSpacing={6}
        lineHeight={48}
        style={{
          position: 'absolute',
          top: 1470,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.55, 6.9)),
        }}
      >
        {p.name} · {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={465}
        top={1540}
        size={150}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 6.75, 6.92)),
          transform: `scale(${lerp(0.85, 1, pq).toFixed(3)})`,
        }}
      />
      <Txt
        size={24}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={34}
        style={{
          position: 'absolute',
          top: 1704,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.95, 7.25)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={6.98} vol={0.3} />
    </Stage>
  );
};
