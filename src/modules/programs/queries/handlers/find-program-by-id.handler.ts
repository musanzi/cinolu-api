import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities/program.entity';
import { FindProgramById } from '../impl';

@QueryHandler(FindProgramById)
export class FindProgramByIdHandler implements IQueryHandler<FindProgramById, Program> {
  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>
  ) {}

  async execute(query: FindProgramById): Promise<Program> {
    const program = await this.repository.findOne({
      where: { id: query.id },
      relations: { portfolio: true, programManagers: true, activities: true }
    });

    if (!program) throw new NotFoundException('Programme introuvable');

    return program;
  }
}
