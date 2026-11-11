import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import filterReducer from './filterSlice'
import galaxiesReducer from './galaxiesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,         
    filter: filterReducer,     
    galaxies: galaxiesReducer, 
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
