import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3080,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
