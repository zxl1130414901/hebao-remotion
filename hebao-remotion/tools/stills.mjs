import path from 'node:path';
import fs from 'node:fs';
import { bundle } from '@remotion/bundler';
import { openBrowser, renderStill, selectComposition } from '@remotion/renderer';

const ROOT = path.resolve(process.cwd());
const OUT = path.join(ROOT, 'out', process.env.OUTDIR ?? 'gallery');
fs.mkdirSync(OUT, { recursive: true });

const frame = Number(process.env.FRAME ?? 330);
const scale = Number(process.env.SCALE ?? 0.55);

const ids = process.argv.slice(2).length
  ? process.argv.slice(2)
  : Array.from({ length: 65 }, (_, i) => `u${String(i + 1).padStart(2, '0')}`);

const serveUrl = await bundle({
  entryPoint: path.join(ROOT, 'src', 'u', 'index.ts'),
  onProgress: () => undefined,
});
console.log('bundled', serveUrl);

const browser = await openBrowser('chrome');
const t0 = Date.now();
for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
  const output = path.join(OUT, `${id}.jpg`);
  await renderStill({
    composition,
    serveUrl,
    output,
    frame,
    scale,
    imageFormat: 'jpeg',
    jpegQuality: 88,
    puppeteerInstance: browser,
  });
  console.log(id, 'ok', ((Date.now() - t0) / 1000).toFixed(1) + 's');
}
await browser.close({ silent: true });
console.log('done', ids.length);
