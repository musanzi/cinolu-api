import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto';

export class ProgramResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ example: 'Incubation Program' })
  name: string;

  @ApiProperty({ example: 'incubation-program' })
  slug: string;

  @ApiProperty({ example: 'A 6-month incubation program for early-stage startups.', nullable: true })
  description?: string;

  @ApiProperty({ example: null, nullable: true })
  logo?: string;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
      name: { type: 'string', example: 'Entrepreneurship' },
      slug: { type: 'string', example: 'entrepreneurship' }
    }
  })
  portfolio: { id: string; name: string; slug: string };

  @ApiProperty({ type: () => [UserResponseDto] })
  managers: UserResponseDto[];

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ format: 'date-time', nullable: true, example: null })
  deletedAt: Date | null;
}
