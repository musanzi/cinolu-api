import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AbstractController } from '@/shared/abstracts';
import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { CreateProgram, DeleteProgram, UpdateProgram } from '../commands';
import { CreateProgramDto, UpdateProgramDto } from '../dto';
import { Program } from '../entities/program.entity';
import { IFilterPrograms } from '../interfaces';
import { FindProgramById, FindPrograms } from '../queries';

@Controller('programs')
export class ProgramsController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  create(@Body() dto: CreateProgramDto): Promise<Program> {
    return this.commandHandler.execute(new CreateProgram(dto));
  }

  @Get()
  findAll(@Query() query: IFilterPrograms): Promise<[Program[], number]> {
    return this.queryHandler.execute(new FindPrograms(query));
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
