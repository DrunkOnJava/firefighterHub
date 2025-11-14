import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - rarely changes, cache separately
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],

          // Supabase - large library, rarely changes
          'supabase-vendor': ['@supabase/supabase-js'],

          // Date/Calendar libraries - moderate size, may change
          // Note: FullCalendar packages removed from manual chunks to fix Vercel build
          // Let Vite handle FullCalendar chunking automatically
          'calendar-vendor': ['date-fns'],

          // UI libraries - icons and utilities
          'ui-vendor': ['lucide-react', 'clsx'],
        },
      },
    },
    // Increase chunk size warning limit (our chunks are optimized)
    chunkSizeWarningLimit: 600,
  },
});