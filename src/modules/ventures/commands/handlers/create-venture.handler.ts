import { BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Venture } from '../../entities';
import { getVentureFields } from '../../helpers';
import { CreateVenture } from '../impl';

@CommandHandler(CreateVenture)
export class CreateVentureHandler implements ICommandHandler<CreateVenture, Venture> {
  private readonly logger = new Logger(CreateVentureHandler.name);

  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  async execute(command: CreateVenture): Promise<Venture> {
    const { ownerId, createVentureDto } = command;

    try {
      return await this.repository.save(
        this.repository.create({ owner: { id: ownerId }, ...getVentureFields(createVentureDto) })
      );
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505'
      ) {
        throw new ConflictException('Une initiative avec ce nom existe déjà');
      }

      this.logger.error(`Create venture failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException("Création de l'initiative impossible");
    }
  }
}
