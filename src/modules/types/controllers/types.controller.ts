import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateType, DeleteType, UpdateType } from '../commands';
import { CreateTypeDto, UpdateTypeDto } from '../dto';
import { Type } from '../entities';
import { IFilterTypes } from '../interfaces';
import { FindTypeById, FindTypes } from '../queries';

@Controller('types')
export class TypesController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  create(@Body() dto: CreateTypeDto): Promise<Type> {
    return this.commandHandler.execute(new CreateType(dto));
  }

  @Get()
  findAll(@Query() query: IFilterTypes): Promise<[Type[], number]> {
    return this.queryHandler.execute(new FindTypes(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Type> {
    return this.queryHandler.execute(new FindTypeById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  update(@Param('id') id: string, @Body() dto: UpdateTypeDto): Promise<Type> {
    return this.commandHandler.execute(new UpdateType(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteType(id));
  }
}
