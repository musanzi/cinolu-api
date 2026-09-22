import { IPagination } from '@/shared/interfaces';

export interface IFilterActivities extends IPagination {
  programId?: string;
  programSlug?: string;
  cohortId?: string;
  q?: string;
  startDate?: Date;
  endDate?: Date;
}
