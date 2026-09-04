import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export abstract class AbstractController {
  constructor(
    protected readonly commandHandler: CommandBus,
    protected readonly queryHandler: QueryBus
  ) {}
}
