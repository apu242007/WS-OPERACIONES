
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/WS-OPERACIONES/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-pdf':      ['@react-pdf/renderer'],
          'vendor-jspdf':    ['jspdf', 'jspdf-autotable', 'html2canvas'],
        },
      },
    },
  },
});
