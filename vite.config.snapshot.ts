import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Special config for single-file bundle
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-snapshot',
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'bundle.js',
        assetFileNames: 'bundle.[ext]'
      },
    },
  },
});
