import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

// Relative base ('./') so the same build works from a domain root (Vercel /
// Netlify) AND from a sub-path such as gymkhana.iitb.ac.in/~hostel4/ without
// rebuilding. Routing uses a hash router for the same reason — no server
// rewrite rules are required on the institute's Apache user directory.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
