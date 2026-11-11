import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Container, Form } from 'react-bootstrap'
import { defaultImage, defaultVideo, imageOf, onImageError, onVideoError, videoOf } from '../media'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createGalaxyDraft, fetchGalaxyDraft, publishGalaxyDraft } from '../store/galaxiesSlice'

// Страница «Добавление» (макет ЛР1 «Регистрация сверхновой»), только для пользователя.
// Шаг 1: название, фото, видео -> «Далее» (черновик). Шаг 2: поля -> «Опубликовать».
export default function AddPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(state => state.auth.user)
  const { draft, error } = useAppSelector(state => state.galaxies)

  const [title, setTitle] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [supernova, setSupernova] = useState('')
  const [magnitude, setMagnitude] = useState('')
  const [distance, setDistance] = useState('')
  const [description, setDescription] = useState('')

  // предпросмотр выбранных файлов; пока файл не выбран — фото и видео по умолчанию
  const imagePreview = useMemo(() => (image ? URL.createObjectURL(image) : defaultImage), [image])
  const videoPreview = useMemo(() => (video ? URL.createObjectURL(video) : defaultVideo), [video])

  // при открытии страницы — черновик пользователя, если он уже есть
  useEffect(() => { if (user) dispatch(fetchGalaxyDraft()) }, [dispatch, user])

  if (!user) return <Navigate to="/login" replace />

  // «Далее»: создать черновик
  const handleNext = (e: FormEvent) => {
    e.preventDefault()
    if (title.trim() && image && video) dispatch(createGalaxyDraft({ title: title.trim(), image, video }))
  }

  // «Опубликовать»: сохранить поля и перейти в ленту к новой галактике
  const handlePublish = async (e: FormEvent) => {
    e.preventDefault()
    const result = await dispatch(publishGalaxyDraft({
      supernova: supernova.trim(),
      apparent_magnitude: Number(magnitude.replace(',', '.')),
      distance_mpc: Number(distance.replace(',', '.')),
      description: description.trim() || null,
    }))
    if (publishGalaxyDraft.fulfilled.match(result)) navigate(`/feed/${result.payload.id}`)
  }

  return (
    <Container className="page">
      <h1 className="page-title">Регистрация сверхновой</h1>

      {!draft ? (
        <Form key="step-next" onSubmit={handleNext}>
          <div className="group">
            <span className="label">Фото</span>
            <div className="preview mb-2"><img className="preview-media" src={imagePreview} alt="Фото" /></div>
            <Form.Control className="field" type="file" accept="image/*" required
              onChange={e => setImage((e.target as HTMLInputElement).files?.[0] ?? null)} />
          </div>
          <div className="group">
            <span className="label">Видео</span>
            <div className="preview mb-2">
              <video key={videoPreview} className="preview-media" src={videoPreview} autoPlay muted loop playsInline />
            </div>
            <Form.Control className="field" type="file" accept="video/*" required
              onChange={e => setVideo((e.target as HTMLInputElement).files?.[0] ?? null)} />
          </div>
          <label className="group"><span className="label">Название</span>
            <Form.Control className="field" value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" className="btn-gold w-100">Далее</Button>
        </Form>
      ) : (
        <Form key="step-publish" onSubmit={handlePublish}>
          <div className="group">
            <span className="label">Фото</span>
            <div className="preview">
              <img className="preview-media" src={imageOf(draft.image_url)} onError={onImageError} alt={draft.title} />
            </div>
          </div>
          <div className="group">
            <span className="label">Видео</span>
            <div className="preview">
              <video className="preview-media" src={videoOf(draft.video_url)} onError={onVideoError} autoPlay muted loop playsInline />
            </div>
          </div>
          <label className="group"><span className="label">Название</span>
            <Form.Control className="field" value={draft.title} disabled />
          </label>
          <label className="group"><span className="label">ID сверхновой</span>
            <Form.Control className="field" value={supernova} onChange={e => setSupernova(e.target.value)} required />
          </label>
          <div className="row g-2">
            <label className="group col"><span className="label">Видимая величина, m</span>
              <Form.Control className="field" inputMode="decimal" value={magnitude} onChange={e => setMagnitude(e.target.value)} required />
            </label>
            <label className="group col"><span className="label">Расстояние, Мпк</span>
              <Form.Control className="field" inputMode="decimal" value={distance} onChange={e => setDistance(e.target.value)} required />
            </label>
          </div>
          <label className="group"><span className="label">Описание</span>
            <Form.Control className="field" as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </label>
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" className="btn-gold w-100">Опубликовать</Button>
        </Form>
      )}
    </Container>
  )
}
