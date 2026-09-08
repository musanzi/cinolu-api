import { HasRoles } from '@/modules/auth/decorators';
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
import { CreateProgram, DeleteProgram, UpdateProgram, UploadProgramLogo } from '../commands';
import { CreateProgramDto, UpdateProgramDto } from '../dto';
import { Program } from '../entities';
import { IFilterPrograms } from '../interfaces';
import { FindProgramById, FindPrograms, FindProgramsByPortfolioSlug } from '../queries';

@Controller('programs')
export class ProgramsController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  create(@Body() dto: CreateProgramDto): Promise<Program> {
    return this.commandHandler.execute(new CreateProgram(dto));
  }

  @Post(':id/logo')
  @HasRoles([Roles.STAFF])
  @UseInterceptors(FileInterceptor('logo', createDiskUploadOptions('./uploads/programs')))
  uploadLogo(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Program> {
    return this.commandHandler.execute(new UploadProgramLogo(id, file));
  }

  @Get()
  findAll(@Query() query: IFilterPrograms): Promise<[Program[], number]> {
    return this.queryHandler.execute(new FindPrograms(query));
  }

  @Get('portfolio/:slug')
  findByPortfolioSlug(@Param('slug') slug: string): Promise<Program[]> {
    return this.queryHandler.execute(new FindProgramsByPortfolioSlug(slug));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Program> {
    return this.queryHandler.execute(new FindProgramById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  update(@Param('id') id: string, @Body() dto: UpdateProgramDto): Promise<Program> {
    return this.commandHandler.execute(new UpdateProgram(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteProgram(id));
  }
}
