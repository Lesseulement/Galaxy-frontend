import type { Galaxy, Loaded, MagnitudeRange } from '../types'
import { GALAXIES_MOCK } from '../mock'

const TIMEOUT_MS = 1500

// Запрос к веб-сервису; если он не ответил — бросается ошибка
async function request<T>(url: string): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(String(response.status))
    return (await response.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

const published = () => [...GALAXIES_MOCK].sort((a, b) => a.id - b.id)

// Плитка: GET /api/galaxies?magnitude_from=&magnitude_to=
// Без веб-сервиса — фильтрация той же логикой по mock-коллекции.
export async function getGalaxies(range: MagnitudeRange): Promise<Loaded<Galaxy[]>> {
  const query = new URLSearchParams({
    magnitude_from: String(range.from),
    magnitude_to: String(range.to),
  })
  try {
    return { data: await request<Galaxy[]>(`/api/galaxies?${query}`), fromMock: false }
  } catch {
    const data = published().filter(g =>
      g.apparent_magnitude !== null &&
      g.apparent_magnitude >= range.from &&
      g.apparent_magnitude <= range.to)
    return { data, fromMock: true }
  }
}

// Лента: без id — первая галактика; id — эта; id и next=true — следующая (по кругу)
export async function getFeed(id?: number, next = false): Promise<Loaded<Galaxy | null>> {
  const query = new URLSearchParams()
  if (id !== undefined) query.set('id', String(id))
  if (next) query.set('next', 'true')
  try {
    const qs = query.toString()
    return { data: await request<Galaxy>(qs ? `/api/galaxies/feed?${qs}` : '/api/galaxies/feed'), fromMock: false }
  } catch {
    const list = published()
    let item: Galaxy | undefined
    if (id === undefined) item = list[0]
    else if (next) item = list.find(g => g.id > id) ?? list[0]
    else item = list.find(g => g.id === id)
    return { data: item ?? null, fromMock: true }
  }
}
