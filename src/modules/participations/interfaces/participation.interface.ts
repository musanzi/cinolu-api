import { IPagination } from '@/shared/interfaces';

export enum ParticipationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined'
}

export type ParticipationData = Record<string, string>;

export interface IFilterParticipations extends IPagination {
  activityId?: string;
  status?: ParticipationStatus;
}
