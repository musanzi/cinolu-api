import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser, HasRoles, Public } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { IUserResponse } from '@/modules/users/interfaces';
import { AbstractController } from '@/shared/abstracts';
import { CreateVenture, DeleteVenture, UpdateVenture, UpdateVentureStatus } from '../commands';
import { CreateVentureDto, UpdateVentureDto, UpdateVentureStatusDto } from '../dto';
import { Venture } from '../entities';
import { IFilterVentures } from '../interfaces';
import {
  FindMyVentures,
  FindPublishedVentureBySlug,
  FindPublishedVentures,
  FindVentureById,
  FindVentures
} from '../queries';

@Controller('ventures')
export class VenturesController extends AbstractController {
  @Post()
  create(@CurrentUser() actor: IUserResponse, @Body() dto: CreateVentureDto): Promise<Venture> {
    return this.commandHandler.execute(new CreateVenture(actor.id, dto));
  }

  @Get()
  @Public()
  findPublished(@Query() query: IFilterVentures): Promise<[Venture[], number]> {
    return this.queryHandler.execute(new FindPublishedVentures(query));
  }

  @Get('mine')
  findMine(@CurrentUser() actor: IUserResponse, @Query() query: IFilterVentures): Promise<[Venture[], number]> {
    return this.queryHandler.execute(new FindMyVentures(actor.id, query));
  }

  @Get('staff')
  @HasRoles([Roles.STAFF])
  findForStaff(@Query() query: IFilterVentures): Promise<[Venture[], number]> {
    return this.queryHandler.execute(new FindVentures(query));
  }

  @Get('staff/:id')
  @HasRoles([Roles.STAFF])
  findOneForStaff(@Param('id') id: string): Promise<Venture> {
    return this.queryHandler.execute(new FindVentureById(id));
  }

  @Patch(':id/status')
  @HasRoles([Roles.STAFF])
  updateStatus(@Param('id') id: string, @Body() dto: UpdateVentureStatusDto): Promise<Venture> {
    return this.commandHandler.execute(new UpdateVentureStatus(id, dto));
  }

  @Patch(':id')
  update(
    @CurrentUser() actor: IUserResponse,
    @Param('id') id: string,
    @Body() dto: UpdateVentureDto
  ): Promise<Venture> {
    return this.commandHandler.execute(new UpdateVenture(actor.id, id, dto));
  }

  @Delete(':id')
  remove(@CurrentUser() actor: IUserResponse, @Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteVenture(actor.id, id));
  }

  @Get(':slug')
  @Public()
  findOnePublished(@Param('slug') slug: string): Promise<Venture> {
    return this.queryHandler.execute(new FindPublishedVentureBySlug(slug));
  }
}
