import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { CreateSector, DeleteSector, UpdateSector } from '../commands';
import { CreateSectorDto, FilterSectorsDto, SectorResponseDto, UpdateSectorDto } from '../dto';
import { Sector } from '../entities';
import { FindSectorById, FindSectors } from '../queries';

@ApiTags('sectors')
@Controller('sectors')
export class SectorsController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Create a sector. Staff only.' })
  @ApiCreatedResponse({ description: 'Sector created', type: SectorResponseDto })
  create(@Body() dto: CreateSectorDto): Promise<Sector> {
    return this.commandHandler.execute(new CreateSector(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List sectors' })
  @ApiOkResponse({
    description: 'Paginated sectors: the items array and the total count',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(SectorResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findAll(@Query() query: FilterSectorsDto): Promise<[Sector[], number]> {
    return this.queryHandler.execute(new FindSectors(query));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sector by id' })
  @ApiParam({ name: 'id', description: 'Sector id (UUID)' })
  @ApiOkResponse({ description: 'Sector', type: SectorResponseDto })
  findOne(@Param('id') id: string): Promise<Sector> {
    return this.queryHandler.execute(new FindSectorById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Update a sector. Staff only.' })
  @ApiParam({ name: 'id', description: 'Sector id (UUID)' })
  @ApiOkResponse({ description: 'Updated sector', type: SectorResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateSectorDto): Promise<Sector> {
    return this.commandHandler.execute(new UpdateSector(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Delete a sector. Staff only.' })
  @ApiParam({ name: 'id', description: 'Sector id (UUID)' })
  @ApiNoContentResponse({ description: 'Sector deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteSector(id));
  }
}
