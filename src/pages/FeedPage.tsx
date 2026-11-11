import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { imageOf, onImageError, onVideoError, videoOf } from '../media'
import { HeartIcon } from '../components/Icons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchFeedGalaxy, likeGalaxy } from '../store/galaxiesSlice'

// Страница «Лента»: одна галактика на весь экран, справа лайк, параметры и кнопка «Следующая»
export default function FeedPage() {
  const { id } = useParams()              // /feed/:id — какую галактику открыть
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { current: galaxy, loading, error } = useAppSelector(state => state.galaxies)
  const user = useAppSelector(state => state.auth.user)
  const alreadyLoaded = useRef(false)     // следующая галактика уже получена кнопкой «›»

  // при смене id в адресе загружаем галактику: без id — первую в ленте
  useEffect(() => {
    if (alreadyLoaded.current) { alreadyLoaded.current = false; return }
    dispatch(fetchFeedGalaxy({ id: id ? Number(id) : undefined }))
  }, [dispatch, id, user])

  // стрелка «Следующая»: следующая опубликованная галактика (по кругу)
  const showNext = async () => {
    if (!galaxy) return
    const result = await dispatch(fetchFeedGalaxy({ id: galaxy.id, next: true }))
    const nextGalaxy = fetchFeedGalaxy.fulfilled.match(result) ? result.payload : null
    if (nextGalaxy && nextGalaxy.id !== galaxy.id) {
      alreadyLoaded.current = true
      navigate(`/feed/${nextGalaxy.id}`)
    }
  }

  // сердечко: доступно только после входа
  const toggleLike = () => {
    if (galaxy) dispatch(likeGalaxy({ id: galaxy.id, like: galaxy.is_liked === 1 ? 0 : 1 }))
  }

  if (!galaxy) return <div className="feed-empty">{loading ? '' : error ?? 'В ленте пока нет галактик'}</div>

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
        <Button variant="link" className="side-btn" disabled={!user} onClick={toggleLike}
          title={user ? 'Лайк' : 'Доступно после входа'}>
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
