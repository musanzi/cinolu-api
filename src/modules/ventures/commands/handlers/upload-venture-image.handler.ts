import { BadRequestException, ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { promises } from 'fs';
import { Venture } from '../../entities';
import { FindOwnedVentureById, FindVentureById } from '../../queries';
import { UploadVentureImage } from '../impl';

@CommandHandler(UploadVentureImage)
export class UploadVentureImageHandler implements ICommandHandler<UploadVentureImage, Venture> {
  private readonly logger = new Logger(UploadVentureImageHandler.name);

  constructor(private readonly queryBus: QueryBus) {}

  async execute(command: UploadVentureImage): Promise<Venture> {
    try {
      const venture = await this.queryBus.execute(new FindOwnedVentureById(command.ventureId, command.ownerId));
      const previous = venture[command.field];

      if (previous) await promises.rm(`./uploads/ventures/${previous}`, { force: true });

      return await this.queryBus.execute(new FindVentureById(venture.id));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;

      this.logger.error(
        `Upload venture ${command.field} failed id="${command.ventureId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Ajout de l'image de l'initiative impossible");
    }
  }
}
