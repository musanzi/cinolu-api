import { CurrentUser, HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { IUserResponse } from '@/modules/users/interfaces';
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
import { CreateVenture, DeleteVenture, UpdateVenture, UpdateVentureStatus, UploadVentureImage } from '../commands';
import { CreateVentureDto, UpdateVentureDto, UpdateVentureStatusDto } from '../dto';
import { Venture } from '../entities';
import { IFilterVentures } from '../interfaces';
import { FindMyVentures, FindVentureById, FindVentures } from '../queries';

@Controller('ventures')
export class VenturesController extends AbstractController {
  @Post()
  create(@CurrentUser() user: IUserResponse, @Body() dto: CreateVentureDto): Promise<Venture> {
    return this.commandHandler.execute(new CreateVenture(user.id, dto));
  }

  @Get('')
  @HasRoles([Roles.STAFF])
  findAll(@Query() query: IFilterVentures): Promise<[Venture[], number]> {
    return this.queryHandler.execute(new FindVentures(query));
  }

  @Get('mine')
  findMyVentures(@CurrentUser() user: IUserResponse, @Query() query: IFilterVentures): Promise<[Venture[], number]> {
    return this.queryHandler.execute(new FindMyVentures(user.id, query));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Venture> {
    return this.queryHandler.execute(new FindVentureById(id));
  }

  @Patch(':id/status')
  @HasRoles([Roles.STAFF])
  updateStatus(@Param('id') id: string, @Body() dto: UpdateVentureStatusDto): Promise<Venture> {
    return this.commandHandler.execute(new UpdateVentureStatus(id, dto));
  }

  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('logo', createDiskUploadOptions('./uploads/ventures')))
  uploadLogo(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Venture> {
    return this.commandHandler.execute(new UploadVentureImage(id, 'logo', file));
  }

  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('cover', createDiskUploadOptions('./uploads/ventures')))
  uploadCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Venture> {
    return this.commandHandler.execute(new UploadVentureImage(id, 'cover', file));
  }

  @Patch(':id')
  update(@CurrentUser() user: IUserResponse, @Param('id') id: string, @Body() dto: UpdateVentureDto): Promise<Venture> {
    return this.commandHandler.execute(new UpdateVenture(user.id, id, dto));
  }

  @Delete(':id')
  remove(@CurrentUser() user: IUserResponse, @Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteVenture(user.id, id));
  }
}
