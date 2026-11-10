import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Container, Row, Spinner } from 'react-bootstrap'
import type { Galaxy, MagnitudeRange } from '../types'
import { getGalaxies } from '../api/galaxies'
import MagnitudeFilter from '../components/MagnitudeFilter'
import GalaxyCard from '../components/GalaxyCard'

const MAG_MIN = 8    // границы слайдеров видимой звёздной величины
const MAG_MAX = 15

// Страница «Плитка»: фильтр по видимой звёздной величине и карточки галактик в два столбца
export default function GalaxiesPage() {
  const [range, setRange] = useState<MagnitudeRange>({ from: MAG_MIN, to: MAG_MAX })
  const [galaxies, setGalaxies] = useState<Galaxy[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = async (value: MagnitudeRange) => {
    setLoading(true)
    setGalaxies(await getGalaxies(value))
    setLoading(false)
  }

  // первая загрузка списка при открытии страницы
  useEffect(() => { load(range) }, [])

  return (
    <Container className="page">
      <h1 className="page-title">База галактик</h1>
      <MagnitudeFilter min={MAG_MIN} max={MAG_MAX} value={range} onChange={setRange} onSearch={() => load(range)} />
      {loading
        ? <div className="text-center my-4"><Spinner animation="border" /></div>
        : galaxies.length === 0
          ? <p className="empty">Ничего не найдено. Попробуйте изменить фильтр.</p>
          : (
            <Row xs={2} className="g-3">
              {galaxies.map(g => (
                <Col key={g.id}>
                  <GalaxyCard galaxy={g} onOpen={id => navigate(`/feed/${id}`)} />
                </Col>
              ))}
            </Row>
          )}
    </Container>
  )
}
