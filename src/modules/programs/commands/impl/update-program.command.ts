import { Command } from '@nestjs/cqrs';
import { UpdateProgramDto } from '../../dto';
import { Program } from '../../entities/program.entity';

export class UpdateProgram extends Command<Program> {
  constructor(
    public readonly id: string,
    public readonly updateProgramDto: UpdateProgramDto
  ) {
    super();
  }
}
