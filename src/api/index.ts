import { Api } from './Api'

// Экземпляр сгенерированного клиента (swagger-typescript-api, axios).
// baseURL пустой: запросы идут на /api/... того же адреса 127.0.0.1:3000,
// а прокси Vite пересылает их веб-сервису — так обходится CORS.
export const api = new Api({ baseURL: '' })
