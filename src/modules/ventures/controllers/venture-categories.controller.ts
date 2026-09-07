import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { CreateVentureCategory, DeleteVentureCategory, UpdateVentureCategory } from '../commands';
import { CreateVentureCategoryDto, UpdateVentureCategoryDto } from '../dto';
import { VentureCategory } from '../entities';
import { IFilterVentureCategories } from '../interfaces';
import { FindVentureCategories, FindVentureCategoryById } from '../queries';

@Controller('venture-categories')
export class VentureCategoriesController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  create(@Body() dto: CreateVentureCategoryDto): Promise<VentureCategory> {
    return this.commandHandler.execute(new CreateVentureCategory(dto));
  }

  @Get()
  findAll(@Query() query: IFilterVentureCategories): Promise<[VentureCategory[], number]> {
    return this.queryHandler.execute(new FindVentureCategories(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<VentureCategory> {
    return this.queryHandler.execute(new FindVentureCategoryById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  update(@Param('id') id: string, @Body() dto: UpdateVentureCategoryDto): Promise<VentureCategory> {
    return this.commandHandler.execute(new UpdateVentureCategory(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteVentureCategory(id));
  }
}
