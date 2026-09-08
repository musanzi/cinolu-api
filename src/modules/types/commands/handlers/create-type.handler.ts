import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from '../../entities';
import { CreateType } from '../impl';

@CommandHandler(CreateType)
export class CreateTypeHandler implements ICommandHandler<CreateType, Type> {
  private readonly logger = new Logger(CreateTypeHandler.name);

  constructor(
    @InjectRepository(Type)
    private readonly repository: Repository<Type>
  ) {}

  async execute(command: CreateType): Promise<Type> {
    try {
      return await this.repository.save(command.createTypeDto);
    } catch (error) {
      this.logger.error(`Create type failed: ${error instanceof Error ? error.message : String(error)}`);

      throw new BadRequestException('Création du type impossible');
    }
  }
}
