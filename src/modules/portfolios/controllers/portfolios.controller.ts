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
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { HasRoles, Public } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { createDiskUploadOptions } from '@/shared/helpers';
import { CreatePortfolio, DeletePortfolio, UpdatePortfolio, UploadPortfolioLogo } from '../commands';
import { CreatePortfolioDto, FilterPortfoliosDto, PortfolioResponseDto, UpdatePortfolioDto } from '../dto';
import { Portfolio } from '../entities';
import { FindPortfolioById, FindPortfolios } from '../queries';

@ApiTags('portfolios')
@Controller('portfolios')
export class PortfoliosController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Create a new portfolio (Staff only)' })
  @ApiCreatedResponse({ description: 'Portfolio created', type: PortfolioResponseDto })
  create(@Body() dto: CreatePortfolioDto): Promise<Portfolio> {
    return this.commandHandler.execute(new CreatePortfolio(dto));
  }

  @Post(':id/logo')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Upload a portfolio logo (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the portfolio', format: 'uuid' })
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
  @ApiOkResponse({ description: 'Updated portfolio with the new logo', type: PortfolioResponseDto })
  @UseInterceptors(FileInterceptor('logo', createDiskUploadOptions('./uploads/portfolios')))
  uploadLogo(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<Portfolio> {
    return this.commandHandler.execute(new UploadPortfolioLogo(id, file));
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List portfolios with pagination and search' })
  @ApiOkResponse({
    description:
      'Paginated list of portfolios: `items` is the page, `count` is the total number of matching portfolios',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(PortfolioResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findAll(@Query() query: FilterPortfoliosDto): Promise<[Portfolio[], number]> {
    return this.queryHandler.execute(new FindPortfolios(query));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a portfolio by ID' })
  @ApiParam({ name: 'id', description: 'ID of the portfolio', format: 'uuid' })
  @ApiOkResponse({ description: 'Portfolio details', type: PortfolioResponseDto })
  findOne(@Param('id') id: string): Promise<Portfolio> {
    return this.queryHandler.execute(new FindPortfolioById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Update a portfolio (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the portfolio', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated portfolio', type: PortfolioResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdatePortfolioDto): Promise<Portfolio> {
    return this.commandHandler.execute(new UpdatePortfolio(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Delete a portfolio (Staff only)' })
  @ApiParam({ name: 'id', description: 'ID of the portfolio', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Portfolio deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeletePortfolio(id));
  }
}
