/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { Activity } from './activities.interface';
import type { EntityFields, FormResponses } from './common.interface';
import type { UserRelation } from './users.interface';

export interface ActivityReview extends EntityFields {
  responses: FormResponses;
  submitDate: string;
  activity?: Activity;
  user?: UserRelation;
}

export interface ReviewStatistics {
  totalReviews: number;
  firstSubmitDate: string | null;
  lastSubmitDate: string | null;
  questions: Array<{
    question: string;
    answered: number;
    answers: Array<{ value: string; count: number }>;
  }>;
}
