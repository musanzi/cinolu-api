# OneStop — Product Analysis & AI Integration Use Cases

> Prepared: 2026-09-23 · Audience: product & engineering · Scope: `cinolu-api` (NestJS backend)

---

## 1. What this product is

**OneStop** is an **entrepreneurship & innovation-ecosystem management platform** — essentially an operating system for an incubator/accelerator/innovation hub. It is built for Cinolu (a Kinshasa-based innovation lab) and its Francophone community.

The platform manages the full lifecycle of ecosystem programming:

```
Portfolio → Program → Cohort → Activity
                                    │
                                    ├─ dynamic participation form (staff-defined JSON schema)
                                    ├─ dynamic review form
                                    ├─ mentors, types, categories, resources
                                    │
User → applies ──► Participation (pending → approved/declined, email notified)
User → reviews ──► Review
User → registers ─► Venture ("Initiative") → staff approves/rejects (email notified)
```

- **Staff** structure the offering (portfolios, programs, cohorts, activities), define dynamic application/review forms, approve participants and ventures, manage users (CRUD + CSV import/export), taxonomy, and view platform-wide statistics dashboards.
- **Members** sign up (email/password or Google OAuth), browse published activities, apply via dynamic forms, review activities, and register their startups ("ventures") into a curated directory.
- **Roles:** `user`, `staff`, `mentor`, `admin` (admin bypasses all role checks; staff is the operative operator role; mentor is assigned but has no dedicated endpoints yet).

### Tech context relevant to AI

| Layer | Choice |
|---|---|
| Framework | NestJS 11, TypeScript, CQRS (`@nestjs/cqrs`) |
| ORM / DB | TypeORM + PostgreSQL (uuid PKs, **jsonb** columns, soft deletes) |
| Auth | Local (bcrypt) + Google OAuth, JWT + Redis sessions |
| Integrations | SMTP email (French templates), local disk uploads, CSV (fast-csv) |
| Docs | Swagger + Scalar at `/docs` |
| **Notably absent** | No payments, no queues/brokers, no cloud storage, **no AI features today** |

### Why this codebase is AI-ready

- **Rich unstructured text**: mandatory user biographies, venture descriptions, activity/program descriptions, review free-text.
- **Dynamic form pipeline**: `participationForm` / `reviewForm` are staff-authored JSON schemas; answers live in jsonb — a flexible application & evaluation dataset.
- **Behavioral graph**: users ↔ activities ↔ participations ↔ reviews ↔ ventures ↔ sectors/stages — enough for matching, recommendations, and trends.
- **CQRS + event handlers**: natural hook points for AI side effects (e.g., an event → enqueue → AI enrichment) without touching core write paths.
- **Telemetry**: status timestamps, monthly trends, month-over-month KPIs already computed in the stats module.

---

## 2. Ten AI integration use cases (simple → complex)

Each use case lists: who benefits, the value, the data it uses, and an implementation suggestion. Effort is rated S/M/L. All are additive — none require schema migrations beyond new optional columns/tables.

---

### 1. AI-assisted text writing for content creators (staff)
**Complexity: ★☆☆☆☆ · Effort: S · Users: staff**

Staff write descriptions for activities, programs, portfolios, and ventures. Today this is a blank textarea.

- Generate, shorten, or re-tone (formal / friendly / promotional) descriptions from a few bullet points.
- Also usable by members writing their venture description or biography.

**Suggestion:** Add a `POST /ai/assist-text` endpoint that takes `{text, action: "improve"|"shorten"|"expand"|"translate", tone?}` and proxies to an LLM. No persistence needed — pure passthrough. French-first output to match the audience. This is the fastest win: no data plumbing, immediate perceived value, and it introduces the AI provider integration the later use cases build on.

---

### 2. Automatic content summarization
**Complexity: ★☆☆☆☆ · Effort: S · Users: members, staff**

Long activity descriptions, program overviews, and venture profiles are hard to scan on mobile.

- Auto-generate a 2–3 sentence summary + key-points list for every activity, program, and venture.
- Store in a new jsonb/text column (e.g., `summary`) generated on create/update via a CQRS event handler.

**Suggestion:** Hook into existing create/update commands with an event handler (`ContentUpdatedEvent` → AI handler) that rewrites the summary asynchronously. Display the summary in list views (already used by "recent 5" endpoints). Regenerate only when the source text changes — cheap and cache-friendly.

---

### 3. Smart search over activities, programs, and ventures
**Complexity: ★★☆☆☆ · Effort: M · Users: members**

Current search is exact/ILIKE-style by name (`activities.controller.ts`). Members looking for "formation en finance pour startup" won't find "Atelier: gestion financière".

- Semantic search over activity names + descriptions + categories.
- Answers "find me workshops about X for ventures at MVP stage".

**Suggestion:** Two phases: (a) quick win — LLM-generated embeddings stored in a new `embeddings` table (source type + id + vector), queried with pgvector (a PostgreSQL extension, no new infra); (b) later — full natural-language query understanding. Start with the `pgvector` + OpenAI-embeddings route: it fits the existing TypeORM/Postgres stack and powers use cases 4, 5, and 7 too.

---

### 4. Application screening & scoring for staff
**Complexity: ★★☆☆☆ · Effort: M · Users: staff**

Staff manually read every participation submission (`Participation.data`, a free-form jsonb keyed by the activity's dynamic form) to approve/decline. This is the biggest time sink in the product.

- AI pre-scores each application against the activity's context (name, description, target audience) and surfaces: a relevance score (0–100), a short rationale, and red flags (incomplete, off-topic).
- Presents applications ranked in the staff review list — humans keep the final decision button.

**Suggestion:** Because form fields are dynamic, don't hard-code field semantics — pass the activity's `participationForm` schema plus the applicant's answers to the LLM as structured JSON with a scoring rubric prompt. Emit `{score, rationale, flags}` into a new `ai_screening` column on `participation`. Trigger via the existing `ParticipationCreated` event. Keep it advisory: status changes remain staff-only (also preserves fairness/accountability).

---

### 5. Venture profile enrichment & quality coaching
**Complexity: ★★☆☆☆ · Effort: M · Users: members, staff**

Venture submissions are often thin: one-line descriptions, missing sectors, vague stage. Staff then reject or ask for rework over email.

- When a member creates/updates a venture, AI suggests: missing sectors (from the existing taxonomy), a stronger description draft, and completeness feedback ("add your traction numbers").
- For staff: a one-paragraph "at a glance" profile brief for the approval queue.

**Suggestion:** Two endpoints: `/ventures/:id/ai-improve` (member-triggered suggestions) and automatic brief generation on submit (event handler writing to a jsonb `ai_brief` column). Reuse the sector taxonomy as the constrained label set for classification — this gives deterministic, filterable output rather than free text.

---

### 6. Recommendation engine for members ("What should I do next?")
**Complexity: ★★★☆☆ · Effort: M · Users: members**

Members currently browse a flat list of published activities. Engagement depends on them finding relevant items themselves.

- Recommend activities based on: the member's biography, job title, ventures (sectors + stage), and past participations/reviews.
- "For your fintech venture at MVP stage, these two workshops and this program match."
- Email digest option: a weekly "recommended for you" mail (plugs into the existing SMTP/event setup).

**Suggestion:** Hybrid approach, cheapest first: (a) embedding-similarity using the pgvector index from use case 3 — embed member profile + venture descriptions, match against activity embeddings; (b) layer in collaborative signals (members with similar participation history) later. Expose as `GET /recommendations/mine` next to `/stats/mine`. Keep an audit-friendly `why` string per recommendation ("matches your venture's sector: Fintech").

---

### 7. Mentor ↔ venture matching
**Complexity: ★★★☆☆ · Effort: M · Users: staff, mentors, members**

The `mentor` role and the activity↔mentor M2M exist, but nothing matches mentors to ventures. This is a core accelerator function and currently happens over email/WhatsApp outside the platform.

- Score mentor–venture fit from mentor biographies/specialties (profiles) vs. venture description, sector, and stage.
- Suggest top-3 mentors when staff open a venture, and top ventures for a mentor.

**Suggestion:** A `MatchMentorsForVentureQuery` / `MatchVenturesForMentorQuery` in CQRS style, running embedding similarity (use case 3 infra) over user biographies + venture texts, filtered by role = mentor and venture status = approved. Present as ranked suggestions with an explanation — staff make the introduction. Foundational for a future messaging module.

---

### 8. Review synthesis ("What did participants actually think?")
**Complexity: ★★★☆☆ · Effort: M · Users: staff**

Reviews (`Review.data`, dynamic jsonb) accumulate per activity but are never aggregated. Staff running 10+ activities per cohort can't read everything.

- After an activity ends, AI produces a synthesis report: overall sentiment, top 3 praised points, top 3 complaints, suggested improvements, notable quotes (anonymized).
- Platform-level rollups per program ("common complaints across all cohort-3 workshops").

**Suggestion:** A scheduled or activity-end-triggered command (`SynthesizeActivityReviewsCommand`) that batches all reviews for an activity into one LLM call (map-reduce for large counts) and stores the report as jsonb on a new `review_syntheses` table. Render in the staff dashboard near the existing stats. Aggregate rollups by re-synthesizing per-program. Low risk: read-only over data staff already own.

---

### 9. Program & ecosystem analytics copilot (natural-language questions over stats)
**Complexity: ★★★★☆ · Effort: L · Users: staff, admin**

The stats module computes fixed KPIs (registrations, participation/venture status breakdowns, trends). Every new question requires a new query handler.

- Let staff ask questions in French: *"Quels types d'activités ont le meilleur taux d'approbation ce trimestre ?"*, *"Compare la participation des ventures en phase MVP vs idée."*
- AI translates the question → safe read-only SQL over the known schema → returns answer + chart-ready data.

**Suggestion:** Constrain aggressively: a text-to-SQL layer restricted to a whitelist of tables/columns (users, participations, activities, ventures, programs), read-only connection or `SET TRANSACTION READ ONLY`, row limits, and SQL validation before execution (allow-list statements, no DDL/DML). Start with a fixed library of ~15 parameterized question templates and let the LLM map questions → templates (much safer than free SQL); graduate to free SQL later. This is the highest-leverage staff feature but demands the most guardrail engineering.

---

### 10. AI venture assistant / member copilot (chatbot grounded in platform data)
**Complexity: ★★★★★ · Effort: L · Users: members, staff**

The end-state: a conversational assistant embedded in the app.

- Members: "What programs fit my venture?", "What do I need to fix before my venture gets approved?", "Summarize my reviews."
- Staff: "How is cohort 2 performing?", "Draft the approval email for these 5 applications."
- Grounded in the member's own data (participations, ventures, reviews) plus public catalog content — with strict per-user authorization (never leak another member's data).

**Suggestion:** Build last, on top of everything above. Architecture: a new `ai` module following the project CQRS conventions — `queries/handlers` for chat turns (RAG over: activity/program descriptions via embeddings from use case 3, stats via the text-to-SQL layer from use case 9, member's own records via direct repository queries scoped by the authenticated user), `commands` for actions the bot can trigger through existing CQRS commands (never direct repository writes). Conversation history in a `chat_sessions`/`chat_messages` table. Add usage quotas per user (rate limiting already exists globally). This is the flagship differentiator — but it compounds the value of use cases 3, 6, 8, and 9, which is why it comes last.

---

## 3. Suggested roadmap

| Phase | Use cases | Why first |
|---|---|---|
| **Phase 1 — Foundation (weeks 1–3)** | 1, 2 | Introduce the AI provider client, prompt helpers, and event-handler pattern with zero-risk generative features. |
| **Phase 2 — Search & data groundwork (weeks 3–6)** | 3, 5 | pgvector + embeddings table unlocks 4, 6, 7. Venture coaching has immediate visible value. |
| **Phase 3 — Staff intelligence (weeks 6–10)** | 4, 8 | Biggest time savings for staff; reuses embeddings + events. |
| **Phase 4 — Engagement & matching (weeks 10–14)** | 6, 7 | Member-facing personalization; depends on Phase 2 infra. |
| **Phase 5 — Copilot (quarter 2)** | 9, 10 | Flagship features built on all prior groundwork. |

**Cross-cutting engineering notes (apply from use case 1 onward):**

- Create a shared `AiModule` (provider client, retry/rate-limit handling, prompt templates, cost logging) — avoids every module re-inventing provider plumbing.
- Use CQRS events for asynchronous AI work (content created → summarize; participation created → screen), keeping AI latency off user-facing write paths.
- Every AI output column should be nullable jsonb + regenerable — never let AI output block core functionality.
- Log prompts/costs per call from day one (pino is already wired).
- Add an org-level kill switch (env flag) to disable AI features without a deploy.
- Keep AI advisory in any approval/rejection flow — humans stay the decision-makers.
