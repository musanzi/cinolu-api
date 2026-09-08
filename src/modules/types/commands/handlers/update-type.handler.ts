import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from '../../entities';
import { FindTypeById } from '../../queries';
import { UpdateType } from '../impl';

@CommandHandler(UpdateType)
export class UpdateTypeHandler implements ICommandHandler<UpdateType, Type> {
  private readonly logger = new Logger(UpdateTypeHandler.name);

  constructor(
    @InjectRepository(Type)
    private readonly repository: Repository<Type>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateType): Promise<Type> {
    try {
      const type = await this.queryBus.execute(new FindTypeById(command.id));

      return await this.repository.save({
        ...type,
        ...command.updateTypeDto
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Update type failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Modification du type impossible');
    }
  }
}
