/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { Activity } from './activities.interface';
import type { EntityFields, SearchQuery } from './common.interface';
import type { Portfolio } from './portfolios.interface';
import type { UserRelation } from './users.interface';

export interface Program extends EntityFields {
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  portfolio?: Portfolio;
  programManagers?: UserRelation[];
  activities?: Activity[];
}

export interface CreateProgramBody {
  portfolioId: string;
  name: string; // max 150
  description?: string;
  logo?: string; // max 255
  programManagerIds?: string[]; // unique user UUIDs
}

export type UpdateProgramBody = Partial<CreateProgramBody>;

export type ProgramsQuery = SearchQuery & { portfolioId?: string; managerId?: string };
