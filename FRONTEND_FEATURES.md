# Frontend features and API contract

This document is a frontend-oriented inventory of the HTTP API. Routes are grouped by the three effective access domains exposed by the backend:

1. **Public / guest** — no session required.
2. **User** — an authenticated session is required. Some operations additionally require ownership or program-manager access.
3. **Admin / staff** — an authenticated user with the `staff` role is required.

> **Role naming:** although the backend enum also contains `admin`, staff-only endpoints explicitly require `staff`. A user with only the `admin` role does not pass those guards. In this document, “Admin” therefore means the backend `staff` role.

## API conventions

- There is no global URL prefix in the application; paths below are relative to the API origin.
- Authentication uses an HTTP session cookie. Frontend requests must include credentials (for example, `credentials: 'include'`).
- Dates are JSON ISO-8601 strings.
- UUID path and body identifiers are strings.
- Standard paginated query parameters are `page` (default `1`) and either `limit` or its alias `take` (default `20`, maximum `100`).
- Paginated responses are tuples, not objects: `[items, total]`.
- `POST` routes normally return HTTP `201`; other successful routes normally return HTTP `200`. Routes documented as `void` have no response body.
- Validation and application errors use NestJS's normal error object, typically `{ statusCode, message, error }`.
- Static uploaded files are served from `/uploads`. An avatar filename returned on a user can be displayed from `/uploads/profiles/{avatar}`.
- The API is throttled to 50 requests per 60 seconds.

## Shared request types

### Pagination

```ts
type PaginationQuery = {
  page?: number | string;  // integer >= 1; default 1
  limit?: number | string; // integer 1..100; default 20
  take?: number | string;  // alias for limit
};

type Paginated<T> = [items: T[], total: number];
```

### Bodies

```ts
type SignUpBody = {
  name: string;
  email: string;
  password: string; // at least 6 characters
};

type SignInBody = {
  email: string;
  password: string;
};

type UpdateUserBody = {
  email?: string;
  name?: string;
  password?: string;
  avatar?: string;
  roles?: string[]; // role UUIDs
};

type CreateUserBody = {
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  roles?: string[]; // role UUIDs
};

type CreatePortfolioBody = {
  name: string;          // max 150
  description?: string;
  logo?: string;         // max 255
};

type CreateProgramBody = {
  portfolioId: string;
  name: string;                // max 150
  description?: string;
  logo?: string;               // max 255
  programManagerIds?: string[]; // unique user UUIDs
};

type FormResponses = Record<string, unknown>;

type CreateActivityBody = {
  programId: string;
  name: string; // max 150
  description?: string;
  typeId: string;
  categoryIds: string[]; // unique category UUIDs
  startDate: string;
  endDate: string; // must be later than startDate
  participationForm: FormResponses;
  reviewForm: FormResponses;
};

type SaveFormResponseBody = {
  responses: FormResponses;
};

type CreateVentureBody = {
  name: string;        // max 150
  pitch: string;       // max 255
  description: string;
  logo?: string;       // max 255
  links?: Record<string, unknown>;
};
```

All `PATCH` update bodies for portfolios, programs, activities, categories, types, roles, and ventures accept the corresponding creation fields as optional unless a different body is shown below.

## Shared response models

Nested relations are included only when noted by a route. All database entities contain `id`, `createdAt`, `updatedAt`, and `deletedAt`.

```ts
type EntityFields = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type UserResponse = EntityFields & {
  email: string;
  name: string;
  avatar: string | null;
  roles: string[]; // role names, e.g. user, staff, mentor
};

type Role = EntityFields & { name: string };
type ActivityCategory = EntityFields & { name: string };
type ActivityType = EntityFields & { name: string };

type Portfolio = EntityFields & {
  name: string;
  slug: string;
  description: string | null;
  logo?: string | null;
  programs?: Program[];
};

type Program = EntityFields & {
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  portfolio?: Portfolio;
  programManagers?: UserResponse[];
  activities?: Activity[];
};

type Activity = EntityFields & {
  name: string;
  slug: string;
  description: string | null;
  startDate: string;
  endDate: string;
  participationForm: FormResponses;
  reviewForm: FormResponses;
  program?: Program;
  type?: ActivityType;
  categories?: ActivityCategory[];
};

type ParticipationStatus = 'pending' | 'approved' | 'cancelled';

type ActivityParticipation = EntityFields & {
  userId: string;
  responses: FormResponses;
  status: ParticipationStatus;
  submitDate: string;
  activity?: Activity;
  user?: UserResponse;
};

type ActivityReview = EntityFields & {
  responses: FormResponses;
  submitDate: string;
  activity?: Activity;
  user?: UserResponse;
};

type VentureStatus = 'draft' | 'published' | 'rejected';

type Venture = EntityFields & {
  name: string;
  slug: string;
  pitch: string;
  description: string;
  logo?: string | null;
  links: Record<string, unknown>;
  status: VentureStatus;
  owner?: UserResponse;
};
```

# Public / guest domain

These routes are marked public and work without a session.

## Authentication and account recovery

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| Sign up | `POST /auth/signup` | Body: `SignUpBody` | `UserResponse` |
| Sign in | `POST /auth/signin` | Body: `SignInBody` | `UserResponse`; creates the session cookie |
| Start Google sign-in | `GET /auth/signin/google` | None | Redirects to Google |
| Complete Google sign-in | `GET /auth/google/redirect` | Google callback query, including optional `state` | Redirects to configured frontend origin after creating the session |
| Request password reset | `POST /auth/password/forgot` | Body: `{ email: string }` | `void`; sends a reset link containing a 15-minute token |
| Reset password | `POST /auth/password/reset` | Body: `{ token: string, password: string }`; password min 6 | `UserResponse` |

## Public discovery

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| Recent activities | `GET /activities/recent` | None; fixed maximum of 10 | `Activity[]`, with `program`, `type`, and `categories` |
| Published venture list | `GET /ventures` | Query: pagination + `q?` | `Paginated<Venture>`; published ventures only |
| Published venture detail | `GET /ventures/:slug` | Path: `slug` | `Venture`; published ventures only |

# Authenticated user domain

Every route in this section requires a valid session. Staff users can also call these routes, subject to ownership rules where explicitly noted.

## Session and profile

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| Current profile | `GET /auth/me` | None | `UserResponse` |
| Update current profile | `PATCH /auth/me/update` | Body: `UpdateUserBody` | `UserResponse` |
| Update password | `PATCH /auth/password/update` | Body: `{ password: string }`; min 6 | `UserResponse` |
| Upload avatar | `POST /users/profile/avatar` | `multipart/form-data`, file field `avatar` | `UserResponse`; replaces the previous avatar |
| Sign out | `POST /auth/signout` | None | `void`; destroys the session |

## Catalogs and program discovery

These reads are authenticated in the current backend, despite being general catalog data.

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| List activity categories | `GET /activity-categories` | Query: pagination + `q?` | `Paginated<ActivityCategory>` |
| Activity category detail | `GET /activity-categories/:id` | Path: category `id` | `ActivityCategory` |
| List activity types | `GET /activity-types` | Query: pagination + `q?` | `Paginated<ActivityType>` |
| Activity type detail | `GET /activity-types/:id` | Path: type `id` | `ActivityType` |
| List portfolios | `GET /portfolios` | Query: pagination + `q?` | `Paginated<Portfolio>` |
| Portfolio detail | `GET /portfolios/:id` | Path: portfolio `id` | `Portfolio`, with `programs` |
| List programs | `GET /programs` | Query: pagination + `q?`, `portfolioId?`, `managerId?` | `Paginated<Program>`, with `portfolio` and `programManagers` |
| Program detail | `GET /programs/:id` | Path: program `id` | `Program`, with `portfolio`, `programManagers`, and `activities` |

## Activities

Ordinary users see ongoing activities. A program manager also sees activities in programs they manage, while staff see all activities.

| Feature | Method and route | Params / body | Success response / access |
|---|---|---|---|
| Browse accessible activities | `GET /activities` | Query: pagination + `q?`, `programId?`, `typeId?`, `categoryId?`, `startDate?`, `endDate?` | `Paginated<Activity>`, with `program.programManagers`, `type`, and `categories` |
| Activities for program slug | `GET /activities/programs/:slug` | Path: program `slug` | `Activity[]`, with `program`, `type`, and `categories` |
| Activity detail | `GET /activities/:id` | Path: activity `id` | `Activity`, with `program.programManagers`, `type`, and `categories`; allowed for ongoing activity, its program manager, or staff |
| Create activity | `POST /activities` | Body: `CreateActivityBody` | `Activity`; program manager for `programId` or staff only |
| Update activity | `PATCH /activities/:id` | Path: activity `id`; body: partial `CreateActivityBody` | `Activity`; program manager or staff only, and only before the activity starts |
| Delete activity | `DELETE /activities/:id` | Path: activity `id` | `void`; program manager or staff only |

## My participations

| Feature | Method and route | Params / body | Success response / access |
|---|---|---|---|
| Participate in activity | `POST /participations/activities/:activityId` | Path: `activityId`; body: `SaveFormResponseBody` | `ActivityParticipation`; activity must be ongoing and one participation per user/activity |
| List my participations | `GET /participations/mine` | Query: pagination + `status?` | `Paginated<ActivityParticipation>`, with `activity` |
| Participation detail | `GET /participations/:id` | Path: participation `id` | `ActivityParticipation`, with `activity.program` and `user`; own record, program manager, or staff |
| Update my participation | `PATCH /participations/:id` | Path: participation `id`; body: `SaveFormResponseBody` | `ActivityParticipation`; owner only, while status is `pending` and the activity is ongoing |
| Delete participation | `DELETE /participations/:id` | Path: participation `id` | `void`; owner, program manager, or staff |

## Participation management (program manager or staff)

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| List activity participations | `GET /participations/activities/:activityId` | Path: `activityId`; query: pagination + `status?`, `q?` (user name/email) | `Paginated<ActivityParticipation>`, with `user` |
| Export activity participations | `GET /participations/activities/:activityId/export/csv` | Path: `activityId`; query: `status?`, `q?` | CSV attachment named `participations-{activityId}.csv` |
| Change participation status | `PATCH /participations/:id/status` | Path: participation `id`; body: `{ status: ParticipationStatus }` | `ActivityParticipation` |

## My reviews

| Feature | Method and route | Params / body | Success response / access |
|---|---|---|---|
| Submit activity review | `POST /reviews/activities/:activityId` | Path: `activityId`; body: `SaveFormResponseBody` | `ActivityReview`; activity must be ongoing and one review per user/activity |
| List my reviews | `GET /reviews/mine` | Query: pagination (`q` is accepted by the type but currently ignored) | `Paginated<ActivityReview>`, with `activity` |
| Review detail | `GET /reviews/:id` | Path: review `id` | `ActivityReview`, with `activity.program` and `user`; own record, program manager, or staff |
| Update my review | `PATCH /reviews/:id` | Path: review `id`; body: `SaveFormResponseBody` | `ActivityReview`; owner only |
| Delete review | `DELETE /reviews/:id` | Path: review `id` | `void`; owner, program manager, or staff |

## Review management (program manager or staff)

```ts
type ReviewStatistics = {
  totalReviews: number;
  firstSubmitDate: string | null;
  lastSubmitDate: string | null;
  questions: Array<{
    question: string;
    answered: number;
    answers: Array<{ value: string; count: number }>;
  }>;
};
```

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| List activity reviews | `GET /reviews/activities/:activityId` | Path: `activityId`; query: pagination + `q?` (user name/email) | `Paginated<ActivityReview>`, with `user` |
| Activity review statistics | `GET /reviews/activities/:activityId/statistics` | Path: `activityId` | `ReviewStatistics` |

## My ventures

| Feature | Method and route | Params / body | Success response / access |
|---|---|---|---|
| Create venture | `POST /ventures` | Body: `CreateVentureBody` | `Venture`; initial status is `draft` |
| List my ventures | `GET /ventures/mine` | Query: pagination + `q?`, `status?` | `Paginated<Venture>` |
| Update my venture | `PATCH /ventures/:id` | Path: venture `id`; body: partial `CreateVentureBody` | `Venture`; owner only; status is reset to `draft` |
| Delete my venture | `DELETE /ventures/:id` | Path: venture `id` | `void`; owner only |

# Admin / staff domain

All routes in this section require the literal `staff` role.

## Dashboard

```ts
type StatsDashboard = {
  generatedAt: string;
  period: { months: number; from: string; to: string };
  kpis: Array<{
    key: string;
    label: string;
    value: number;
    unit: 'count' | 'percentage' | 'average';
    changePercentage?: number | null;
  }>;
  charts: {
    userRegistrations: Array<{ name: string; value: number }>;
    participationTrend: Array<{ name: string; series: Array<{ name: string; value: number }> }>;
    reviewTrend: Array<{ name: string; value: number }>;
    ventureTrend: Array<{ name: string; series: Array<{ name: string; value: number }> }>;
    activityLifecycle: Array<{ name: string; value: number }>;
    participationStatuses: Array<{ name: string; value: number }>;
    ventureStatuses: Array<{ name: string; value: number }>;
    activitiesByType: Array<{ name: string; value: number }>;
    programsByPortfolio: Array<{ name: string; value: number }>;
    usersByRole: Array<{ name: string; value: number }>;
  };
};
```

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| Dashboard statistics | `GET /stats` | Query: `months?` integer from 3 to 24, default 12 | `StatsDashboard` |

## User administration

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| Create user | `POST /users` | Body: `CreateUserBody` | `UserResponse` |
| List users | `GET /users` | Query: pagination + `q?` (name/email) | `Paginated<UserResponse>` |
| User detail | `GET /users/:email` | Path: user `email` | `UserResponse` |
| Update user | `PATCH /users/:id` | Path: user `id`; body: `UpdateUserBody` | `UserResponse` |
| Delete user | `DELETE /users/:id` | Path: user `id` | `void` (soft delete) |
| Import users | `POST /users/import/csv` | `multipart/form-data`, file field `file`; CSV/plain text, max 2 MiB | `void` |
| Export users | `GET /users/export/csv` | Query: `q?` (pagination fields are accepted but ignored; all matches are exported) | CSV attachment |

The user CSV importer expects a case-sensitive header row with `Name` and `Email` columns. A newly imported user receives a generated password through the welcome-email flow.

## Role administration

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| Create role | `POST /roles` | Body: `{ name: string }` | `Role` |
| List roles | `GET /roles` | Query: pagination + `q?` | `Paginated<Role>` |
| Role detail | `GET /roles/:id` | Path: role `id` | `Role` |
| Update role | `PATCH /roles/:id` | Path: role `id`; body: `{ name?: string }` | `Role` |
| Delete role | `DELETE /roles/:id` | Path: role `id` | `void` (soft delete) |

## Portfolio administration

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| Create portfolio | `POST /portfolios` | Body: `CreatePortfolioBody` | `Portfolio` |
| Update portfolio | `PATCH /portfolios/:id` | Path: portfolio `id`; body: partial `CreatePortfolioBody` | `Portfolio` |
| Delete portfolio | `DELETE /portfolios/:id` | Path: portfolio `id` | `void` (soft delete) |

## Program administration

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| Create program | `POST /programs` | Body: `CreateProgramBody` | `Program` |
| Update program | `PATCH /programs/:id` | Path: program `id`; body: partial `CreateProgramBody` | `Program` |
| Delete program | `DELETE /programs/:id` | Path: program `id` | `void` (soft delete) |

## Activity taxonomy administration

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| Create activity category | `POST /activity-categories` | Body: `{ name: string }`; non-empty, max 100 | `ActivityCategory` |
| Update activity category | `PATCH /activity-categories/:id` | Path: category `id`; body: `{ name?: string }` | `ActivityCategory` |
| Delete activity category | `DELETE /activity-categories/:id` | Path: category `id` | `void` (soft delete) |
| Create activity type | `POST /activity-types` | Body: `{ name: string }`; non-empty, max 100 | `ActivityType` |
| Update activity type | `PATCH /activity-types/:id` | Path: type `id`; body: `{ name?: string }` | `ActivityType` |
| Delete activity type | `DELETE /activity-types/:id` | Path: type `id` | `void` (soft delete) |

Staff also use the authenticated activity routes above to create, edit, delete, and inspect any activity.

## Venture moderation

| Feature | Method and route | Params / body | Success response |
|---|---|---|---|
| List all ventures | `GET /ventures/staff` | Query: pagination + `q?` (venture/owner name or owner email), `status?` | `Paginated<Venture>`, with `owner` |
| Venture moderation detail | `GET /ventures/staff/:id` | Path: venture `id` | `Venture`, with `owner` |
| Change venture status | `PATCH /ventures/:id/status` | Path: venture `id`; body: `{ status: VentureStatus }` | `Venture` |

Staff also inherit program-manager access to participation and review management routes without needing to be assigned as a program manager.

## Frontend route guard summary

| Frontend area | Minimum backend access |
|---|---|
| Landing, recent activities, published ventures | Public |
| Sign in, sign up, password recovery | Public |
| Profile, my participations, my reviews, my ventures | Authenticated user |
| Activity management within assigned programs | Authenticated program manager or `staff` |
| Participation/review management within assigned programs | Authenticated program manager or `staff` |
| Dashboard, users, roles, taxonomy CRUD, portfolio/program CRUD, venture moderation | `staff` |
