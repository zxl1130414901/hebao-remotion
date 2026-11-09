import path from 'node:path';
import fs from 'node:fs';
import { bundle } from '@remotion/bundler';
import { openBrowser, renderMedia, selectComposition } from '@remotion/renderer';

const ROOT = path.resolve(process.cwd());
const OUT = process.env.OUT_DIR ? path.resolve(process.env.OUT_DIR) : path.join(ROOT, 'videos');
const LOG = path.join(ROOT, 'out', 'render65b.log');
fs.mkdirSync(OUT, { recursive: true });

const ids = process.argv.slice(2).length
  ? process.argv.slice(2)
  : Array.from({ length: 65 }, (_, i) => `u${String(i + 1).padStart(2, '0')}`);

/* 每渲染这么多支就重启浏览器：Chrome 复用会持续累积内存，跑到 8 支以上容易 OOM */
const PER_BROWSER = Number(process.env.PER_BROWSER || 4);

const log = (s) => {
  fs.appendFileSync(LOG, s + '\n');
  console.log(s);
};

const t0 = Date.now();
const serveUrl = await bundle({
  entryPoint: path.join(ROOT, 'src', 'u', 'index.ts'),
  onProgress: () => undefined,
});
log(`bundled ${((Date.now() - t0) / 1000).toFixed(1)}s`);

let browser = null;
const newBrowser = async () => {
  if (browser) await browser.close({ silent: true }).catch(() => undefined);
  browser = await openBrowser('chrome', {
    chromiumOptions: { gl: 'angle', ignoreCertificateErrors: true },
  });
  log('-- browser opened --');
};

await newBrowser();

let count = 0;
for (const id of ids) {
  if (count > 0 && count % PER_BROWSER === 0) await newBrowser();
  count += 1;

  const s = Date.now();
  let done = false;
  for (let attempt = 1; attempt <= 2 && !done; attempt += 1) {
    try {
      const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
      await renderMedia({
        composition,
        serveUrl,
        codec: 'h264',
        outputLocation: path.join(OUT, `${id}.mp4`),
        puppeteerInstance: browser,
        concurrency: Number(process.env.CONCURRENCY || 3),
        crf: 19,
        imageFormat: 'jpeg',
        jpegQuality: 100,
        pixelFormat: 'yuv420p',
        x264Preset: 'medium',
        timeoutInMilliseconds: 180000,
        overwrite: true,
        onProgress: () => undefined,
      });
      log(`${id} OK ${((Date.now() - s) / 1000).toFixed(0)}s`);
      done = true;
    } catch (e) {
      log(`${id} FAIL#${attempt} ${String(e).slice(0, 180)}`);
      /* 失败后换一个干净的浏览器再试一次，通常能救回被 OOM 打断的那支 */
      if (attempt === 1) await newBrowser().catch(() => undefined);
    }
  }
  if (!done) log(`${id} SKIP`);
}

await browser?.close({ silent: true }).catch(() => undefined);
log('ALLDONE');
