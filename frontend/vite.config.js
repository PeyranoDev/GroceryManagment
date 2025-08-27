import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => ({
  base: process.env.VITE_BASE || '/',

  plugins: [react(), tailwindcss()],

  // Evita errores en el bundle si alguna lib toca process.env en el browser
  define: { 'process.env': {} },

  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: { usePolling: true },
  },
}))
