import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.crisbr.es',
  output: 'static',
  compressHTML: true,
  adapter: vercel(),
});
