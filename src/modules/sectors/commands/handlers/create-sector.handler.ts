import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from '../../entities';
import { CreateSector } from '../impl';

@CommandHandler(CreateSector)
export class CreateSectorHandler implements ICommandHandler<CreateSector, Sector> {
  private readonly logger = new Logger(CreateSectorHandler.name);

  constructor(
    @InjectRepository(Sector)
    private readonly repository: Repository<Sector>
  ) {}

  async execute(command: CreateSector): Promise<Sector> {
    try {
      return await this.repository.save(command.createSectorDto);
    } catch (error) {
      this.logger.error(`Create sector failed: ${error instanceof Error ? error.message : String(error)}`);

      throw new BadRequestException('Création du secteur impossible');
    }
  }
}
