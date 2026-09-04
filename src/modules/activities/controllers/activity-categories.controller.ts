import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { CreateActivityCategory, DeleteActivityCategory, UpdateActivityCategory } from '../commands';
import { CreateActivityCategoryDto, UpdateActivityCategoryDto } from '../dto';
import { ActivityCategory } from '../entities';
import { IFilterActivityCategories } from '../interfaces';
import { FindActivityCategories, FindActivityCategoryById } from '../queries';

@Controller('activity-categories')
export class ActivityCategoriesController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  create(@Body() dto: CreateActivityCategoryDto): Promise<ActivityCategory> {
    return this.commandHandler.execute(new CreateActivityCategory(dto));
  }

  @Get()
  findAll(@Query() query: IFilterActivityCategories): Promise<[ActivityCategory[], number]> {
    return this.queryHandler.execute(new FindActivityCategories(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ActivityCategory> {
    return this.queryHandler.execute(new FindActivityCategoryById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  update(@Param('id') id: string, @Body() dto: UpdateActivityCategoryDto): Promise<ActivityCategory> {
    return this.commandHandler.execute(new UpdateActivityCategory(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteActivityCategory(id));
  }
}
