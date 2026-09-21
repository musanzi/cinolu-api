import { ApiPropertyOptional } from '@nestjs/swagger';
import { VentureStage, VentureStatus } from '../interfaces';

export class FilterVenturesDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  page?: number | string;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
  limit?: number | string;

  @ApiPropertyOptional({ description: 'Number of items to take', example: 10 })
  take?: number | string;

  @ApiPropertyOptional({ description: 'Search term matched against the venture name and owner name/email' })
  q?: string;

  @ApiPropertyOptional({ format: 'uuid', description: 'Filter by sector id' })
  sectorId?: string;

  @ApiPropertyOptional({ enum: VentureStage, description: 'Filter by venture stage' })
  stage?: VentureStage;

  @ApiPropertyOptional({ enum: VentureStatus, description: 'Filter by venture status' })
  status?: VentureStatus;
}
