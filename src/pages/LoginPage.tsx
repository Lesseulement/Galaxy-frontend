import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Container, Form } from 'react-bootstrap'
import { login } from '../api/auth'
import Loader from '../components/Loader'
import { useAppDispatch } from '../store/hooks'
import { loginSuccess } from '../store/authSlice'

// Страница «Вход»: axios-запрос без кодогенерации и thunk, результат вручную передаётся в Redux
export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await login(username.trim(), password)
      dispatch(loginSuccess(user))      // интерфейс пользователя: в меню «Выход»
      navigate('/galaxies')
    } catch {
      setError('Неверный логин или пароль')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container className="page">
      <h1 className="page-title">Вход</h1>
      <Form onSubmit={handleSubmit}>
        <label className="group"><span className="label">Логин</span>
          <Form.Control className="field" value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label className="group"><span className="label">Пароль</span>
          <Form.Control className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error-text">{error}</p>}
        <Button type="submit" className="btn-gold w-100">Войти</Button>
      </Form>
      <Loader show={busy} />
    </Container>
  )
}
