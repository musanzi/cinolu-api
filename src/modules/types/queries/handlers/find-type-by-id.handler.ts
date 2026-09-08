import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from '../../entities';
import { FindTypeById } from '../impl';

@QueryHandler(FindTypeById)
export class FindTypeByIdHandler implements IQueryHandler<FindTypeById, Type> {
  private readonly logger = new Logger(FindTypeByIdHandler.name);

  constructor(
    @InjectRepository(Type)
    private readonly repository: Repository<Type>
  ) {}

  async execute(query: FindTypeById): Promise<Type> {
    try {
      return await this.repository.findOneByOrFail({ id: query.id });
    } catch (error) {
      this.logger.error(
        `Find type by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Type introuvable');
    }
  }
}
