import { IsObject } from 'class-validator';
import { FormResponses } from '@/modules/activities/interfaces';

export class SaveReviewDto {
  @IsObject()
  responses: FormResponses;
}
