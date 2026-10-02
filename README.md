# Full-Stack Frontend

Учебный full-stack проект: каталог товаров на Next.js (App Router) + Express API + PostgreSQL/Prisma.

## Стек и порты

| Часть | Технологии | Адрес |
| --- | --- | --- |
| `client/` | Next.js 16 (App Router, TypeScript), SSR/SSG | http://localhost:3000 |
| `server/` | Node.js + Express 4, Prisma 7 (driver adapter `pg`) | http://localhost:4000 |
| БД | PostgreSQL | localhost:5432, база `ishop` |

## Требования

- Node.js 20+ и npm
- PostgreSQL 14+ (локально или в Docker)

## 1. Настройка окружения

Ключи читаются из локальных файлов, которые не коммитятся.

`server/.env`:

```
DATABASE_URL="postgresql://ishop_app:magic@localhost:5432/ishop?schema=public"
```

`client/.env.local`:

```
API_URL=http://localhost:4000
```

Создайте в PostgreSQL роль и базу (или поправьте `DATABASE_URL` под свои):

```bash
psql -U postgres -c "CREATE ROLE ishop_app LOGIN PASSWORD 'magic';"
psql -U postgres -c "CREATE DATABASE ishop OWNER ishop_app;"
```

## 2. Установка зависимостей

```bash
cd server && npm install
cd ../client && npm install
```

`server` при `npm install` выполняет `prisma generate` (postinstall) — генерирует клиент в `server/src/generated/prisma`.

## 3. Подготовка БД (порядок важен)

```bash
cd server
npx prisma migrate deploy   # применить миграции из prisma/migrations
npx prisma db seed          # наполнить тестовыми товарами (prisma/seed.ts)
npm run db:check            # ожидаемо: "товаров в базе: N"
```

Prisma 7 читает настройки из `server/prisma7.config.ts` (schema, migrations, seed, datasource).

## 4. Запуск в dev-режиме

Сначала API, потом клиент — клиент ходит в API по `API_URL`.

```bash
# терминал 1
cd server
npm run dev          # tsx watch, http://localhost:4000

# терминал 2
cd client
npm run dev          # next dev, http://localhost:3000
```

Проверка API: http://localhost:4000/api/health → `{ "status": "ok" }`.

## 5. Production-сборка

**Порядок обязателен: сначала поднять PostgreSQL и API, затем собирать клиент.** На этапе `next build` работает `generateStaticParams()` в `client/app/product/[slug]/page.tsx`, который вызывает `getProducts()` и делает реальный `fetch(API_URL/api/products)`. Если API недоступен, сборка падает с `TypeError: fetch failed` / `ECONNREFUSED`.

```bash
# 1) БД и API должны быть запущены
cd server && npm run build && npm start   # или npm run dev

# 2) сборка и запуск клиента
cd ../client && npm run build && npm start
```

Если сборка не должна зависеть от живого API: в `generateStaticParams()` перехватить ошибку и вернуть `[]` (страницы станут динамическими) либо поставить `export const dynamic = 'force-dynamic'` в маршруте.

## API

| Метод | Путь | Ответ |
| --- | --- | --- |
| GET | `/api/health` | `{ "status": "ok" }` |
| GET | `/api/products` | `{ "data": Product[] }` |
| GET | `/api/products/:slug` | `{ "data": Product }` или 404 |

Коды ошибок: `SERVICE_UNAVAILABLE` (503, БД недоступна), `PRODUCT_NOT_FOUND` (404), `INTERNAL_SERVER_ERROR` (500).

## Обработка ошибок на клиенте

`client/app/error.tsx` — граница ошибок сегмента. Получает `error` и `retry()`; `retry()` заново запрашивает данные сегмента (нужно для восстановления после 503). Не перехватывает ошибки `layout` того же уровня и не заменяет серверную обработку ошибок.

## Полезные команды

```bash
# server
npm run dev | build | start | db:check | format | format:check

# client
npm run dev | build | start | lint | format | format:check
```
