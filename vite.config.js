import { resolve } from 'path';
import { defineConfig } from 'vite';

const projectRoot = typeof import.meta.dirname !== 'undefined'
  ? import.meta.dirname
  : resolve('.');

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

export default defineConfig({
  server: {
    headers: securityHeaders,
    fs: {
      strict: true,
    },
  },
  preview: {
    headers: securityHeaders,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectRoot, 'index.html'),
        portfolio: resolve(projectRoot, 'portfolio.html'),
      },
    },
  },
});

