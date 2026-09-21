import { HasRoles, Public } from '@/modules/auth/decorators';
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
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { CreateProgram, DeleteProgram, UpdateProgram, UploadProgramLogo } from '../commands';
import { CreateProgramDto, FilterProgramsDto, ProgramResponseDto, UpdateProgramDto } from '../dto';
import { Program } from '../entities';
import { FindProgramById, FindPrograms, FindRecentPrograms } from '../queries';

@ApiTags('programs')
@Controller('programs')
export class ProgramsController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Create a new program (Staff only)' })
  @ApiCreatedResponse({ description: 'Program created', type: ProgramResponseDto })
  create(@Body() dto: CreateProgramDto): Promise<Program> {
    return this.commandHandler.execute(new CreateProgram(dto));
  }

  @Get('recent')
  @Public()
  @ApiOperation({ summary: 'List the 5 most recent programs' })
  @ApiOkResponse({ description: 'List of the 5 most recent programs', type: [ProgramResponseDto] })
  findRecent(): Promise<Program[]> {
    return this.queryHandler.execute(new FindRecentPrograms());
  }

  @Post(':id/logo')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Upload a program logo (Staff only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: { type: 'string', format: 'binary' }
      },
      required: ['logo']
    }
  })
  @ApiParam({ name: 'id', description: 'ID of the program', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated program with the new logo', type: ProgramResponseDto })
  @UseInterceptors(FileInterceptor('logo', createDiskUploadOptions('./uploads/programs')))
  uploadLogo(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Program> {
    return this.commandHandler.execute(new UploadProgramLogo(id, file));
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List programs with pagination, search and filters' })
  @ApiOkResponse({
    description: 'Paginated list of programs: `items` is the page, `count` is the total number of matching programs',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(ProgramResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findAll(@Query() query: FilterProgramsDto): Promise<[Program[], number]> {
    return this.queryHandler.execute(new FindPrograms(query));
  }

  @Get(':id')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Get a program by ID' })
  @ApiParam({ name: 'id', description: 'ID of the program', format: 'uuid' })
  @ApiOkResponse({ description: 'Program with the given ID', type: ProgramResponseDto })
  findOne(@Param('id') id: string): Promise<Program> {
    return this.queryHandler.execute(new FindProgramById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Update a program (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the program', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated program', type: ProgramResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateProgramDto): Promise<Program> {
    return this.commandHandler.execute(new UpdateProgram(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Delete a program (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the program', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Program deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteProgram(id));
  }
}
