# OneStop API

Backend for OneStop, an activity and program management platform. The API manages portfolios, programs, activities, registrations, reviews, users, and roles through a session-authenticated NestJS application.

## What the application does

- Organizes programs inside portfolios.
- Assigns one or more users as program managers.
- Creates activities with a type, categories, schedule, participation form, and review form.
- Lets authenticated users register for ongoing activities and submit one review per activity.
- Lets program managers and administrators manage activities, registrations, review results, and CSV exports.
- Provides local and Google authentication, account management, password reset emails, role-based access control, and user CSV import/export.

## Technology

- Node.js 24 and TypeScript
- NestJS 11 with Express 5
- Nest CQRS commands, queries, and events
- PostgreSQL 18 with TypeORM
- Redis 8-backed sessions with Passport
- Local and Google OAuth authentication
- Nodemailer, Pino, class-validator, and fast-csv
- pnpm, ESLint, Prettier, Husky, Docker, and Docker Compose

## Domain and access model

```text
Portfolio
  └── Program
        ├── Program managers (users)
        └── Activity
              ├── Type
              ├── Categories
              ├── Participation form → user participations
              └── Review form        → user reviews
```

There are two roles: `admin` and `user`.

- Administrators manage portfolios, programs, activity types, activity categories, users, and roles. They can also manage every activity and inspect every participation or review.
- Program managers are regular users assigned through a program's `programManagerIds`. They can create and manage activities for their programs, process participations, export participants, and inspect reviews and statistics.
- Authenticated users can browse available activities, submit one participation and one review per activity, and manage their own submissions subject to the activity rules.
- `GET /activities/recent` is public. Every other non-auth endpoint is explicitly listed as public below.

## Prerequisites

- Node.js 24+
- pnpm
- PostgreSQL and Redis, or Docker with Docker Compose

## Quick start with Docker

Create the environment file and fill in the required values:

```bash
cp .env.example .env
```

When the API runs in Compose, use the service names for its dependencies:

```env
DB_HOST=db
REDIS_URL=redis://redis:6379
```

Start the development stack:

```bash
docker compose -f compose.dev.yml up --build
```

The stack includes:

- API at `http://localhost:${PORT}`
- PostgreSQL on the internal Compose network
- Redis on the internal Compose network
- Adminer at `http://localhost:8080`

Apply the database migration and optionally load the development users:

```bash
docker compose -f compose.dev.yml exec api pnpm build
docker compose -f compose.dev.yml exec api pnpm db:up
docker compose -f compose.dev.yml exec api pnpm db:seed
```

The seed creates these accounts:

- `admin@admin.com` / `admin1234`
- `user@user.com` / `user1234`

Do not use the seeded passwords outside local development.

## Local development

Install dependencies and create the environment file:

```bash
pnpm install
cp .env.example .env
```

## Scripts

| Command                             | Description                              |
| ----------------------------------- | ---------------------------------------- |
| `pnpm start`                        | Start NestJS once.                       |
| `pnpm start:dev`                    | Start NestJS in watch mode.              |
| `pnpm start:debug`                  | Start watch mode with the Node debugger. |
| `pnpm build`                        | Compile the application to `dist`.       |
| `pnpm start:prod`                   | Run the compiled application.            |
| `pnpm lint`                         | Run ESLint and apply safe fixes.         |
| `pnpm format`                       | Format TypeScript files under `src`.     |
| `name=my_migration pnpm db:migrate` | Generate a TypeORM migration.            |
| `pnpm db:up`                        | Apply pending migrations.                |
| `pnpm db:down`                      | Revert the latest migration.             |
| `pnpm db:seed`                      | Seed the local admin and user accounts.  |

## Project structure

```text
src/
├── main.ts                     # HTTP, CORS, validation, Redis sessions, Passport
├── app.module.ts               # root modules, logging, mail, throttling, global guards
├── modules/
│   ├── activities/             # activities, types, categories, and access rules
│   ├── auth/                   # sessions, local/Google auth, password flows
│   ├── database/               # TypeORM configuration, migrations, seeds
│   ├── participations/         # registration submissions, statuses, CSV export
│   ├── portfolios/             # portfolio management
│   ├── programs/               # programs and manager assignments
│   ├── reviews/                # review submissions and aggregate statistics
│   ├── roles/                  # role administration
│   ├── stats/                  # administration totals
│   └── users/                  # users, avatars, CSV import/export
└── shared/
    ├── abstracts/              # common entity and controller bases
    ├── helpers/                # pagination, uploads, CSV, email templates
    └── interfaces/             # shared contracts
```

Feature modules follow CQRS and barrel exports. Reads live under `queries`, writes under `commands`, and side effects may use `events`. Controllers, DTOs, entities, interfaces, and reusable helpers remain in their dedicated folders. Cross-module data access is performed through the owning module's queries or commands rather than by injecting another module's repository.

## Runtime notes

- Global validation transforms request values using Nest's `ValidationPipe`.
- Authentication, role checks, and throttling are global guards.
- The rate limit is 50 requests per 60 seconds.
- Redis session keys use the `sess:` prefix; cookies use `SameSite=Lax`.
- PostgreSQL and Redis data are persisted in named Compose volumes.
- Production Compose also persists uploaded files in the `uploads_data` volume.
