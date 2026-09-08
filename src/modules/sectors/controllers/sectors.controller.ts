import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSector, DeleteSector, UpdateSector } from '../commands';
import { CreateSectorDto, UpdateSectorDto } from '../dto';
import { Sector } from '../entities';
import { IFilterSectors } from '../interfaces';
import { FindSectorById, FindSectors } from '../queries';

@Controller('sectors')
export class SectorsController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  create(@Body() dto: CreateSectorDto): Promise<Sector> {
    return this.commandHandler.execute(new CreateSector(dto));
  }

  @Get()
  findAll(@Query() query: IFilterSectors): Promise<[Sector[], number]> {
    return this.queryHandler.execute(new FindSectors(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Sector> {
    return this.queryHandler.execute(new FindSectorById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  update(@Param('id') id: string, @Body() dto: UpdateSectorDto): Promise<Sector> {
    return this.commandHandler.execute(new UpdateSector(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteSector(id));
  }
}
