import type { SyntheticEvent } from 'react'
// Фото и видео по умолчанию лежат в самом проекте (src/assets)
import defaultImage from './assets/default.jpg'
import defaultVideo from './assets/default.mp4'

export { defaultImage, defaultVideo }

// Ссылки на MinIO (http://localhost:9000/...) идут через 2-й маршрут прокси Vite: /s3/...
const viaProxy = (url: string) => url.replace(/^https?:\/\/(localhost|127\.0\.0\.1):9000/, '/s3')

// Если у галактики нет фото/видео (поле пустое) — берём файл по умолчанию
export const imageOf = (url: string | null): string => (url ? viaProxy(url) : defaultImage)
export const videoOf = (url: string | null): string => (url ? viaProxy(url) : defaultVideo)

// Если файл по ссылке не загрузился — тоже подставляем файл по умолчанию
export const onImageError = (e: SyntheticEvent<HTMLImageElement>) => {
  if (!e.currentTarget.src.endsWith(defaultImage)) e.currentTarget.src = defaultImage
}
export const onVideoError = (e: SyntheticEvent<HTMLVideoElement>) => {
  if (!e.currentTarget.src.endsWith(defaultVideo)) e.currentTarget.src = defaultVideo
}
