import { ApiProperty } from '@nestjs/swagger';

export class CohortProgramResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ example: 'Incubation Program 2026' })
  name: string;

  @ApiProperty({ example: 'incubation-program-2026' })
  slug: string;

  @ApiProperty({ example: null, nullable: true })
  logo: string | null;
}

export class CohortResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ example: 'Cohort 2026 - Batch 1' })
  name: string;

  @ApiProperty({ type: CohortProgramResponseDto })
  program: CohortProgramResponseDto;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ format: 'date-time', nullable: true, example: null })
  deletedAt: Date | null;
}
