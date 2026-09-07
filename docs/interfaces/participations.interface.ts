/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { Activity } from './activities.interface';
import type { PaginationQuery, EntityFields, FormResponses, SearchQuery } from './common.interface';
import type { UserRelation } from './users.interface';

export type ParticipationStatus = 'pending' | 'approved' | 'cancelled';

export interface ActivityParticipation extends EntityFields {
  userId: string;
  responses: FormResponses;
  status: ParticipationStatus;
  submitDate: string;
  activity?: Activity;
  user?: UserRelation;
}

export interface SaveFormResponseBody {
  responses: FormResponses;
}

export interface UpdateParticipationStatusBody {
  status: ParticipationStatus;
}

export type MyParticipationsQuery = PaginationQuery & { status?: ParticipationStatus };

export type ActivityParticipationsQuery = SearchQuery & { status?: ParticipationStatus };

export interface ExportParticipationsQuery {
  status?: ParticipationStatus;
  q?: string;
}
