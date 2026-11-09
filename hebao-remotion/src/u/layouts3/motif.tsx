import React from 'react';
import type { Skin } from '../skins';
import { rgba } from '../lib/anim';

/**
 * 第二幕底纹（Motif）
 *
 * 三幕式的第二幕天然是一张"数据页"，如果把骨架图形整块撤掉，8 秒里有近 3 秒
 * 和任何一套模板长得一样——横向翻看就又变成"同一个模子换底色"。
 * 这里给每种骨架画一层低透明度、大尺度的抽象底纹，让第二幕仍然"是那件东西"，
 * 同时不干扰数字与事实项的可读性。
 *
 * 约定：底纹有效不透明度约 0.15–0.2，全部使用 a1（强调色），不塞文字。
 */

const W = 1080;
const H = 1920;

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
    {children}
  </svg>
);

export const Motif: React.FC<{ kind: string; s: Skin; t: number; arr?: number }> = ({ kind, s, arr }) => {
  const A = 0.5; // 线条本身的不透明度，外层再压一层
  const line = (a = 1) => rgba(s.a1, A * a);
  const fill = (a = 1) => rgba(s.a1, 0.16 * a);
  const ink = (a = 1) => rgba(s.ink, 0.1 * a);

  let body: React.ReactNode = null;

  switch (kind) {
    case 'passport':
      body = (
        <Svg>
          <rect x={110} y={330} width={420} height={1240} rx={14} fill={fill(0.5)} stroke={line(0.9)} strokeWidth={2} />
          <rect x={550} y={330} width={420} height={1240} rx={14} fill={fill(0.35)} stroke={line(0.9)} strokeWidth={2} />
          <line x1={540} y1={330} x2={540} y2={1570} stroke={line(1.4)} strokeWidth={8} />
          <rect x={160} y={430} width={250} height={310} rx={6} fill="none" stroke={line(0.8)} strokeWidth={2} />
          <circle cx={285} cy={530} r={54} fill={fill(1.6)} />
          <path d="M 200 700 Q 285 590 370 700 Z" fill={fill(1.4)} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={160} y={800 + i * 62} width={250 - i * 26} height={16} fill={line(0.5)} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={600} y={430 + i * 84} width={330 - (i % 2) * 90} height={14} fill={line(0.45)} />
          ))}
          {Array.from({ length: 44 }).map((_, i) => (
            <rect key={i} x={600 + i * 8} y={1380 + (i % 3) * 26} width={i % 4 === 3 ? 2 : 5} height={44} fill={line(0.8)} />
          ))}
        </Svg>
      );
      break;

    case 'blueprint':
      body = (
        <Svg>
          <defs>
            <pattern id="m-grid" width={60} height={60} patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke={line(0.22)} strokeWidth={1} />
            </pattern>
          </defs>
          <rect x={0} y={0} width={W} height={H} fill="url(#m-grid)" />
          <rect x={110} y={430} width={860} height={1010} fill="none" stroke={line(1.3)} strokeWidth={3} strokeDasharray="22 14" />
          {[
            [110, 430, 1, 1],
            [970, 430, -1, 1],
            [110, 1440, 1, -1],
            [970, 1440, -1, -1],
          ].map(([x, y, sx, sy], i) => (
            <path key={i} d={`M ${x} ${y + 46 * sy} L ${x} ${y} L ${x + 46 * sx} ${y}`} fill="none" stroke={line(1.6)} strokeWidth={4} />
          ))}
          <line x1={110} y1={1520} x2={970} y2={1520} stroke={line(1)} strokeWidth={2} />
          <line x1={110} y1={1504} x2={110} y2={1536} stroke={line(1)} strokeWidth={2} />
          <line x1={970} y1={1504} x2={970} y2={1536} stroke={line(1)} strokeWidth={2} />
          {[500, 700, 860].map((y, i) => (
            <rect key={i} x={150} y={y} width={380 + i * 90} height={12} fill={line(0.4)} />
          ))}
        </Svg>
      );
      break;

    case 'ledger':
      body = (
        <Svg>
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={i} x1={88} y1={380 + i * 82} x2={992} y2={380 + i * 82} stroke={line(0.55)} strokeWidth={1.5} />
          ))}
          <line x1={760} y1={360} x2={760} y2={1560} stroke={rgba('#B4453C', 0.5)} strokeWidth={3} />
          <line x1={88} y1={1560} x2={992} y2={1560} stroke={line(1.4)} strokeWidth={4} />
          <line x1={88} y1={1574} x2={992} y2={1574} stroke={line(1)} strokeWidth={2} />
        </Svg>
      );
      break;

    case 'cassette':
      body = (
        <Svg>
          <rect x={250} y={680} width={580} height={520} rx={24} fill={fill(0.4)} stroke={line(1.2)} strokeWidth={4} />
          <rect x={310} y={740} width={460} height={180} rx={8} fill="none" stroke={line(0.7)} strokeWidth={2} />
          {[420, 660].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={1030} r={96} fill="none" stroke={line(1.1)} strokeWidth={4} />
              <circle cx={x} cy={1030} r={44} fill="none" stroke={line(0.9)} strokeWidth={3} />
              {Array.from({ length: 6 }).map((_, k) => (
                <line
                  key={k}
                  x1={x + Math.cos((k * Math.PI) / 3) * 44}
                  y1={1030 + Math.sin((k * Math.PI) / 3) * 44}
                  x2={x + Math.cos((k * Math.PI) / 3) * 92}
                  y2={1030 + Math.sin((k * Math.PI) / 3) * 92}
                  stroke={line(0.6)}
                  strokeWidth={3}
                />
              ))}
            </g>
          ))}
          <rect x={330} y={960} width={120} height={60} rx={6} fill="none" stroke={line(0.6)} strokeWidth={2} />
          <rect x={630} y={960} width={120} height={60} rx={6} fill="none" stroke={line(0.6)} strokeWidth={2} />
          {[
            [270, 700],
            [770, 700],
            [270, 1160],
            [770, 1160],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={12} fill={line(1.2)} />
          ))}
        </Svg>
      );
      break;

    case 'telegram':
      body = (
        <Svg>
          <rect x={80} y={520} width={920} height={900} fill={fill(0.28)} stroke={line(1)} strokeWidth={3} strokeDasharray="6 16" />
          {Array.from({ length: 11 }).map((_, i) => (
            <rect key={i} x={140} y={620 + i * 66} width={i % 4 === 3 ? 380 : 800} height={12} fill={line(0.4)} />
          ))}
          <line x1={80} y1={600} x2={1000} y2={600} stroke={line(1.1)} strokeWidth={3} />
        </Svg>
      );
      break;

    case 'calendar':
      body = (
        <Svg>
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={88 + i * 129} y1={560} x2={88 + i * 129} y2={1400} stroke={line(0.4)} strokeWidth={1.5} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1={88} y1={560 + i * 168} x2={992} y2={560 + i * 168} stroke={line(0.4)} strokeWidth={1.5} />
          ))}
          <circle cx={88 + 129 * 3.5} cy={560 + 168 * 4} r={62} fill="none" stroke={rgba('#C0483C', 0.55)} strokeWidth={5} />
          <rect x={88} y={500} width={904} height={44} fill={line(0.5)} />
        </Svg>
      );
      break;

    case 'timeline':
      body = (
        <Svg>
          <line x1={60} y1={1010} x2={1020} y2={1010} stroke={line(1.2)} strokeWidth={3} />
          {Array.from({ length: 29 }).map((_, i) => (
            <line key={i} x1={70 + i * 34} y1={1010} x2={70 + i * 34} y2={i % 4 === 0 ? 1050 : 1032} stroke={line(0.7)} strokeWidth={2} />
          ))}
          {[240, 540, 840].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={1010} r={22} fill="none" stroke={line(1.4)} strokeWidth={4} />
              <rect x={x - 70} y={900 - i * 8} width={140} height={10} fill={line(0.55)} />
              <rect x={x - 50} y={1090 + i * 8} width={100} height={10} fill={line(0.4)} />
            </g>
          ))}
        </Svg>
      );
      break;

    case 'orbit':
      body = (
        <Svg>
          <g transform="rotate(-16 540 1000)">
            {[
              [430, 150],
              [310, 108],
              [190, 66],
            ].map(([rx, ry], i) => (
              <ellipse key={i} cx={540} cy={1000} rx={rx} ry={ry} fill="none" stroke={line(0.8 - i * 0.12)} strokeWidth={2.5} />
            ))}
          </g>
          <circle cx={540} cy={1000} r={64} fill={fill(1.4)} stroke={line(1.2)} strokeWidth={3} />
          <circle cx={886} cy={928} r={18} fill={line(1.4)} />
          <circle cx={256} cy={1092} r={12} fill={line(1)} />
        </Svg>
      );
      break;

    case 'ribbon':
      body = (
        <Svg>
          <g transform="rotate(-23 540 960)">
            <rect x={-240} y={820} width={1560} height={190} fill={fill(1.1)} />
            <line x1={-240} y1={820} x2={1320} y2={820} stroke={line(0.9)} strokeWidth={2} />
            <line x1={-240} y1={1010} x2={1320} y2={1010} stroke={line(0.9)} strokeWidth={2} />
            <rect x={-240} y={1060} width={1560} height={54} fill={fill(0.6)} />
          </g>
        </Svg>
      );
      break;

    case 'banner':
      body = (
        <Svg>
          <rect x={120} y={370} width={840} height={38} rx={19} fill={line(0.9)} />
          <rect x={120} y={1450} width={840} height={38} rx={19} fill={line(0.9)} />
          <rect x={170} y={400} width={740} height={1060} fill={fill(0.3)} stroke={line(0.6)} strokeWidth={2} />
          <rect x={170} y={400} width={740} height={26} fill={fill(0.8)} />
        </Svg>
      );
      break;

    case 'bars':
      body = (
        <Svg>
          {[300, 520, 760, 620, 980].map((h, i) => (
            <rect key={i} x={180 + i * 148} y={1500 - h} width={110} height={h} fill={fill(i === 4 ? 1.5 : 0.7)} stroke={line(0.6)} strokeWidth={2} />
          ))}
          <line x1={140} y1={1500} x2={960} y2={1500} stroke={line(1.2)} strokeWidth={3} />
          <line x1={140} y1={640} x2={960} y2={640} stroke={line(0.5)} strokeWidth={2} strokeDasharray="12 10" />
        </Svg>
      );
      break;

    case 'radar':
      body = (
        <Svg>
          {[380, 260, 140].map((r, i) => (
            <polygon
              key={i}
              points={Array.from({ length: 6 })
                .map((_, k) => {
                  const a = -Math.PI / 2 + (k * Math.PI) / 3;
                  return `${540 + Math.cos(a) * r},${1000 + Math.sin(a) * r}`;
                })
                .join(' ')}
              fill="none"
              stroke={line(0.75 - i * 0.1)}
              strokeWidth={2}
            />
          ))}
          {Array.from({ length: 6 }).map((_, k) => {
            const a = -Math.PI / 2 + (k * Math.PI) / 3;
            return <line key={k} x1={540} y1={1000} x2={540 + Math.cos(a) * 380} y2={1000 + Math.sin(a) * 380} stroke={line(0.5)} strokeWidth={2} />;
          })}
          <polygon
            points={Array.from({ length: 6 })
              .map((_, k) => {
                const a = -Math.PI / 2 + (k * Math.PI) / 3;
                const r = [300, 250, 330, 200, 280, 240][k];
                return `${540 + Math.cos(a) * r},${1000 + Math.sin(a) * r}`;
              })
              .join(' ')}
            fill={fill(0.9)}
            stroke={line(1.3)}
            strokeWidth={3}
          />
        </Svg>
      );
      break;

    case 'gauge':
      body = (
        <Svg>
          <path d="M 160 1240 A 380 380 0 0 1 920 1240" fill="none" stroke={line(1.1)} strokeWidth={5} />
          <path d="M 220 1240 A 320 320 0 0 1 860 1240" fill="none" stroke={line(0.4)} strokeWidth={2} />
          {Array.from({ length: 26 }).map((_, i) => {
            const a = Math.PI - (i * Math.PI) / 25;
            const r1 = i % 5 === 0 ? 300 : 332;
            return (
              <line
                key={i}
                x1={540 + Math.cos(a) * r1}
                y1={1240 - Math.sin(a) * r1}
                x2={540 + Math.cos(a) * 380}
                y2={1240 - Math.sin(a) * 380}
                stroke={line(i % 5 === 0 ? 1.2 : 0.6)}
                strokeWidth={i % 5 === 0 ? 5 : 2}
              />
            );
          })}
          <line x1={540} y1={1240} x2={790} y2={790} stroke={line(1.6)} strokeWidth={8} strokeLinecap="round" />
          <circle cx={540} cy={1240} r={26} fill={line(1.4)} />
        </Svg>
      );
      break;

    case 'steps':
      body = (
        <Svg>
          {[
            [130, 1300, 200, 260],
            [334, 1140, 200, 420],
            [538, 980, 200, 580],
            [742, 820, 200, 740],
          ].map(([x, y, w, h], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill={fill(0.4 + i * 0.3)} stroke={line(0.7)} strokeWidth={2} />
              <rect x={x} y={y} width={w} height={14} fill={line(1.1)} />
            </g>
          ))}
          <line x1={110} y1={1560} x2={970} y2={1560} stroke={line(1)} strokeWidth={3} />
        </Svg>
      );
      break;

    case 'scoreboard':
      body = (
        <Svg>
          {[0, 1].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}-${c}`} x={150 + c * 200} y={560 + r * 240} width={170} height={200} rx={10} fill={fill(0.35)} stroke={line(0.8)} strokeWidth={3} />
            )),
          )}
          <line x1={130} y1={1060} x2={950} y2={1060} stroke={line(1.2)} strokeWidth={4} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={170} y={1120 + i * 96} width={760 - i * 60} height={16} fill={line(0.45)} />
          ))}
        </Svg>
      );
      break;

    case 'flip':
      body = (
        <Svg>
          <rect x={100} y={230} width={880} height={680} fill={fill(0.35)} stroke={line(1)} strokeWidth={3} />
          <rect x={100} y={950} width={880} height={680} fill={fill(0.22)} stroke={line(0.7)} strokeWidth={3} />
          <line x1={100} y1={930} x2={980} y2={930} stroke={line(1.5)} strokeWidth={6} />
          <path d="M 100 950 L 980 950 L 980 1230 Z" fill={fill(0.9)} />
          <rect x={170} y={360} width={430} height={18} fill={line(0.6)} />
          <rect x={170} y={420} width={620} height={14} fill={line(0.4)} />
        </Svg>
      );
      break;

    case 'docket':
      body = (
        <Svg>
          <path
            d={`M 250 380 L 830 380 L 830 1500 ${Array.from({ length: 16 })
              .map((_, i) => `L ${830 - (i + 1) * 36.25} ${i % 2 === 0 ? 1530 : 1500}`)
              .join(' ')} Z`}
            fill={fill(0.45)}
            stroke={line(0.9)}
            strokeWidth={3}
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={300} y1={520 + i * 130} x2={780} y2={520 + i * 130} stroke={line(0.55)} strokeWidth={2} strokeDasharray="10 10" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <rect key={i} x={330 + i * 9} y={1330} width={i % 3 === 0 ? 3 : 5} height={70} fill={line(0.9)} />
          ))}
        </Svg>
      );
      break;

    case 'envelope':
      body = (
        <Svg>
          <rect x={120} y={620} width={840} height={680} rx={10} fill={fill(0.3)} stroke={line(1)} strokeWidth={3} />
          <path d="M 120 620 L 540 990 L 960 620" fill="none" stroke={line(1.1)} strokeWidth={4} />
          <path d="M 120 1300 L 470 980" fill="none" stroke={line(0.6)} strokeWidth={3} />
          <path d="M 960 1300 L 610 980" fill="none" stroke={line(0.6)} strokeWidth={3} />
          <circle cx={540} cy={1000} r={46} fill={rgba(s.a2, 0.35)} stroke={line(1)} strokeWidth={3} />
        </Svg>
      );
      break;

    case 'flag':
      body = (
        <Svg>
          <line x1={178} y1={360} x2={178} y2={1580} stroke={line(1.3)} strokeWidth={12} strokeLinecap="round" />
          <path
            d={`M 210 470 ${Array.from({ length: 30 })
              .map((_, i) => {
                const x = 210 + i * 26;
                return `L ${x} ${470 + Math.sin(i / 3) * 26}`;
              })
              .join(' ')} ${Array.from({ length: 30 })
              .map((_, i) => {
                const x = 990 - i * 26;
                return `L ${x} ${900 + Math.sin(i / 3) * 26}`;
              })
              .join(' ')} Z`}
            fill={fill(1.2)}
            stroke={line(0.9)}
            strokeWidth={3}
          />
        </Svg>
      );
      break;

    case 'arch':
      body = (
        <Svg>
          <path d="M 200 1560 L 200 900 A 340 340 0 0 1 880 900 L 880 1560" fill="none" stroke={line(1.2)} strokeWidth={6} />
          <path d="M 236 1560 L 236 900 A 304 304 0 0 1 844 900 L 844 1560" fill="none" stroke={line(0.5)} strokeWidth={2} />
          {[110, 900].map((x, i) => (
            <g key={i}>
              <rect x={x} y={1080} width={70} height={480} fill={fill(0.4)} stroke={line(0.6)} strokeWidth={2} />
              <rect x={x - 12} y={1060} width={94} height={22} fill={line(0.9)} />
              <rect x={x - 14} y={1544} width={98} height={24} fill={line(0.9)} />
            </g>
          ))}
          <rect x={90} y={330} width={900} height={120} fill={fill(0.5)} stroke={line(1)} strokeWidth={3} />
        </Svg>
      );
      break;

    case 'lantern':
      body = (
        <Svg>
          {[
            [300, 640],
            [540, 830],
            [780, 640],
          ].map(([x, y], i) => (
            <g key={i}>
              <line x1={x} y1={150} x2={x} y2={y - 120} stroke={line(0.7)} strokeWidth={3} />
              <ellipse cx={x} cy={y} rx={102} ry={120} fill={fill(0.8)} stroke={line(1)} strokeWidth={3} />
              <rect x={x - 60} y={y - 132} width={120} height={18} fill={line(1)} />
              <rect x={x - 60} y={y + 116} width={120} height={18} fill={line(1)} />
              {[0, 1, 2].map((k) => (
                <line key={k} x1={x - 40 + k * 40} y1={y + 134} x2={x - 40 + k * 40} y2={y + 210} stroke={line(0.8)} strokeWidth={3} />
              ))}
            </g>
          ))}
        </Svg>
      );
      break;

    case 'fan':
      body = (
        <Svg>
          {Array.from({ length: 9 }).map((_, i) => {
            const a = -Math.PI / 2 - (52 * Math.PI) / 180 + ((104 * Math.PI) / 180 / 8) * i;
            return <line key={i} x1={540} y1={1620} x2={540 + Math.cos(a) * 1120} y2={1620 + Math.sin(a) * 1120} stroke={line(0.75)} strokeWidth={4} />;
          })}
          <path d="M 60 700 A 1120 1120 0 0 1 1020 700" fill="none" stroke={line(0.55)} strokeWidth={3} />
          <circle cx={540} cy={1620} r={40} fill={line(1.2)} />
        </Svg>
      );
      break;

    case 'ink':
      body = (
        <Svg>
          {[
            { y: 700, h: 150, o: 1 },
            { y: 900, h: 44, o: 0.5 },
            { y: 1020, h: 26, o: 0.4 },
          ].map((b, i) => (
            <path
              key={i}
              d={`M -60 ${b.y} C 260 ${b.y - 60}, 620 ${b.y + 70}, 1140 ${b.y - 10} L 1140 ${b.y + b.h} C 700 ${b.y + b.h + 60}, 300 ${b.y + b.h - 50}, -60 ${b.y + b.h} Z`}
              fill={line(b.o)}
            />
          ))}
        </Svg>
      );
      break;

    case 'mosaic':
      body = (
        <Svg>
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 7 }).map((_, c) => {
              const d = Math.max(Math.abs(r - 2.5), Math.abs(c - 3));
              return (
                <rect
                  key={`${r}-${c}`}
                  x={120 + c * 120}
                  y={620 + r * 120}
                  width={112}
                  height={112}
                  fill={fill(d < 1.6 ? 1.4 : d < 2.6 ? 0.5 : 0.18)}
                />
              );
            }),
          )}
        </Svg>
      );
      break;

    case 'glitch':
      body = (
        <Svg>
          {[560, 700, 840, 980, 1120].map((y, i) => (
            <rect key={i} x={i % 2 === 0 ? 60 : 160} y={y} width={920} height={54} fill={fill(i % 2 === 0 ? 0.9 : 0.4)} />
          ))}
          {Array.from({ length: 26 }).map((_, i) => (
            <rect
              key={i}
              x={((i * 397) % 900) + ((i * 61) % 40)}
              y={520 + i * 34}
              width={40 + ((i * 173) % 260)}
              height={3}
              fill={line(0.5)}
            />
          ))}
        </Svg>
      );
      break;

    case 'neon':
      body = (
        <Svg>
          <rect x={70} y={330} width={940} height={1230} rx={26} fill="none" stroke={line(1.3)} strokeWidth={10} />
          <rect x={108} y={368} width={864} height={1154} rx={18} fill="none" stroke={line(0.55)} strokeWidth={3} />
          <path d="M 108 620 L 240 620 Q 290 620 290 570 L 290 470" fill="none" stroke={line(1)} strokeWidth={6} />
        </Svg>
      );
      break;

    case 'spotlight':
      body = (
        <Svg>
          <path d="M 470 200 L 610 200 L 980 1460 L 100 1460 Z" fill={fill(1.1)} />
          <ellipse cx={540} cy={1470} rx={440} ry={70} fill={fill(0.7)} />
          <rect x={470} y={160} width={140} height={44} rx={10} fill={line(1.1)} />
        </Svg>
      );
      break;

    case 'curtain':
      body = (
        <Svg>
          {[0, 1].map((side) => (
            <g key={side}>
              <rect x={side === 0 ? 0 : 880} y={200} width={200} height={1420} fill={fill(1.1)} />
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1={(side === 0 ? 0 : 880) + 20 + i * 40}
                  y1={200}
                  x2={(side === 0 ? 0 : 880) + 20 + i * 40}
                  y2={1620}
                  stroke={line(0.5)}
                  strokeWidth={3}
                />
              ))}
            </g>
          ))}
          <rect x={0} y={150} width={W} height={70} fill={fill(1.2)} />
          <line x1={0} y1={1620} x2={W} y2={1620} stroke={line(0.9)} strokeWidth={4} />
        </Svg>
      );
      break;

    case 'split':
      body = (
        <Svg>
          <rect x={0} y={0} width={W} height={960} fill={fill(0.35)} />
          <rect x={0} y={960} width={W} height={960} fill={fill(0.7)} />
          <line x1={0} y1={960} x2={W} y2={960} stroke={line(1.4)} strokeWidth={6} />
          <line x1={0} y1={1400} x2={W} y2={1400} stroke={line(0.5)} strokeWidth={2} strokeDasharray="16 12" />
        </Svg>
      );
      break;

    case 'mirror':
      body = (
        <Svg>
          <rect x={150} y={520} width={780} height={440} rx={8} fill={fill(0.5)} />
          <rect x={150} y={980} width={780} height={440} rx={8} fill={fill(0.22)} />
          <line x1={40} y1={970} x2={1040} y2={970} stroke={line(1.3)} strokeWidth={3} />
          <line x1={40} y1={990} x2={1040} y2={990} stroke={line(0.5)} strokeWidth={2} />
        </Svg>
      );
      break;

    case 'stack':
      body = (
        <Svg>
          {[2, 1, 0].map((k) => (
            <rect
              key={k}
              x={200 + k * 56}
              y={520 - k * 34}
              width={640}
              height={600}
              rx={22}
              fill={fill(0.28 + k * 0.22)}
              stroke={line(0.55 + k * 0.25)}
              strokeWidth={3}
              transform={`rotate(${-3 + k * 1.6} 540 820)`}
            />
          ))}
        </Svg>
      );
      break;

    case 'carousel':
      body = (
        <Svg>
          {[0, 1, 2, 3].map((i) => {
            const center = i === 2;
            const w = center ? 300 : 210;
            const x = 40 + i * 250 + (center ? -20 : 0);
            return <rect key={i} x={x} y={center ? 640 : 700} width={w} height={center ? 620 : 500} rx={18} fill={fill(center ? 1.2 : 0.35)} stroke={line(center ? 1.1 : 0.4)} strokeWidth={3} />;
          })}
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={480 + i * 32} cy={1360} r={7} fill={line(i === 2 ? 1.4 : 0.5)} />
          ))}
        </Svg>
      );
      break;

    case 'magnifier':
      body = (
        <Svg>
          <circle cx={480} cy={860} r={300} fill={fill(0.35)} stroke={line(1.3)} strokeWidth={10} />
          <circle cx={480} cy={860} r={268} fill="none" stroke={line(0.5)} strokeWidth={3} />
          <line x1={700} y1={1090} x2={900} y2={1330} stroke={line(1.3)} strokeWidth={34} strokeLinecap="round" />
        </Svg>
      );
      break;

    case 'wall':
      body = (
        <Svg>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => {
              const main = r === 1 && c === 1;
              const w = main ? 300 : 220;
              const h = main ? 380 : 280;
              const x = 540 - w / 2 + (c - 1) * 320;
              const y = 900 - h / 2 + (r - 1) * 330;
              return (
                <g key={`${r}-${c}`}>
                  <line x1={x + w / 2} y1={y - 70} x2={x + w / 2} y2={y} stroke={line(0.4)} strokeWidth={2} />
                  <rect x={x} y={y} width={w} height={h} fill={fill(main ? 1.1 : 0.35)} stroke={line(main ? 1.2 : 0.45)} strokeWidth={main ? 5 : 3} />
                </g>
              );
            }),
          )}
        </Svg>
      );
      break;

    case 'plaque':
      body = (
        <Svg>
          <rect x={180} y={700} width={720} height={520} rx={16} fill={fill(0.9)} stroke={line(1.2)} strokeWidth={6} />
          <rect x={214} y={734} width={652} height={452} rx={10} fill="none" stroke={line(0.55)} strokeWidth={2} />
          {[
            [214, 734],
            [866, 734],
            [214, 1186],
            [866, 1186],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={16} fill={line(1.1)} />
          ))}
        </Svg>
      );
      break;

    case 'trophy':
      body = (
        <Svg>
          <path d="M 330 480 L 750 480 L 750 760 Q 750 940 540 940 Q 330 940 330 760 Z" fill={fill(1.1)} stroke={line(1.1)} strokeWidth={5} />
          <path d="M 330 540 Q 200 540 200 660 Q 200 780 330 780" fill="none" stroke={line(1)} strokeWidth={12} />
          <path d="M 750 540 Q 880 540 880 660 Q 880 780 750 780" fill="none" stroke={line(1)} strokeWidth={12} />
          <rect x={500} y={930} width={80} height={150} fill={line(0.8)} />
          <rect x={380} y={1070} width={320} height={30} rx={8} fill={line(1.1)} />
          <rect x={310} y={1100} width={460} height={140} rx={10} fill={fill(0.6)} stroke={line(0.8)} strokeWidth={3} />
        </Svg>
      );
      break;

    case 'laurel':
      body = (
        <Svg>
          {[-1, 1].map((dir) => (
            <g key={dir}>
              {Array.from({ length: 9 }).map((_, i) => {
                const a = (-70 + i * 17) * (Math.PI / 180);
                const r = 420;
                const cx = 540 + dir * Math.cos(a) * r;
                const cy = 1000 - Math.sin(a) * r;
                return <ellipse key={i} cx={cx} cy={cy} rx={62} ry={26} fill={fill(0.9)} stroke={line(0.6)} strokeWidth={2} transform={`rotate(${dir * (i * 17 - 10)} ${cx} ${cy})`} />;
              })}
            </g>
          ))}
        </Svg>
      );
      break;

    case 'crystal':
      body = (
        <Svg>
          <polygon points="540,380 760,760 320,760" fill={fill(0.7)} stroke={line(0.9)} strokeWidth={3} />
          <polygon points="320,780 760,780 860,1180 220,1180" fill={fill(1.1)} stroke={line(1.2)} strokeWidth={4} />
          <polygon points="300,1200 780,1200 540,1520" fill={fill(0.6)} stroke={line(0.9)} strokeWidth={3} />
          <line x1={540} y1={380} x2={540} y2={1520} stroke={line(0.5)} strokeWidth={2} />
        </Svg>
      );
      break;

    case 'prism':
      body = (
        <Svg>
          <polygon points="470,600 700,1140 240,1140" fill={fill(0.8)} stroke={line(1.2)} strokeWidth={5} />
          {/* 入射白光 */}
          <line x1={-20} y1={880} x2={430} y2={898} stroke={line(1.3)} strokeWidth={7} />
          {/* 出射光谱：从右侧棱面往外扇开，全部落在画布内 */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={560} y1={900} x2={1060} y2={560 + i * 140} stroke={line(0.55 + i * 0.08)} strokeWidth={6} />
          ))}
        </Svg>
      );
      break;

    case 'clock':
      body = (
        <Svg>
          <circle cx={540} cy={1000} r={340} fill="none" stroke={line(1.1)} strokeWidth={5} />
          <circle cx={540} cy={1000} r={300} fill="none" stroke={line(0.35)} strokeWidth={2} />
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i * Math.PI) / 30;
            const r1 = i % 5 === 0 ? 262 : 286;
            return (
              <line key={i} x1={540 + Math.sin(a) * r1} y1={1000 - Math.cos(a) * r1} x2={540 + Math.sin(a) * 300} y2={1000 - Math.cos(a) * 300} stroke={line(i % 5 === 0 ? 1.1 : 0.45)} strokeWidth={i % 5 === 0 ? 6 : 2} />
            );
          })}
          <line x1={540} y1={1000} x2={540} y2={770} stroke={line(1.3)} strokeWidth={9} strokeLinecap="round" />
          <line x1={540} y1={1000} x2={720} y2={1090} stroke={line(1.3)} strokeWidth={6} strokeLinecap="round" />
          <circle cx={540} cy={1000} r={18} fill={line(1.4)} />
        </Svg>
      );
      break;

    case 'hourglass':
      body = (
        <Svg>
          <polygon points="300,560 780,560 560,960 520,960" fill={fill(0.9)} stroke={line(1.1)} strokeWidth={4} />
          <polygon points="520,960 560,960 780,1360 300,1360" fill={fill(0.55)} stroke={line(1.1)} strokeWidth={4} />
          <rect x={270} y={520} width={540} height={28} rx={8} fill={line(1.2)} />
          <rect x={270} y={1372} width={540} height={28} rx={8} fill={line(1.2)} />
          <line x1={540} y1={960} x2={540} y2={1170} stroke={line(1.1)} strokeWidth={4} />
        </Svg>
      );
      break;

    case 'compass':
      body = (
        <Svg>
          <circle cx={540} cy={1000} r={350} fill="none" stroke={line(1.1)} strokeWidth={5} />
          <circle cx={540} cy={1000} r={296} fill="none" stroke={line(0.4)} strokeWidth={2} />
          {Array.from({ length: 36 }).map((_, i) => {
            const a = (i * Math.PI) / 18;
            const r1 = i % 9 === 0 ? 264 : 282;
            return <line key={i} x1={540 + Math.sin(a) * r1} y1={1000 - Math.cos(a) * r1} x2={540 + Math.sin(a) * 296} y2={1000 - Math.cos(a) * 296} stroke={line(i % 9 === 0 ? 1.2 : 0.45)} strokeWidth={i % 9 === 0 ? 6 : 2} />;
          })}
          <polygon points="540,700 580,1000 540,1180 500,1000" fill={line(1.2)} />
          <circle cx={540} cy={1000} r={20} fill={line(1.5)} />
        </Svg>
      );
      break;

    case 'map':
      body = (
        <Svg>
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`v${i}`} x1={80 + i * 150} y1={380} x2={80 + i * 150} y2={1520} stroke={line(0.18)} strokeWidth={1.5} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1={80} y1={380 + i * 163} x2={1020} y2={380 + i * 163} stroke={line(0.18)} strokeWidth={1.5} />
          ))}
          <path d="M 180 1380 C 340 1200, 300 1000, 470 940 S 700 860, 760 640 L 860 480" fill="none" stroke={line(1.2)} strokeWidth={6} strokeDasharray="24 16" />
          {[
            [180, 1380],
            [470, 940],
            [860, 480],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={26} fill={fill(1.6)} stroke={line(1.2)} strokeWidth={3} />
              <path d={`M ${x - 26} ${y} L ${x} ${y + 54} L ${x + 26} ${y}`} fill={line(1)} />
            </g>
          ))}
        </Svg>
      );
      break;

    default:
      body = null;
  }

  if (!body) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: s.mode === 'dark' ? 0.34 : 0.3,
        transform: arr ? 'scaleX(-1)' : undefined,
      }}
    >
      {body}
      {/* 底纹整体压暗/压亮一层，保证中段数字永远压得住 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, transparent 0%, ${rgba(s.pg, 0.55)} 34%, ${rgba(
            s.pg,
            0.55,
          )} 74%, transparent 100%)`,
        }}
      />
    </div>
  );
};
