import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://justwithyou.github.io',
  base: '/tech-nomad/',
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
