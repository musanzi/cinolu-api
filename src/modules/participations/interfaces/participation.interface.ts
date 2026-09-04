import { IPagination } from '@/shared/interfaces';

export enum ParticipationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  CANCELLED = 'cancelled'
}

export interface IFilterParticipations extends IPagination {
  status?: ParticipationStatus;
  q?: string;
}
