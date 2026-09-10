import { ParticipationStatus } from '@/modules/participations/interfaces';
import { FindParticipationByParticipantAndActivity } from '@/modules/participations/queries';
import { BadRequestException, ConflictException, ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Review } from '../../entities';
import { FindReviewById, FindReviewByReviewerAndActivity } from '../../queries';
import { CreateReview } from '../impl';

@CommandHandler(CreateReview)
export class CreateReviewHandler implements ICommandHandler<CreateReview, Review> {
  private readonly logger = new Logger(CreateReviewHandler.name);

  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: CreateReview): Promise<Review> {
    const { reviewerId, dto } = command;

    try {
      const participation = await this.queryBus.execute(
        new FindParticipationByParticipantAndActivity(reviewerId, dto.activityId)
      );

      if (!participation || participation.status !== ParticipationStatus.APPROVED) {
        throw new ForbiddenException('Seuls les participants approuvés peuvent évaluer cette activité');
      }

      const now = new Date();
      if (now < participation.activity.startDate) {
        throw new BadRequestException("L'évaluation ne peut être soumise qu'après le début de l'activité");
      }
      if (now > participation.activity.endDate) {
        throw new BadRequestException("La période d'évaluation de cette activité est terminée");
      }

      const existing = await this.queryBus.execute(new FindReviewByReviewerAndActivity(reviewerId, dto.activityId));
      if (existing) {
        throw new ConflictException('Vous avez déjà évalué cette activité');
      }

      const created = await this.repository.save({
        reviewer: { id: reviewerId },
        activity: { id: dto.activityId },
        data: dto.data
      });

      return await this.queryBus.execute<FindReviewById, Review>(new FindReviewById(created.id));
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new ConflictException('Vous avez déjà évalué cette activité');
      }
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      this.logger.error(
        `Create review failed reviewerId="${reviewerId}" activityId="${dto.activityId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Création de l'évaluation impossible");
    }
  }
}
