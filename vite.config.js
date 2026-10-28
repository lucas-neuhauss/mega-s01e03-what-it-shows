import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

const here = path => fileURLToPath(new URL(path, import.meta.url));
export default defineConfig({
  build: {
    outDir: 'rendered/assets',
    emptyOutDir: true,
    lib: { entry: here('./scripts/client.js'), formats: ['es'], fileName: () => 'kb.js' },
  },
  resolve: { alias: { '#lib': here('./src/lib') } },
  plugins: [svelte({
    extensions: ['.svelte', '.svx'],
    preprocess: mdsvex({
      extensions: ['.svx'],
      layout: { runbook: here('./src/lib/layouts/runbook.svelte') },
    }),
    emitCss: false,
  })],
});
