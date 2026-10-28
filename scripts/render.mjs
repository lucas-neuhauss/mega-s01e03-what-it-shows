import { createServer, build } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
await build({ root });
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('svelte/server');
  const pages = [
    ['','index.html'],
    ['triage/dedupe','triage/dedupe/index.html'],
    ['decisions/0001-dedupe-by-subject','decisions/0001-dedupe-by-subject/index.html'],
    ['incidents/4471','incidents/4471/index.html'],
    ['incidents/4471-review','incidents/4471-review/index.html'],
  ];
  for (const [slug, dest] of pages) {
    const source = `/src/routes/kb/${slug ? slug + '/' : ''}+page.svx`;
    const mod = await server.ssrLoadModule(source);
    const output = render(mod.default);
    const file = resolve(root, 'rendered/kb', dest);
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${output.head}</head><body>${output.body}<script type="module" src="/assets/kb.js"></script></body></html>`;
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
    console.log(file);
  }
} finally { await server.close(); }
