/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { EntityFields } from './common.interface';
import type { Program } from './programs.interface';

export interface Portfolio extends EntityFields {
  name: string;
  slug: string;
  description: string | null;
  logo?: string | null;
  programs?: Program[];
}

export interface CreatePortfolioBody {
  name: string; // max 150
  description?: string;
  logo?: string; // max 255
}

export type UpdatePortfolioBody = Partial<CreatePortfolioBody>;
