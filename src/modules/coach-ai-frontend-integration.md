# AI Coach Frontend Integration Guide

This guide reflects the current flow:

- AI coaches are created and managed by admins on the backend.
- Entrepreneurs do not create coaches.
- Entrepreneurs load the available coaches while working on one of their ventures.
- Entrepreneurs choose a specific coach and chat with that coach about their venture.
- Responses are wrapped by the global interceptor as `{ "data": ... }`.

## Authentication

All endpoints below require the authenticated venture owner session.

- Send cookies with `credentials: 'include'`.
- The current user must own the venture.

## User Routes

The entrepreneur-facing routes are venture-scoped and coach-specific.

Coaches are global resources.

- A coach is not attached to a venture.
- The venture is only the context of the conversation.
- The same coach can be used for different ventures.

### List venture coaches

```http
GET /ventures/:ventureId/coaches
```

Response:

```json
{
  "data": [
    {
      "id": "coach-id",
      "name": "Coach finance",
      "profile": "Coach specialise en structuration financiere.",
      "role": "Aider la venture sur les hypotheses financieres et les risques.",
      "expected_outputs": ["RISKS", "RECOMMENDATIONS", "NEXT_ACTIONS"],
      "model": "llama3.2:3b",
      "status": "active"
    }
  ]
}
```

Frontend usage:

- Display coaches as cards, tabs, or a selectable list.
- Show `name`, `profile`, and `role` before the user starts chatting.
- Filter out inactive coaches in the UI if needed.

### Get one selected coach

```http
GET /ventures/:ventureId/coaches/:coachId
```

Use this when the user opens a specific coach detail panel.

### Get one selected coach conversation

```http
GET /ventures/:ventureId/coaches/:coachId/conversation
```

Response:

```json
{
  "data": {
    "id": "conversation-id",
    "status": "active",
    "messages": [
      {
        "id": "message-1",
        "role": "assistant",
        "output_type": "RECOMMENDATIONS",
        "content": "Commence par valider les hypothèses de prix.",
        "payload": {
          "type": "RECOMMENDATIONS",
          "title": "Premiere recommandation",
          "summary": "Commence par valider les hypothèses de prix.",
          "bullets": [
            "Tester trois niveaux de prix.",
            "Documenter les objections des clients."
          ],
          "ventureFocus": "Cela aide la venture a confirmer sa proposition de valeur.",
          "scopeCheck": {
            "profile": "Coach specialise en structuration financiere.",
            "role": "Aider la venture sur les hypotheses financieres et les risques.",
            "grounded": true
          }
        }
      }
    ]
  }
}
```

Notes:

- If the user has never chatted with that coach yet, the conversation may not exist.
- The frontend can call the message endpoint directly to start the conversation.

### Send a message to one selected coach

```http
POST /ventures/:ventureId/coaches/:coachId/messages
Content-Type: application/json
```

Request:

```json
{
  "message": "Aide-moi a prioriser mes prochains tests clients."
}
```

Response:

```json
{
  "data": {
    "type": "NEXT_ACTIONS",
    "title": "Priorite immediate",
    "summary": "Teste rapidement le message de valeur aupres de clients cibles.",
    "bullets": [
      "Identifier 5 clients cibles.",
      "Comparer les objections recurrentes.",
      "Formaliser un retour de terrain."
    ],
    "ventureFocus": "Cette action aide la venture a mieux qualifier son besoin client.",
    "scopeCheck": {
      "profile": "Coach specialise en structuration financiere.",
      "role": "Aider la venture sur les hypotheses financieres et les risques.",
      "grounded": true
    }
  }
}
```

## Admin Routes

Admins and staff manage coaches from the backend with these routes:

```http
POST   /coach-ai
GET    /coach-ai
GET    /coach-ai/id/:id
PATCH  /coach-ai/id/:id
DELETE /coach-ai/id/:id
```

The important creation payload is:

```json
{
  "name": "Coach finance",
  "profile": "Coach specialise en structuration financiere.",
  "role": "Aider la venture sur les hypotheses financieres et les risques.",
  "expected_outputs": ["RISKS", "RECOMMENDATIONS", "NEXT_ACTIONS"],
  "status": "active"
}
```

## Suggested Frontend Types

```ts
export type CoachOutput = {
  type: string;
  title: string;
  summary: string;
  bullets: string[];
  ventureFocus: string;
  scopeCheck: {
    profile: string;
    role: string;
    grounded: boolean;
  };
};

export type CoachMessage = {
  id: string;
  role: 'user' | 'assistant';
  output_type: string;
  content: string;
  payload: Record<string, unknown>;
};

export type CoachConversation = {
  id: string;
  status: string;
  messages: CoachMessage[];
};

export type AiCoach = {
  id: string;
  name: string;
  profile: string;
  role: string;
  expected_outputs: string[];
  model: string;
  status: string;
};

export type ApiResponse<T> = {
  data: T;
};
```

## Recommended UI Flow

1. User opens a venture.
2. Frontend loads `GET /ventures/:ventureId/coaches`.
3. User selects a coach from the list.
4. Frontend loads `GET /ventures/:ventureId/coaches/:coachId/conversation`.
5. If no conversation exists yet, show an empty state.
6. User sends a message with `POST /ventures/:ventureId/coaches/:coachId/messages`.
7. Frontend appends the structured coach response to the thread.

## Error Handling

Common errors:

- `Accès au coach refusé`
- `Coach introuvable`
- `Conversation introuvable`
- `Message impossible`
- `Réponse hors périmètre`
- `Réponse non liée à la venture`

Recommended frontend behavior:

- Show a generic toast for API failures.
- Show an access error if the venture is not owned by the current user.
- Treat missing conversation as an empty initial state.
- Let the user retry a failed message send.
