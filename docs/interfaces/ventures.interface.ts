/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { EntityFields, SearchQuery } from './common.interface';
import type { UserRelation } from './users.interface';

export interface Venture extends EntityFields {
  name: string;
  slug: string;
  pitch: string;
  description: string;
  logo?: string | null;
  links: Record<string, unknown>;
  status: VentureStatus;
  owner?: UserRelation;
  categories?: VentureCategory[];
}

export interface VentureCategory extends EntityFields {
  name: string;
}

export type VentureStatus = 'draft' | 'published' | 'rejected';

export interface CreateVentureBody {
  categoryIds?: string[]; // unique venture category UUID v4s; must exist
  name: string; // max 150
  pitch: string; // max 255
  description: string;
  logo?: string; // max 255
  links?: Record<string, unknown>;
}

export type UpdateVentureBody = Partial<CreateVentureBody>;

export interface CreateVentureCategoryBody {
  name: string; /* non-empty, max 100 */
}

export type UpdateVentureCategoryBody = Partial<CreateVentureCategoryBody>;

export interface UpdateVentureStatusBody {
  status: VentureStatus;
}

export type PublishedVenturesQuery = SearchQuery & { categoryId?: string };

export type VenturesQuery = PublishedVenturesQuery & { status?: VentureStatus };
