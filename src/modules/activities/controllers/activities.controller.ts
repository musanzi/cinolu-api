import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AbstractController } from '@/shared/abstracts';
import { CurrentUser, Public } from '@/modules/auth/decorators';
import { IUserResponse } from '@/modules/users/interfaces';
import { CreateActivity, DeleteActivity, UpdateActivity } from '../commands';
import { CreateActivityDto, UpdateActivityDto } from '../dto';
import { Activity } from '../entities/activity.entity';
import { IFilterActivities } from '../interfaces';
import { FindActivities, FindActivitiesByProgramSlug, FindActivityById, FindRecentActivities } from '../queries';

@Controller('activities')
export class ActivitiesController extends AbstractController {
  @Post()
  create(@CurrentUser() actor: IUserResponse, @Body() dto: CreateActivityDto): Promise<Activity> {
    return this.commandHandler.execute(new CreateActivity(actor, dto));
  }

  @Get()
  findAll(@CurrentUser() actor: IUserResponse, @Query() query: IFilterActivities): Promise<[Activity[], number]> {
    return this.queryHandler.execute(new FindActivities(actor, query));
  }

  @Get('recent')
  @Public()
  findRecent(): Promise<Activity[]> {
    return this.queryHandler.execute(new FindRecentActivities());
  }

  @Get('programs/:slug')
  findByProgramSlug(@Param('slug') slug: string): Promise<Activity[]> {
    return this.queryHandler.execute(new FindActivitiesByProgramSlug(slug));
  }

  @Get(':id')
  findOne(@CurrentUser() actor: IUserResponse, @Param('id') id: string): Promise<Activity> {
    return this.queryHandler.execute(new FindActivityById(actor, id));
  }

  @Patch(':id')
  update(
    @CurrentUser() actor: IUserResponse,
    @Param('id') id: string,
    @Body() dto: UpdateActivityDto
  ): Promise<Activity> {
    return this.commandHandler.execute(new UpdateActivity(actor, id, dto));
  }

  @Delete(':id')
  remove(@CurrentUser() actor: IUserResponse, @Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteActivity(actor, id));
  }
}
