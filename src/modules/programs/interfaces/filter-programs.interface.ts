import { IPagination } from '@/shared/interfaces';

export interface IFilterPrograms extends IPagination {
  q?: string;
  portfolioId?: string;
  managerId?: string;
}
