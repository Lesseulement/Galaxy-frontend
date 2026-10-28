import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite: сервер разработки на порту 3000.
// Запросы /api перенаправляются на веб-сервис FastAPI (ЛР3–4).
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8001', changeOrigin: true },
    },
  },
})
