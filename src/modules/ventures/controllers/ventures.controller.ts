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
import { CreateVenture, DeleteVenture, UpdateVenture, UpdateVentureStatus, UploadVentureImage } from '../commands';
import {
  CreateVentureDto,
  FilterVenturesDto,
  UpdateVentureDto,
  UpdateVentureStatusDto,
  VentureResponseDto
} from '../dto';
import { Venture } from '../entities';
import { FindMyVentures, FindVentureById, FindVentures } from '../queries';

@ApiTags('ventures')
@Controller('ventures')
export class VenturesController extends AbstractController {
  @Post()
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Create a new venture' })
  @ApiCreatedResponse({ description: 'The venture has been created', type: VentureResponseDto })
  create(@CurrentUser() user: IUserResponse, @Body() dto: CreateVentureDto): Promise<Venture> {
    return this.commandHandler.execute(new CreateVenture(user.id, dto));
  }

  @Get('')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'List all ventures (paginated). Staff only.' })
  @ApiOkResponse({
    description: 'Paginated list of all ventures as a [items, count] tuple. Staff only.',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(VentureResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findAll(@Query() query: FilterVenturesDto): Promise<[Venture[], number]> {
    return this.queryHandler.execute(new FindVentures(query));
  }

  @Get('mine')
  @ApiSecurity('session')
  @ApiOperation({ summary: "List the current user's ventures (paginated)" })
  @ApiOkResponse({
    description: "Paginated list of the current user's ventures as a [items, count] tuple.",
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(VentureResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findMyVentures(@CurrentUser() user: IUserResponse, @Query() query: FilterVenturesDto): Promise<[Venture[], number]> {
    return this.queryHandler.execute(new FindMyVentures(user.id, query));
  }

  @Get(':id')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Get a venture by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'The venture', type: VentureResponseDto })
  findOne(@Param('id') id: string): Promise<Venture> {
    return this.queryHandler.execute(new FindVentureById(id));
  }

  @Patch(':id/status')
  @HasRoles([Roles.STAFF])
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Update a venture status. Staff only.' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'The venture with its updated status. Staff only.', type: VentureResponseDto })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateVentureStatusDto): Promise<Venture> {
    return this.commandHandler.execute(new UpdateVentureStatus(id, dto));
  }

  @Post(':id/logo')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Upload a venture logo' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: { type: 'string', format: 'binary' }
      }
    }
  })
  @ApiOkResponse({ description: 'The venture with its updated logo', type: VentureResponseDto })
  @UseInterceptors(FileInterceptor('logo', createDiskUploadOptions('./uploads/ventures')))
  uploadLogo(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Venture> {
    return this.commandHandler.execute(new UploadVentureImage(id, 'logo', file));
  }

  @Post(':id/cover')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Upload a venture cover image' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cover: { type: 'string', format: 'binary' }
      }
    }
  })
  @ApiOkResponse({ description: 'The venture with its updated cover image', type: VentureResponseDto })
  @UseInterceptors(FileInterceptor('cover', createDiskUploadOptions('./uploads/ventures')))
  uploadCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Venture> {
    return this.commandHandler.execute(new UploadVentureImage(id, 'cover', file));
  }

  @Patch(':id')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Update a venture' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'The updated venture', type: VentureResponseDto })
  update(
    @CurrentUser() user: IUserResponse,
    @Param('id') id: string,
    @Body() dto: UpdateVentureDto
  ): Promise<Venture> {
    return this.commandHandler.execute(new UpdateVenture(user.id, id, dto));
  }

  @Delete(':id')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Delete a venture' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'The venture has been deleted' })
  remove(@CurrentUser() user: IUserResponse, @Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteVenture(user.id, id));
  }
}
