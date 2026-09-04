import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityParticipation } from '../../entities/activity-participation.entity';
import { assertParticipationManager } from '../../helpers';
import { UpdateParticipationStatus } from '../impl';

@CommandHandler(UpdateParticipationStatus)
export class UpdateParticipationStatusHandler implements ICommandHandler<
  UpdateParticipationStatus,
  ActivityParticipation
> {
  constructor(
    @InjectRepository(ActivityParticipation)
    private readonly repository: Repository<ActivityParticipation>
  ) {}

  async execute(command: UpdateParticipationStatus): Promise<ActivityParticipation> {
    const { actor, id, updateParticipationStatusDto } = command;
    const participation = await this.repository.findOneBy({ id });

    if (!participation) throw new NotFoundException('Participation introuvable');

    await assertParticipationManager(this.repository, id, actor);

    return this.repository.save(this.repository.merge(participation, updateParticipationStatusDto));
  }
}
