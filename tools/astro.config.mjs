// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://tools.irwansyah.my.id',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});