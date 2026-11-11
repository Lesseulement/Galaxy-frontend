# ЛР6. Фронтенд «Галактики»: Redux Toolkit, авторизация, axios и кодогенерация

Определение расстояния до галактики по сверхновым типа Ia.
SPA на React + TypeScript + Vite + React-Bootstrap. Данные — из веб-сервиса (ЛР4) через прокси Vite.

## Запуск

1. Бэкенд (папка `galaxy`): `docker compose up -d`, затем `uvicorn main:app --reload --port 8001`.
2. Фронтенд:

```bash
npm install
npm run api   # кодогенерация src/api/Api.ts из http://127.0.0.1:8001/openapi.json
npm run dev
```

Приложение: http://127.0.0.1:3000

## Прокси (обход CORS) — `vite.config.ts`

| Маршрут | Куда | Зачем |
|---|---|---|
| `/api/...` | `http://127.0.0.1:8001` | AJAX-запросы к веб-сервису |
| `/s3/...` | `http://127.0.0.1:9000` | фото и видео из MinIO (S3) |

Ссылки `http://localhost:9000/galaxies.media/...` из ответа веб-сервиса заменяются на `/s3/galaxies.media/...` (`src/media.ts`).

## Страницы и меню

Меню из 4 пунктов: **Лента**, **Добавление**, **Плитка**, **Вход / Выход**.

| Страница | Гость | Пользователь |
|---|---|---|
| Лента `/feed`, `/feed/:id` | просмотр, «›» — следующая | + лайк (сердечко) |
| Плитка `/galaxies` | фильтр по видимой звёздной величине, карточки | + кнопка «Удалить» у своих галактик |
| Добавление `/add` | недоступно | «Далее» (название, фото, видео), затем «Опубликовать» |
| Вход `/login` | логин и пароль | в меню вместо «Вход» — «Выход» |

При выходе фильтр сбрасывается. После F5 интерфейс снова гостевой (состояние Redux не сохраняется), кука `session_id` остаётся в браузере.

## Redux Toolkit — `src/store`

| Срез | Состояние | Как меняется |
|---|---|---|
| `auth` | `user` — пользователь или `null` (гость) | вручную: `loginSuccess`, `logoutSuccess` после axios-запроса |
| `filter` | `magnitudeFrom`, `magnitudeTo` | `setMagnitudeRange`; сброс при `logoutSuccess` |
| `galaxies` | `list`, `current`, `draft`, `loading`, `error` | thunk-и |

Thunk-и (`src/store/galaxiesSlice.ts`) вызывают сгенерированный клиент `api.galaxies.*`:
`fetchGalaxies`, `fetchFeedGalaxy`, `fetchGalaxyDraft`, `createGalaxyDraft`, `publishGalaxyDraft`, `deleteGalaxy`, `likeGalaxy`.
Пока идёт запрос, поверх страницы показывается анимация и кнопки нажать нельзя (`Loader`).

Если веб-сервис недоступен, гость получает данные из mock-коллекции `src/mock.ts` (только плитка и лента).

## Авторизация — `src/api/auth.ts`

Только axios, без кодогенерации и thunk: `login` → `POST /api/users/login`, `logout` → `POST /api/users/logout`.
Результат вручную передаётся в Redux (`LoginPage`, `BottomNav`).

## Структура

```
src/
  api/Api.ts                 сгенерированный клиент (swagger-typescript-api, axios)
  api/index.ts               экземпляр api
  api/auth.ts                вход и выход (axios)
  store/index.ts             configureStore
  store/authSlice.ts         авторизация
  store/filterSlice.ts       фильтр
  store/galaxiesSlice.ts     галактики и thunk-и
  store/hooks.ts             useAppDispatch, useAppSelector
  pages/FeedPage.tsx         Лента
  pages/AddPage.tsx          Добавление
  pages/GalaxiesPage.tsx     Плитка
  pages/LoginPage.tsx        Вход
  components/                меню, карточка, фильтр, анимация загрузки, иконки
  mock.ts                    mock-коллекция
  media.ts                   фото и видео по умолчанию, ссылки через /s3
```
