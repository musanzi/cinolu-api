# OneStop API

OneStop is a platform for managing portfolios, programs, activities, and ventures. This NestJS API handles user accounts, activity participation and reviews, venture submissions, and staff administration.

## Features

- Organize programs within portfolios and manage activities with types, categories, schedules, participation forms, and review forms.
- Publish activities for public browsing. Signed-in users can submit participations and reviews.
- Let users submit ventures with logos and cover images; staff can review their status.
- Manage users, roles, sectors, and platform statistics. Staff can import and export users as CSV.
- Sign in with email/password or Google, manage profiles, and reset passwords by email.

The API uses NestJS 11, TypeScript, CQRS, TypeORM, PostgreSQL 18, Redis 8-backed sessions, Passport, and pnpm. Uploaded files are served from `/uploads`.

## Quick start with Docker

Docker with Compose is required. Copy the environment template:

```bash
cp .env.example .env
```

Set the database credentials, `SESSION_SECRET`, `SESSION_MAX_AGE` (milliseconds), `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `.env`. For the Compose stack, set:

```env
PORT=8000
DB_HOST=db
DB_PORT=5432
REDIS_URL=redis://redis:6379
```

Configure the mail, Google OAuth, and `FRONTEND_URI` values for the corresponding authentication and email flows. Use nonempty, private secrets and passwords. The API and database containers use the same `DB_USERNAME`, `DB_PASSWORD`, and `DB_NAME` values from `.env`.

Start the development stack:

```bash
docker compose -f compose.dev.yml up --build -d
```

This starts the API at `http://localhost:8000` (or your `PORT`), PostgreSQL and Redis on the Compose network, and Adminer at `http://localhost:8080`. The API source is mounted into the container and runs in watch mode.

Build the app, apply the existing database migration, and seed the roles and initial staff account:

```bash
docker compose -f compose.dev.yml exec api pnpm build
docker compose -f compose.dev.yml exec api pnpm db:up
docker compose -f compose.dev.yml exec api pnpm db:seed
```

The seed uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`. Run it only where that account should exist; running it again updates the account's password and staff role.

## Local development

With Node.js 24+, pnpm, PostgreSQL, and Redis installed, create `.env` from the template and point `DB_HOST` and `REDIS_URL` to your local services. Then run:

```bash
pnpm install
pnpm build
pnpm db:up
pnpm start:dev
```

The API listens on `PORT`, defaulting to `3000` if it is unset.

## Database and scripts

TypeORM migrations live in `src/modules/database/migrations/`. The database schema is managed by migrations; TypeORM synchronization is disabled. Build before running migration or seed scripts because the TypeORM configuration loads compiled entities and migrations from `dist`.

| Command           | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| `pnpm start:dev`  | Run the API in watch mode.                     |
| `pnpm build`      | Compile to `dist`.                             |
| `pnpm start:prod` | Run the compiled API.                          |
| `pnpm db:up`      | Apply pending migrations.                      |
| `pnpm db:down`    | Revert the latest migration.                   |
| `pnpm db:seed`    | Create roles and the configured staff account. |
| `pnpm lint`       | Run ESLint with automatic fixes.               |
| `pnpm format`     | Format source TypeScript files.                |

## Production with Docker

After configuring `.env`, start the production stack and apply migrations:

```bash
docker compose -f compose.prod.yml up --build -d
docker compose -f compose.prod.yml exec api pnpm db:up
```

The production image is already compiled. PostgreSQL and Redis are accessible only on the Compose network. Their data is stored in the `postgres_data` and `redis_data` volumes; uploaded files are stored in `uploads_data`. `docker compose -f compose.prod.yml down` leaves these volumes intact.

## Project structure

Feature modules live under `src/modules/`, including `auth`, `users`, `roles`, `portfolios`, `programs`, `activities`, `categories`, `types`, `sectors`, `ventures`, `participations`, `reviews`, and `stats`. Database configuration, migrations, and the seed script are under `src/modules/database/`.

Modules use CQRS: read operations live in `queries`, state changes in `commands`, and side effects may use `events`. Controllers, DTOs, entities, interfaces, and shared helpers have their own folders. Modules access another module's data through its queries or commands.

Global validation, authentication, role checks, and request throttling are configured in `src/app.module.ts` and `src/main.ts`. The rate limit is 50 requests per 60 seconds. Sessions are stored in Redis with the `sess:` prefix and use `SameSite=Lax` cookies.
