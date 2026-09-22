import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from '../../categories/dto';
import { TypeResponseDto } from '../../types/dto';
import { UserResponseDto } from '../../users/dto';
import { ActivityForm, ActivityResource } from '../interfaces';

export class ActivityProgramResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ example: 'Incubation Program 2026' })
  name: string;

  @ApiProperty({ example: 'incubation-program-2026' })
  slug: string;

  @ApiProperty({ example: 'A six-month incubation program.', nullable: true, required: false })
  description?: string;

  @ApiProperty({ example: null, nullable: true })
  logo: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ format: 'date-time', nullable: true, example: null })
  deletedAt: Date | null;
}

export class ActivityResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ example: 'AI Workshop' })
  name: string;

  @ApiProperty({ example: 'ai-workshop' })
  slug: string;

  @ApiProperty({ example: 'A hands-on workshop about AI.', nullable: true, required: false })
  description?: string;

  @ApiProperty({ format: 'date-time' })
  startDate: Date;

  @ApiProperty({ format: 'date-time' })
  endDate: Date;

  @ApiProperty({ type: 'object', additionalProperties: true, example: { questions: ['Why do you want to join?'] } })
  participationForm: ActivityForm;

  @ApiProperty({ example: false })
  isPublished: boolean;

  @ApiProperty({ type: 'object', additionalProperties: true, example: { criteria: ['Originality'] } })
  reviewForm: ActivityForm;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Google Meet' },
        value: { type: 'string', example: 'https://meet.google.com/abc-defg-hij' }
      }
    },
    example: [{ title: 'Google Meet', value: 'https://meet.google.com/abc-defg-hij' }]
  })
  resources: ActivityResource[];

  @ApiProperty({ example: null, nullable: true })
  cover?: string;

  @ApiProperty({ type: ActivityProgramResponseDto })
  program: ActivityProgramResponseDto;

  @ApiProperty({ type: [UserResponseDto] })
  mentors: UserResponseDto[];

  @ApiProperty({ type: [TypeResponseDto] })
  types: TypeResponseDto[];

  @ApiProperty({ type: [CategoryResponseDto] })
  categories: CategoryResponseDto[];

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ format: 'date-time', nullable: true, example: null })
  deletedAt: Date | null;
}
