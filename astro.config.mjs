import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://cristhianborges.dev',
  output: 'static',
  compressHTML: true,
  adapter: node({
    mode: 'standalone',
  }),
});
