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
import { AbstractController } from '@/shared/abstracts';
import { CreateRoleDto, FilterRolesDto, RoleResponseDto, UpdateRoleDto } from '../dto';
import { Role } from '../entities/role.entity';
import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { CreateRole, DeleteRole, UpdateRole } from '../commands';
import { FindRoleById, FindRoles } from '../queries';

@ApiTags('roles')
@Controller('roles')
export class RolesController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Create a new role (Staff only)' })
  @ApiCreatedResponse({ description: 'Role created', type: RoleResponseDto })
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.commandHandler.execute(new CreateRole(dto));
  }

  @Get()
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'List roles with pagination and search (Staff only)' })
  @ApiOkResponse({
    description: 'Paginated list of roles: `items` is the page, `count` is the total number of matching roles',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(RoleResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findAll(@Query() query: FilterRolesDto): Promise<[Role[], number]> {
    return this.queryHandler.execute(new FindRoles(query));
  }

  @Get(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Get a role by ID (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the role', format: 'uuid' })
  @ApiOkResponse({ description: 'Role with the given ID', type: RoleResponseDto })
  findOne(@Param('id') id: string): Promise<Role> {
    return this.queryHandler.execute(new FindRoleById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Update a role (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the role', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated role', type: RoleResponseDto })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.commandHandler.execute(new UpdateRole(id, updateRoleDto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Delete a role (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the role', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Role deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteRole(id));
  }
}
