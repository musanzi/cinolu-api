import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterRolesDto {
  @ApiPropertyOptional({ description: 'Search roles by name' })
  q?: string;

  @ApiPropertyOptional({ description: 'Page number', type: 'integer' })
  page?: number | string;

  @ApiPropertyOptional({ description: 'Number of roles per page', type: 'integer' })
  limit?: number | string;

  @ApiPropertyOptional({ description: 'Alias of limit', type: 'integer' })
  take?: number | string;
}
