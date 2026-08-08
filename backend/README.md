# QuickBite API

## Setup

Copy `.env.example` to `.env`, then update `DATABASE_URL` and `JWT_SECRET`.
Set `REDIS_URL` to your Redis instance for shared cache and rate limiting.
If Redis is unavailable locally, the API still starts and falls back without Redis.

```bash
psql "$DATABASE_URL" -f database/schema.sql
npm run backend:dev
```

Run the Vite frontend in another terminal:

```bash
npm run dev
```

## Auth Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

## Catalog Routes

- `GET /api/catalog`
- `GET /api/catalog/restaurants`
- `GET /api/catalog/restaurants/:id`
- `GET /api/catalog/foods`
- `GET /api/catalog/foods/:id`

Send protected requests with:

```http
Authorization: Bearer <jwt>
```
