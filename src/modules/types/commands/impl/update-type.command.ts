import { Command } from '@nestjs/cqrs';
import { UpdateTypeDto } from '../../dto';
import { Type } from '../../entities';

export class UpdateType extends Command<Type> {
  constructor(
    public readonly id: string,
    public readonly updateTypeDto: UpdateTypeDto
  ) {
    super();
  }
}
