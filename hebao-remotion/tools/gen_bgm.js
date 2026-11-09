/* 纯代码合成贺报 BGM（无采样、无 API）—— 参考 lemo-opuscar 的本地合成路线
 * 结构（8.03s，D 大调五声）：
 *   0.0-1.6  印章启幕：软垫 + 稀疏拨弦
 *   1.3-4.1  恭贺/滚数：五声上行琶音
 *   3.3-4.16 滚数冲刺：噪声渐强 + 上扫
 *   4.16     数字落定：钟声 D6 + 低频冲击 + 闪光噪声
 *   4.3-6.2  人像章：完整琶音 + 垫
 *   6.3-8.0  定版：稀疏拨弦收束 + 长钟尾
 * 输出：public/assets/honor_bgm.wav（44.1kHz / 16bit / 双声道）
 */
const fs = require('fs');
const path = require('path');

const SR = 44100;
const DUR = 8.034;
const N = Math.floor(SR * DUR);
const L = new Float64Array(N);
const R = new Float64Array(N);

const rng = (() => {
  let s = 20261103;
  return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff), s / 0x7fffffff);
})();

/** 音符：t0 秒起，频率 f，时长 dur，音量 gain，声位 pan(-1..1)
 *  partials: [倍频, 相对幅度][]；decay: 包络速率；attack: 起音秒数 */
function tone(t0, f, dur, gain, pan, partials, decay, attack = 0.006) {
  const s = Math.floor(t0 * SR);
  const e = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    let env = Math.exp(-decay * t);
    if (t < attack) env *= t / attack;
    let v = 0;
    for (let k = 0; k < partials.length; k++) {
      v += Math.sin(2 * Math.PI * f * partials[k][0] * t) * partials[k][1];
    }
    v *= env;
    L[i] += v * gl;
    R[i] += v * gr;
  }
}

/** 噪声爆发：t0 起，时长 dur，包络速率 decay（正值=衰减），可选渐强 rise 秒 */
function noise(t0, dur, gain, decay, pan = 0, rise = 0) {
  const s = Math.floor(t0 * SR);
  const e = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  let last = 0;
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    let env;
    if (rise > 0) {
      const u = Math.min(1, t / rise);
      env = u * u * Math.exp(-Math.max(0, t - rise) * decay);
    } else {
      env = Math.exp(-decay * t);
    }
    const w = rng() * 2 - 1;
    last = last * 0.72 + w * 0.28; // 轻度低通，去沙哑
    const v = last * gain * env * 3;
    L[i] += v * gl;
    R[i] += v * gr;
  }
}

/** 正弦上扫 */
function sweep(t0, dur, f0, f1, gain) {
  const s = Math.floor(t0 * SR);
  const e = Math.min(N, Math.floor((t0 + dur) * SR));
  let ph = 0;
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    const u = t / dur;
    ph += (2 * Math.PI * (f0 + (f1 - f0) * u * u)) / SR;
    const env = Math.sin(u * Math.PI) * gain;
    const v = Math.sin(ph) * env;
    L[i] += v * 0.7;
    R[i] += v * 0.7;
  }
}

/* 音高表（Hz） */
const P = {
  G2: 98.0, A2: 110.0, B2: 123.47, D3: 146.83, E3: 164.81, G3: 196.0, A3: 220.0,
  B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, Fs4: 369.99, G4: 392.0, A4: 440.0,
  B4: 493.88, D5: 587.33, E5: 659.26, Fs5: 739.99, A5: 880.0, D6: 1174.66,
};

const PLUCK = [[1, 1], [2, 0.38], [3, 0.18], [4, 0.08]];
const BELL = [[1, 1], [2.71, 0.4], [5.15, 0.18]];
const PAD = [[1, 1], [2, 0.22], [3, 0.05]];

/* ── 垫底和声：D → Bm → G → A，每 2s 一换 ── */
const CHORDS = [
  [0.0, [P.D3, P.A3, P.D4, P.Fs4]],
  [2.0, [P.B2, P.D4, P.Fs4, P.B3]],
  [4.0, [P.G2, P.D4, P.G3, P.B3]],
  [6.0, [P.A2, P.E3, P.A3, P.C4]],
];
for (const [t, notes] of CHORDS) {
  notes.forEach((f, i) =>
    tone(t, f * (1 + (i % 2 ? 0.0012 : -0.0012)), 2.35, 0.045, (i - 1.5) * 0.4, PAD, 0.35, 0.5)
  );
}

/* ── 0.0-1.6 印章启幕：稀疏拨弦 ── */
[[0.12, P.D4, -0.4], [0.55, P.A4, 0.4], [0.92, P.Fs4, -0.2], [1.18, P.D5, 0.25]].forEach(
  ([t, f, p]) => tone(t, f, 1.4, 0.1, p, PLUCK, 4.5)
);

/* ── 1.3-4.1 滚数段：五声上行琶音（八分音符，整体爬升） ── */
const ARP1 = [P.D4, P.E4, P.Fs4, P.A4, P.B4, P.A4, P.D5, P.E5, P.Fs5, P.E5, P.A4, P.D5];
for (let i = 0; i < ARP1.length; i++) {
  const t = 1.28 + i * 0.26;
  if (t > 4.0) break;
  tone(t, ARP1[i], 0.9, 0.085 + i * 0.004, i % 2 ? 0.35 : -0.35, PLUCK, 5.5);
}

/* ── 3.3-4.16 冲刺：噪声渐强 + 上扫 ── */
noise(3.3, 0.9, 0.055, 0, 0, 0.86);
sweep(3.3, 0.86, 180, 760, 0.05);

/* ── 4.16 落定：钟声 + 低频冲击 + 闪光 ── */
tone(4.16, P.D6, 2.8, 0.3, 0.15, BELL, 1.5);
tone(4.16, P.A5, 2.4, 0.16, -0.2, BELL, 1.7);
tone(4.16, 92, 0.5, 0.42, 0, [[1, 1]], 7);
noise(4.16, 0.5, 0.1, 9, 0.1);

/* ── 章节切换 whoosh：高频噪声下扫，商业片「换口气」的对位声 ── */
function whoosh(t, pan) {
  noise(t, 0.42, 0.075, 0, pan, 0.26);
  sweep(t, 0.4, 1400, 320, 0.045);
}
whoosh(1.22, -0.5); // 印章→恭贺
whoosh(2.78, 0.5); // 恭贺→滚数
whoosh(4.34, -0.4); // 滚数→人像
whoosh(6.16, 0.4); // 人像→定版

/* ── 数据点入 tick：三项/胶囊亮相的轻点击 ── */
[[2.26, -0.3], [3.36, -0.4], [3.46, 0], [3.56, 0.4]].forEach(([t, p]) =>
  tone(t, 1980, 0.09, 0.05, p, [[1, 1], [2.7, 0.3]], 26)
);

/* ── 4.3-6.2 人像章：完整琶音 + 和声垫高音 ── */
const ARP2 = [P.D5, P.Fs5, P.A5, P.Fs5, P.E5, P.D5, P.B4, P.D5];
for (let i = 0; i < ARP2.length; i++) {
  const t = 4.32 + i * 0.24;
  tone(t, ARP2[i], 1.1, 0.11, i % 2 ? 0.4 : -0.4, PLUCK, 4.5);
}
tone(4.7, P.D5, 1.6, 0.07, 0.1, PAD, 0.8, 0.3);

/* ── 6.3-8.0 定版：收束拨弦 + 长钟尾 ── */
[[6.34, P.D4, -0.3], [6.6, P.Fs4, 0.3], [6.86, P.A4, -0.2], [7.12, P.D5, 0.2]].forEach(
  ([t, f, p]) => tone(t, f, 1.6, 0.09, p, PLUCK, 3.6)
);
tone(7.12, P.D6, 1.0, 0.12, 0, BELL, 2.4);

/* ── 混音：软限幅 + 写 WAV ── */
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write('WAVE', 8);
buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const cl = Math.tanh(L[i] * 1.1) * 0.92;
  const cr = Math.tanh(R[i] * 1.1) * 0.92;
  buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(cl * 32767))), 44 + i * 4);
  buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(cr * 32767))), 46 + i * 4);
}
const out = path.join(__dirname, '..', 'public', 'assets', 'honor_bgm.wav');
fs.writeFileSync(out, buf);
console.log('written:', out, (buf.length / 1024).toFixed(0) + 'KB');
