import { Command } from '@nestjs/cqrs';
import { Request } from 'express';

export class SignOut extends Command<void> {
  constructor(public readonly request: Request) {
    super();
  }
}
