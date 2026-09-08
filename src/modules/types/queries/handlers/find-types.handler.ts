import { parsePaginationParams } from '@/shared/helpers';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from '../../entities';
import { FindTypes } from '../impl';

@QueryHandler(FindTypes)
export class FindTypesHandler implements IQueryHandler<FindTypes, [Type[], number]> {
  private readonly logger = new Logger(FindTypesHandler.name);

  constructor(@InjectRepository(Type) private readonly repository: Repository<Type>) {}

  async execute(query: FindTypes): Promise<[Type[], number]> {
    try {
      const { pageNumber, limitNumber } = parsePaginationParams(query.params);
      const builder = this.repository.createQueryBuilder('type').orderBy('type.name', 'ASC');
      if (query.params.q) builder.where('type.name ILIKE :q', { q: `%${query.params.q}%` });

      return await builder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Find types failed params="${JSON.stringify(query.params)}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Types introuvables');
    }
  }
}
