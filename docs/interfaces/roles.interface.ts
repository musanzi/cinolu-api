/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */
import type { EntityFields } from './common.interface';

export interface Role extends EntityFields {
  name: string;
}

export interface CreateRoleBody {
  name: string; /* non-empty; database column max 50 */
}

export type UpdateRoleBody = Partial<CreateRoleBody>;
