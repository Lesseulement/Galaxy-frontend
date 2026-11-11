import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite: сервер разработки на порту 3000.
// Обход CORS через прокси: браузер обращается только к 127.0.0.1:3000,
// а Vite пересылает запросы дальше.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',   // на Windows localhost иногда уходит в IPv6
    port: 3000,
    proxy: {
      // 1-й маршрут: AJAX-запросы /api/... -> веб-сервис FastAPI
      '/api': { target: 'http://127.0.0.1:8001', changeOrigin: true },
      // 2-й маршрут: /s3/... -> MinIO (S3), фото и видео галактик
      '/s3': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/s3/, ''),
      },
    },
  },
})
