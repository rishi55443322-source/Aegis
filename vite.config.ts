import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [react() as any],
  // @ts-expect-error vitest configuration field
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: false,
  },
  server: {
    port: 5173,
    host: true,
  },
});
