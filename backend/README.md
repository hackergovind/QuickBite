# QuickBite API

## Setup

Copy `.env.example` to `.env`, then update `DATABASE_URL` and `JWT_SECRET`.

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

Send protected requests with:

```http
Authorization: Bearer <jwt>
```
