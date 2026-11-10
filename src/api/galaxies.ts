import type { Galaxy, MagnitudeRange } from '../types'
import { GALAXIES_MOCK } from '../mock'

// ЛР5: данные берутся только из mock-коллекции, без бэкенда, БД и S3.
// Функции асинхронные, как будущие запросы к веб-сервису (ЛР6).
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const published = () => [...GALAXIES_MOCK].sort((a, b) => a.id - b.id)

// Плитка: галактики с видимой звёздной величиной в диапазоне «от» – «до»
export async function getGalaxies(range: MagnitudeRange): Promise<Galaxy[]> {
  await delay(200)
  return published().filter(g =>
    g.apparent_magnitude !== null &&
    g.apparent_magnitude >= range.from &&
    g.apparent_magnitude <= range.to)
}

// Лента: без id — первая галактика; id — эта; id и next=true — следующая (по кругу)
export async function getFeed(id?: number, next = false): Promise<Galaxy | null> {
  await delay(200)
  const list = published()
  if (id === undefined) return list[0] ?? null
  if (next) return list.find(g => g.id > id) ?? list[0] ?? null
  return list.find(g => g.id === id) ?? null
}
