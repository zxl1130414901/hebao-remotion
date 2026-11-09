/* 贺报填表出片工具（本地）
   ------------------------------------------------------------------
   解决一件事：换文案不该"改代码 + 全量重渲"。
   文案在 content/demo.json 里；页面填表 → 走 inputProps 覆盖 → 只渲你选的那一支。
   关键点：改文案不会重新打包（bundle 只在启动时做一次），所以一支 30 秒左右。

   启动： node tools/studio.mjs
   打开： http://127.0.0.1:8788
*/
import http from 'node:http';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { openBrowser, renderMedia, selectComposition } from '@remotion/renderer';

const ROOT = path.resolve(process.cwd());
const PORT = Number(process.env.PORT || 8788);
const OUT = path.join(ROOT, 'studio-out');
const CONTENT = path.join(ROOT, 'content', 'demo.json');
const META = path.join(ROOT, 'content', 'templates.json');

fs.mkdirSync(OUT, { recursive: true });

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const templates = readJSON(META);

/* ---------- 渲染流水线：一次只跑一支，避免 Chrome 抢内存 ---------- */
let serveUrl = null;
let browser = null;
const queue = [];
let busy = false;
const jobs = new Map();

const log = (s) => console.log(`[studio] ${s}`);

async function boot() {
  log('打包中（只做一次）…');
  const t0 = Date.now();
  serveUrl = await bundle({
    entryPoint: path.join(ROOT, 'src', 'u', 'index.ts'),
    onProgress: () => undefined,
  });
  browser = await openBrowser('chrome', {
    chromiumOptions: { gl: 'angle', ignoreCertificateErrors: true },
  });
  log(`就绪，用时 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

/* 只保留 UI 认识的字段；没传的字段一律不出现，
   这样 inputProps 合并时不会用空串把模板原有文案抹掉。 */
const str = (v, max = 120) => (typeof v === 'string' ? v.slice(0, max) : '');
const num = (v, dflt) => (Number.isFinite(Number(v)) ? Number(v) : dflt);

function sanitize(raw) {
  const p = raw || {};
  const out = {};
  const put = (k, max) => {
    if (p[k] === undefined || p[k] === null) return;
    out[k] = str(p[k], max);
  };
  put('brand', 120);
  put('kicker', 120);
  put('title', 40);
  put('subtitle', 80);
  put('honoree', 30);
  put('role', 60);
  put('award', 60);
  put('quote', 60);
  put('dateText', 30);
  put('footnote', 120);

  if (p.metric && typeof p.metric === 'object') {
    const m = p.metric;
    out.metric = {
      value: num(m.value, 0),
      decimals: [0, 1, 2].includes(Number(m.decimals)) ? Number(m.decimals) : 1,
      prefix: str(m.prefix, 4),
      suffix: str(m.suffix, 8),
      unit: str(m.unit, 6),
      label: str(m.label, 20),
    };
  }
  if (Array.isArray(p.facts)) {
    out.facts = p.facts.slice(0, 3).map((f) => ({ k: str(f.k, 12), v: str(f.v, 16) }));
  }
  if (Array.isArray(p.rows)) {
    out.rows = p.rows.slice(0, 5).map((r, i) => ({
      name: str(r.name, 16),
      role: str(r.role, 20),
      value: str(r.value, 16),
      ...(i === 0 ? { hl: true } : {}),
    }));
  }
  if (Array.isArray(p.milestones)) {
    out.milestones = p.milestones.slice(0, 3).map((x) => ({
      t: str(x.t, 8),
      label: str(x.label, 12),
      note: str(x.note, 24),
    }));
  }
  return out;
}

async function runJob(job) {
  const tpl = templates.find((t) => t.id === job.id);
  if (!tpl) {
    job.status = 'error';
    job.error = `没有这个模板：${job.id}`;
    return;
  }
  const content = readJSON(CONTENT)[job.id] || {};
  const inputProps = {
    ...content,
    ...sanitize(job.props),
    accent: tpl.accent,
    seed: 20260000 + Number(tpl.id.slice(1)) * 97,
  };
  job.status = 'rendering';
  job.startedAt = Date.now();
  try {
    const composition = await selectComposition({
      serveUrl,
      id: job.id,
      inputProps,
      puppeteerInstance: browser,
    });
    job.total = composition.durationInFrames;
    const file = path.join(OUT, job.filename);
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: file,
      inputProps,
      puppeteerInstance: browser,
      concurrency: 3,
      crf: 19,
      imageFormat: 'jpeg',
      jpegQuality: 100,
      onProgress: ({ progress, encodedFrames }) => {
        job.progress = progress;
        job.frames = encodedFrames;
      },
    });
    /* Chrome 复用会累积内存：渲完关掉重开一个，长时间连续出片也不会崩 */
    await browser.close({ silent: true }).catch(() => undefined);
    browser = await openBrowser('chrome', {
      chromiumOptions: { gl: 'angle', ignoreCertificateErrors: true },
    });
    job.status = 'done';
    job.progress = 1;
    job.file = job.filename;
    job.seconds = ((Date.now() - job.startedAt) / 1000).toFixed(1);
    log(`完成 ${job.id} → ${job.filename} (${job.seconds}s)`);
  } catch (e) {
    job.status = 'error';
    job.error = String(e && e.message ? e.message : e).slice(0, 500);
    log(`失败 ${job.id}: ${job.error}`);
  }
}

async function pump() {
  if (busy) return;
  const job = queue.shift();
  if (!job) return;
  busy = true;
  try {
    await runJob(job);
  } finally {
    busy = false;
    pump();
  }
}

/* ---------- HTTP ---------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.mp4': 'video/mp4', '.json': 'application/json; charset=utf-8' };

function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

function sendFile(req, res, file) {
  const st = fs.statSync(file);
  const ext = path.extname(file);
  const type = MIME[ext] || 'application/octet-stream';
  const range = req.headers.range;
  if (range && ext === '.mp4') {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m && m[1] ? Number(m[1]) : 0;
    const end = m && m[2] ? Number(m[2]) : st.size - 1;
    res.writeHead(206, {
      'Content-Type': type,
      'Content-Range': `bytes ${start}-${end}/${st.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
    });
    fs.createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes' });
  fs.createReadStream(file).pipe(res);
}

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', (c) => {
      buf += c;
      if (buf.length > 2e6) reject(new Error('body too large'));
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(buf || '{}'));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });

const safeName = (s) =>
  (s || '')
    .replace(/[\\/:*?"<>|\r\n\t]/g, '')
    .trim()
    .slice(0, 60) || '贺报';

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const p = decodeURIComponent(u.pathname);

  try {
    if (p === '/' || p === '/index.html') {
      return sendFile(req, res, path.join(ROOT, 'tools', 'studio.html'));
    }

    if (p === '/api/templates') {
      const content = readJSON(CONTENT);
      const data = templates.map((t) => ({ ...t, values: content[t.id] || {} }));
      return send(res, 200, JSON.stringify({ ok: true, templates: data, ready: !!serveUrl }));
    }

    if (p === '/api/render' && req.method === 'POST') {
      if (!serveUrl) return send(res, 503, JSON.stringify({ ok: false, error: '还在打包，请稍等十几秒' }));
      const body = await readBody(req);
      const id = String(body.id || '');
      const tpl = templates.find((t) => t.id === id);
      if (!tpl) return send(res, 400, JSON.stringify({ ok: false, error: '模板不存在' }));
      const jobId = Math.random().toString(36).slice(2, 10);
      const filename = `${safeName(body.filename || `${tpl.name}_${id}`)}.mp4`;
      const job = { jobId, id, props: body.props, filename, status: 'queued', progress: 0 };
      jobs.set(jobId, job);
      queue.push(job);
      pump();
      return send(res, 200, JSON.stringify({ ok: true, jobId, filename }));
    }

    const jm = /^\/api\/job\/([a-z0-9]+)$/.exec(p);
    if (jm) {
      const job = jobs.get(jm[1]);
      if (!job) return send(res, 404, JSON.stringify({ ok: false, error: 'job 不存在' }));
      return send(
        res,
        200,
        JSON.stringify({
          ok: true,
          status: job.status,
          progress: job.progress || 0,
          frames: job.frames || 0,
          file: job.status === 'done' ? job.filename : null,
          seconds: job.seconds || null,
          error: job.error || null,
        })
      );
    }

    if (p.startsWith('/files/')) {
      const name = path.basename(p.slice('/files/'.length));
      const file = path.join(OUT, name);
      if (!fs.existsSync(file)) return send(res, 404, 'not found', 'text/plain; charset=utf-8');
      return sendFile(req, res, file);
    }

    if (p === '/api/save' && req.method === 'POST') {
      const body = await readBody(req);
      const id = String(body.id || '');
      if (!templates.some((t) => t.id === id)) {
        return send(res, 400, JSON.stringify({ ok: false, error: '模板不存在' }));
      }
      const all = readJSON(CONTENT);
      all[id] = { ...all[id], ...sanitize(body.props) };
      fs.writeFileSync(CONTENT, JSON.stringify(all, null, 2) + '\n', 'utf8');
      return send(res, 200, JSON.stringify({ ok: true }));
    }

    return send(res, 404, 'not found', 'text/plain; charset=utf-8');
  } catch (e) {
    return send(res, 500, JSON.stringify({ ok: false, error: String(e.message || e) }));
  }
});

await boot();
server.listen(PORT, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${PORT}`;
  log(`打开 ${url}`);
  /* 服务起来后自动开浏览器，省得用户自己找地址；设 HEBAO_NO_OPEN=1 可关闭 */
  if (!process.env.HEBAO_NO_OPEN) {
    const cmd =
      process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
    exec(cmd, () => undefined);
  }
});
