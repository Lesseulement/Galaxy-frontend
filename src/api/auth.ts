import axios from 'axios'

// Авторизация и деавторизация — только axios, без кодогенерации и thunk.
// Результат вручную передаётся в Redux (см. LoginPage и BottomNav).

export interface User {
  id: number
  username: string
}

// Вход: веб-сервис создаёт сессию в Redis и ставит куку session_id
export async function login(username: string, password: string): Promise<User> {
  const response = await axios.post<User>('/api/users/login', { username, password })
  return response.data
}

// Выход: веб-сервис удаляет сессию из Redis и куку session_id
export async function logout(): Promise<void> {
  await axios.post('/api/users/logout')
}
