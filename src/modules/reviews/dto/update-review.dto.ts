import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { ReviewData } from '../interfaces';

export class UpdateReviewDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    description: 'Answers to the activity review form (free-form JSON)'
  })
  @IsDefined()
  data: ReviewData;
}
