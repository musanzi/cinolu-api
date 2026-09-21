import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities';
import { FindProgramBySlug } from '../impl';

@QueryHandler(FindProgramBySlug)
export class FindProgramBySlugHandler implements IQueryHandler<FindProgramBySlug, Program> {
  private readonly logger = new Logger(FindProgramBySlugHandler.name);

  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>
  ) {}

  async execute(query: FindProgramBySlug): Promise<Program> {
    try {
      return await this.repository.findOneOrFail({
        where: { slug: query.slug },
        relations: ['portfolio', 'managers']
      });
    } catch (error) {
      this.logger.error(
        `Find program by slug failed slug="${query.slug}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Programme introuvable');
    }
  }
}
