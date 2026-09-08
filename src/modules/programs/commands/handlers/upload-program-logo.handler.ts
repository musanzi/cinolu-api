import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { Repository } from 'typeorm';
import { Program } from '../../entities';
import { FindProgramById } from '../../queries';
import { UploadProgramLogo } from '../impl';

@CommandHandler(UploadProgramLogo)
export class UploadProgramLogoHandler implements ICommandHandler<UploadProgramLogo, Program> {
  private readonly logger = new Logger(UploadProgramLogoHandler.name);

  constructor(
    @InjectRepository(Program)
    private readonly repository: Repository<Program>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UploadProgramLogo): Promise<Program> {
    const { programId, file } = command;

    try {
      const program = await this.queryBus.execute<FindProgramById, Program>(new FindProgramById(programId));

      if (program.logo) {
        await promises.rm(`./uploads/programs/${program.logo}`, { force: true });
      }

      await this.repository.update(program.id, { logo: file.filename });

      return await this.queryBus.execute(new FindProgramById(program.id));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Upload program logo failed id="${programId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('Ajout du logo du programme impossible');
    }
  }
}
