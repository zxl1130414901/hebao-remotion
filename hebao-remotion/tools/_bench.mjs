import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia } from '@remotion/renderer';

const OUT = path.resolve('out/_bench');
const t0 = Date.now();
const serveUrl = await bundle({
  entryPoint: path.resolve('src/u/index.ts'),
  onProgress: () => undefined,
});
console.log('bundle done', ((Date.now() - t0) / 1000).toFixed(1) + 's');

const variants = [
  { tag: 'A_q100_crf19_med_c15', jpegQuality: 100, crf: 19, x264Preset: 'medium', concurrency: 15 },
  { tag: 'B_q80_crf21_vfast_c15', jpegQuality: 80, crf: 21, x264Preset: 'veryfast', concurrency: 15 },
  { tag: 'C_q60_crf22_vfast_c18', jpegQuality: 60, crf: 22, x264Preset: 'veryfast', concurrency: 18 },
  { tag: 'D_q80_crf21_vfast_c6', jpegQuality: 80, crf: 21, x264Preset: 'veryfast', concurrency: 6 },
];

for (const v of variants) {
  const s = Date.now();
  const composition = await selectComposition({ serveUrl, id: 'u116' });
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: path.join(OUT, `${v.tag}.mp4`),
    concurrency: v.concurrency,
    crf: v.crf,
    imageFormat: 'jpeg',
    jpegQuality: v.jpegQuality,
    pixelFormat: 'yuv420p',
    x264Preset: v.x264Preset,
    overwrite: true,
    onProgress: () => undefined,
  });
  const sec = (Date.now() - s) / 1000;
  const fs = await import('node:fs');
  const kb = Math.round(fs.statSync(path.join(OUT, `${v.tag}.mp4`)).size / 1024);
  console.log(`${v.tag}  ${sec.toFixed(1)}s  ${kb}KB  (${(482 / sec).toFixed(0)} fps 渲染)`);
}
