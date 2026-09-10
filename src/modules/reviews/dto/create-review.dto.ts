import { IsDefined, IsUUID } from 'class-validator';
import { ReviewData } from '../interfaces';

export class CreateReviewDto {
  @IsUUID('4')
  activityId: string;

  @IsDefined()
  data: ReviewData;
}
