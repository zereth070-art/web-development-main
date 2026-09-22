import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vite: el empaquetador (build) y servidor de desarrollo.
// Este fichero solo dice "usa el plugin de React". Nada más.
export default defineConfig({
  plugins: [react()],
})