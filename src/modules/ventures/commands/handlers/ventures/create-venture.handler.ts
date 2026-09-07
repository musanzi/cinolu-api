import { BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Venture } from '../../../entities';
import { getVentureFields } from '../../../helpers';
import { CountVentureCategoriesByIds } from '../../../queries';
import { CreateVenture } from '../../impl';

@CommandHandler(CreateVenture)
export class CreateVentureHandler implements ICommandHandler<CreateVenture, Venture> {
  private readonly logger = new Logger(CreateVentureHandler.name);

  constructor(
    @InjectRepository(Venture) private readonly repository: Repository<Venture>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateVenture): Promise<Venture> {
    const { ownerId, createVentureDto } = command;
    const { categoryIds } = createVentureDto;

    if (categoryIds?.length) {
      const count = await this.queryBus.execute(new CountVentureCategoriesByIds(categoryIds));
      if (count !== new Set(categoryIds).size)
        throw new BadRequestException('Une ou plusieurs catégories sont introuvables');
    }

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
