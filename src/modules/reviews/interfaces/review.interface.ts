import { IPagination } from '@/shared/interfaces';

export type ReviewData = unknown;

export interface IFilterReviews extends IPagination {
  activityId?: string;
}
