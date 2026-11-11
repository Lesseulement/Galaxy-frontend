import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Loader from './components/Loader'
import GalaxiesPage from './pages/GalaxiesPage'
import FeedPage from './pages/FeedPage'
import AddPage from './pages/AddPage'
import LoginPage from './pages/LoginPage'
import { useAppSelector } from './store/hooks'

// Маршруты: /feed — лента, /add — добавление, /galaxies — плитка, /login — вход
export default function App() {
  const loading = useAppSelector(state => state.galaxies.loading)

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/galaxies" replace />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/feed/:id" element={<FeedPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/galaxies" element={<GalaxiesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/galaxies" replace />} />
        </Routes>
        <BottomNav />
        {/* пока идёт запрос thunk-а — анимация поверх страницы */}
        <Loader show={loading} />
      </div>
    </BrowserRouter>
  )
}
