import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 30001, // Change the default port
    open: true, // Automatically open the browser
  },
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: true, // Generate source maps
  },
})
