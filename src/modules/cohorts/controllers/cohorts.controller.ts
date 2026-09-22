import { HasRoles, Public } from '@/modules/auth/decorators';
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
import { CreateCohort, DeleteCohort, UpdateCohort } from '../commands';
import { CohortResponseDto, CreateCohortDto, FilterCohortsDto, UpdateCohortDto } from '../dto';
import { Cohort } from '../entities';
import { FindCohorts } from '../queries';

@ApiTags('cohorts')
@Controller('cohorts')
export class CohortsController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Create a new cohort (Staff only)' })
  @ApiCreatedResponse({ description: 'Cohort created', type: CohortResponseDto })
  create(@Body() dto: CreateCohortDto): Promise<Cohort> {
    return this.commandHandler.execute(new CreateCohort(dto));
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List cohorts with pagination and filters' })
  @ApiOkResponse({
    description: 'Paginated list of cohorts: `items` is the page, `count` is the total number of matching cohorts',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(CohortResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findAll(@Query() query: FilterCohortsDto): Promise<[Cohort[], number]> {
    return this.queryHandler.execute(new FindCohorts(query));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Update a cohort (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the cohort', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated cohort', type: CohortResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateCohortDto): Promise<Cohort> {
    return this.commandHandler.execute(new UpdateCohort(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Delete a cohort (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the cohort', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Cohort deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteCohort(id));
  }
}
