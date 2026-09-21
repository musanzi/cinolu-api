import { CurrentUser, HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { IUserResponse } from '@/modules/users/interfaces';
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
import { CreateParticipation, DeleteParticipation, UpdateParticipation, UpdateParticipationStatus } from '../commands';
import {
  CreateParticipationDto,
  FilterParticipationsDto,
  ParticipationResponseDto,
  UpdateParticipationDto,
  UpdateParticipationStatusDto
} from '../dto';
import { Participation } from '../entities';
import { FindMyParticipations, FindParticipationById, FindParticipations } from '../queries';

@ApiTags('participations')
@Controller('participations')
export class ParticipationsController extends AbstractController {
  @Post()
  @ApiOperation({ summary: 'Create a participation' })
  @ApiCreatedResponse({ description: 'Participation created', type: ParticipationResponseDto })
  create(@CurrentUser() user: IUserResponse, @Body() dto: CreateParticipationDto): Promise<Participation> {
    return this.commandHandler.execute(new CreateParticipation(user.id, dto));
  }

  @Get('mine')
  @ApiOperation({ summary: 'List my participations' })
  @ApiOkResponse({
    description: 'Paginated list of the current user participations returned as a [items, count] tuple',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(ParticipationResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findMine(
    @CurrentUser() user: IUserResponse,
    @Query() query: FilterParticipationsDto
  ): Promise<[Participation[], number]> {
    return this.queryHandler.execute(new FindMyParticipations(user.id, query));
  }

  @Get('staff')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'List participations', description: 'Staff only.' })
  @ApiOkResponse({
    description: 'Paginated list of participations returned as a [items, count] tuple',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(ParticipationResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findForStaff(@Query() query: FilterParticipationsDto): Promise<[Participation[], number]> {
    return this.queryHandler.execute(new FindParticipations(query));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a participation by id' })
  @ApiParam({ name: 'id', description: 'Participation id', format: 'uuid' })
  @ApiOkResponse({ description: 'Participation details', type: ParticipationResponseDto })
  findOne(@Param('id') id: string): Promise<Participation> {
    return this.queryHandler.execute(new FindParticipationById(id));
  }

  @Patch(':id/status')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Update a participation status', description: 'Staff only.' })
  @ApiParam({ name: 'id', description: 'Participation id', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated participation', type: ParticipationResponseDto })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateParticipationStatusDto): Promise<Participation> {
    return this.commandHandler.execute(new UpdateParticipationStatus(id, dto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a participation' })
  @ApiParam({ name: 'id', description: 'Participation id', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated participation', type: ParticipationResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateParticipationDto): Promise<Participation> {
    return this.commandHandler.execute(new UpdateParticipation(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Delete a participation' })
  @ApiParam({ name: 'id', description: 'Participation id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'The participation has been deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteParticipation(id));
  }
}
