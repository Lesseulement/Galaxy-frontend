import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { logoutSuccess } from './authSlice'

export const MAG_MIN = 8    // границы слайдеров видимой звёздной величины
export const MAG_MAX = 15

// Фильтр плитки: видимая звёздная величина «от» – «до»
interface FilterState {
  magnitudeFrom: number
  magnitudeTo: number
}

const initialState: FilterState = { magnitudeFrom: MAG_MIN, magnitudeTo: MAG_MAX }

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setMagnitudeRange(state, action: PayloadAction<{ from: number; to: number }>) {
      state.magnitudeFrom = action.payload.from
      state.magnitudeTo = action.payload.to
    },
  },
  // при выходе фильтр пользователя сбрасывается
  extraReducers: builder => {
    builder.addCase(logoutSuccess, () => initialState)
  },
})

export const { setMagnitudeRange } = filterSlice.actions
export default filterSlice.reducer
