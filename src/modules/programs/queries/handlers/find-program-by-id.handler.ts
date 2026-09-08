import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities';
import { FindProgramById } from '../impl';

@QueryHandler(FindProgramById)
export class FindProgramByIdHandler implements IQueryHandler<FindProgramById, Program> {
  private readonly logger = new Logger(FindProgramByIdHandler.name);

  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>
  ) {}

  async execute(query: FindProgramById): Promise<Program> {
    try {
      return await this.repository.findOneOrFail({
        where: { id: query.id },
        relations: ['portfolio', 'managers']
      });
    } catch (error) {
      this.logger.error(
        `Find program by id failed id="${query.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new NotFoundException('Programme introuvable');
    }
  }
}
