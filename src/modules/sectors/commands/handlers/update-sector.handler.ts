import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from '../../entities';
import { FindSectorById } from '../../queries';
import { UpdateSector } from '../impl';

@CommandHandler(UpdateSector)
export class UpdateSectorHandler implements ICommandHandler<UpdateSector, Sector> {
  private readonly logger = new Logger(UpdateSectorHandler.name);

  constructor(
    @InjectRepository(Sector)
    private readonly repository: Repository<Sector>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateSector): Promise<Sector> {
    try {
      const sector = await this.queryBus.execute<FindSectorById, Sector>(new FindSectorById(command.id));
      return await this.repository.save(this.repository.merge(sector, command.updateSectorDto));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Update sector failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Modification du secteur impossible');
    }
  }
}
