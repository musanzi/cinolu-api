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
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import {
  CreateActivity,
  DeleteActivity,
  ToggleActivityPublication,
  UpdateActivity,
  UploadActivityCover
} from '../commands';
import { ActivityResponseDto, CreateActivityDto, FilterActivitiesDto, UpdateActivityDto } from '../dto';
import { Activity } from '../entities';
import { FindActivities, FindActivityById, FindActivityBySlug, FindRecentActivities } from '../queries';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Create a new activity (Staff only)' })
  @ApiCreatedResponse({ description: 'Activity created', type: ActivityResponseDto })
  create(@Body() dto: CreateActivityDto): Promise<Activity> {
    return this.commandHandler.execute(new CreateActivity(dto));
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published activities with pagination and search' })
  @ApiOkResponse({
    description: 'Paginated list of published activities: `items` is the page, `count` is the total number of matching activities',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(ActivityResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findPublished(@Query() query: FilterActivitiesDto): Promise<[Activity[], number]> {
    return this.queryHandler.execute(new FindActivities(query, true));
  }

  @Get('recent')
  @Public()
  @ApiOperation({ summary: 'List the 5 most recent published activities' })
  @ApiOkResponse({ description: 'List of recent published activities', type: [ActivityResponseDto] })
  findRecent(): Promise<Activity[]> {
    return this.queryHandler.execute(new FindRecentActivities());
  }

  @Get('staff')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'List all activities with pagination and search (Staff only)' })
  @ApiOkResponse({
    description: 'Paginated list of activities: `items` is the page, `count` is the total number of matching activities',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(ActivityResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findAll(@Query() query: FilterActivitiesDto): Promise<[Activity[], number]> {
    return this.queryHandler.execute(new FindActivities(query));
  }

  @Get('staff/:id')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Get any activity by ID (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the activity', format: 'uuid' })
  @ApiOkResponse({ description: 'Activity with the given ID', type: ActivityResponseDto })
  findOneForStaff(@Param('id') id: string): Promise<Activity> {
    return this.queryHandler.execute(new FindActivityById(id));
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get a published activity by slug' })
  @ApiParam({ name: 'slug', description: 'Slug of the activity', example: 'ai-workshop' })
  @ApiOkResponse({ description: 'Published activity with the given slug', type: ActivityResponseDto })
  findOnePublished(@Param('slug') slug: string): Promise<Activity> {
    return this.queryHandler.execute(new FindActivityBySlug(slug));
  }

  @Post(':id/cover')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Upload the cover image of an activity (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the activity', format: 'uuid' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cover: { type: 'string', format: 'binary' }
      },
      required: ['cover']
    }
  })
  @ApiOkResponse({ description: 'Activity with the new cover', type: ActivityResponseDto })
  @UseInterceptors(FileInterceptor('cover', createDiskUploadOptions('./uploads/activities')))
  uploadCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Activity> {
    return this.commandHandler.execute(new UploadActivityCover(id, file));
  }

  @Patch(':id/publication')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Toggle the publication state of an activity (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the activity', format: 'uuid' })
  @ApiOkResponse({ description: 'Activity with the toggled publication state', type: ActivityResponseDto })
  togglePublication(@Param('id') id: string): Promise<Activity> {
    return this.commandHandler.execute(new ToggleActivityPublication(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Update an activity (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the activity', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated activity', type: ActivityResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto): Promise<Activity> {
    return this.commandHandler.execute(new UpdateActivity(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Delete an activity (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the activity', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Activity deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteActivity(id));
  }
}
