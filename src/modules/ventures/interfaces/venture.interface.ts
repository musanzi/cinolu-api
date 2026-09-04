import { IPagination } from '@/shared/interfaces';

export enum VentureStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REJECTED = 'rejected'
}

export type VentureLinks = Record<string, unknown>;

export interface IFilterVentures extends IPagination {
  q?: string;
  status?: VentureStatus;
}
