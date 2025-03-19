import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: `/Cambio-Website/frontend/`,
  plugins: [react()],
  define: {
    global: 'window',
  },
})
