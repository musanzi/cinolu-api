import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { FindVentureById } from '../impl';

@QueryHandler(FindVentureById)
export class FindVentureByIdHandler implements IQueryHandler<FindVentureById, Venture> {
  private readonly logger = new Logger(FindVentureByIdHandler.name);

  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  async execute(query: FindVentureById): Promise<Venture> {
    try {
      return await this.repository.findOneOrFail({
        where: { id: query.id },
        relations: { owner: true, sectors: true }
      });
    } catch (error) {
      this.logger.error(
        `Find venture by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Initiative introuvable');
    }
  }
}
