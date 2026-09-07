/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */

export interface PaginationQuery {
  page?: number | string; // integer >= 1; default 1
  limit?: number | string; // integer 1..100; default 20
  take?: number | string; // alias for limit
}

export type Paginated<T> = [items: T[], total: number];

export interface EntityFields {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type FormResponses = Record<string, unknown>;

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface IdParams {
  id: string; /* UUID */
}

export interface ActivityIdParams {
  activityId: string; /* UUID */
}

export interface SlugParams {
  slug: string;
}

export interface EmailParams {
  email: string; /* URL-encode when used in a path */
}

export type SearchQuery = PaginationQuery & { q?: string };
