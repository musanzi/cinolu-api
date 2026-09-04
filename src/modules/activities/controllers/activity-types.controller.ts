import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { CreateActivityType, DeleteActivityType, UpdateActivityType } from '../commands';
import { CreateActivityTypeDto, UpdateActivityTypeDto } from '../dto';
import { ActivityType } from '../entities';
import { IFilterActivityTypes } from '../interfaces';
import { FindActivityTypeById, FindActivityTypes } from '../queries';

@Controller('activity-types')
export class ActivityTypesController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  create(@Body() dto: CreateActivityTypeDto): Promise<ActivityType> {
    return this.commandHandler.execute(new CreateActivityType(dto));
  }

  @Get()
  findAll(@Query() query: IFilterActivityTypes): Promise<[ActivityType[], number]> {
    return this.queryHandler.execute(new FindActivityTypes(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ActivityType> {
    return this.queryHandler.execute(new FindActivityTypeById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  update(@Param('id') id: string, @Body() dto: UpdateActivityTypeDto): Promise<ActivityType> {
    return this.commandHandler.execute(new UpdateActivityType(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteActivityType(id));
  }
}
