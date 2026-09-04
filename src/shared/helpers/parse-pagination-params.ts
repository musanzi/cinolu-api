import { BadRequestException } from '@nestjs/common';
import { IPagination, IParsedPaginationParams } from '../interfaces';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePaginationParams(params: IPagination): IParsedPaginationParams {
  const { page = 1, limit, take } = params;
  const pageNumber = Number(page);
  const limitNumber = Number(limit ?? take ?? DEFAULT_LIMIT);

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    !Number.isInteger(limitNumber) ||
    limitNumber < 1 ||
    limitNumber > MAX_LIMIT
  ) {
    throw new BadRequestException('Les paramètres de pagination sont invalides');
  }

  return { pageNumber, limitNumber };
}
