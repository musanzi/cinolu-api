import { Command } from '@nestjs/cqrs';
import { CreateProgramDto } from '../../dto';
import { Program } from '../../entities';

export class CreateProgram extends Command<Program> {
  constructor(public readonly createProgramDto: CreateProgramDto) {
    super();
  }
}
