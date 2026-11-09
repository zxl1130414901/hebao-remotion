import { Sfx } from '../components/Sfx';
import React from 'react';
import { Stage } from '../components/Stage';
import { GoldText, Txt } from '../components/GoldText';
import { QrBlock } from '../components/QrBlock';
import { THEMES } from '../theme';
import { clamp01, fmtNum, hexRgb, lerp, outBack, outExpo, rgba, seg } from '../lib/anim';
import { useT } from '../lib/useT';
import type { HebaoProps } from '../data/types';

/**
 * 49 · 复古终端版
 * 叙事：CRT 通电 → 战报日志逐行打字（未完成的行是暗色，完成的行高亮）
 *      → MISSION COMPLETE 压轴砸出 → 人物 + 二维码
 */

type Seg = { txt: string; cls?: 'dim' | 'hi' };

const MONO = 'Consolas,"Courier New",monospace';

export const Terminal: React.FC<HebaoProps> = (p) => {
  const t = useT();
  const T = THEMES[p.theme] ?? THEMES.hongjin;
  const hasDec = p.premium % 1 !== 0;

  const pv = fmtNum(p.premium, hasDec);
  const s0 = p.stats[0]?.v ?? '42';
  const s1 = p.stats[1]?.v ?? '218%';
  const s2 = p.stats[2]?.v ?? 'No.3';

  const LINES: Seg[][] = [
    [{ txt: '> login TAIKANG_AGENT --month=10 ............ ' }, { txt: 'OK', cls: 'dim' }],
    [{ txt: '> user: ' }, { txt: p.name, cls: 'hi' }, { txt: ` (${p.role})` }],
    [{ txt: '> load mission [OCT_SPRINT] ................ ' }, { txt: 'OK', cls: 'dim' }],
    [{ txt: '> premium .... ' }, { txt: `${pv} 万`, cls: 'hi' }],
    [
      { txt: '> policies ... ' },
      { txt: s0, cls: 'hi' },
      { txt: '      rate .. ' },
      { txt: s1, cls: 'hi' },
    ],
    [{ txt: '> rank ....... ' }, { txt: s2, cls: 'hi' }, { txt: ' (province)' }],
    [{ txt: '> MISSION COMPLETE — next: NOV, GO HIGHER_' }],
  ];
  const STARTS = [0.6, 1.5, 2.4, 3.3, 4.1, 4.9, 5.7];
  const CPS = 34;

  const mc = seg(t, 6.55, 6.8);
  const en = outExpo(seg(t, 6.95, 7.35));
  const pq = outBack(seg(t, 7.2, 7.55), 1.5);

  return (
    <Stage theme={T} brand={p.brand} showBottomTag={false}>
      {/* CRT 屏 */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 200,
          width: 920,
          height: 1240,
          borderRadius: 26,
          background: T.archbg,
          border: `2px solid ${rgba(T.line, 0.35)}`,
          boxShadow: '0 30px 90px rgba(0,0,0,.5), inset 0 0 120px rgba(0,0,0,.55)',
          overflow: 'hidden',
          opacity: clamp01(seg(t, 0.25, 0.7)),
          transform: `scale(${lerp(1.04, 1, outExpo(seg(t, 0.25, 0.9))).toFixed(4)})`,
        }}
      >
        {/* 标题栏 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: 70,
            borderBottom: `1px solid ${rgba(T.line, 0.3)}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 34px',
            gap: 16,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: rgba(hexRgb(T.goldC), 0.7),
              }}
            />
          ))}
          <span
            style={{
              fontSize: 22,
              letterSpacing: 4,
              color: rgba(hexRgb(T.goldB), 0.75),
              fontFamily: MONO,
            }}
          >
            TAIKANG-TERM v10.1 — OCT MISSION LOG
          </span>
        </div>

        {/* 日志 */}
        <div
          style={{
            position: 'absolute',
            left: 44,
            top: 100,
            width: 832,
            fontFamily: MONO,
            fontSize: 29,
            lineHeight: '52px',
            color: T.goldB,
            whiteSpace: 'pre-wrap',
          }}
        >
          {LINES.map((segs, i) => {
            const st = STARTS[i];
            if (t < st) return null;
            const plain = segs.map((s) => s.txt).join('');
            const n = Math.min(plain.length, Math.floor((t - st) * CPS));
            const done = n >= plain.length;
            return (
              <div key={i}>
                {done ? (
                  segs.map((s, j) => (
                    <span
                      key={j}
                      style={
                        s.cls === 'dim'
                          ? { color: rgba(hexRgb(T.goldB), 0.5) }
                          : s.cls === 'hi'
                          ? { color: T.bright, textShadow: `0 0 10px ${rgba(hexRgb(T.goldB), 0.6)}` }
                          : undefined
                      }
                    >
                      {s.txt}
                    </span>
                  ))
                ) : (
                  <span style={{ color: rgba(hexRgb(T.goldB), 0.5) }}>{plain.slice(0, n)}</span>
                )}
              </div>
            );
          })}
          {/* 光标 */}
          <span
            style={{
              display: 'inline-block',
              width: 16,
              height: 34,
              background: T.goldB,
              verticalAlign: 'middle',
              boxShadow: `0 0 8px ${rgba(hexRgb(T.goldB), 0.8)}`,
              opacity: Math.sin(t * 6) > 0 ? 1 : 0,
            }}
          />
        </div>

        {/* CRT 质感 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg,rgba(0,0,0,.24) 0 3px,transparent 3px 6px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 46%,transparent 58%,rgba(0,0,0,.5) 100%)',
          }}
        />
      </div>

      {/* MISSION COMPLETE */}
      <div
        style={{
          position: 'absolute',
          top: 1150,
          width: 1080,
          textAlign: 'center',
          opacity: clamp01(mc),
          transform: `scale(${lerp(1.5, 1, 1 - Math.pow(1 - mc, 3)).toFixed(3)})`,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 66,
            letterSpacing: 10,
            color: T.bright,
            textShadow: `0 0 16px ${rgba(hexRgb(T.goldB), 0.8)}`,
            fontWeight: 700,
          }}
        >
          MISSION COMPLETE
        </span>
      </div>
      <Txt
        size={28}
        color={rgba(hexRgb(T.goldB), 0.8)}
        weight={300}
        letterSpacing={8}
        lineHeight={40}
        style={{
          position: 'absolute',
          top: 1240,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 6.8, 7.1)),
        }}
      >
        目标达成 {s1} · 全省 {s2}
      </Txt>

      {/* 收尾 */}
      <Txt
        size={46}
        color="#fff"
        weight={600}
        font="serif"
        letterSpacing={8}
        lineHeight={64}
        style={{
          position: 'absolute',
          top: 1400,
          width: 1080,
          textAlign: 'center',
          opacity: en,
          transform: `translateY(${((1 - en) * 20).toFixed(1)}px)`,
        }}
      >
        {p.name}
      </Txt>
      <Txt
        size={25}
        color={rgba(T.soft, 0.85)}
        weight={300}
        letterSpacing={4}
        lineHeight={36}
        style={{
          position: 'absolute',
          top: 1474,
          width: 1080,
          textAlign: 'center',
          opacity: outExpo(seg(t, 7.1, 7.45)),
        }}
      >
        {p.role}
      </Txt>
      <QrBlock
        theme={T}
        left={465}
        top={1540}
        size={150}
        src={p.qr}
        style={{
          opacity: clamp01(seg(t, 7.2, 7.38)),
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
          opacity: outExpo(seg(t, 7.4, 7.7)),
        }}
      >
        {p.qrCap}
      </Txt>
        <Sfx name="sfx_chime" at={7.38} vol={0.3} />
    </Stage>
  );
};
