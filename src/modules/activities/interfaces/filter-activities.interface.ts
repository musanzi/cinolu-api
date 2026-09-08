import { IPagination } from '@/shared/interfaces';

export interface IFilterActivities extends IPagination {
  q?: string;
  startDate?: Date;
  endDate?: Date;
}
