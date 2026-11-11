import { useState } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logoutSuccess } from '../store/authSlice'
import Loader from './Loader'
import { AddIcon, FeedIcon, GridIcon, LoginIcon, LogoutIcon } from './Icons'

// Нижнее меню из 4 пунктов. Гость: «Добавление» недоступно, справа «Вход».
// Пользователь: «Добавление» доступно, справа «Выход».
export default function BottomNav() {
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  // Выход: axios-запрос, затем вручную сбрасываем состояние в Redux (фильтр сбрасывается тоже)
  const handleLogout = async () => {
    setBusy(true)
    try {
      await logout()
    } catch {
      // сессия уже могла истечь — интерфейс всё равно переключаем на гостя
    }
    dispatch(logoutSuccess())
    setBusy(false)
    navigate('/galaxies')
  }

  return (
    <>
      <Navbar fixed="bottom" className="bottom-nav">
        <Nav className="w-100 justify-content-around">
          <Nav.Link as={NavLink} to="/feed" className="tab"><FeedIcon /><span>Лента</span></Nav.Link>
          {user
            ? <Nav.Link as={NavLink} to="/add" className="tab"><AddIcon /><span>Добавление</span></Nav.Link>
            : <Nav.Link disabled className="tab"><AddIcon /><span>Добавление</span></Nav.Link>}
          <Nav.Link as={NavLink} to="/galaxies" className="tab"><GridIcon /><span>Плитка</span></Nav.Link>
          {user
            ? <Nav.Link as="button" className="tab" onClick={handleLogout}><LogoutIcon /><span>Выход</span></Nav.Link>
            : <Nav.Link as={NavLink} to="/login" className="tab"><LoginIcon /><span>Вход</span></Nav.Link>}
        </Nav>
      </Navbar>
      <Loader show={busy} />
    </>
  )
}
