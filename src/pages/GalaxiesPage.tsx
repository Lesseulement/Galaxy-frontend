import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import MagnitudeFilter from '../components/MagnitudeFilter'
import GalaxyCard from '../components/GalaxyCard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { MAG_MAX, MAG_MIN, setMagnitudeRange } from '../store/filterSlice'
import { deleteGalaxy, fetchGalaxies } from '../store/galaxiesSlice'

// Страница «Плитка»: фильтр (хранится в Redux) и карточки галактик в два столбца
export default function GalaxiesPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { magnitudeFrom, magnitudeTo } = useAppSelector(state => state.filter)
  const { list, loading, error } = useAppSelector(state => state.galaxies)
  const user = useAppSelector(state => state.auth.user)

  // загрузка при открытии страницы и при входе/выходе
  useEffect(() => { dispatch(fetchGalaxies()) }, [dispatch, user])

  return (
    <Container className="page">
      <h1 className="page-title">База галактик</h1>
      <MagnitudeFilter
        min={MAG_MIN} max={MAG_MAX}
        value={{ from: magnitudeFrom, to: magnitudeTo }}
        onChange={range => dispatch(setMagnitudeRange(range))}
        onSearch={() => dispatch(fetchGalaxies())}
      />
      {error && <p className="error-text">{error}</p>}
      {!loading && list.length === 0
        ? <p className="empty">Ничего не найдено. Попробуйте изменить фильтр.</p>
        : (
          <Row xs={2} className="g-3">
            {list.map(g => (
              <Col key={g.id}>
                <GalaxyCard
                  galaxy={g}
                  onOpen={id => navigate(`/feed/${id}`)}
                  onDelete={user && g.is_mine === 1 ? id => dispatch(deleteGalaxy(id)) : undefined}
                />
              </Col>
            ))}
          </Row>
        )}
    </Container>
  )
}
