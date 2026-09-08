import { Command } from '@nestjs/cqrs';
import { CreateTypeDto } from '../../dto';
import { Type } from '../../entities';

export class CreateType extends Command<Type> {
  constructor(public readonly createTypeDto: CreateTypeDto) {
    super();
  }
}
