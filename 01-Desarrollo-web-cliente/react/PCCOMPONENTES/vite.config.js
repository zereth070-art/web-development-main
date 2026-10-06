import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // proxy: el navegador siempre pide a Vite (mismo origen => sin CORS) y
  // Vite reenvía /api al servidor Express del puerto 3000
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
