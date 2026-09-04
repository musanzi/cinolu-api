import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { parseUsersCsv } from '../../helpers';
import { FindOrCreateUser, ImportUsersCsv } from '../impl';

@CommandHandler(ImportUsersCsv)
export class ImportUsersCsvHandler implements ICommandHandler<ImportUsersCsv, void> {
  private readonly logger = new Logger(ImportUsersCsvHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async execute(command: ImportUsersCsv): Promise<void> {
    try {
      const rows = await parseUsersCsv(command.file.buffer);

      for (const row of rows) {
        await this.commandBus.execute(new FindOrCreateUser(row));
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(`Import users csv failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('Import des utilisateurs impossible');
    }
  }
}
