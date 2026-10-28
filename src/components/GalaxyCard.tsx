import { Card } from 'react-bootstrap'
import type { Galaxy } from '../types'
import { imageOf, onImageError } from '../media'
import { HeartIcon } from './Icons'

// Пропсы карточки: галактика и обработчик нажатия
interface Props {
  galaxy: Galaxy
  onOpen: (id: number) => void
}

// Карточка галактики на плитке
export default function GalaxyCard({ galaxy, onOpen }: Props) {
  return (
    <Card className="tile h-100" onClick={() => onOpen(galaxy.id)}>
      {/* нет фото или оно не загрузилось — фото по умолчанию */}
      <Card.Img variant="top" src={imageOf(galaxy.image_url)} onError={onImageError} alt={galaxy.title} />
      <Card.Body className="p-2">
        <Card.Title className="tile-title">{galaxy.title}</Card.Title>
        <Card.Text className="tile-meta">
          m = {galaxy.apparent_magnitude ?? '—'}, {galaxy.distance_mpc ?? '—'} Мпк
        </Card.Text>
        <div className="tile-likes"><HeartIcon filled={galaxy.is_liked === 1} />{galaxy.likes_count}</div>
      </Card.Body>
    </Card>
  )
}
