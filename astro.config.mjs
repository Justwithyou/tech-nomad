import { defineConfig } from 'astro/config';
import remarkMermaid from './remark-mermaid.mjs';

export default defineConfig({
  site: 'https://justwithyou.github.io',
  base: '/tech-nomad/',
  devToolbar: { enabled: false },
  markdown: {
    remarkPlugins: [remarkMermaid],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
