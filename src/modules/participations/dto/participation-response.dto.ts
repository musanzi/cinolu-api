import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto';
import { ParticipationData, ParticipationStatus } from '../interfaces';

export class ParticipationResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ type: UserResponseDto })
  participant: UserResponseDto;

  @ApiProperty({ type: 'object', additionalProperties: true, description: 'The activity this participation belongs to' })
  activity: Record<string, unknown>;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' }, example: { motivation: 'I want to join' } })
  data: ParticipationData;

  @ApiProperty({ enum: ParticipationStatus, example: ParticipationStatus.PENDING })
  status: ParticipationStatus;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ format: 'date-time', nullable: true, example: null })
  deletedAt: Date | null;
}
