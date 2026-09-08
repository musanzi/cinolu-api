import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities';
import { FindProgramById } from '../../queries';
import { DeleteProgram } from '../impl';

@CommandHandler(DeleteProgram)
export class DeleteProgramHandler implements ICommandHandler<DeleteProgram, void> {
  private readonly logger = new Logger(DeleteProgramHandler.name);

  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteProgram): Promise<void> {
    try {
      await this.queryBus.execute(new FindProgramById(command.id));
      await this.repository.softDelete(command.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Delete program failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Suppression du programme impossible');
    }
  }
}
