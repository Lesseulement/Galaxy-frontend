# ЛР7. Фронтенд «Галактики»: адаптивность, PWA, GitHub Pages, HTTPS

Определение расстояния до галактики по сверхновым типа Ia.
SPA на React + TypeScript + Vite + React-Bootstrap + Redux Toolkit. Данные — из веб-сервиса (ЛР4) через реверс-прокси Vite.

GitHub Pages (только mock): https://lesseulement.github.io/Galaxy-frontend/

## Запуск

1. Бэкенд (папка `galaxy`): `docker compose up -d`, затем `uvicorn main:app --reload --port 8001`.
2. Сертификат для HTTPS (один раз, в папке фронтенда; IP ноутбука — свой):

```bash
npx mkcert create-ca
npx mkcert create-cert --domains localhost 127.0.0.1 192.168.0.101
```

Появятся `ca.crt`, `ca.key`, `cert.crt`, `cert.key` (в git не попадают — `.gitignore`).

3. Фронтенд:

```bash
npm install
npm run dev
```

Приложение: https://127.0.0.1:3000/Galaxy-frontend/ , с телефона в той же сети: https://IP-ноутбука:3000/Galaxy-frontend/

## GitHub Pages

```bash
npm run build
npm run deploy      # gh-pages -d dist — папка dist в ветку gh-pages
```

В репозитории: Settings → Pages → Deploy from a branch → `gh-pages` / root.
На GitHub Pages бэкенда нет: на адресе `*.github.io` thunk-и сразу берут данные из mock-коллекции.

| Настройка | Где | Значение |
|---|---|---|
| `base` | `vite.config.ts` | `/Galaxy-frontend/` |
| `basename` | `App.tsx`, `BrowserRouter` | `/Galaxy-frontend` |
| фото mock | `src/mock.ts` | `${import.meta.env.BASE_URL}mock/...` |

## PWA

`vite-plugin-pwa` (`vite.config.ts`): manifest (название «Галактики», `start_url` `/Galaxy-frontend/`, `display: standalone`, иконки `public/logo192.png`, `public/logo512.png`) и service worker (кэш страниц, скриптов, стилей, фото и видео — работает офлайн). Регистрация — `registerSW()` в `src/main.tsx`.

## HTTPS и доступ с телефона

`vite.config.ts`: `server.https` — ключ `cert.key` и сертификат `cert.crt`; `host: true` — сервер доступен по IP ноутбука. Телефон обращается к ноутбуку, реверс-прокси Vite пересылает `/api` веб-сервису (8001), `/s3` — в MinIO (9000).

## Адаптивность (3 страницы)

| Страница | Телефон < 576px | Планшет 576–991px | Компьютер ≥ 992px |
|---|---|---|---|
| Плитка | 2 колонки, фото 110px | 3 колонки, фото 140px | 4 колонки, фото 180px, фильтр до 560px |
| Лента | фото/видео на весь экран | от 768px: карточка 720px по центру, заголовок 28px | так же |
| Добавление | фото и видео в 1 столбец, превью 160px | от 768px: форма 720px, 2 столбца, превью 220px | так же |

Колонки — `GalaxiesPage.tsx`: `<Row xs={2} sm={3} lg={4}>`; размеры — `src/App.css`, блок «АДАПТИВНОСТЬ».

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

## Диаграмма развёртывания

`reports/deployment_LR7.drawio`, `.png`.

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
