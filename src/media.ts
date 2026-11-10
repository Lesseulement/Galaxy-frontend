import type { SyntheticEvent } from 'react'
// Фото и видео по умолчанию лежат в самом проекте (src/assets)
import defaultImage from './assets/default.jpg'
import defaultVideo from './assets/default.mp4'

export { defaultImage, defaultVideo }

// Если у галактики нет фото/видео (поле пустое) — берём файл по умолчанию
export const imageOf = (url: string | null): string => url || defaultImage
export const videoOf = (url: string | null): string => url || defaultVideo

// Если файл по ссылке не загрузился (например, S3 выключен) — тоже подставляем файл по умолчанию
export const onImageError = (e: SyntheticEvent<HTMLImageElement>) => {
  if (!e.currentTarget.src.endsWith(defaultImage)) e.currentTarget.src = defaultImage
}
export const onVideoError = (e: SyntheticEvent<HTMLVideoElement>) => {
  if (!e.currentTarget.src.endsWith(defaultVideo)) e.currentTarget.src = defaultVideo
}
