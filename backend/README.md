# Stop Fish — Backend

Бэкенд для сайта Stop Fish: регистрация, вход и серверные сессии.

Стек: **Node.js + Express + SQLite** (`better-sqlite3`), пароли хэшируются через
`bcryptjs`, сессии хранятся на сервере (`express-session` +
`better-sqlite3-session-store`, в той же базе SQLite) и передаются клиенту через
подписанную HTTP-only cookie.

## Требования

- Node.js >= 18

## Установка и запуск

```bash
cd backend
cp .env.example .env      # при необходимости отредактируйте значения
npm install
npm start                 # или npm run dev для авто-перезапуска
```

Сервер поднимется на `http://localhost:3000` и одновременно отдаёт статический
сайт из корня репозитория. Откройте `http://localhost:3000/index.html`,
`http://localhost:3000/login.html`, `http://localhost:3000/registration.html`.

## Переменные окружения

Смотрите `.env.example`. Ключевые:

| Переменная           | Назначение                                                        |
| -------------------- | ----------------------------------------------------------------- |
| `PORT`               | Порт HTTP-сервера (по умолчанию 3000)                             |
| `NODE_ENV`           | `development` или `production`                                    |
| `SESSION_SECRET`     | Секрет для подписи cookie (обязателен в production)               |
| `SESSION_MAX_AGE_MS` | Время жизни сессии в миллисекундах (по умолчанию 7 дней)          |
| `CORS_ORIGINS`       | Список разрешённых origin-ов через запятую (для отдельного фронта)|
| `DATABASE_PATH`      | Путь к файлу базы данных SQLite                                   |

## API

Базовый префикс: `/api`. Все ответы — JSON. Аутентификация — по cookie сессии,
поэтому запросы с фронтенда отправляются с `credentials: "include"`.

### `POST /api/auth/register`

Создаёт пользователя и сразу открывает сессию.

```json
// запрос
{ "fullName": "Иван Петров", "email": "ivan@example.ru", "password": "secret123" }

// 201 Created
{ "user": { "id": 1, "fullName": "Иван Петров", "email": "ivan@example.ru", "createdAt": "..." } }
```

Ошибки: `400` — невалидные данные (`fields` содержит сообщения по полям),
`409` — email уже занят.

### `POST /api/auth/login`

```json
// запрос
{ "email": "ivan@example.ru", "password": "secret123" }

// 200 OK
{ "user": { "id": 1, "fullName": "Иван Петров", "email": "ivan@example.ru", "createdAt": "..." } }
```

Ошибки: `400` — невалидные данные, `401` — неверный email или пароль.

### `POST /api/auth/logout`

Завершает сессию и удаляет cookie. Ответ: `204 No Content`.

### `GET /api/auth/me`

Возвращает текущего пользователя по cookie сессии.

```json
// 200 OK
{ "user": { "id": 1, "fullName": "Иван Петров", "email": "ivan@example.ru", "createdAt": "..." } }
```

Ошибка: `401` — нет активной сессии.

### `GET /api/health`

Проверка живости: `{ "status": "ok" }`.

## Подключение фронтенда

Логика клиента вынесена в `js/auth.js` (в корне репозитория). Константа
`API_BASE` управляет адресом API:

- `""` (по умолчанию) — тот же origin. Используйте, когда сайт отдаётся этим же
  бэкендом (например, `http://localhost:3000`).
- Полный URL бэкенда (например `https://api.stop-fish.example`) — когда статика
  хостится отдельно (например на GitHub Pages). В этом случае также добавьте
  origin фронтенда в `CORS_ORIGINS`.

## Скрипты

- `npm start` — запуск сервера
- `npm run dev` — запуск с авто-перезапуском (`node --watch`)
- `npm run lint` — проверка ESLint
- `npm test` — модульные тесты (`node --test`)

## Заметки по безопасности

- Пароли хэшируются `bcryptjs` (12 раундов), в открытом виде не хранятся.
- Cookie сессии — `httpOnly`; в production включаются `secure` и `SameSite=None`.
- В production обязательно задайте сильный `SESSION_SECRET`.
- Файл базы данных и `.env` исключены из git (`.gitignore`).
