import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '@/modules/auth/enums';
import { Program } from '../../entities/program.entity';
import { FindManagedProgramById } from '../impl';

@QueryHandler(FindManagedProgramById)
export class FindManagedProgramByIdHandler implements IQueryHandler<FindManagedProgramById, Program> {
  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>
  ) {}

  async execute(query: FindManagedProgramById): Promise<Program> {
    const program = await this.repository.findOne({ where: { id: query.id }, relations: { programManagers: true } });

    if (!program) throw new NotFoundException('Programme introuvable');

    const isAdmin = query.actor.roles?.includes(Roles.STAFF);
    const isManager = program.programManagers.some((manager) => manager.id === query.actor.id);

    if (!isAdmin && !isManager) throw new ForbiddenException('Vous ne gérez pas ce programme');

    return program;
  }
}
