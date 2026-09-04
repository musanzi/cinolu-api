import { IPagination } from '@/shared/interfaces';

export type FormResponses = Record<string, unknown>;

export interface IFilterActivities extends IPagination {
  q?: string;
  programId?: string;
  typeId?: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
}
