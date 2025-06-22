import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: command === 'serve' ? '/' : '/cambio-website/',
  plugins: [react()],
  define: {
    global: 'window',
  },
  build: {
    outDir: `dist/`
  }
}))

