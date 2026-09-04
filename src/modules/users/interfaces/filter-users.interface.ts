import { IPagination } from '@/shared/interfaces';

export interface IFilterUsers extends IPagination {
  q?: string;
}
