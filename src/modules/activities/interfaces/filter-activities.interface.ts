import { IPagination } from '@/shared/interfaces';

export interface IFilterActivities extends IPagination {
  programId?: string;
  programSlug?: string;
  q?: string;
  startDate?: Date;
  endDate?: Date;
}
