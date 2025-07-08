import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          // Reducir el tamaño de los archivos generados eliminando comentarios
          compact: true,
          // Minificar los nombres de las clases CSS
          manualChunks: undefined
        }
      }
    }
  }
});
