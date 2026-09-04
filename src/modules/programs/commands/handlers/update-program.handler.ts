import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { FindPortfolioById } from '@/modules/portfolios/queries';
import { CountUsersByIds } from '@/modules/users/queries';
import { Program } from '../../entities/program.entity';
import { mapProgramManagers } from '../../helpers';
import { UpdateProgram } from '../impl';

@CommandHandler(UpdateProgram)
export class UpdateProgramHandler implements ICommandHandler<UpdateProgram, Program> {
  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateProgram): Promise<Program> {
    const { id, updateProgramDto } = command;
    const { portfolioId, programManagerIds } = updateProgramDto;
    const program = await this.repository.findOne({ where: { id }, relations: { programManagers: true } });

    if (!program) throw new NotFoundException('Programme introuvable');

    if (portfolioId !== undefined) {
      await this.queryBus.execute(new FindPortfolioById(portfolioId));
    }

    if (programManagerIds !== undefined) {
      if (programManagerIds.length) {
        const count = await this.queryBus.execute(new CountUsersByIds(programManagerIds));

        if (count !== new Set(programManagerIds).size)
          throw new BadRequestException('Un ou plusieurs gestionnaires sont introuvables');
      }

      program.programManagers = mapProgramManagers(programManagerIds) as User[];
    }

    const programFields = { ...updateProgramDto };

    delete programFields.programManagerIds;

    const updatedProgram = this.repository.merge(program, programFields);

    try {
      return await this.repository.save(updatedProgram);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException('Un programme avec ce nom existe déjà');
      }

      throw new BadRequestException('Modification du programme impossible');
    }
  }
}
