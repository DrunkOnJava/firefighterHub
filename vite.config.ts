import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - rarely changes, cache separately
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],

          // Supabase - large library, rarely changes
          'supabase-vendor': ['@supabase/supabase-js'],

          // Date/Calendar libraries - moderate size, may change
          'calendar-vendor': ['react-big-calendar', 'date-fns'],

          // UI libraries - icons and utilities
          'ui-vendor': ['lucide-react', 'clsx'],
        },
      },
    },
    // Increase chunk size warning limit (our chunks are optimized)
    chunkSizeWarningLimit: 600,
  },
});
