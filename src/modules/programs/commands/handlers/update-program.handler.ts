import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities';
import { FindProgramById } from '../../queries';
import { UpdateProgram } from '../impl';

@CommandHandler(UpdateProgram)
export class UpdateProgramHandler implements ICommandHandler<UpdateProgram, Program> {
  private readonly logger = new Logger(UpdateProgramHandler.name);

  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateProgram): Promise<Program> {
    try {
      const program = await this.queryBus.execute<FindProgramById, Program>(new FindProgramById(command.id));
      const { portfolioId, managers, ...fields } = command.updateProgramDto;

      await this.repository.save(
        this.repository.merge(program, {
          ...fields,
          portfolio: { id: portfolioId },
          managers: managers?.map((id) => ({ id }))
        })
      );
      return await this.queryBus.execute(new FindProgramById(program.id));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;

      this.logger.error(
        `Update program failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Modification du programme impossible');
    }
  }
}
