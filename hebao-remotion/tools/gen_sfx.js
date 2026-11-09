/* 仪式感音效合成器（纯代码、无采样、无版权风险）
 * 与 gen_beds.js 同一合成风格 —— 音色世界与分类底乐（管弦仪式感）一致。
 *   sfx_stamp.wav   0.38s  印章落纸：深鼓闷响 + 纸面脆响（高频短噪声）
 *   sfx_gong.wav    1.30s  大锣：非谐分音长衰减，巨字砸落/阵营撞入
 *   sfx_chime.wav   0.62s  铃簇：三音上行（徽章解锁/火焰点燃）
 *   sfx_pop.wav     0.10s  气泡 pop：正弦上滑（微信气泡弹出）
 *   sfx_whoosh.wav  0.45s  转场风：柔和噪声扫频（弱声像，只做衬底）
 *   sfx_shimmer.wav 1.40s  定版扫光收束：高区铃簇 + 微光噪声
 */
const fs = require('fs');
const path = require('path');

const SR = 48000;

function makeBuf(dur) {
  const N = Math.floor(SR * dur);
  return { N, L: new Float64Array(N), R: new Float64Array(N) };
}

let rngS = 12345;
const rng = () => ((rngS = (rngS * 1103515245 + 12345) & 0x7fffffff), rngS / 0x7fffffff);

/* 印章落纸：正弦俯冲 150→50Hz（鼓体）+ 6ms 低频撞击 + 30ms 纸面脆响 */
const stamp = () => {
  const DUR = 0.38;
  const { N, L, R } = makeBuf(DUR);
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const f = 50 + 100 * Math.exp(-t * 22);
    phase += (2 * Math.PI * f) / SR;
    const env = Math.exp(-t * 13) * (t < 0.003 ? t / 0.003 : 1);
    const body = Math.sin(phase) * env * 0.85;
    const sub = Math.sin(2 * Math.PI * 48 * t) * Math.exp(-t * 9) * 0.28;
    const s = body + sub;
    L[i] = s; R[i] = s;
    // 撞击瞬态 6ms
    if (t < 0.006) {
      const w = (rng() * 2 - 1) * Math.exp(-t * 500) * 0.42;
      L[i] += w; R[i] += w * 0.9;
    }
    // 纸面脆响 30ms：带通感（噪声×快速衰减×高通近似）
    if (t >= 0.004 && t < 0.034) {
      const u = (t - 0.004) / 0.03;
      const w = (rng() * 2 - 1) * Math.exp(-u * 6) * 0.16;
      const prev = i > 1 ? L[i - 1] : 0;
      const hp = w - prev * 0.5; // 简单一阶高通提亮
      L[i] += hp; R[i] += hp * 0.92;
    }
  }
  return { L, R, N };
};

/* 大锣：非谐分音 f0=170Hz，衰减 1.1s，轻微「哐」后余韵 */
const gong = () => {
  const DUR = 1.3;
  const { N, L, R } = makeBuf(DUR);
  const PARTS = [
    [1.0, 1.0], [1.52, 0.55], [2.18, 0.38], [2.94, 0.22], [3.86, 0.12], [5.2, 0.06],
  ];
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 3.4) * (t < 0.008 ? t / 0.008 : 1);
    let v = 0;
    for (const [m, amp] of PARTS) {
      const f = 170 * m;
      // 分音各带轻微颤（模拟锣面振动）
      v += Math.sin(2 * Math.PI * f * t + 0.35 * Math.sin(2 * Math.PI * 5.3 * m * t)) * amp;
    }
    v *= env * 0.5;
    const pan = i / N * 0.2; // 极轻微 L→R 漂移
    L[i] = v * (1 - pan * 0.5); R[i] = v * (1 + pan * 0.5);
    // 撞击瞬态
    if (t < 0.012) {
      const w = (rng() * 2 - 1) * Math.exp(-t * 260) * 0.3;
      L[i] += w; R[i] += w * 0.95;
    }
  }
  return { L, R, N };
};

/* 铃簇：E6/G#6/B6 三音上行（1318.5/1661.2/1975.5），快速衰减，节庆解锁感 */
const chime = () => {
  const DUR = 0.62;
  const { N, L, R } = makeBuf(DUR);
  const bells = [
    [0.00, 1318.51, 0.5, -0.25],
    [0.06, 1661.22, 0.44, 0.0],
    [0.12, 1975.53, 0.38, 0.25],
  ];
  const PART = [[1, 1], [2.76, 0.35], [5.4, 0.1]]; // 钟形分音（略非谐）
  for (const [t0, f, g, pan] of bells) {
    const s = Math.floor(t0 * SR);
    const gl = g * Math.cos(((pan + 1) * Math.PI) / 4);
    const gr = g * Math.sin(((pan + 1) * Math.PI) / 4);
    for (let i = s; i < N; i++) {
      const t = (i - s) / SR;
      const env = Math.exp(-t * 7) * (t < 0.004 ? t / 0.004 : 1);
      let v = 0;
      for (const [m, amp] of PART) v += Math.sin(2 * Math.PI * f * m * t) * amp;
      v *= env;
      L[i] += v * gl; R[i] += v * gr;
    }
  }
  return { L, R, N };
};

/* 气泡 pop：正弦上滑 320→720Hz，90ms，轻快 */
const pop = () => {
  const DUR = 0.1;
  const { N, L, R } = makeBuf(DUR);
  let phase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const f = 320 + 400 * (t / 0.09) ** 1.5;
    phase += (2 * Math.PI * f) / SR;
    const env = Math.exp(-t * 36) * (t < 0.002 ? t / 0.002 : 1);
    const v = Math.sin(phase) * env * 0.75;
    L[i] = v; R[i] = v;
  }
  return { L, R, N };
};

/* 转场风（柔和版）：噪声扫频 0.45s，声像收窄、顶频降低、尾音快收 */
const whoosh = () => {
  const DUR = 0.45;
  const { N, L, R } = makeBuf(DUR);
  let last = 0;
  let s = 9107;
  const nr = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff), s / 0x7fffffff);
  for (let i = 0; i < N; i++) {
    const t = i / N;
    let env;
    if (t < 0.22) env = (t / 0.22) ** 2;
    else if (t > 0.72) env = Math.max(0, (1 - t) / 0.28);
    else env = 1;
    // 低通：600Hz→2100Hz→600Hz（比旧版更暗、更贴底）
    const fc = 600 + 1500 * Math.sin(Math.PI * Math.min(1, t / 0.7));
    const a = Math.exp(-2 * Math.PI * fc / SR);
    const w = nr() * 2 - 1;
    last = w * (1 - a) + last * a;
    const v = last * env * 2.0;
    const pan = -0.22 + t * 0.44; // 收窄声像
    L[i] = v * Math.cos(((pan + 1) * Math.PI) / 4);
    R[i] = v * Math.sin(((pan + 1) * Math.PI) / 4);
  }
  return { L, R, N };
};

/* 定版闪烁：高区铃簇（D6/Fs6/A6/D7）逐个入场 + 微光噪声 */
const shimmer = () => {
  const DUR = 1.4;
  const { N, L, R } = makeBuf(DUR);
  const bells = [
    [0.00, 1174.66, 0.5, -0.3],
    [0.07, 1479.98, 0.42, 0.3],
    [0.14, 1760.00, 0.36, -0.1],
    [0.22, 2349.32, 0.28, 0.15],
  ];
  const PART = [[1, 1], [2.01, 0.4], [3.02, 0.18], [4.2, 0.07]];
  for (const [t0, f, g, pan] of bells) {
    const s = Math.floor(t0 * SR);
    const gl = g * Math.cos(((pan + 1) * Math.PI) / 4);
    const gr = g * Math.sin(((pan + 1) * Math.PI) / 4);
    for (let i = s; i < N; i++) {
      const t = (i - s) / SR;
      const env = Math.exp(-t * 3.2) * (t < 0.005 ? t / 0.005 : 1);
      let v = 0;
      for (const [m, amp] of PART) v += Math.sin(2 * Math.PI * f * m * t) * amp;
      v *= env;
      L[i] += v * gl; R[i] += v * gr;
    }
  }
  let last = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 4) * (t < 0.02 ? t / 0.02 : 1);
    const w = rng() * 2 - 1;
    last = w * 0.3 + last * 0.7;
    const v = last * env * 0.045;
    L[i] += v; R[i] += v * 0.85;
  }
  return { L, R, N };
};

const writeWav = (name, { L, R, N }) => {
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak > 0 ? 0.72 / peak : 1;
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
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(L[i] * g * 32767))), 44 + i * 4);
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(R[i] * g * 32767))), 46 + i * 4);
  }
  const out = path.join(__dirname, '..', 'public', 'assets', 'sfx', name);
  fs.writeFileSync(out, buf);
  console.log('wrote', name, (buf.length / 1024).toFixed(0) + 'KB');
};

writeWav('sfx_stamp.wav', stamp());
writeWav('sfx_gong.wav', gong());
writeWav('sfx_chime.wav', chime());
writeWav('sfx_pop.wav', pop());
writeWav('sfx_whoosh.wav', whoosh());
writeWav('sfx_shimmer.wav', shimmer());
console.log('done');
