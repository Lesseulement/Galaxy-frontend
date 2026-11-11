import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import axios from 'axios'
import { api } from '../api'
import type { BodyCreateDraftApiGalaxiesPost, LikeOut, PublishIn } from '../api/Api'
import type { Galaxy } from '../types'
import { GALAXIES_MOCK } from '../mock'
import type { RootState } from '.'

// Галактики (домен услуги): плитка, лента, черновик.
// Все обращения к веб-сервису — через сгенерированный клиент api (axios) в redux-thunk.
interface GalaxiesState {
  list: Galaxy[]            // плитка
  current: Galaxy | null    // галактика в ленте
  draft: Galaxy | null      // черновик на странице «Добавление»
  loading: boolean          // идёт запрос — показывается анимация, кнопки заблокированы
  error: string | null
}

const initialState: GalaxiesState = { list: [], current: null, draft: null, loading: false, error: null }

type ThunkConfig = { state: RootState; rejectValue: string }

const status = (e: unknown) => (axios.isAxiosError(e) ? e.response?.status : undefined)

// ---------- mock-коллекция: только для гостя, когда веб-сервис недоступен ----------
const mockList = (from: number, to: number) =>
  [...GALAXIES_MOCK]
    .sort((a, b) => a.id - b.id)
    .filter(g => g.apparent_magnitude !== null && g.apparent_magnitude >= from && g.apparent_magnitude <= to)

const mockFeed = (id?: number, next = false) => {
  const list = [...GALAXIES_MOCK].sort((a, b) => a.id - b.id)
  if (id === undefined) return list[0] ?? null
  if (next) return list.find(g => g.id > id) ?? list[0] ?? null
  return list.find(g => g.id === id) ?? null
}

// ---------- thunk-и ----------

// Плитка: фильтр из Redux передаётся в запрос к веб-сервису
export const fetchGalaxies = createAsyncThunk<Galaxy[], void, ThunkConfig>(
  'galaxies/fetchGalaxies',
  async (_, { getState, rejectWithValue }) => {
    const { filter, auth } = getState()
    try {
      const response = await api.galaxies.listGalaxiesApiGalaxiesGet({
        magnitude_from: filter.magnitudeFrom,
        magnitude_to: filter.magnitudeTo,
      })
      return response.data
    } catch {
      if (auth.user === null) return mockList(filter.magnitudeFrom, filter.magnitudeTo)
      return rejectWithValue('Не удалось загрузить галактики')
    }
  },
)

// Лента: без id — первая галактика; id — эта; id и next — следующая (по кругу)
export const fetchFeedGalaxy = createAsyncThunk<Galaxy | null, { id?: number; next?: boolean }, ThunkConfig>(
  'galaxies/fetchFeedGalaxy',
  async ({ id, next = false }, { getState, rejectWithValue }) => {
    try {
      const response = await api.galaxies.feedApiGalaxiesFeedGet({ id, next })
      return response.data
    } catch (e) {
      if (status(e) === 404) return null
      if (getState().auth.user === null) return mockFeed(id, next)
      return rejectWithValue('Не удалось загрузить галактику')
    }
  },
)

// Страница «Добавление»: черновик пользователя (404 — черновика нет)
export const fetchGalaxyDraft = createAsyncThunk<Galaxy | null, void, ThunkConfig>(
  'galaxies/fetchGalaxyDraft',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.galaxies.readDraftApiGalaxiesDraftGet()
      return response.data
    } catch (e) {
      if (status(e) === 404) return null
      return rejectWithValue('Не удалось загрузить черновик')
    }
  },
)


export const createGalaxyDraft = createAsyncThunk<Galaxy, { title: string; image: File; video: File }, ThunkConfig>(
  'galaxies/createGalaxyDraft',
  async (data, { rejectWithValue }) => {
    try {
      
      const response = await api.galaxies.createDraftApiGalaxiesPost(data as unknown as BodyCreateDraftApiGalaxiesPost)
      return response.data
    } catch {
      return rejectWithValue('Не удалось создать черновик')
    }
  },
)

export const publishGalaxyDraft = createAsyncThunk<Galaxy, PublishIn, ThunkConfig>(
  'galaxies/publishGalaxyDraft',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.galaxies.publishDraftApiGalaxiesDraftPublishPut(data)
      return response.data
    } catch {
      return rejectWithValue('Не удалось опубликовать галактику')
    }
  },
)

export const deleteGalaxy = createAsyncThunk<number, number, ThunkConfig>(
  'galaxies/deleteGalaxy',
  async (id, { rejectWithValue }) => {
    try {
      await api.galaxies.deleteGalaxyApiGalaxiesGalaxyIdDelete(id)
      return id
    } catch {
      return rejectWithValue('Не удалось удалить галактику')
    }
  },
)

// Сердечко в ленте: like = 1 — поставить, 0 — отменить
export const likeGalaxy = createAsyncThunk<LikeOut & { id: number }, { id: number; like: number }, ThunkConfig>(
  'galaxies/likeGalaxy',
  async ({ id, like }, { rejectWithValue }) => {
    try {
      const response = await api.galaxies.likeGalaxyApiGalaxiesGalaxyIdLikePost(id, { like })
      return { id, ...response.data }
    } catch {
      return rejectWithValue('Не удалось поставить лайк')
    }
  },
)

const thunks = [
  fetchGalaxies, fetchFeedGalaxy, fetchGalaxyDraft, createGalaxyDraft, publishGalaxyDraft, deleteGalaxy, likeGalaxy,
] as const

const galaxiesSlice = createSlice({
  name: 'galaxies',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchGalaxies.fulfilled, (state, action) => { state.list = action.payload })
      .addCase(fetchFeedGalaxy.fulfilled, (state, action) => { state.current = action.payload })
      .addCase(fetchGalaxyDraft.fulfilled, (state, action) => { state.draft = action.payload })
      .addCase(createGalaxyDraft.fulfilled, (state, action) => { state.draft = action.payload })
      .addCase(publishGalaxyDraft.fulfilled, state => { state.draft = null })
      .addCase(deleteGalaxy.fulfilled, (state, action) => {
        state.list = state.list.filter(g => g.id !== action.payload)
      })
      .addCase(likeGalaxy.fulfilled, (state, action) => {
        const { id, likes_count, is_liked } = action.payload
        for (const g of [state.current, ...state.list]) {
          if (g && g.id === id) { g.likes_count = likes_count; g.is_liked = is_liked }
        }
      })
      // общие для всех thunk-ов: флаг загрузки и ошибка
      .addMatcher(isPending(...thunks), state => { state.loading = true; state.error = null })
      .addMatcher(isFulfilled(...thunks), state => { state.loading = false })
      .addMatcher(isRejected(...thunks), (state, action) => {
        state.loading = false
        state.error = (action.payload as string | undefined) ?? 'Ошибка запроса'
      })
  },
})

export default galaxiesSlice.reducer
