import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venture } from '../../entities';
import { UpdateVentureStatus } from '../impl';

@CommandHandler(UpdateVentureStatus)
export class UpdateVentureStatusHandler implements ICommandHandler<UpdateVentureStatus, Venture> {
  constructor(@InjectRepository(Venture) private readonly repository: Repository<Venture>) {}

  async execute(command: UpdateVentureStatus): Promise<Venture> {
    const { id, updateVentureStatusDto } = command;
    const venture = await this.repository.findOneBy({ id });

    if (!venture) throw new NotFoundException('Initiative introuvable');

    return this.repository.save(this.repository.merge(venture, { status: updateVentureStatusDto.status }));
  }
}
