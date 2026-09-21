import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';
import { ReviewData } from '../interfaces';

export class CreateReviewDto {
  @IsUUID('4')
  activityId: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    description: 'Answers to the activity review form (free-form JSON)'
  })
  @IsDefined()
  data: ReviewData;
}
