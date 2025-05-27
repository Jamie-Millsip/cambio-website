import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [react()],
  define: {
    global: 'window',
  },
  build: {
    outDir: `dist/`
  }
}))

