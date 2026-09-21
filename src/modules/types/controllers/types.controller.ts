import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { CreateType, DeleteType, UpdateType } from '../commands';
import { CreateTypeDto, FilterTypesDto, TypeResponseDto, UpdateTypeDto } from '../dto';
import { Type } from '../entities';
import { FindTypeById, FindTypes } from '../queries';

@ApiTags('types')
@Controller('types')
export class TypesController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Create an activity type. Staff only.' })
  @ApiCreatedResponse({ description: 'Activity type created', type: TypeResponseDto })
  create(@Body() dto: CreateTypeDto): Promise<Type> {
    return this.commandHandler.execute(new CreateType(dto));
  }

  @Get()
  @ApiSecurity('session')
  @ApiOperation({ summary: 'List activity types' })
  @ApiOkResponse({
    description: 'Paginated activity types: the items array and the total count',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(TypeResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findAll(@Query() query: FilterTypesDto): Promise<[Type[], number]> {
    return this.queryHandler.execute(new FindTypes(query));
  }

  @Get(':id')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Get an activity type by id' })
  @ApiParam({ name: 'id', description: 'Type id (UUID)' })
  @ApiOkResponse({ description: 'Activity type', type: TypeResponseDto })
  findOne(@Param('id') id: string): Promise<Type> {
    return this.queryHandler.execute(new FindTypeById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Update an activity type. Staff only.' })
  @ApiParam({ name: 'id', description: 'Type id (UUID)' })
  @ApiOkResponse({ description: 'Updated activity type', type: TypeResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateTypeDto): Promise<Type> {
    return this.commandHandler.execute(new UpdateType(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Delete an activity type. Staff only.' })
  @ApiParam({ name: 'id', description: 'Type id (UUID)' })
  @ApiNoContentResponse({ description: 'Activity type deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteType(id));
  }
}
