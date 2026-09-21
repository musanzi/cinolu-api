import { ApiProperty } from '@nestjs/swagger';

export class PortfolioResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ example: 'Venture building' })
  name: string;

  @ApiProperty({ example: 'venture-building' })
  slug: string;

  @ApiProperty({ example: 'Programs focused on building new ventures.', nullable: true, required: false })
  description?: string;

  @ApiProperty({ example: 'logo-123456789.png', nullable: true, required: false })
  logo?: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ format: 'date-time', nullable: true, example: null })
  deletedAt: Date | null;
}
