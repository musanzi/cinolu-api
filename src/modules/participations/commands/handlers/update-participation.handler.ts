import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isActivityOngoing } from '@/modules/activities/helpers';
import { ActivityParticipation } from '../../entities/activity-participation.entity';
import { ParticipationStatus } from '../../interfaces';
import { UpdateParticipation } from '../impl';

@CommandHandler(UpdateParticipation)
export class UpdateParticipationHandler implements ICommandHandler<UpdateParticipation, ActivityParticipation> {
  constructor(
    @InjectRepository(ActivityParticipation)
    private readonly repository: Repository<ActivityParticipation>
  ) {}

  async execute(command: UpdateParticipation): Promise<ActivityParticipation> {
    const { userId, id, saveParticipationDto } = command;
    const participation = await this.repository.findOne({ where: { id }, relations: { activity: true } });

    if (!participation) throw new NotFoundException('Participation introuvable');

    if (participation.userId !== userId)
      throw new ForbiddenException('Vous ne pouvez modifier que votre participation');

    if (participation.status !== ParticipationStatus.PENDING || !isActivityOngoing(participation.activity)) {
      throw new BadRequestException('Cette participation ne peut plus être modifiée');
    }

    return this.repository.save(this.repository.merge(participation, saveParticipationDto, { submitDate: new Date() }));
  }
}
