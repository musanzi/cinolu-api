import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from '../../entities';
import { FindTypeById } from '../../queries';
import { DeleteType } from '../impl';

@CommandHandler(DeleteType)
export class DeleteTypeHandler implements ICommandHandler<DeleteType, void> {
  private readonly logger = new Logger(DeleteTypeHandler.name);

  constructor(
    @InjectRepository(Type)
    private readonly repository: Repository<Type>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: DeleteType): Promise<void> {
    try {
      await this.queryBus.execute(new FindTypeById(command.id));

      await this.repository.softDelete(command.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Delete type failed id="${command.id}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Suppression du type impossible');
    }
  }
}
