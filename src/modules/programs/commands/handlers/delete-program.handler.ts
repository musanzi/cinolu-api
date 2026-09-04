import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities/program.entity';
import { DeleteProgram } from '../impl';

@CommandHandler(DeleteProgram)
export class DeleteProgramHandler implements ICommandHandler<DeleteProgram, void> {
  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>
  ) {}

  async execute(command: DeleteProgram): Promise<void> {
    const result = await this.repository.softDelete(command.id);

    if (!result.affected) throw new NotFoundException('Programme introuvable');
  }
}
