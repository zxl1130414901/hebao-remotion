/* 分类底乐合成器（纯代码、无采样、无版权风险）
 * 与 gen_bgm.js 的区别：这里是「不带事件音效的音乐床」，
 * 可以被任意模板共用 —— 事件音效（钟声/冲击/whoosh）留给各模板自己设计。
 *
 * 输出三条 8.03s 音轨：
 *   bed_ceremony.wav  仪式/荣誉/历程：暖垫 + 五声拨弦 + 长钟收束
 *   bed_data.wav      数据/巨字/招募：脉冲低音 + 节拍 tick + 高区琶音
 *   bed_creative.wav  创意场景/风格：马林巴律动 + 沙锤 + 亮铃
 */
const fs = require('fs');
const path = require('path');

const SR = 44100;
const DUR = 8.034;
const N = Math.floor(SR * DUR);
let L, R, rng;

const reset = (seed) => {
  L = new Float64Array(N);
  R = new Float64Array(N);
  let s = seed;
  rng = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff), s / 0x7fffffff);
};

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
    for (let k = 0; k < partials.length; k++) v += Math.sin(2 * Math.PI * f * partials[k][0] * t) * partials[k][1];
    v *= env;
    L[i] += v * gl;
    R[i] += v * gr;
  }
}

function swell(t0, f, dur, gain, pan, partials, attack, release) {
  const s = Math.floor(t0 * SR);
  const e = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    let env = 1;
    if (t < attack) env = t / attack;
    if (t > dur - release) env *= Math.max(0, (dur - t) / release);
    let v = 0;
    for (let k = 0; k < partials.length; k++) v += Math.sin(2 * Math.PI * f * partials[k][0] * t) * partials[k][1];
    v *= env;
    L[i] += v * gl;
    R[i] += v * gr;
  }
}

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
    } else env = Math.exp(-decay * t);
    const w = rng() * 2 - 1;
    last = last * 0.72 + w * 0.28;
    const v = last * gain * env * 3;
    L[i] += v * gl;
    R[i] += v * gr;
  }
}

const P = {
  D2: 73.42, A2: 110.0, B2: 123.47, D3: 146.83, E3: 164.81, Fs3: 185.0, G3: 196.0, A3: 220.0,
  B3: 246.94, Cs4: 277.18, D4: 293.66, E4: 329.63, Fs4: 369.99, G4: 392.0, A4: 440.0,
  B4: 493.88, Cs5: 554.37, D5: 587.33, E5: 659.26, Fs5: 739.99, A5: 880.0, B5: 987.77,
  D6: 1174.66, E6: 1318.51, Fs6: 1479.98, A6: 1760.0,
};

const PAD = [[1, 1], [2, 0.32], [3, 0.14], [4, 0.06]];
const PLUCK = [[1, 1], [2, 0.42], [3, 0.16], [4, 0.07]];
const BELL = [[1, 1], [2.01, 0.5], [3.02, 0.26], [4.2, 0.12], [5.4, 0.06]];
const MARIMBA = [[1, 1], [4.02, 0.34], [6.5, 0.1]];
const BASS = [[1, 1], [2, 0.2]];

/* ───────────────────────── A · 仪式（暖） ───────────────────────── */
const ceremony = () => {
  reset(7001);
  // 底垫：D 大三和弦缓慢呼吸
  swell(0.0, P.D3, 4.4, 0.1, -0.2, PAD, 1.2, 1.4);
  swell(0.0, P.A3, 4.4, 0.075, 0.25, PAD, 1.5, 1.4);
  swell(0.0, P.Fs4, 4.4, 0.05, 0.1, PAD, 1.8, 1.4);
  swell(3.6, P.B3, 4.4, 0.07, -0.3, PAD, 1.2, 1.6);
  swell(3.6, P.D4, 4.4, 0.06, 0.3, PAD, 1.4, 1.6);
  // 五声拨弦（D E Fs A B）
  const scale = [P.D4, P.E4, P.Fs4, P.A4, P.B4, P.D5, P.Fs5];
  const pattern = [0, 2, 4, 2, 5, 4, 2, 0, 1, 3, 5, 3, 6, 5, 3, 1];
  for (let i = 0; i < 32; i++) {
    const t0 = 0.34 + i * 0.24;
    if (t0 > 7.4) break;
    const f = scale[pattern[i % pattern.length]];
    const g = 0.075 * (0.7 + 0.3 * Math.sin(i * 0.6)) * (t0 > 4.2 ? 1.15 : 1);
    tone(t0, f, 1.1, g, Math.sin(i * 1.7) * 0.55, PLUCK, 3.4);
  }
  // 4.16 柔钟（不抢戏）
  tone(4.16, P.D5, 3.0, 0.12, 0, BELL, 1.5);
  tone(4.16, P.A5, 2.4, 0.06, 0.2, BELL, 1.8);
  // 定版：长钟 + 高区泛音
  tone(6.55, P.D5, 1.5, 0.09, 0, BELL, 1.9);
  tone(6.62, P.Fs6, 1.2, 0.035, 0.35, [[1, 1], [2, 0.3]], 3.2);
  noise(0.0, 0.9, 0.012, 2.4, 0, 0.9); // 起手空气感
};

/* ───────────────────────── B · 数据（克制） ───────────────────────── */
const data = () => {
  reset(7002);
  // 脉冲低音：每 0.4s 一次，4.16 后加密
  for (let i = 0; i < 20; i++) {
    const t0 = 0.2 + i * 0.4;
    if (t0 > 7.6) break;
    tone(t0, i > 9 ? P.D2 * 2 : P.D2, 0.26, 0.16, 0, BASS, 10);
  }
  // tick：细碎节拍（像数据点入）
  for (let i = 0; i < 32; i++) {
    const t0 = 0.4 + i * 0.25;
    if (t0 > 7.5) break;
    noise(t0, 0.05, 0.035, 70, i % 2 ? 0.45 : -0.45);
  }
  // 高区琶音：D Fs A Cs（大七，理性明亮）
  const scale = [P.D5, P.Fs5, P.A5, P.Cs5];
  for (let i = 0; i < 16; i++) {
    const t0 = 0.6 + i * 0.47;
    if (t0 > 7.3) break;
    tone(t0, scale[i % 4], 0.9, 0.05, Math.sin(i * 2.1) * 0.6, PLUCK, 5.5);
  }
  // 上扫 + 轻击
  for (let i = 0; i < 60; i++) {
    const u = i / 60;
    noise(3.5 + u * 0.6, 0.1, 0.012 + u * 0.02, 30, -0.3 + u * 0.6);
  }
  tone(4.16, P.D5, 1.8, 0.1, 0, BELL, 2.6);
  tone(4.16, P.Fs5, 1.4, 0.06, 0.25, BELL, 3.0);
  // 收束和弦
  [P.D4, P.Fs4, P.A4].forEach((f, i) => swell(6.5, f, 1.5, 0.05, -0.3 + i * 0.3, PAD, 0.35, 0.7));
};

/* ───────────────────────── C · 创意（俏皮） ───────────────────────── */
const creative = () => {
  reset(7003);
  // 马林巴 16 分律动（D 五声）
  const mel = [P.D5, P.Fs5, P.A5, P.Fs5, P.B5, P.A5, P.Fs5, P.D5];
  for (let i = 0; i < 46; i++) {
    const t0 = 0.18 + i * 0.165;
    if (t0 > 7.6) break;
    const f = mel[i % mel.length] * (i > 23 && i % 8 >= 4 ? 0.5 : 1);
    tone(t0, f, 0.42, 0.062, Math.sin(i * 1.3) * 0.5, MARIMBA, 9);
  }
  // 沙锤
  for (let i = 0; i < 30; i++) {
    const t0 = 0.3 + i * 0.25;
    if (t0 > 7.5) break;
    noise(t0, 0.08, i % 2 ? 0.03 : 0.018, 45, 0.35);
  }
  // 低音拨弦
  for (let i = 0; i < 8; i++) {
    tone(0.18 + i * 0.99, i % 2 ? P.D3 : P.D2, 0.7, 0.13, 0, BASS, 4.2);
  }
  // 亮铃点缀
  tone(1.98, P.A6, 0.9, 0.028, -0.5, BELL, 5);
  tone(4.16, P.D6, 1.9, 0.1, 0, BELL, 2.0);
  tone(4.16, P.A6, 1.3, 0.05, 0.4, BELL, 3.4);
  tone(6.6, P.Fs6, 1.3, 0.06, -0.2, BELL, 2.6);
};

const writeWav = (name, l, r) => {
  // 峰值归一 + 软限幅
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(l[i]), Math.abs(r[i]));
  const g = peak > 0 ? 0.78 / peak : 1;
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
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(l[i] * g * 32767))), 44 + i * 4);
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(r[i] * g * 32767))), 46 + i * 4);
  }
  const out = path.join(__dirname, '..', 'public', 'assets', name);
  fs.writeFileSync(out, buf);
  console.log('wrote', name, (buf.length / 1024 / 1024).toFixed(2) + 'MB');
};

ceremony();
writeWav('bed_ceremony.wav', L, R);
data();
writeWav('bed_data.wav', L, R);
creative();
writeWav('bed_creative.wav', L, R);
