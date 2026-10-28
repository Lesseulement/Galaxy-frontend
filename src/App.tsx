import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import GalaxiesPage from './pages/GalaxiesPage'
import FeedPage from './pages/FeedPage'

// Маршруты: /galaxies — плитка, /feed и /feed/:id — лента
export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/galaxies" replace />} />
          <Route path="/galaxies" element={<GalaxiesPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/feed/:id" element={<FeedPage />} />
          <Route path="*" element={<Navigate to="/galaxies" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
