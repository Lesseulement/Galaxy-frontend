import { Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { AddIcon, FeedIcon, GridIcon, LoginIcon } from './Icons'

// Нижнее меню из 4 пунктов. В ЛР5 доступны только «Лента» и «Плитка»,
// «Добавление» и «Вход» появятся вместе с авторизацией (disabled).
export default function BottomNav() {
  return (
    <Navbar fixed="bottom" className="bottom-nav">
      <Nav className="w-100 justify-content-around">
        <Nav.Link as={NavLink} to="/feed" className="tab"><FeedIcon /><span>Лента</span></Nav.Link>
        <Nav.Link disabled className="tab"><AddIcon /><span>Добавление</span></Nav.Link>
        <Nav.Link as={NavLink} to="/galaxies" className="tab"><GridIcon /><span>Плитка</span></Nav.Link>
        <Nav.Link disabled className="tab"><LoginIcon /><span>Вход</span></Nav.Link>
      </Nav>
    </Navbar>
  )
}
