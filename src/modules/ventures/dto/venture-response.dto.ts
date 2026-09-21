import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto';
import { VentureSocials, VentureStage, VentureStatus } from '../interfaces';

export class VentureResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ example: 'OneStop' })
  name: string;

  @ApiProperty({ example: 'onestop' })
  slug: string;

  @ApiProperty({ example: null, nullable: true })
  logo: string | null;

  @ApiProperty({ example: null, nullable: true })
  cover: string | null;

  @ApiProperty({ example: 'A platform connecting entrepreneurs and investors.' })
  description: string;

  @ApiProperty({ type: 'object', additionalProperties: true, example: { website: 'https://onestop.example.com' } })
  socials: VentureSocials;

  @ApiProperty({ enum: VentureStage, example: VentureStage.IDEA })
  stage: VentureStage;

  @ApiProperty({ enum: VentureStatus, example: VentureStatus.PENDING })
  status: VentureStatus;

  @ApiProperty({ type: () => UserResponseDto })
  owner: UserResponseDto;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
        name: { type: 'string', example: 'Fintech' }
      }
    }
  })
  sectors: { id: string; name: string }[];

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ format: 'date-time', nullable: true, example: null })
  deletedAt: Date | null;
}
