import type { SyntheticEvent } from 'react'
import defaultImage from './assets/default.jpg'
import defaultVideo from './assets/default.mp4'

export { defaultImage, defaultVideo }

export const imageOf = (url: string | null): string => url || defaultImage
export const videoOf = (url: string | null): string => url || defaultVideo

export const onImageError = (e: SyntheticEvent<HTMLImageElement>) => {
  if (!e.currentTarget.src.endsWith(defaultImage)) e.currentTarget.src = defaultImage
}
export const onVideoError = (e: SyntheticEvent<HTMLVideoElement>) => {
  if (!e.currentTarget.src.endsWith(defaultVideo)) e.currentTarget.src = defaultVideo
}
