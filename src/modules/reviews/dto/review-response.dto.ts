import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto';
import { ReviewData } from '../interfaces';

export class ReviewActivityResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ example: 'Workshop: Introduction to Design' })
  name: string;

  @ApiProperty({ example: 'workshop-introduction-to-design' })
  slug: string;

  @ApiProperty({ example: 'A hands-on design workshop for beginners.', nullable: true, required: false })
  description?: string;

  @ApiProperty({ format: 'date-time' })
  startDate: Date;

  @ApiProperty({ format: 'date-time' })
  endDate: Date;

  @ApiProperty({ example: false })
  isPublished: boolean;

  @ApiProperty({ example: 'activities/covers/workshop.jpg', nullable: true, required: false })
  cover?: string;
}

export class ReviewResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ type: () => UserResponseDto })
  reviewer: UserResponseDto;

  @ApiProperty({ type: () => ReviewActivityResponseDto })
  activity: ReviewActivityResponseDto;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    description: 'Answers to the activity review form (free-form JSON)'
  })
  data: ReviewData;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;
}
