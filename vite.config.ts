import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

// Сертификат для HTTPS (создаётся командами mkcert create-ca и mkcert create-cert).
// Файлы cert.key и cert.crt лежат в корне проекта и не попадают в git.
const certKey = path.resolve(__dirname, 'cert.key')
const certCrt = path.resolve(__dirname, 'cert.crt')
const https = fs.existsSync(certKey) && fs.existsSync(certCrt)
  ? { key: fs.readFileSync(certKey), cert: fs.readFileSync(certCrt) }
  : undefined

export default defineConfig({
  // GitHub Pages: приложение открывается по адресу https://lesseulement.github.io/Galaxy-frontend/
  base: '/Galaxy-frontend/',
  plugins: [
    react(),
    // PWA: manifest и service worker
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      workbox: {
        // в кэш (для работы офлайн) попадают страницы, скрипты, стили, фото и видео
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,mp4}'],
      },
      manifest: {
        name: 'Галактики',
        short_name: 'Галактики',
        description: 'Определение расстояния до галактики по сверхновым типа Ia',
        start_url: '/Galaxy-frontend/',
        scope: '/Galaxy-frontend/',
        display: 'standalone',
        background_color: '#1e1e1e',
        theme_color: '#f0b200',
        orientation: 'portrait-primary',
        icons: [
          { src: 'logo192.png', type: 'image/png', sizes: '192x192' },
          { src: 'logo512.png', type: 'image/png', sizes: '512x512' },
        ],
      },
    }),
  ],
  server: {
    host: true,          // доступ с телефона по IP-адресу ноутбука в локальной сети
    port: 3000,
    https,               // HTTPS на сервере Node.js (Vite)
    // Реверс-прокси (обход CORS): телефон обращается к ноутбуку, а Vite пересылает запросы дальше
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
