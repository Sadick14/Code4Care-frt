import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: 'VITE_',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/chat': {
        target: 'https://code4care-backend-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/v1/chat',
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'motion/react'],
  },
});