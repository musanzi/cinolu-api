import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AbstractController } from '@/shared/abstracts';
import { CurrentUser } from '@/modules/auth/decorators';
import { IUserResponse } from '@/modules/users/interfaces';
import { DeleteParticipation, SaveParticipation, UpdateParticipation, UpdateParticipationStatus } from '../commands';
import { SaveParticipationDto, UpdateParticipationStatusDto } from '../dto';
import { ActivityParticipation } from '../entities/activity-participation.entity';
import { IFilterParticipations } from '../interfaces';
import {
  ExportParticipationsCsv,
  FindActivityParticipations,
  FindMyParticipations,
  FindParticipationById
} from '../queries';

@Controller('participations')
export class ParticipationsController extends AbstractController {
  @Post('activities/:activityId')
  create(
    @CurrentUser() actor: IUserResponse,
    @Param('activityId') activityId: string,
    @Body() dto: SaveParticipationDto
  ): Promise<ActivityParticipation> {
    return this.commandHandler.execute(new SaveParticipation(actor, activityId, dto));
  }

  @Get('mine')
  findMine(
    @CurrentUser() actor: IUserResponse,
    @Query() query: IFilterParticipations
  ): Promise<[ActivityParticipation[], number]> {
    return this.queryHandler.execute(new FindMyParticipations(actor.id, query));
  }

  @Get('activities/:activityId')
  findForActivity(
    @CurrentUser() actor: IUserResponse,
    @Param('activityId') activityId: string,
    @Query() query: IFilterParticipations
  ): Promise<[ActivityParticipation[], number]> {
    return this.queryHandler.execute(new FindActivityParticipations(actor, activityId, query));
  }

  @Get('activities/:activityId/export/csv')
  async exportCsv(
    @CurrentUser() actor: IUserResponse,
    @Param('activityId') activityId: string,
    @Query() query: IFilterParticipations,
    @Res() response: Response
  ): Promise<void> {
    await this.queryHandler.execute(new ExportParticipationsCsv(actor, activityId, query, response));
  }

  @Get(':id')
  findOne(@CurrentUser() actor: IUserResponse, @Param('id') id: string): Promise<ActivityParticipation> {
    return this.queryHandler.execute(new FindParticipationById(actor, id));
  }

  @Patch(':id')
  update(
    @CurrentUser() actor: IUserResponse,
    @Param('id') id: string,
    @Body() dto: SaveParticipationDto
  ): Promise<ActivityParticipation> {
    return this.commandHandler.execute(new UpdateParticipation(actor.id, id, dto));
  }

  @Delete(':id')
  remove(@CurrentUser() actor: IUserResponse, @Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteParticipation(actor, id));
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() actor: IUserResponse,
    @Param('id') id: string,
    @Body() dto: UpdateParticipationStatusDto
  ): Promise<ActivityParticipation> {
    return this.commandHandler.execute(new UpdateParticipationStatus(actor, id, dto));
  }
}
