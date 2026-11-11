import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../api/auth'

// Состояние интерфейса после авторизации: null — гость, иначе пользователь.
// В localStorage не сохраняется: после F5 интерфейс снова гостевой.
interface AuthState {
  user: User | null
}

const initialState: AuthState = { user: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    logoutSuccess(state) {
      state.user = null
    },
  },
})

export const { loginSuccess, logoutSuccess } = authSlice.actions
export default authSlice.reducer
