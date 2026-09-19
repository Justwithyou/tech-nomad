import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/Tech-Nomad/',
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
