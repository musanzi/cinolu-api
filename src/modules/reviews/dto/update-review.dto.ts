import { IsDefined } from 'class-validator';
import { ReviewData } from '../interfaces';

export class UpdateReviewDto {
  @IsDefined()
  data: ReviewData;
}
