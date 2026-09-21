import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { AbstractController } from '@/shared/abstracts';
import { createCsvUploadOptions } from '@/shared/helpers';
import { CreateUserDto, FilterUsersDto, UpdateUserDto, UserResponseDto } from '../dto';
import { IUserResponse } from '../interfaces';
import { User } from '../entities/user.entity';
import { CurrentUser, HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { createDiskUploadOptions } from '@/shared/helpers';
import { Response } from 'express';
import { CreateUser, DeleteUser, ImportUsersCsv, UpdateUser, UploadUserAvatar } from '../commands';
import { ExportUsersCsv, FindMentors, FindStaff, FindUserByEmail, FindUsers } from '../queries';

@ApiTags('users')
@Controller('users')
export class UsersController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Create a new user (Staff only)' })
  @ApiCreatedResponse({ description: 'User created', type: UserResponseDto })
  create(@Body() dto: CreateUserDto): Promise<IUserResponse> {
    return this.commandHandler.execute(new CreateUser(dto));
  }

  @Get()
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'List users with pagination and search (Staff only)' })
  @ApiOkResponse({
    description: 'Paginated list of users: `items` is the page, `count` is the total number of matching users',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(UserResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findAll(@Query() query: FilterUsersDto): Promise<[IUserResponse[], number]> {
    return this.queryHandler.execute(new FindUsers(query));
  }

  @Get('staff')
  @ApiOperation({ summary: 'List all staff users' })
  @ApiOkResponse({ description: 'List of staff users', type: [UserResponseDto] })
  findStaff(): Promise<IUserResponse[]> {
    return this.queryHandler.execute(new FindStaff());
  }

  @Get('mentors')
  @ApiOperation({ summary: 'List all mentor users' })
  @ApiOkResponse({ description: 'List of mentor users', type: [UserResponseDto] })
  findMentors(): Promise<IUserResponse[]> {
    return this.queryHandler.execute(new FindMentors());
  }

  @Post('import/csv')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Import users from a CSV file (Staff only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' }
      },
      required: ['file']
    }
  })
  @ApiNoContentResponse({ description: 'Users imported from the CSV file' })
  @UseInterceptors(FileInterceptor('file', createCsvUploadOptions()))
  importCsv(@UploadedFile() file: Express.Multer.File): Promise<void> {
    return this.commandHandler.execute(new ImportUsersCsv(file));
  }

  @Get('export/csv')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Export users as a CSV file (Staff only)' })
  @ApiProduces('text/csv')
  @ApiOkResponse({
    description: 'CSV file of users (Name, Email)',
    content: { 'text/csv': { schema: { type: 'string', format: 'binary' } } }
  })
  async exportCSV(@Query() query: FilterUsersDto, @Res() res: Response): Promise<void> {
    await this.queryHandler.execute(new ExportUsersCsv(query, res));
  }

  @Post('profile/avatar')
  @ApiOperation({ summary: 'Upload the current user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary' }
      },
      required: ['avatar']
    }
  })
  @ApiOkResponse({ description: 'Updated user profile with the new avatar', type: UserResponseDto })
  @UseInterceptors(FileInterceptor('avatar', createDiskUploadOptions('./uploads/profiles')))
  uploadImage(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File): Promise<IUserResponse> {
    return this.commandHandler.execute(new UploadUserAvatar(user.id, file));
  }

  @Get(':email')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Get a user by email (Staff only)' })
  @ApiParam({ name: 'email', description: 'Email address of the user', example: 'jane.doe@example.com' })
  @ApiOkResponse({ description: 'User with the given email', type: UserResponseDto })
  findOneByEmail(@Param('email') email: string): Promise<IUserResponse> {
    return this.queryHandler.execute(new FindUserByEmail(email));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Update a user (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the user', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated user', type: UserResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<IUserResponse> {
    return this.commandHandler.execute(new UpdateUser(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Delete a user (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the user', format: 'uuid' })
  @ApiNoContentResponse({ description: 'User deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteUser(id));
  }
}
