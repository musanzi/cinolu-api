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
import { CreateVenture, DeleteVenture, UpdateVenture, UploadVentureImage } from '../commands';
import { CreateVentureDto, UpdateVentureDto } from '../dto';
import { Venture } from '../entities';
import { IFilterVentures } from '../interfaces';
import { FindMyVentures, FindOwnedVentureById, FindVentureById, FindVentures } from '../queries';

@Controller('ventures')
export class VenturesController extends AbstractController {
  @Post()
  create(@CurrentUser() user: IUserResponse, @Body() dto: CreateVentureDto): Promise<Venture> {
    return this.commandHandler.execute(new CreateVenture(user.id, dto));
  }

  @Get('mine')
  findMyVentures(@CurrentUser() user: IUserResponse, @Query() query: IFilterVentures): Promise<[Venture[], number]> {
    return this.queryHandler.execute(new FindMyVentures(user.id, query));
  }

  @Get('mine/:id')
  findMyVenture(@CurrentUser() user: IUserResponse, @Param('id') id: string): Promise<Venture> {
    return this.queryHandler.execute(new FindOwnedVentureById(id, user.id));
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

  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('logo', createDiskUploadOptions('./uploads/ventures')))
  uploadLogo(
    @CurrentUser() user: IUserResponse,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Venture> {
    return this.commandHandler.execute(new UploadVentureImage(user.id, id, 'logo', file));
  }

  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('cover', createDiskUploadOptions('./uploads/ventures')))
  uploadCover(
    @CurrentUser() user: IUserResponse,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Venture> {
    return this.commandHandler.execute(new UploadVentureImage(user.id, id, 'cover', file));
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
