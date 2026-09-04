export interface IPagination {
  page?: number | string;
  limit?: number | string;
  take?: number | string;
}

export interface IParsedPaginationParams {
  pageNumber: number;
  limitNumber: number;
}
