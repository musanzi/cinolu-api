import { IPagination } from '@/shared/interfaces';

export enum VentureStage {
  IDEA = 'idea',
  MVP = 'mvp',
  EARLY_STAGE = 'early_stage',
  GROWTH = 'growth',
  MATURE = 'mature'
}

export enum VentureStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export type VentureSocials = Record<string, unknown>;

export interface IFilterVentures extends IPagination {
  q?: string;
  sectorId?: string;
  stage?: VentureStage;
  status?: VentureStatus;
}

export type VentureImageField = 'logo' | 'cover';
