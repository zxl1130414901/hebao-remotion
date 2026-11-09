/* 一次性迁移脚本 + 模板清单生成。
   ------------------------------------------------------------------
   1) content/templates.json —— 模板清单（id / 名称 / 皮肤 / 版式），出片台直接读，不需要编译 TS。
   2) content/demo.json —— 演示文案。仅当旧的 src/u/template-demo.ts 还在时才生成（从 TS 搬到 JSON）；
      搬完之后 demo.json 就是唯一来源，日常改文案只改这个 JSON，不要再回来跑本脚本。
*/
import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const TMP = path.join(ROOT, 'out', '_content_probe.mjs');
const hasLegacy = fs.existsSync(path.join(ROOT, 'src', 'u', 'template-demo.ts'));
fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'content'), { recursive: true });

await esbuild.build({
  stdin: {
    contents: `
      export { TEMPLATES } from './src/u/templates.ts';
      ${hasLegacy ? "export { TEMPLATE_DEMO } from './src/u/template-demo.ts';" : ''}
      ${hasLegacy ? "export { SKIN_DEMO } from './src/u/demo.ts';" : ''}
      ${hasLegacy ? "export { DEFAULT_PROPS } from './src/u/types.ts';" : ''}
    `,
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node18',
  outfile: TMP,
  logLevel: 'error',
});

const mod = await import('file://' + TMP.replace(/\\/g, '/'));
const { TEMPLATES } = mod;

/* 模板清单：出片台（node 服务端）读这个，不依赖编译 */
const meta = TEMPLATES.map((t) => ({
  id: t.id,
  name: t.name,
  skin: t.skin,
  layout: t.layout,
  accent: t.accent,
}));
fs.writeFileSync(
  path.join(ROOT, 'content', 'templates.json'),
  JSON.stringify(meta, null, 2) + '\n',
  'utf8'
);
console.log('wrote content/templates.json :', meta.length, 'entries');

if (hasLegacy) {
  const { TEMPLATE_DEMO, SKIN_DEMO, DEFAULT_PROPS } = mod;
  /* accent / seed 属于版式参数，不是文案，留在代码里 */
  const content = {};
  for (const tpl of TEMPLATES) {
    const merged = {
      ...DEFAULT_PROPS,
      ...(SKIN_DEMO[tpl.skin] ?? {}),
      ...(TEMPLATE_DEMO[tpl.id] ?? {}),
    };
    delete merged.accent;
    delete merged.seed;
    content[tpl.id] = merged;
  }
  const out = {
    _说明:
      '贺报演示文案。改这里即可，不需要改任何 .tsx / .ts 代码。accent 与 seed 是版式参数，在各模板定义里，不在此文件。',
    _模板数: Object.keys(content).length,
    ...content,
  };
  fs.writeFileSync(
    path.join(ROOT, 'content', 'demo.json'),
    JSON.stringify(out, null, 2) + '\n',
    'utf8'
  );
  console.log('wrote content/demo.json :', Object.keys(content).length, 'templates');
} else {
  console.log('src/u/template-demo.ts 已不存在，跳过 demo.json（它现在是唯一来源，别覆盖）');
}

fs.rmSync(TMP, { force: true });
