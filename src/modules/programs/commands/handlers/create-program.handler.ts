import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { FindPortfolioById } from '@/modules/portfolios/queries';
import { CountUsersByIds } from '@/modules/users/queries';
import { Program } from '../../entities/program.entity';
import { mapProgramManagers } from '../../helpers';
import { CreateProgram } from '../impl';

@CommandHandler(CreateProgram)
export class CreateProgramHandler implements ICommandHandler<CreateProgram, Program> {
  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateProgram): Promise<Program> {
    const { portfolioId, programManagerIds } = command.createProgramDto;

    await this.queryBus.execute(new FindPortfolioById(portfolioId));

    if (programManagerIds?.length) {
      const count = await this.queryBus.execute(new CountUsersByIds(programManagerIds));

      if (count !== new Set(programManagerIds).size)
        throw new BadRequestException('Un ou plusieurs gestionnaires sont introuvables');
    }

    try {
      const program = this.repository.create({
        ...command.createProgramDto,
        programManagers: mapProgramManagers(programManagerIds)
      });

      return await this.repository.save(program);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException('Un programme avec ce nom existe déjà');
      }

      throw new BadRequestException('Création du programme impossible');
    }
  }
}
