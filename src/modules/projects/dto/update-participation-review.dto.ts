import { PartialType } from '@nestjs/mapped-types';
import { ReviewParticipationDto } from './review-participation.dto';

export class UpdateParticipationReviewDto extends PartialType(ReviewParticipationDto) {}
