import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps asset paths relative so the build works on
// GitHub Pages (user or project site), Netlify, Vercel or any static host.
export default defineConfig({
  plugins: [react()],
  base: './',
  // three.js is split into its own lazily loaded chunk, so its size is expected.
  build: { chunkSizeWarningLimit: 900 },
});
