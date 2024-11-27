import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api/blockchain': {
        target: 'https://blockchain.info',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/blockchain/, ''),
      },
      '/api/elastos': {
        target: 'https://api.elastos.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/elastos/, ''),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Elastos-Dashboard'
        }
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
