import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities';
import { FindRecentPrograms } from '../impl';

@QueryHandler(FindRecentPrograms)
export class FindRecentProgramsHandler implements IQueryHandler<FindRecentPrograms, Program[]> {
  private readonly logger = new Logger(FindRecentProgramsHandler.name);

  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>
  ) {}

  async execute(): Promise<Program[]> {
    try {
      return await this.repository
        .createQueryBuilder('program')
        .leftJoinAndSelect('program.portfolio', 'portfolio')
        .leftJoinAndSelect('program.managers', 'managers')
        .orderBy('program.createdAt', 'DESC')
        .take(5)
        .getMany();
    } catch (error) {
      this.logger.error(`Find recent programs failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('Programmes récents introuvables');
    }
  }
}
