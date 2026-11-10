import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Spinner } from 'react-bootstrap'
import type { Galaxy } from '../types'
import { getFeed } from '../api/galaxies'
import { imageOf, onImageError, onVideoError, videoOf } from '../media'
import { HeartIcon } from '../components/Icons'

// Страница «Лента»: одна галактика на весь экран, справа параметры и кнопка «Следующая»
export default function FeedPage() {
  const { id } = useParams()              // /feed/:id — какую галактику открыть
  const navigate = useNavigate()
  const [galaxy, setGalaxy] = useState<Galaxy | null>(null)
  const [loading, setLoading] = useState(true)

  // при смене id в адресе загружаем галактику: без id — первую в ленте
  useEffect(() => {
    setLoading(true)
    getFeed(id ? Number(id) : undefined).then(item => {
      setGalaxy(item)
      setLoading(false)
    })
  }, [id])

  // стрелка «Следующая»: следующая опубликованная галактика (по кругу)
  const showNext = async () => {
    if (!galaxy) return
    const nextGalaxy = await getFeed(galaxy.id, true)
    if (nextGalaxy) navigate(`/feed/${nextGalaxy.id}`)
  }

  if (loading) return <div className="feed-empty"><Spinner animation="border" /></div>
  if (!galaxy) return <div className="feed-empty">В ленте пока нет галактик</div>

  return (
    <div className="feed">
      {/* есть своё видео — показываем его, иначе фото; пустые поля — файлы по умолчанию */}
      {galaxy.video_url
        ? <video key={galaxy.id} className="feed-media" src={videoOf(galaxy.video_url)} onError={onVideoError} autoPlay muted loop playsInline />
        : galaxy.image_url
          ? <img key={galaxy.id} className="feed-media" src={imageOf(galaxy.image_url)} onError={onImageError} alt={galaxy.title} />
          : <video key={galaxy.id} className="feed-media" src={videoOf(null)} autoPlay muted loop playsInline />}
      <div className="feed-shade" />

      <aside className="feed-side">
        {/* лайк доступен только после входа — для гостя кнопка неактивна */}
        <Button variant="link" className="side-btn" disabled title="Доступно после входа">
          <HeartIcon filled={galaxy.is_liked === 1} />
        </Button>
        <span className="side-value">{galaxy.likes_count}</span>

        <div className="param">
          <span className="side-value">{galaxy.apparent_magnitude ?? '—'}<small>m</small></span>
          <span className="param-label">видимая<br />звёздная<br />величина</span>
        </div>
        <div className="param">
          <span className="side-value">{galaxy.distance_mpc ?? '—'}</span>
          <span className="param-label">Мпк</span>
        </div>

        <Button variant="link" className="side-btn side-next" onClick={showNext} aria-label="Следующая галактика">
          <svg viewBox="0 0 24 24"><path d="m10 7 5 5-5 5" /></svg>
        </Button>
      </aside>

      <div className="feed-info">
        <h1 className="feed-title">Галактика {galaxy.title}</h1>
        {galaxy.description && <p className="feed-text">{galaxy.description}</p>}
        {galaxy.supernova && <span className="chip">Сверхновая {galaxy.supernova}</span>}
      </div>
    </div>
  )
}
