import { CurrentUser, HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { IUserResponse } from '@/modules/users/interfaces';
import { AbstractController } from '@/shared/abstracts';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateParticipation, UpdateParticipation, UpdateParticipationStatus } from '../commands';
import { CreateParticipationDto, UpdateParticipationDto, UpdateParticipationStatusDto } from '../dto';
import { Participation } from '../entities';
import { IFilterParticipations } from '../interfaces';
import {
  FindMyParticipations,
  FindOwnedParticipationById,
  FindParticipationById,
  FindParticipations
} from '../queries';

@Controller('participations')
export class ParticipationsController extends AbstractController {
  @Post()
  create(@CurrentUser() user: IUserResponse, @Body() dto: CreateParticipationDto): Promise<Participation> {
    return this.commandHandler.execute(new CreateParticipation(user.id, dto));
  }

  @Get('mine')
  findMine(
    @CurrentUser() user: IUserResponse,
    @Query() query: IFilterParticipations
  ): Promise<[Participation[], number]> {
    return this.queryHandler.execute(new FindMyParticipations(user.id, query));
  }

  @Get('mine/:id')
  findOneMine(@CurrentUser() user: IUserResponse, @Param('id') id: string): Promise<Participation> {
    return this.queryHandler.execute(new FindOwnedParticipationById(id, user.id));
  }

  @Get('staff')
  @HasRoles([Roles.STAFF])
  findForStaff(@Query() query: IFilterParticipations): Promise<[Participation[], number]> {
    return this.queryHandler.execute(new FindParticipations(query));
  }

  @Get('staff/:id')
  @HasRoles([Roles.STAFF])
  findOneForStaff(@Param('id') id: string): Promise<Participation> {
    return this.queryHandler.execute(new FindParticipationById(id));
  }

  @Patch(':id/status')
  @HasRoles([Roles.STAFF])
  updateStatus(@Param('id') id: string, @Body() dto: UpdateParticipationStatusDto): Promise<Participation> {
    return this.commandHandler.execute(new UpdateParticipationStatus(id, dto));
  }

  @Patch(':id')
  update(
    @CurrentUser() user: IUserResponse,
    @Param('id') id: string,
    @Body() dto: UpdateParticipationDto
  ): Promise<Participation> {
    return this.commandHandler.execute(new UpdateParticipation(user.id, id, dto));
  }
}
