import { IPagination } from '@/shared/interfaces';

export interface IFilterActivities extends IPagination {
  programId?: string;
  q?: string;
  startDate?: Date;
  endDate?: Date;
}
