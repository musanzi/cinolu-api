import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from '../../entities';
import { FindSectorById } from '../../queries';
import { DeleteSector } from '../impl';

@CommandHandler(DeleteSector)
export class DeleteSectorHandler implements ICommandHandler<DeleteSector, void> {
  private readonly logger = new Logger(DeleteSectorHandler.name);

  constructor(
    @InjectRepository(Sector)
    private readonly repository: Repository<Sector>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteSector): Promise<void> {
    try {
      await this.queryBus.execute(new FindSectorById(command.id));

      await this.repository.softDelete(command.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Delete sector failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );

      throw new BadRequestException('Suppression du secteur impossible');
    }
  }
}
