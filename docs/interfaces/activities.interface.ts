/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { EntityFields, FormResponses, SearchQuery } from './common.interface';
import type { Program } from './programs.interface';

export interface Activity extends EntityFields {
  name: string;
  slug: string;
  description: string | null;
  startDate: string;
  endDate: string;
  participationForm: FormResponses;
  reviewForm: FormResponses;
  program?: Program;
  type?: ActivityType;
  categories?: ActivityCategory[];
}

export interface ActivityCategory extends EntityFields {
  name: string;
}

export interface ActivityType extends EntityFields {
  name: string;
}

export interface CreateActivityBody {
  programId: string;
  name: string; // max 150
  description?: string;
  typeId: string;
  categoryIds: string[]; // unique category UUIDs
  startDate: string;
  endDate: string; // must be later than startDate
  participationForm: FormResponses;
  reviewForm: FormResponses;
}

export type UpdateActivityBody = Partial<CreateActivityBody>;

export type ActivitiesQuery = SearchQuery & {
  programId?: string;
  typeId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

export interface CreateActivityCategoryBody {
  name: string; /* non-empty, max 100 */
}

export type UpdateActivityCategoryBody = Partial<CreateActivityCategoryBody>;

export interface CreateActivityTypeBody {
  name: string; /* non-empty, max 100 */
}

export type UpdateActivityTypeBody = Partial<CreateActivityTypeBody>;
