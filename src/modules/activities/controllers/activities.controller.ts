import { HasRoles, Public } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { createDiskUploadOptions } from '@/shared/helpers';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateActivity,
  DeleteActivity,
  ToggleActivityPublication,
  UpdateActivity,
  UploadActivityCover
} from '../commands';
import { CreateActivityDto, UpdateActivityDto } from '../dto';
import { Activity } from '../entities';
import { IFilterActivities } from '../interfaces';
import { FindActivities, FindActivityById, FindPublishedActivityBySlug, FindRecentActivities } from '../queries';

@Controller('activities')
export class ActivitiesController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  create(@Body() dto: CreateActivityDto): Promise<Activity> {
    return this.commandHandler.execute(new CreateActivity(dto));
  }

  @Get()
  @Public()
  findPublished(@Query() query: IFilterActivities): Promise<[Activity[], number]> {
    return this.queryHandler.execute(new FindActivities(query, true));
  }

  @Get('recent')
  @Public()
  findRecent(): Promise<Activity[]> {
    return this.queryHandler.execute(new FindRecentActivities());
  }

  @Get('staff')
  @HasRoles([Roles.STAFF])
  findAll(@Query() query: IFilterActivities): Promise<[Activity[], number]> {
    return this.queryHandler.execute(new FindActivities(query));
  }

  @Get('staff/:id')
  @HasRoles([Roles.STAFF])
  findOneForStaff(@Param('id') id: string): Promise<Activity> {
    return this.queryHandler.execute(new FindActivityById(id));
  }

  @Get(':slug')
  @Public()
  findOnePublished(@Param('slug') slug: string): Promise<Activity> {
    return this.queryHandler.execute(new FindPublishedActivityBySlug(slug));
  }

  @Post(':id/cover')
  @HasRoles([Roles.STAFF])
  @UseInterceptors(FileInterceptor('cover', createDiskUploadOptions('./uploads/activities')))
  uploadCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Activity> {
    return this.commandHandler.execute(new UploadActivityCover(id, file));
  }

  @Patch(':id/publication')
  @HasRoles([Roles.STAFF])
  togglePublication(@Param('id') id: string): Promise<Activity> {
    return this.commandHandler.execute(new ToggleActivityPublication(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto): Promise<Activity> {
    return this.commandHandler.execute(new UpdateActivity(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteActivity(id));
  }
}
